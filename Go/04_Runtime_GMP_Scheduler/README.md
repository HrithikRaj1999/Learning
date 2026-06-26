# Module 4: The Go Runtime and the GMP Scheduler

> **Goal:** Explain how millions of goroutines run on a handful of OS threads, how syscalls and work-stealing keep cores busy, and how the concurrent tri-color GC reclaims memory with sub-millisecond pauses.

---

## 1. Core Concept & The Py-Go Bridge

### G, M, P

The scheduler is an **M:N** model — M goroutines multiplexed onto N OS threads:

- **G (Goroutine)** — a unit of work + its **stack (starts ~2KB, grows/shrinks dynamically)**, program counter, status. Cheap to create.
- **M (Machine)** — an **OS thread**. The thing the kernel actually schedules onto a CPU. Creating M's is expensive.
- **P (Processor)** — a **logical processor / scheduling context**. Holds a **local run queue** of runnable G's. The count of P's = **`GOMAXPROCS`** (default = number of CPU cores). **A goroutine can only run when its M holds a P.** P is the permit to execute Go code.

So: an **M** must acquire a **P** to run a **G**. `GOMAXPROCS` P's bound how many goroutines run Go code *truly in parallel*.

### Run Queues + Work-Stealing

Each P has a **local run queue** (LIFO-ish, lock-free fast path). There's also a **global run queue**. When a P empties its local queue, it doesn't idle — it **steals** half the G's from another P's queue (work-stealing), or pulls from the global queue / netpoller. This keeps all cores busy and balances load without central locking.

### Syscall / Blocking Handling (handoff)

When a G makes a **blocking syscall** (e.g. file read), its M blocks in the kernel. The runtime **detaches the P from that M** and hands the P to another M (spinning up or reusing one) so the remaining G's keep running. When the syscall returns, the original M tries to reacquire a P; if none free, its G goes to the global queue and the M parks. This is why blocking I/O doesn't stall your whole program.

For **network I/O**, Go uses a **netpoller** (epoll/kqueue/IOCP): the G is parked, the fd registered, and the G is rescheduled when the fd is ready — no M is wasted blocking.

**Goroutine preemption:** since Go 1.14, the scheduler can **asynchronously preempt** a long-running G (signal-based) so a CPU-bound loop can't starve others. Pre-1.14 it relied on cooperative checkpoints at function calls.

### Concurrent Tri-Color Mark-and-Sweep GC

Go's GC is a **concurrent, non-generational, tri-color mark-and-sweep** collector tuned for **low pause** (typically <1ms), not max throughput:

- **White** = candidate for collection. **Grey** = reachable, not yet scanned. **Black** = reachable, scanned.
- Start: roots (stacks, globals) → grey. Repeatedly: take grey, blacken it, grey its referents. When no grey remain, all white are garbage → swept.
- Runs **concurrently** with your program. A **write barrier** catches pointer mutations during marking so live objects aren't wrongly collected.
- Triggered by heap growth (`GOGC`, default 100 = collect when heap doubles since last GC). `GOMEMLIMIT` sets a soft memory ceiling.
- Two brief **stop-the-world** points (start/end of mark) measured in microseconds.

### The Py-Go Bridge

| Concept | Python / JS | Go |
|---------|-------------|-----|
| Parallel execution | CPython **GIL** → one thread runs bytecode at a time; JS single-threaded | M:N scheduler, **true multi-core parallelism** (GOMAXPROCS P's) |
| Scheduling | OS schedules heavy threads; asyncio event loop schedules coroutines | Runtime schedules G's onto M's via P's (user-space, cheap) |
| Blocking I/O | blocks the thread; asyncio needs `await` everywhere | runtime detaches P / uses netpoller — blocking call doesn't stall others |
| Stack | fixed large thread stacks (~8MB) | goroutine stack starts ~2KB, **grows dynamically** |
| GC | CPython **reference counting** + cycle collector | concurrent tri-color **mark-sweep**, no refcount, low pause |
| Tuning | limited | `GOMAXPROCS`, `GOGC`, `GOMEMLIMIT` |

**Key mental shift:** Python's GIL means more threads ≠ more CPU throughput. Go has no GIL — `GOMAXPROCS` goroutines genuinely run on separate cores, and blocking syscalls are transparently worked around by the scheduler.

---

## 2. Interview Hotspots & Traps

- **"How many goroutines run in parallel?"** → at most `GOMAXPROCS` (one per P). Concurrency (many) ≠ parallelism (GOMAXPROCS).
- **What is a P, really?** The execution permit + local run queue. Common follow-up: why not just G→M? (Answer: P enables lock-free local queues and clean syscall handoff.)
- **Goroutine stack growth:** starts ~2KB, **copied** to a bigger contiguous block when it overflows (stack copying relocates the stack — that's why you can't rely on stack addresses). Shrinks too.
- **Does a blocking syscall block all goroutines?** No — P is handed to another M. But a *very* high count of simultaneous blocking syscalls can exhaust threads.
- **Setting `GOMAXPROCS=1`** — still concurrent, not parallel; interleaving via preemption. Often a trick: "is concurrency still possible?" Yes.
- **GC trap — generational?** No, Go GC is **non-generational**. Don't say "young/old gen."
- **Write barrier purpose:** prevent a black object from pointing to a white object that's no longer reachable from grey → correctness during concurrent marking.
- **`GOGC` semantics:** `GOGC=100` (default) → GC when heap doubles. `GOGC=off` disables. Lower GOGC = more frequent GC, lower memory, more CPU.
- **`runtime.Gosched()`** yields the P voluntarily. `runtime.GC()` forces a blocking GC (tests only).
- **Stop-the-world:** how long? Microseconds, twice per cycle — not the whole collection.
- **Goroutine ≠ thread:** creating 1M goroutines is fine; creating 1M OS threads is not.
- **CPU-bound tight loop with no function calls** could starve the scheduler pre-1.14; async preemption fixed it. Know the version.

---

## 3. Production Scenario

**The latency-cliff API gateway.** A Go gateway proxies requests and does CPU-heavy JSON transformation. Two runtime-level incidents:

1. **GC death spiral:** the transform allocates millions of short-lived maps/slices per second. Heap grows fast, `GOGC=100` triggers GC constantly, mark-assist steals CPU from request handlers, p99 latency jumps from 5ms to 800ms. Container has 4GB but GC thrashes well below it. Mitigations: cut allocations (Module 1/3 pooling), raise `GOGC`, set `GOMEMLIMIT` so GC paces to the real ceiling.

2. **Thread explosion from blocking calls:** a dependency uses **cgo** + blocking syscalls per request. Under load, the scheduler keeps spawning M's to cover detached P's → thousands of OS threads → kernel scheduling overhead + memory per thread stack → node instability. Needs bounded concurrency on the blocking path.

3. **GOMAXPROCS-in-container mismatch:** running on an 8-core node but the container is CPU-limited to 2 cores; Go sees 8, sets `GOMAXPROCS=8`, oversubscribes → context-switch thrash. Fix: set `GOMAXPROCS` to the cgroup limit (or use automaxprocs-style logic).

---

## 4. Hands-On Coding Challenge (No Solutions)

**Problem: `ScheduledLimiter`** — a parallelism-bounded compute runner with GC-aware behavior.

Build a runner that executes CPU-bound tasks with parallelism capped to the real core budget, reuses buffers to minimize GC pressure, and exposes runtime stats so its behavior can be measured.

**Input / API:**
```go
package limiter

type Stats struct {
    NumGoroutine int
    HeapAllocMB  float64
    NumGC        uint32
    GOMAXPROCS   int
}

type Limiter struct {
    // TODO
}

// New caps active parallelism to `maxParallel` (should default to a
// sensible value derived from GOMAXPROCS if maxParallel <= 0).
func New(maxParallel int) *Limiter { return nil /* TODO */ }

// Run executes fn with bounded parallelism. Blocks if the parallelism
// budget is exhausted. Must be safe for concurrent callers.
func (l *Limiter) Run(fn func()) { /* TODO */ }

// Snapshot returns current runtime stats (use runtime.ReadMemStats / NumGoroutine).
func (l *Limiter) Snapshot() Stats { return Stats{} /* TODO */ }
```

**Constraints:**
- At any instant, **no more than `maxParallel`** `fn`'s execute concurrently (enforce with a semaphore channel or weighted mechanism).
- Never spawn unbounded goroutines; the active goroutine count must stay bounded regardless of how fast `Run` is called.
- `Snapshot` must read live runtime metrics, not cached guesses.
- Must respect a `GOMAXPROCS` override read at construction.
- Race-clean under `-race`.

**Edge cases:** `maxParallel` larger than available cores; `Run` called from inside `fn`; thousands of rapid `Run` calls (backpressure must hold the goroutine count flat).

---

## 5. System Diagnostics & Testing Task

1. **Prove parallelism is bounded:** Add an atomic counter incremented at `fn` entry, decremented at exit; record its max. Assert max ≤ `maxParallel`. Run with `GOMAXPROCS=1`, `2`, `8` via env and compare wall-clock for a CPU-bound workload.

2. **Scheduler trace:**
   ```bash
   GODEBUG=schedtrace=500,scheddetail=1 go test -run TestThroughput ./limiter
   ```
   Read the output: number of P's, M's, run-queue lengths, goroutines in syscall. Explain what changes as you raise `maxParallel`.

3. **GC behavior:**
   ```bash
   GODEBUG=gctrace=1 go test -run TestAllocHeavy ./limiter
   ```
   Capture GC frequency and pause times. Re-run with `GOGC=400` and with `GOMEMLIMIT=256MiB`. Tabulate NumGC vs heap size vs pause.

4. **Execution tracer (visual):**
   ```bash
   go test -run TestThroughput -trace=trace.out ./limiter
   go tool trace trace.out
   ```
   Inspect goroutine analysis + scheduler latency. Identify time spent runnable-but-not-running (scheduling latency).

5. **CPU profile of the GC-vs-work split:**
   ```bash
   go test -bench=BenchmarkRun -cpuprofile=cpu.prof ./limiter
   go tool pprof -http=:8080 cpu.prof
   ```
   Show the fraction of CPU in `runtime.gcBgMarkWorker` / mark-assist. Reduce it by pooling and re-measure.

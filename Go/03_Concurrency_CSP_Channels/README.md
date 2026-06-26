# Module 3: Concurrency, the CSP Model, and Channel Mechanics

> **Goal:** Internalize "share memory by communicating," the `hchan` machinery, every channel panic rule, and when to reach for Mutex/RWMutex/WaitGroup/Pool instead of a channel.

---

## 1. Core Concept & The Py-Go Bridge

### CSP — Communicating Sequential Processes

Go's model: independent processes (goroutines) coordinate by **passing messages over channels**, not by sharing memory under locks. Slogan: *"Don't communicate by sharing memory; share memory by communicating."* Channels are the synchronization primitive — sending/receiving is also a happens-before edge.

### A Goroutine

A goroutine is a function launched with `go f()`. It's not an OS thread — it starts with a **~2KB growable stack** and is multiplexed onto OS threads by the runtime (Module 4). You can run **hundreds of thousands** cheaply.

### Channel Internals — `hchan`

A channel is a pointer to an `hchan` struct:

```
hchan {
    qcount   uint    // # items in buffer now
    dataqsiz uint     // buffer capacity
    buf      ptr      // ring buffer (buffered chans)
    sendx    uint     // send index into ring
    recvx    uint     // recv index into ring
    recvq    waitq    // goroutines blocked on recv (FIFO)
    sendq    waitq    // goroutines blocked on send (FIFO)
    lock     mutex    // guards all fields
}
```

- **Unbuffered** (`make(chan T)`): send blocks until a receiver is ready → direct hand-off (rendezvous).
- **Buffered** (`make(chan T, n)`): send blocks only when buffer full; recv blocks only when empty.
- Blocked senders/receivers park in `sendq`/`recvq`; the runtime wakes them when a counterpart arrives. A direct send→recv hand-off can copy value straight into the receiver's stack slot, skipping the buffer.

### Channel State Rules (memorize)

| Operation | nil chan | open chan | closed chan |
|-----------|----------|-----------|-------------|
| send | blocks forever | ok / blocks if full | **panic** |
| receive | blocks forever | ok / blocks if empty | returns zero + `ok=false` immediately |
| close | **panic** | ok | **panic** (double close) |

- `close()` is for the **sender** to signal "no more values." Receivers detect via `v, ok := <-ch`.
- Closing a channel **broadcasts** to all blocked receivers (good for fan-out shutdown).

### The sync Toolbox

- **`sync.Mutex`** — mutual exclusion; one holder. `Lock`/`Unlock`. Not reentrant.
- **`sync.RWMutex`** — many readers OR one writer. Use only when reads vastly outnumber writes; otherwise the bookkeeping overhead loses to a plain Mutex.
- **`sync.WaitGroup`** — wait for N goroutines to finish: `Add(n)` before launching, `Done()` in each, `Wait()` to join.
- **`sync.Pool`** — per-P free list of reusable objects to cut allocation/GC pressure. Objects may vanish on GC; never assume an item is still there.

### The Py-Go Bridge

| Concept | Python / JS | Go |
|---------|-------------|-----|
| Concurrency engine | asyncio event loop / single-thread JS loop; threads exist but Python GIL serializes bytecode | Native M:N scheduler, **true parallelism** across cores |
| Unit | coroutine / Promise / Thread (heavy) | goroutine (~2KB, cheap) |
| Coordination | `await`, `asyncio.Queue`, `threading.Lock` | channels (CSP), `sync.Mutex`, `WaitGroup` |
| Parallelism reality | GIL → CPU-bound threads don't scale | goroutines run on multiple OS threads simultaneously |
| Memory model | shared heap + GIL hides many races | shared heap, **no GIL** → real races; channels/locks give happens-before |
| Backpressure | bounded `asyncio.Queue` | buffered channel capacity |

**Key mental shift:** Python leans on the GIL to paper over data races. Go gives you real parallelism *and* real races — you must enforce ordering yourself with channels or locks, and the `-race` detector is your safety net.

---

## 2. Interview Hotspots & Traps

- **Send on closed channel → panic.** Receive on closed → zero value + `ok=false`, never blocks. Know the asymmetry.
- **Double close → panic.** Closing a nil channel → panic. Who should close? The **sender**, never the receiver, and only once.
- **Send/recv on nil channel blocks forever** — used deliberately to disable a `select` case.
- **The loop-variable capture bug** (pre-Go 1.22): `for _, v := range items { go func(){ use(v) }() }` — all goroutines saw the last `v`. Know the fix (pass as arg / shadow) and that Go 1.22+ changed loop var scoping.
- **Goroutine leak via unbuffered channel:** a goroutine blocked forever on a send nobody receives → leaks until process exit. Common with abandoned producers.
- **`WaitGroup.Add` after `go`** (race) — call `Add` *before* launching. Reusing a WaitGroup before `Wait` returns → panic.
- **`select` with no ready case and no `default` blocks**; with `default` it's non-blocking. Empty `select{}` blocks forever.
- **Mutex copied by value** = two separate locks = broken mutual exclusion. `go vet` catches this. Never copy a struct containing a Mutex.
- **`sync.Pool` is not a cache** — entries are cleared on GC; don't store things you need to persist.
- **RWMutex writer starvation** under heavy read load. When does RWMutex *lose* to Mutex? (short critical sections — overhead dominates.)
- **Deadlock detection:** `fatal error: all goroutines are asleep - deadlock!` — when does the runtime detect it (all G blocked) vs not (one G spinning)?
- **Unbuffered vs buffered semantics:** unbuffered send guarantees a receiver took it; buffered send only guarantees it's queued.

---

## 3. Production Scenario

**The image-thumbnail service meltdown.** A service accepts upload bursts and resizes images. Two failure modes hit at once:

1. **Unbounded goroutine spawn:** code does `go resize(img)` per request. A traffic spike spawns 200k goroutines, each allocating a multi-MB pixel buffer → heap explodes → OOM kill. Needs a **bounded worker pool** (fixed goroutines pulling from a buffered channel) for backpressure.

2. **Allocation churn:** each resize allocates and discards a large `[]byte` scratch buffer 10k times/sec → GC runs constantly, CPU pinned in mark/sweep, p99 latency spikes. A `sync.Pool` of scratch buffers cuts allocations ~90%.

3. **Shutdown corruption:** on deploy, the producer closes the job channel, but a worker also tries to `close` it → `panic: close of closed channel`, and an in-flight `send` after close panics another goroutine. Needs correct close ownership + WaitGroup-based drain.

---

## 4. Hands-On Coding Challenge (No Solutions)

**Problem: `BoundedPool`** — a graceful, leak-free, backpressured worker pool.

Implement a fixed-size worker pool that processes jobs with bounded concurrency, reuses scratch buffers via a pool, and shuts down cleanly without panics or leaks.

**Input / API:**
```go
package boundedpool

type Job struct {
    ID   int
    Data []byte
}

type Result struct {
    ID  int
    Out []byte
    Err error
}

type Pool struct {
    // TODO
}

// New builds a pool with `workers` goroutines and a job queue of capacity `queueSize`.
func New(workers, queueSize int, process func(scratch, in []byte) ([]byte, error)) *Pool {
    return nil // TODO
}

// Submit enqueues a job. Must block (backpressure) when the queue is full,
// and return an error if the pool is shutting down.
func (p *Pool) Submit(j Job) error { return nil /* TODO */ }

// Results returns a receive-only channel of results.
func (p *Pool) Results() <-chan Result { return nil /* TODO */ }

// Shutdown stops accepting jobs, drains in-flight work, and returns
// after all workers exit. Idempotent — safe to call twice.
func (p *Pool) Shutdown() { /* TODO */ }
```

**Constraints:**
- Exactly `workers` goroutines do processing — **no per-job goroutine spawn**.
- A `scratch` buffer must be **reused** via `sync.Pool` and passed to `process`. Reset it between jobs.
- **Zero goroutine leaks:** after `Shutdown`, no goroutine from the pool remains. Prove it.
- **Zero panics:** correct channel close ownership (only one closer, exactly once). `Submit` after `Shutdown` returns an error, never panics.
- **Race-clean** under `-race` with concurrent `Submit` from many goroutines.
- `Shutdown` is idempotent.

**Edge cases:** `Submit` racing with `Shutdown`; full queue; `process` panicking on a job; `queueSize == 0` (unbuffered).

---

## 5. System Diagnostics & Testing Task

1. **Race detector (mandatory):**
   ```bash
   go test -race -run TestConcurrentSubmit ./boundedpool
   ```
   100 goroutines submitting while one calls `Shutdown`. Must be clean.

2. **Goroutine-leak test:** Record `runtime.NumGoroutine()` before `New`, after warm-up, and after `Shutdown` + a short settle. Assert it returns to baseline. Optionally use `go.uber.org/goleak`-style manual check (no dep): dump stacks with `pprof.Lookup("goroutine").WriteTo(os.Stdout, 1)` if the count is wrong.

3. **Pool effectiveness benchmark:**
   ```bash
   go test -bench=BenchmarkProcess -benchmem ./boundedpool
   ```
   Compare two `process` variants — one allocating a fresh scratch buffer each call, one using the pooled buffer. Report the drop in `allocs/op` and `B/op`.

4. **Contention profile:** Add a Mutex-guarded counter variant and a channel-based variant. Profile lock contention:
   ```bash
   go test -bench=. -mutexprofile=mutex.prof ./boundedpool
   go tool pprof mutex.prof
   ```
   Identify the hottest contended lock.

5. **Scheduler view under load:**
   ```bash
   GODEBUG=schedtrace=1000 go test -run TestThroughput ./boundedpool
   ```
   Observe runnable-goroutine queue depth as backpressure kicks in.

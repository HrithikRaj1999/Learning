# Module 5: Context Propagation and Production Diagnostics

> **Goal:** Wire cancellation/timeouts/deadlines through an entire call tree, understand exactly when `defer` arguments are evaluated and when defers run, and hunt down goroutine + memory leaks with native tooling.

---

## 1. Core Concept & The Py-Go Bridge

### `context.Context` — Tree-Based Cancellation

`context.Context` carries a **cancellation signal**, a **deadline**, and **request-scoped values** down a call tree. It's the standard way to say "stop this work" across API/goroutine boundaries.

```go
ctx, cancel := context.WithCancel(context.Background())
ctx, cancel := context.WithTimeout(parent, 2*time.Second)
ctx, cancel := context.WithDeadline(parent, t)
defer cancel() // ALWAYS — releases resources / timer
```

- Contexts form a **tree**: cancelling a parent cancels **all descendants**. Cancelling a child does not affect the parent.
- `ctx.Done()` returns a channel **closed** on cancellation/timeout. Select on it.
- `ctx.Err()` tells you why: `context.Canceled` or `context.DeadlineExceeded`.
- Pass `ctx` as the **first parameter** (`func F(ctx context.Context, ...)`). Never store it in a struct (with rare exceptions).
- `context.WithValue` is for request-scoped data (trace IDs), **not** for passing optional function args.

### `defer` — Scheduling and Argument Evaluation

`defer` schedules a call to run when the **surrounding function returns** (normal return or panic). Two rules that trip everyone:

1. **Arguments are evaluated immediately**, at the `defer` statement — not when the deferred call runs.
   ```go
   x := 1
   defer fmt.Println(x) // captures 1 NOW
   x = 2                // deferred call still prints 1
   ```
2. Multiple defers run **LIFO** (last registered, first executed).
3. A deferred closure that **references** (not passes) a variable sees its *final* value — and can modify named return values.

`defer` is how Go does reliable cleanup (unlock, close, cancel) even on panic. It runs *before* the function actually returns to the caller.

### Leaks

- **Goroutine leak:** a goroutine blocked forever (on a channel, or ignoring `ctx.Done()`) never exits → its stack + captured memory never freed. Accumulates until OOM.
- **Memory leak (Go-style):** live references the GC can't collect — e.g. sub-slice pinning a big array (Module 1), an ever-growing map/cache, or a timer/ticker never stopped.

### The Py-Go Bridge

| Concept | Python / JS | Go |
|---------|-------------|-----|
| Scoped cleanup | `with` block / context manager (`__enter__`/`__exit__`); `try/finally` | `defer` (LIFO, runs on return/panic) |
| Cancellation | `asyncio.CancelledError`, `Task.cancel()`, `AbortController` (JS) | `context.Context` tree, `ctx.Done()` channel |
| Timeout | `asyncio.wait_for(coro, timeout)` | `context.WithTimeout` propagated through calls |
| Request data | thread-locals / contextvars | `context.WithValue` (sparingly) |
| Cleanup timing | `with` exits at block end | `defer` runs at **function** end, args eval'd at defer site |
| Leak source | dangling tasks, unclosed resources | blocked goroutines, unstopped tickers, pinned slices |

**Key mental shift:** Python's `with` cleans up at block exit; Go's `defer` cleans up at **function** exit and **freezes its arguments immediately**. And unlike `asyncio` cancellation that raises inside the coroutine, Go cancellation is **cooperative** — your goroutine must actively `select` on `ctx.Done()` or it ignores the signal and leaks.

---

## 2. Interview Hotspots & Traps

- **`defer` argument timing (headline):** `for i := 0; i < 3; i++ { defer fmt.Print(i) }` prints `210` (LIFO + args frozen at each iteration). Know the output cold.
- **`defer` in a loop:** defers don't run until the **function** returns, not the loop iteration → opening files in a loop with `defer f.Close()` leaks fds until the function ends. Fix: wrap the body in a function.
- **Deferred close error ignored:** `defer f.Close()` discards the error. For writes, that can hide data loss. Know the named-return-value pattern to capture it.
- **`defer` mutating named returns:** `func f() (err error) { defer func(){ err = wrap(err) }(); ... }` — works because the closure sees the named return.
- **Forgetting `defer cancel()`** → the timer/resources behind `WithTimeout`/`WithCancel` leak. `go vet` (lostcancel) flags it.
- **Ignoring `ctx.Done()`** → cancellation does nothing; goroutine runs to completion anyway. Cancellation is **cooperative**, not preemptive.
- **`context.WithValue` misuse** → using it as a general arg bag; untyped keys causing collisions (must use a private key type).
- **Cancelling a parent cancels children, not vice versa** — directionality question.
- **`time.After` in a loop/select leaks** the timer until it fires; under high frequency use `time.NewTimer` + `Stop`, or `NewTicker` + `Stop`.
- **A goroutine that writes to a channel the cancelled caller no longer reads** → blocks forever → leak. Always pair with `select { case ch<-v: case <-ctx.Done(): }`.
- **`defer` performance:** historically had overhead in hot loops; modern Go optimizes open-coded defers, but in extreme hot paths it can still matter.
- **panic + recover only works in a deferred function** — `recover()` outside a defer returns nil.

---

## 3. Production Scenario

**The slow-dependency goroutine leak.** An HTTP service fans out each request to 3 downstream services concurrently and returns the first useful answer. The code launches 3 goroutines writing results to an **unbuffered** channel, then reads **one** result and returns. The other two goroutines are now blocked forever trying to send on a channel nobody reads — **2 leaked goroutines per request**. At 5k req/s that's 10k new permanently-blocked goroutines per second; each pins its stack + captured request data. The heap climbs steadily, `runtime.NumGoroutine()` grows without bound, and the pod OOM-kills every few hours. Profilers show no single hot allocation — just an ever-growing goroutine count.

Compounding it: each handler did `ctx, cancel := context.WithTimeout(...)` but **forgot `defer cancel()`**, so even completed requests leaked their timer goroutines. And a background refresh used `time.After` inside a `for-select` loop, leaking a timer per iteration.

The fix space: propagate `ctx` into every downstream call, `select` sends against `ctx.Done()`, buffer the result channel so late senders don't block, and `defer cancel()` everywhere.

---

## 4. Hands-On Coding Challenge (No Solutions)

**Problem: `FanOutFetcher`** — a cancellation-correct, leak-free first-result fetcher.

Implement a fetcher that queries N sources concurrently, returns the first successful result (or the first error if all fail), respects a deadline, and **leaves zero goroutines behind** no matter which path is taken.

**Input / API:**
```go
package fanout

import "context"

type Source interface {
    Fetch(ctx context.Context, key string) ([]byte, error)
}

type Fetcher struct {
    // TODO
}

func New(sources []Source) *Fetcher { return nil /* TODO */ }

// First queries all sources concurrently and returns the first successful
// result. It MUST:
//   - cancel all other in-flight Fetches once one succeeds (or ctx expires)
//   - respect ctx deadline/cancellation
//   - leak zero goroutines on every exit path
//   - return ctx.Err() if the context is done before any success
func (f *Fetcher) First(ctx context.Context, key string) ([]byte, error) {
    return nil, nil // TODO
}
```

**Constraints:**
- Must propagate a **derived context** (`WithCancel`) into each `Source.Fetch` and `cancel()` the losers — verify with `defer cancel()`.
- The result channel must be **buffered** (or sends guarded by `select`/`ctx.Done()`) so slow/losing goroutines never block forever.
- **Zero goroutine leaks** on all paths: first-success, all-fail, ctx-cancelled, ctx-timeout. Prove each.
- No `time.After` leaks if you use timers.
- Safe for concurrent calls to `First`.

**Edge cases:** all sources fail; ctx already cancelled on entry; one source hangs forever (must not delay return past ctx deadline); empty `sources` slice.

---

## 5. System Diagnostics & Testing Task

1. **Goroutine-leak test (per exit path):** For each scenario (success, all-fail, timeout, pre-cancelled), record `runtime.NumGoroutine()` before/after + a settle delay, and assert it returns to baseline. Include a deliberately-hanging fake `Source` to prove the hang doesn't leak.

2. **`defer` argument-evaluation drill:** Write `TestDeferEval` proving `defer`'d args freeze at the defer site (the `210` loop output) and that a deferred closure can rewrite a named return error. This cements the mechanic interviewers test.

3. **net/http/pprof goroutine dump:** Expose pprof and capture the live goroutine profile under load to *see* a leak before you fix it:
   ```bash
   go test -run TestLeakUnderLoad ./fanout &
   # in the test, import _ "net/http/pprof", serve, then:
   go tool pprof http://localhost:6060/debug/pprof/goroutine
   # (list) top  → look for goroutines stacked in chan send / Fetch
   ```

4. **`go vet` for lost cancel:**
   ```bash
   go vet ./fanout
   ```
   Confirm vet flags any `WithCancel`/`WithTimeout` whose `cancel` isn't called on all paths. Fix until clean.

5. **Race + benchmark:**
   ```bash
   go test -race -run TestConcurrentFirst ./fanout
   go test -bench=BenchmarkFirst -benchmem ./fanout
   ```
   Concurrent `First` calls must be race-clean; report allocs/op and confirm they don't grow with call count (no per-call leak masquerading as allocation growth).

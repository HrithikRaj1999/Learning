# Go Interview Mastery — From Python/JS to Production in 1 Week

> **Audience:** Engineers with Python/JS background targeting senior/staff Go interviews and real production Go work.
> **Goal:** Touch every runtime mechanic interviewers probe, with clear explanations, traps, production scenarios, hands-on challenges (no solutions), and native-tooling diagnostics tasks.

## How This Course Works

Every module follows the same **5-part structure**:

1. **Core Concept & The Py-Go Bridge** — the mechanic explained, then a high-level Python/JS comparison focused on memory (stack vs heap).
2. **Interview Hotspots & Traps** — exact trick questions, edge cases, panic triggers.
3. **Production Scenario** — where this becomes an OOM/leak/contention bottleneck in real systems.
4. **Hands-On Coding Challenge (No Solutions)** — concrete question, I/O spec, skeleton, constraints. You solve it.
5. **System Diagnostics & Testing Task** — verify with `go test -bench`, `-gcflags="-m"`, `pprof`, race detector.

## Module Map

| # | Module | Core Mechanics |
|---|--------|----------------|
| 0 | [Setup, Basics & Syntax](./00_Setup_Basics_Syntax/README.md) | install, types, zero values, control flow, functions, structs, error idiom |
| 1 | [Memory Layout, Slices & Maps](./01_Memory_Slices_Maps/README.md) | 24-byte slice header, append re-alloc, map buckets, escape analysis |
| 2 | [Type System & The Nil Interface Trap](./02_Types_Interfaces_Nil/README.md) | embedding, implicit interfaces, itab/data pair, `(*T)(nil) != nil` |
| 3 | [Concurrency, CSP & Channels](./03_Concurrency_CSP_Channels/README.md) | `hchan`, recvq/sendq, close rules, Mutex/RWMutex, WaitGroup, Pool |
| 4 | [Runtime & GMP Scheduler](./04_Runtime_GMP_Scheduler/README.md) | G/M/P, work-stealing, syscall handoff, tri-color GC |
| 5 | [Context Propagation & Diagnostics](./05_Context_Defer_Diagnostics/README.md) | context tree cancellation, `defer` arg eval, leak hunting |

## 7-Day Plan

| Day | Focus | Deliverable |
|-----|-------|-------------|
| 0 (½ day) | Module 0 | Install Go, solve `MiniConfig`, write first table test |
| 1 | Module 1 | Solve slice/map challenge, run escape analysis |
| 2 | Module 2 | Interface design challenge, prove nil trap in code |
| 3 | Module 3 (channels) | Worker-pool challenge, race detector clean |
| 4 | Module 3 (sync) | Pool/Mutex benchmark, contention profile |
| 5 | Module 4 | Scheduler tracing, GC tuning experiment |
| 6 | Module 5 | Cancellation challenge, goroutine-leak test |
| 7 | Review | Re-solve all challenges from scratch, time-boxed |

## Setup

```bash
go version          # need 1.21+
go env GOPATH GOMAXPROCS
```

Each module is standalone. Read part 1-3, attempt part 4 cold, then verify with part 5.

## Global Diagnostics Cheat Sheet

```bash
go build -gcflags="-m" ./...        # escape analysis (what goes to heap)
go test -bench=. -benchmem          # ns/op + allocs/op
go test -race ./...                 # data race detector
go test -run=X -trace=trace.out     # then: go tool trace trace.out
go tool pprof -http=:8080 cpu.prof  # flame graphs
GODEBUG=gctrace=1 ./app             # GC pause logging
GODEBUG=schedtrace=1000 ./app       # scheduler state every 1s
```

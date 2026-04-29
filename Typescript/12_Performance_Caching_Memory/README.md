# Task 12: Performance, Caching, and Memory

Level: Advanced

## Concepts

- LRU
- TTL
- memoization
- batching
- DataLoader pattern
- performance marks
- WeakMap
- memory safety

## Files

- Task file: `task_12_performance_caching_memory.ts`
- Sample tests: `__tests__/task_12_performance_caching_memory.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 12.01 | Implement an LRU cache with get, set, delete, and size behavior. |
| 12.02 | Create a TTL cache that expires values using an injected clock. |
| 12.03 | Memoize pure functions with typed argument keys. |
| 12.04 | Create a request-scoped DataLoader-style batcher. |
| 12.05 | Eliminate an N+1 lookup by batching ids and preserving order. |
| 12.06 | Measure operation duration using performance.now with injectable timing. |
| 12.07 | Build a weak memoization helper for object keys. |
| 12.08 | Create a bounded queue that applies backpressure when full. |
| 12.09 | Implement stale-while-revalidate caching for async reads. |
| 12.10 | Create a cache key builder that avoids collisions between tenants. |
| 12.11 | Build a CPU-heavy chunk processor that yields to the event loop. |
| 12.12 | Implement pagination that avoids loading all rows into memory. |
| 12.13 | Create a topK algorithm suitable for large streams. |
| 12.14 | Track approximate memory usage for buffered records. |
| 12.15 | Build a cache invalidation strategy from domain events. |
| 12.16 | Create a bulk write coalescer that flushes by count or time. |
| 12.17 | Implement a moving average latency tracker. |
| 12.18 | Create a dedupe layer for repeated expensive computations. |
| 12.19 | Design a performance budget checker for service methods. |
| 12.20 | Create benchmarks for two implementations and compare results. |

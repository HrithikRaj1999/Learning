# Task 05: Async, Promises, and Concurrency

Level: Advanced

## Concepts

- Promise
- async/await
- AbortController
- timeouts
- retry
- backoff
- concurrency limits
- queues

## Files

- Task file: `task_05_async_concurrency.ts`
- Sample tests: `__tests__/task_05_async_concurrency.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 05.01 | Implement a promise pool that limits concurrent async work and preserves result order. |
| 05.02 | Create a retry helper with exponential backoff and retryable error filtering. |
| 05.03 | Wrap a promise with a timeout that respects AbortSignal. |
| 05.04 | Create an abortable delay helper for tests and background workers. |
| 05.05 | Implement debounce for async functions while keeping the latest call result. |
| 05.06 | Implement throttle for event handlers with leading and trailing options. |
| 05.07 | Build an async queue with push, close, and async iterator consumption. |
| 05.08 | Create a rate limiter using a token bucket strategy. |
| 05.09 | Fetch paginated records until no cursor remains while respecting cancellation. |
| 05.10 | Run independent tasks and collect both fulfilled values and typed failures. |
| 05.11 | Create a circuit breaker that opens after repeated failures and recovers after cooldown. |
| 05.12 | Implement a bulkhead limiter per tenant id. |
| 05.13 | Build an idempotent job runner that deduplicates jobs by key. |
| 05.14 | Create a scheduler that runs tasks at intervals without overlapping runs. |
| 05.15 | Implement a timeout-aware mutex for protecting shared resources. |
| 05.16 | Create a request coalescer that shares one in-flight promise per cache key. |
| 05.17 | Write a mapper for AsyncIterable inputs that supports concurrency. |
| 05.18 | Add cancellation propagation from parent AbortSignal to child operations. |
| 05.19 | Implement graceful shutdown for a queue with drain and force-stop modes. |
| 05.20 | Create a helper that retries only safe idempotent operations. |

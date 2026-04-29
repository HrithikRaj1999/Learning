# Task 08: HTTP Clients and API SDKs

Level: Advanced

## Concepts

- fetch
- typed clients
- headers
- pagination
- retry
- auth refresh
- idempotency
- API errors

## Files

- Task file: `task_08_http_api_clients.ts`
- Sample tests: `__tests__/task_08_http_api_clients.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 08.01 | Build a typed fetch wrapper that parses JSON and maps non-2xx responses into Result errors. |
| 08.02 | Create a URL builder that safely encodes path params and query params. |
| 08.03 | Implement request retry with idempotency-key support for POST operations. |
| 08.04 | Create an API client class with injected fetch for testability. |
| 08.05 | Add auth token refresh when a request returns 401 once. |
| 08.06 | Implement cursor pagination as an AsyncIterable. |
| 08.07 | Create a rate-limit handler that reads Retry-After headers. |
| 08.08 | Build request and response logging with redacted headers. |
| 08.09 | Validate response bodies with Zod before returning them. |
| 08.10 | Create typed endpoint definitions that infer request and response shapes. |
| 08.11 | Implement multipart upload metadata preparation. |
| 08.12 | Build a client-side cache for GET requests with TTL and stale-while-revalidate behavior. |
| 08.13 | Create cancellation support through AbortSignal. |
| 08.14 | Implement a circuit breaker around dependency API calls. |
| 08.15 | Map dependency-specific errors into domain-level errors. |
| 08.16 | Create a webhook sender with signing headers and retry metadata. |
| 08.17 | Build a test fake for fetch that supports multiple ordered responses. |
| 08.18 | Create a batch API helper that splits large requests and merges responses. |
| 08.19 | Implement request timeout metrics and classify dependency latency. |
| 08.20 | Create SDK method documentation metadata from endpoint definitions. |

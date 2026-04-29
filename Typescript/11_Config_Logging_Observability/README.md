# Task 11: Config, Logging, and Observability

Level: Advanced

## Concepts

- environment config
- structured logs
- redaction
- correlation ids
- metrics
- tracing
- health checks
- graceful shutdown

## Files

- Task file: `task_11_config_logging_observability.ts`
- Sample tests: `__tests__/task_11_config_logging_observability.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 11.01 | Parse environment variables into typed config with clear startup errors. |
| 11.02 | Create a structured logger interface with child loggers and context fields. |
| 11.03 | Implement recursive redaction for password, token, apiKey, and authorization fields. |
| 11.04 | Create correlation-id propagation across service calls. |
| 11.05 | Build a metrics recorder interface and in-memory test implementation. |
| 11.06 | Record latency histograms around async operations. |
| 11.07 | Create a tracing span helper that records status and error metadata. |
| 11.08 | Build readiness and liveness health check aggregators. |
| 11.09 | Implement graceful shutdown hooks for HTTP server, queue, and database clients. |
| 11.10 | Create a startup diagnostics report without exposing secrets. |
| 11.11 | Sample noisy logs by event key while keeping error logs. |
| 11.12 | Create a log formatter that outputs stable JSON lines. |
| 11.13 | Add contextual logging to a use case without global state. |
| 11.14 | Create a slow-operation detector with configurable threshold. |
| 11.15 | Build an audit event writer with immutable metadata. |
| 11.16 | Implement feature flag evaluation logging with privacy-safe fields. |
| 11.17 | Create a dependency health cache with TTL. |
| 11.18 | Build an error-to-metric classifier. |
| 11.19 | Create a request lifecycle context object. |
| 11.20 | Design observability hooks for a background job runner. |

# Task 06: Error Handling and Result Types

Level: Advanced

## Concepts

- Result
- custom errors
- error causes
- typed failures
- classification
- safe wrappers
- domain errors
- recoverability

## Files

- Task file: `task_06_error_handling_result_types.ts`
- Sample tests: `__tests__/task_06_error_handling_result_types.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 06.01 | Implement ok, err, isOk, and isErr helpers for a Result type. |
| 06.02 | Create map, mapError, and flatMap helpers for Result values. |
| 06.03 | Wrap synchronous exceptions into Result without losing error cause. |
| 06.04 | Wrap async exceptions into Promise<Result<T, E>>. |
| 06.05 | Classify unknown errors into validation, auth, timeout, dependency, and unknown categories. |
| 06.06 | Create a BaseAppError class with code, retryable, statusCode, and cause. |
| 06.07 | Convert domain errors into safe public API error responses. |
| 06.08 | Build a validation error collector that preserves field paths. |
| 06.09 | Implement a retry decision function based on typed error metadata. |
| 06.10 | Create an error boundary helper for background jobs that logs and returns a failure result. |
| 06.11 | Aggregate multiple validation failures into one typed error object. |
| 06.12 | Implement a neverthrow-style pipe for chaining Result-returning functions. |
| 06.13 | Create a safe fallback helper that recovers only from expected error codes. |
| 06.14 | Convert thrown HTTP errors into typed dependency failures. |
| 06.15 | Create a redacted error serializer that removes secrets from messages and metadata. |
| 06.16 | Implement an assertOk helper for tests that unwraps Result or throws useful diagnostics. |
| 06.17 | Build a domain-specific error union for checkout flow failures. |
| 06.18 | Create a typed error registry with documentation text per error code. |
| 06.19 | Implement error sampling logic to reduce noisy logs. |
| 06.20 | Build a migration from throw-heavy code to Result-returning code. |

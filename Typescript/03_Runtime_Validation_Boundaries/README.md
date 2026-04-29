# Task 03: Runtime Validation and Boundaries

Level: Advanced

## Concepts

- zod
- DTOs
- schema parsing
- environment validation
- serialization
- input sanitation
- boundary mapping
- safe JSON

## Files

- Task file: `task_03_runtime_validation_boundaries.ts`
- Sample tests: `__tests__/task_03_runtime_validation_boundaries.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 03.01 | Create a Zod schema for a user registration request and return normalized validation errors. |
| 03.02 | Validate process environment into a typed AppConfig object with defaults. |
| 03.03 | Parse unknown JSON into a typed domain event without leaking raw input into the domain layer. |
| 03.04 | Implement a safeJsonParse helper that returns Result instead of throwing. |
| 03.05 | Convert an external API customer DTO into an internal Customer aggregate. |
| 03.06 | Strip unknown properties from public API responses before sending data to callers. |
| 03.07 | Validate a webhook signature payload shape before attempting signature verification. |
| 03.08 | Normalize dates from strings into ISO strings at the boundary. |
| 03.09 | Validate a paginated query string object with limit, cursor, sort, and direction. |
| 03.10 | Create reusable validation error formatting for API responses. |
| 03.11 | Validate a nested order create payload and calculate a summary of invalid fields. |
| 03.12 | Write a schema that accepts legacy and current payload shapes and maps both to one domain command. |
| 03.13 | Create a schema for optional filters where empty strings become undefined. |
| 03.14 | Validate uploaded file metadata such as mime type, size, extension, and owner id. |
| 03.15 | Create a public response serializer that redacts email and token fields. |
| 03.16 | Build a boundary mapper that preserves validation context for logging. |
| 03.17 | Validate a feature flag configuration object loaded from JSON. |
| 03.18 | Create a runtime-safe enum parser for role, status, and priority strings. |
| 03.19 | Reject prototype-pollution keys while parsing object input. |
| 03.20 | Build a schema-driven test data factory for validated DTOs. |

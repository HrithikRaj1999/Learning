# Task 01: Type System and Narrowing

Level: Advanced

## Concepts

- strict mode
- unknown
- never
- discriminated unions
- type guards
- assertion functions
- branded types
- exhaustive switches

## Files

- Task file: `task_01_type_system_narrowing.ts`
- Sample tests: `__tests__/task_01_type_system_narrowing.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 01.01 | Model payment events as a discriminated union and render a human-readable audit message for each variant. |
| 01.02 | Write a type guard that accepts unknown input and narrows it to a production-safe UserProfile shape. |
| 01.03 | Create an assertion function that guarantees a value is a non-empty string before it reaches the domain layer. |
| 01.04 | Use branded types to prevent mixing CustomerId, OrderId, and ProductId values. |
| 01.05 | Build an exhaustive switch helper with assertNever for a NotificationStatus union. |
| 01.06 | Normalize nullable API fields into explicit domain values without using any. |
| 01.07 | Convert a loose webhook payload into a typed command object using runtime checks and narrowing. |
| 01.08 | Represent success, validation failure, auth failure, and rate-limit failure as a discriminated ApiResponse union. |
| 01.09 | Create a safe parser for Date-like inputs that returns a typed result instead of throwing. |
| 01.10 | Implement a function that accepts string | number | boolean and formats it without unsafe casts. |
| 01.11 | Write a type predicate for arrays of records where every item has an id string. |
| 01.12 | Use the satisfies operator to validate a route table while preserving literal route names. |
| 01.13 | Design a literal union for feature flags and validate flag names from unknown input. |
| 01.14 | Create a function that narrows an unknown error into Error, AggregateError, or a fallback object. |
| 01.15 | Model a finite state machine for order checkout and reject impossible transitions at compile time where possible. |
| 01.16 | Build a lookup map whose keys must match an exact union of supported locales. |
| 01.17 | Prevent accidental mutation by accepting readonly inputs and returning new objects. |
| 01.18 | Write a parser that distinguishes missing, null, empty, and valid optional values. |
| 01.19 | Create a typed event envelope with metadata and a narrowed event body. |
| 01.20 | Refactor a function signature from any to unknown plus proper narrowing. |

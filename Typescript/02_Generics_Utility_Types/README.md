# Task 02: Generics and Utility Types

Level: Advanced

## Concepts

- generic constraints
- keyof
- indexed access
- mapped types
- conditional types
- infer
- template literal types
- utility types

## Files

- Task file: `task_02_generics_utility_types.ts`
- Sample tests: `__tests__/task_02_generics_utility_types.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 02.01 | Implement a typed pick function that only accepts keys present on the input object. |
| 02.02 | Implement a typed omit function that preserves the remaining property types. |
| 02.03 | Build a generic groupBy helper that returns a Record keyed by a string-producing selector. |
| 02.04 | Create a keyBy helper that indexes records by a unique key and detects duplicate keys at runtime. |
| 02.05 | Implement a typed pluck helper for extracting one property from a readonly array of objects. |
| 02.06 | Create DeepReadonly and DeepPartial utility types and demonstrate them with nested config data. |
| 02.07 | Create a RequireAtLeastOne utility type for patch/update DTOs. |
| 02.08 | Build a Paths<T> template-literal type for safe dot-path property names. |
| 02.09 | Implement a generic getByPath function with a runtime fallback value. |
| 02.10 | Create an EventMap-based typed event emitter with on, off, and emit methods. |
| 02.11 | Build a strongly typed command bus where command names map to payload and result types. |
| 02.12 | Create a type-safe repository interface generic over entity and id types. |
| 02.13 | Write a conditional type that unwraps Promise, Result, and array values. |
| 02.14 | Create a function overload set for parsing config from string, URL, or object input. |
| 02.15 | Implement a typed mergeDefaults helper that respects readonly default values. |
| 02.16 | Build a generic pagination result type with cursor and offset variants. |
| 02.17 | Create a DTO mapper that selects public fields from private domain models. |
| 02.18 | Use infer to extract handler input and output types from a function map. |
| 02.19 | Create a branded generic Id<TName> type and helper constructors. |
| 02.20 | Design a type-safe feature flag registry with inferred flag value types. |

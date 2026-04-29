# Task 09: Domain Modeling and Design Patterns

Level: Advanced

## Concepts

- value objects
- entities
- repositories
- services
- factories
- strategy
- observer
- dependency injection

## Files

- Task file: `task_09_domain_modeling_design_patterns.ts`
- Sample tests: `__tests__/task_09_domain_modeling_design_patterns.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 09.01 | Create a Money value object with currency-safe arithmetic. |
| 09.02 | Model an Order aggregate that enforces valid status transitions. |
| 09.03 | Create a repository interface and in-memory implementation for tests. |
| 09.04 | Build a service layer that coordinates repository, clock, and logger dependencies. |
| 09.05 | Implement a factory for creating valid Customer entities. |
| 09.06 | Use the strategy pattern for choosing shipping cost calculation. |
| 09.07 | Use the command pattern for checkout operations with undo metadata. |
| 09.08 | Use the observer pattern for publishing domain events. |
| 09.09 | Implement dependency injection with explicit constructor dependencies. |
| 09.10 | Create a policy object for authorization checks. |
| 09.11 | Create a specification pattern for filtering orders. |
| 09.12 | Build a unit-of-work abstraction for committing multiple repository changes. |
| 09.13 | Create a mapper between persistence models and domain models. |
| 09.14 | Enforce invariants inside constructors or static factory methods. |
| 09.15 | Model a state machine for support ticket lifecycle. |
| 09.16 | Use composition over inheritance to share behavior across services. |
| 09.17 | Create a plugin registry for payment providers. |
| 09.18 | Build an anti-corruption layer for a legacy customer API. |
| 09.19 | Create domain event serialization and deserialization. |
| 09.20 | Refactor a god function into cohesive domain services. |

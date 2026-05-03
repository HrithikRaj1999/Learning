# Rust Interview Readiness Rubric

## Self-Assessment: Rate yourself 1-5 on each skill

---

## Level 1: Foundations (Must score 4+ for junior roles)

| Skill | 1 | 2 | 3 | 4 | 5 |
|-------|---|---|---|---|---|
| Explain ownership and the 3 rules | | | | | |
| Fix borrow checker errors without clone() | | | | | |
| Use String vs &str correctly | | | | | |
| Implement structs with methods | | | | | |
| Use enums with pattern matching | | | | | |
| Handle errors with Result and ? | | | | | |
| Use Vec, HashMap effectively | | | | | |
| Write iterator chains (filter/map/collect) | | | | | |
| Understand when values are moved vs copied | | | | | |
| Read and fix lifetime annotation errors | | | | | |

---

## Level 2: Intermediate (Must score 4+ for mid-level roles)

| Skill | 1 | 2 | 3 | 4 | 5 |
|-------|---|---|---|---|---|
| Define and implement custom traits | | | | | |
| Write generic functions with trait bounds | | | | | |
| Choose between static and dynamic dispatch | | | | | |
| Use Box, Rc, Arc appropriately | | | | | |
| Implement interior mutability (RefCell) | | | | | |
| Spawn threads and use channels | | | | | |
| Write async/await code with tokio | | | | | |
| Build CLI tools with argument parsing | | | | | |
| Handle file I/O efficiently | | | | | |
| Use closures and understand Fn/FnMut/FnOnce | | | | | |

---

## Level 3: Advanced (Must score 4+ for senior roles)

| Skill | 1 | 2 | 3 | 4 | 5 |
|-------|---|---|---|---|---|
| Build REST APIs with Axum/Actix | | | | | |
| Implement JWT authentication | | | | | |
| Write middleware (logging, auth, CORS) | | | | | |
| Use SQLx with compile-time checked queries | | | | | |
| Handle database transactions correctly | | | | | |
| Design error types for libraries vs apps | | | | | |
| Profile and optimize performance | | | | | |
| Understand unsafe and when it's needed | | | | | |
| Work with FFI (calling C from Rust) | | | | | |
| Architect a multi-module Rust project | | | | | |

---

## Common Interview Questions by Level

### Junior
1. "What happens when you assign a String to another variable?"
2. "What's the difference between & and &mut?"
3. "Why can't you have two mutable references?"
4. "How does Rust prevent null pointer exceptions?"
5. "What is the ? operator?"

### Mid-Level
6. "When would you use Box vs Rc vs Arc?"
7. "Explain the difference between impl Trait and dyn Trait"
8. "How does async/await work in Rust?"
9. "Design a trait for a caching system"
10. "How would you handle errors in a library vs an application?"

### Senior
11. "How would you design a middleware system?"
12. "Explain zero-cost abstractions with an example"
13. "When is unsafe justified? How do you minimize risk?"
14. "Design a connection pool with timeout and health checks"
15. "How would you structure a large Rust web application?"

---

## Red Flags (Things that show lack of understanding)

- Using `.unwrap()` everywhere instead of proper error handling
- Using `.clone()` to "fix" borrow checker errors without understanding why
- Not understanding why `Rc` can't be sent between threads
- Using `String` in function parameters instead of `&str`
- Not knowing the difference between `Copy` and `Clone`
- Using `Box<dyn Trait>` when generics would be more appropriate

---

## Green Flags (Things that impress interviewers)

- Explaining WHY ownership rules exist (memory safety without GC)
- Choosing the right smart pointer with reasoning
- Using the type system to make invalid states unrepresentable
- Showing awareness of performance implications
- Discussing trade-offs (compile time vs runtime, binary size vs speed)
- Understanding the ecosystem (tokio, serde, axum, sqlx)

# ULTRA RUST LEARNING PLAN

## 14-Section Mastery Path: Web Development & System Tools

---

## Phase 1: Foundation (Sections 00–04b)

### Section 00: Setup, Basics & Syntax ⭐ START HERE
- What is Rust and why learn it
- Installing Rust on Windows/macOS/Linux
- Cargo basics (new, build, run)
- Variables, mutability, type annotations
- Primitive types (i32, f64, bool, char, &str, String)
- Tuples and arrays
- Functions (parameters, return types, expressions vs statements)
- Control flow (if/else, loop, while, for)
- String vs &str (the basics)
- Printing and formatting
- Reading compiler error messages

### Section 01: Ownership, Borrowing & Types
- The three ownership rules
- Copy vs Move semantics
- Borrowing (&T, &mut T) and the two borrowing rules
- Shadowing
- Stack vs Heap allocation
- String ownership deep dive

### Section 02: Structs, Enums & Pattern Matching
- Structs with #[derive(Debug)], impl blocks
- Tuple structs
- Enums with data variants
- Pattern matching (match with guards/wildcards)
- if let shorthand
- Option<T> introduction
- Vec<T> introduction

### Section 03: Error Handling (Result/Option)
- Result<T, E> and Option vs Result comparison
- panic! vs Result (when to use which)
- The ? operator (taught gradually)
- Custom error enums
- map_err and ok_or conversions

### Section 04: Collections, Iterators & Closures
- HashMap (with `use` import), entry API
- HashSet
- Iterator methods (map, filter, fold, collect, etc.)
- Closures basics and capturing variables
- Lazy evaluation and iterator chains

### Section 04b: Modules & Project Structure
- mod / use / pub visibility
- Multi-file modules (folder structure, mod.rs)
- Crates and cargo add
- Prelude explanation

---

## Phase 2: Intermediate (Sections 05–08)

### Section 05: Traits & Generics
- Defining and implementing traits
- #[derive(...)] — what it generates, which traits are derivable
- Trait bounds and where clauses
- Generic functions and structs
- Trait objects (dyn Trait) vs static dispatch
- Object safety rules
- Display and From traits for error handling pattern
- Supertraits and trait composition

### Section 06: Lifetimes & Smart Pointers
- Lifetime annotations ('a)
- The three lifetime elision rules
- 'static lifetime
- Box<T>, Rc<T>, Arc<T>
- RefCell<T> and interior mutability
- Weak<T> for breaking reference cycles
- Decision tree: when to use which pointer

### Section 07: Concurrency & Async/Await
- Threads (std::thread) and message passing (mpsc)
- Shared state (Mutex<T>, RwLock<T>)
- Send and Sync traits
- What is an async runtime
- Async/await syntax and async move closures
- Tokio runtime, tasks, and Semaphore
- tokio::select! for racing futures

### Section 08: File I/O & CLI Tools
- std::fs operations, BufReader/BufWriter
- Path and PathBuf
- CLI argument parsing with clap (including Cargo.toml setup)
- stdin/stdout for pipe-composable tools
- Exit codes (ExitCode)
- Environment variables and process spawning

---

## Phase 3: Advanced (Sections 09–12)

### Section 09: Networking & HTTP Fundamentals
- HTTP fundamentals (methods, status codes, headers)
- TLS/HTTPS concepts
- TCP/UDP with std::net
- reqwest 0.12 for HTTP clients
- Serialization (serde, serde_json) — advanced features
- Working with REST APIs

### Section 10: Web Development (Axum)
- Axum 0.7 framework fundamentals
- Routing and handlers with type-safe extractors
- Middleware (logging, auth, rate limiting)
- Custom error types with IntoResponse
- State management with Arc
- JWT authentication
- Production project structure

### Section 11: Database & ORM Integration
- PostgreSQL setup (Docker)
- .env file + dotenvy
- SQLx 0.7 (async, compile-time checked)
- sqlx-cli and migrations
- CRUD with repository pattern
- Transactions (atomic operations)
- cargo sqlx prepare for CI
- SQLx vs Diesel vs SeaORM comparison

### Section 12: Advanced System Tools & FFI
- Unsafe Rust (five superpowers, safe wrappers)
- FFI (calling C from Rust, exposing Rust to C)
- bindgen / cbindgen for auto-generated bindings
- Signal handling (ctrlc, tokio::signal)
- Performance profiling and optimization
- Production binary configuration
- Cross-compilation

---

## Daily Practice Schedule

| Day | Activity | Time |
|-----|----------|------|
| Mon-Fri | New section content | 1-2 hrs |
| Sat | Build project from current phase | 3 hrs |
| Sun | Review + refactor previous work | 1 hr |

---

## Recommended Crates by Category

### Web Development
- `axum` - Modern web framework
- `actix-web` - High-performance web framework
- `tower` - Middleware ecosystem
- `reqwest` - HTTP client
- `serde` / `serde_json` - Serialization

### System Tools
- `clap` - CLI argument parsing
- `tokio` - Async runtime
- `rayon` - Data parallelism
- `crossbeam` - Concurrency primitives
- `notify` - File system watcher

### Database
- `sqlx` - Async SQL toolkit
- `diesel` - Type-safe ORM
- `sea-orm` - Async ORM

### Testing
- Built-in `#[test]` framework
- `mockall` - Mocking
- `proptest` - Property-based testing
- `criterion` - Benchmarking

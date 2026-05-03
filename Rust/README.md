# 🦀 Rust Mastery: Beginner to Advanced

## Web Development & System-Level Tools

---

## Learning Philosophy

Rust combines **memory safety without garbage collection**, **zero-cost abstractions**, and **fearless concurrency**. This curriculum takes you from zero Rust knowledge to building production web servers and system-level tools.

**All task answers are hidden behind `<details>` tags** — try to solve them yourself first!

---

## Curriculum Overview

| Section | Topic | Level | Focus |
|---------|-------|-------|-------|
| 00 | Setup, Basics & Syntax | Absolute Beginner | Installation, variables, types, functions, loops |
| 01 | Ownership, Borrowing & Types | Beginner | Core mental model — Rust's key innovation |
| 02 | Structs, Enums & Pattern Matching | Beginner | Data modeling, Option, Vec |
| 03 | Error Handling (Result/Option) | Beginner | Robust code with Result and ? |
| 04 | Collections, Iterators & Closures | Beginner+ | HashMap, iterator chains, closures |
| 04b | Modules & Project Structure | Beginner+ | mod/use/pub, multi-file projects, crates |
| 05 | Traits & Generics | Intermediate | Abstraction, derive, Display/From, object safety |
| 06 | Lifetimes & Smart Pointers | Intermediate | Elision rules, Box/Rc/Arc/RefCell/Weak, 'static |
| 07 | Concurrency & Async/Await | Intermediate | Threads, Send/Sync, tokio, select! |
| 08 | File I/O & CLI Tools | Intermediate | Files, clap, stdin/stdout, exit codes |
| 09 | Networking & HTTP Fundamentals | Advanced | TCP, HTTP, reqwest, serde, TLS |
| 10 | Web Development (Axum) | Advanced | REST APIs, middleware, JWT auth |
| 11 | Database & ORM Integration | Advanced | SQLx, PostgreSQL, migrations, transactions |
| 12 | Advanced System Tools & FFI | Expert | Unsafe, FFI, signals, benchmarking |

---

## Prerequisites

- Basic programming knowledge (any language)
- Terminal/command-line comfort

## Setup (Windows)

```powershell
# Install Rust — download from https://rustup.rs/
# Or use winget:
winget install Rustlang.Rustup

# Verify installation
rustc --version
cargo --version

# Useful tools
rustup component add clippy rustfmt
cargo install cargo-watch cargo-edit
```

## Setup (macOS/Linux)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustc --version
cargo --version
rustup component add clippy rustfmt
cargo install cargo-watch cargo-edit
```

---

## How to Use This Curriculum

1. **Start with Section 00** — even if you know another language
2. **Read** each section's Core Concepts before attempting tasks
3. **Try tasks yourself** before revealing the hidden answers
4. **Code everything** — create a cargo project and type the code, don't just read
5. **Follow the order** — each section builds on concepts from the previous ones

---

## Key Rust Concepts Map

```
Section 00: Basics (variables, types, functions, loops)
    │
    ▼
Section 01: Ownership ──► Borrowing ──► Move vs Copy
    │
    ▼
Section 02: Structs ──► Enums ──► match ──► Option<T> ──► Vec<T>
    │
    ▼
Section 03: Result<T,E> ──► ? operator ──► Custom errors
    │
    ▼
Section 04: HashMap ──► Iterators ──► Closures
    │
    ▼
Section 04b: mod/use/pub ──► Multi-file ──► Crates (cargo add)
    │
    ▼
Section 05: Traits ──► Generics ──► derive ──► Display/From ──► dyn Trait
    │
    ▼
Section 06: Lifetimes ──► Box ──► Rc/Arc ──► RefCell ──► Weak
    │
    ▼
Section 07: Threads ──► Mutex ──► async/await ──► tokio ──► select!
    │
    ▼
Section 08: File I/O ──► CLI (clap) ──► stdin/stdout ──► Processes
    │
    ▼
Section 09: TCP ──► HTTP ──► reqwest ──► serde ──► TLS
    │
    ▼
Section 10: Axum ──► Routing ──► Middleware ──► JWT ──► Error handling
    │
    ▼
Section 11: PostgreSQL ──► SQLx ──► Migrations ──► Transactions
    │
    ▼
Section 12: Unsafe ──► FFI ──► Signals ──► Profiling ──► Production builds
```

---

## Completion Milestones

- [ ] Section 00-04b: Can write basic Rust programs with proper error handling
- [ ] Section 05-08: Can build CLI tools and understand Rust's type system deeply
- [ ] Section 09-10: Can build a REST API with authentication
- [ ] Section 11-12: Can build a full-stack web app with database and deploy it

# Section 04b: Modules, Crates & Project Structure

> **Prerequisites:** Complete Sections 00-04. This section is about organizing code — you need to be comfortable writing structs, enums, functions, and using collections before worrying about structure.

## 🎯 Learning Objectives
- Organize code into modules with `mod`, `use`, and `pub`
- Understand Rust's visibility (privacy) system
- Structure a multi-file project properly
- Know what crates are and how to add external ones
- Understand the difference between library and binary crates

---

## 📖 Core Concepts

### Why Modules?

So far, all your code has been in a single `main.rs` file. That works for learning, but real projects have thousands of lines. Modules let you:
1. **Organize** — group related code together
2. **Control visibility** — decide what's public vs private
3. **Avoid name conflicts** — two modules can have functions with the same name
4. **Reuse** — import and use code from other modules

### 1. Defining Modules Inline

The simplest way — define modules inside the same file:

```rust
// All items in a module are PRIVATE by default
mod math {
    // This function is public — can be used outside the module
    pub fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    // This function is PRIVATE — only usable inside `math`
    fn secret_formula(x: i32) -> i32 {
        x * 42 + 7
    }

    // Public function that uses the private one
    pub fn calculate(x: i32) -> i32 {
        secret_formula(x)
    }
}

mod greetings {
    pub fn hello(name: &str) -> String {
        format!("Hello, {}!", name)
    }

    pub fn goodbye(name: &str) -> String {
        format!("Goodbye, {}!", name)
    }
}

fn main() {
    // Use full path: module::function
    println!("{}", math::add(3, 4));          // 7
    println!("{}", math::calculate(5));        // 217
    // println!("{}", math::secret_formula(5)); // ❌ ERROR: private function

    println!("{}", greetings::hello("World"));  // Hello, World!
}
```

### 2. The `use` Keyword — Shorter Paths

```rust
mod math {
    pub fn add(a: i32, b: i32) -> i32 { a + b }
    pub fn multiply(a: i32, b: i32) -> i32 { a * b }
}

mod greetings {
    pub fn hello(name: &str) -> String {
        format!("Hello, {}!", name)
    }
}

// Bring items into scope with `use`
use math::add;
use greetings::hello;

fn main() {
    // Now you can use short names
    println!("{}", add(3, 4));        // Instead of math::add(3, 4)
    println!("{}", hello("World"));   // Instead of greetings::hello("World")

    // You can still use the full path too
    println!("{}", math::multiply(3, 4));
}
```

### Common `use` Patterns

```rust
// Import one item
use std::collections::HashMap;

// Import multiple items from the same module
use std::collections::{HashMap, HashSet, BTreeMap};

// Import everything from a module (avoid in large projects — unclear what's imported)
use std::collections::*;

// Rename to avoid conflicts
use std::fmt::Result as FmtResult;
use std::io::Result as IoResult;

// Re-export: make something available from YOUR module
mod internal {
    pub fn helper() -> String {
        "internal helper".to_string()
    }
}
pub use internal::helper;  // Now callers can use `your_crate::helper()` directly
```

### 3. The `pub` Keyword — Visibility Rules

```rust
mod server {
    // Public struct, but fields can be private!
    pub struct Config {
        pub host: String,         // Public — anyone can read/write
        pub port: u16,            // Public
        secret_key: String,       // PRIVATE — only this module can access
    }

    impl Config {
        // Public constructor — the only way to create a Config
        // (because secret_key is private, you can't use struct literal syntax outside this module)
        pub fn new(host: &str, port: u16, key: &str) -> Self {
            Config {
                host: host.to_string(),
                port,
                secret_key: key.to_string(),
            }
        }

        // Public method to check the key (without exposing it)
        pub fn verify_key(&self, key: &str) -> bool {
            self.secret_key == key
        }
    }

    // Public enum — ALL variants are public if the enum is public
    pub enum Status {
        Running,
        Stopped,
        Error(String),
    }
}

fn main() {
    let config = server::Config::new("localhost", 8080, "super_secret");
    println!("{}:{}", config.host, config.port);  // ✅ Public fields
    // println!("{}", config.secret_key);          // ❌ Private field!
    println!("Valid key: {}", config.verify_key("super_secret")); // ✅

    let status = server::Status::Running;  // ✅ Enum variants are public
}
```

**Key visibility rules:**
| Item | Default | Make Public |
|------|---------|-------------|
| Functions | Private | `pub fn` |
| Structs | Private | `pub struct` |
| Struct fields | Private | `pub field_name: Type` |
| Enums | Private | `pub enum` |
| Enum variants | Public (if enum is pub) | Automatic |
| Modules | Private | `pub mod` |

---

### 4. Multi-File Modules — Real Project Structure

For real projects, each module gets its own file. Here's how:

#### Simple Structure (one file per module)

```
my_project/
├── Cargo.toml
└── src/
    ├── main.rs        ← Entry point
    ├── config.rs      ← config module
    └── utils.rs       ← utils module
```

**src/config.rs:**
```rust
pub struct AppConfig {
    pub database_url: String,
    pub port: u16,
}

impl AppConfig {
    pub fn new(db_url: &str, port: u16) -> Self {
        AppConfig {
            database_url: db_url.to_string(),
            port,
        }
    }
}
```

**src/utils.rs:**
```rust
pub fn truncate(text: &str, max_len: usize) -> &str {
    if text.len() > max_len {
        &text[..max_len]
    } else {
        text
    }
}

pub fn slugify(text: &str) -> String {
    text.to_lowercase()
        .chars()
        .map(|c| if c.is_alphanumeric() { c } else { '-' })
        .collect()
}
```

**src/main.rs:**
```rust
// Declare modules — tells Rust to look for config.rs and utils.rs
mod config;
mod utils;

// Bring specific items into scope
use config::AppConfig;

fn main() {
    let cfg = AppConfig::new("postgres://localhost/mydb", 3000);
    println!("Server on port {}", cfg.port);
    println!("DB: {}", cfg.database_url);

    let slug = utils::slugify("Hello World! This is Rust.");
    println!("Slug: {}", slug);  // hello-world--this-is-rust-

    let short = utils::truncate("A very long string", 10);
    println!("Truncated: {}", short);  // A very lon
}
```

#### Folder Structure (module with sub-modules)

When a module gets large, turn it into a folder:

```
my_project/
├── Cargo.toml
└── src/
    ├── main.rs
    ├── models/
    │   ├── mod.rs       ← Module declaration file
    │   ├── user.rs      ← Sub-module
    │   └── product.rs   ← Sub-module
    └── services/
        ├── mod.rs
        └── auth.rs
```

**src/models/mod.rs:**
```rust
// Declare sub-modules
pub mod user;
pub mod product;

// Optionally re-export commonly used items
pub use user::User;
pub use product::Product;
```

**src/models/user.rs:**
```rust
#[derive(Debug)]
pub struct User {
    pub name: String,
    pub email: String,
}

impl User {
    pub fn new(name: &str, email: &str) -> Self {
        User {
            name: name.to_string(),
            email: email.to_string(),
        }
    }
}
```

**src/models/product.rs:**
```rust
#[derive(Debug)]
pub struct Product {
    pub name: String,
    pub price: f64,
}
```

**src/main.rs:**
```rust
mod models;
mod services;

// Thanks to re-export in mod.rs, you can use short paths:
use models::{User, Product};

fn main() {
    let user = User::new("Alice", "alice@example.com");
    println!("{:?}", user);

    let product = Product {
        name: "Widget".to_string(),
        price: 9.99,
    };
    println!("{:?}", product);
}
```

---

### 5. Crates — Packages of Code

A **crate** is Rust's term for a package/library. There are two kinds:

| Type | Purpose | Created By |
|------|---------|-----------|
| Binary crate | Program you can run | `cargo new my_app` |
| Library crate | Code others can use | `cargo new my_lib --lib` |

#### Adding External Crates

```powershell
# Add a dependency to your project
cargo add serde           # JSON serialization
cargo add serde --features derive   # With specific features
cargo add tokio --features full     # Async runtime
cargo add clap --features derive    # CLI argument parser

# This modifies your Cargo.toml:
# [dependencies]
# serde = { version = "1.0", features = ["derive"] }
# tokio = { version = "1", features = ["full"] }
```

#### Using External Crates

```rust
// After `cargo add serde --features derive`
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct User {
    name: String,
    age: u32,
}

fn main() {
    let user = User { name: "Alice".to_string(), age: 25 };
    let json = serde_json::to_string(&user).unwrap();
    println!("JSON: {}", json);
}
```

#### Where to Find Crates

- [crates.io](https://crates.io) — The official Rust package registry
- [lib.rs](https://lib.rs) — Better search and categorization
- Search by category: web, CLI, async, serialization, database, etc.

---

### 6. The Prelude — What's Available Without `use`

Rust automatically imports ("preludes") the most common items. That's why you can use these without `use`:

```rust
// These work without any imports:
let v: Vec<i32> = Vec::new();     // Vec
let s = String::from("hello");     // String
let o: Option<i32> = Some(42);     // Option, Some, None
let r: Result<i32, String> = Ok(5); // Result, Ok, Err
println!("hello");                  // println! macro
let b = Box::new(5);               // Box
```

Everything else needs an explicit `use`:
```rust
use std::collections::HashMap;      // NOT in prelude
use std::collections::HashSet;      // NOT in prelude
use std::io::{self, Read, Write};   // NOT in prelude
use std::fs;                        // NOT in prelude
```

---

## 📝 Tasks

### Task 1: Create Inline Modules

**What to do:** Create a `shapes` module with:
- A `Circle` struct (radius: f64) with a `area()` method
- A `Rectangle` struct (width: f64, height: f64) with `area()` and `perimeter()` methods
- Both structs should be public, but make the fields private — provide `new()` constructors

In `main`, create shapes and print their areas.

<details>
<summary>Click to see answer</summary>

```rust
mod shapes {
    pub struct Circle {
        radius: f64,  // Private field
    }

    impl Circle {
        pub fn new(radius: f64) -> Self {
            Circle { radius }
        }

        pub fn area(&self) -> f64 {
            std::f64::consts::PI * self.radius * self.radius
        }

        pub fn radius(&self) -> f64 {
            self.radius
        }
    }

    pub struct Rectangle {
        width: f64,
        height: f64,
    }

    impl Rectangle {
        pub fn new(width: f64, height: f64) -> Self {
            Rectangle { width, height }
        }

        pub fn area(&self) -> f64 {
            self.width * self.height
        }

        pub fn perimeter(&self) -> f64 {
            2.0 * (self.width + self.height)
        }
    }
}

use shapes::{Circle, Rectangle};

fn main() {
    let c = Circle::new(5.0);
    println!("Circle (r={}): area = {:.2}", c.radius(), c.area());

    let r = Rectangle::new(10.0, 4.0);
    println!("Rectangle: area = {:.2}, perimeter = {:.2}", r.area(), r.perimeter());

    // This would fail because fields are private:
    // let bad = shapes::Circle { radius: 5.0 };  // ❌ ERROR
}
```

**Why private fields?** You can't create a `Circle` with a negative radius because the only way to create one is through `new()`. If needed, you could add validation there.
</details>

---

### Task 2: Multi-File Project

**What to do:** Restructure your project into multiple files:

```
src/
├── main.rs
├── models.rs     (User and Product structs)
└── validation.rs (validation functions)
```

In `models.rs`:
- `User { pub name: String, pub email: String }`
- `Product { pub name: String, pub price: f64 }`
- Both with `new()` constructors and `#[derive(Debug)]`

In `validation.rs`:
- `validate_email(email: &str) -> Result<(), String>` — must contain '@' and '.'
- `validate_price(price: f64) -> Result<(), String>` — must be positive

In `main.rs`:
- Import and use both modules

<details>
<summary>Click to see answer</summary>

**src/models.rs:**
```rust
#[derive(Debug)]
pub struct User {
    pub name: String,
    pub email: String,
}

impl User {
    pub fn new(name: &str, email: &str) -> Self {
        User {
            name: name.to_string(),
            email: email.to_string(),
        }
    }
}

#[derive(Debug)]
pub struct Product {
    pub name: String,
    pub price: f64,
}

impl Product {
    pub fn new(name: &str, price: f64) -> Self {
        Product {
            name: name.to_string(),
            price,
        }
    }
}
```

**src/validation.rs:**
```rust
pub fn validate_email(email: &str) -> Result<(), String> {
    if !email.contains('@') {
        return Err(format!("Email '{}' missing '@'", email));
    }
    if !email.contains('.') {
        return Err(format!("Email '{}' missing '.'", email));
    }
    Ok(())
}

pub fn validate_price(price: f64) -> Result<(), String> {
    if price <= 0.0 {
        return Err(format!("Price must be positive, got {:.2}", price));
    }
    Ok(())
}
```

**src/main.rs:**
```rust
mod models;
mod validation;

use models::{User, Product};

fn main() {
    // Validate and create a user
    match validation::validate_email("alice@example.com") {
        Ok(()) => {
            let user = User::new("Alice", "alice@example.com");
            println!("Created: {:?}", user);
        }
        Err(e) => println!("Invalid: {}", e),
    }

    // Validate and create a product
    let price = 29.99;
    match validation::validate_price(price) {
        Ok(()) => {
            let product = Product::new("Widget", price);
            println!("Created: {:?}", product);
        }
        Err(e) => println!("Invalid: {}", e),
    }
}
```
</details>

---

### Task 3: Nested Modules with Re-exports

**What to do:** Create this structure using inline modules:

```
app
├── models
│   ├── User (struct)
│   └── Role (enum: Admin, Editor, Viewer)
├── auth
│   ├── login(username, password) -> Result<User, String>
│   └── has_permission(user, action) -> bool
└── (re-export User and Role from top level)
```

<details>
<summary>Click to see answer</summary>

```rust
mod app {
    pub mod models {
        #[derive(Debug, Clone)]
        pub struct User {
            pub username: String,
            pub role: Role,
        }

        #[derive(Debug, Clone, PartialEq)]
        pub enum Role {
            Admin,
            Editor,
            Viewer,
        }
    }

    pub mod auth {
        use super::models::{User, Role};  // `super` = parent module (app)

        pub fn login(username: &str, password: &str) -> Result<User, String> {
            // Simulated login
            match (username, password) {
                ("admin", "admin123") => Ok(User {
                    username: "admin".to_string(),
                    role: Role::Admin,
                }),
                ("editor", "edit456") => Ok(User {
                    username: "editor".to_string(),
                    role: Role::Editor,
                }),
                _ => Err(format!("Invalid credentials for '{}'", username)),
            }
        }

        pub fn has_permission(user: &User, action: &str) -> bool {
            match (&user.role, action) {
                (Role::Admin, _) => true,  // Admin can do anything
                (Role::Editor, "read") => true,
                (Role::Editor, "write") => true,
                (Role::Viewer, "read") => true,
                _ => false,
            }
        }
    }

    // Re-export commonly used items
    pub use models::{User, Role};
}

// Thanks to re-exports, we can import directly from `app`
use app::{User, Role};
use app::auth;

fn main() {
    // Login attempts
    match auth::login("admin", "admin123") {
        Ok(user) => {
            println!("Logged in as: {:?}", user);
            println!("Can delete? {}", auth::has_permission(&user, "delete"));
            println!("Can read? {}", auth::has_permission(&user, "read"));
        }
        Err(e) => println!("Login failed: {}", e),
    }

    match auth::login("editor", "edit456") {
        Ok(user) => {
            println!("\nLogged in as: {:?}", user);
            println!("Can write? {}", auth::has_permission(&user, "write"));
            println!("Can delete? {}", auth::has_permission(&user, "delete"));
        }
        Err(e) => println!("Login failed: {}", e),
    }

    match auth::login("hacker", "password") {
        Ok(user) => println!("Logged in: {:?}", user),
        Err(e) => println!("\nLogin failed: {}", e),
    }
}
```

**Key concepts:**
- `super::` refers to the parent module
- `use super::models::User` — import from sibling module via parent
- `pub use` re-exports items — users don't need to know the internal structure
- `self::` refers to the current module (rarely needed)
</details>

---

### Task 4: Adding and Using an External Crate

**What to do:** Create a new project and add the `rand` crate to generate random numbers.

```powershell
cargo new guessing_game
cd guessing_game
cargo add rand
```

Write a number guessing game:
1. Generate a random number between 1 and 100
2. Ask the user to guess (read from stdin)
3. Tell them "too high", "too low", or "correct!"
4. Count the number of attempts

<details>
<summary>Click to see answer</summary>

```rust
use rand::Rng;
use std::io;

fn main() {
    println!("=== Number Guessing Game ===");
    println!("I'm thinking of a number between 1 and 100.");

    let secret = rand::thread_rng().gen_range(1..=100);
    let mut attempts = 0;

    loop {
        println!("\nEnter your guess:");
        let mut input = String::new();
        io::stdin().read_line(&mut input).expect("Failed to read input");

        let guess: u32 = match input.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("Please enter a valid number!");
                continue;
            }
        };

        attempts += 1;

        if guess < secret {
            println!("Too low!");
        } else if guess > secret {
            println!("Too high!");
        } else {
            println!("🎉 Correct! You got it in {} attempts!", attempts);
            break;
        }
    }
}
```

**To run:** `cargo run` — Cargo automatically downloads and compiles the `rand` crate.
</details>

---

### Task 5: Understand Module Paths

**What to do:** Predict which lines compile and which don't. Then verify.

```rust
mod outer {
    pub mod inner {
        pub fn public_fn() -> &'static str { "public" }
        fn private_fn() -> &'static str { "private" }

        pub mod deep {
            pub fn deep_fn() -> &'static str { "deep" }
        }
    }

    fn outer_fn() {
        // Which of these work?
        let a = inner::public_fn();       // Line A
        let b = inner::private_fn();      // Line B
        let c = inner::deep::deep_fn();   // Line C
    }
}

fn main() {
    // Which of these work?
    let d = outer::inner::public_fn();       // Line D
    let e = outer::inner::private_fn();      // Line E
    let f = outer::inner::deep::deep_fn();   // Line F
}
```

<details>
<summary>Click to see answer</summary>

```
Line A: ✅ COMPILES — outer can access inner::public_fn (child module's pub items)
Line B: ❌ ERROR   — private_fn is private to `inner`, even parent can't access it
Line C: ✅ COMPILES — deep is pub, deep_fn is pub
Line D: ✅ COMPILES — full path to pub function through pub modules
Line E: ❌ ERROR   — private_fn is private
Line F: ✅ COMPILES — all modules and function in the path are pub
```

**Rule:** An item is accessible if:
1. It is `pub`, AND
2. Every module in the path to it is also `pub` (or you're inside that module tree)

Parent modules CANNOT access private items of child modules.
Child modules CAN access private items of parent modules (with `super::` path).
</details>

---

## 🎯 Key Takeaways

| Concept | Syntax | Purpose |
|---------|--------|---------|
| Define module | `mod name { }` | Group related code |
| Import | `use module::Item;` | Shorter paths |
| Public | `pub fn`, `pub struct` | Expose outside module |
| Private (default) | `fn`, `struct` | Hidden from outside |
| Parent module | `super::` | Access parent module's items |
| Re-export | `pub use inner::Item;` | Flatten module hierarchy |
| File module | `mod config;` (+ `config.rs`) | One file per module |
| Folder module | `mod models;` (+ `models/mod.rs`) | Module with sub-modules |
| Add crate | `cargo add crate_name` | External dependencies |
| Use crate | `use crate_name::Item;` | Import from external crate |

**Common project layout:**
```
src/
├── main.rs          (or lib.rs for libraries)
├── config.rs
├── models/
│   ├── mod.rs
│   ├── user.rs
│   └── product.rs
├── routes/
│   ├── mod.rs
│   └── api.rs
└── utils.rs
```

---

## ⏭️ Next: Section 05 - Traits & Generics

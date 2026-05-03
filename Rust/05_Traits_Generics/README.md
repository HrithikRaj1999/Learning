# Section 05: Traits & Generics

> **Prerequisites:** Complete Sections 00-04b. You should understand structs, enums, match, error handling with Result, collections, iterators, and modules.

## 🎯 Learning Objectives
- Define and implement traits (Rust's version of interfaces)
- Write generic code that works with many types
- Understand static vs dynamic dispatch and object safety
- Master common std library traits (Display, From, Debug, Clone, etc.)
- Understand `#[derive(...)]` — what it generates and when to use it
- Implement Display and From for proper error handling

---

## 📖 Core Concepts

### What Are Traits?

**Scenario:** You're building a web framework. You need to serialize responses to JSON, XML, or plain text. Different types (User, Post, Comment) all need to be serializable. Traits define this shared behavior.

```rust
// A trait defines WHAT behavior types must have
trait Serialize {
    fn to_json(&self) -> String;
    fn content_type(&self) -> &str { "application/json" } // Default impl
}
```

### Understanding `#[derive(...)]`

You've been using `#[derive(Debug)]` since Section 02. Here's what it actually does:

```rust
// When you write:
#[derive(Debug, Clone, PartialEq)]
struct Point {
    x: f64,
    y: f64,
}

// The compiler GENERATES this code automatically:
// impl fmt::Debug for Point { ... }    — enables {:?} printing
// impl Clone for Point { ... }          — enables .clone()
// impl PartialEq for Point { ... }      — enables == comparison
```

**Which traits can be derived?**

| Trait | What It Gives You | When to Use |
|-------|------------------|-------------|
| `Debug` | `{:?}` printing | Almost always — essential for debugging |
| `Clone` | `.clone()` deep copy | When you need to duplicate values |
| `Copy` | Implicit copy (no `.clone()` needed) | Small, stack-only types (requires `Clone`) |
| `PartialEq` | `==` and `!=` | When you need equality comparison |
| `Eq` | Strict equality (requires `PartialEq`) | When there are no NaN-like values |
| `Hash` | Usable as HashMap/HashSet keys | When used as keys (requires `Eq`) |
| `PartialOrd` | `<`, `>`, `<=`, `>=` | When values can be ordered |
| `Ord` | Total ordering (requires `PartialOrd + Eq`) | When ALL values are comparable |
| `Default` | `Type::default()` zero/empty value | When there's an obvious default |

```rust
// When to derive vs hand-implement:
// DERIVE when: the auto-generated behavior is correct
// HAND-IMPLEMENT when: you need custom logic

// Example: Custom Display (derive is NOT available for Display)
use std::fmt;

#[derive(Debug)]  // Debug CAN be derived
struct Temperature(f64);

// Display MUST be hand-implemented
impl fmt::Display for Temperature {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:.1}°C", self.0)
    }
}

fn main() {
    let temp = Temperature(36.6);
    println!("Debug: {:?}", temp);    // Temperature(36.6)
    println!("Display: {}", temp);    // 36.6°C
}
```

### Object Safety Rules — When Can You Use `dyn Trait`?

Not all traits can be used as `dyn Trait` (trait objects). A trait is **object-safe** if:

```rust
// ✅ Object-safe — can use as `dyn Drawable`
trait Drawable {
    fn draw(&self);           // Has &self receiver ✅
    fn name(&self) -> &str;   // Returns a reference ✅
}

// ❌ NOT object-safe — these break trait objects:
trait NotObjectSafe {
    fn new() -> Self;              // Returns Self (compiler doesn't know the size) ❌
    fn compare<T>(&self, other: T); // Generic method (can't build vtable) ❌
    fn clone_self(&self) -> Self;   // Returns Self ❌
}

// The rules:
// 1. Methods must have a receiver (&self, &mut self, self, etc.)
// 2. Methods must NOT return Self (use Box<Self> instead)
// 3. Methods must NOT be generic
// 4. The trait must NOT require Self: Sized

// Workaround for Clone-like patterns:
trait CloneBox {
    fn clone_box(&self) -> Box<dyn CloneBox>;  // Returns Box instead of Self ✅
}
```

### Display and From — Essential for Error Handling

This connects Section 03 (error handling) with traits. Here's the pattern:

```rust
use std::fmt;
use std::io;
use std::num::ParseIntError;

#[derive(Debug)]
enum AppError {
    IoError(io::Error),
    ParseError(ParseIntError),
    NotFound(String),
}

// Display — gives user-friendly error messages
impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::IoError(e) => write!(f, "I/O error: {}", e),
            AppError::ParseError(e) => write!(f, "Parse error: {}", e),
            AppError::NotFound(name) => write!(f, "'{}' not found", name),
        }
    }
}

// From<io::Error> — enables ? operator to auto-convert io::Error → AppError
impl From<io::Error> for AppError {
    fn from(e: io::Error) -> Self {
        AppError::IoError(e)
    }
}

// From<ParseIntError> — enables ? to auto-convert ParseIntError → AppError
impl From<ParseIntError> for AppError {
    fn from(e: ParseIntError) -> Self {
        AppError::ParseError(e)
    }
}

// Now ? automatically converts errors!
fn read_number_from_file(path: &str) -> Result<i32, AppError> {
    let content = std::fs::read_to_string(path)?;  // io::Error → AppError (via From)
    let number = content.trim().parse::<i32>()?;    // ParseIntError → AppError (via From)
    Ok(number)
}
```

**This is the standard Rust error handling pattern.** The crate `thiserror` automates these impl blocks with a derive macro — once you understand the manual version, use `thiserror` in production.

### Generics — Write Once, Use with Many Types

```rust
// Without generics: duplicate code for every type
fn largest_i32(list: &[i32]) -> &i32 { /* ... */ }
fn largest_f64(list: &[f64]) -> &f64 { /* ... */ }

// With generics: one function for all comparable types
fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut largest = &list[0];
    for item in &list[1..] {
        if item > largest {
            largest = item;
        }
    }
    largest
}
```

---

## 📝 Tasks

### Task 1: Defining and Implementing Traits

**What to do:** Create a Storage trait with get/set/delete/exists/keys methods, then implement it for MemoryStorage. Use it through trait object (`dyn Storage`) to demonstrate dynamic dispatch.

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::HashMap;

// Define the trait (interface)
trait Storage {
    fn get(&self, key: &str) -> Option<String>;
    fn set(&mut self, key: &str, value: &str);
    fn delete(&mut self, key: &str) -> bool;
    fn exists(&self, key: &str) -> bool {
        self.get(key).is_some() // Default implementation
    }
    fn keys(&self) -> Vec<String>;
}

// Implementation 1: In-memory storage
struct MemoryStorage {
    data: HashMap<String, String>,
}

impl MemoryStorage {
    fn new() -> Self {
        MemoryStorage { data: HashMap::new() }
    }
}

impl Storage for MemoryStorage {
    fn get(&self, key: &str) -> Option<String> {
        self.data.get(key).cloned()
    }
    
    fn set(&mut self, key: &str, value: &str) {
        self.data.insert(key.to_string(), value.to_string());
    }
    
    fn delete(&mut self, key: &str) -> bool {
        self.data.remove(key).is_some()
    }
    
    fn keys(&self) -> Vec<String> {
        self.data.keys().cloned().collect()
    }
}

// Implementation 2: Prefixed storage (wraps another storage)
struct PrefixedStorage<S: Storage> {
    inner: S,
    prefix: String,
}

impl<S: Storage> PrefixedStorage<S> {
    fn new(inner: S, prefix: &str) -> Self {
        PrefixedStorage { inner, prefix: format!("{}:", prefix) }
    }
    
    fn prefixed_key(&self, key: &str) -> String {
        format!("{}{}", self.prefix, key)
    }
}

impl<S: Storage> Storage for PrefixedStorage<S> {
    fn get(&self, key: &str) -> Option<String> {
        self.inner.get(&self.prefixed_key(key))
    }
    
    fn set(&mut self, key: &str, value: &str) {
        let key = self.prefixed_key(key);
        self.inner.set(&key, value);
    }
    
    fn delete(&mut self, key: &str) -> bool {
        let key = self.prefixed_key(key);
        self.inner.delete(&key)
    }
    
    fn keys(&self) -> Vec<String> {
        self.inner.keys().into_iter()
            .filter(|k| k.starts_with(&self.prefix))
            .map(|k| k[self.prefix.len()..].to_string())
            .collect()
    }
}

// Function that works with ANY storage implementation
fn populate_sample_data(storage: &mut dyn Storage) {
    storage.set("user:1", "Alice");
    storage.set("user:2", "Bob");
    storage.set("config:theme", "dark");
}

fn main() {
    let mut memory = MemoryStorage::new();
    populate_sample_data(&mut memory);
    
    println!("user:1 = {:?}", memory.get("user:1")); // Some("Alice")
    println!("All keys: {:?}", memory.keys());
    
    // Prefixed storage
    let mut session_store = PrefixedStorage::new(MemoryStorage::new(), "session");
    session_store.set("abc123", "user_data_here");
    println!("Session: {:?}", session_store.get("abc123")); // Some("user_data_here")
}
```

**Explanation:**
- Traits define a contract (what methods a type must have)
- Multiple types can implement the same trait differently
- Generic wrapper types (`PrefixedStorage<S>`) compose behavior
- `dyn Storage` enables runtime polymorphism (trait objects)

**Scenario:** Database drivers (PostgreSQL, SQLite, MySQL all implement a `Database` trait), caching layers, authentication providers — all use this pattern.
</details>

---

### Task 2: Trait Bounds & Generic Functions

**What to do:** Create a `ToResponseBody` trait and implement it for JSON, HTML, and plain text types. Build a generic `Response` struct that accepts any `ToResponseBody` type.

<details>
<summary>Click to see answer</summary>

```rust
use std::fmt;

// Trait for types that can be serialized to response body
trait ToResponseBody {
    fn to_body(&self) -> String;
    fn content_type(&self) -> &str;
}

// Implement for different response types
#[derive(Debug)]
struct JsonBody<T: fmt::Debug> {
    data: T,
}

impl<T: fmt::Debug> ToResponseBody for JsonBody<T> {
    fn to_body(&self) -> String {
        format!("{:?}", self.data) // Simplified; real code uses serde
    }
    fn content_type(&self) -> &str {
        "application/json"
    }
}

struct HtmlBody {
    html: String,
}

impl ToResponseBody for HtmlBody {
    fn to_body(&self) -> String {
        self.html.clone()
    }
    fn content_type(&self) -> &str {
        "text/html"
    }
}

struct PlainText(String);

impl ToResponseBody for PlainText {
    fn to_body(&self) -> String {
        self.0.clone()
    }
    fn content_type(&self) -> &str {
        "text/plain"
    }
}

// Generic response builder using trait bounds
struct Response {
    status: u16,
    headers: Vec<(String, String)>,
    body: String,
}

impl Response {
    // Static dispatch (monomorphized at compile time — zero overhead)
    fn ok<B: ToResponseBody>(body: B) -> Self {
        Response {
            status: 200,
            headers: vec![
                ("Content-Type".to_string(), body.content_type().to_string()),
            ],
            body: body.to_body(),
        }
    }
    
    fn not_found() -> Self {
        Response {
            status: 404,
            headers: vec![("Content-Type".to_string(), "text/plain".to_string())],
            body: "Not Found".to_string(),
        }
    }
    
    // Using where clause for complex bounds
    fn created<B>(body: B) -> Self 
    where 
        B: ToResponseBody + fmt::Debug 
    {
        println!("Creating response with: {:?}", body);
        Response {
            status: 201,
            headers: vec![
                ("Content-Type".to_string(), body.content_type().to_string()),
            ],
            body: body.to_body(),
        }
    }
    
    fn display(&self) {
        println!("HTTP/1.1 {}", self.status);
        for (key, value) in &self.headers {
            println!("{}: {}", key, value);
        }
        println!("\n{}", self.body);
    }
}

// Need Debug for PlainText to use with `created`
impl fmt::Debug for PlainText {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "PlainText({})", self.0)
    }
}

fn main() {
    let json_resp = Response::ok(JsonBody { data: vec!["Alice", "Bob"] });
    json_resp.display();
    
    println!("---");
    
    let html_resp = Response::ok(HtmlBody { 
        html: "<h1>Hello World</h1>".to_string() 
    });
    html_resp.display();
    
    println!("---");
    
    let created_resp = Response::created(PlainText("Resource created".to_string()));
    created_resp.display();
}
```

**Explanation:**
- `<B: ToResponseBody>` = "B must implement ToResponseBody"
- `where B: ToResponseBody + Debug` = multiple trait bounds
- Static dispatch (generics) = compiler generates specialized code for each type = zero runtime cost
- This is how Axum's `IntoResponse` trait works

**Scenario:** Web frameworks use this exact pattern. Any type that implements `IntoResponse` can be returned from a handler.
</details>

---

### Task 3: Common Standard Library Traits

**What to do:** Create a `Money` type and implement Display, Debug, From, PartialOrd, Add, and Default traits for it.

<details>
<summary>Click to see answer</summary>

```rust
use std::fmt;
use std::cmp::Ordering;

#[derive(Clone, PartialEq, Eq, Hash)]
struct Money {
    cents: i64,
    currency: Currency,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Currency {
    USD,
    EUR,
    GBP,
}

// Display — user-facing string representation
impl fmt::Display for Money {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let symbol = match self.currency {
            Currency::USD => "$",
            Currency::EUR => "€",
            Currency::GBP => "£",
        };
        let dollars = self.cents as f64 / 100.0;
        write!(f, "{}{:.2}", symbol, dollars)
    }
}

// Debug — developer-facing representation  
impl fmt::Debug for Money {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Money({} cents {:?})", self.cents, self.currency)
    }
}

// From/Into — type conversions
impl From<i64> for Money {
    fn from(cents: i64) -> Self {
        Money { cents, currency: Currency::USD }
    }
}

impl From<Money> for f64 {
    fn from(money: Money) -> f64 {
        money.cents as f64 / 100.0
    }
}

// PartialOrd/Ord — comparison (only same currency!)
impl PartialOrd for Money {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        if self.currency != other.currency {
            None // Can't compare different currencies
        } else {
            Some(self.cents.cmp(&other.cents))
        }
    }
}

// Add trait — operator overloading
impl std::ops::Add for Money {
    type Output = Result<Money, String>;
    
    fn add(self, other: Self) -> Self::Output {
        if self.currency != other.currency {
            Err(format!("Cannot add {:?} and {:?}", self.currency, other.currency))
        } else {
            Ok(Money { cents: self.cents + other.cents, currency: self.currency })
        }
    }
}

// Default trait
impl Default for Money {
    fn default() -> Self {
        Money { cents: 0, currency: Currency::USD }
    }
}

impl Money {
    fn new(dollars: f64, currency: Currency) -> Self {
        Money {
            cents: (dollars * 100.0).round() as i64,
            currency,
        }
    }
}

fn main() {
    let price = Money::new(29.99, Currency::USD);
    let tax = Money::new(2.40, Currency::USD);
    
    println!("Display: {}", price);          // $29.99
    println!("Debug: {:?}", price);          // Money(2999 cents USD)
    
    // From/Into
    let quick: Money = 500_i64.into();       // 500 cents = $5.00
    println!("From cents: {}", quick);       // $5.00
    
    // Add
    match price + tax {
        Ok(total) => println!("Total: {}", total), // $32.39
        Err(e) => println!("Error: {}", e),
    }
    
    // Comparison
    let a = Money::new(10.0, Currency::USD);
    let b = Money::new(20.0, Currency::USD);
    println!("a < b? {:?}", a.partial_cmp(&b)); // Some(Less)
    
    // Can't compare different currencies
    let eur = Money::new(10.0, Currency::EUR);
    println!("USD vs EUR: {:?}", a.partial_cmp(&eur)); // None
}
```

**Explanation:**
- `Display` = for users (`{}` format)
- `Debug` = for developers (`{:?}` format)
- `From/Into` = type conversions
- `PartialOrd` = comparison (can return None for incomparable values)
- `Add` (and other operators) = operator overloading
- `Default` = sensible zero value
- `Clone` = explicit deep copy
- `Hash + Eq` = usable as HashMap keys

**Scenario:** Domain types in any application (Money, Temperature, Distance) benefit from implementing these traits for ergonomic usage.
</details>

---

### Task 4: Trait Objects vs Generics (Static vs Dynamic Dispatch)

**What to do:** Create a `Drawable` trait and implement it for Circle and Rect. Demonstrate static dispatch (generics) vs dynamic dispatch (`Box<dyn Drawable>` in a Canvas).

<details>
<summary>Click to see answer</summary>

```rust
// === STATIC DISPATCH (Generics) ===
// Compiler generates specialized code for each type
// Pro: Zero runtime overhead, inlining possible
// Con: Larger binary, can't store mixed types in a collection

trait Drawable {
    fn draw(&self);
    fn bounds(&self) -> (f64, f64, f64, f64); // x, y, w, h
}

struct Circle { x: f64, y: f64, radius: f64 }
struct Rect { x: f64, y: f64, width: f64, height: f64 }

impl Drawable for Circle {
    fn draw(&self) { println!("Drawing circle at ({}, {}), r={}", self.x, self.y, self.radius); }
    fn bounds(&self) -> (f64, f64, f64, f64) {
        (self.x - self.radius, self.y - self.radius, self.radius * 2.0, self.radius * 2.0)
    }
}

impl Drawable for Rect {
    fn draw(&self) { println!("Drawing rect at ({}, {}), {}x{}", self.x, self.y, self.width, self.height); }
    fn bounds(&self) -> (f64, f64, f64, f64) {
        (self.x, self.y, self.width, self.height)
    }
}

// Static dispatch — compiler knows the exact type
fn draw_twice<D: Drawable>(shape: &D) {
    shape.draw();
    shape.draw();
}

// === DYNAMIC DISPATCH (Trait Objects) ===
// Uses vtable (like virtual methods in C++)
// Pro: Can store mixed types, smaller binary
// Con: Slight runtime overhead (pointer indirection)

struct Canvas {
    shapes: Vec<Box<dyn Drawable>>, // Mixed types in one collection!
}

impl Canvas {
    fn new() -> Self {
        Canvas { shapes: Vec::new() }
    }
    
    fn add(&mut self, shape: impl Drawable + 'static) {
        self.shapes.push(Box::new(shape));
    }
    
    fn draw_all(&self) {
        for shape in &self.shapes {
            shape.draw(); // Dynamic dispatch — resolved at runtime
        }
    }
    
    fn total_area(&self) -> f64 {
        self.shapes.iter()
            .map(|s| {
                let (_, _, w, h) = s.bounds();
                w * h
            })
            .sum()
    }
}

fn main() {
    // Static dispatch
    let circle = Circle { x: 10.0, y: 20.0, radius: 5.0 };
    draw_twice(&circle); // Compiler knows this is Circle::draw
    
    // Dynamic dispatch — mixed collection
    let mut canvas = Canvas::new();
    canvas.add(Circle { x: 0.0, y: 0.0, radius: 10.0 });
    canvas.add(Rect { x: 5.0, y: 5.0, width: 20.0, height: 15.0 });
    canvas.add(Circle { x: 30.0, y: 30.0, radius: 3.0 });
    
    canvas.draw_all();
    println!("Total area: {:.1}", canvas.total_area());
}
```

**Explanation:**

| | Static Dispatch (Generics) | Dynamic Dispatch (dyn Trait) |
|---|---|---|
| Speed | Fastest (inlined) | Slight overhead (vtable lookup) |
| Binary size | Larger (code duplicated per type) | Smaller |
| Collection | Can't mix types | Can mix types |
| When to use | Performance critical, known types | Plugin systems, heterogeneous collections |

**Scenario:** 
- Web middleware stack → `Vec<Box<dyn Middleware>>` (dynamic, because middleware are different types)
- Serialization → generics with `T: Serialize` (static, for zero overhead)
</details>

---

### Task 5: Supertraits and Trait Composition

**What to do:** Build a plugin system with Named, Versioned, and Plugin traits (Plugin requires the other two as supertraits). Create a PluginManager that holds a `Vec<Box<dyn Plugin>>`.

<details>
<summary>Click to see answer</summary>

```rust
use std::fmt;

// Base traits
trait Named {
    fn name(&self) -> &str;
}

trait Versioned {
    fn version(&self) -> &str;
}

// Supertrait: Plugin requires Named + Versioned + Debug
trait Plugin: Named + Versioned + fmt::Debug {
    fn initialize(&mut self) -> Result<(), String>;
    fn execute(&self, input: &str) -> String;
    fn shutdown(&self) {}  // Default: do nothing
}

// Concrete plugins
#[derive(Debug)]
struct LoggerPlugin {
    name: String,
    log_level: String,
    initialized: bool,
}

impl Named for LoggerPlugin {
    fn name(&self) -> &str { &self.name }
}

impl Versioned for LoggerPlugin {
    fn version(&self) -> &str { "1.0.0" }
}

impl Plugin for LoggerPlugin {
    fn initialize(&mut self) -> Result<(), String> {
        println!("[{}] Initializing with level: {}", self.name, self.log_level);
        self.initialized = true;
        Ok(())
    }
    
    fn execute(&self, input: &str) -> String {
        format!("[{}][{}] {}", self.log_level.to_uppercase(), self.name, input)
    }
}

#[derive(Debug)]
struct TransformPlugin {
    transform_type: String,
}

impl Named for TransformPlugin {
    fn name(&self) -> &str { "transformer" }
}

impl Versioned for TransformPlugin {
    fn version(&self) -> &str { "2.1.0" }
}

impl Plugin for TransformPlugin {
    fn initialize(&mut self) -> Result<(), String> {
        println!("[transformer] Ready for {} transforms", self.transform_type);
        Ok(())
    }
    
    fn execute(&self, input: &str) -> String {
        match self.transform_type.as_str() {
            "uppercase" => input.to_uppercase(),
            "reverse" => input.chars().rev().collect(),
            "base64" => format!("base64({})", input), // Simplified
            _ => input.to_string(),
        }
    }
}

// Plugin manager using trait objects
struct PluginManager {
    plugins: Vec<Box<dyn Plugin>>,
}

impl PluginManager {
    fn new() -> Self {
        PluginManager { plugins: Vec::new() }
    }
    
    fn register(&mut self, plugin: impl Plugin + 'static) {
        self.plugins.push(Box::new(plugin));
    }
    
    fn initialize_all(&mut self) -> Result<(), String> {
        for plugin in &mut self.plugins {
            plugin.initialize()?;
        }
        Ok(())
    }
    
    fn process(&self, input: &str) -> Vec<String> {
        self.plugins.iter()
            .map(|p| p.execute(input))
            .collect()
    }
    
    fn list_plugins(&self) {
        for plugin in &self.plugins {
            println!("  {} v{}", plugin.name(), plugin.version());
        }
    }
}

fn main() {
    let mut manager = PluginManager::new();
    
    manager.register(LoggerPlugin {
        name: "file-logger".to_string(),
        log_level: "info".to_string(),
        initialized: false,
    });
    
    manager.register(TransformPlugin {
        transform_type: "uppercase".to_string(),
    });
    
    println!("Registered plugins:");
    manager.list_plugins();
    
    println!("\nInitializing...");
    manager.initialize_all().unwrap();
    
    println!("\nProcessing 'hello world':");
    for result in manager.process("hello world") {
        println!("  → {}", result);
    }
}
```

**Explanation:**
- Supertraits (`Plugin: Named + Versioned`) compose requirements
- Plugin managers use `Vec<Box<dyn Plugin>>` for extensibility
- New plugin types can be added without modifying existing code (Open/Closed Principle)

**Scenario:** Web frameworks (middleware chains), build systems (task runners), editor plugins, database drivers — all extensible via trait objects.
</details>

---

## 🎯 Key Takeaways

| Concept | Syntax | Use Case |
|---------|--------|----------|
| Trait definition | `trait Foo { fn bar(&self); }` | Define shared behavior |
| Trait bound | `fn f<T: Display>(x: T)` | Constrain generic types |
| where clause | `where T: Clone + Debug` | Complex bounds |
| Trait object | `Box<dyn Trait>` | Mixed collections, plugins |
| Supertrait | `trait A: B + C` | Compose requirements |
| Default impl | `fn method(&self) { ... }` | Optional override |
| derive | `#[derive(Debug, Clone)]` | Auto-implement common traits |
| Object safety | No `Self` return, no generic methods | Determines if `dyn Trait` works |
| Display trait | `impl fmt::Display for T` | User-facing formatting (`{}`) |
| From trait | `impl From<A> for B` | Enables `?` auto-conversion |

---

## ⏭️ Next: Section 06 - Lifetimes & Smart Pointers

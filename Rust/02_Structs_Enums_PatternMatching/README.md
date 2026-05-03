# Section 02: Structs, Enums & Pattern Matching

> **Prerequisites:** Complete Sections 00 and 01. You should understand variables, functions, ownership, and borrowing.

## 🎯 Learning Objectives
- Create custom data types with structs
- Model "one of many" choices with enums
- Use `match` for exhaustive pattern matching
- Learn `Option<T>` as Rust's replacement for `null`
- Add methods to your types with `impl` blocks
- Introduction to `Vec<T>` — the growable array

---

## 📖 Core Concepts

### 1. Structs — Your Custom Data Types

A struct groups related data together — like an object in JavaScript or a class in Python (but with no inheritance).

```rust
// Define a struct (like a template/blueprint)
struct User {
    username: String,
    email: String,
    active: bool,
    login_count: u32,
}

fn main() {
    // Create an instance
    let user1 = User {
        username: String::from("alice"),
        email: String::from("alice@example.com"),
        active: true,
        login_count: 1,
    };

    // Access fields with dot notation
    println!("User: {}", user1.username);   // alice
    println!("Email: {}", user1.email);     // alice@example.com

    // For mutable fields, the ENTIRE variable must be mut
    let mut user2 = User {
        username: String::from("bob"),
        email: String::from("bob@example.com"),
        active: true,
        login_count: 0,
    };
    user2.login_count += 1;  // ✅ OK — user2 is mut
    println!("Bob logged in {} time(s)", user2.login_count);

    // Struct update syntax: create a new struct from an existing one
    // (copies/moves remaining fields from user2)
    let user3 = User {
        username: String::from("charlie"),
        email: String::from("charlie@example.com"),
        ..user2   // Copy active and login_count from user2
    };
    // NOTE: user2.username and user2.email were MOVED to user3
    // user2.active and user2.login_count are Copy types, so they're fine
    println!("User3: {}, active: {}", user3.username, user3.active);
}
```

### Printing Structs with `#[derive(Debug)]`

By default, you can't print a struct with `println!`. You need to add `#[derive(Debug)]`:

```rust
#[derive(Debug)]  // This line tells Rust to auto-generate debug printing
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p = Point { x: 3.0, y: 4.0 };
    println!("{:?}", p);    // Point { x: 3.0, y: 4.0 }
    println!("{:#?}", p);   // Pretty-printed (multi-line)
}
```

**What is `#[derive(...)]`?** It's an annotation that tells the compiler to automatically generate code. `Debug` generates the format for `{:?}`. You'll see `derive` used a lot. For now, just remember: add `#[derive(Debug)]` when you want to print a struct.

### Adding Methods with `impl`

```rust
struct Rectangle {
    width: f64,
    height: f64,
}

impl Rectangle {
    // "Associated function" (like a static method) — no `self`
    // Called with Rectangle::new(...)
    fn new(width: f64, height: f64) -> Self {  // Self = Rectangle
        Rectangle { width, height }  // Shorthand: field name = variable name
    }

    // Method — takes &self (borrows the struct, read-only)
    fn area(&self) -> f64 {
        self.width * self.height
    }

    // Method — takes &self (read-only)
    fn perimeter(&self) -> f64 {
        2.0 * (self.width + self.height)
    }

    // Method — takes &mut self (borrows mutably, can modify)
    fn scale(&mut self, factor: f64) {
        self.width *= factor;
        self.height *= factor;
    }

    // Method — takes self (consumes/moves the struct)
    fn into_square(self) -> Rectangle {
        let side = self.width.max(self.height);
        Rectangle::new(side, side)
    }
}

fn main() {
    let mut rect = Rectangle::new(10.0, 5.0);
    println!("Area: {}", rect.area());           // 50
    println!("Perimeter: {}", rect.perimeter()); // 30

    rect.scale(2.0);
    println!("After scale: {}x{}", rect.width, rect.height); // 20x10

    let square = rect.into_square();  // rect is MOVED, can't use it anymore
    println!("Square: {}x{}", square.width, square.height); // 20x20
    // println!("{}", rect.area());  // ❌ ERROR — rect was moved
}
```

**When to use `&self` vs `&mut self` vs `self`:**
| Signature | Meaning | Use When |
|-----------|---------|----------|
| `&self` | Borrow (read-only) | Most methods — reading data |
| `&mut self` | Mutable borrow | Modifying the struct's fields |
| `self` | Takes ownership (consumes) | Transforming into something else |

### Tuple Structs — Simple Wrappers

```rust
// Tuple structs: like tuples with a name
struct Color(u8, u8, u8);      // RGB color
struct Meters(f64);              // Distance in meters
struct Celsius(f64);             // Temperature

fn main() {
    let red = Color(255, 0, 0);
    println!("Red: ({}, {}, {})", red.0, red.1, red.2);

    let distance = Meters(100.0);
    let temp = Celsius(36.6);

    // Even though both hold f64, they're DIFFERENT types
    // You can't accidentally mix them up:
    // let wrong: Meters = temp;  // ❌ ERROR: expected Meters, found Celsius
}
```

---

### 2. Enums — One of Several Variants

An enum represents a value that can be ONE of several possible variants. Unlike enums in C or Java, Rust enums can hold DATA in each variant.

```rust
// Simple enum (like C/Java enums — no data)
enum Direction {
    North,
    South,
    East,
    West,
}

// Enum with data in variants (Rust's power feature!)
enum Shape {
    Circle { radius: f64 },                    // Named fields
    Rectangle { width: f64, height: f64 },     // Named fields
    Triangle(f64, f64, f64),                    // Tuple-style (3 sides)
}

fn main() {
    let dir = Direction::North;
    let shape = Shape::Circle { radius: 5.0 };
}
```

**Real-world usage:** Rust enums are used EVERYWHERE:
- `Option<T>` — a value that might not exist
- `Result<T, E>` — an operation that might fail (Section 03)
- HTTP methods (GET, POST, PUT, DELETE)
- CLI commands with different arguments
- UI states (Loading, Error, Success)

### 3. Pattern Matching with `match`

`match` is like a super-powered switch statement. It FORCES you to handle every possible case.

```rust
enum Direction {
    North,
    South,
    East,
    West,
}

fn describe(dir: &Direction) -> &str {
    match dir {
        Direction::North => "Going up",
        Direction::South => "Going down",
        Direction::East  => "Going right",
        Direction::West  => "Going left",
    }
    // If you forget a variant, the compiler gives an error!
    // "non-exhaustive patterns: `West` not covered"
}

fn main() {
    let dir = Direction::North;
    println!("{}", describe(&dir));  // Going up
}
```

### Matching Enums with Data

```rust
enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),
}

fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle { radius } => {
            3.14159 * radius * radius
        }
        Shape::Rectangle { width, height } => {
            width * height
        }
        Shape::Triangle(a, b, c) => {
            // Heron's formula
            let s = (a + b + c) / 2.0;
            (s * (s - a) * (s - b) * (s - c)).sqrt()
        }
    }
}

fn main() {
    let shapes = [
        Shape::Circle { radius: 5.0 },
        Shape::Rectangle { width: 10.0, height: 3.0 },
        Shape::Triangle(3.0, 4.0, 5.0),
    ];

    // Note: We can't use a regular array for mixed enums easily,
    // but we CAN because they're all the same type: Shape!
    // (We'll learn Vec for growable lists below)
}
```

### Match with Guards and Wildcards

```rust
fn classify_number(n: i32) -> &'static str {
    match n {
        0 => "zero",
        1..=9 => "single digit",         // Range pattern (1 to 9 inclusive)
        10..=99 => "double digit",
        n if n < 0 => "negative",         // Guard clause
        _ => "large number",              // _ = wildcard (matches anything)
    }
}

fn main() {
    println!("{}", classify_number(0));    // zero
    println!("{}", classify_number(7));    // single digit
    println!("{}", classify_number(42));   // double digit
    println!("{}", classify_number(-5));   // negative
    println!("{}", classify_number(100));  // large number
}
```

### `if let` — Match a Single Pattern

When you only care about ONE variant, `if let` is cleaner than a full `match`:

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn main() {
    let coin = Coin::Quarter;

    // Full match (verbose when you only care about one case)
    match &coin {
        Coin::Quarter => println!("Found a quarter!"),
        _ => {}  // Do nothing for other coins
    }

    // Cleaner with if let
    if let Coin::Quarter = &coin {
        println!("Found a quarter!");
    }
}
```

---

### 4. Option<T> — Rust's Replacement for Null

Rust has NO null, nil, None, undefined, or null pointers. Instead, it uses `Option<T>`:

```rust
// Option is defined in the standard library as:
// enum Option<T> {
//     Some(T),    // There IS a value
//     None,       // There is NO value
// }
// You don't need to import it — it's available everywhere.

fn divide(a: f64, b: f64) -> Option<f64> {
    if b == 0.0 {
        None            // Can't divide by zero
    } else {
        Some(a / b)     // Return the result wrapped in Some
    }
}

fn main() {
    // Using match to handle Option
    let result = divide(10.0, 3.0);
    match result {
        Some(value) => println!("10 / 3 = {:.2}", value),
        None => println!("Cannot divide by zero!"),
    }

    let bad_result = divide(10.0, 0.0);
    match bad_result {
        Some(value) => println!("Result: {}", value),
        None => println!("Cannot divide by zero!"),  // This prints
    }

    // Using if let (cleaner when you only care about Some)
    if let Some(value) = divide(20.0, 4.0) {
        println!("20 / 4 = {}", value);  // 5
    }

    // Common Option methods
    let some_value: Option<i32> = Some(42);
    let no_value: Option<i32> = None;

    println!("{}", some_value.unwrap());            // 42 (PANICS if None!)
    println!("{}", no_value.unwrap_or(0));           // 0 (safe default)
    println!("{}", no_value.unwrap_or_default());    // 0 (default for i32)
    println!("{}", some_value.is_some());            // true
    println!("{}", no_value.is_none());              // true
}
```

**Why is this better than null?** The compiler FORCES you to handle the None case. You can't forget. In other languages, forgetting a null check causes runtime crashes.

---

### 5. Vec<T> — The Growable Array

Arrays have a fixed size. When you need a list that can grow or shrink, use `Vec<T>`:

```rust
fn main() {
    // Create a Vec
    let mut numbers: Vec<i32> = Vec::new();  // Empty vec with type annotation
    numbers.push(1);                          // Add to the end
    numbers.push(2);
    numbers.push(3);
    println!("{:?}", numbers);  // [1, 2, 3]

    // Shorthand with vec! macro
    let mut fruits = vec!["apple", "banana", "cherry"];  // Type inferred
    println!("{:?}", fruits);  // ["apple", "banana", "cherry"]

    // Access elements
    println!("First: {}", fruits[0]);           // apple
    println!("Last: {}", fruits[fruits.len() - 1]); // cherry
    println!("Length: {}", fruits.len());        // 3

    // Safe access with .get() — returns Option<&T>
    match fruits.get(10) {
        Some(fruit) => println!("Found: {}", fruit),
        None => println!("Index 10 doesn't exist"),  // This prints
    }

    // Modify
    fruits.push("date");          // Add to end
    fruits.pop();                  // Remove from end (returns Option<T>)

    // Iterate
    for fruit in &fruits {
        println!("- {}", fruit);
    }

    // Iterate with index
    for (i, fruit) in fruits.iter().enumerate() {
        println!("{}. {}", i + 1, fruit);
    }
}
```

**When to use Array vs Vec:**
| | Array `[T; N]` | Vec `Vec<T>` |
|-|----------------|--------------|
| Size | Fixed at compile time | Can grow/shrink at runtime |
| Memory | Stack | Heap |
| Use when | Size is known and small | Size varies or unknown |
| Example | `[1, 2, 3]` | `vec![1, 2, 3]` |

---

## 📝 Tasks

### Task 1: Create a Product Struct

**What to do:** Define a `Product` struct with fields: `name` (String), `price` (f64), `in_stock` (bool). Add these methods in an `impl` block:
- `new(name: &str, price: f64) -> Self` — creates a product (in_stock defaults to true)
- `display(&self) -> String` — returns something like "Widget - $9.99 (In Stock)"
- `apply_discount(&mut self, percent: f64)` — reduces price by given percentage

Test by creating 2 products, applying a discount to one, and printing both.

<details>
<summary>Click to see answer</summary>

```rust
struct Product {
    name: String,
    price: f64,
    in_stock: bool,
}

impl Product {
    fn new(name: &str, price: f64) -> Self {
        Product {
            name: name.to_string(),
            price,
            in_stock: true,
        }
    }

    fn display(&self) -> String {
        let stock_status = if self.in_stock { "In Stock" } else { "Out of Stock" };
        format!("{} - ${:.2} ({})", self.name, self.price, stock_status)
    }

    fn apply_discount(&mut self, percent: f64) {
        self.price -= self.price * (percent / 100.0);
    }
}

fn main() {
    let mut laptop = Product::new("Laptop", 999.99);
    let phone = Product::new("Phone", 699.99);

    laptop.apply_discount(10.0);  // 10% off

    println!("{}", laptop.display()); // Laptop - $899.99 (In Stock)
    println!("{}", phone.display());  // Phone - $699.99 (In Stock)
}
```

**Why `&str` in `new()` but `String` in the struct?** The function accepts `&str` (works with both `"literal"` and `&String`). Inside, it converts to `String` because the struct needs to OWN the data. This is the standard pattern you'll see everywhere in Rust.
</details>

---

### Task 2: Traffic Light Enum

**What to do:** Create a `TrafficLight` enum with variants `Red`, `Yellow`, `Green`. Write a function `action(light: &TrafficLight) -> &str` using `match` that returns:
- Red → "Stop"
- Yellow → "Slow down"
- Green → "Go"

Also write a function `next(light: &TrafficLight) -> TrafficLight` that returns the next light in the cycle (Red → Green → Yellow → Red).

<details>
<summary>Click to see answer</summary>

```rust
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

fn action(light: &TrafficLight) -> &str {
    match light {
        TrafficLight::Red => "Stop",
        TrafficLight::Yellow => "Slow down",
        TrafficLight::Green => "Go",
    }
}

fn next(light: &TrafficLight) -> TrafficLight {
    match light {
        TrafficLight::Red => TrafficLight::Green,
        TrafficLight::Green => TrafficLight::Yellow,
        TrafficLight::Yellow => TrafficLight::Red,
    }
}

fn main() {
    let mut light = TrafficLight::Red;
    for _ in 0..6 {
        println!("Light: {} → {}", action(&light), action(&next(&light)));
        light = next(&light);
    }
}
```

**Key lesson:** `match` forces you to handle ALL variants. If you add a new variant later (e.g., `FlashingRed`), the compiler will tell you everywhere you need to update. This is one of Rust's biggest advantages over if/else chains.
</details>

---

### Task 3: Enum with Data — Calculator

**What to do:** Create an `Operation` enum with these variants:
- `Add(f64, f64)`
- `Subtract(f64, f64)`
- `Multiply(f64, f64)`
- `Divide(f64, f64)`

Write a function `calculate(op: &Operation) -> Option<f64>` that performs the operation. Return `None` for division by zero.

Test all 4 operations plus a division-by-zero case.

<details>
<summary>Click to see answer</summary>

```rust
enum Operation {
    Add(f64, f64),
    Subtract(f64, f64),
    Multiply(f64, f64),
    Divide(f64, f64),
}

fn calculate(op: &Operation) -> Option<f64> {
    match op {
        Operation::Add(a, b) => Some(a + b),
        Operation::Subtract(a, b) => Some(a - b),
        Operation::Multiply(a, b) => Some(a * b),
        Operation::Divide(a, b) => {
            if *b == 0.0 {
                None
            } else {
                Some(a / b)
            }
        }
    }
}

fn main() {
    let operations = [
        Operation::Add(10.0, 5.0),
        Operation::Subtract(10.0, 3.0),
        Operation::Multiply(4.0, 7.0),
        Operation::Divide(20.0, 4.0),
        Operation::Divide(10.0, 0.0),  // Division by zero!
    ];

    for op in &operations {
        match calculate(op) {
            Some(result) => println!("Result: {:.2}", result),
            None => println!("Error: Division by zero!"),
        }
    }
}
```

**Why `Option<f64>` instead of panicking?** In a web server, you can't crash on bad input. Returning `Option` lets the caller decide what to do (return an error response, log it, use a default). You'll learn `Result<T, E>` in Section 03 for even richer error handling.
</details>

---

### Task 4: Option<T> — Safe Lookup

**What to do:** Create a struct `Phonebook` that holds a `Vec` of `(String, String)` tuples (name, number). Implement:
- `new() -> Self` — creates empty phonebook
- `add(&mut self, name: &str, number: &str)` — adds an entry
- `find(&self, name: &str) -> Option<&str>` — finds a number by name

Test by adding 3 contacts, looking up one that exists and one that doesn't.

**Hint:** Use a `for` loop to search through the entries. Return `Some(&number)` when found, `None` if not.

<details>
<summary>Click to see answer</summary>

```rust
struct Phonebook {
    entries: Vec<(String, String)>,
}

impl Phonebook {
    fn new() -> Self {
        Phonebook {
            entries: Vec::new(),
        }
    }

    fn add(&mut self, name: &str, number: &str) {
        self.entries.push((name.to_string(), number.to_string()));
    }

    fn find(&self, name: &str) -> Option<&str> {
        for (n, number) in &self.entries {
            if n == name {
                return Some(number);  // Return reference to the number
            }
        }
        None  // Not found
    }
}

fn main() {
    let mut book = Phonebook::new();
    book.add("Alice", "555-0100");
    book.add("Bob", "555-0200");
    book.add("Charlie", "555-0300");

    // Look up existing contact
    match book.find("Bob") {
        Some(number) => println!("Bob's number: {}", number),
        None => println!("Bob not found"),
    }
    // Output: Bob's number: 555-0200

    // Look up missing contact
    match book.find("Dave") {
        Some(number) => println!("Dave's number: {}", number),
        None => println!("Dave not found"),
    }
    // Output: Dave not found

    // Using if let (cleaner for one case)
    if let Some(num) = book.find("Alice") {
        println!("Calling Alice at {}...", num);
    }
}
```

**Ownership lesson:** `find` returns `Option<&str>` (a borrowed reference). The Phonebook still owns all the data. The caller just gets a read-only view. This is zero-cost — no copying!
</details>

---

### Task 5: Predict the Output

**What to do:** Read this code carefully and predict the output. Then check the answer.

```rust
#[derive(Debug)]
enum Animal {
    Dog { name: String, tricks: u32 },
    Cat { name: String, indoor: bool },
    Fish,
}

fn describe(animal: &Animal) -> String {
    match animal {
        Animal::Dog { name, tricks } if *tricks > 5 => {
            format!("{} is a talented dog ({} tricks!)", name, tricks)
        }
        Animal::Dog { name, tricks } => {
            format!("{} is a dog learning {} tricks", name, tricks)
        }
        Animal::Cat { name, indoor: true } => {
            format!("{} is an indoor cat", name)
        }
        Animal::Cat { name, indoor: false } => {
            format!("{} is an outdoor cat", name)
        }
        Animal::Fish => "Just a fish".to_string(),
    }
}

fn main() {
    let pets = vec![
        Animal::Dog { name: String::from("Rex"), tricks: 10 },
        Animal::Dog { name: String::from("Buddy"), tricks: 3 },
        Animal::Cat { name: String::from("Whiskers"), indoor: true },
        Animal::Cat { name: String::from("Shadow"), indoor: false },
        Animal::Fish,
    ];

    for pet in &pets {
        println!("{}", describe(pet));
    }
}
```

<details>
<summary>Click to see output</summary>

```
Rex is a talented dog (10 tricks!)
Buddy is a dog learning 3 tricks
Whiskers is an indoor cat
Shadow is an outdoor cat
Just a fish
```

**Key points:**
- Guard clause `if *tricks > 5` is checked FIRST for the Dog variant
- If the guard fails, Rust falls through to the next Dog pattern
- `indoor: true` and `indoor: false` match specific boolean values
- All 3 enum variants (Dog, Cat, Fish) are covered — compile succeeds
</details>

---

### Task 6: Vec Operations — Build a Grade Tracker

**What to do:** Create a `GradeTracker` struct that stores student grades as `Vec<(String, f64)>` (name, grade). Implement:
- `new() -> Self`
- `add_grade(&mut self, name: &str, grade: f64)`
- `average(&self) -> Option<f64>` — returns None if no grades
- `highest(&self) -> Option<(&str, f64)>` — returns the student with the highest grade
- `count_passing(&self, threshold: f64) -> u32` — count grades >= threshold

<details>
<summary>Click to see answer</summary>

```rust
struct GradeTracker {
    grades: Vec<(String, f64)>,
}

impl GradeTracker {
    fn new() -> Self {
        GradeTracker { grades: Vec::new() }
    }

    fn add_grade(&mut self, name: &str, grade: f64) {
        self.grades.push((name.to_string(), grade));
    }

    fn average(&self) -> Option<f64> {
        if self.grades.is_empty() {
            return None;
        }
        let mut sum = 0.0;
        for (_, grade) in &self.grades {
            sum += grade;
        }
        Some(sum / self.grades.len() as f64)
    }

    fn highest(&self) -> Option<(&str, f64)> {
        if self.grades.is_empty() {
            return None;
        }
        let mut best_name = &self.grades[0].0;
        let mut best_grade = self.grades[0].1;

        for (name, grade) in &self.grades {
            if *grade > best_grade {
                best_name = name;
                best_grade = *grade;
            }
        }
        Some((best_name, best_grade))
    }

    fn count_passing(&self, threshold: f64) -> u32 {
        let mut count = 0;
        for (_, grade) in &self.grades {
            if *grade >= threshold {
                count += 1;
            }
        }
        count
    }
}

fn main() {
    let mut tracker = GradeTracker::new();

    // Empty tracker
    match tracker.average() {
        Some(avg) => println!("Average: {:.1}", avg),
        None => println!("No grades yet"),  // This prints
    }

    tracker.add_grade("Alice", 92.5);
    tracker.add_grade("Bob", 78.0);
    tracker.add_grade("Charlie", 88.5);
    tracker.add_grade("Diana", 95.0);
    tracker.add_grade("Eve", 65.0);

    match tracker.average() {
        Some(avg) => println!("Class average: {:.1}", avg),
        None => println!("No grades"),
    }
    // Output: Class average: 83.8

    match tracker.highest() {
        Some((name, grade)) => println!("Highest: {} ({:.1})", name, grade),
        None => println!("No grades"),
    }
    // Output: Highest: Diana (95.0)

    println!("Passing (>= 80): {}", tracker.count_passing(80.0));
    // Output: Passing (>= 80): 3
}
```
</details>

---

## 🧪 Mini-Project: Task Manager

**What to build:** A simple in-memory task manager that demonstrates structs, enums, Vec, Option, and match working together.

<details>
<summary>Click to see complete project</summary>

```rust
#[derive(Debug)]
enum Priority {
    Low,
    Medium,
    High,
}

#[derive(Debug)]
enum Status {
    Todo,
    InProgress,
    Done,
}

#[derive(Debug)]
struct Task {
    id: u32,
    title: String,
    priority: Priority,
    status: Status,
}

impl Task {
    fn new(id: u32, title: &str, priority: Priority) -> Self {
        Task {
            id,
            title: title.to_string(),
            priority,
            status: Status::Todo,
        }
    }

    fn display(&self) -> String {
        let priority_label = match self.priority {
            Priority::Low => "LOW",
            Priority::Medium => "MED",
            Priority::High => "HIGH",
        };

        let status_icon = match self.status {
            Status::Todo => "[ ]",
            Status::InProgress => "[~]",
            Status::Done => "[x]",
        };

        format!("{} #{} [{}] {}", status_icon, self.id, priority_label, self.title)
    }
}

struct TaskManager {
    tasks: Vec<Task>,
    next_id: u32,
}

impl TaskManager {
    fn new() -> Self {
        TaskManager {
            tasks: Vec::new(),
            next_id: 1,
        }
    }

    fn add(&mut self, title: &str, priority: Priority) -> u32 {
        let id = self.next_id;
        self.tasks.push(Task::new(id, title, priority));
        self.next_id += 1;
        println!("  Added task #{}: {}", id, title);
        id
    }

    fn complete(&mut self, id: u32) -> bool {
        for task in &mut self.tasks {
            if task.id == id {
                task.status = Status::Done;
                println!("  Completed task #{}: {}", id, task.title);
                return true;
            }
        }
        println!("  Task #{} not found!", id);
        false
    }

    fn start(&mut self, id: u32) -> bool {
        for task in &mut self.tasks {
            if task.id == id {
                task.status = Status::InProgress;
                println!("  Started task #{}: {}", id, task.title);
                return true;
            }
        }
        println!("  Task #{} not found!", id);
        false
    }

    fn find(&self, id: u32) -> Option<&Task> {
        for task in &self.tasks {
            if task.id == id {
                return Some(task);
            }
        }
        None
    }

    fn list_all(&self) {
        if self.tasks.is_empty() {
            println!("  No tasks!");
            return;
        }
        for task in &self.tasks {
            println!("  {}", task.display());
        }
    }

    fn count_by_status(&self) -> (u32, u32, u32) {
        let mut todo = 0;
        let mut in_progress = 0;
        let mut done = 0;
        for task in &self.tasks {
            match task.status {
                Status::Todo => todo += 1,
                Status::InProgress => in_progress += 1,
                Status::Done => done += 1,
            }
        }
        (todo, in_progress, done)
    }
}

fn main() {
    let mut manager = TaskManager::new();

    println!("=== Adding Tasks ===");
    manager.add("Learn ownership", Priority::High);
    manager.add("Build web server", Priority::Medium);
    manager.add("Write documentation", Priority::Low);
    manager.add("Add error handling", Priority::High);

    println!("\n=== All Tasks ===");
    manager.list_all();

    println!("\n=== Working ===");
    manager.start(1);
    manager.complete(1);
    manager.start(2);

    println!("\n=== Updated Tasks ===");
    manager.list_all();

    println!("\n=== Find Task ===");
    match manager.find(3) {
        Some(task) => println!("  Found: {}", task.display()),
        None => println!("  Not found!"),
    }

    let (todo, wip, done) = manager.count_by_status();
    println!("\n=== Summary ===");
    println!("  Todo: {}, In Progress: {}, Done: {}", todo, wip, done);
}
```
</details>

---

## 🎯 Key Takeaways

| Concept | Syntax | When to Use |
|---------|--------|-------------|
| Struct | `struct Name { field: Type }` | Grouping related data |
| `impl` block | `impl Name { fn method(&self) {} }` | Adding behavior to structs/enums |
| `#[derive(Debug)]` | Put above struct/enum | When you need to print with `{:?}` |
| Enum | `enum Name { Variant1, Variant2(Data) }` | Value is one of several kinds |
| `match` | `match value { Pattern => result }` | Handle all enum variants (exhaustive) |
| `if let` | `if let Pattern = value { }` | Handle just one variant |
| `Option<T>` | `Some(value)` or `None` | Value that might not exist (replaces null) |
| `Vec<T>` | `vec![1, 2, 3]` or `Vec::new()` | Growable list of items |

---

## ⏭️ Next: Section 03 - Error Handling (Result<T, E>)

# Section 00: What is Rust? — Installation, Setup & First Program

## 🎯 Learning Objectives
- Understand what Rust is and why it was created
- Install Rust and set up your development environment (Windows/Mac/Linux)
- Create, build, and run your first Rust project using Cargo
- Learn ALL basic syntax: variables, types, functions, if/else, loops, arrays, tuples
- Understand how to read Rust compiler errors

---

## 📖 What is Rust?

Rust is a programming language created by Mozilla in 2010 (version 1.0 released in 2015). It solves a problem no other language solved before:

**"How do you write code that is as fast as C/C++ but as safe as Python/Java?"**

### The Problem Rust Solves

| Language | Fast? | Memory Safe? | No Garbage Collector? |
|----------|-------|-------------|----------------------|
| C/C++ | Yes | No (crashes, security bugs) | Yes |
| Python/Java/JS | No | Yes (garbage collector) | No |
| **Rust** | **Yes** | **Yes (compiler checks)** | **Yes** |

Rust achieves memory safety through its **ownership system** — the compiler checks your code at compile time and rejects programs that could crash or have security bugs. No runtime overhead, no garbage collector.

### Where is Rust Used in the Real World?

- **Web Servers**: Discord rebuilt their message system in Rust (handles millions of messages)
- **Cloud Infrastructure**: AWS uses Rust for Firecracker (runs Lambda/Fargate)
- **CLI Tools**: `ripgrep` (10x faster than grep), `bat`, `fd`, `exa` — all Rust
- **Web Browsers**: Firefox's CSS engine (Stylo) is written in Rust
- **Databases**: parts of Cloudflare's infrastructure
- **Operating Systems**: Linux kernel now accepts Rust code

---

## 📝 Step 1: Install Rust

### Windows (Your Current OS)

1. Go to [https://rustup.rs](https://rustup.rs)
2. Download and run `rustup-init.exe`
3. Press `1` for default installation
4. Open a NEW terminal (PowerShell or Command Prompt)

```powershell
# Verify installation
rustc --version
# Should show something like: rustc 1.XX.0

cargo --version
# Should show something like: cargo 1.XX.0

# Install helpful tools
rustup component add clippy     # Linter (finds common mistakes)
rustup component add rustfmt    # Code formatter
```

### What Did We Just Install?

| Tool | What It Does | Analogy |
|------|-------------|---------|
| `rustc` | The Rust compiler — turns your code into a program | Like `gcc` for C |
| `cargo` | Build system + package manager | Like `npm` for Node.js or `pip` for Python |
| `rustup` | Manages Rust versions | Like `nvm` for Node.js |
| `clippy` | Linter — warns about bad patterns | Like `eslint` for JavaScript |
| `rustfmt` | Formats your code consistently | Like `prettier` for JavaScript |

---

## 📝 Step 2: Create Your First Project

```powershell
# Navigate to your learning folder
cd C:\Learning\Rust

# Create a new project
cargo new hello_rust

# This creates:
# hello_rust/
# ├── Cargo.toml      (project config — like package.json)
# └── src/
#     └── main.rs      (your code starts here)
```

### Understanding Cargo.toml

```toml
[package]
name = "hello_rust"          # Your project name
version = "0.1.0"            # Your version number
edition = "2021"             # Rust edition (always use latest)

[dependencies]               # External libraries go here (empty for now)
# serde = "1.0"             # Example: uncomment to add a library
```

### Understanding main.rs

```rust
// This is a comment — the compiler ignores it

// fn = "function" keyword
// main = special function name — this is where your program STARTS
// () = no parameters
// { } = the function body
fn main() {
    // println! is a MACRO (the ! means macro, not a regular function)
    // Macros are like functions but they can do things functions can't
    // For now, just know: println! prints text to the screen
    println!("Hello, world!");
}
```

### How to Run Your Code

```powershell
cd hello_rust

# Method 1: Build AND run in one command (use this most often)
cargo run
# Output: Hello, world!

# Method 2: Just build (creates the program but doesn't run it)
cargo build
# The program is at: target/debug/hello_rust.exe

# Method 3: Check for errors without building (fastest)
cargo check

# Method 4: Run tests
cargo test

# Method 5: Build optimized release version
cargo build --release
# The program is at: target/release/hello_rust.exe
```

---

## 📝 Step 3: Variables and Data Types

### Variables with `let`

```rust
fn main() {
    // Rust uses `let` to create variables
    // Variables are IMMUTABLE (can't change) by default
    let name = "Alice";        // &str type (string slice)
    let age = 25;              // i32 type (32-bit integer) — Rust guesses the type
    let height = 5.7;          // f64 type (64-bit float)
    let is_student = true;     // bool type

    println!("Name: {}", name);
    println!("Age: {}", age);
    println!("Height: {}", height);
    println!("Student: {}", is_student);

    // This FAILS — variables are immutable by default:
    // age = 26;  // ERROR: cannot assign twice to immutable variable

    // Use `mut` to make a variable mutable (changeable)
    let mut score = 0;
    println!("Score: {}", score);  // 0
    score = 10;
    println!("Score: {}", score);  // 10
    score += 5;
    println!("Score: {}", score);  // 15
}
```

**Why are variables immutable by default?**
In web servers handling thousands of requests, accidental mutation causes bugs. Immutability-by-default forces you to be intentional about what changes.

### Type Annotations

```rust
fn main() {
    // Rust can guess types, but you CAN be explicit:
    let x: i32 = 42;          // 32-bit signed integer
    let y: f64 = 3.14;        // 64-bit float
    let active: bool = true;   // boolean
    let letter: char = 'A';   // single character (Unicode)

    // Integer types — choose based on what range you need:
    let small: i8 = 127;         // -128 to 127
    let medium: i32 = 2_000_000; // use _ for readability (same as 2000000)
    let big: i64 = 9_000_000_000;
    let huge: i128 = 999_999_999_999_999;
    let positive_only: u32 = 42; // u = unsigned (no negative numbers)
    let index: usize = 0;        // usize = pointer-sized (for array indices)

    // Float types
    let pi: f64 = 3.14159;    // 64-bit (default, most common)
    let approx: f32 = 3.14;   // 32-bit (less precision, less memory)

    println!("x={}, y={}, active={}, letter={}", x, y, active, letter);
}
```

### Constants

```rust
fn main() {
    // `const` = truly constant, known at compile time, MUST have type annotation
    const MAX_USERS: u32 = 10_000;
    const PI: f64 = 3.14159;
    const APP_NAME: &str = "My Rust App";

    // const vs let:
    // - const: computed at compile time, can be global, MUST have type
    // - let: computed at runtime, only inside functions, type can be inferred

    println!("{} supports {} users", APP_NAME, MAX_USERS);
}

// Constants can be declared OUTSIDE functions (global scope)
const VERSION: &str = "1.0.0";
```

---

## 📝 Step 4: Basic Data Structures

### Tuples — Fixed-size collection of different types

```rust
fn main() {
    // A tuple groups multiple values of different types
    let person: (&str, i32, bool) = ("Alice", 25, true);

    // Access elements by position (0-indexed)
    println!("Name: {}", person.0);    // Alice
    println!("Age: {}", person.1);     // 25
    println!("Active: {}", person.2);  // true

    // Destructuring — unpack into separate variables
    let (name, age, active) = person;
    println!("{} is {} years old", name, age);

    // Tuples are useful for returning multiple values from functions
    let (min, max) = find_min_max(5, 10);
    println!("Min: {}, Max: {}", min, max);
}

fn find_min_max(a: i32, b: i32) -> (i32, i32) {
    if a < b {
        (a, b)   // No `return` keyword needed — last expression is returned
    } else {
        (b, a)
    }
}
```

### Arrays — Fixed-size collection of same type

```rust
fn main() {
    // Arrays have a FIXED size, known at compile time
    let numbers: [i32; 5] = [1, 2, 3, 4, 5];  // [type; size]
    let zeros = [0; 10];  // Creates [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    // Access by index
    println!("First: {}", numbers[0]);   // 1
    println!("Last: {}", numbers[4]);    // 5
    println!("Length: {}", numbers.len()); // 5

    // Iterate over an array
    for num in &numbers {
        print!("{} ", num);
    }
    println!();  // newline

    // WARNING: Out-of-bounds access panics (crashes) at runtime
    // println!("{}", numbers[99]);  // PANIC! index out of bounds
}
```

---

## 📝 Step 5: Functions

```rust
// Functions are declared with `fn`
// Parameters MUST have type annotations
// Return type comes after ->

// Simple function — no return value
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

// Function that returns a value
fn add(a: i32, b: i32) -> i32 {
    a + b    // NO semicolon = this is the return value (expression)
    // Same as: return a + b;
}

// IMPORTANT: Expressions vs Statements
// Expression = produces a value (no semicolon): `a + b`, `5`, `if x > 0 { 1 } else { 0 }`
// Statement  = does NOT produce a value (has semicolon): `let x = 5;`
fn double(x: i32) -> i32 {
    x * 2    // Expression — returned automatically
    // x * 2;  // Adding ; makes it a statement — ERROR: expected i32, got ()
}

// Function with multiple return points
fn classify_age(age: u32) -> &'static str {
    if age < 13 {
        "child"        // Each branch returns a value
    } else if age < 18 {
        "teenager"
    } else if age < 65 {
        "adult"
    } else {
        "senior"
    }
}

fn main() {
    greet("World");                              // Hello, World!
    println!("3 + 4 = {}", add(3, 4));          // 3 + 4 = 7
    println!("double(5) = {}", double(5));       // double(5) = 10
    println!("Age 25 = {}", classify_age(25));   // Age 25 = adult
}
```

---

## 📝 Step 6: Control Flow — if/else, loops

### if/else

```rust
fn main() {
    let temperature = 35;

    // Basic if/else
    if temperature > 30 {
        println!("It's hot!");
    } else if temperature > 20 {
        println!("It's pleasant.");
    } else {
        println!("It's cold.");
    }

    // if as an EXPRESSION (like ternary operator in other languages)
    let status = if temperature > 30 { "hot" } else { "not hot" };
    println!("Weather is {}", status);

    // IMPORTANT: Both branches must return the SAME type
    // let bad = if true { 5 } else { "hello" };  // ERROR: different types
}
```

### Loops

```rust
fn main() {
    // === for loop (most common) ===
    // Iterating over a range
    for i in 0..5 {
        print!("{} ", i);    // 0 1 2 3 4
    }
    println!();

    for i in 1..=5 {        // ..= means inclusive
        print!("{} ", i);    // 1 2 3 4 5
    }
    println!();

    // Iterating over an array
    let fruits = ["apple", "banana", "cherry"];
    for fruit in &fruits {
        println!("I like {}", fruit);
    }

    // With index
    for (index, fruit) in fruits.iter().enumerate() {
        println!("{}. {}", index + 1, fruit);
    }

    // === while loop ===
    let mut count = 0;
    while count < 3 {
        println!("Count: {}", count);
        count += 1;    // Rust has NO ++ operator, use += 1
    }

    // === loop (infinite loop with break) ===
    let mut total = 0;
    let result = loop {
        total += 1;
        if total >= 10 {
            break total * 2;  // `break` can return a value!
        }
    };
    println!("Result: {}", result);  // 20

    // === continue and break ===
    for i in 0..10 {
        if i % 2 == 0 {
            continue;  // Skip even numbers
        }
        if i > 7 {
            break;     // Stop at 7
        }
        print!("{} ", i);  // 1 3 5 7
    }
    println!();
}
```

---

## 📝 Step 7: Strings — The Two Types

```rust
fn main() {
    // Rust has TWO string types. This confuses beginners. Here's why:

    // Type 1: &str (string slice) — BORROWED, immutable, fixed-size
    // - Lives in the program binary OR borrows from a String
    // - Very efficient (just a pointer + length)
    let greeting: &str = "Hello, world!";  // String literal → &str

    // Type 2: String — OWNED, growable, heap-allocated
    // - You can modify it, append to it, etc.
    // - Lives on the heap (dynamic memory)
    let mut name = String::from("Alice");  // Create from literal
    name.push_str(" Smith");                // Append text
    name.push('!');                         // Append single char
    println!("{}", name);                   // Alice Smith!

    // Converting between them:
    let s1: String = "hello".to_string();     // &str → String
    let s2: String = String::from("hello");   // &str → String (same thing)
    let s3: &str = &s1;                       // String → &str (borrowing)
    let s4: &str = s1.as_str();               // String → &str (explicit)

    // When to use which?
    // - Function PARAMETERS: use &str (accepts both String and &str)
    // - Function RETURN / struct fields: use String (you own the data)
    // - String literals in code: &str (automatic)

    // Common string operations
    let text = "Hello, Rust World!";
    println!("Length: {}", text.len());                 // 18
    println!("Contains 'Rust': {}", text.contains("Rust")); // true
    println!("Uppercase: {}", text.to_uppercase());     // HELLO, RUST WORLD!
    println!("Replace: {}", text.replace("World", "Dev")); // Hello, Rust Dev!
    println!("Starts with: {}", text.starts_with("Hello")); // true

    // Splitting
    for word in text.split_whitespace() {
        print!("[{}] ", word);  // [Hello,] [Rust] [World!]
    }
    println!();

    // String formatting
    let age = 25;
    let formatted = format!("Name: {}, Age: {}", name, age);
    println!("{}", formatted);
}
```

---

## 📝 Step 8: Printing and Formatting

```rust
fn main() {
    let name = "Rust";
    let version = 2021;
    let pi = 3.14159;

    // Basic printing
    println!("Hello!");                           // Print with newline
    print!("No newline ");                        // Print without newline
    print!("here\n");                             // Manual newline with \n
    eprintln!("This goes to stderr");             // Error output

    // Placeholder formatting with {}
    println!("Language: {}", name);               // Rust
    println!("{} edition {}", name, version);     // Rust edition 2021

    // Number formatting
    println!("Pi: {:.2}", pi);                    // 3.14 (2 decimal places)
    println!("Pi: {:.4}", pi);                    // 3.1416 (4 decimal places)
    println!("Padded: {:>10}", name);             //       Rust (right-aligned, width 10)
    println!("Padded: {:<10}|", name);            // Rust      | (left-aligned)
    println!("Padded: {:^10}|", name);            //    Rust   | (centered)
    println!("Zeroed: {:05}", 42);                // 00042 (zero-padded)
    println!("Hex: {:x}", 255);                   // ff
    println!("Binary: {:b}", 10);                 // 1010

    // Debug printing with {:?} — works with any type that has Debug
    let numbers = [1, 2, 3, 4, 5];
    println!("Debug: {:?}", numbers);             // [1, 2, 3, 4, 5]
    println!("Pretty: {:#?}", numbers);           // Multi-line formatted

    // The dbg! macro — prints expression AND its value (for debugging)
    let x = 5;
    let y = dbg!(x * 2);  // Prints: [src/main.rs:XX] x * 2 = 10
    // y is now 10
}
```

---

## 📝 Step 9: Reading Compiler Errors

Rust's compiler gives the BEST error messages of any language. Learning to read them is essential.

```rust
// Example 1: Type mismatch
fn add(a: i32, b: i32) -> i32 {
    a + b;  // BUG: semicolon makes this a statement, returns ()
}
// Error message:
// error[E0308]: mismatched types
//  --> src/main.rs:2:33
//   |
// 2 | fn add(a: i32, b: i32) -> i32 {
//   |    ---                    ^^^ expected `i32`, found `()`
//   |
//   = help: try removing the semicolon
//
// FIX: Remove the semicolon: `a + b` (not `a + b;`)

// Example 2: Immutable variable
fn main() {
    let x = 5;
    x = 10;
}
// Error message:
// error[E0384]: cannot assign twice to immutable variable `x`
//  --> src/main.rs:3:5
//   |
// 2 |     let x = 5;
//   |         - first assignment
// 3 |     x = 10;
//   |     ^^^^^^ cannot assign twice to immutable variable
//   |
//   = help: consider making this binding mutable: `let mut x`
//
// FIX: Change to `let mut x = 5;`

// HOW TO READ ERROR MESSAGES:
// 1. Read the FIRST line — it tells you the error type
// 2. Look at the --> line — it shows the exact file and line number
// 3. Read the ^^^ markers — they point to the exact problem
// 4. Read the "help:" line — Rust often tells you EXACTLY how to fix it
// 5. Google the error code (e.g., E0308) for detailed explanation
```

### Useful Cargo Commands for Debugging

```powershell
cargo check          # Fast error checking (no compilation)
cargo clippy         # More detailed warnings and suggestions
cargo build 2>&1     # See all errors (redirect stderr)
rustc --explain E0308  # Detailed explanation of any error code
```

---

## 🧪 Practice Tasks

### Task 1: Variables and Printing
**What to do:** Create a new file `src/main.rs`. Declare variables for your name, age, favorite number, and whether you like Rust. Print them all in a formatted sentence.

**Expected output:**
```
My name is [your_name], I am [age] years old.
My favorite number is [number] and I like Rust: [true/false]
```

Try it yourself first, then check the answer below.

<details>
<summary>Click to see answer</summary>

```rust
fn main() {
    let name = "Alex";
    let age = 25;
    let favorite_number = 42;
    let likes_rust = true;

    println!("My name is {}, I am {} years old.", name, age);
    println!("My favorite number is {} and I like Rust: {}", favorite_number, likes_rust);
}
```
</details>

---

### Task 2: Functions and If/Else
**What to do:** Write a function `grade(score: u32) -> &'static str` that returns:
- "A" for 90-100
- "B" for 80-89
- "C" for 70-79
- "D" for 60-69
- "F" for below 60

Call it from `main()` with different scores and print results.

<details>
<summary>Click to see answer</summary>

```rust
fn grade(score: u32) -> &'static str {
    if score >= 90 {
        "A"
    } else if score >= 80 {
        "B"
    } else if score >= 70 {
        "C"
    } else if score >= 60 {
        "D"
    } else {
        "F"
    }
}

fn main() {
    let scores = [95, 85, 72, 63, 45];
    for score in &scores {
        println!("Score {} = Grade {}", score, grade(*score));
    }
}
```
</details>

---

### Task 3: Loops and Arrays
**What to do:** Create an array of 10 numbers. Write a loop that:
1. Prints each number
2. Calculates the sum
3. Finds the largest number
4. Counts how many are even

Print all four results.

<details>
<summary>Click to see answer</summary>

```rust
fn main() {
    let numbers = [23, 7, 45, 12, 89, 34, 56, 3, 67, 41];

    let mut sum = 0;
    let mut largest = numbers[0];
    let mut even_count = 0;

    println!("Numbers:");
    for &num in &numbers {
        print!("{} ", num);
        sum += num;
        if num > largest {
            largest = num;
        }
        if num % 2 == 0 {
            even_count += 1;
        }
    }

    println!("\nSum: {}", sum);
    println!("Largest: {}", largest);
    println!("Even count: {}", even_count);
}
```
</details>

---

### Task 4: Strings
**What to do:** Write a function `shout(text: &str) -> String` that takes a string and returns it in UPPERCASE with "!!!" at the end. Also write a function `word_count(text: &str) -> usize` that counts words in a string.

<details>
<summary>Click to see answer</summary>

```rust
fn shout(text: &str) -> String {
    let mut result = text.to_uppercase();
    result.push_str("!!!");
    result
}

fn word_count(text: &str) -> usize {
    text.split_whitespace().count()
}

fn main() {
    let message = "hello rust world";
    println!("{}", shout(message));          // HELLO RUST WORLD!!!
    println!("Word count: {}", word_count(message)); // 3

    let empty = "";
    println!("Empty word count: {}", word_count(empty)); // 0
}
```
</details>

---

### Task 5: Temperature Converter
**What to do:** Write two functions:
- `celsius_to_fahrenheit(c: f64) -> f64` (formula: F = C × 9/5 + 32)
- `fahrenheit_to_celsius(f: f64) -> f64` (formula: C = (F - 32) × 5/9)

Print a conversion table from 0°C to 100°C in steps of 10.

<details>
<summary>Click to see answer</summary>

```rust
fn celsius_to_fahrenheit(c: f64) -> f64 {
    c * 9.0 / 5.0 + 32.0
}

fn fahrenheit_to_celsius(f: f64) -> f64 {
    (f - 32.0) * 5.0 / 9.0
}

fn main() {
    println!("{:>8} {:>10}", "Celsius", "Fahrenheit");
    println!("{}", "-".repeat(20));

    let mut c = 0.0;
    while c <= 100.0 {
        println!("{:>8.1} {:>10.1}", c, celsius_to_fahrenheit(c));
        c += 10.0;
    }

    println!("\nVerify: 212°F = {:.1}°C", fahrenheit_to_celsius(212.0));
}
```
</details>

---

## 🎯 Key Takeaways

| Concept | Syntax | Example |
|---------|--------|---------|
| Variable | `let x = value;` | `let age = 25;` |
| Mutable variable | `let mut x = value;` | `let mut score = 0;` |
| Constant | `const NAME: Type = value;` | `const MAX: u32 = 100;` |
| Function | `fn name(param: Type) -> ReturnType { }` | `fn add(a: i32, b: i32) -> i32 { a + b }` |
| Print | `println!("text {}", var);` | `println!("Age: {}", age);` |
| Debug print | `println!("{:?}", var);` | `println!("{:?}", array);` |
| If/else | `if cond { } else { }` | `if x > 5 { "big" } else { "small" }` |
| For loop | `for item in collection { }` | `for i in 0..10 { }` |
| While loop | `while cond { }` | `while x < 10 { x += 1; }` |
| Array | `let arr: [Type; size] = [values];` | `let nums: [i32; 3] = [1,2,3];` |
| Tuple | `let t: (T1, T2) = (v1, v2);` | `let pos = (10, 20);` |
| String literal | `"text"` → `&str` | `let s = "hello";` |
| Owned string | `String::from("text")` | `let s = String::from("hello");` |

---

## ⏭️ Next: Section 01 - Ownership, Borrowing & Types (Rust's UNIQUE feature)

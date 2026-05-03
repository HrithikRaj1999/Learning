# Section 01: Ownership, Borrowing & Types

> **Prerequisites:** Complete Section 00 first. You should know how to create a project with `cargo new`, declare variables, write functions, and use if/else and loops.

## 🎯 Learning Objectives
- Understand Rust's ownership model (the #1 concept that makes Rust unique)
- Master borrowing rules (`&T` and `&mut T`)
- Know the difference between types that COPY vs types that MOVE
- Understand `String` vs `&str` deeply

---

## 📖 Core Concepts

### What is Ownership?

**Scenario:** Imagine you have a physical book. Only ONE person can own it at a time. You can:
1. **Move** it — give it to someone else (you no longer have it)
2. **Lend** it — let someone read it temporarily (borrow)
3. **Copy** it — make a photocopy (only for cheap-to-copy items like numbers)

This is EXACTLY how Rust manages memory — without a garbage collector!

### The Three Ownership Rules

```rust
fn main() {
    // Rule 1: Each value has exactly ONE owner
    let s1 = String::from("hello"); // s1 owns the string "hello" on the heap

    // Rule 2: When the owner goes out of scope, the value is dropped (freed)
    {
        let s2 = String::from("world");
        println!("{}", s2); // s2 is valid here
    } // ← s2 goes out of scope here, memory is freed automatically

    // Rule 3: Ownership can be transferred (this is called a "move")
    let s3 = s1; // s1's ownership MOVES to s3. s1 is now INVALID.
    println!("{}", s3); // ✅ Works — s3 owns the data
    // println!("{}", s1); // ❌ ERROR — s1 was moved, it no longer owns anything
}
```

### Copy vs Move — Which Types Do What?

This is a crucial distinction that confuses beginners:

```rust
fn main() {
    // COPY types: integers, floats, booleans, chars
    // These are small and cheap, so Rust copies them automatically
    let a: i32 = 5;
    let b = a;       // a is COPIED to b (both are valid!)
    println!("a={}, b={}", a, b); // ✅ Works! Both valid.

    // MOVE types: String, Vec, HashMap, and most heap-allocated types
    // These are expensive to copy, so Rust MOVES them
    let s1 = String::from("hello");
    let s2 = s1;     // s1 is MOVED to s2 (s1 is now invalid!)
    // println!("{}", s1); // ❌ ERROR: value used after move
    println!("{}", s2); // ✅ Works
}
```

**Why?** Integers live on the stack (8 bytes, cheap to copy). Strings live on the heap (could be megabytes). Copying a String means allocating new heap memory, which is expensive. Rust makes you do it explicitly with `.clone()`.

### Borrowing — Using Without Owning

```rust
fn main() {
    let s1 = String::from("hello");

    // Immutable borrow: &T — you can READ but not modify
    let len = calculate_length(&s1);  // &s1 borrows s1
    println!("'{}' has length {}", s1, len); // ✅ s1 is still valid!

    // Mutable borrow: &mut T — you can READ and MODIFY
    let mut s2 = String::from("hello");
    add_world(&mut s2);  // &mut s2 borrows s2 mutably
    println!("{}", s2);  // "hello world"
}

fn calculate_length(s: &str) -> usize {
    s.len()
    // s goes out of scope, but it doesn't own the data, so nothing is freed
}

fn add_world(s: &mut String) {
    s.push_str(" world");
}
```

### The Two Borrowing Rules

```
Rule 1: You can have MANY immutable borrows (&T) at the same time
        (multiple readers is safe)

Rule 2: You can have exactly ONE mutable borrow (&mut T) at a time
        AND no immutable borrows at the same time
        (one writer, no readers during writing)

These rules prevent data races at COMPILE TIME.
```

### Why Does This Matter in Real Work?

| Problem in Other Languages | How Rust Prevents It |
|---------------------------|---------------------|
| Memory leak (forgot to free) | Owner drops value automatically at end of scope |
| Use-after-free (dangling pointer) | Compiler rejects code that uses moved values |
| Data race (two threads modify same data) | Borrowing rules prevent shared mutable access |
| Null pointer dereference | No null! Use `Option<T>` instead (covered in Section 02) |

---

## 📝 Tasks

> **How to practice:** For each task, create the code in your project's `src/main.rs`, try to fix it yourself, then check the answer.

### Task 1: Fix the Immutability Error

**What to do:** This code has ONE error. Find it and fix it.

```rust
fn main() {
    let x = 5;
    println!("x is {}", x);
    x = 10;
    println!("x is now {}", x);
}
```

**What you should see:** The compiler error says "cannot assign twice to immutable variable."

<details>
<summary>Click to see the fix</summary>

```rust
fn main() {
    let mut x = 5;     // Add `mut` keyword
    println!("x is {}", x);   // 5
    x = 10;
    println!("x is now {}", x); // 10
}
```

**Why:** Variables in Rust are immutable by default. Add `mut` when you intend to change the value later. This is a safety feature — in a web server handling requests, you don't want accidental mutations.
</details>

---

### Task 2: Fix the Move Error

**What to do:** This code tries to use `name` after it was moved. Fix it TWO different ways.

```rust
fn main() {
    let name = String::from("Rustacean");
    let name2 = name;
    println!("Original: {}", name);   // ERROR: value used after move
    println!("Copy: {}", name2);
}
```

<details>
<summary>Click to see Fix #1 — Clone</summary>

```rust
fn main() {
    let name = String::from("Rustacean");
    let name2 = name.clone();  // Make a deep copy (both are independent)
    println!("Original: {}", name);   // ✅ Works
    println!("Copy: {}", name2);      // ✅ Works
}
```

**When to use clone:** When you truly need two independent copies of the data. This allocates new heap memory.
</details>

<details>
<summary>Click to see Fix #2 — Borrow</summary>

```rust
fn main() {
    let name = String::from("Rustacean");
    let name2 = &name;   // Borrow instead of move (name2 is a reference)
    println!("Original: {}", name);   // ✅ Works
    println!("Ref: {}", name2);       // ✅ Works
}
```

**When to use borrowing:** When you just need to READ the data. No new memory allocated. This is the preferred approach.
</details>

---

### Task 3: Fix the Borrowing Conflict

**What to do:** This code violates the borrowing rules. Understand the error and fix it.

```rust
fn main() {
    let mut numbers = vec![1, 2, 3];
    let first = &numbers[0];     // Immutable borrow of numbers
    numbers.push(4);              // Mutable borrow of numbers (push modifies)
    println!("First is: {}", first); // ERROR: using immutable borrow after mutable borrow
}
```

**Why it fails:** `first` holds an immutable borrow of `numbers`. Then `numbers.push(4)` tries to mutably borrow `numbers`. You can't have both at the same time. Also, `push` might reallocate the Vec's memory, making `first` point to freed memory!

<details>
<summary>Click to see fix</summary>

```rust
fn main() {
    let mut numbers = vec![1, 2, 3];

    // Fix: Use the immutable borrow BEFORE the mutable borrow
    let first = &numbers[0];
    println!("First is: {}", first);  // Use it immediately
    // first is no longer used after this line, so its borrow ends

    numbers.push(4);  // Now safe — no active immutable borrows
    println!("Numbers: {:?}", numbers); // [1, 2, 3, 4]
}
```

**Real-world scenario:** In a web server, this rule prevents a bug where one handler reads from a cache while another handler modifies it. Rust catches it at compile time instead of causing intermittent crashes.
</details>

---

### Task 4: Fix the Function Ownership Problem

**What to do:** This function takes ownership of the String, so the caller can't use it anymore. Fix the function signature so it borrows instead.

```rust
fn print_length(s: String) {
    println!("'{}' has {} characters", s, s.len());
}

fn main() {
    let message = String::from("Hello, Rust!");
    print_length(message);
    println!("Message was: {}", message);  // ERROR: message was moved
}
```

<details>
<summary>Click to see fix</summary>

```rust
fn print_length(s: &str) {  // Changed: String → &str (borrow instead of own)
    println!("'{}' has {} characters", s, s.len());
}

fn main() {
    let message = String::from("Hello, Rust!");
    print_length(&message);                    // Pass a reference
    println!("Message was: {}", message);      // ✅ message still valid!
}
```

**Rule of thumb for function parameters:**
- Accept `&str` instead of `String` (works with both types, doesn't take ownership)
- Accept `&[T]` instead of `Vec<T>` (same idea for lists)
- Only take ownership (`String`, `Vec<T>`) when the function needs to STORE or CONSUME the data
</details>

---

### Task 5: Predict the Output — Shadowing

**What to do:** Read this code carefully and predict what it prints. Then run it to verify.

```rust
fn main() {
    let x = 5;
    let x = x + 1;       // Shadowing: creates a NEW variable named x
    let x = x * 2;       // Shadowing again
    println!("x = {}", x);

    let spaces = "   ";          // &str type
    let spaces = spaces.len();   // Now usize type! Shadowing allows type change
    println!("spaces = {}", spaces);
}
```

<details>
<summary>Click to see answer</summary>

```
x = 12      (5 → 6 → 12)
spaces = 3  (3 spaces → .len() = 3)
```

**Shadowing vs `mut`:**
- `mut` lets you change the VALUE but NOT the TYPE
- Shadowing (`let x = ...` again) creates a NEW variable — can change the TYPE
- Common use: parse a string to a number: `let port = "8080"; let port: u16 = port.parse().unwrap();`
</details>

---

### Task 6: Write a Function That Borrows Correctly

**What to do:** Write a function called `longest` that takes two `&str` parameters and returns the longer one. If they're equal length, return the first one.

Test with:
```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = String::from("world!!");
    let result = longest(&s1, &s2);
    println!("Longest: {}", result);  // Should print: world!!
}
```

<details>
<summary>Hint</summary>

The function signature needs a **lifetime annotation** because it returns a reference. For now, write it like this:
```rust
fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
```
Don't worry about understanding `'a` yet — lifetimes are covered in Section 06. Just know it tells the compiler "the returned reference lives as long as the shorter input."
</details>

<details>
<summary>Click to see answer</summary>

```rust
fn longest<'a>(s1: &'a str, s2: &'a str) -> &'a str {
    if s1.len() >= s2.len() {
        s1
    } else {
        s2
    }
}

fn main() {
    let s1 = String::from("hello");
    let s2 = String::from("world!!");
    let result = longest(&s1, &s2);
    println!("Longest: {}", result);  // world!!

    // Also works with string literals
    let result2 = longest("short", "much longer text");
    println!("Longest: {}", result2);  // much longer text
}
```
</details>

---

### Task 7: Ownership in a Loop

**What to do:** This code has a bug. The `name` variable gets moved into the function on the first iteration, so the second iteration fails. Fix it.

```rust
fn greet(name: String) {
    println!("Hello, {}!", name);
}

fn main() {
    let name = String::from("Alice");
    for _ in 0..3 {
        greet(name);  // ERROR on second iteration: name was moved
    }
}
```

<details>
<summary>Click to see fix</summary>

```rust
// Best fix: Change the function to borrow
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    let name = String::from("Alice");
    for _ in 0..3 {
        greet(&name);  // Borrow each time — name stays valid
    }
}
```

**Alternative fix (if you can't change the function):**
```rust
fn greet(name: String) {
    println!("Hello, {}!", name);
}

fn main() {
    let name = String::from("Alice");
    for _ in 0..3 {
        greet(name.clone());  // Clone each time — works but allocates memory
    }
}
```

**Real-world scenario:** In a web server, request handlers are called thousands of times with shared config data. You MUST borrow, not clone, for performance.
</details>

---

## 🧪 Mini-Project: String Analyzer

**What to build:** A program that takes a sentence and reports statistics about it.

**Requirements:**
1. Create a function `count_words(text: &str) -> usize` — count words
2. Create a function `count_chars(text: &str) -> usize` — count characters (not bytes)
3. Create a function `longest_word(text: &str) -> &str` — find the longest word
4. Create a function `contains_word(text: &str, word: &str) -> bool` — check if word exists
5. All functions should BORROW the input (not take ownership)

**Expected output:**
```
Text: "the quick brown fox jumps over the lazy dog"
Words: 9
Characters: 35
Longest word: "jumps"
Contains "fox": true
Contains "cat": false
```

<details>
<summary>Click to see complete solution</summary>

```rust
fn count_words(text: &str) -> usize {
    text.split_whitespace().count()
}

fn count_chars(text: &str) -> usize {
    text.chars().count()  // chars() handles Unicode correctly
}

fn longest_word(text: &str) -> &str {
    let mut longest = "";
    for word in text.split_whitespace() {
        if word.len() > longest.len() {
            longest = word;
        }
    }
    longest
}

fn contains_word(text: &str, word: &str) -> bool {
    for w in text.split_whitespace() {
        if w == word {
            return true;
        }
    }
    false
}

fn main() {
    let text = "the quick brown fox jumps over the lazy dog";

    println!("Text: \"{}\"", text);
    println!("Words: {}", count_words(text));
    println!("Characters: {}", count_chars(text));
    println!("Longest word: \"{}\"", longest_word(text));
    println!("Contains \"fox\": {}", contains_word(text, "fox"));
    println!("Contains \"cat\": {}", contains_word(text, "cat"));
}
```

**Ownership lesson:** Notice that `text` is used in 5 function calls — this is only possible because every function BORROWS with `&str`. If any function took `String` instead, the code wouldn't compile.
</details>

---

## 🎯 Key Takeaways

| Concept | What Happens | When to Use |
|---------|-------------|-------------|
| `let s2 = s1;` (Move) | `s1` becomes invalid | When transferring ownership intentionally |
| `let s2 = s1.clone();` (Clone) | Deep copy, both valid | When you need two independent copies |
| `let s2 = &s1;` (Borrow) | `s1` stays valid, `s2` reads | Most function parameters (preferred!) |
| `let s2 = &mut s1;` (Mut Borrow) | `s2` can modify `s1`'s data | When function needs to modify data |
| Copy types (`i32`, `bool`, etc.) | Automatically copied | Small stack values — no move needed |

**The #1 Rule:** When writing functions, **borrow by default** (`&str`, `&[T]`). Only take ownership when the function needs to store or consume the data.

---

## ⏭️ Next: Section 02 - Structs, Enums & Pattern Matching

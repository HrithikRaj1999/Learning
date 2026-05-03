# Section 03: Error Handling — Result<T, E> & the ? Operator

> **Prerequisites:** Complete Sections 00-02. You should understand structs, enums, match, Option<T>, and Vec.

## 🎯 Learning Objectives
- Master `Result<T, E>` for operations that can fail
- Use the `?` operator for clean error propagation
- Create custom error types with enums
- Know when to panic vs return errors
- Understand `unwrap()`, `expect()`, and why to avoid them in production

---

## 📖 Core Concepts

### Why Error Handling Matters

**Scenario:** You're building a web API. A user sends a request to fetch their profile. What can go wrong?
- Invalid authentication token → 401
- User not found → 404
- Database connection failed → 500

In Python/JavaScript, you'd use try/catch and might forget to handle an error. In Rust, errors are part of the TYPE SYSTEM — the compiler won't let you forget.

### Result<T, E> — Success or Failure

`Result` is an enum (just like `Option`!) built into the language:

```rust
// Result is defined as:
// enum Result<T, E> {
//     Ok(T),    // Success — contains the value
//     Err(E),   // Failure — contains the error
// }

fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err(String::from("Cannot divide by zero"))  // Return error
    } else {
        Ok(a / b)  // Return success
    }
}

fn main() {
    // Handle Result with match (just like Option!)
    match divide(10.0, 3.0) {
        Ok(result) => println!("10 / 3 = {:.2}", result),
        Err(error) => println!("Error: {}", error),
    }

    match divide(10.0, 0.0) {
        Ok(result) => println!("Result: {}", result),
        Err(error) => println!("Error: {}", error),  // This prints
    }
}
```

### Option vs Result — When to Use Which

| Type | Meaning | Example |
|------|---------|---------|
| `Option<T>` | Value might not exist (no error info) | Looking up a key in a list |
| `Result<T, E>` | Operation can fail (WITH error info) | Parsing a number, reading a file |

```rust
// Option — "Is there a value?"
fn find_user(id: u32) -> Option<String> {
    if id == 1 { Some(String::from("Alice")) }
    else { None }  // No error info — just "not found"
}

// Result — "Did this work? If not, WHY?"
fn parse_age(input: &str) -> Result<u32, String> {
    match input.trim().parse::<u32>() {
        Ok(age) => {
            if age > 150 {
                Err(format!("Age {} is unrealistic", age))
            } else {
                Ok(age)
            }
        }
        Err(_) => Err(format!("'{}' is not a valid number", input)),
    }
}

fn main() {
    println!("{:?}", parse_age("25"));      // Ok(25)
    println!("{:?}", parse_age("abc"));     // Err("'abc' is not a valid number")
    println!("{:?}", parse_age("200"));     // Err("Age 200 is unrealistic")
}
```

### Panic vs Result

| Approach | When to Use | What Happens |
|----------|-------------|--------------|
| `panic!("msg")` | Bugs that should NEVER happen | Program crashes immediately |
| `Result<T, E>` | Expected failures (bad input, missing data) | Caller decides what to do |
| `.unwrap()` | Quick prototyping ONLY | Panics if Err/None — BAD in production! |
| `.expect("msg")` | Like unwrap but with a message | Slightly better error message, still panics |

```rust
fn main() {
    // unwrap() — DANGEROUS in production (panics on error)
    let num: i32 = "42".parse().unwrap();   // Ok → 42
    // let bad: i32 = "abc".parse().unwrap();  // Err → PANIC! Program crashes!

    // expect() — same as unwrap but with better panic message
    let num: i32 = "42".parse().expect("Failed to parse number");

    // In production code, ALWAYS handle errors properly:
    match "42".parse::<i32>() {
        Ok(n) => println!("Got: {}", n),
        Err(e) => println!("Parse failed: {}", e),
    }
}
```

---

### The ? Operator — Clean Error Propagation

The `?` operator is the most important error handling tool in Rust:

```rust
// WITHOUT ? — verbose and nested
fn get_user_age_verbose(input: &str) -> Result<String, String> {
    let age_result = input.parse::<u32>();
    match age_result {
        Ok(age) => {
            if age < 18 {
                Err(String::from("Must be 18 or older"))
            } else {
                Ok(format!("Age: {}", age))
            }
        }
        Err(_) => Err(format!("'{}' is not a number", input)),
    }
}

// WITH ? — clean and readable
fn get_user_age_clean(input: &str) -> Result<String, String> {
    let age: u32 = input.parse()
        .map_err(|_| format!("'{}' is not a number", input))?;
    //                                                        ^ If Err, return early
    //                                                          If Ok, unwrap the value

    if age < 18 {
        return Err(String::from("Must be 18 or older"));
    }

    Ok(format!("Age: {}", age))
}
```

**What does `?` do exactly?**
1. If the Result is `Ok(value)` → extracts `value` and continues
2. If the Result is `Err(e)` → returns `Err(e)` from the current function immediately

**Important:** You can only use `?` in a function that returns `Result` (or `Option`).

```rust
// ❌ This WON'T compile — main() returns () not Result
// fn main() {
//     let num: i32 = "42".parse()?;  // ERROR: ? needs Result return type
// }

// ✅ Two ways to fix:
// Fix 1: Return Result from main
fn main() -> Result<(), String> {
    let num: i32 = "42".parse().map_err(|e| format!("{}", e))?;
    println!("num = {}", num);
    Ok(())  // Must return Ok at the end
}
```

---

### Custom Error Types

Use an enum to define your own error types — just like you learned in Section 02:

```rust
#[derive(Debug)]
enum LoginError {
    EmptyUsername,
    EmptyPassword,
    UserNotFound(String),
    WrongPassword,
    AccountLocked { username: String, until: String },
}

fn login(username: &str, password: &str) -> Result<String, LoginError> {
    if username.is_empty() {
        return Err(LoginError::EmptyUsername);
    }
    if password.is_empty() {
        return Err(LoginError::EmptyPassword);
    }
    if username == "locked_user" {
        return Err(LoginError::AccountLocked {
            username: username.to_string(),
            until: "2025-01-01".to_string(),
        });
    }
    if username != "alice" {
        return Err(LoginError::UserNotFound(username.to_string()));
    }
    if password != "secret123" {
        return Err(LoginError::WrongPassword);
    }
    Ok(format!("Welcome back, {}!", username))
}

fn main() {
    let attempts = [
        ("", "pass"),
        ("alice", ""),
        ("bob", "pass"),
        ("alice", "wrong"),
        ("locked_user", "pass"),
        ("alice", "secret123"),
    ];

    for (user, pass) in &attempts {
        match login(user, pass) {
            Ok(msg) => println!("✓ {}", msg),
            Err(LoginError::EmptyUsername) => println!("✗ Username is required"),
            Err(LoginError::EmptyPassword) => println!("✗ Password is required"),
            Err(LoginError::UserNotFound(name)) => println!("✗ User '{}' not found", name),
            Err(LoginError::WrongPassword) => println!("✗ Incorrect password"),
            Err(LoginError::AccountLocked { username, until }) => {
                println!("✗ Account '{}' locked until {}", username, until);
            }
        }
    }
}
```

---

### Useful Result Methods

```rust
fn main() {
    let ok_val: Result<i32, String> = Ok(42);
    let err_val: Result<i32, String> = Err(String::from("oops"));

    // unwrap_or — provide a default value
    println!("{}", ok_val.unwrap_or(0));    // 42
    println!("{}", err_val.unwrap_or(0));   // 0

    // is_ok / is_err — check without consuming
    println!("ok? {}", ok_val.is_ok());     // true
    println!("err? {}", err_val.is_err());  // true

    // map_err — transform the error type
    let result: Result<i32, String> = "abc".parse::<i32>()
        .map_err(|e| format!("Parse failed: {}", e));
    println!("{:?}", result);  // Err("Parse failed: invalid digit found in string")
}
```

---

## 📝 Tasks

### Task 1: Basic Result — Parse and Validate

**What to do:** Write a function `parse_score(input: &str) -> Result<u32, String>` that:
1. Parses the string to a number (return error if not a number)
2. Checks the number is between 0 and 100 (return error if out of range)
3. Returns the valid score

Test with: "85", "abc", "150", "-5", "0", "100"

<details>
<summary>Click to see answer</summary>

```rust
fn parse_score(input: &str) -> Result<u32, String> {
    let trimmed = input.trim();

    // Parse to number
    let score: u32 = match trimmed.parse() {
        Ok(n) => n,
        Err(_) => return Err(format!("'{}' is not a valid number", trimmed)),
    };

    // Validate range
    if score > 100 {
        return Err(format!("Score {} is out of range (0-100)", score));
    }

    Ok(score)
}

fn main() {
    let inputs = ["85", "abc", "150", "-5", "0", "100"];

    for input in &inputs {
        match parse_score(input) {
            Ok(score) => println!("✓ {} → {}", input, score),
            Err(e) => println!("✗ {} → {}", input, e),
        }
    }
}
```

Output:
```
✓ 85 → 85
✗ abc → 'abc' is not a valid number
✗ 150 → Score 150 is out of range (0-100)
✗ -5 → '-5' is not a valid number  (u32 can't be negative!)
✓ 0 → 0
✓ 100 → 100
```

**Note:** "-5" fails at the parse step because `u32` doesn't support negative numbers. If you used `i32`, you'd need a separate negative check.
</details>

---

### Task 2: Custom Error Enum

**What to do:** Create a `SignupError` enum and a `signup(username: &str, password: &str, age: u32) -> Result<String, SignupError>` function with these validations:
- Username must be 3-20 characters → `UsernameTooShort` or `UsernameTooLong`
- Password must be at least 8 characters → `PasswordTooShort`
- Age must be 13 or older → `TooYoung(u32)` (include the age in the error)
- If all pass, return Ok with a welcome message

Test with several inputs including edge cases.

<details>
<summary>Click to see answer</summary>

```rust
#[derive(Debug)]
enum SignupError {
    UsernameTooShort,
    UsernameTooLong,
    PasswordTooShort,
    TooYoung(u32),
}

fn signup(username: &str, password: &str, age: u32) -> Result<String, SignupError> {
    if username.len() < 3 {
        return Err(SignupError::UsernameTooShort);
    }
    if username.len() > 20 {
        return Err(SignupError::UsernameTooLong);
    }
    if password.len() < 8 {
        return Err(SignupError::PasswordTooShort);
    }
    if age < 13 {
        return Err(SignupError::TooYoung(age));
    }
    Ok(format!("Welcome, {}! Account created.", username))
}

fn main() {
    let cases = [
        ("ab", "password123", 25),    // username too short
        ("averylongusernamethatexceedslimit", "pass123", 25),  // too long
        ("alice", "short", 25),        // password too short
        ("alice", "password123", 10),  // too young
        ("alice", "password123", 25),  // success!
    ];

    for (user, pass, age) in &cases {
        match signup(user, pass, *age) {
            Ok(msg) => println!("✓ {}", msg),
            Err(SignupError::UsernameTooShort) => {
                println!("✗ Username must be at least 3 characters")
            }
            Err(SignupError::UsernameTooLong) => {
                println!("✗ Username must be 20 characters or fewer")
            }
            Err(SignupError::PasswordTooShort) => {
                println!("✗ Password must be at least 8 characters")
            }
            Err(SignupError::TooYoung(age)) => {
                println!("✗ Must be 13+ to sign up (you're {})", age)
            }
        }
    }
}
```
</details>

---

### Task 3: The ? Operator — Chain Validations

**What to do:** Write a function `process_order(item: &str, qty_str: &str, price_str: &str) -> Result<String, String>` that:
1. Validates `item` is not empty
2. Parses `qty_str` to a `u32` (use `?` with `map_err`)
3. Parses `price_str` to a `f64` (use `?` with `map_err`)
4. Validates quantity is between 1 and 100
5. Validates price is positive
6. Returns a formatted order summary

The key goal: practice using `?` to keep the code flat instead of nested.

<details>
<summary>Click to see answer</summary>

```rust
fn process_order(item: &str, qty_str: &str, price_str: &str) -> Result<String, String> {
    // Validate item name
    if item.trim().is_empty() {
        return Err(String::from("Item name cannot be empty"));
    }

    // Parse quantity — ? returns early if Err
    let quantity: u32 = qty_str.trim().parse()
        .map_err(|_| format!("Invalid quantity: '{}'", qty_str))?;

    // Parse price
    let price: f64 = price_str.trim().parse()
        .map_err(|_| format!("Invalid price: '{}'", price_str))?;

    // Validate ranges
    if quantity < 1 || quantity > 100 {
        return Err(format!("Quantity must be 1-100, got {}", quantity));
    }
    if price <= 0.0 {
        return Err(format!("Price must be positive, got {:.2}", price));
    }

    // All validations passed!
    let total = quantity as f64 * price;
    Ok(format!("Order: {} x {} @ ${:.2} = ${:.2}", quantity, item, price, total))
}

fn main() {
    let orders = [
        ("Widget", "5", "9.99"),
        ("", "5", "9.99"),           // empty item
        ("Gadget", "abc", "9.99"),   // bad quantity
        ("Gadget", "5", "xyz"),      // bad price
        ("Gadget", "200", "9.99"),   // quantity too high
        ("Gadget", "5", "-1.00"),    // negative price
    ];

    for (item, qty, price) in &orders {
        match process_order(item, qty, price) {
            Ok(summary) => println!("✓ {}", summary),
            Err(e) => println!("✗ {}", e),
        }
    }
}
```

Output:
```
✓ Order: 5 x Widget @ $9.99 = $49.95
✗ Item name cannot be empty
✗ Invalid quantity: 'abc'
✗ Invalid price: 'xyz'
✗ Quantity must be 1-100, got 200
✗ Price must be positive, got -1.00
```

**Key lesson:** Without `?`, you'd need nested `match` statements for each parse. With `?`, the code reads top-to-bottom like a checklist. This is the "happy path" pattern — each line either succeeds or bails out early.
</details>

---

### Task 4: Multi-Step Processing with ?

**What to do:** Write a `Calculator` struct that processes a string like "10 + 5" and returns the result. Create a `CalcError` enum with variants for different failures.

Steps:
1. Split the input into 3 parts (number, operator, number)
2. Parse both numbers
3. Execute the operation (support +, -, *, /)
4. Handle division by zero

Use `?` to chain the steps.

<details>
<summary>Click to see answer</summary>

```rust
#[derive(Debug)]
enum CalcError {
    BadFormat,
    BadNumber(String),
    UnknownOperator(String),
    DivisionByZero,
}

fn calculate(input: &str) -> Result<f64, CalcError> {
    // Step 1: Split into parts
    let parts: Vec<&str> = input.trim().split_whitespace().collect();
    if parts.len() != 3 {
        return Err(CalcError::BadFormat);
    }

    // Step 2: Parse numbers
    let left: f64 = parts[0].parse()
        .map_err(|_| CalcError::BadNumber(parts[0].to_string()))?;
    let right: f64 = parts[2].parse()
        .map_err(|_| CalcError::BadNumber(parts[2].to_string()))?;

    // Step 3: Execute operation
    let operator = parts[1];
    match operator {
        "+" => Ok(left + right),
        "-" => Ok(left - right),
        "*" => Ok(left * right),
        "/" => {
            if right == 0.0 {
                Err(CalcError::DivisionByZero)
            } else {
                Ok(left / right)
            }
        }
        _ => Err(CalcError::UnknownOperator(operator.to_string())),
    }
}

fn main() {
    let expressions = [
        "10 + 5",
        "20 - 8",
        "6 * 7",
        "15 / 3",
        "10 / 0",
        "abc + 5",
        "10 % 3",
        "just_text",
    ];

    for expr in &expressions {
        match calculate(expr) {
            Ok(result) => println!("  {} = {}", expr, result),
            Err(CalcError::BadFormat) => {
                println!("  '{}' → Error: expected format 'NUM OP NUM'", expr)
            }
            Err(CalcError::BadNumber(s)) => {
                println!("  '{}' → Error: '{}' is not a number", expr, s)
            }
            Err(CalcError::UnknownOperator(op)) => {
                println!("  '{}' → Error: unknown operator '{}'", expr, op)
            }
            Err(CalcError::DivisionByZero) => {
                println!("  '{}' → Error: division by zero", expr)
            }
        }
    }
}
```

**Note:** This uses `.split_whitespace().collect()` to get a `Vec<&str>`. We'll cover iterators in depth in Section 04 — for now, just know that `.collect()` gathers results into a collection.
</details>

---

### Task 5: Converting Between Option and Result

**What to do:** Write a function `find_and_parse(data: &[(String, String)], key: &str) -> Result<i32, String>` that:
1. Searches for `key` in the data (returns error if not found)
2. Parses the corresponding value as `i32` (returns error if invalid)

This practices converting `Option` (from the search) to `Result` (which the function returns).

**Hint:** Use `Option`'s `.ok_or()` method to convert `None` into an `Err`.

<details>
<summary>Click to see answer</summary>

```rust
fn find_and_parse(data: &[(String, String)], key: &str) -> Result<i32, String> {
    // Step 1: Find the key — returns Option
    let mut found_value: Option<&str> = None;
    for (k, v) in data {
        if k == key {
            found_value = Some(v);
            break;
        }
    }

    // Step 2: Convert Option to Result with ok_or
    let value_str = found_value
        .ok_or(format!("Key '{}' not found", key))?;
    //     ^^^^^^ Option → Result: None becomes Err, Some(v) becomes Ok(v)

    // Step 3: Parse the value
    let number: i32 = value_str.parse()
        .map_err(|_| format!("Value '{}' for key '{}' is not a number", value_str, key))?;

    Ok(number)
}

fn main() {
    let config = vec![
        (String::from("port"), String::from("8080")),
        (String::from("timeout"), String::from("30")),
        (String::from("name"), String::from("my_app")),
    ];

    // Success
    match find_and_parse(&config, "port") {
        Ok(port) => println!("Port: {}", port),        // Port: 8080
        Err(e) => println!("Error: {}", e),
    }

    // Key not found
    match find_and_parse(&config, "missing") {
        Ok(v) => println!("Value: {}", v),
        Err(e) => println!("Error: {}", e),             // Key 'missing' not found
    }

    // Key exists but value isn't a number
    match find_and_parse(&config, "name") {
        Ok(v) => println!("Value: {}", v),
        Err(e) => println!("Error: {}", e),             // Value 'my_app' ... not a number
    }
}
```

**Key methods for Option ↔ Result conversion:**
| Method | From | To | Purpose |
|--------|------|-------|---------|
| `.ok_or(err)` | `Option<T>` | `Result<T, E>` | None → Err(err) |
| `.ok_or_else(|| err)` | `Option<T>` | `Result<T, E>` | Same but lazy error |
| `.ok()` | `Result<T, E>` | `Option<T>` | Err → None (discards error) |
</details>

---

## 🧪 Mini-Project: Student Grade Calculator

**What to build:** A program that processes student grades, handles errors for invalid input, and produces a class report.

<details>
<summary>Click to see complete project</summary>

```rust
#[derive(Debug)]
enum GradeError {
    EmptyName,
    InvalidScore(String),
    ScoreOutOfRange(f64),
}

#[derive(Debug)]
struct Student {
    name: String,
    score: f64,
}

impl Student {
    fn grade_letter(&self) -> &str {
        if self.score >= 90.0 { "A" }
        else if self.score >= 80.0 { "B" }
        else if self.score >= 70.0 { "C" }
        else if self.score >= 60.0 { "D" }
        else { "F" }
    }

    fn passed(&self) -> bool {
        self.score >= 60.0
    }
}

fn parse_student(name: &str, score_str: &str) -> Result<Student, GradeError> {
    let name = name.trim();
    if name.is_empty() {
        return Err(GradeError::EmptyName);
    }

    let score: f64 = score_str.trim().parse()
        .map_err(|_| GradeError::InvalidScore(score_str.to_string()))?;

    if score < 0.0 || score > 100.0 {
        return Err(GradeError::ScoreOutOfRange(score));
    }

    Ok(Student {
        name: name.to_string(),
        score,
    })
}

fn main() {
    // Raw input data (some valid, some invalid)
    let raw_data = [
        ("Alice", "92"),
        ("Bob", "78"),
        ("Charlie", "abc"),     // invalid score
        ("", "85"),             // empty name
        ("Diana", "105"),       // out of range
        ("Eve", "65"),
        ("Frank", "88"),
        ("Grace", "45"),
    ];

    let mut students: Vec<Student> = Vec::new();
    let mut errors: Vec<String> = Vec::new();

    // Process each entry
    println!("=== Processing Student Data ===");
    for (name, score) in &raw_data {
        match parse_student(name, score) {
            Ok(student) => {
                println!("  ✓ {} → {} ({})", student.name, student.score, student.grade_letter());
                students.push(student);
            }
            Err(GradeError::EmptyName) => {
                let msg = format!("Empty name with score '{}'", score);
                println!("  ✗ {}", msg);
                errors.push(msg);
            }
            Err(GradeError::InvalidScore(s)) => {
                let msg = format!("{}: invalid score '{}'", name, s);
                println!("  ✗ {}", msg);
                errors.push(msg);
            }
            Err(GradeError::ScoreOutOfRange(s)) => {
                let msg = format!("{}: score {:.0} out of range", name, s);
                println!("  ✗ {}", msg);
                errors.push(msg);
            }
        }
    }

    // Generate report
    println!("\n=== Class Report ===");
    println!("  Valid entries: {}", students.len());
    println!("  Errors: {}", errors.len());

    if !students.is_empty() {
        // Calculate average
        let mut sum = 0.0;
        for student in &students {
            sum += student.score;
        }
        let average = sum / students.len() as f64;
        println!("  Class average: {:.1}", average);

        // Count passing
        let mut passing = 0;
        for student in &students {
            if student.passed() {
                passing += 1;
            }
        }
        println!("  Passing: {}/{}", passing, students.len());

        // Find highest
        let mut highest = &students[0];
        for student in &students {
            if student.score > highest.score {
                highest = student;
            }
        }
        println!("  Highest: {} ({:.0}, {})", highest.name, highest.score, highest.grade_letter());
    }

    if !errors.is_empty() {
        println!("\n  Skipped entries:");
        for err in &errors {
            println!("    - {}", err);
        }
    }
}
```

Expected output:
```
=== Processing Student Data ===
  ✓ Alice → 92 (A)
  ✓ Bob → 78 (C)
  ✗ Charlie: invalid score 'abc'
  ✗ Empty name with score '85'
  ✗ Diana: score 105 out of range
  ✓ Eve → 65 (D)
  ✓ Frank → 88 (B)
  ✓ Grace → 45 (F)

=== Class Report ===
  Valid entries: 5
  Errors: 3
  Class average: 73.6
  Passing: 4/5
  Highest: Alice (92, A)

  Skipped entries:
    - Charlie: invalid score 'abc'
    - Empty name with score '85'
    - Diana: score 105 out of range
```
</details>

---

## 💡 Preview: Error Handling Gets Even Better

In later sections, you'll learn:

- **Section 05 (Traits):** Implement `Display` and `From` traits for custom errors — enables automatic error conversion with `?`
- **External crates `thiserror` and `anyhow`:** Industry-standard crates that reduce error boilerplate. You'll add them with `cargo add thiserror anyhow` once you understand traits.

For now, the manual approach gives you a solid understanding of HOW error handling works under the hood.

---

## 🎯 Key Takeaways

| Concept | Syntax | When to Use |
|---------|--------|-------------|
| `Result<T, E>` | `Ok(value)` / `Err(error)` | Operations that can fail |
| `?` operator | `let val = might_fail()?;` | Propagate errors up (in functions returning Result) |
| `match` on Result | `match res { Ok(v) => ..., Err(e) => ... }` | Handle success and failure |
| Custom error enum | `enum MyError { Variant1, Variant2(data) }` | Different failure modes |
| `.map_err()` | `val.parse().map_err(|_| MyError)` | Transform error types |
| `.ok_or()` | `option.ok_or(err)` | Convert Option to Result |
| `.unwrap()` | `result.unwrap()` | Prototyping ONLY — panics on error |

**The #1 Rule:** In production code, NEVER use `.unwrap()` on user input or I/O operations. Always handle the error case.

---

## ⏭️ Next: Section 04 - Collections, Iterators & Closures

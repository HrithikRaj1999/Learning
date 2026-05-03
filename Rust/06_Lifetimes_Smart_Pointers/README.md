# Section 06: Lifetimes & Smart Pointers

> **Prerequisites:** Complete Sections 00-05. You should understand ownership/borrowing (Section 01), traits and generics (Section 05), and error handling (Section 03).

## 🎯 Learning Objectives
- Understand lifetime annotations and when they're needed
- Know the three lifetime elision rules
- Master smart pointers (Box, Rc, Arc, RefCell, Weak)
- Understand `'static` lifetime and when it appears
- Know when to use each pointer type

---

## 📖 Core Concepts

### What Are Lifetimes?

**Scenario:** You write a function that returns a reference. Rust asks: "How long does this reference live?" Lifetimes tell the compiler which reference outlives which.

```rust
// Without lifetime annotation — compiler can't know if the return
// value lives as long as `a` or `b`
fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() > b.len() { a } else { b }
}
// 'a means: "the returned reference lives at least as long as 
// the SHORTER of the two input lifetimes"
```

### The Three Lifetime Elision Rules

Most of the time, Rust infers lifetimes automatically using these rules. You only need to annotate when the compiler can't figure it out.

```rust
// Rule 1: Each input reference gets its own lifetime parameter
// fn foo(x: &str, y: &str) → fn foo<'a, 'b>(x: &'a str, y: &'b str)

// Rule 2: If there's exactly ONE input lifetime, the output gets it
// fn foo(x: &str) -> &str → fn foo<'a>(x: &'a str) -> &'a str
// This is why most functions don't need annotations!

// Rule 3: If one of the inputs is &self or &mut self, the output gets self's lifetime
// fn method(&self, x: &str) -> &str → fn method<'a, 'b>(&'a self, x: &'b str) -> &'a str
// This is why methods rarely need annotations!

// When you DO need to annotate:
// - Multiple input references AND a reference output (compiler can't pick)
// - The output could come from either input
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {  // Needed: 2 inputs, 1 output
    if x.len() > y.len() { x } else { y }
}
```

### The `'static` Lifetime

`'static` means the reference lives for the **entire duration of the program**.

```rust
// String literals are always 'static — they're baked into the binary
let s: &'static str = "I live forever";

// T: 'static as a trait bound does NOT mean "must be a reference that lives forever"
// It means "T does not contain any non-'static references"
// Owned types like String, Vec<i32>, i32 all satisfy T: 'static!

fn spawn_task<T: Send + 'static>(value: T) {
    // tokio::spawn requires 'static because the task might outlive
    // the scope that created it
    std::thread::spawn(move || {
        println!("Got value in thread");
    });
}

// ✅ String is 'static (it's owned, no references)
// ✅ i32 is 'static
// ❌ &str with a local lifetime is NOT 'static
// ✅ &'static str IS 'static
```

### Smart Pointer Decision Tree

```
Need to store data on heap?
├── Yes, single owner? → Box<T>
├── Yes, multiple owners (single-threaded)? → Rc<T>
├── Yes, multiple owners (multi-threaded)? → Arc<T>
└── Need interior mutability?
    ├── Single-threaded → RefCell<T>
    └── Multi-threaded → Mutex<T> / RwLock<T>
```

---

## 📝 Tasks

### Task 1: Lifetime Annotations

**What to do:** Write functions and structs that require lifetime annotations. Build a zero-copy Parser that borrows from input.

<details>
<summary>Click to see answer</summary>

```rust
// Example 1: Return a reference to the longer string
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// Example 2: Struct that holds a reference
struct Excerpt<'a> {
    text: &'a str,
    line_number: usize,
}

impl<'a> Excerpt<'a> {
    fn new(text: &'a str, line_number: usize) -> Self {
        Excerpt { text, line_number }
    }
    
    // No lifetime needed here — elision rule #3
    // &self has lifetime 'a, return borrows from self
    fn first_word(&self) -> &str {
        self.text.split_whitespace().next().unwrap_or("")
    }
    
    fn display(&self) -> String {
        format!("Line {}: {}", self.line_number, self.text)
    }
}

// Example 3: Multiple lifetimes
struct Config<'a, 'b> {
    name: &'a str,
    values: &'b [i32],
}

// Example 4: Lifetime in a context manager pattern
struct Parser<'input> {
    source: &'input str,
    position: usize,
}

impl<'input> Parser<'input> {
    fn new(source: &'input str) -> Self {
        Parser { source, position: 0 }
    }
    
    fn remaining(&self) -> &'input str {
        &self.source[self.position..]
    }
    
    fn take(&mut self, n: usize) -> &'input str {
        let start = self.position;
        let end = (start + n).min(self.source.len());
        self.position = end;
        &self.source[start..end]
    }
    
    fn take_while(&mut self, pred: impl Fn(char) -> bool) -> &'input str {
        let start = self.position;
        while self.position < self.source.len() {
            if let Some(ch) = self.source[self.position..].chars().next() {
                if pred(ch) {
                    self.position += ch.len_utf8();
                } else {
                    break;
                }
            }
        }
        &self.source[start..self.position]
    }
}

fn main() {
    // Longest
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("Longest: {}", result); // Must use inside this scope!
    }
    
    // Excerpt
    let text = String::from("Hello world from Rust");
    let excerpt = Excerpt::new(&text, 1);
    println!("{}", excerpt.display());
    println!("First word: {}", excerpt.first_word());
    
    // Parser
    let input = "GET /api/users HTTP/1.1";
    let mut parser = Parser::new(input);
    let method = parser.take_while(|c| c != ' ');
    parser.take(1); // skip space
    let path = parser.take_while(|c| c != ' ');
    parser.take(1); // skip space
    let version = parser.remaining();
    println!("Method: {}, Path: {}, Version: {}", method, path, version);
}
```

**Explanation:**
- Lifetimes prevent dangling references at compile time
- `'a` is just a name — it says "these references are connected"
- Elision rules handle most cases automatically (you often don't need to annotate)
- Structs holding references MUST have lifetime parameters

**Scenario:** HTTP parsers (zero-copy parsing of request buffers), template engines (referencing template source), configuration (referencing file contents in memory).
</details>

---

### Task 2: Box<T> — Heap Allocation

**What to do:** Build a linked list and an AST (abstract syntax tree) using `Box<T>` for recursive types.

<details>
<summary>Click to see answer</summary>

```rust
// Without Box: compiler error — infinite size struct
// struct List { value: i32, next: List }  // ERROR!

// With Box: known size (pointer on stack, data on heap)
#[derive(Debug)]
enum List<T> {
    Cons(T, Box<List<T>>),
    Nil,
}

impl<T: std::fmt::Display> List<T> {
    fn new() -> Self {
        List::Nil
    }
    
    fn prepend(self, value: T) -> Self {
        List::Cons(value, Box::new(self))
    }
    
    fn len(&self) -> usize {
        match self {
            List::Nil => 0,
            List::Cons(_, next) => 1 + next.len(),
        }
    }
    
    fn to_vec(&self) -> Vec<&T> {
        let mut result = Vec::new();
        let mut current = self;
        loop {
            match current {
                List::Nil => break,
                List::Cons(val, next) => {
                    result.push(val);
                    current = next;
                }
            }
        }
        result
    }
}

// Real-world: AST (Abstract Syntax Tree) for a language
#[derive(Debug)]
enum Expr {
    Number(f64),
    String(String),
    Bool(bool),
    BinaryOp {
        left: Box<Expr>,
        op: Op,
        right: Box<Expr>,
    },
    If {
        condition: Box<Expr>,
        then_branch: Box<Expr>,
        else_branch: Option<Box<Expr>>,
    },
    FunctionCall {
        name: String,
        args: Vec<Expr>,
    },
}

#[derive(Debug)]
enum Op { Add, Sub, Mul, Div, Eq, Lt, Gt }

impl Expr {
    fn evaluate(&self) -> f64 {
        match self {
            Expr::Number(n) => *n,
            Expr::BinaryOp { left, op, right } => {
                let l = left.evaluate();
                let r = right.evaluate();
                match op {
                    Op::Add => l + r,
                    Op::Sub => l - r,
                    Op::Mul => l * r,
                    Op::Div => l / r,
                    _ => 0.0,
                }
            }
            _ => 0.0, // Simplified
        }
    }
}

fn main() {
    // Linked list
    let list = List::new()
        .prepend(3)
        .prepend(2)
        .prepend(1);
    println!("List: {:?}", list.to_vec()); // [1, 2, 3]
    println!("Length: {}", list.len());
    
    // AST: represents "2 + 3 * 4"
    let expr = Expr::BinaryOp {
        left: Box::new(Expr::Number(2.0)),
        op: Op::Add,
        right: Box::new(Expr::BinaryOp {
            left: Box::new(Expr::Number(3.0)),
            op: Op::Mul,
            right: Box::new(Expr::Number(4.0)),
        }),
    };
    println!("2 + 3 * 4 = {}", expr.evaluate()); // 14.0
}
```

**Explanation:**
- `Box<T>` puts data on the heap with a known-size pointer on the stack
- Required for recursive types (linked lists, trees, ASTs)
- Also used for trait objects: `Box<dyn Error>`
- Zero overhead compared to raw pointer (just a heap allocation)

**Scenario:** Template engines (AST), SQL query parsers, JSON parsers, file system trees — any recursive data structure.
</details>

---

### Task 3: Rc<T> and Arc<T> — Shared Ownership

**What to do:** Create an AppConfig shared across multiple service components using `Rc<T>`, then show the `Arc<T>` equivalent for multi-threaded use.

<details>
<summary>Click to see answer</summary>

```rust
use std::rc::Rc;
use std::sync::Arc;

// Rc<T> — Reference Counted (single-threaded only)
#[derive(Debug)]
struct AppConfig {
    database_url: String,
    api_key: String,
    max_retries: u32,
}

struct DatabaseClient {
    config: Rc<AppConfig>,
}

struct ApiClient {
    config: Rc<AppConfig>,
}

struct Logger {
    config: Rc<AppConfig>,
}

impl DatabaseClient {
    fn connect(&self) {
        println!("DB connecting to: {}", self.config.database_url);
    }
}

impl ApiClient {
    fn call(&self, endpoint: &str) {
        println!("API call to {} with key: {}...", endpoint, &self.config.api_key[..8]);
    }
}

impl Logger {
    fn log(&self, msg: &str) {
        println!("[LOG] {} (retries={})", msg, self.config.max_retries);
    }
}

fn single_threaded_example() {
    let config = Rc::new(AppConfig {
        database_url: "postgres://localhost/mydb".to_string(),
        api_key: "sk-1234567890abcdef".to_string(),
        max_retries: 3,
    });
    
    println!("Reference count: {}", Rc::strong_count(&config)); // 1
    
    let db = DatabaseClient { config: Rc::clone(&config) };
    let api = ApiClient { config: Rc::clone(&config) };
    let logger = Logger { config: Rc::clone(&config) };
    
    println!("Reference count: {}", Rc::strong_count(&config)); // 4
    
    db.connect();
    api.call("/users");
    logger.log("System initialized");
    
    drop(db);
    println!("After dropping DB: count = {}", Rc::strong_count(&config)); // 3
}

// Arc<T> — Atomic Reference Counted (thread-safe)
fn multi_threaded_example() {
    use std::thread;
    
    let config = Arc::new(AppConfig {
        database_url: "postgres://localhost/mydb".to_string(),
        api_key: "sk-1234567890abcdef".to_string(),
        max_retries: 3,
    });
    
    let mut handles = vec![];
    
    for i in 0..3 {
        let config_clone = Arc::clone(&config);
        let handle = thread::spawn(move || {
            println!("Thread {} sees db_url: {}", i, config_clone.database_url);
        });
        handles.push(handle);
    }
    
    for handle in handles {
        handle.join().unwrap();
    }
}

fn main() {
    println!("=== Single-threaded (Rc) ===");
    single_threaded_example();
    
    println!("\n=== Multi-threaded (Arc) ===");
    multi_threaded_example();
}
```

**Explanation:**
- `Rc<T>` allows multiple owners of the same data (reference counted)
- When the last Rc is dropped, the data is freed
- `Arc<T>` is the thread-safe version (atomic reference counting)
- `Rc::clone()` is cheap — just increments a counter, doesn't clone data
- Use `Rc` for single-threaded, `Arc` for multi-threaded

**Scenario:** Shared database connection config, application-wide settings, cached data accessed by multiple handlers, DOM trees in web renderers.
</details>

---

### Task 4: RefCell<T> — Interior Mutability

**What to do:** Create a MockMailer that tracks sent emails using RefCell (interior mutability through `&self`).

<details>
<summary>Click to see answer</summary>

```rust
use std::cell::RefCell;
use std::rc::Rc;

// The trait we want to test
trait Mailer {
    fn send(&self, to: &str, subject: &str, body: &str) -> Result<(), String>;
}

// Real implementation
struct SmtpMailer {
    server: String,
}

impl Mailer for SmtpMailer {
    fn send(&self, to: &str, subject: &str, _body: &str) -> Result<(), String> {
        println!("Sending to {} via {}: {}", to, self.server, subject);
        Ok(())
    }
}

// Mock implementation using RefCell for interior mutability
struct MockMailer {
    // RefCell allows mutation through &self (shared reference)
    sent_emails: RefCell<Vec<(String, String, String)>>,
    should_fail: bool,
}

impl MockMailer {
    fn new() -> Self {
        MockMailer {
            sent_emails: RefCell::new(Vec::new()),
            should_fail: false,
        }
    }
    
    fn failing() -> Self {
        MockMailer {
            sent_emails: RefCell::new(Vec::new()),
            should_fail: true,
        }
    }
    
    fn call_count(&self) -> usize {
        self.sent_emails.borrow().len()
    }
    
    fn last_email(&self) -> Option<(String, String, String)> {
        self.sent_emails.borrow().last().cloned()
    }
}

impl Mailer for MockMailer {
    fn send(&self, to: &str, subject: &str, body: &str) -> Result<(), String> {
        if self.should_fail {
            return Err("Mock failure".to_string());
        }
        // Mutate through &self using RefCell!
        self.sent_emails.borrow_mut().push((
            to.to_string(),
            subject.to_string(),
            body.to_string(),
        ));
        Ok(())
    }
}

// Service that uses the mailer
struct NotificationService<M: Mailer> {
    mailer: M,
}

impl<M: Mailer> NotificationService<M> {
    fn new(mailer: M) -> Self {
        NotificationService { mailer }
    }
    
    fn notify_user(&self, email: &str, event: &str) -> Result<(), String> {
        let subject = format!("Notification: {}", event);
        let body = format!("You have a new event: {}", event);
        self.mailer.send(email, &subject, &body)
    }
}

fn main() {
    // Testing with mock
    let mock = MockMailer::new();
    let service = NotificationService::new(mock);
    
    service.notify_user("alice@example.com", "New login").unwrap();
    service.notify_user("bob@example.com", "Password changed").unwrap();
    
    println!("Emails sent: {}", service.mailer.call_count()); // 2
    println!("Last email: {:?}", service.mailer.last_email());
    
    // Testing failure path
    let failing_mock = MockMailer::failing();
    let service2 = NotificationService::new(failing_mock);
    assert!(service2.notify_user("test@test.com", "test").is_err());
    println!("Failure path tested ✓");
}
```

**Explanation:**
- `RefCell<T>` moves borrow checking from compile time to RUNTIME
- Allows mutation through a shared reference (`&self`)
- Panics at runtime if you violate borrow rules (two mutable borrows)
- Use sparingly — prefer compile-time borrow checking when possible

**Scenario:** Mocking in tests, caching (compute-on-first-access), observer patterns, GUI state management.
</details>

---

### Task 5: Combining Smart Pointers

**What to do:** Build an EventBus using `Rc<T>` + `RefCell<T>` + `Box<dyn Fn>` — the observer/pub-sub pattern.

<details>
<summary>Click to see answer</summary>

```rust
use std::cell::RefCell;
use std::rc::Rc;

type Subscriber = Box<dyn Fn(&str, &str)>;

struct EventBus {
    subscribers: RefCell<Vec<(String, Subscriber)>>,
}

impl EventBus {
    fn new() -> Rc<Self> {
        Rc::new(EventBus {
            subscribers: RefCell::new(Vec::new()),
        })
    }
    
    fn subscribe(&self, event: &str, handler: impl Fn(&str, &str) + 'static) {
        self.subscribers.borrow_mut().push((
            event.to_string(),
            Box::new(handler),
        ));
    }
    
    fn publish(&self, event: &str, data: &str) {
        let subs = self.subscribers.borrow();
        for (subscribed_event, handler) in subs.iter() {
            if subscribed_event == event || subscribed_event == "*" {
                handler(event, data);
            }
        }
    }
}

// Components that share the event bus
struct UserService {
    bus: Rc<EventBus>,
}

impl UserService {
    fn new(bus: Rc<EventBus>) -> Self {
        UserService { bus }
    }
    
    fn create_user(&self, name: &str) {
        println!("Creating user: {}", name);
        self.bus.publish("user.created", name);
    }
    
    fn delete_user(&self, name: &str) {
        println!("Deleting user: {}", name);
        self.bus.publish("user.deleted", name);
    }
}

fn main() {
    let bus = EventBus::new();
    
    // Subscribe to events
    bus.subscribe("user.created", |event, data| {
        println!("  [Email] Welcome email to: {} (event: {})", data, event);
    });
    
    bus.subscribe("user.created", |_event, data| {
        println!("  [Analytics] New user registered: {}", data);
    });
    
    bus.subscribe("user.deleted", |_event, data| {
        println!("  [Cleanup] Removing data for: {}", data);
    });
    
    bus.subscribe("*", |event, data| {
        println!("  [Audit] Event '{}' with data '{}'", event, data);
    });
    
    // Use the service
    let user_service = UserService::new(Rc::clone(&bus));
    user_service.create_user("Alice");
    println!();
    user_service.delete_user("Bob");
}
```

**Explanation:**
- `Rc<EventBus>` — shared ownership of the event bus across components
- `RefCell<Vec<...>>` — ability to add subscribers after creation
- `Box<dyn Fn(...)>` — type-erased callback functions
- This combines all smart pointer concepts into a practical pattern

**Scenario:** Event-driven architectures in web apps, pub/sub systems, reactive UI frameworks, plugin notification systems.
</details>

---

### Task 6: Weak<T> — Breaking Reference Cycles

`Rc<T>` can create memory leaks if two values reference each other (a cycle). `Weak<T>` breaks cycles by not contributing to the reference count.

**What to do:** Build a tree structure where children have a reference back to their parent. Use `Weak<T>` for the parent reference to avoid cycles.

<details>
<summary>Click to see answer</summary>

```rust
use std::cell::RefCell;
use std::rc::{Rc, Weak};

#[derive(Debug)]
struct Node {
    name: String,
    parent: RefCell<Weak<Node>>,       // Weak: doesn't prevent parent from being dropped
    children: RefCell<Vec<Rc<Node>>>,   // Rc: children are owned
}

impl Node {
    fn new(name: &str) -> Rc<Self> {
        Rc::new(Node {
            name: name.to_string(),
            parent: RefCell::new(Weak::new()),  // No parent initially
            children: RefCell::new(Vec::new()),
        })
    }

    fn add_child(parent: &Rc<Node>, child: &Rc<Node>) {
        // Set the child's parent to a Weak reference
        *child.parent.borrow_mut() = Rc::downgrade(parent);
        // Add child to parent's children list
        parent.children.borrow_mut().push(Rc::clone(child));
    }

    fn parent_name(&self) -> String {
        // upgrade() returns Option<Rc<Node>> — None if parent was dropped
        match self.parent.borrow().upgrade() {
            Some(parent) => parent.name.clone(),
            None => "No parent".to_string(),
        }
    }
}

impl Drop for Node {
    fn drop(&mut self) {
        println!("Dropping node: {}", self.name);
    }
}

fn main() {
    let root = Node::new("root");
    let child1 = Node::new("child1");
    let child2 = Node::new("child2");

    Node::add_child(&root, &child1);
    Node::add_child(&root, &child2);

    println!("{}'s parent: {}", child1.name, child1.parent_name()); // root
    println!("Root strong count: {}", Rc::strong_count(&root));     // 1
    println!("Root weak count: {}", Rc::weak_count(&root));         // 2

    // Without Weak, dropping root would be impossible (cycle!)
    // With Weak, everything drops cleanly when root goes out of scope
}
```

**Key points about Weak<T>:**
- `Rc::downgrade(&rc)` → creates a `Weak<T>` (doesn't increment strong count)
- `weak.upgrade()` → returns `Option<Rc<T>>` (None if the value was dropped)
- Use for: parent pointers in trees, observer patterns, caches
- Strong count determines when data is dropped. Weak count does not.

</details>

---

## 🎯 Key Takeaways

| Pointer | Ownership | Thread-safe | Mutability | Use Case |
|---------|-----------|-------------|------------|----------|
| `Box<T>` | Single | Yes | Through owner | Recursive types, trait objects |
| `Rc<T>` | Multiple | No | Immutable | Shared data, single thread |
| `Arc<T>` | Multiple | Yes | Immutable | Shared data, multi-thread |
| `RefCell<T>` | Single | No | Interior mut | Mocks, caching |
| `Weak<T>` | Non-owning | No | — | Break Rc cycles, parent refs |
| `Rc<RefCell<T>>` | Multiple | No | Shared mut | Observer pattern, graphs |
| `Arc<Mutex<T>>` | Multiple | Yes | Shared mut | Thread-safe shared state |

| Lifetime Concept | Meaning |
|-----------------|---------|
| `'a` annotation | "These references are connected" |
| Elision rules | Compiler infers lifetimes automatically (3 rules) |
| `'static` | Lives for entire program, or contains no non-static refs |
| `T: 'static` | T is owned or contains only `'static` references |

---

## ⏭️ Next: Section 07 - Concurrency & Async/Await

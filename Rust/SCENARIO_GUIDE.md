# Rust Scenario Guide

## Real-World Scenarios with Explanations

Each scenario describes a REAL situation you'd face at work, followed by the Rust solution approach.

---

## Scenario 1: Memory-Safe Web Server Under Load

**Situation:** Your team's Node.js API is crashing under load due to memory leaks from unclosed database connections and event listener accumulation. You're tasked with rewriting the hot path in Rust.

**Why Rust Solves This:**
```rust
// In Rust, connections are AUTOMATICALLY closed when dropped (RAII)
async fn handle_request(pool: &PgPool) -> Result<Response, AppError> {
    let conn = pool.acquire().await?; // Get connection from pool
    let user = sqlx::query_as("SELECT * FROM users WHERE id = $1")
        .bind(user_id)
        .fetch_one(&conn)
        .await?;
    // conn is automatically returned to pool when it goes out of scope
    // No possible leak, even if an error occurs!
    Ok(Json(user))
}
```

**Key Insight:** Rust's ownership system guarantees resources are freed. No GC pauses, no memory leaks, deterministic resource cleanup.

---

## Scenario 2: Processing 10GB Log Files

**Situation:** You need to build a tool that processes 10GB of access logs, finds all 5xx errors, groups them by endpoint, and outputs a report. It must finish in under 30 seconds.

**Why Rust Excels:**
```rust
// Lazy iterators process one line at a time — no need to load entire file
use std::io::{BufRead, BufReader};
use std::fs::File;

fn process_logs(path: &str) -> HashMap<String, Vec<LogEntry>> {
    let file = File::open(path).unwrap();
    let reader = BufReader::with_capacity(1 << 20, file); // 1MB buffer
    
    reader.lines()
        .filter_map(|line| line.ok())
        .filter_map(|line| parse_log_entry(&line))
        .filter(|entry| entry.status >= 500)
        .fold(HashMap::new(), |mut acc, entry| {
            acc.entry(entry.path.clone()).or_default().push(entry);
            acc
        })
}
```

**Key Insight:** Zero-copy parsing + buffered I/O + lazy iterators = constant memory usage regardless of file size. Rayon can parallelize this trivially.

---

## Scenario 3: Preventing SQL Injection

**Situation:** A code review reveals that the current API concatenates user input into SQL queries. You need to fix it.

**Before (VULNERABLE):**
```python
# Python - SQL INJECTION POSSIBLE
query = f"SELECT * FROM users WHERE name = '{user_input}'"
```

**After (Rust with SQLx — SAFE by default):**
```rust
// SQLx makes SQL injection IMPOSSIBLE with parameterized queries
let user = sqlx::query_as::<_, User>(
    "SELECT * FROM users WHERE name = $1"  // Parameterized
)
.bind(&user_input)  // Safely bound — never concatenated
.fetch_optional(&pool)
.await?;

// Even better: compile-time checked!
let user = sqlx::query_as!(User,
    "SELECT * FROM users WHERE name = $1",
    user_input  // Compiler verifies this matches the query
)
.fetch_optional(&pool)
.await?;
```

**Key Insight:** SQLx's compile-time query checking means typos in column names are caught BEFORE deployment, not in production.

---

## Scenario 4: Building a Zero-Downtime Deploy Tool

**Situation:** You need a CLI tool that deploys to multiple servers simultaneously, with rollback capability if any server fails.

**Rust Approach:**
```rust
async fn deploy(servers: &[Server], artifact: &Path) -> DeployResult {
    let semaphore = Arc::new(Semaphore::new(5)); // Max 5 concurrent deploys
    
    let results = futures::future::join_all(
        servers.iter().map(|server| {
            let sem = Arc::clone(&semaphore);
            async move {
                let _permit = sem.acquire().await.unwrap();
                deploy_to_server(server, artifact).await
            }
        })
    ).await;
    
    // If any failed, rollback all
    if results.iter().any(|r| r.is_err()) {
        rollback_all(servers, &results).await;
        return DeployResult::RolledBack;
    }
    
    DeployResult::Success
}
```

**Key Insight:** Async + semaphores give you controlled concurrency. The type system ensures you handle both success and failure paths.

---

## Scenario 5: Type-Safe Configuration

**Situation:** Your app crashes in production because someone set `PORT=abc` in the environment. You need configuration that fails fast on startup.

**Rust Solution:**
```rust
use serde::Deserialize;

#[derive(Debug, Deserialize)]
struct Config {
    #[serde(default = "default_port")]
    port: u16,  // MUST be a valid u16 — can't be "abc"
    
    database_url: String,  // Required — app won't start without it
    
    #[serde(default)]
    debug: bool,
    
    #[serde(default = "default_workers")]
    worker_count: usize,
}

fn load_config() -> Result<Config, config::ConfigError> {
    config::Config::builder()
        .add_source(config::File::with_name("config/default"))
        .add_source(config::Environment::with_prefix("APP"))
        .build()?
        .try_deserialize()
    // Fails IMMEDIATELY on startup if any value is wrong type
}

fn main() {
    let config = load_config().expect("Invalid configuration — fix before deploying!");
    // If we reach here, ALL config values are valid and typed correctly
}
```

**Key Insight:** Parse, don't validate. Convert strings to typed values at the boundary, then work with guaranteed-correct types everywhere else.

---

## Scenario 6: Concurrent Web Scraper with Respect for Rate Limits

**Situation:** You need to scrape 100,000 product pages but must stay under 10 requests/second to avoid being blocked.

```rust
use tokio::sync::Semaphore;
use tokio::time::{sleep, Duration};

struct RateLimitedScraper {
    client: reqwest::Client,
    semaphore: Arc<Semaphore>,
    delay: Duration,
}

impl RateLimitedScraper {
    fn new(max_concurrent: usize, requests_per_second: u32) -> Self {
        RateLimitedScraper {
            client: reqwest::Client::new(),
            semaphore: Arc::new(Semaphore::new(max_concurrent)),
            delay: Duration::from_millis(1000 / requests_per_second as u64),
        }
    }
    
    async fn scrape(&self, url: &str) -> Result<String, reqwest::Error> {
        let _permit = self.semaphore.acquire().await.unwrap();
        sleep(self.delay).await; // Rate limiting
        
        self.client.get(url)
            .header("User-Agent", "RustBot/1.0")
            .send()
            .await?
            .text()
            .await
    }
}
```

**Key Insight:** Semaphores + sleep combine to create precise rate limiting. The type system ensures permits are always released (even on errors).

---

## Scenario 7: Data Race Prevention

**Situation:** Two threads try to update a shared counter simultaneously. In C/C++, this is undefined behavior. In Java/Python, it's a race condition. In Rust?

```rust
// This WON'T COMPILE — Rust prevents the data race!
let mut counter = 0;
let handle = thread::spawn(|| {
    counter += 1; // ERROR: can't borrow `counter` as mutable in closure
});

// Correct approach — Rust FORCES you to use synchronization:
let counter = Arc::new(Mutex::new(0));
let counter_clone = Arc::clone(&counter);

let handle = thread::spawn(move || {
    let mut num = counter_clone.lock().unwrap();
    *num += 1;
});

handle.join().unwrap();
println!("Counter: {}", *counter.lock().unwrap());
```

**Key Insight:** Data races are COMPILE ERRORS in Rust, not runtime bugs. The compiler won't let you share mutable state without synchronization.

---

## Scenario 8: Zero-Copy Parsing for Performance

**Situation:** Your web server receives JSON payloads that are 100KB each, at 10,000 requests/second. Allocating new strings for every parse would consume 1GB/second of memory.

```rust
// Zero-copy: borrow from the original buffer instead of allocating
use serde::Deserialize;

#[derive(Deserialize)]
struct Request<'a> {
    #[serde(borrow)]
    name: &'a str,      // Points into the original JSON buffer!
    #[serde(borrow)]
    email: &'a str,     // No allocation!
    age: u32,           // Small values are copied (cheap)
}

fn handle_request(json_bytes: &[u8]) -> Result<(), serde_json::Error> {
    // Deserialize WITHOUT copying strings
    let request: Request = serde_json::from_slice(json_bytes)?;
    // request.name and request.email point into json_bytes
    // Zero allocations for strings!
    println!("Processing: {}", request.name);
    Ok(())
}
```

**Key Insight:** Lifetimes enable zero-copy parsing — the parsed struct borrows from the input buffer. This is how Rust web servers achieve millions of requests/second.

---

## When to Choose Rust (Decision Framework)

| Scenario | Choose Rust? | Why |
|----------|-------------|-----|
| High-performance web API | ✅ Yes | Predictable latency, low memory |
| Quick prototype/script | ❌ No | Python/JS faster to write |
| CLI tools for devs | ✅ Yes | Fast startup, single binary |
| Data processing pipeline | ✅ Yes | Memory efficient, parallel |
| Frontend web app | ❌ No | Use React/Vue (WASM for specific cases) |
| Embedded/IoT | ✅ Yes | No runtime, bare metal |
| Machine learning | ❌ No | Python ecosystem is better |
| Microservice | ✅ Yes | Small binary, low resource usage |
| Team of 2, tight deadline | ⚠️ Maybe | Depends on team Rust experience |

---

## Key Decision: When to Use Each Rust Feature

| Situation | Use |
|-----------|-----|
| Need to return one of several types | `enum` |
| Need optional value | `Option<T>` |
| Operation can fail | `Result<T, E>` |
| Shared read-only data | `&T` or `Arc<T>` |
| Shared mutable data (single thread) | `RefCell<T>` or `Rc<RefCell<T>>` |
| Shared mutable data (multi thread) | `Arc<Mutex<T>>` or `Arc<RwLock<T>>` |
| High-concurrency I/O | `async/await` with `tokio` |
| CPU-bound parallelism | `rayon` or `std::thread` |
| Plugin/extension system | `trait` objects (`Box<dyn Trait>`) |
| Maximum performance | Generics (static dispatch) |

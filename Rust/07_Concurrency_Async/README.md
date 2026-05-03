# Section 07: Concurrency & Async/Await

> **Prerequisites:** Complete Sections 00-06. You should understand ownership (Section 01), traits including Send/Sync concepts (Section 05), and smart pointers especially Arc (Section 06).

## 🎯 Learning Objectives
- Use threads for CPU-bound parallelism
- Master channels for thread communication
- Understand Send and Sync traits
- Understand what an async runtime is and why you need one
- Master async/await for I/O-bound concurrency (web servers!)
- Use Tokio runtime for production async code
- Use `tokio::select!` for racing futures

---

## 📖 Core Concepts

### Concurrency vs Parallelism

| | Concurrency | Parallelism |
|---|---|---|
| What | Multiple tasks make progress | Tasks literally execute simultaneously |
| How | async/await, cooperative scheduling | OS threads, multiple CPU cores |
| Use for | I/O-bound (network, disk) | CPU-bound (computation, parsing) |
| Rust tool | tokio, async-std | std::thread, rayon |

### Why Rust Excels at Concurrency

**Scenario:** In other languages, data races are runtime bugs (often discovered in production). In Rust, the compiler PREVENTS data races at compile time. If it compiles, it's race-free.

### Send and Sync — The Thread-Safety Traits

These are **auto-traits** — the compiler implements them automatically when safe.

```rust
// Send: A type is safe to TRANSFER to another thread
// - String, Vec<T>, i32, Box<T> → Send ✅
// - Rc<T> → NOT Send ❌ (reference count isn't atomic)
// - Arc<T> → Send ✅ (atomic reference count)

// Sync: A type is safe to REFERENCE from multiple threads simultaneously
// - i32, &str, Arc<T> → Sync ✅
// - RefCell<T> → NOT Sync ❌ (runtime borrow checking isn't thread-safe)
// - Mutex<T> → Sync ✅ (lock prevents concurrent access)

// Why this matters — tokio::spawn requires Send + 'static:
// tokio::spawn(async move {
//     // Everything captured here must be Send + 'static
//     // ❌ Rc<T> cannot be sent to another thread
//     // ✅ Arc<T> can be sent to another thread
// });

// Quick reference:
// | Type        | Send | Sync |
// |-------------|------|------|
// | i32, String | ✅   | ✅   |
// | Rc<T>       | ❌   | ❌   |
// | Arc<T>      | ✅   | ✅   |
// | RefCell<T>  | ✅   | ❌   |
// | Mutex<T>    | ✅   | ✅   |
// | Cell<T>     | ✅   | ❌   |
```

### What Is an Async Runtime?

`async fn` alone does **nothing**. An async function returns a `Future`, but futures don't execute themselves. You need a **runtime** to drive them.

```rust
// An async fn just builds a state machine:
async fn hello() -> String {
    "hello".to_string()
}
// Calling hello() does NOT execute any code!
// It returns a Future that must be polled by a runtime.

// The runtime provides:
// 1. Task scheduler — decides which future to poll next
// 2. I/O reactor — monitors sockets/files for readiness
// 3. Timer — implements tokio::time::sleep, timeouts
// 4. Thread pool — executes tasks on multiple OS threads

// #[tokio::main] is syntactic sugar:
#[tokio::main]
async fn main() { }
// Expands to:
// fn main() {
//     tokio::runtime::Runtime::new().unwrap().block_on(async { })
// }

// You can customize the runtime:
// tokio::runtime::Builder::new_multi_thread()  // default: uses all CPU cores
//     .worker_threads(4)                        // limit to 4 threads
//     .enable_all()                             // enable I/O + time
//     .build()
//     .unwrap()
//     .block_on(async { /* ... */ });
//
// Builder::new_current_thread()  // single-threaded (simpler, for testing)
```

### async move — Transferring Ownership to Tasks

```rust
// tokio::spawn requires the future to be 'static (no borrowed data)
// Use `async move` to transfer ownership into the task:

async fn example() {
    let data = String::from("hello");

    // ❌ Won't compile: data is borrowed, not 'static
    // tokio::spawn(async { println!("{}", data); });

    // ✅ async move transfers ownership of data into the task
    tokio::spawn(async move {
        println!("{}", data); // data is owned by this task now
    });
    // data is no longer available here (it was moved)
}
```

---

## 📝 Tasks

### Task 1: Threads and Message Passing

**What to do:** Build a parallel file hasher using threads and channels (mpsc).

<details>
<summary>Click to see answer</summary>

```rust
use std::sync::mpsc;
use std::thread;
use std::time::Duration;
use std::collections::HashMap;

#[derive(Debug)]
struct HashResult {
    filename: String,
    hash: String,
    size_bytes: u64,
}

fn compute_hash(filename: &str) -> HashResult {
    // Simulated hash computation (CPU-intensive work)
    thread::sleep(Duration::from_millis(100)); // Simulate work
    HashResult {
        filename: filename.to_string(),
        hash: format!("sha256:{:x}", filename.len() * 12345 + 67890),
        size_bytes: filename.len() as u64 * 1024,
    }
}

fn parallel_hash(files: Vec<String>) -> Vec<HashResult> {
    let (sender, receiver) = mpsc::channel();
    let mut handles = vec![];
    
    for file in files {
        let tx = sender.clone();
        let handle = thread::spawn(move || {
            let result = compute_hash(&file);
            tx.send(result).unwrap();
        });
        handles.push(handle);
    }
    
    // Drop original sender so receiver knows when all are done
    drop(sender);
    
    // Collect results as they arrive
    let mut results = Vec::new();
    for result in receiver {
        println!("  Received: {} → {}", result.filename, result.hash);
        results.push(result);
    }
    
    // Wait for all threads to finish
    for handle in handles {
        handle.join().unwrap();
    }
    
    results
}

fn main() {
    let files: Vec<String> = (1..=5)
        .map(|i| format!("document_{}.pdf", i))
        .collect();
    
    println!("Hashing {} files in parallel...", files.len());
    let start = std::time::Instant::now();
    let results = parallel_hash(files);
    let elapsed = start.elapsed();
    
    println!("\nCompleted {} files in {:?}", results.len(), elapsed);
    // Sequential would take ~500ms, parallel takes ~100ms (5x speedup)
}
```

**Explanation:**
- `mpsc::channel()` creates a multi-producer, single-consumer channel
- `move` closures transfer ownership to threads
- `drop(sender)` signals that no more messages will be sent
- The receiver iterator ends when all senders are dropped

**Scenario:** CLI tools that process multiple files (formatters, linters, image converters), build systems that compile in parallel.
</details>

---

### Task 2: Shared State with Mutex

**What to do:** Build a thread-safe request counter (Mutex) and a rate limiter (RwLock).

<details>
<summary>Click to see answer</summary>

```rust
use std::sync::{Arc, Mutex, RwLock};
use std::thread;
use std::time::{Duration, Instant};
use std::collections::HashMap;

// Thread-safe request counter
struct RequestCounter {
    counts: Mutex<HashMap<String, u64>>,
    total: Mutex<u64>,
}

impl RequestCounter {
    fn new() -> Arc<Self> {
        Arc::new(RequestCounter {
            counts: Mutex::new(HashMap::new()),
            total: Mutex::new(0),
        })
    }
    
    fn increment(&self, path: &str) {
        // Lock, modify, automatically unlock when guard drops
        let mut counts = self.counts.lock().unwrap();
        *counts.entry(path.to_string()).or_insert(0) += 1;
        
        let mut total = self.total.lock().unwrap();
        *total += 1;
    }
    
    fn get_total(&self) -> u64 {
        *self.total.lock().unwrap()
    }
    
    fn get_stats(&self) -> HashMap<String, u64> {
        self.counts.lock().unwrap().clone()
    }
}

// Thread-safe rate limiter using RwLock
struct RateLimiter {
    // RwLock allows multiple readers OR one writer
    windows: RwLock<HashMap<String, Vec<Instant>>>,
    max_requests: usize,
    window_duration: Duration,
}

impl RateLimiter {
    fn new(max_requests: usize, window_seconds: u64) -> Arc<Self> {
        Arc::new(RateLimiter {
            windows: RwLock::new(HashMap::new()),
            max_requests,
            window_duration: Duration::from_secs(window_seconds),
        })
    }
    
    fn is_allowed(&self, client_id: &str) -> bool {
        let now = Instant::now();
        let mut windows = self.windows.write().unwrap();
        
        let timestamps = windows.entry(client_id.to_string()).or_default();
        
        // Remove expired timestamps
        timestamps.retain(|&t| now.duration_since(t) < self.window_duration);
        
        if timestamps.len() < self.max_requests {
            timestamps.push(now);
            true
        } else {
            false
        }
    }
}

fn main() {
    // Test request counter
    let counter = RequestCounter::new();
    let mut handles = vec![];
    
    for i in 0..10 {
        let counter_clone = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            let paths = ["/api/users", "/api/posts", "/api/comments"];
            let path = paths[i % 3];
            counter_clone.increment(path);
        });
        handles.push(handle);
    }
    
    for h in handles { h.join().unwrap(); }
    
    println!("Total requests: {}", counter.get_total());
    println!("Stats: {:?}", counter.get_stats());
    
    // Test rate limiter
    println!("\n--- Rate Limiter ---");
    let limiter = RateLimiter::new(3, 1); // 3 requests per second
    
    for i in 0..5 {
        let allowed = limiter.is_allowed("client_1");
        println!("Request {}: {}", i + 1, if allowed { "✓ allowed" } else { "✗ rate limited" });
    }
}
```

**Explanation:**
- `Mutex<T>` provides mutual exclusion — only one thread can access data at a time
- `RwLock<T>` allows multiple readers OR one writer (better for read-heavy workloads)
- `Arc<Mutex<T>>` is the standard pattern for shared mutable state across threads
- Lock guards automatically release when dropped (RAII)

**Scenario:** Web server metrics, rate limiting, connection pools, shared caches — any shared state in a multi-threaded server.
</details>

---

### Task 3: Async/Await Fundamentals

**What to do:** Write async functions that simulate network calls. Compare sequential vs concurrent execution using `join_all`.

<details>
<summary>Click to see answer</summary>

```rust
use std::time::Duration;

// Simulating async operations (in real code, these would be network calls)
async fn fetch_user(id: u32) -> Result<String, String> {
    // Simulates network delay
    tokio::time::sleep(Duration::from_millis(100)).await;
    match id {
        1 => Ok("Alice".to_string()),
        2 => Ok("Bob".to_string()),
        _ => Err(format!("User {} not found", id)),
    }
}

async fn fetch_posts(user: &str) -> Vec<String> {
    tokio::time::sleep(Duration::from_millis(150)).await;
    vec![
        format!("{}'s first post", user),
        format!("{}'s second post", user),
    ]
}

async fn fetch_comments(post: &str) -> Vec<String> {
    tokio::time::sleep(Duration::from_millis(50)).await;
    vec![format!("Comment on: {}", post)]
}

// Sequential execution (slow)
async fn fetch_user_data_sequential(id: u32) -> Result<String, String> {
    let user = fetch_user(id).await?;
    let posts = fetch_posts(&user).await;
    
    let mut all_comments = Vec::new();
    for post in &posts {
        let comments = fetch_comments(post).await; // One at a time!
        all_comments.extend(comments);
    }
    
    Ok(format!("User: {}, Posts: {}, Comments: {}", user, posts.len(), all_comments.len()))
}

// Concurrent execution (fast!)
async fn fetch_user_data_concurrent(id: u32) -> Result<String, String> {
    let user = fetch_user(id).await?;
    let posts = fetch_posts(&user).await;
    
    // Fetch all comments concurrently!
    let comment_futures: Vec<_> = posts.iter()
        .map(|post| fetch_comments(post))
        .collect();
    
    let all_comments: Vec<String> = futures::future::join_all(comment_futures)
        .await
        .into_iter()
        .flatten()
        .collect();
    
    Ok(format!("User: {}, Posts: {}, Comments: {}", user, posts.len(), all_comments.len()))
}

// Multiple independent requests in parallel
async fn fetch_multiple_users(ids: &[u32]) -> Vec<Result<String, String>> {
    let futures: Vec<_> = ids.iter().map(|&id| fetch_user(id)).collect();
    futures::future::join_all(futures).await
}

#[tokio::main]
async fn main() {
    // Sequential
    let start = std::time::Instant::now();
    let result = fetch_user_data_sequential(1).await;
    println!("Sequential: {:?} in {:?}", result, start.elapsed());
    
    // Concurrent
    let start = std::time::Instant::now();
    let result = fetch_user_data_concurrent(1).await;
    println!("Concurrent: {:?} in {:?}", result, start.elapsed());
    
    // Parallel user fetches
    let start = std::time::Instant::now();
    let results = fetch_multiple_users(&[1, 2, 3]).await;
    println!("Parallel users: {:?} in {:?}", results, start.elapsed());
}
```

**Explanation:**
- `async fn` returns a Future (doesn't execute until `.await`ed)
- `.await` suspends the current task, allowing others to run
- `join_all` runs multiple futures concurrently
- Tokio is the standard async runtime for Rust

**Scenario:** Web servers handling thousands of concurrent connections, API clients making multiple requests, database query parallelism.
</details>

---

### Task 4: Tokio Tasks — Lightweight Concurrency

**What to do:** Build a concurrent web scraper with a Semaphore to limit max concurrent downloads.

<details>
<summary>Click to see answer</summary>

```rust
use tokio::sync::Semaphore;
use std::sync::Arc;
use std::time::Duration;

#[derive(Debug, Clone)]
struct ScrapeResult {
    url: String,
    status: u16,
    body_length: usize,
    duration_ms: u64,
}

async fn scrape_url(url: &str) -> Result<ScrapeResult, String> {
    let start = std::time::Instant::now();
    
    // Simulate HTTP request
    tokio::time::sleep(Duration::from_millis(50 + (url.len() as u64 * 10))).await;
    
    // Simulate occasional failures
    if url.contains("error") {
        return Err(format!("Failed to fetch: {}", url));
    }
    
    Ok(ScrapeResult {
        url: url.to_string(),
        status: 200,
        body_length: url.len() * 100,
        duration_ms: start.elapsed().as_millis() as u64,
    })
}

async fn scrape_with_concurrency_limit(
    urls: Vec<String>,
    max_concurrent: usize,
) -> Vec<Result<ScrapeResult, String>> {
    let semaphore = Arc::new(Semaphore::new(max_concurrent));
    let mut handles = vec![];
    
    for url in urls {
        let permit = Arc::clone(&semaphore);
        let handle = tokio::spawn(async move {
            // Acquire semaphore permit (limits concurrency)
            let _permit = permit.acquire().await.unwrap();
            scrape_url(&url).await
            // Permit automatically released when dropped
        });
        handles.push(handle);
    }
    
    let mut results = Vec::new();
    for handle in handles {
        match handle.await {
            Ok(result) => results.push(result),
            Err(e) => results.push(Err(format!("Task panicked: {}", e))),
        }
    }
    
    results
}

#[tokio::main]
async fn main() {
    let urls: Vec<String> = vec![
        "https://example.com/page1",
        "https://example.com/page2",
        "https://example.com/page3",
        "https://example.com/error-page",
        "https://example.com/page4",
        "https://example.com/page5",
    ].into_iter().map(String::from).collect();
    
    println!("Scraping {} URLs (max 3 concurrent)...", urls.len());
    let start = std::time::Instant::now();
    
    let results = scrape_with_concurrency_limit(urls, 3).await;
    
    println!("\nResults ({:?} total):", start.elapsed());
    for result in &results {
        match result {
            Ok(r) => println!("  ✓ {} - {}ms, {} bytes", r.url, r.duration_ms, r.body_length),
            Err(e) => println!("  ✗ {}", e),
        }
    }
    
    let success_count = results.iter().filter(|r| r.is_ok()).count();
    println!("\nSuccess: {}/{}", success_count, results.len());
}
```

**Explanation:**
- `tokio::spawn` creates a lightweight task (like a goroutine in Go)
- `Semaphore` limits concurrency (important to not overwhelm servers)
- Tasks are multiplexed onto a thread pool (thousands of tasks on few threads)
- Much cheaper than OS threads (~2KB per task vs ~8MB per thread)

**Scenario:** Web scrapers, batch API calls, parallel database queries, fan-out/fan-in patterns in microservices.
</details>

---

### Task 5: Channels in Async Context

**What to do:** Build a producer-consumer pipeline using tokio::sync::mpsc channels for log processing.

<details>
<summary>Click to see answer</summary>

```rust
use tokio::sync::mpsc;
use tokio::time::{Duration, interval};

#[derive(Debug, Clone)]
struct LogEvent {
    level: String,
    message: String,
    timestamp: u64,
}

// Producer: generates log events
async fn log_producer(tx: mpsc::Sender<LogEvent>, source: &str) {
    let events = vec![
        ("INFO", "Request received"),
        ("DEBUG", "Parsing body"),
        ("INFO", "Database query executed"),
        ("WARN", "Slow query detected"),
        ("ERROR", "Connection pool exhausted"),
        ("INFO", "Response sent"),
    ];
    
    for (i, (level, msg)) in events.iter().enumerate() {
        let event = LogEvent {
            level: level.to_string(),
            message: format!("[{}] {}", source, msg),
            timestamp: i as u64 * 100,
        };
        
        if tx.send(event).await.is_err() {
            println!("Receiver dropped, stopping producer");
            break;
        }
        
        tokio::time::sleep(Duration::from_millis(50)).await;
    }
}

// Consumer: processes log events
async fn log_consumer(mut rx: mpsc::Receiver<LogEvent>) {
    let mut error_count = 0u32;
    let mut total_count = 0u32;
    
    while let Some(event) = rx.recv().await {
        total_count += 1;
        
        match event.level.as_str() {
            "ERROR" => {
                error_count += 1;
                println!("🔴 [{}] {} (errors: {})", event.level, event.message, error_count);
            }
            "WARN" => {
                println!("🟡 [{}] {}", event.level, event.message);
            }
            _ => {
                println!("⚪ [{}] {}", event.level, event.message);
            }
        }
    }
    
    println!("\n--- Summary ---");
    println!("Total events: {}", total_count);
    println!("Errors: {}", error_count);
}

#[tokio::main]
async fn main() {
    // Bounded channel with buffer of 32
    let (tx, rx) = mpsc::channel(32);
    
    // Spawn consumer
    let consumer_handle = tokio::spawn(log_consumer(rx));
    
    // Spawn multiple producers
    let producer1 = tokio::spawn(log_producer(tx.clone(), "web-server"));
    let producer2 = tokio::spawn(log_producer(tx.clone(), "api-gateway"));
    
    // Drop our copy of the sender
    drop(tx);
    
    // Wait for producers to finish
    producer1.await.unwrap();
    producer2.await.unwrap();
    
    // Wait for consumer to finish (it finishes when all senders are dropped)
    consumer_handle.await.unwrap();
}
```

**Explanation:**
- `mpsc::channel(32)` creates a bounded async channel (back-pressure!)
- Multiple producers can share the sender via `.clone()`
- Consumer processes events as they arrive
- Channel closes when all senders are dropped

**Scenario:** Log aggregation, event processing pipelines, request queues, background job workers in web servers.
</details>

---

## 🧪 Mini-Project: Concurrent Download Manager

**What to do:** Build a download manager with: concurrent downloads limited by a semaphore, progress reporting via channels, error handling for failed downloads.

<details>
<summary>Click to see answer</summary>

```rust
use tokio::sync::{mpsc, Semaphore};
use std::sync::Arc;
use std::time::Duration;

#[derive(Debug)]
enum DownloadStatus {
    Started { url: String },
    Progress { url: String, percent: u8 },
    Completed { url: String, bytes: u64, duration_ms: u64 },
    Failed { url: String, error: String },
}

async fn download_file(
    url: String,
    status_tx: mpsc::Sender<DownloadStatus>,
) -> Result<u64, String> {
    status_tx.send(DownloadStatus::Started { url: url.clone() }).await.ok();
    
    let start = std::time::Instant::now();
    let total_bytes = url.len() as u64 * 1000; // Simulated size
    
    // Simulate download progress
    for progress in (0..=100).step_by(25) {
        tokio::time::sleep(Duration::from_millis(50)).await;
        status_tx.send(DownloadStatus::Progress { 
            url: url.clone(), 
            percent: progress as u8 
        }).await.ok();
    }
    
    if url.contains("fail") {
        let error = "Connection reset".to_string();
        status_tx.send(DownloadStatus::Failed { url, error: error.clone() }).await.ok();
        return Err(error);
    }
    
    let duration = start.elapsed().as_millis() as u64;
    status_tx.send(DownloadStatus::Completed { 
        url, bytes: total_bytes, duration_ms: duration 
    }).await.ok();
    
    Ok(total_bytes)
}

#[tokio::main]
async fn main() {
    let urls = vec![
        "https://cdn.example.com/file1.zip".to_string(),
        "https://cdn.example.com/file2.tar.gz".to_string(),
        "https://cdn.example.com/fail-file.bin".to_string(),
        "https://cdn.example.com/file3.iso".to_string(),
    ];
    
    let (status_tx, mut status_rx) = mpsc::channel(100);
    let semaphore = Arc::new(Semaphore::new(2)); // Max 2 concurrent downloads
    
    // Status reporter task
    let reporter = tokio::spawn(async move {
        while let Some(status) = status_rx.recv().await {
            match status {
                DownloadStatus::Started { url } => println!("⬇ Starting: {}", url),
                DownloadStatus::Progress { url, percent } => {
                    if percent == 100 || percent == 50 {
                        println!("  📊 {} - {}%", url.split('/').last().unwrap_or("?"), percent);
                    }
                }
                DownloadStatus::Completed { url, bytes, duration_ms } => {
                    println!("✅ Done: {} ({} bytes in {}ms)", 
                             url.split('/').last().unwrap_or("?"), bytes, duration_ms);
                }
                DownloadStatus::Failed { url, error } => {
                    println!("❌ Failed: {} - {}", url.split('/').last().unwrap_or("?"), error);
                }
            }
        }
    });
    
    // Download tasks
    let mut handles = vec![];
    for url in urls {
        let tx = status_tx.clone();
        let sem = Arc::clone(&semaphore);
        handles.push(tokio::spawn(async move {
            let _permit = sem.acquire().await.unwrap();
            download_file(url, tx).await
        }));
    }
    
    drop(status_tx); // Allow reporter to finish
    
    let mut total_bytes = 0u64;
    let mut success_count = 0u32;
    for handle in handles {
        if let Ok(Ok(bytes)) = handle.await {
            total_bytes += bytes;
            success_count += 1;
        }
    }
    
    reporter.await.unwrap();
    println!("\n📦 Total: {} files downloaded, {} bytes", success_count, total_bytes);
}
```
</details>

---

### Task 6: tokio::select! — Racing Futures

`select!` lets you race multiple futures and act on whichever completes first. Essential for timeouts, shutdown signals, and cancellation.

**What to do:** Build a request handler with a timeout and a shutdown signal using `tokio::select!`.

<details>
<summary>Click to see answer</summary>

```rust
use tokio::sync::watch;
use tokio::time::{Duration, timeout};

// Simulates a slow API call
async fn slow_api_call(id: u32) -> Result<String, String> {
    tokio::time::sleep(Duration::from_millis(id as u64 * 100)).await;
    Ok(format!("Response for request {}", id))
}

// Fetch with timeout using select!
async fn fetch_with_timeout(id: u32, timeout_ms: u64) -> Result<String, String> {
    tokio::select! {
        result = slow_api_call(id) => {
            result  // API completed first
        }
        _ = tokio::time::sleep(Duration::from_millis(timeout_ms)) => {
            Err(format!("Request {} timed out after {}ms", id, timeout_ms))
        }
    }
}

// Graceful shutdown pattern
async fn run_server(mut shutdown_rx: watch::Receiver<bool>) {
    let mut request_count = 0u32;

    loop {
        tokio::select! {
            // Wait for next "request" (simulated)
            _ = tokio::time::sleep(Duration::from_millis(200)) => {
                request_count += 1;
                println!("Handled request #{}", request_count);
            }
            // Check for shutdown signal
            _ = shutdown_rx.changed() => {
                if *shutdown_rx.borrow() {
                    println!("Shutdown signal received! Handled {} requests.", request_count);
                    break;
                }
            }
        }
    }
}

#[tokio::main]
async fn main() {
    // Example 1: Timeout
    println!("--- Timeout Example ---");
    for id in [1, 3, 5, 8] {
        match fetch_with_timeout(id, 400).await {
            Ok(resp) => println!("  ✓ {}", resp),
            Err(e) => println!("  ✗ {}", e),
        }
    }

    // Example 2: Graceful shutdown
    println!("\n--- Shutdown Example ---");
    let (shutdown_tx, shutdown_rx) = watch::channel(false);

    let server = tokio::spawn(run_server(shutdown_rx));

    // Let server run for 1 second, then shut down
    tokio::time::sleep(Duration::from_secs(1)).await;
    println!("Sending shutdown signal...");
    shutdown_tx.send(true).unwrap();

    server.await.unwrap();
    println!("Server stopped cleanly.");
}
```

**Key points about `select!`:**
- Races multiple futures — acts on whichever completes first
- Other branches are **cancelled** (dropped) when one completes
- `biased;` at the top forces top-to-bottom priority (no random order)
- Common patterns: timeout, shutdown signals, heartbeats, "first of N" APIs
</details>

---

## 🎯 Key Takeaways

| Tool | Use Case | Example |
|------|----------|---------|
| `std::thread` | CPU-bound parallelism | Image processing, compression |
| `mpsc::channel` | Thread communication | Producer-consumer |
| `Mutex<T>` | Shared mutable state | Counters, caches |
| `async/await` | I/O-bound concurrency | Web requests, DB queries |
| `tokio::spawn` | Lightweight tasks | Per-request handling |
| `Semaphore` | Concurrency limiting | Rate limiting, connection pools |
| `Send + Sync` | Thread-safety markers | Why `Rc` can't cross threads |
| `async move` | Transfer ownership to task | Data into `tokio::spawn` |
| `tokio::select!` | Race futures | Timeouts, shutdown signals |
| Runtime | Drives futures to completion | `#[tokio::main]`, Builder |

---

## ⏭️ Next: Section 08 - File I/O & CLI Tools

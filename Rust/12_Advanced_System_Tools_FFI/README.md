# Section 12: Advanced System Tools & FFI

> **Prerequisites:** Complete Sections 00-08 minimum. This section requires threads/async (Section 07), file I/O (Section 08), and traits (Section 05). Sections 09-11 are helpful but not strictly required.

## 🎯 Learning Objectives
- Understand unsafe Rust and when it's necessary
- Build high-performance system tools
- Work with FFI (Foreign Function Interface) and `bindgen`/`cbindgen`
- Handle signals for graceful shutdown
- Profile and optimize Rust code

---

## 📖 Core Concepts

### When to Use Unsafe

**Scenario:** 99% of Rust code is safe. Unsafe is needed for:
- FFI (calling C libraries)
- Performance-critical code that the compiler can't optimize
- Hardware interaction (embedded systems, device drivers)
- Implementing data structures the borrow checker can't verify

```rust
// Unsafe gives you FIVE superpowers:
// 1. Dereference raw pointers
// 2. Call unsafe functions
// 3. Access mutable static variables
// 4. Implement unsafe traits
// 5. Access union fields
```

### Signal Handling for Graceful Shutdown

System tools need to handle SIGINT (Ctrl+C) and SIGTERM to clean up before exiting:

```rust
// Option 1: Simple — ctrlc crate
// cargo add ctrlc
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::Arc;

fn main() {
    let running = Arc::new(AtomicBool::new(true));
    let r = running.clone();

    ctrlc::set_handler(move || {
        println!("\nReceived Ctrl+C, shutting down...");
        r.store(false, Ordering::SeqCst);
    }).expect("Error setting Ctrl+C handler");

    while running.load(Ordering::SeqCst) {
        // Do work...
    }
    println!("Cleanup complete.");
}

// Option 2: Async — tokio::signal (for web servers)
// #[tokio::main]
// async fn main() {
//     let server = start_server();
//     let shutdown = tokio::signal::ctrl_c();
//
//     tokio::select! {
//         _ = server => println!("Server stopped"),
//         _ = shutdown => println!("Shutdown signal received"),
//     }
//     // Cleanup resources here
// }
```

### Automatic FFI Bindings

```bash
# bindgen: Generate Rust bindings FROM C headers
cargo add bindgen --build  # as a build dependency

# cbindgen: Generate C headers FROM Rust code
cargo install cbindgen
cbindgen --output my_lib.h
```

---

## 📝 Tasks

### Task 1: Unsafe Rust Fundamentals

**What to do:** Build a safe `split_at_mut` (raw pointers) and a RingBuffer with a safe public API over unsafe internals.

<details>
<summary>Click to see answer</summary>

```rust
use std::slice;

// Raw pointers and unsafe blocks
fn split_at_mut(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = slice.len();
    let ptr = slice.as_mut_ptr();
    
    assert!(mid <= len);
    
    // The borrow checker can't verify this is safe, but we know it is
    // because the two slices don't overlap
    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.add(mid), len - mid),
        )
    }
}

// Safe wrapper around unsafe memory operations
struct RingBuffer<T> {
    buffer: Vec<T>,
    head: usize,
    tail: usize,
    capacity: usize,
}

impl<T: Default + Clone> RingBuffer<T> {
    fn new(capacity: usize) -> Self {
        RingBuffer {
            buffer: vec![T::default(); capacity],
            head: 0,
            tail: 0,
            capacity,
        }
    }
    
    fn push(&mut self, item: T) -> bool {
        let next_head = (self.head + 1) % self.capacity;
        if next_head == self.tail {
            return false; // Full
        }
        self.buffer[self.head] = item;
        self.head = next_head;
        true
    }
    
    fn pop(&mut self) -> Option<T> {
        if self.tail == self.head {
            return None; // Empty
        }
        let item = self.buffer[self.tail].clone();
        self.tail = (self.tail + 1) % self.capacity;
        Some(item)
    }
    
    fn len(&self) -> usize {
        if self.head >= self.tail {
            self.head - self.tail
        } else {
            self.capacity - self.tail + self.head
        }
    }
    
    fn is_empty(&self) -> bool {
        self.head == self.tail
    }
}

// Demonstrating when unsafe is needed vs when it's not
fn main() {
    // Split at mut — safe API over unsafe internals
    let mut data = vec![1, 2, 3, 4, 5, 6];
    let (left, right) = split_at_mut(&mut data, 3);
    println!("Left: {:?}", left);   // [1, 2, 3]
    println!("Right: {:?}", right); // [4, 5, 6]
    
    // Ring buffer — entirely safe public API
    let mut rb = RingBuffer::new(4);
    rb.push(10);
    rb.push(20);
    rb.push(30);
    println!("Ring buffer length: {}", rb.len()); // 3
    println!("Pop: {:?}", rb.pop()); // Some(10)
    println!("Pop: {:?}", rb.pop()); // Some(20)
    rb.push(40);
    rb.push(50);
    println!("Length after operations: {}", rb.len()); // 3
}
```

**Explanation:**
- Unsafe blocks are SMALL and encapsulated inside SAFE public APIs
- The programmer guarantees correctness within unsafe blocks
- `split_at_mut` is actually in the standard library — same pattern
- Ring buffers are used in I/O systems, audio processing, networking

**Scenario:** Building high-performance data structures, memory pools for web servers, zero-copy parsing.
</details>

---

### Task 2: FFI — Calling C Libraries

**What to do:** Call C standard library functions from Rust (strlen, abs, sqrt), and expose Rust functions to C.

<details>
<summary>Click to see answer</summary>

```rust
// Calling C standard library functions
use std::ffi::{CString, CStr};
use std::os::raw::{c_char, c_int, c_double};

// Declare external C functions
extern "C" {
    fn strlen(s: *const c_char) -> usize;
    fn abs(n: c_int) -> c_int;
    fn sqrt(n: c_double) -> c_double;
}

// Safe wrappers around C functions
fn safe_strlen(s: &str) -> usize {
    let c_string = CString::new(s).expect("String contains null byte");
    unsafe { strlen(c_string.as_ptr()) }
}

fn safe_abs(n: i32) -> i32 {
    unsafe { abs(n as c_int) as i32 }
}

fn safe_sqrt(n: f64) -> f64 {
    unsafe { sqrt(n as c_double) as f64 }
}

// Exposing Rust functions to C
#[no_mangle]
pub extern "C" fn rust_add(a: c_int, b: c_int) -> c_int {
    a + b
}

#[no_mangle]
pub extern "C" fn rust_string_length(s: *const c_char) -> c_int {
    if s.is_null() {
        return -1;
    }
    let c_str = unsafe { CStr::from_ptr(s) };
    match c_str.to_str() {
        Ok(s) => s.len() as c_int,
        Err(_) => -1,
    }
}

// Working with C structs
#[repr(C)]
struct Point {
    x: f64,
    y: f64,
}

#[repr(C)]
struct Rect {
    origin: Point,
    size: Point,
}

impl Point {
    fn distance_to(&self, other: &Point) -> f64 {
        let dx = self.x - other.x;
        let dy = self.y - other.y;
        safe_sqrt(dx * dx + dy * dy)
    }
}

impl Rect {
    fn area(&self) -> f64 {
        self.size.x * self.size.y
    }
    
    fn contains(&self, point: &Point) -> bool {
        point.x >= self.origin.x 
            && point.x <= self.origin.x + self.size.x
            && point.y >= self.origin.y 
            && point.y <= self.origin.y + self.size.y
    }
}

fn main() {
    // C function calls
    println!("strlen('hello') = {}", safe_strlen("hello"));
    println!("abs(-42) = {}", safe_abs(-42));
    println!("sqrt(144) = {}", safe_sqrt(144.0));
    
    // C-compatible structs
    let rect = Rect {
        origin: Point { x: 0.0, y: 0.0 },
        size: Point { x: 10.0, y: 5.0 },
    };
    
    let point = Point { x: 3.0, y: 2.0 };
    println!("Rect area: {}", rect.area());
    println!("Contains (3,2): {}", rect.contains(&point));
    
    let a = Point { x: 0.0, y: 0.0 };
    let b = Point { x: 3.0, y: 4.0 };
    println!("Distance: {}", a.distance_to(&b)); // 5.0
}
```

**Explanation:**
- `extern "C"` declares C calling convention functions
- `CString` / `CStr` handle null-terminated strings safely
- `#[repr(C)]` ensures struct layout matches C expectations
- `#[no_mangle]` prevents Rust from renaming exported functions
- Always wrap unsafe FFI in safe Rust APIs

**Scenario:** Using system libraries (OpenSSL, SQLite, zlib), wrapping Python/Node native extensions, game engine bindings, hardware drivers.
</details>

---

### Task 3: Building a High-Performance System Tool

**What to do:** Build a parallel file deduplicator that scans directories, groups files by size, then hashes potential duplicates across multiple threads.

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::HashMap;
use std::fs::{self, File};
use std::io::{self, Read, BufReader};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::thread;

// Simple hash function (in production, use sha256 from a crypto crate)
fn hash_file(path: &Path) -> io::Result<u64> {
    let file = File::open(path)?;
    let mut reader = BufReader::with_capacity(65536, file); // 64KB buffer
    let mut hasher: u64 = 0xcbf29ce484222325; // FNV offset basis
    let mut buffer = [0u8; 8192];
    
    loop {
        let bytes_read = reader.read(&mut buffer)?;
        if bytes_read == 0 { break; }
        
        for &byte in &buffer[..bytes_read] {
            hasher ^= byte as u64;
            hasher = hasher.wrapping_mul(0x100000001b3); // FNV prime
        }
    }
    
    Ok(hasher)
}

#[derive(Debug)]
struct DuplicateGroup {
    hash: u64,
    size: u64,
    paths: Vec<PathBuf>,
}

struct Deduplicator {
    min_size: u64,
    num_threads: usize,
}

impl Deduplicator {
    fn new(min_size: u64, num_threads: usize) -> Self {
        Deduplicator { min_size, num_threads }
    }
    
    fn find_duplicates(&self, root: &Path) -> io::Result<Vec<DuplicateGroup>> {
        // Phase 1: Collect files and group by size (fast, no I/O)
        println!("Phase 1: Scanning directory...");
        let files = self.collect_files(root)?;
        println!("  Found {} files", files.len());
        
        // Phase 2: Group by file size (same size = potential duplicate)
        let size_groups = self.group_by_size(&files);
        let potential_duplicates: Vec<_> = size_groups.into_iter()
            .filter(|(_, paths)| paths.len() > 1)
            .collect();
        println!("  {} size groups with potential duplicates", potential_duplicates.len());
        
        // Phase 3: Hash files in parallel (expensive I/O)
        println!("Phase 2: Hashing files...");
        let hash_map = Arc::new(Mutex::new(HashMap::<u64, Vec<(PathBuf, u64)>>::new()));
        
        let all_paths: Vec<(PathBuf, u64)> = potential_duplicates.into_iter()
            .flat_map(|(size, paths)| paths.into_iter().map(move |p| (p, size)))
            .collect();
        
        let chunk_size = (all_paths.len() / self.num_threads).max(1);
        let chunks: Vec<Vec<(PathBuf, u64)>> = all_paths
            .chunks(chunk_size)
            .map(|c| c.to_vec())
            .collect();
        
        let mut handles = vec![];
        for chunk in chunks {
            let map = Arc::clone(&hash_map);
            let handle = thread::spawn(move || {
                for (path, size) in chunk {
                    if let Ok(hash) = hash_file(&path) {
                        let mut m = map.lock().unwrap();
                        m.entry(hash).or_default().push((path, size));
                    }
                }
            });
            handles.push(handle);
        }
        
        for handle in handles {
            handle.join().unwrap();
        }
        
        // Phase 4: Collect results
        let map = Arc::try_unwrap(hash_map).unwrap().into_inner().unwrap();
        let duplicates: Vec<DuplicateGroup> = map.into_iter()
            .filter(|(_, paths)| paths.len() > 1)
            .map(|(hash, paths)| {
                let size = paths[0].1;
                DuplicateGroup {
                    hash,
                    size,
                    paths: paths.into_iter().map(|(p, _)| p).collect(),
                }
            })
            .collect();
        
        Ok(duplicates)
    }
    
    fn collect_files(&self, root: &Path) -> io::Result<Vec<(PathBuf, u64)>> {
        let mut files = Vec::new();
        self.collect_files_recursive(root, &mut files)?;
        Ok(files)
    }
    
    fn collect_files_recursive(&self, path: &Path, files: &mut Vec<(PathBuf, u64)>) -> io::Result<()> {
        if path.is_dir() {
            for entry in fs::read_dir(path)? {
                let entry = entry?;
                let path = entry.path();
                if path.is_dir() {
                    self.collect_files_recursive(&path, files)?;
                } else if let Ok(meta) = fs::metadata(&path) {
                    if meta.len() >= self.min_size {
                        files.push((path, meta.len()));
                    }
                }
            }
        }
        Ok(())
    }
    
    fn group_by_size(&self, files: &[(PathBuf, u64)]) -> HashMap<u64, Vec<PathBuf>> {
        let mut groups: HashMap<u64, Vec<PathBuf>> = HashMap::new();
        for (path, size) in files {
            groups.entry(*size).or_default().push(path.clone());
        }
        groups
    }
}

fn format_size(bytes: u64) -> String {
    if bytes >= 1_073_741_824 {
        format!("{:.2} GB", bytes as f64 / 1_073_741_824.0)
    } else if bytes >= 1_048_576 {
        format!("{:.2} MB", bytes as f64 / 1_048_576.0)
    } else if bytes >= 1024 {
        format!("{:.2} KB", bytes as f64 / 1024.0)
    } else {
        format!("{} B", bytes)
    }
}

fn main() -> io::Result<()> {
    let root = std::env::args().nth(1).unwrap_or_else(|| ".".to_string());
    let num_cpus = thread::available_parallelism()
        .map(|n| n.get())
        .unwrap_or(4);
    
    let dedup = Deduplicator::new(1024, num_cpus); // Min 1KB, use all CPUs
    
    println!("File Deduplicator");
    println!("Root: {}", root);
    println!("Threads: {}\n", num_cpus);
    
    let start = std::time::Instant::now();
    let duplicates = dedup.find_duplicates(Path::new(&root))?;
    let elapsed = start.elapsed();
    
    if duplicates.is_empty() {
        println!("\nNo duplicates found! ✓");
    } else {
        let total_wasted: u64 = duplicates.iter()
            .map(|g| g.size * (g.paths.len() as u64 - 1))
            .sum();
        
        println!("\nFound {} duplicate groups ({} wasted):", 
                 duplicates.len(), format_size(total_wasted));
        
        for group in duplicates.iter().take(10) {
            println!("\n  Size: {} | Hash: {:016x}", format_size(group.size), group.hash);
            for path in &group.paths {
                println!("    {}", path.display());
            }
        }
    }
    
    println!("\nCompleted in {:?}", elapsed);
    Ok(())
}
```

**Explanation:** This demonstrates building production-quality system tools:
- Multi-phase processing (scan → filter → hash → report)
- Parallel I/O with thread pools
- Efficient memory usage (group by size before expensive hashing)
- Human-readable output formatting

**Scenario:** Disk space tools (like `fdupes`), backup verification, storage optimization — tools that system administrators use daily.
</details>

---

### Task 4: Performance Profiling & Optimization

**What to do:** Benchmark different approaches (loop vs iterator, naive concat vs with_capacity), and understand SoA vs AoS layouts.

Add to `Cargo.toml`: `criterion = "0.5"` (for proper benchmarking)

<details>
<summary>Click to see answer</summary>

```rust
use std::time::Instant;

// Technique 1: Manual benchmarking
fn benchmark<F: FnMut()>(name: &str, iterations: u32, mut f: F) {
    let start = Instant::now();
    for _ in 0..iterations {
        f();
    }
    let elapsed = start.elapsed();
    let per_iter = elapsed / iterations;
    println!("{}: {:?} total, {:?}/iter ({} iters)", 
             name, elapsed, per_iter, iterations);
}

// Technique 2: Comparing approaches
fn sum_loop(data: &[i64]) -> i64 {
    let mut total = 0;
    for &x in data {
        total += x;
    }
    total
}

fn sum_iterator(data: &[i64]) -> i64 {
    data.iter().sum()
}

fn sum_chunks(data: &[i64]) -> i64 {
    // Process in chunks to improve cache locality
    data.chunks(1024)
        .map(|chunk| chunk.iter().sum::<i64>())
        .sum()
}

// Technique 3: Avoiding allocations
fn concat_naive(strings: &[&str]) -> String {
    let mut result = String::new();
    for s in strings {
        result.push_str(s);
        result.push(' ');
    }
    result
}

fn concat_with_capacity(strings: &[&str]) -> String {
    let total_len: usize = strings.iter().map(|s| s.len() + 1).sum();
    let mut result = String::with_capacity(total_len);
    for s in strings {
        result.push_str(s);
        result.push(' ');
    }
    result
}

fn concat_join(strings: &[&str]) -> String {
    strings.join(" ")
}

// Technique 4: Struct of Arrays vs Array of Structs
// AoS (typical)
struct ParticleAoS {
    x: f64, y: f64, z: f64,
    vx: f64, vy: f64, vz: f64,
}

// SoA (cache-friendly for batch operations)
struct ParticlesSoA {
    x: Vec<f64>, y: Vec<f64>, z: Vec<f64>,
    vx: Vec<f64>, vy: Vec<f64>, vz: Vec<f64>,
}

impl ParticlesSoA {
    fn new(n: usize) -> Self {
        ParticlesSoA {
            x: vec![0.0; n], y: vec![0.0; n], z: vec![0.0; n],
            vx: vec![1.0; n], vy: vec![1.0; n], vz: vec![1.0; n],
        }
    }
    
    fn update_positions(&mut self, dt: f64) {
        // This is VERY cache-friendly — processes contiguous memory
        for i in 0..self.x.len() {
            self.x[i] += self.vx[i] * dt;
            self.y[i] += self.vy[i] * dt;
            self.z[i] += self.vz[i] * dt;
        }
    }
}

fn main() {
    let data: Vec<i64> = (0..1_000_000).collect();
    
    println!("=== Sum Benchmarks ===");
    benchmark("Loop", 100, || { sum_loop(&data); });
    benchmark("Iterator", 100, || { sum_iterator(&data); });
    benchmark("Chunks", 100, || { sum_chunks(&data); });
    
    println!("\n=== String Concat Benchmarks ===");
    let strings: Vec<&str> = vec!["hello"; 10000];
    benchmark("Naive", 100, || { concat_naive(&strings); });
    benchmark("With capacity", 100, || { concat_with_capacity(&strings); });
    benchmark("Join", 100, || { concat_join(&strings); });
    
    println!("\n=== Particle Simulation ===");
    let mut particles = ParticlesSoA::new(1_000_000);
    benchmark("SoA update 1M particles", 100, || {
        particles.update_positions(0.016);
    });
}
```

**Explanation:**
- **Pre-allocate** with `String::with_capacity()` or `Vec::with_capacity()`
- **Iterators** often optimize as well as hand-written loops (zero-cost abstraction)
- **SoA layout** improves cache locality for batch processing
- **Profile before optimizing** — don't guess where bottlenecks are

**Scenario:** Game engines, scientific computing, data pipelines, any performance-sensitive system tool.
</details>

---

### Task 5: Building Production Binaries

**What to do:** Configure Cargo.toml for optimized release builds and learn cross-compilation.

<details>
<summary>Click to see answer</summary>

**Cargo.toml configuration:**
```toml
[profile.release]
opt-level = 3          # Maximum optimization
lto = true             # Link-Time Optimization (slower build, faster binary)
codegen-units = 1      # Single codegen unit (better optimization)
panic = "abort"        # Don't include unwinding code
strip = true           # Strip debug symbols (smaller binary)

[profile.release-with-debug]
inherits = "release"
debug = true           # Keep debug info for profiling
strip = false
```

```bash
# Build optimized binary
cargo build --release

# Build for specific CPU (uses all available instructions)
RUSTFLAGS="-C target-cpu=native" cargo build --release

# Cross-compile for Linux (from any OS)
rustup target add x86_64-unknown-linux-musl
cargo build --release --target x86_64-unknown-linux-musl

# Check binary size
ls -la target/release/your_tool

# Profile with flamegraph
cargo install flamegraph
cargo flamegraph --release
```

**Explanation:**
- Release builds are 10-100x faster than debug builds
- LTO enables cross-crate optimization
- `panic = "abort"` reduces binary size
- Static linking with musl creates portable Linux binaries
- Cross-compilation is first-class in Rust

**Scenario:** Deploying CLI tools, containerized web servers (small Docker images), embedded systems, distribution to end users.
</details>

---

## 🧪 Capstone Project Ideas

### 1. HTTP Load Tester (like `wrk`/`hey`)
- Concurrent HTTP requests with configurable parallelism
- Latency statistics (p50, p95, p99)
- Requests/second measurement
- Uses: tokio, reqwest, statistics

### 2. Log Aggregator (like a mini Loki)
- Ingest logs over HTTP
- Store with timestamps and labels
- Query by time range and label
- Uses: axum, serde, custom storage

### 3. File Sync Tool (like `rsync`)
- Compare directories by hash
- Only transfer changed files
- Resume interrupted transfers
- Uses: async I/O, hashing, networking

---

## 🎯 Key Takeaways

| Concept | When to Use | Safety Rule |
|---------|------------|-------------|
| `unsafe` block | FFI, raw pointers | Minimize scope, wrap in safe API |
| `#[repr(C)]` | FFI struct compatibility | Match C layout exactly |
| `extern "C"` | Call/expose C functions | Handle null pointers! |
| Benchmarking | Before & after optimization | Measure, don't guess |
| Release profile | Production builds | Always deploy release builds |
| Cross-compilation | Multi-platform | Use `--target` flag |

---

## 🎉 Congratulations!

You've completed the full Rust learning path — from ownership basics to building production web servers and system tools. You now have the knowledge to:

1. ✅ Write memory-safe code without a garbage collector
2. ✅ Build high-performance web APIs with Axum
3. ✅ Create professional CLI tools
4. ✅ Use async/await for concurrent I/O
5. ✅ Integrate with databases safely
6. ✅ Build system-level tools that rival C performance

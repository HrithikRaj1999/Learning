# Rust Challenge Guide

## How to Use Challenges

Each challenge simulates a real interview or work scenario. Attempt without looking at answers first.

---

## Challenge Levels

### 🟢 Level 1: Fundamentals (Sections 01-04)

**Challenge 1: Ownership Puzzle**
```rust
// Make this compile WITHOUT using .clone()
fn main() {
    let data = vec![1, 2, 3, 4, 5];
    let sum = calculate_sum(data);
    let avg = calculate_avg(data); // ERROR: data moved
    println!("Sum: {}, Avg: {}", sum, avg);
}
```

**Challenge 2: Lifetime Detective**
```rust
// Why doesn't this compile? Fix it.
struct Cache {
    data: Vec<String>,
}

impl Cache {
    fn get_or_insert(&mut self, key: &str) -> &str {
        if let Some(val) = self.data.iter().find(|s| s.starts_with(key)) {
            return val;
        }
        self.data.push(format!("{}: computed", key));
        self.data.last().unwrap()
    }
}
```

**Challenge 3: Error Propagation Chain**
```rust
// Build a function that reads a config file, parses port number,
// validates it's in range 1024-65535, and returns a typed Config.
// Use ? operator throughout. Create a custom error enum.
```

---

### 🟡 Level 2: Intermediate (Sections 05-08)

**Challenge 4: Generic Cache with Expiry**
```
Build a generic cache that:
- Stores any type that implements Clone
- Automatically expires entries after a configurable duration
- Returns None for expired entries
- Has a cleanup method to remove all expired entries
```

**Challenge 5: Parallel Map Function**
```
Implement a parallel_map function that:
- Takes a Vec<T> and a function F: T -> R
- Distributes work across N threads
- Returns Vec<R> in the original order
- Handles panics in worker threads gracefully
```

**Challenge 6: CLI Tool — Git Stats**
```
Build a CLI tool that:
- Accepts a directory path argument
- Counts .rs, .toml, .md files recursively
- Shows total lines of code per file type
- Displays results in a formatted table
- Has --verbose and --ignore flags
```

---

### 🔴 Level 3: Advanced (Sections 09-12)

**Challenge 7: Rate-Limited API Client**
```
Build an API client that:
- Respects rate limits (max N requests per second)
- Retries failed requests with exponential backoff
- Supports concurrent requests up to a limit
- Returns typed responses using serde
- Handles timeouts gracefully
```

**Challenge 8: Mini Web Framework**
```
Build a simplified web framework that:
- Accepts route registrations (method + path + handler)
- Supports path parameters (/users/:id)
- Has a middleware system (before/after hooks)
- Returns JSON responses
- Handles 404 for unmatched routes
```

**Challenge 9: Database Connection Pool**
```
Implement a connection pool that:
- Maintains N idle connections
- Hands out connections on request
- Returns connections when dropped (RAII)
- Times out if no connection available
- Health-checks idle connections
```

---

## Scoring Rubric

| Criteria | Points |
|----------|--------|
| Compiles without warnings | 2 |
| Correct output | 3 |
| Idiomatic Rust (no unnecessary clones/unwraps) | 2 |
| Error handling (no panics in production paths) | 2 |
| Performance (appropriate data structures) | 1 |
| **Total** | **10** |

---

## Tips for Interview Success

1. **Always start with the type signature** — let the compiler guide you
2. **Prefer borrowing over cloning** — shows understanding of ownership
3. **Use iterators over manual loops** — shows idiomatic style
4. **Handle all error cases** — use `Result`, not `unwrap()`
5. **Think about lifetimes** — annotate only when necessary
6. **Name things well** — Rust community values clarity

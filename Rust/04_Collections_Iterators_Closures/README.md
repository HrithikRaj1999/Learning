# Section 04: Collections, Iterators & Closures

> **Prerequisites:** Complete Sections 00-03. You should understand structs, enums, match, Option, Result, and Vec basics.

## 🎯 Learning Objectives
- Master HashMap and HashSet for key-value and unique data storage
- Understand iterators — what they are and how to chain them
- Learn closures — anonymous functions that capture their environment
- Build data processing pipelines with filter/map/collect

---

## 📖 Core Concepts

### 1. HashMap — Key-Value Storage

A HashMap stores data as key-value pairs (like a dictionary in Python or object in JavaScript). You need to import it:

```rust
use std::collections::HashMap;  // MUST import — not in the prelude

fn main() {
    // Create a HashMap
    let mut scores: HashMap<String, u32> = HashMap::new();

    // Insert key-value pairs
    scores.insert(String::from("Alice"), 92);
    scores.insert(String::from("Bob"), 78);
    scores.insert(String::from("Charlie"), 85);

    // Access a value by key — returns Option<&V>
    match scores.get("Alice") {
        Some(score) => println!("Alice's score: {}", score),
        None => println!("Alice not found"),
    }

    // Check if key exists
    println!("Has Bob? {}", scores.contains_key("Bob"));  // true

    // Insert only if key doesn't exist yet
    scores.entry(String::from("Alice")).or_insert(0);   // Does nothing — Alice exists
    scores.entry(String::from("Diana")).or_insert(88);   // Inserts Diana: 88

    // Update: the entry API returns a mutable reference
    let alice_score = scores.entry(String::from("Alice")).or_insert(0);
    *alice_score += 5;  // Alice: 92 → 97

    // Iterate over all pairs
    for (name, score) in &scores {
        println!("{}: {}", name, score);
    }

    // Remove a key
    scores.remove("Bob");
    println!("After removing Bob: {} entries", scores.len());
}
```

**When to use HashMap vs Vec:**
| | Vec | HashMap |
|-|-----|---------|
| Access by | Index (position) | Key (any hashable type) |
| Order | Maintained | NOT guaranteed |
| Speed | O(n) to find by value | O(1) to find by key |
| Use when | Ordered list, iteration | Fast lookup, counting, caching |

### The `entry` API — Insert or Update Idiom

```rust
use std::collections::HashMap;

fn main() {
    // Count word frequencies — the most common HashMap pattern
    let text = "hello world hello rust hello world";
    let mut counts: HashMap<&str, u32> = HashMap::new();

    for word in text.split_whitespace() {
        // entry() returns an Entry that lets you insert OR update
        let count = counts.entry(word).or_insert(0);
        // count is a &mut u32 pointing into the HashMap
        *count += 1;
    }

    println!("{:?}", counts);
    // {"hello": 3, "world": 2, "rust": 1}
}
```

---

### 2. HashSet — Unique Values Only

```rust
use std::collections::HashSet;

fn main() {
    let mut languages: HashSet<String> = HashSet::new();

    // Insert (duplicates are ignored)
    languages.insert(String::from("Rust"));
    languages.insert(String::from("Python"));
    languages.insert(String::from("Rust"));     // Duplicate — ignored
    println!("Count: {}", languages.len());      // 2, not 3

    // Check membership
    println!("Has Rust? {}", languages.contains("Rust"));  // true

    // Create from a Vec (removes duplicates)
    let numbers = vec![1, 2, 3, 2, 1, 4, 3, 5];
    let unique: HashSet<i32> = numbers.into_iter().collect();
    println!("Unique: {:?}", unique);  // {1, 2, 3, 4, 5} (order not guaranteed)

    // Set operations
    let set_a: HashSet<i32> = vec![1, 2, 3, 4].into_iter().collect();
    let set_b: HashSet<i32> = vec![3, 4, 5, 6].into_iter().collect();

    let intersection: HashSet<&i32> = set_a.intersection(&set_b).collect();
    let union: HashSet<&i32> = set_a.union(&set_b).collect();
    let difference: HashSet<&i32> = set_a.difference(&set_b).collect();

    println!("A ∩ B: {:?}", intersection);  // {3, 4}
    println!("A ∪ B: {:?}", union);          // {1, 2, 3, 4, 5, 6}
    println!("A - B: {:?}", difference);     // {1, 2}
}
```

---

### 3. Iterators — Processing Collections

An iterator produces a sequence of values one at a time. Instead of writing loops manually, you chain iterator methods.

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Three ways to get an iterator:
    // .iter()      → borrows each element (&T)  — original Vec is unchanged
    // .iter_mut()  → mutably borrows each (&mut T) — can modify elements
    // .into_iter() → takes ownership (T) — consumes the Vec

    // Using .iter() (most common — borrows)
    for num in numbers.iter() {
        print!("{} ", num);  // num is &i32
    }
    println!();
    // numbers is still valid here!

    // Common iterator methods:

    // filter — keep items that match a condition
    let evens: Vec<&i32> = numbers.iter()
        .filter(|n| **n % 2 == 0)  // **n because n is &&i32 (reference to reference)
        .collect();
    println!("Evens: {:?}", evens);  // [2, 4, 6, 8, 10]

    // map — transform each item
    let doubled: Vec<i32> = numbers.iter()
        .map(|n| n * 2)
        .collect();
    println!("Doubled: {:?}", doubled);  // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

    // Chaining filter + map (the core pattern!)
    let result: Vec<i32> = numbers.iter()
        .filter(|n| **n > 5)        // Keep numbers > 5
        .map(|n| n * 10)            // Multiply by 10
        .collect();                  // Collect into a Vec
    println!("Filtered & mapped: {:?}", result);  // [60, 70, 80, 90, 100]

    // Terminal operations (consume the iterator):
    let sum: i32 = numbers.iter().sum();
    let count = numbers.iter().filter(|n| **n > 5).count();
    let any_big = numbers.iter().any(|n| *n > 100);
    let all_positive = numbers.iter().all(|n| *n > 0);
    let min = numbers.iter().min();
    let max = numbers.iter().max();

    println!("Sum: {}, Count > 5: {}", sum, count);
    println!("Any > 100: {}, All positive: {}", any_big, all_positive);
    println!("Min: {:?}, Max: {:?}", min, max);
}
```

**Why iterators instead of for loops?**
1. Iterators are **lazy** — they don't create intermediate collections
2. The compiler can optimize them as well as hand-written loops
3. They're more readable for data transformation chains

### Useful Iterator Methods Reference

| Method | What It Does | Returns |
|--------|-------------|---------|
| `.filter(\|x\| cond)` | Keep items where condition is true | Iterator |
| `.map(\|x\| expr)` | Transform each item | Iterator |
| `.collect()` | Gather into a collection | Vec, HashMap, etc. |
| `.sum()` | Add all items | Single value |
| `.count()` | Count items | usize |
| `.any(\|x\| cond)` | True if ANY item matches | bool |
| `.all(\|x\| cond)` | True if ALL items match | bool |
| `.min()` / `.max()` | Find smallest/largest | Option |
| `.find(\|x\| cond)` | First item matching condition | Option |
| `.enumerate()` | Add index: (0, item), (1, item), ... | Iterator |
| `.take(n)` | First n items only | Iterator |
| `.skip(n)` | Skip first n items | Iterator |
| `.zip(other)` | Pair items from two iterators | Iterator of tuples |

---

### 4. Closures — Anonymous Functions

A closure is a function without a name that can capture variables from its surrounding scope:

```rust
fn main() {
    // Regular function — can NOT access variables outside it
    fn add(a: i32, b: i32) -> i32 {
        a + b
    }

    // Closure — CAN access variables from the surrounding scope
    let multiplier = 3;
    let multiply = |x: i32| -> i32 {
        x * multiplier  // Captures `multiplier` from the surrounding scope
    };

    println!("{}", add(2, 3));       // 5
    println!("{}", multiply(5));      // 15 (5 * 3)

    // Closures have SHORT syntax — type inference works
    let double = |x| x * 2;          // Types inferred from usage
    let is_positive = |x: i32| x > 0;
    let greet = |name: &str| format!("Hello, {}!", name);

    println!("{}", double(7));         // 14
    println!("{}", is_positive(-3));   // false
    println!("{}", greet("Rust"));     // Hello, Rust!
}
```

### Closures + Iterators = Power

Closures are primarily used WITH iterators:

```rust
fn main() {
    let names = vec!["Alice", "Bob", "Charlie", "Diana", "Eve"];

    // Closure as filter predicate
    let long_names: Vec<&&str> = names.iter()
        .filter(|name| name.len() > 3)  // Closure: |name| name.len() > 3
        .collect();
    println!("Long names: {:?}", long_names);  // ["Alice", "Charlie", "Diana"]

    // Closure as map transformation
    let uppercased: Vec<String> = names.iter()
        .map(|name| name.to_uppercase())  // Closure: |name| name.to_uppercase()
        .collect();
    println!("Upper: {:?}", uppercased);

    // Closure capturing a variable
    let min_length = 4;
    let filtered: Vec<&&str> = names.iter()
        .filter(|name| name.len() >= min_length)  // Captures min_length
        .collect();
    println!("Length >= {}: {:?}", min_length, filtered);
}
```

### How Closures Capture Variables

```rust
fn main() {
    // Borrowing (most common — read-only access to captured variables)
    let prefix = String::from("[LOG]");
    let log = |msg: &str| println!("{} {}", prefix, msg);  // Borrows prefix
    log("starting");
    log("running");
    println!("prefix still valid: {}", prefix);  // ✅ Works — only borrowed

    // Mutable borrowing (when the closure needs to modify a captured variable)
    let mut count = 0;
    let mut increment = || {
        count += 1;  // Mutably borrows count
        count
    };
    println!("{}", increment());  // 1
    println!("{}", increment());  // 2
    // NOTE: Can't use `count` while `increment` holds the mutable borrow
    // After the last use of `increment`, `count` becomes available again

    // Moving (when the closure takes ownership)
    let data = vec![1, 2, 3];
    let owns_data = move || {
        println!("Data: {:?}", data);  // `move` forces ownership transfer
    };
    owns_data();
    // println!("{:?}", data);  // ❌ ERROR: data was moved into the closure
}
```

**When does `move` matter?** When passing closures to threads or async tasks (Section 07). For now, just know that most closures borrow automatically.

---

## 📝 Tasks

### Task 1: Word Frequency Counter

**What to do:** Write a function `word_count(text: &str) -> HashMap<String, u32>` that counts how many times each word appears (case-insensitive). Then write `top_words(counts: &HashMap<String, u32>, n: usize) -> Vec<(&str, u32)>` that returns the top N most frequent words, sorted by count.

Test with: "the quick brown fox jumps over the lazy dog the quick fox"

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::HashMap;

fn word_count(text: &str) -> HashMap<String, u32> {
    let mut counts = HashMap::new();
    for word in text.split_whitespace() {
        let lower = word.to_lowercase();
        let count = counts.entry(lower).or_insert(0);
        *count += 1;
    }
    counts
}

fn top_words(counts: &HashMap<String, u32>, n: usize) -> Vec<(&str, u32)> {
    // Collect into a Vec so we can sort
    let mut pairs: Vec<(&str, u32)> = Vec::new();
    for (word, count) in counts {
        pairs.push((word.as_str(), *count));
    }

    // Sort by count descending
    pairs.sort_by(|a, b| b.1.cmp(&a.1));

    // Keep only top N
    pairs.truncate(n);
    pairs
}

fn main() {
    let text = "the quick brown fox jumps over the lazy dog the quick fox";
    let counts = word_count(text);

    println!("All words: {:?}", counts);
    println!();

    let top = top_words(&counts, 3);
    for (word, count) in &top {
        println!("  '{}' appears {} time(s)", word, count);
    }
    // Expected: 'the' 3, 'fox' 2, 'quick' 2
}
```
</details>

---

### Task 2: HashMap — Group By

**What to do:** Given a list of `(name, department)` tuples, group employees by department. Write a function `group_by_department(employees: &[(&str, &str)]) -> HashMap<String, Vec<String>>` that returns department → list of names.

Test data:
```rust
let employees = [
    ("Alice", "Engineering"), ("Bob", "Marketing"),
    ("Charlie", "Engineering"), ("Diana", "Sales"),
    ("Eve", "Marketing"), ("Frank", "Engineering"),
];
```

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::HashMap;

fn group_by_department(employees: &[(&str, &str)]) -> HashMap<String, Vec<String>> {
    let mut groups: HashMap<String, Vec<String>> = HashMap::new();

    for (name, dept) in employees {
        let list = groups.entry(dept.to_string()).or_insert_with(Vec::new);
        list.push(name.to_string());
    }

    groups
}

fn main() {
    let employees = [
        ("Alice", "Engineering"), ("Bob", "Marketing"),
        ("Charlie", "Engineering"), ("Diana", "Sales"),
        ("Eve", "Marketing"), ("Frank", "Engineering"),
    ];

    let groups = group_by_department(&employees);

    for (dept, names) in &groups {
        println!("{}: {:?}", dept, names);
    }
    // Engineering: ["Alice", "Charlie", "Frank"]
    // Marketing: ["Bob", "Eve"]
    // Sales: ["Diana"]
}
```

**Key pattern:** `entry().or_insert_with(Vec::new)` creates a new empty Vec if the key doesn't exist yet. This is the standard "group by" pattern in Rust.
</details>

---

### Task 3: Iterator Chains — Data Processing

**What to do:** Given a list of products with (name, price, category), use iterator chains to:
1. Find the average price of all products
2. Find the most expensive product in each category
3. Get names of products under $20, sorted alphabetically

```rust
let products = vec![
    ("Widget", 9.99, "Tools"),
    ("Gadget", 24.99, "Electronics"),
    ("Doohickey", 4.99, "Tools"),
    ("Thingamajig", 49.99, "Electronics"),
    ("Whatchamacallit", 14.99, "Tools"),
    ("Gizmo", 34.99, "Electronics"),
    ("Doodad", 7.99, "Office"),
];
```

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::HashMap;

fn main() {
    let products = vec![
        ("Widget", 9.99, "Tools"),
        ("Gadget", 24.99, "Electronics"),
        ("Doohickey", 4.99, "Tools"),
        ("Thingamajig", 49.99, "Electronics"),
        ("Whatchamacallit", 14.99, "Tools"),
        ("Gizmo", 34.99, "Electronics"),
        ("Doodad", 7.99, "Office"),
    ];

    // 1. Average price
    let total: f64 = products.iter().map(|(_, price, _)| price).sum();
    let average = total / products.len() as f64;
    println!("Average price: ${:.2}", average);

    // 2. Most expensive per category
    let mut most_expensive: HashMap<&str, (&str, f64)> = HashMap::new();
    for (name, price, category) in &products {
        let entry = most_expensive.entry(category).or_insert((*name, *price));
        if *price > entry.1 {
            *entry = (*name, *price);
        }
    }
    println!("\nMost expensive per category:");
    for (cat, (name, price)) in &most_expensive {
        println!("  {}: {} (${:.2})", cat, name, price);
    }

    // 3. Products under $20, sorted
    let mut cheap: Vec<&str> = products.iter()
        .filter(|(_, price, _)| *price < 20.0)
        .map(|(name, _, _)| *name)
        .collect();
    cheap.sort();  // Sort alphabetically
    println!("\nProducts under $20: {:?}", cheap);
    // ["Doohickey", "Doodad", "Whatchamacallit", "Widget"]
}
```

**Key patterns:**
- `.iter().map(...).sum()` — transform and aggregate
- `.iter().filter(...).map(...).collect()` — the core pipeline pattern
- Combine iterators with HashMap for grouping operations
</details>

---

### Task 4: Closures — Sort and Transform

**What to do:** 
1. Sort a list of names by length (shortest first), then alphabetically for ties
2. Write a function `apply_all` that takes a number and a Vec of closures, applying each one in sequence

<details>
<summary>Click to see answer</summary>

```rust
fn main() {
    // 1. Sort by length, then alphabetically
    let mut names = vec!["Charlie", "Bob", "Alice", "Eve", "Diana", "Al"];

    names.sort_by(|a, b| {
        // First compare by length
        let len_cmp = a.len().cmp(&b.len());
        if len_cmp == std::cmp::Ordering::Equal {
            a.cmp(b)  // If same length, sort alphabetically
        } else {
            len_cmp
        }
    });
    println!("Sorted: {:?}", names);
    // ["Al", "Bob", "Eve", "Alice", "Diana", "Charlie"]

    // 2. Apply a sequence of transformations
    let transformations: Vec<fn(i32) -> i32> = vec![
        |x| x + 10,     // Add 10
        |x| x * 2,      // Double
        |x| x - 5,      // Subtract 5
    ];

    let mut value = 5;
    println!("\nStarting with: {}", value);
    for transform in &transformations {
        value = transform(value);
        println!("  → {}", value);
    }
    // 5 → 15 → 30 → 25

    // 3. Closures that capture variables
    let threshold = 50;
    let scores = vec![82, 45, 91, 33, 78, 67, 55];

    let above: Vec<&i32> = scores.iter()
        .filter(|s| **s >= threshold)  // Closure captures `threshold`
        .collect();
    let below: Vec<&i32> = scores.iter()
        .filter(|s| **s < threshold)
        .collect();

    println!("\nAbove {}: {:?}", threshold, above);
    println!("Below {}: {:?}", threshold, below);
}
```

**Note:** `fn(i32) -> i32` is a function pointer type — it works for closures that DON'T capture any variables. For closures that capture variables, you'd need `Box<dyn Fn(i32) -> i32>` (covered in Section 05 with traits).
</details>

---

### Task 5: Enumerate, Zip, and Take

**What to do:** Practice these less common but useful iterator methods:
1. Use `.enumerate()` to find the INDEX of the first number > 100 in a list
2. Use `.zip()` to pair student names with their scores
3. Use `.take()` and `.skip()` to get a "page" of results

<details>
<summary>Click to see answer</summary>

```rust
fn main() {
    // 1. enumerate — get index + value
    let numbers = vec![23, 56, 78, 145, 12, 200, 67];

    let mut first_big_index: Option<usize> = None;
    for (index, &num) in numbers.iter().enumerate() {
        if num > 100 {
            first_big_index = Some(index);
            break;
        }
    }
    match first_big_index {
        Some(i) => println!("First number > 100 at index {}: {}", i, numbers[i]),
        None => println!("No number > 100 found"),
    }
    // Output: First number > 100 at index 3: 145

    // Alternative using .find() with enumerate
    let found = numbers.iter().enumerate()
        .find(|(_, &num)| num > 100);
    println!("Using find: {:?}", found);  // Some((3, 145))

    // 2. zip — pair two iterators
    let names = vec!["Alice", "Bob", "Charlie", "Diana"];
    let scores = vec![92, 78, 85, 96];

    let paired: Vec<(&&str, &i32)> = names.iter().zip(scores.iter()).collect();
    println!("\nPaired: {:?}", paired);

    // Print as a table
    for (name, score) in names.iter().zip(scores.iter()) {
        println!("  {} → {}", name, score);
    }

    // 3. skip + take — pagination
    let all_items: Vec<i32> = (1..=20).collect();
    let page_size = 5;
    let page_number = 2;  // 0-indexed

    let page: Vec<&i32> = all_items.iter()
        .skip(page_number * page_size)
        .take(page_size)
        .collect();
    println!("\nPage {} (size {}): {:?}", page_number, page_size, page);
    // Page 2 (size 5): [11, 12, 13, 14, 15]
}
```
</details>

---

### Task 6: HashSet — Find Duplicates and Differences

**What to do:** 
1. Write a function `find_duplicates(items: &[&str]) -> Vec<String>` that finds items appearing more than once
2. Given two lists of tags, find: common tags, tags only in list A, tags only in list B

<details>
<summary>Click to see answer</summary>

```rust
use std::collections::{HashMap, HashSet};

fn find_duplicates(items: &[&str]) -> Vec<String> {
    let mut seen: HashSet<&str> = HashSet::new();
    let mut duplicates: HashSet<&str> = HashSet::new();

    for item in items {
        if !seen.insert(item) {
            // insert returns false if the item was already in the set
            duplicates.insert(item);
        }
    }

    let mut result: Vec<String> = duplicates.iter().map(|s| s.to_string()).collect();
    result.sort();
    result
}

fn main() {
    // 1. Find duplicates
    let items = ["apple", "banana", "apple", "cherry", "banana", "date", "apple"];
    let dupes = find_duplicates(&items);
    println!("Duplicates: {:?}", dupes);  // ["apple", "banana"]

    // 2. Tag comparison
    let blog_tags: HashSet<&str> = vec!["rust", "programming", "web", "tutorial"].into_iter().collect();
    let video_tags: HashSet<&str> = vec!["rust", "video", "web", "beginner"].into_iter().collect();

    let common: Vec<&&str> = blog_tags.intersection(&video_tags).collect();
    let blog_only: Vec<&&str> = blog_tags.difference(&video_tags).collect();
    let video_only: Vec<&&str> = video_tags.difference(&blog_tags).collect();

    println!("\nCommon tags: {:?}", common);       // ["rust", "web"]
    println!("Blog only: {:?}", blog_only);        // ["programming", "tutorial"]
    println!("Video only: {:?}", video_only);      // ["video", "beginner"]
}
```
</details>

---

## 🧪 Mini-Project: Sales Report Generator

**What to build:** Process sales data and generate a summary report using HashMap, iterators, and closures.

<details>
<summary>Click to see complete project</summary>

```rust
use std::collections::HashMap;

#[derive(Debug)]
struct Sale {
    product: String,
    category: String,
    quantity: u32,
    unit_price: f64,
    region: String,
}

impl Sale {
    fn total(&self) -> f64 {
        self.quantity as f64 * self.unit_price
    }
}

fn build_sample_data() -> Vec<Sale> {
    vec![
        Sale { product: "Laptop".into(), category: "Electronics".into(), quantity: 5, unit_price: 999.99, region: "North".into() },
        Sale { product: "Mouse".into(), category: "Electronics".into(), quantity: 50, unit_price: 29.99, region: "South".into() },
        Sale { product: "Desk".into(), category: "Furniture".into(), quantity: 10, unit_price: 249.99, region: "North".into() },
        Sale { product: "Chair".into(), category: "Furniture".into(), quantity: 15, unit_price: 199.99, region: "East".into() },
        Sale { product: "Monitor".into(), category: "Electronics".into(), quantity: 8, unit_price: 449.99, region: "North".into() },
        Sale { product: "Keyboard".into(), category: "Electronics".into(), quantity: 30, unit_price: 79.99, region: "West".into() },
        Sale { product: "Bookshelf".into(), category: "Furniture".into(), quantity: 7, unit_price: 149.99, region: "South".into() },
        Sale { product: "Laptop".into(), category: "Electronics".into(), quantity: 3, unit_price: 999.99, region: "East".into() },
        Sale { product: "Desk".into(), category: "Furniture".into(), quantity: 5, unit_price: 249.99, region: "West".into() },
    ];
}

fn main() {
    let sales = build_sample_data();

    // Overall statistics
    let total_revenue: f64 = sales.iter().map(|s| s.total()).sum();
    let total_units: u32 = sales.iter().map(|s| s.quantity).sum();
    println!("=== SALES REPORT ===");
    println!("Total Revenue: ${:.2}", total_revenue);
    println!("Total Units Sold: {}", total_units);
    println!("Number of Transactions: {}", sales.len());

    // Revenue by category
    let mut by_category: HashMap<&str, f64> = HashMap::new();
    for sale in &sales {
        let total = by_category.entry(&sale.category).or_insert(0.0);
        *total += sale.total();
    }
    println!("\n--- Revenue by Category ---");
    for (cat, rev) in &by_category {
        println!("  {}: ${:.2}", cat, rev);
    }

    // Revenue by region
    let mut by_region: HashMap<&str, f64> = HashMap::new();
    for sale in &sales {
        let total = by_region.entry(&sale.region).or_insert(0.0);
        *total += sale.total();
    }
    println!("\n--- Revenue by Region ---");
    let mut regions: Vec<(&str, f64)> = by_region.iter().map(|(k, v)| (*k, *v)).collect();
    regions.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
    for (region, rev) in &regions {
        println!("  {}: ${:.2}", region, rev);
    }

    // Top selling products by quantity
    let mut by_product: HashMap<&str, u32> = HashMap::new();
    for sale in &sales {
        let qty = by_product.entry(&sale.product).or_insert(0);
        *qty += sale.quantity;
    }
    let mut product_list: Vec<(&str, u32)> = by_product.iter().map(|(k, v)| (*k, *v)).collect();
    product_list.sort_by(|a, b| b.1.cmp(&a.1));
    println!("\n--- Top Products by Quantity ---");
    for (product, qty) in product_list.iter().take(5) {
        println!("  {}: {} units", product, qty);
    }

    // High-value transactions (> $2000)
    let high_value: Vec<String> = sales.iter()
        .filter(|s| s.total() > 2000.0)
        .map(|s| format!("{} ({} x ${:.2} = ${:.2})", s.product, s.quantity, s.unit_price, s.total()))
        .collect();
    println!("\n--- High-Value Transactions (>$2000) ---");
    for tx in &high_value {
        println!("  {}", tx);
    }
}
```
</details>

---

## 🎯 Key Takeaways

| Concept | Pattern | When to Use |
|---------|---------|-------------|
| HashMap | `entry().or_insert()` | Counting, grouping, caching |
| HashSet | `.insert()`, `.contains()` | Unique values, set operations |
| `.iter().filter().map().collect()` | Core pipeline | Transform data |
| `.sum()`, `.count()`, `.any()` | Terminal operations | Aggregate data |
| `.enumerate()` | `(index, value)` pairs | Need position in iteration |
| `.zip()` | Pair two iterators | Parallel data |
| `.sort_by(\|a, b\| ...)` | Custom sort with closure | Complex ordering |
| Closures | `\|args\| body` | Predicates, transforms, callbacks |

---

## ⏭️ Next: Section 05 - Traits & Generics

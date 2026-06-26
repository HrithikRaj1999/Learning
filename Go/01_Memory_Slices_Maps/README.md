# Module 1: Memory Layout, Slices, and Maps

> **Goal:** Understand exactly what bytes move when you pass a slice or map, when data escapes to the heap, and why `append` can silently corrupt shared state.

---

## 1. Core Concept & The Py-Go Bridge

### The Slice Header (24 bytes on 64-bit)

A Go slice is **not** the data. It is a small struct — a *header* — that points at a backing array:

```go
type sliceHeader struct {
    Data uintptr // 8 bytes — pointer to backing array
    Len  int     // 8 bytes — elements currently usable
    Cap  int     // 8 bytes — elements before re-allocation needed
}
```

That's **24 bytes**, always, regardless of how many elements the slice holds. When you pass a slice to a function, Go **copies these 24 bytes by value**. Both copies point at the *same backing array*. So:

- Mutating an existing element through the copy → visible to the caller (shared array).
- `append` that fits within `cap` → mutates the shared array (caller may or may not see it depending on its `len`).
- `append` that exceeds `cap` → allocates a **new** array, copies elements, repoints only the local header. Caller's header is stale.

### Append Re-allocation (Growth)

When `len == cap` and you append, the runtime allocates a bigger backing array. Growth is roughly: double until ~1024 elements, then grow ~1.25×. The old array is abandoned (GC reclaims it). The new array address differs — any other slice still pointing at the old array is now disconnected.

### Map Bucket Architecture

A Go map (`hmap`) is a hash table of **buckets**. Each bucket (`bmap`) holds up to **8 key/value pairs** plus an overflow pointer. Lookup: hash the key → low bits select a bucket → top 8 bits of the hash (`tophash`) quickly skip non-matching slots within the bucket. When buckets get too full (load factor > 6.5 avg per bucket), the map **grows** and rehashes incrementally.

Maps are **not thread-safe**. Concurrent read+write is a *fatal* runtime error (`fatal error: concurrent map read and map write`) — not a recoverable panic. Map elements are **not addressable**: you cannot take `&m[k]`.

### Escape Analysis (Stack vs Heap)

The Go compiler decides per-variable whether it can live on the **stack** (cheap, auto-freed on return) or must **escape to the heap** (GC-managed). A value escapes when its lifetime outlives the function — e.g. you return its address, store it in an interface, send it on a channel, or capture it in a closure that escapes.

### The Py-Go Bridge

| Concept | Python / JS | Go |
|---------|-------------|-----|
| List/array | `list` / `Array` = heap object + dynamic pointer array; the variable is a *reference* | Slice = 24-byte **value** header copied on pass; points at shared backing array |
| Passing to function | Always pass the reference; callee mutations visible | Pass header **by value**; element mutation visible, re-alloc not |
| Dict/map | `dict` / `Object` = heap hash table, reference-passed | `map` = pointer to `hmap`; reference-like, but **panics** on concurrent R/W |
| Growth | amortized doubling, hidden | Same idea, but you can pre-size with `make([]T, 0, n)` / `make(map[K]V, n)` |
| Memory placement | everything heap, freed by refcount+GC | compiler **chooses** stack vs heap via escape analysis |
| `&m[k]` | n/a | **illegal** — map entries not addressable |

**Key mental shift:** in Python every container is a heap reference. In Go, the slice header is a stack-copyable value, and *where* data lives is a compiler decision you can inspect and influence.

---

## 2. Interview Hotspots & Traps

- **The aliasing append trap:** `b := a[:2]; b = append(b, x)` — if `a` had spare cap, this overwrites `a[2]`. Classic data-corruption bug.
- **`len` vs `cap`:** `s := make([]int, 0, 10)` → `len 0, cap 10`. `s := make([]int, 10)` → `len 10` of zeros. Interviewer asks the values.
- **Slicing keeps the big array alive:** `small := huge[0:1]` keeps the *entire* backing array in memory → memory leak. Fix is to copy.
- **Three-index slice:** `a[low:high:max]` sets cap explicitly to limit accidental sharing. Why does it exist? (Answer: force re-alloc on next append.)
- **Nil slice vs empty slice:** `var s []int` (nil, `len 0`) vs `s := []int{}` (non-nil, `len 0`). Both rangeable; differ in JSON marshal (`null` vs `[]`) and `== nil`.
- **Modifying slice in a `range`:** the loop variable is a **copy**; writing to it does nothing to the backing array.
- **Map iteration order is randomized** by design (each run differs). Relying on order → bug.
- **Reading a missing map key** returns the zero value, not an error: `m["x"]` on an `int` map → `0`. Use the comma-ok form `v, ok := m["x"]`.
- **Concurrent map access** = `fatal error`, **uncatchable** by `recover()`. Distinguish "fatal error" from "panic."
- **Why can't you `&m[k]`?** Because the map may relocate entries on growth, invalidating the pointer.

---

## 3. Production Scenario

**The log-ingestion memory leak.** A high-throughput log pipeline reads 4KB records into a large `[]byte` buffer, then extracts a small token (say a 16-byte request ID) by slicing: `id := buf[off:off+16]`. These IDs are stored in a long-lived in-memory index for dedup.

Each retained 16-byte slice **pins the full 4KB backing array** (slice header points into it; GC can't free the array while any sub-slice references it). At 50k records/sec, instead of `16B × N` you hold `4KB × N` — a **256× blowup**. The service OOM-crashes after hours, looking like a slow leak no profiler line explains until you realize the backing arrays are alive.

Second failure in the same pipeline: a metrics aggregator uses a shared `map[string]int64` updated from multiple goroutines without a lock → intermittent `fatal error: concurrent map read and map write` that takes the whole process down, no recovery.

---

## 4. Hands-On Coding Challenge (No Solutions)

**Problem: `CompactIndex`** — a memory-safe ID extractor + concurrent counter.

Build a package that ingests records and maintains a deduplicated, count-keyed index **without pinning oversized backing arrays** and **safe under concurrent goroutines**.

**Input:**
- Records arrive as `[]byte` chunks (4KB each) via repeated calls to `Ingest(chunk []byte, offset, length int)`.
- The ID is `chunk[offset : offset+length]` (length ≤ 64).
- `Ingest` is called concurrently from N goroutines.

**Output / API:**
```go
package compactindex

type CompactIndex struct {
    // TODO: your fields
}

func New() *CompactIndex {
    // TODO
    return nil
}

// Ingest records one ID extracted from chunk. Safe for concurrent use.
func (c *CompactIndex) Ingest(chunk []byte, offset, length int) {
    // TODO
}

// Count returns how many times the given ID was seen.
func (c *CompactIndex) Count(id string) int64 {
    // TODO
    return 0
}

// Distinct returns number of unique IDs.
func (c *CompactIndex) Distinct() int {
    // TODO
    return 0
}
```

**Constraints:**
- A retained ID must **not** keep the 4KB `chunk` alive after `Ingest` returns. (Prove it.)
- Must be **safe for concurrent execution** — zero data races under `-race`.
- Stored per-ID overhead must be **O(length)**, not O(4KB).
- No use of `unsafe`. No third-party deps.
- `Count`/`Distinct` must be safe to call concurrently with `Ingest`.

**Edge cases to handle:** `length == 0`; `offset+length > len(chunk)` (decide: panic or ignore — document it); the same ID arriving from two goroutines simultaneously.

---

## 5. System Diagnostics & Testing Task

1. **Prove no array pinning (escape analysis):**
   ```bash
   go build -gcflags="-m" ./compactindex 2>&1 | grep -i escape
   ```
   Identify which allocations escape to the heap. Confirm the *ID copy* escapes (it must — it's stored) but the *chunk* does not get retained.

2. **Prove copy beats sub-slice (benchmark + memory):** Write two variants — one that stores `chunk[off:off+len]` directly (the buggy version) and one that copies. Add a test that ingests one 4KB chunk, drops the chunk reference, forces `runtime.GC()`, and reads `runtime.ReadMemStats`. Show `HeapAlloc` difference. Then:
   ```bash
   go test -bench=BenchmarkIngest -benchmem ./compactindex
   ```
   Compare `B/op` and `allocs/op` between variants.

3. **Prove concurrency safety:**
   ```bash
   go test -race -run TestConcurrentIngest ./compactindex
   ```
   Spawn 100 goroutines hammering `Ingest` + `Count`. Race detector must report **clean**. (Run the buggy unlocked map version first to *see* the fatal error, then fix.)

4. **Map sizing experiment:** Benchmark `make(map[string]int64)` vs `make(map[string]int64, expectedN)`. Quantify the allocation/rehash savings with `-benchmem`.

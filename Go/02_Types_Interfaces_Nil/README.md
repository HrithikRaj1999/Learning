# Module 2: The Go Type System and the "Nil" Interface Trap

> **Goal:** Master implicit interfaces, struct embedding, the two-word interface layout, and the single most common Go gotcha — a non-nil interface holding a nil pointer.

---

## 1. Core Concept & The Py-Go Bridge

### Composition Over Inheritance

Go has **no classes, no inheritance**. You build behavior by **embedding** structs and satisfying interfaces. An embedded type's fields and methods are *promoted* to the outer struct:

```go
type Logger struct{ prefix string }
func (l Logger) Log(msg string) { /* ... */ }

type Server struct {
    Logger      // embedded — Server now "has" Log(), promoted
    port int
}
// s.Log("hi") works directly. This is composition, not inheritance.
```

### Implicit Interface Implementation (Structural Typing)

A type satisfies an interface simply by having the right methods — **no `implements` keyword**. If it has the methods, it fits.

```go
type Stringer interface { String() string }
// Any type with String() string automatically satisfies Stringer.
```

### The Interface Internal Layout — Two Words

A non-empty interface value is **two pointers (16 bytes)**:

```
iface = { tab *itab, data unsafe.Pointer }
        └─ type+method table   └─ pointer to the concrete value
```

- `tab` (itab) encodes the **concrete type** + the **method set** (function pointers).
- `data` points at the concrete value (or holds it if word-sized).

An interface is `nil` **only when both words are nil**. This is the root of the famous trap.

### The Nil Interface Trap

```go
type MyError struct{}
func (e *MyError) Error() string { return "boom" }

func doThing() error {
    var p *MyError = nil   // a typed nil pointer
    return p               // assigned into the error interface
}

func main() {
    err := doThing()
    if err != nil {        // TRUE! — surprise
        // runs, because the interface has tab=*MyError, data=nil
    }
}
```

`err != nil` is **true** even though the underlying pointer is nil — because the interface's *type word* is set (`*MyError`). The interface is non-nil; the value inside is nil. Calling `err.Error()` may then nil-deref-panic.

### The Py-Go Bridge

| Concept | Python / JS | Go |
|---------|-------------|-----|
| Polymorphism | Duck typing at runtime; ABCs (`abc.ABC`) for explicit contracts | Implicit interfaces, checked at **compile time** |
| Inheritance | `class B(A)` MRO chains | **No inheritance** — embedding promotes methods |
| Interface check | `isinstance`, `hasattr`, EAFP try/except | type satisfied structurally; `x, ok := v.(T)` type assertion |
| "Is it null?" | `x is None` — one truth | interface nil = **both** type AND value nil; typed-nil ≠ nil |
| Memory | object = heap ref + type ptr | interface = 2 words (itab + data); data may escape to heap |
| Method dispatch | dict lookup on instance/class | itab vtable lookup (one indirection) |

**Key mental shift:** Python's `is None` is unambiguous. Go's interface nil-ness depends on a hidden *type word*. A function returning `error` can hand you something that prints as nil-ish but fails `== nil`.

---

## 2. Interview Hotspots & Traps

- **The typed-nil trap (the headline):** `var err error = (*MyError)(nil); err != nil` → **true**. Be able to draw the two-word box and explain why. The fix: return the interface type directly, or `if p == nil { return nil }`.
- **Pointer vs value receivers in method sets:** if `Error()` has a `*MyError` receiver, only `*MyError` satisfies the interface, not `MyError`. Interviewers ask which compiles.
- **Empty interface `interface{}` / `any`:** holds anything; still two words. `nil any` vs `any` wrapping a typed nil — same trap.
- **Type assertion vs type switch:** `v, ok := x.(int)` (safe) vs `v := x.(int)` (panics if wrong). Know both.
- **Comparing interfaces:** `==` compares type AND value; comparing interfaces holding **uncomparable** types (slices, maps, funcs) → runtime panic.
- **Embedding ambiguity:** embed two types with the same method name → compile error unless you disambiguate.
- **Interface satisfaction is a method-set question:** does `*T` or `T` have the method? Value embedding vs pointer embedding changes the answer.
- **`nil` map/slice/channel** are usable in some ops (range, len, read from nil chan blocks forever) — distinguish from nil interface.
- **Storing a value in an interface always allocates** if it doesn't fit in a word → escape to heap (perf trap in hot loops).

---

## 3. Production Scenario

**The error-handling outage.** A payment microservice has a helper:

```go
func validate(req *Req) *ValidationError { ... return nil if ok }
```

A refactor changes the caller to:

```go
func process(req *Req) error {
    return validate(req)   // *ValidationError assigned into error
}
```

Now `validate` returning `nil` produces an `error` interface that is **non-nil** (type word = `*ValidationError`, data = nil). Every healthy request now takes the error branch:

```go
if err := process(req); err != nil {
    return fmt.Errorf("validation failed: %w", err) // err.Error() nil-derefs → panic
}
```

Result: 100% of *valid* payments rejected, and each one panics on `err.Error()` (nil receiver deref), crashing handler goroutines. A textbook typed-nil incident — passes unit tests that check the concrete return, fails in the interface boundary.

---

## 4. Hands-On Coding Challenge (No Solutions)

**Problem: `PluginRegistry`** — a polymorphic processor pipeline with airtight nil semantics.

Design a registry that runs a chain of "processors" over a payload. Each processor is matched structurally (implicit interface), embedding is used to share base behavior, and the API must **never** leak the typed-nil trap to callers.

**Input / API:**
```go
package registry

type Processor interface {
    Process(data []byte) ([]byte, error)
    Name() string
}

// BaseProcessor provides Name() via embedding; concrete processors embed it.
type BaseProcessor struct {
    // TODO
}

type Registry struct {
    // TODO
}

func New() *Registry { return nil /* TODO */ }

// Register adds a processor. Reject a nil processor cleanly.
func (r *Registry) Register(p Processor) error { return nil /* TODO */ }

// Run pipes data through all registered processors in order.
// MUST return a clean nil error on success (no typed-nil leak).
func (r *Registry) Run(data []byte) ([]byte, error) { return nil, nil /* TODO */ }
```

**Constraints:**
- At least one concrete processor must **embed** `BaseProcessor` and rely on a *promoted* `Name()`.
- `Register` must detect a nil `Processor` interface **and** a non-nil interface wrapping a nil pointer — both rejected with a clear error.
- `Run` must guarantee: on full success, the returned `error` is *truly* `nil` (`== nil` true). Write a test that asserts this against `reflect` or direct comparison.
- A processor whose `Process` returns `(nil, nil)` must be treated as "no change," not as failure.
- No `panic` may escape `Run`; recover and convert to error if a processor panics.

**Edge cases:** processor returns typed-nil error; two embedded types with clashing method names; registering the same processor twice.

---

## 5. System Diagnostics & Testing Task

1. **Prove the typed-nil trap in code:** Write a test `TestTypedNilIsNotNil` that constructs `var e error = (*MyError)(nil)` and asserts `e != nil`. Then assert your `Run` does **not** exhibit this — its success path returns a value that `== nil`.

2. **Inspect interface internals:** Use `reflect.ValueOf(err).IsNil()` vs `err == nil` in a test and show they disagree for typed-nil. Document the two-word layout in a comment.

3. **Method-set verification (compile-time):** Add a static assertion line `var _ Processor = (*MyConcrete)(nil)` for each concrete type. Show that switching a receiver from `*T` to `T` (or vice versa) breaks compilation — capture the exact compiler error.

4. **Allocation check on interface boxing:**
   ```bash
   go build -gcflags="-m" ./registry 2>&1 | grep -i "escapes to heap"
   go test -bench=BenchmarkRun -benchmem ./registry
   ```
   Identify where storing concrete values into the `Processor` interface forces heap escape. Report `allocs/op`.

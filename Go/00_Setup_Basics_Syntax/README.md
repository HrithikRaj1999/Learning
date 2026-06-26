# Module 0: Setup, Basics, and Syntax — Start Here

> **For total Go beginners coming from Python/JS.** This module gets you from zero to "I can read and write basic Go" before the deep runtime modules. Take it slow; everything later builds on this.

---

## 1. Core Concept & The Py-Go Bridge

### Install & First Program

```bash
# Install Go 1.21+ from https://go.dev/dl  (or: brew install go / apt install golang)
go version          # confirm it works

mkdir hello && cd hello
go mod init hello   # creates go.mod — your project/module file
```

Create `main.go`:

```go
package main          // every runnable program lives in package main

import "fmt"          // fmt = formatting/printing, like Python's print/format

func main() {         // main() is the entry point, like Python's if __name__=="__main__"
    fmt.Println("Hello, Go")
}
```

Run it:

```bash
go run main.go      # compile + run in one step (like python main.py)
go build            # produce a standalone binary ./hello
./hello             # run the compiled binary — no interpreter needed
```

**Big difference from Python/JS:** Go is **compiled** and **statically typed**. Code becomes a single native binary. Errors that Python finds at runtime, Go catches at **compile time**.

### Variables & Types

Go is statically typed — each variable has **one fixed type** known at compile time.

```go
var name string = "Ada"   // explicit type
var age = 30              // type inferred (int)
count := 0               // short form, only inside functions. := means "declare + infer"
const Pi = 3.14159       // constant, cannot change

var notSet int           // ZERO VALUE: int->0, string->"", bool->false, pointer->nil
```

**No `None`/`undefined`.** Uninitialized variables get a **zero value**, never null surprises (except pointers/slices/maps which zero to `nil`).

**Core types:**

| Category | Types | Notes |
|----------|-------|-------|
| Integers | `int`, `int8/16/32/64`, `uint`, `byte`(=uint8), `rune`(=int32) | `int` is 64-bit on modern machines |
| Floats | `float32`, `float64` | default float is `float64` |
| Text | `string` (immutable bytes), `rune` (a Unicode code point) | `string` can't be mutated in place |
| Boolean | `bool` | only `true`/`false`, no truthy/falsy |
| Composite | `array`, `slice`, `map`, `struct` | covered in Module 1 |

**Type conversions are explicit** — no automatic coercion:

```go
i := 42
f := float64(i)      // must convert; float64(i), not just f = i
s := strconv.Itoa(i) // int -> string needs strconv, not str(i)
```

### Control Flow

```go
// if — no parentheses, braces required. Can declare a var in the condition.
if x := compute(); x > 10 {
    fmt.Println("big")
} else {
    fmt.Println("small")
}

// for — the ONLY loop keyword. No while, no do-while.
for i := 0; i < 5; i++ { }       // classic
for condition { }                 // while-style
for { break }                     // infinite loop
for i, v := range mySlice { }     // range = like Python's enumerate
for k, v := range myMap { }       // iterate map (order is RANDOM)

// switch — no fallthrough by default (opposite of C/JS), no break needed
switch day {
case "sat", "sun":
    fmt.Println("weekend")
default:
    fmt.Println("weekday")
}
```

### Functions

```go
func add(a int, b int) int {        // params typed; return type after params
    return a + b
}

func divmod(a, b int) (int, int) {  // MULTIPLE return values — very common in Go
    return a / b, a % b
}

q, r := divmod(17, 5)

// Named returns + the Go error idiom (no exceptions for normal errors):
func parse(s string) (n int, err error) {
    n, err = strconv.Atoi(s)
    return                          // returns named n, err
}
```

**Go has NO exceptions for ordinary errors.** Functions return an `error` value as the last result. You check it:

```go
n, err := strconv.Atoi("abc")
if err != nil {
    // handle it — this if-err pattern is EVERYWHERE in Go
    return err
}
```

### Structs (Go's "objects")

No classes. A `struct` groups fields; methods attach to types:

```go
type User struct {
    Name string
    Age  int
}

func (u User) Greet() string {       // method: (u User) is the receiver
    return "Hi " + u.Name
}

u := User{Name: "Ada", Age: 30}
fmt.Println(u.Greet())
```

Uppercase first letter = **exported** (public, visible outside package). lowercase = unexported (private). That's Go's entire access-control system.

### The Py-Go Bridge

| Concept | Python / JS | Go |
|---------|-------------|-----|
| Typing | dynamic; type at runtime | **static**, type fixed at compile time |
| Run model | interpreted | **compiled** to a native binary |
| Variable decl | `x = 5` | `x := 5` or `var x = 5` |
| Uninitialized | `None` / `undefined` | **zero value** (`0`, `""`, `false`, `nil`) |
| Null | `None` / `null` | `nil` (only for pointers, slices, maps, channels, interfaces, funcs) |
| Loops | `for/while`, comprehensions | only `for` (4 forms), no comprehensions |
| Errors | `try/except`, exceptions | returned `error` values + `if err != nil` |
| Classes | `class`, inheritance | `struct` + methods, **no inheritance** |
| Public/private | convention `_name` / `export` | **Capitalized = public**, lowercase = private |
| Truthiness | many falsy values | only real `bool` in conditions |
| String | mutable-ish, unicode native | immutable bytes; iterate as `rune` for unicode |

**Key mental shift:** Python lets you run first and crash later. Go makes you declare types and handle errors up front, then rewards you with a fast, single-file binary and far fewer runtime surprises.

---

## 2. Interview Hotspots & Traps (Beginner Edition)

- **`:=` vs `var`:** `:=` only works **inside functions**; package-level vars need `var`. Redeclaring with `:=` in the same scope is an error (unless at least one var on the left is new).
- **Unused variables/imports are compile errors.** Go refuses to build with an unused import or local var. Surprises every newcomer.
- **Zero values, not null:** `var s string` is `""` not nil; `var n int` is `0`. But `var m map[string]int` is `nil` — reading is fine, **writing panics**.
- **`=` vs `:=`:** `=` assigns to existing var; `:=` declares a new one. Mixing them up shadows variables accidentally.
- **No implicit type conversion:** `int + float64` won't compile. Must convert explicitly.
- **`switch` doesn't fall through** by default (opposite of JS/C). You add `fallthrough` to get it.
- **Capitalization = visibility:** lowercase `name` field is invisible outside its package — including to JSON encoders. Common "why is my JSON empty?" bug.
- **Multiple assignment:** `a, b = b, a` swaps without a temp (like Python). But mismatched counts won't compile.
- **`nil` is typed in interfaces** — preview of the Module 2 trap. For now: `nil` isn't one universal thing.
- **`range` over a map gives random order** every run. Never rely on it.
- **Integer division truncates:** `7/2 == 3`, not `3.5`. Like Python's `//`.

---

## 3. Production Scenario

**The config parser that crashed prod.** A new engineer writes a service config loader in Go like they would in Python — assuming missing values are "falsy" and errors raise exceptions. Three real bugs:

1. They write to a `nil` map: `var cfg map[string]string; cfg["port"] = "8080"` → `panic: assignment to entry in nil map`. (Forgot `make`.)
2. They ignore returned errors: `port, _ := strconv.Atoi(raw)` — the `_` swallows a parse failure, so a typo'd port silently becomes `0`, the server binds port 0, and traffic vanishes.
3. A struct field is lowercase (`port int`), so `json.Unmarshal` can't populate it — config silently loads as all-zero. Service starts with empty config and serves errors.

None of these would crash a Python script the same way; in Go they're a panic, a silent zero, and an empty struct — all traceable to the basics in this module.

---

## 4. Beginner Drills — Build Your Go Muscles

Before tackling MiniConfig, work through these micro-exercises. Each drills one specific Go concept. Write them in a scratch `main.go` — you only need `go run main.go` to test each one.

### 4.1 Packages & Imports

**Drill 4.1.1 — Your first multi-package import**

```go
package main

import (
    "fmt"
    "strings"
    "strconv"
)

func main() {
    fmt.Println(strings.ToUpper("hello"))   // "HELLO"
    fmt.Println(strconv.Itoa(42))           // "42"
}
```

> Go's standard library is documented at [pkg.go.dev/std](https://pkg.go.dev/std). Every import gives you access to its exported (capitalized) names.

**Drill 4.1.2 — Create and import your own package**

Create a directory `calc/` next to `main.go` with `calc/calc.go`:

```go
package calc   // NOT "main" — this is a library package

func Double(n int) int {
    return n * 2
}
```

In `main.go`:

```go
package main

import (
    "fmt"
    "hello/calc"    // "hello" = your module name from go mod init
)

func main() {
    fmt.Println(calc.Double(21))  // 42
}
```

To run, your project layout must be:

```
hello/
├── go.mod          (module hello)
├── main.go
└── calc/
    └── calc.go
```

> **Key rules:** (1) The import path starts from your module name. (2) Only **capitalized** names (like `Double`) are exported — lowercase `double` would not compile from main. (3) A directory = a package; the package name is declared at the top of each file.

**Drill 4.1.3 — Import with an alias**

```go
import r "math/rand"

func main() {
    fmt.Println(r.Intn(100))  // random int 0–99
}
```

### 4.2 Variables, Zero Values & Printing

**Drill 4.2.1 — Print every zero value**

```go
var i int
var s string
var b bool
var f float64
fmt.Printf("int=%d  string=%q  bool=%t  float=%f\n", i, s, b, f)
// Output: int=0  string=""  bool=false  float=0.000000
```

> Go never gives you `null`/`None`/`undefined`. Every type has a well-defined zero value. Internalize these four.

**Drill 4.2.2 — Type conversions are always explicit**

```go
var i int = 10
var f float64 = float64(i)   // OK: explicit cast
// var f float64 = i         // COMPILE ERROR: cannot use i (type int) as float64
fmt.Println(f)
```

```go
s := strconv.Itoa(42)        // int → string (Itoa = "integer to ASCII")
n, _ := strconv.Atoi("42")   // string → int
```

> `strconv` (string conversion) is the package for all number↔string conversions. No `String(num)` or `int(str)` like in other languages.

**Drill 4.2.3 — `:=` vs `var` vs `=`**

```go
var x int = 5        // explicit type
var y = 10           // type inferred
z := 15              // short declaration (ONLY inside functions)
x = 20               // assignment (x already exists)

// var thing := 5    // COMPILE ERROR: := can't be used with var
// package-level: only var or const, never :=
```

### 4.3 For Loops — The Only Loop You Get

No `while`, no `do-while`, no list comprehensions. Just `for` in four flavors.

**Drill 4.3.1 — Classic three-part for**

Print numbers 1 through 10, each on its own line.

```go
for i := 1; i <= 10; i++ {
    fmt.Println(i)
}
```

**Drill 4.3.2 — While-style (condition only)**

Start with `n := 1`; repeatedly double it until `n > 1000`. Print each value.

```go
n := 1
for n <= 1000 {
    fmt.Println(n)
    n *= 2
}
// Prints: 1 2 4 8 16 32 64 128 256 512
```

**Drill 4.3.3 — Infinite loop + break**

Generate random numbers (`rand.Intn(100)`) forever. Break on the first number > 90. Print how many tries it took.

```go
import "math/rand"

func main() {
    count := 0
    for {
        count++
        n := rand.Intn(100)
        if n > 90 {
            fmt.Printf("Got %d after %d tries\n", n, count)
            break
        }
    }
}
```

**Drill 4.3.4 — Range over a slice (index + value)**

```go
fruits := []string{"apple", "banana", "cherry"}
for i, v := range fruits {
    fmt.Printf("%d: %s\n", i, v)
}
```

**Drill 4.3.5 — Range, discard index with `_`**

```go
for _, v := range fruits {
    fmt.Println(v)   // values only
}
```

> `_` is the blank identifier — "I know something is returned, I choose to discard it." The compiler is happy; the reader knows it was intentional.

**Drill 4.3.6 — Nested loop: multiplication table**

Print a 9×9 multiplication table.

```go
for i := 1; i <= 9; i++ {
    for j := 1; j <= 9; j++ {
        fmt.Printf("%dx%d=%-3d", i, j, i*j)
    }
    fmt.Println()
}
```

**Drill 4.3.7 — continue (skip iteration)**

Print odd numbers only (1, 3, 5, ...) by `continue`-ing on even ones.

```go
for i := 1; i <= 10; i++ {
    if i%2 == 0 {
        continue
    }
    fmt.Println(i)
}
```

### 4.4 Slices — Go's Dynamic Array

> Slices are **views into arrays**. They have length (`len`) and capacity (`cap`). `append` auto-grows them. Module 1 covers the internals — for now, treat them like Python lists.

**Drill 4.4.1 — Declare nil, append, len**

```go
var nums []int              // nil slice (zero value of a slice is nil)
nums = append(nums, 1)      // append works on nil slices — no panic
nums = append(nums, 2, 3, 4)
fmt.Println(nums, len(nums))  // [1 2 3 4] 4
```

**Drill 4.4.2 — make with initial capacity**

```go
nums := make([]int, 0, 10)  // len=0, cap=10 (10 slots pre-allocated)
for i := 0; i < 10; i++ {
    nums = append(nums, i)
}
fmt.Println(nums, len(nums), cap(nums))
```

**Drill 4.4.3 — Slice literal and sub-slicing**

```go
nums := []int{10, 20, 30, 40, 50}
fmt.Println(nums[1:3])  // [20 30] — indices 1,2 (up to but NOT including 3)
fmt.Println(nums[:2])   // [10 20] — from start
fmt.Println(nums[2:])   // [30 40 50] — to end
```

**Drill 4.4.4 — copy (independent copy)**

```go
src := []int{1, 2, 3}
dst := make([]int, len(src))   // must allocate destination first
copy(dst, src)
dst[0] = 999
fmt.Println(src, dst)  // [1 2 3] [999 2 3] — independent!
```

### 4.5 Maps — Key-Value Lookups

> Maps are Go's hash maps. Keys and values are typed: `map[string]int` maps strings to ints.

**Drill 4.5.1 — Create (make), write, read, len**

```go
scores := make(map[string]int)   // ALWAYS make before writing
scores["alice"] = 95
scores["bob"] = 82
fmt.Println(scores["alice"])     // 95
fmt.Println(len(scores))         // 2
```

> ⚠️ **PANIC TRAP:** `var m map[string]int; m["x"] = 1` → **panic: assignment to entry in nil map**. Always `make` your maps before writing. (Reading from a nil map is fine — returns the zero value.)

**Drill 4.5.2 — The comma-ok pattern (idiomatic Go)**

```go
score, ok := scores["carol"]
if ok {
    fmt.Println("carol scored", score)
} else {
    fmt.Println("carol not found")   // this runs
}
```

> Reading a missing key does NOT panic — it returns the zero value (`0` for int). That's why `ok` is necessary to distinguish "not present" from "present but zero" or "present but empty string".

**Drill 4.5.3 — Delete a key**

```go
delete(scores, "bob")
_, ok := scores["bob"]
fmt.Println("bob still exists?", ok)  // false
```

> `delete` on a nil map or a missing key does NOT panic — it silently does nothing.

**Drill 4.5.4 — Range over a map**

```go
for name, score := range scores {
    fmt.Printf("%s: %d\n", name, score)
}
```

> **Iteration order is random** — run it twice and the output order will differ. This is by design to prevent you from depending on order.

**Drill 4.5.5 — Map as a set (Go has no Set type)**

```go
seen := make(map[string]bool)
words := []string{"go", "python", "go", "rust", "python", "go"}
for _, w := range words {
    if !seen[w] {
        fmt.Println("first time seeing:", w)
        seen[w] = true
    }
}
```

> Use `map[T]bool` for sets. For a memory-efficient set, use `map[T]struct{}` (a `struct{}` takes zero bytes) and check with `_, ok := mymap[key]`.

### 4.6 Error Handling — Go's Biggest Mindset Shift

> Go has no try/catch, no exceptions for normal errors. Functions return `(value, error)` and you check `err != nil` **every single time**.

**Drill 4.6.1 — Check an error properly**

```go
n, err := strconv.Atoi("42")   // valid input
if err != nil {
    fmt.Println("parse error:", err)
    return
}
fmt.Println("parsed:", n)       // 42
```

Now change `"42"` to `"abc"` and watch the `err != nil` path fire. Then remove the `if err != nil { return }` and see what happens — `n` is `0` (the zero value), and execution continues with garbage data. **This is exactly how production bugs are born.**

**Drill 4.6.2 — Write a function that returns (value, error)**

```go
func safeDivide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero: %f / %f", a, b)
    }
    return a / b, nil
}

func main() {
    result, err := safeDivide(10, 0)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println("Result:", result)
}
```

**Drill 4.6.3 — Chain errors upward with wrapping**

Write `parseAndDivide(s1, s2 string)` that parses two strings to float64, then divides:

```go
func parseAndDivide(s1, s2 string) (float64, error) {
    a, err := strconv.ParseFloat(s1, 64)
    if err != nil {
        return 0, fmt.Errorf("bad first number %q: %w", s1, err)
    }
    b, err := strconv.ParseFloat(s2, 64)
    if err != nil {
        return 0, fmt.Errorf("bad second number %q: %w", s2, err)
    }
    return safeDivide(a, b)
}
```

> `%w` in `fmt.Errorf` **wraps** the original error — callers can later unwrap it with `errors.Is()` or `errors.As()`. Use `%v` if you just want the text, `%w` if you want the chain preserved.

### 4.7 Structs — Grouping Data

> No classes. A `struct` groups fields; methods attach to the type.

**Drill 4.7.1 — Declare, create, access fields**

```go
type Book struct {
    Title  string
    Author string
    Pages  int
}

b := Book{Title: "Dune", Author: "Herbert", Pages: 412}
fmt.Println(b.Title)

b2 := Book{"1984", "Orwell", 328}   // positional (fragile — prefer named fields)
```

**Drill 4.7.2 — Value receiver method**

```go
func (b Book) Description() string {
    return fmt.Sprintf("%q by %s (%d pages)", b.Title, b.Author, b.Pages)
}
fmt.Println(b.Description())   // "Dune" by Herbert (412 pages)
```

**Drill 4.7.3 — Pointer receiver (can mutate)**

```go
func (b *Book) Read() {
    b.Pages--   // modifies the original!
}
b.Read()
fmt.Println(b.Pages)  // 411
```

> Value receiver `(b Book)` gets a **copy** — the original is unchanged. Pointer receiver `(b *Book)` works on the original. Use a pointer when you need to mutate or the struct is large.

### 4.8 Strings — For Your Config Parser

**Drill 4.8.1 — strings.Split (the bread and butter of parsing)**

```go
parts := strings.Split("HOST=localhost", "=")
fmt.Println(parts[0], parts[1])  // HOST localhost

parts = strings.Split("BADLINE", "=")
fmt.Println(len(parts))           // 1 — only one part, no "=" found!
```

**Drill 4.8.2 — strings.TrimSpace (handle whitespace)**

```go
raw := "  PORT = 8080  "
parts := strings.Split(raw, "=")
key := strings.TrimSpace(parts[0])   // "PORT"
val := strings.TrimSpace(parts[1])   // "8080"
fmt.Printf("key=%q val=%q\n", key, val)
```

**Drill 4.8.3 — Parsing bools**

```go
b, err := strconv.ParseBool("true")    // true, nil
b, err = strconv.ParseBool("FALSE")    // false, nil
b, err = strconv.ParseBool("yes")      // "", error — ParseBool only accepts:
// 1, t, T, TRUE, true, True
// 0, f, F, FALSE, false, False
```

**Drill 4.8.4 — strings.HasPrefix and strings.Contains**

```go
fmt.Println(strings.HasPrefix("DEBUG=true", "DEBUG"))   // true
fmt.Println(strings.Contains("HOST=localhost", "="))     // true — useful for validating lines
```

---

Now you're ready for the **MiniConfig challenge** below. Everything you just practiced — maps, loops, error handling, string parsing, comma-ok — is exactly what you'll use.

---

## 5. Hands-On Coding Challenge (No Solutions)

**Problem: `MiniConfig`** — a tiny, typed, error-returning config parser.

Parse a list of `KEY=VALUE` strings into a typed config, with proper Go error handling and zero-value awareness.

**Input / API:**
```go
package miniconfig

type Config struct {
    Host    string
    Port    int
    Debug   bool
    // TODO: add fields you need (must be exported if you JSON them)
}

// Parse takes lines like ["HOST=localhost", "PORT=8080", "DEBUG=true"]
// and returns a populated Config or an error describing the FIRST bad line.
func Parse(lines []string) (Config, error) {
    return Config{}, nil // TODO
}

// Get returns the value for a key and whether it was present (comma-ok style).
func Get(lines []string, key string) (string, bool) {
    return "", false // TODO
}
```

**Constraints:**
- Use the `value, ok :=` map pattern somewhere (build a `map[string]string` from the lines).
- A malformed line (no `=`, empty key, unparseable int/bool) must return a **non-nil error** with a clear message — never silently default.
- Missing optional keys fall back to documented defaults (e.g. `Port=80`), but a missing **required** key is an error.
- Do **not** ignore any returned error with `_`.
- Initialize maps with `make` before writing — no nil-map panic.

**Edge cases:** duplicate keys (last wins? error? — decide + document); whitespace around `=`; `PORT=abc`; empty input slice; a line that's just `KEY=` (empty value).

---

## 6. System Diagnostics & Testing Task

1. **Write your first table-driven test** (the idiomatic Go test style):
   ```go
   func TestParse(t *testing.T) {
       cases := []struct {
           name    string
           lines   []string
           wantErr bool
       }{
           {"valid", []string{"HOST=x", "PORT=80"}, false},
           {"bad int", []string{"PORT=abc"}, true},
           // TODO: add missing-key, empty-value, duplicate cases
       }
       for _, tc := range cases {
           t.Run(tc.name, func(t *testing.T) {
               _, err := Parse(tc.lines)
               if (err != nil) != tc.wantErr {
                   t.Fatalf("got err=%v, wantErr=%v", err, tc.wantErr)
               }
           })
       }
   }
   ```
   ```bash
   go test ./miniconfig
   go test -v ./miniconfig        # see each subtest
   ```

2. **Coverage check** (the course targets 80%+):
   ```bash
   go test -cover ./miniconfig
   go test -coverprofile=cov.out ./miniconfig && go tool cover -html=cov.out
   ```

3. **Format + vet (run these on every file you write):**
   ```bash
   gofmt -l .          # lists unformatted files; gofmt -w . to fix
   go vet ./...        # catches suspicious code (unused results, bad printf, etc.)
   ```

4. **Prove the nil-map panic (learn by breaking):** Write a throwaway test that writes to a `nil` map and watch it `panic`. Then fix with `make`. Internalize the difference.

---

## Where to next

You can now read Go. Proceed to **[Module 1: Memory, Slices & Maps](../01_Memory_Slices_Maps/README.md)** — now you'll learn what slices and maps *actually are* under the hood.

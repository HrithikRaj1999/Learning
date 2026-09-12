# Cache System with Multiple Eviction Policies
### Machine Coding / LLD Round — Full Breakdown

---

## [0] Index

```
[1] The Case      -> why cache exists at all
[2] The Question  -> what they literally ask
[3] The Hidden Q  -> what they actually grade
[4] Expected      -> checklist you must hit
[5] Companies     -> where this is asked
[6] Traps         -> where people fail
[7] 45-min Plan   -> time budget
```

---

## [1] The Case (the story behind it)

Your app reads the same data again and again from DB or API.
DB call = slow (50-200ms). Memory read = fast (<1ms).

So you keep a small copy in memory = **cache**.

But memory is small. Cache cannot grow forever.
So when it is full, you must **throw one item out**. That is **eviction**.

**Which item to throw out?** That is the whole problem.

```
Request -> Cache?
            |
            +-- HIT  -> return fast
            |
            '-- MISS -> hit DB -> store in cache
                          |
                          '-- cache full? -> EVICT someone
                                              |
                                              '-- WHO? <- the real question
```

Three common answers:

| Policy | Throws out | Real use |
|---|---|---|
| **LRU** | Not used for longest time | Default everywhere (Redis, browser, CPU) |
| **LFU** | Used fewest times | CDN, hot-content caching |
| **FIFO** | Oldest inserted, ignores usage | Simple queues, log buffers |

---

## [2] The Question (what the doc asks)

Build a cache class with:

```
put(key, value)   -> insert or update
get(key)          -> value, or -1 if missing
capacity          -> max items
```

Plus:

1. Support **LRU, LFU, FIFO**
2. **Switch policy at runtime** (not only at construction)
3. **O(1)** for both get and put
4. **Easily add new policies later** — this line is the whole exam
5. Unit tests proving it works

Optional bonus: TTL, disk persistence, thread safety, write-through/write-back, dynamic resize.

---

## [3] The Hidden Question (what they grade)

They already know you can write a HashMap. That is not the test.

The line **"easily extendable to support additional eviction policies"** is the interviewer telling you:

> *Show me you know **Strategy pattern**, **OCP**, and **DIP**.*

```
"support LRU, LFU, FIFO"       -> Strategy pattern
"switch policies dynamically"  -> composition, NOT inheritance
"easily extendable"            -> Open/Closed Principle
"O(1)"                         -> HashMap + Doubly Linked List
"unit tests"                   -> you can test in isolation = loose coupling
```

### ❌ Bad — what they are hunting for

```ts
class Cache {
  constructor(cap: number, private policy: "LRU" | "LFU" | "FIFO") {}

  private evict() {
    if (this.policy === "LRU")       { /* ... */ }
    else if (this.policy === "LFU")  { /* ... */ }
    else if (this.policy === "FIFO") { /* ... */ }
  }
}
```

Why it fails:
- New policy → you **edit** `Cache`. OCP broken.
- `Cache` holds usage list + freq map + queue together. SRP broken.
- Depends on a string, not an interface. DIP broken.
- Cannot test LRU alone.

### ✅ Good — what they want to see

```ts
interface IEvictionPolicy {
  onGet(key: string): void;
  onPut(key: string): void;
  onRemove(key: string): void;
  evictKey(): string | null;
}

class Cache {
  constructor(
    private capacity: number,
    private policy: IEvictionPolicy   // has-a, injected
  ) {}

  setPolicy(next: IEvictionPolicy) { /* rebuild + swap */ }
}
```

**Golden rule:** the word `LRU` must never appear inside `Cache`.

---

## [4] What is Expected (scoring checklist)

```
[4.1] Design            weight: HIGH
      [ ] IEvictionPolicy interface exists
      [ ] Cache depends on interface only
      [ ] one class per policy, one file each
      [ ] Factory to build policy from config string
      [ ] setPolicy() works at runtime

[4.2] Correctness       weight: HIGH
      [ ] code COMPILES and RUNS  <- non-negotiable
      [ ] get miss returns -1
      [ ] get promotes key in LRU
      [ ] FIFO ignores get
      [ ] update of existing key does not evict

[4.3] Complexity        weight: MEDIUM
      [ ] LRU  = HashMap + Doubly Linked List
      [ ] FIFO = HashMap + Queue
      [ ] LFU  = HashMap + freq->DLL map + minFreq pointer
      [ ] no array.indexOf / splice  (that is O(n))

[4.4] Tests             weight: MEDIUM
      [ ] 6-8 asserts, runnable
      [ ] one test per policy + one for switching

[4.5] Communication     weight: HIGH (people forget this)
      [ ] ask clarifying questions first
      [ ] say your design out loud while typing
      [ ] describe skipped features instead of coding them

[4.6] Bonus             weight: LOW — only if time left
      [ ] TTL, persistence, locks, resize
```

### Things you should *describe*, not code

| Feature | One-line answer that earns the marks |
|---|---|
| LFU | "freq→DLL map plus a minFreq pointer, keeps O(1)" |
| TTL | "`expiresAt` on entry, lazy expire on get, background sweeper for eager" |
| Persistence | "`IStorage` interface, `FileStorage` impl, write-through inside put" |
| Thread safety | "Node is single-threaded; across workers I'd use a mutex. Note `get` is a **write** in LRU because it reorders — so read locks are wrong" |
| Resize | "shrink loop calls `evictKey()` until size fits capacity" |

---

## [5] Where This Is Asked

This is not a niche question. It is one of the most repeated LLD problems in the world.

### Confirmed companies

<cite index="9-1">Amazon, Microsoft, Google, Atlassian, Uber, Flipkart, and Swiggy use this in machine-coding / LLD rounds, and it is described as the single most common cache design question — it also appears as LeetCode 146.</cite>

<cite index="1-1">It is among the most frequently asked data structure problems at Google, Meta, Amazon, and Microsoft, where both get and put must run in O(1).</cite>

The broader machine-coding round itself is standard at: <cite index="12-1">Flipkart, Uber, Swiggy, Cred, Razorpay, PhonePe, and dozens of other top Indian and global tech companies.</cite> <cite index="17-1">LLD, machine coding, and concurrency rounds are now mandatory at Amazon, Google, Microsoft, Uber, Swiggy, Zomato, Razorpay, Atlassian, PhonePe, Paytm, and most top-tier startups.</cite>

```
FAANG / MAANG:  Google, Meta, Amazon, Microsoft, Apple
Global product: Atlassian, Uber, Adobe, Oracle
India product:  Flipkart, Swiggy, Zomato, Razorpay, PhonePe,
                Paytm, Cred, Ola, Udaan, Gojek
```

Rough count: **20+ named companies**, and realistically almost every product company that runs an LLD or machine-coding round.

### How expectation changes by company

| Company | Their angle |
|---|---|
| Amazon SDE2 | <cite index="1-1">Expects you to propose an extension right after the basic solution works — for example, explaining how you'd make the cache thread-safe.</cite> |
| Microsoft | <cite index="1-1">Follows up on thread safety; the phone screen often checks whether you can name the right data structure combination verbally before writing code.</cite> |
| Apple | <cite index="1-1">Watches method naming, class design, and whether you use private helpers to avoid duplication.</cite> |
| Google | <cite index="4-1">Has asked candidates to write the interfaces first, then the implementation.</cite> |
| Flipkart / Swiggy / Uber | <cite index="15-1">Expect proper object-oriented code — everything in one file with no classes is not acceptable; separate classes with separation of concerns, each in its own file.</cite> |

---

## [6] Traps (where candidates lose)

```
[6.1] Coding before asking       -> lost design marks in first 3 min
[6.2] if/else on policy string   -> instant design fail
[6.3] Subclassing (LRUCache extends Cache)
      -> cannot setPolicy() at runtime. Requirement 3 dead.
[6.4] Array + indexOf for order  -> O(n), fails requirement 4
[6.5] Trying to finish LFU + TTL + persistence
      -> nothing runs at the end. Worst outcome.
[6.6] get() not promoting the key in LRU -> classic bug
[6.7] Silent coding              -> interviewer cannot grade your thinking
[6.8] No tests                   -> requirement 5 openly ignored
```

<cite index="12-1">Machine coding needs **working** code, not just design — if it does not compile and run, you fail regardless of how good the class diagram looks.</cite>

---

## [7] 45-Minute Plan

```
00-03  TALK. Clarify. Draw boxes. Say "Strategy pattern".
03-08  Skeleton: IEvictionPolicy + empty Cache. Compiles.
08-15  FIFOPolicy — fully working. Proves the plug works.
15-30  LRUPolicy — fully working, O(1), with inline DLL.
30-37  Tests. 6-8 asserts.
37-42  PolicyFactory + setPolicy(). Proves extensibility.
42-45  TALK. Describe LFU, TTL, locks, persistence.
```

**Priority if time runs short:** working LRU + clean interface + tests
**beats** three half-broken policies.

---

## [8] Closing Lines for the Interviewer

> "I put eviction behind an `IEvictionPolicy` interface, so `Cache` is closed for modification but open for new policies. Adding Random or TTL-based eviction is one new file with zero changes to `Cache`."

> "I chose composition over inheritance because `setPolicy()` at runtime is impossible with subclassed caches — behaviour would be locked at construction."

> "LRU is HashMap plus doubly linked list. The map gives O(1) lookup, the list gives O(1) recency reorder. Note `get` mutates the list, so it is a write, not a read — that matters for locking."

> "I prioritised a correct O(1) LRU with tests over half-finishing three policies. LFU is a freq→DLL map with a minFreq pointer and drops into the same interface."
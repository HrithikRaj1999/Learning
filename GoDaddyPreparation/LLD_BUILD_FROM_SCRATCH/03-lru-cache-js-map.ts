/*
Q3.3  LRU Cache in JS (Map Built-in Insertion Order)

============================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
============================================================
- DATA STRUCTURE:
    JavaScript `Map`.
- WHY WE NEED IT:
    LRU needs O(1) key lookup AND ordering from oldest
    (Least Recently Used) to newest.
    In JS, `Map` naturally preserves insertion order!
    First key in `map.keys()` is always the oldest.

============================================================
2. INTUITION (What I am thinking to tell interviewer)
============================================================
- "JS Map maintains insertion order by spec."
- "To mark key as recent: `delete(key)` then `set(key, val)`.
   This moves key to the back (newest end)."
- "When size exceeds capacity, the first key returned by
   `map.keys().next().value` is the oldest."
- "Evicting oldest is `map.delete(map.keys().next().value)`."

============================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
============================================================
- constructor(capacity): Validate > 0. `entries = new Map()`.
- get(key):
    1. If `!entries.has(key)`, return `undefined`.
    2. Read value.
    3. `entries.delete(key)` & `entries.set(key, value)`.
    4. Return value.
- put(key, value):
    1. `entries.delete(key)` (no-op if absent; moves key to
       back if present).
    2. `entries.set(key, value)`.
    3. If `entries.size > capacity`, delete oldest key:
       `entries.delete(entries.keys().next().value!)`.

SHORT SYNTAX TRICKS:
  entries.keys().next().value! // Oldest key in O(1) step
  delete + set                 // Re-order key to newest end

============================================================
4. TIME & SPACE COMPLEXITY
============================================================
- TIME COMPLEXITY:
    - get(key)        : O(1)
    - put(key, value) : O(1)
- SPACE COMPLEXITY:
    - O(Capacity) items stored.

============================================================
5. VISUAL DIAGRAM
============================================================
Capacity = 2. Map stores items [Oldest ... Newest]:

  put("a", 1)   -> Map: { "a": 1 }
  put("b", 2)   -> Map: { "a": 1, "b": 2 }
  get("a")      -> Read 1, delete "a", re-set "a":
                   Map: { "b": 2, "a": 1 }  <-- "a" newest!

  put("c", 3)   -> Map: { "b": 2, "a": 1, "c": 3 } (Size > 2)
                   Evict oldest ("b"):
                   Map: { "a": 1, "c": 3 }

============================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
============================================================
- RE-INSERT EXISTING KEYS ON PUT: Plain `map.set()` on an
  existing key keeps its OLD position! Delete first!
- EVICT AFTER INSERTING: Check `size > capacity` (NOT `>=`).
- V8 INTERNAL IMPLEMENTATION: V8 implements Map insertion
  order using a Doubly Linked List internally. So this IS
  HashMap + Doubly Linked List under the hood!
*/

export class LRUCache<K, V> {
  // a Map keeps insertion order, so keys() gives oldest first
  private entries = new Map<K, V>();
  private capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("capacity must be > 0");
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.entries.has(key)) return undefined;
    const value = this.entries.get(key)!;
    // delete + set moves it to the newest end
    this.entries.delete(key);
    this.entries.set(key, value);
    return value;
  }

  put(key: K, value: V): void {
    // delete on a missing key does nothing, so this is the
    // has() check and the reorder in one line
    this.entries.delete(key);
    this.entries.set(key, value);
    // one insert can overflow by one, so one eviction is enough
    if (this.entries.size > this.capacity) {
      this.entries.delete(this.entries.keys().next().value!);
    }
  }

  size(): number { return this.entries.size; }
}

// quick check
const cache = new LRUCache<string, number>(2);
cache.put("a", 1);
cache.put("b", 2);
cache.get("a");    // "a" is newest now, so "b" goes next
cache.put("c", 3); // evicts "b"
console.log(cache.get("a")); // 1
console.log(cache.get("b")); // undefined
console.log(cache.get("c")); // 3


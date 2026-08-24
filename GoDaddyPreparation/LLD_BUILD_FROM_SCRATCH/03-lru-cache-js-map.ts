/*
Q3.3  LRU Cache in JavaScript (Map Built-in Insertion Order)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: JavaScript `Map`.
- WHY: LRU needs O(1) key lookup AND ordering from oldest (Least Recently Used) to newest.
  In JS, `Map` naturally preserves insertion order!
  The first key in `map.keys()` is always the oldest (least recently used).

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "JS Map maintains insertion order under the hood."
- "To mark a key as recently used: `delete(key)` then `set(key, value)`. This moves the key to the back (newest end)."
- "When cache size exceeds capacity, the first key returned by `map.keys().next().value` is the oldest."
- "Evicting the oldest key is as simple as deleting `map.keys().next().value`."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- constructor(capacity): Validate capacity > 0. Store `entries = new Map()`.
- get(key):
    1. If `!entries.has(key)`, return `undefined`.
    2. Read value.
    3. `entries.delete(key)` and `entries.set(key, value)` (re-insert at newest position).
    4. Return value.
- put(key, value):
    1. `entries.delete(key)` (no-op if key is absent; moves key to back if present).
    2. `entries.set(key, value)`.
    3. If `entries.size > capacity`, evict oldest: `entries.delete(entries.keys().next().value!)`.

SHORT SYNTAX TRICKS:
  entries.keys().next().value! // Gives the oldest key in O(1) iterator step
  delete + set                 // Re-orders key to newest position in 2 calls

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - get(key) : O(1)
    - put(key, value) : O(1)
- SPACE COMPLEXITY: O(Capacity) items stored.

================================================================
5. VISUAL DIAGRAM
================================================================
Capacity = 2. Map stores items [Oldest ... Newest]:

  put("a", 1)   -> Map: { "a": 1 }
  put("b", 2)   -> Map: { "a": 1, "b": 2 }
  get("a")      -> Read 1, delete "a", re-set "a":
                   Map: { "b": 2, "a": 1 }   <-- "a" is now newest, "b" is oldest!

  put("c", 3)   -> Map: { "b": 2, "a": 1, "c": 3 }  (Size 3 > 2)
                   Evict oldest key ("b"):
                   Map: { "a": 1, "c": 3 }

  get("b")      -> returns undefined (was evicted!)

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- PUT MUST RE-INSERT EXISTING KEYS TOO: Plain `map.set()` on an existing key keeps its OLD position! You must delete first!
- EVICT AFTER INSERTING: Always check `size > capacity` (NOT `>=`).
- UNDER THE HOOD IN V8: V8 engine implements Map order using a Doubly Linked List internally. So this IS the HashMap + DLL solution built into JS!
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

/*
================================================================
5. SAY OUT LOUD
================================================================
- "get and put are O(1). Memory is O(capacity)."
- "A Map keeps insertion order by spec, so delete plus set
   is my move-to-front."
- "Inside V8 that order is kept with a linked list. So this
   IS the list plus hashmap answer, I just did not write
   the list myself. In Java I would have to."
- "If you want, I can write the doubly linked list version."
- "Real caches also want a TTL per item, an onEvict hook to
   close resources, and LFU if hot keys matter more than
   recent keys."
*/

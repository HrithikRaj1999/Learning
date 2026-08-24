/*
Q3.3  LRU Cache in JavaScript (LC 146)

================================================================
1. INTUITION
================================================================
WHAT
  A cache that holds N items. When it is full, it throws out
  the item used longest ago.

WHY THIS DESIGN
  I need two things at the same time:
    find a key fast, and know which key is the oldest.
  A plain object gives me the first one only.
  A JS Map gives me both, because it keeps insertion order.

HOW IT WORKS
  1. The first key from map.keys() is the oldest one.
     That is my victim when the cache is full.
  2. To mark a key as just used: delete it, then set it
     again. Setting it again puts it at the newest end.
  3. Over capacity? Delete that first key.

COST
  get / put : O(1)        memory : O(capacity)

================================================================
2. VISUAL EXAMPLE
================================================================
capacity 2. The Map is drawn oldest -> newest.

  put("a",1)   a=1
  put("b",2)   a=1, b=2
  get("a")     hit. delete "a", then set "a" again:
               b=2, a=1     <- "a" is newest, "b" is oldest
  put("c",3)   b=2, a=1, c=3   size 3 > 2, so evict
               first key is "b", so delete "b"
               a=1, c=3
  get("b")     undefined, it was evicted

Take the delete + set out of get() and "a" stays at the
front. Then put("c") would evict "a" instead of "b".
That one line IS the LRU.

================================================================
3. SKELETON
================================================================
  get(key)     miss -> undefined
               hit  -> delete, set again, return value
  put(k, v)    delete, set, then evict oldest if too big
  size()

  SHORT SYNTAX
    map.delete(key)     a miss is a no-op, so put needs
                        no has() check
    map.keys().next().value   the oldest key. One iterator
                              step, not a scan.

================================================================
4. GOTCHAS
================================================================
- PUT MUST RE-INSERT AN EXISTING KEY TOO. A plain set() on
  a key already there keeps its OLD position, so it never
  counts as used.
- EVICT AFTER INSERTING, and test size > capacity, not >=.
  With >= the cache holds one item fewer than asked.
- ONE INSERT CAN ONLY OVERFLOW BY ONE, so one eviction is
  enough. No loop needed.
- Capacity 0 makes no sense. Check it in the constructor.
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

/*
Q3.2  HashMap from Scratch (Chaining & Custom Hash)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: Array of Bucket Chains (Array of Linked Lists).
- WHY: Reading an array slot by numeric index is true O(1).
  We convert key -> hash code -> array index.
  Because multiple keys can land on the same index (collision), each slot holds a Linked List chain.

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "To get O(1) Key-Value lookup, I convert the key to an integer using a hashing function (djb2)."
- "Index = hash(key) % bucketCount."
- "Collisions are handled by Separate Chaining (linked list per bucket slot)."
- "To keep chains short and avoid O(N) degradation, I track Load Factor = (count / buckets)."
- "When Load Factor > 0.75, I double the bucket array size and REHASH all keys."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- hash(key): djb2 algorithm (start 5381, `(h * 33) ^ charCode`). Returns positive int.
- indexOf(key): `hash(key) % buckets.length`.
- put(key, value):
    1. Walk bucket chain at `indexOf(key)`. If key already exists, overwrite value and return.
    2. If key is new, create entry `{ key, value, next: head }` and set as new head (O(1) insert).
    3. count++. If `count / capacity > 0.75`, call resize().
- get(key):
    1. Walk chain at `indexOf(key)`. If key matches, return `node.value`.
    2. If chain ends, return `undefined`.
- delete(key):
    1. Walk chain at `indexOf(key)` keeping a `previous` node reference.
    2. If found, unlink node (`prev.next = node.next` or `buckets[i] = node.next`). Return true.
- resize():
    1. Double array capacity: `newBuckets = new Array(old.length * 2)`.
    2. REHASH: Walk every existing node and recompute `indexOf(key)` using NEW capacity.

SHORT SYNTAX TRICKS:
  for (let node = buckets[i]; node; node = node.next) // Clean chain traversal
  buckets[i] = { key, value, next: buckets[i] }        // Prepend to head in 1 line

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - get(k) / put(k, v) / delete(k): Average O(1), Worst-Case O(N) [if all keys hash to 1 bucket].
    - resize(): O(N) rehash (amortized O(1) over all puts).
- SPACE COMPLEXITY: O(N) for stored entries + O(B) bucket slots.

================================================================
5. VISUAL DIAGRAM
================================================================
4 Buckets with Separate Chaining:
  "cat" -> bucket 2, "dog" -> bucket 0, "act" -> bucket 2 (collision!)

  [0] -> ("dog", 2) -> null
  [1] -> null
  [2] -> ("act", 3) -> ("cat", 1) -> null   <-- COLLISION (Chained)
  [3] -> null

  RESIZE (Load Factor > 0.75):
  4 buckets with 3 items = 0.75. Adding 4th item triggers double to 8 buckets.
  Keys rehash against new modulo 8: "cat" may move from index 2 to index 6!

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- PUT MUST OVERWRITE FIRST: Always walk chain to check if key exists before inserting, otherwise key duplicates exist!
- RESIZE REQUIRES REHASHING, NOT COPYING: Modulo changes when bucket length doubles (`hash % newLength`).
- UNLINKING HEAD IN DELETE: Special case where `previous` is null, update `buckets[i] = node.next`.
- JAVA 8 OPTIMIZATION: Java converts long chains (> 8 nodes) into Balanced Red-Black Trees (reduces worst-case from O(N) to O(log N)).
*/


const INITIAL_BUCKETS = 8;
const LOAD_FACTOR = 0.75;

// one node of a bucket chain
type Entry<K, V> = { key: K; value: V; next: Entry<K, V> | null };

export class MyHashMap<K extends string | number, V> {
  private buckets = newBuckets<K, V>(INITIAL_BUCKETS);
  private count = 0;

  // djb2: start odd, multiply by 33, mix in every character
  private hash(key: K): number {
    let h = 5381;
    for (const ch of String(key)) {
      // "| 0" keeps it a 32 bit int, never a float
      h = ((h * 33) ^ ch.charCodeAt(0)) | 0;
    }
    return Math.abs(h);
  }

  private indexOf(key: K): number {
    return this.hash(key) % this.buckets.length;
  }

  put(key: K, value: V): void {
    const i = this.indexOf(key);
    // walk first: a repeated key must overwrite, not repeat
    for (let node = this.buckets[i]; node; node = node.next) {
      if (node.key === key) {
        node.value = value;
        return;
      }
    }
    // a new key goes in at the head, which is O(1)
    this.buckets[i] = { key, value, next: this.buckets[i] };
    this.count++;
    if (this.count / this.buckets.length > LOAD_FACTOR) this.resize();
  }

  get(key: K): V | undefined {
    const i = this.indexOf(key);
    for (let node = this.buckets[i]; node; node = node.next) {
      if (node.key === key) return node.value;
    }
    return undefined;
  }

  delete(key: K): boolean {
    const i = this.indexOf(key);
    // drag the previous node along, unlinking needs it
    let previous: Entry<K, V> | null = null;
    let node = this.buckets[i];
    while (node) {
      if (node.key === key) {
        // head case: point the bucket at the next node
        if (previous) previous.next = node.next;
        else this.buckets[i] = node.next;
        this.count--;
        return true;
      }
      previous = node;
      node = node.next;
    }
    return false;
  }

  size(): number { return this.count; }

  private resize(): void {
    const old = this.buckets;
    // swap the bigger array in FIRST, so indexOf uses it
    this.buckets = newBuckets<K, V>(old.length * 2);
    for (const head of old) {
      let node = head;
      while (node) {
        // save it, I am about to relink this node
        const next = node.next;
        const i = this.indexOf(node.key);
        node.next = this.buckets[i];
        this.buckets[i] = node;
        node = next;
      }
    }
  }
}

function newBuckets<K, V>(size: number): (Entry<K, V> | null)[] {
  return new Array<Entry<K, V> | null>(size).fill(null);
}

// quick check
const map = new MyHashMap<string, number>();
map.put("apple", 1);
map.put("banana", 2);
map.put("apple", 99); // overwrite, not a duplicate
console.log(map.get("apple"));   // 99
console.log(map.get("nope"));    // undefined
console.log(map.delete("banana"), map.size()); // true 1

/*
================================================================
5. SAY OUT LOUD
================================================================
- "Average O(1) for get, put and delete. Worst case O(n)
   when every key collides. That is what a bad hash costs."
- "Load factor 0.75 is the trade. Lower means more memory
   but shorter chains. Higher means the opposite."
- "Resize is O(n) but only on a doubling, so put is
   amortised O(1)."
- "Java 8 turns a long chain into a tree past 8 nodes, so
   the worst case is O(log n), not O(n)."
- "Real maps use a power of two bucket count and hash & (n-1)
   instead of %, because AND is much cheaper than modulo."
- "equals and hashCode must agree. Equal keys must hash the
   same, or get misses a key that is really there."
- "Open addressing is the other option. Better cache use, no
   node objects, but deletes need tombstones."
*/

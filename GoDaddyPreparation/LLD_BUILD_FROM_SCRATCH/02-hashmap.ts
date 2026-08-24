/*
Q3.2  HashMap from Scratch (Chaining & Custom Hash)

============================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
============================================================
- DATA STRUCTURE:
    Array of Bucket Chains (Array of Linked Lists).
- WHY WE NEED IT:
    Reading an array slot by numeric index is true O(1).
    We convert key -> hash code -> array index.
    Multiple keys can land on same index (collision), so
    each bucket holds a Linked List chain.

============================================================
2. INTUITION (What I am thinking to tell interviewer)
============================================================
- "To get O(1) key-value lookup, I convert key to int via
   a hash function (djb2)."
- "Index = hash(key) % bucketCount."
- "Collisions handled by Separate Chaining (linked list)."
- "To keep chains short, track Load Factor = count / buckets."
- "When Load Factor > 0.75, double buckets & REHASH keys."

============================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
============================================================
- hash(key): djb2 algorithm (start 5381, `(h * 33) ^ char`).
- indexOf(key): `hash(key) % buckets.length`.
- put(key, value):
    1. Walk bucket chain at `indexOf(key)`. If key exists,
       overwrite value & return.
    2. If key is new, prepend entry `{ key, value, next }`
       at bucket head (O(1) insert).
    3. count++. If `count / capacity > 0.75`, call resize().
- get(key):
    1. Walk chain at `indexOf(key)`. If key matches, return
       `node.value`.
    2. If chain ends, return `undefined`.
- delete(key):
    1. Walk chain at `indexOf(key)` with `previous` pointer.
    2. If found, unlink node (`prev.next = node.next`).
- resize():
    1. Double array capacity: `newBuckets(old.length * 2)`.
    2. REHASH: Walk every existing node and recompute
       `indexOf(key)` using NEW capacity modulo.

SHORT SYNTAX TRICKS:
  for (let n = bucket; n; n = n.next) // Clean traversal
  buckets[i] = { key, val, next: buckets[i] } // Prepend head

============================================================
4. TIME & SPACE COMPLEXITY
============================================================
- TIME COMPLEXITY:
    - get / put / delete : Average O(1), Worst O(N)
    - resize()           : O(N) rehash (amortized O(1))
- SPACE COMPLEXITY:
    - O(N) stored entries + O(B) bucket array slots.

============================================================
5. VISUAL DIAGRAM
============================================================
4 Buckets with Separate Chaining:
  "cat" -> bucket 2, "dog" -> bucket 0, "act" -> bucket 2

  [0] -> ("dog", 2) -> null
  [1] -> null
  [2] -> ("act", 3) -> ("cat", 1) -> null   <-- COLLISION
  [3] -> null

  RESIZE (Load Factor > 0.75):
  4 buckets with 3 items = 0.75. 4th item doubles to 8.
  Keys rehash against new % 8: "cat" moves to index 6!

============================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
============================================================
- OVERWRITE EXISTING KEY FIRST: Always walk chain first in
  put() before inserting, or duplicate keys exist!
- RESIZE REQUIRES REHASHING: Modulo changes when length
  doubles (`hash % newLength`). Cannot just array copy!
- UNLINKING HEAD IN DELETE: Special case when `prev` is
  null: `buckets[i] = node.next`.
- JAVA 8 OPTIMIZATION: Converts long chains (> 8 nodes)
  into Red-Black Trees (reduces worst-case to O(log N)).
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


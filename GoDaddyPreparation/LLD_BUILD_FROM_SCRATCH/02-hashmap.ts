/*
Q3.2  HashMap from scratch (get, put, delete, own hash)

================================================================
1. INTUITION
================================================================
WHAT
  Put a key in, get a value back, in O(1).

WHY THIS DESIGN
  Only one thing is truly O(1): reading an array by index.
  So my whole job is turning a key into an index.

HOW IT WORKS
  1. hash(key) turns the key into a number.
  2. number % bucketCount turns it into an index.
  3. Two keys can give the same index. That is a collision.
     So each bucket holds a small chain of entries.
  4. To find a key I walk that chain and compare keys.

TWO THINGS KEEP IT O(1)
  a. The hash must spread keys evenly.
     A bad hash drops everything into one bucket. Then the
     map is just a linked list and every call is O(n).
  b. The table must not get full.
     Once entries / buckets goes past 0.75, I double the
     buckets and rehash everything.

COST
  get / put / delete : O(1) average, O(n) worst case
  resize             : O(n), but only on a doubling

================================================================
2. VISUAL EXAMPLE
================================================================
4 buckets. Say the hashes land like this:
  "cat" -> 2    "dog" -> 0    "act" -> 2

  [0] -> ("dog",2) -> null
  [1] -> null
  [2] -> ("act",3) -> ("cat",1) -> null   <- COLLISION
  [3] -> null        new entries go in at the head

  get("cat")  bucket 2. "act"? no. "cat"? yes -> 1
  get("cow")  bucket 2. "act"? no. "cat"? no  -> undefined

RESIZE
  At load factor 0.75, 4 buckets hold 3 entries.
  Add a 4th: 4 / 4 = 1.0 > 0.75. Double to 8 and rehash.
  "cat" may now sit in bucket 6, not 2. Any key can move.
  That is why I recompute the index instead of copying.

BAD HASH (this is the real test)
  If hash always returned 1, every key lands in one bucket:
  [1] -> k9 -> k8 -> k7 -> k6 -> k5 -> ... -> null
  The map is now a linked list. get() is O(n).

================================================================
3. SKELETON
================================================================
  hash(key)      key -> a number (djb2)
  indexOf(key)   hash % bucket count
  put(k, v)      walk chain. overwrite if found, else add
                 at the head
  get(k)         walk chain, return value or undefined
  delete(k)      walk chain with a previous pointer, unlink
  resize()       double the buckets, rehash every entry
  size()

  SHORT SYNTAX
    for (let node = bucket; node; node = node.next)
        walks a chain with no while loop (get and put)
    new Array(n).fill(null)    bucket array, no init loop
    { key, value, next: buckets[i] }
        shorthand fields, and inserts at the head

================================================================
4. GOTCHAS
================================================================
- PUT MUST WALK THE CHAIN FIRST. If you just insert, a
  repeated key is stored twice and get may return the old
  one. Overwrite, do not append.
- DELETE NEEDS THE PREVIOUS NODE. Deleting the head is the
  special case: point the bucket at node.next.
- RESIZE MUST REHASH, NOT COPY. The index is
  hash % bucketCount, and bucketCount just changed.
- SAVE node.next BEFORE RELINKING in resize, or you lose
  the rest of the chain.
- A BAD HASH IS NOT A SMALL PROBLEM. It turns O(1) into
  O(n) and nothing warns you.
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

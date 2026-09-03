/*
Design HashMap (LC 706)

Build a key-value map from scratch, no built-in hash table.
  put(key, value)  insert or overwrite
  get(key)         value, or -1 if absent
  remove(key)      delete the key if present
Keys and values are integers in [0, 10^6].

  put(1,1); put(2,2); get(1) -> 1;  get(3) -> -1
  put(2,1); get(2) -> 1     (overwrite, not a second entry)
  remove(2); get(2) -> -1
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- A hash map is three ideas stacked:
    1. a hash function turns a key into an array index
    2. an array of buckets holds the entries
    3. a collision strategy handles two keys landing in the same bucket
- The simplest correct collision strategy is CHAINING: each bucket holds a
  small list, and I scan that list. If the buckets are big enough, the
  lists stay short and every operation is O(1) on average.
- Bucket count should be a PRIME. A prime spreads keys with regular
  patterns (multiples of 10, of 100...) far more evenly than a power of two.

- The ladder:
    1. one giant array of size 10^6+1, index = key   O(1) but O(maxKey) space
    2. buckets + chaining                            O(1) average, O(n) space
    3. buckets + chaining + resize when the load     O(1) amortised, stays
       factor gets high                              fast as n grows

- Traps:
    - put on an existing key must OVERWRITE, not append a duplicate.
    - get must return -1 for a missing key, not undefined.
    - remove must handle "key not there" quietly.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
CHAINING view, BUCKET_COUNT = 5 (small so collisions show up)
hash(key) = key % 5

  put(1, 10)   hash = 1 % 5 = 1
  put(6, 60)   hash = 6 % 5 = 1     <- collides with key 1
  put(2, 20)   hash = 2 % 5 = 2

    bucket 0   []
    bucket 1   [ [1,10], [6,60] ]     two keys, one bucket, kept in a list
    bucket 2   [ [2,20] ]
    bucket 3   []
    bucket 4   []

  get(6)   hash = 6 % 5 = 1, scan bucket 1:
             entry [1,10]  key 1 != 6, keep looking
             entry [6,60]  key 6 == 6 -> return 60

  put(1, 99)  hash = 1, scan bucket 1, key 1 found at position 0
              OVERWRITE in place:
    bucket 1   [ [1,99], [6,60] ]      still 2 entries, not 3

  remove(1)   hash = 1, find position 0, splice it out
    bucket 1   [ [6,60] ]

  get(1)   hash = 1, scan bucket 1: only key 6 -> return -1

  INVARIANT: a key lives in exactly one bucket, bucket = hash(key), and at
  most once inside that bucket's list.

WHY A PRIME BUCKET COUNT, keys 10, 20, 30, 40 with BUCKET_COUNT = 10

    10 % 10 = 0,  20 % 10 = 0,  30 % 10 = 0,  40 % 10 = 0
    every key lands in bucket 0 -> the list is length 4, lookup is O(n)

  same keys with BUCKET_COUNT = 7

    10 % 7 = 3,  20 % 7 = 6,  30 % 7 = 2,  40 % 7 = 5
    four different buckets -> lookup stays O(1)
*/

// ============================================================
// 3) BRUTE FORCE - ONE SLOT PER POSSIBLE KEY
// ============================================================
/*
- Keys are capped at 10^6, so a direct-address array works.
    Time  : O(1) every operation   Space : O(maxKey) = ~1,000,001 slots
- Passes LeetCode, but it wastes megabytes for a handful of keys and dies
  the moment keys are strings or unbounded. Worth naming, then discarding.
*/
const MAX_KEY = 1000000;

class DirectAddressHashMap {
  constructor() {
    // -1 doubles as "empty", which is exactly what get must return
    this.slots = new Array(MAX_KEY + 1).fill(-1);
  }

  put(key, value) {
    this.slots[key] = value;
  }

  get(key) {
    return this.slots[key];
  }

  remove(key) {
    this.slots[key] = -1;
  }
}

// ============================================================
// 4) BETTER - BUCKETS WITH CHAINING (THE ONE TO WRITE)
// ============================================================
/*
- Fixed bucket array, each bucket a list of [key, value] pairs.
    Time  : O(1) average, O(n) worst if everything collides
    Space : O(n + BUCKET_COUNT)
- This is the version to write in an interview: short, and it shows I know
  hash function, buckets, and collision handling as three separate ideas.
*/
const BUCKET_COUNT = 769; // prime, spreads patterned keys evenly
const KEY_ABSENT = -1;

class MyHashMap {
  constructor() {
    this.buckets = new Array(BUCKET_COUNT);
    for (let i = 0; i < BUCKET_COUNT; i++) this.buckets[i] = [];
  }

  hash(key) {
    return key % BUCKET_COUNT;
  }

  put(key, value) {
    const bucket = this.buckets[this.hash(key)];

    for (let i = 0; i < bucket.length; i++) {
      // key already here - overwrite so no duplicate entry is created
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    bucket.push([key, value]);
  }

  get(key) {
    const bucket = this.buckets[this.hash(key)];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) return bucket[i][1];
    }

    // absent keys report -1, never undefined
    return KEY_ABSENT;
  }

  remove(key) {
    const bucket = this.buckets[this.hash(key)];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        // pull the entry out of the chain; missing keys are a silent no-op
        bucket.splice(i, 1);
        return;
      }
    }
  }
}

// ============================================================
// 5) OPTIMAL - CHAINING PLUS RESIZE ON HIGH LOAD FACTOR
// ============================================================
/*
- Fixed buckets degrade once n is much larger than BUCKET_COUNT: chains
  grow and lookups drift towards O(n). Doubling the bucket array when
  load factor = size / buckets exceeds 0.75 keeps chains short forever.
    Time  : O(1) amortised   Space : O(n)
- A resize rehashes everything, which is O(n), but it happens rarely enough
  that the cost spread over all inserts is constant.
*/
const INITIAL_BUCKETS = 16;
const MAX_LOAD_FACTOR = 0.75;
const GROWTH_FACTOR = 2;

class ResizingHashMap {
  constructor() {
    this.bucketCount = INITIAL_BUCKETS;
    this.size = 0;
    this.buckets = new Array(this.bucketCount);
    for (let i = 0; i < this.bucketCount; i++) this.buckets[i] = [];
  }

  hash(key, bucketCount) {
    return key % bucketCount;
  }

  put(key, value) {
    const bucket = this.buckets[this.hash(key, this.bucketCount)];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }

    bucket.push([key, value]);
    this.size++;

    // chains are getting long on average - spread everything out again
    if (this.size / this.bucketCount > MAX_LOAD_FACTOR) this.resize();
  }

  resize() {
    const newCount = this.bucketCount * GROWTH_FACTOR;
    const newBuckets = new Array(newCount);
    for (let i = 0; i < newCount; i++) newBuckets[i] = [];

    // every key must be rehashed - its bucket depends on the bucket count
    for (let i = 0; i < this.buckets.length; i++) {
      for (let j = 0; j < this.buckets[i].length; j++) {
        const entry = this.buckets[i][j];
        newBuckets[this.hash(entry[0], newCount)].push(entry);
      }
    }

    this.buckets = newBuckets;
    this.bucketCount = newCount;
  }

  get(key) {
    const bucket = this.buckets[this.hash(key, this.bucketCount)];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) return bucket[i][1];
    }

    return KEY_ABSENT;
  }

  remove(key) {
    const bucket = this.buckets[this.hash(key, this.bucketCount)];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket.splice(i, 1);
        this.size--;
        return;
      }
    }
  }
}

// ============================================================
// QUICK CHECK
// ============================================================
const map = new MyHashMap();
map.put(1, 1);
map.put(2, 2);
console.log(map.get(1)); // 1
console.log(map.get(3)); // -1   absent
map.put(2, 1); // overwrite
console.log(map.get(2)); // 1
map.remove(2);
console.log(map.get(2)); // -1   removed
map.remove(999); // no-op, must not throw
console.log(map.get(770)); // -1   770 % 769 = 1, collides with key 1

const direct = new DirectAddressHashMap();
direct.put(5, 50);
console.log(direct.get(5)); // 50
console.log(direct.get(6)); // -1

const growing = new ResizingHashMap();
for (let i = 0; i < 100; i++) growing.put(i, i * 10);
console.log(growing.get(37)); // 370
console.log(growing.bucketCount); // 256  resized 16 -> 32 -> 64 -> 128 -> 256
growing.remove(37);
console.log(growing.get(37)); // -1

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    direct address   O(1) every op, O(maxKey) space - unusable for big or
                     non-integer key spaces
    chaining         O(1) average, O(n) worst case, O(n + buckets) space
    chaining+resize  O(1) amortised, chains stay short as n grows
- THE THREE PARTS OF ANY HASH MAP:
    hash function, bucket array, collision strategy. Naming them separately
    is what the interviewer is listening for.
- WHY A PRIME BUCKET COUNT:
    keys are often multiples of 10 or 100. With 10 or 1024 buckets those
    all collapse into a few buckets; a prime like 769 scatters them.
- WHY RESIZE:
    the load factor n/buckets is the average chain length. Keeping it under
    0.75 keeps lookups constant. Resizing is O(n) but rare, so amortised
    O(1) per insert.
- THE ALTERNATIVE COLLISION STRATEGY:
    open addressing (linear probing) - no lists, better cache behaviour,
    but deletion needs tombstone markers. Chaining is simpler to get right.
- FOLLOW-UPS:
    Design HashSet (LC 705, same minus values),
    LRU Cache (LC 146, hash map + doubly linked list),
    Insert Delete GetRandom O(1) (LC 380).
*/

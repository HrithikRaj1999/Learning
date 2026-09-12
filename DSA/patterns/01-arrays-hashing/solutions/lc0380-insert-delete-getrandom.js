/*
Insert Delete GetRandom O(1) (LC 380)

Build a set where all three run in average O(1):
  insert(val)     add it, return false if it was already there
  remove(val)     delete it, return false if it was not there
  getRandom()     return any current member, each equally likely

  insert(1) -> true;  remove(2) -> false;  insert(2) -> true
  getRandom() -> 1 or 2, 50/50
  remove(1) -> true;  getRandom() -> always 2
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Two requirements pull in opposite directions:
    getRandom in O(1) needs an ARRAY - pick a random index.
    insert/remove in O(1) need a HASH MAP - find things instantly.
  So I keep both, and make them point at each other:
    values[]        the members, densely packed, no holes
    indexOf: Map    value -> its position inside values[]
- Insert is easy: push to the end, record the index.
- Remove is the clever part. Deleting from the middle of an array is O(n)
  because everything shifts. So instead I SWAP the doomed value with the
  LAST element, then pop. Popping the end is O(1) and nothing shifts.
- The array's order becomes scrambled, which is completely fine: the
  problem never asks for order, only for uniform random access.

- The ladder:
    1. array only          insert O(1), remove O(n) scan+shift, random O(1)
    2. hash set only       insert O(1), remove O(1), random O(n) to walk it
    3. array + index map   all three O(1) average, using swap-with-last

- Traps:
    - after the swap I must UPDATE the moved element's index in the map,
      or it points at a stale slot.
    - if the value being removed IS the last element, the swap is a no-op
      and the map entry must be deleted, not rewritten. Order of operations
      matters here.
    - getRandom on an empty structure is undefined - guard it.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SWAP WITH LAST view

  insert(10), insert(20), insert(30)

    values    [10, 20, 30]
    index      0   1   2
    indexOf   { 10:0, 20:1, 30:2 }

  remove(20)

    step 1  where is 20?  indexOf[20] = 1
    step 2  what is last? values[2] = 30
    step 3  move 30 into slot 1
              values [10, 30, 30]
                          ^
                          30 now sits at index 1
    step 4  fix the map for the MOVED value
              indexOf[30] = 1
    step 5  pop the tail
              values [10, 30]
    step 6  forget the removed value
              indexOf = { 10:0, 30:1 }

    final   values  [10, 30]      indexOf { 10:0, 30:1 }
            the array is still dense - no holes, so getRandom stays uniform

  getRandom()
    r = floor(random() * 2)  ->  0 or 1
    r = 0 -> 10,  r = 1 -> 30       each with probability 1/2

THE EDGE CASE - removing the LAST element, remove(30) from the above

    indexOf[30] = 1, last index is also 1
    step 3  values[1] = values[1]      a harmless self-assignment
    step 4  indexOf[30] = 1            rewrites the entry I am about to kill
    step 5  values.pop()  ->  [10]
    step 6  indexOf.delete(30)         MUST come after step 4, or the stale
                                       entry survives and getRandom breaks

  INVARIANT (holds after every operation):
      values has no holes, and for every i, indexOf[values[i]] === i.
  Every line in remove exists to restore that invariant.
*/

// ============================================================
// 3) BRUTE FORCE - ARRAY ONLY
// ============================================================
/*
- Keep just the array. Membership and removal need a linear scan.
    insert O(n) (must check for duplicates), remove O(n), getRandom O(1)
    Space : O(n)
- Correct, and it makes clear which single operation is the bottleneck.
*/
class RandomizedSetArray {
  constructor() {
    this.values = [];
  }

  insert(val) {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] === val) return false;
    }

    this.values.push(val);
    return true;
  }

  remove(val) {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i] === val) {
        // splice shifts every later element - this is the O(n) I must kill
        this.values.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  getRandom() {
    if (this.values.length === 0) return -1;
    return this.values[Math.floor(Math.random() * this.values.length)];
  }
}

// ============================================================
// 4) BETTER - HASH SET ONLY
// ============================================================
/*
- A Set fixes insert and remove, but breaks getRandom: to reach the k-th
  member I have to iterate, which is O(n).
    insert O(1), remove O(1), getRandom O(n)
    Space : O(n)
- Useful to state, because it shows the two halves of the problem pull in
  different directions - which is exactly why the answer needs both.
*/
class RandomizedSetHash {
  constructor() {
    this.members = new Set();
  }

  insert(val) {
    if (this.members.has(val)) return false;
    this.members.add(val);
    return true;
  }

  remove(val) {
    if (!this.members.has(val)) return false;
    this.members.delete(val);
    return true;
  }

  getRandom() {
    if (this.members.size === 0) return -1;

    const target = Math.floor(Math.random() * this.members.size);
    let i = 0;

    // no random access into a Set, so I have to walk to the target
    for (const value of this.members) {
      if (i === target) return value;
      i++;
    }

    return -1;
  }
}

// ============================================================
// 5) OPTIMAL - ARRAY + INDEX MAP, SWAP WITH LAST (THE ONE TO WRITE)
// ============================================================
/*
- The array gives uniform random access; the map gives O(1) lookup.
- Removal swaps the victim with the tail so the array stays dense.
    insert O(1), remove O(1), getRandom O(1), all average
    Space : O(n)
*/
class RandomizedSet {
  constructor() {
    this.values = []; // dense list of members, order meaningless
    this.indexOf = new Map(); // value -> its slot in values
  }

  insert(val) {
    if (this.indexOf.has(val)) return false;

    // appending keeps the array dense and costs O(1)
    this.indexOf.set(val, this.values.length);
    this.values.push(val);
    return true;
  }

  remove(val) {
    if (!this.indexOf.has(val)) return false;

    const removeAt = this.indexOf.get(val);
    const lastValue = this.values[this.values.length - 1];

    // move the tail element into the hole so no shifting is needed
    this.values[removeAt] = lastValue;
    this.indexOf.set(lastValue, removeAt);

    // drop the tail, then forget the removed value
    // this order matters: if val WAS the tail, the line above wrote a stale
    // entry for it, and this delete is what cleans it up
    this.values.pop();
    this.indexOf.delete(val);

    return true;
  }

  getRandom() {
    if (this.values.length === 0) return -1;

    // the array has no holes, so every index is equally likely and valid
    return this.values[Math.floor(Math.random() * this.values.length)];
  }
}

// ============================================================
// QUICK CHECK
// ============================================================
const set = new RandomizedSet();
console.log(set.insert(1)); // true
console.log(set.remove(2)); // false  not present
console.log(set.insert(2)); // true
console.log(set.insert(1)); // false  duplicate
console.log([1, 2].includes(set.getRandom())); // true
console.log(set.remove(1)); // true
console.log(set.getRandom()); // 2     only member left

// removing the tail element - the order-of-operations edge case
const tailCase = new RandomizedSet();
tailCase.insert(10);
tailCase.insert(20);
console.log(tailCase.remove(20)); // true
console.log(tailCase.getRandom()); // 10    must never be 20
console.log(tailCase.indexOf.has(20)); // false stale entry cleaned up

// uniformity smoke test - both values should show up
const uniform = new RandomizedSet();
uniform.insert(1);
uniform.insert(2);
const seen = new Set();
for (let i = 0; i < 200; i++) seen.add(uniform.getRandom());
console.log(seen.size); // 2

const arrayVersion = new RandomizedSetArray();
arrayVersion.insert(7);
console.log(arrayVersion.remove(7)); // true
console.log(arrayVersion.getRandom()); // -1   empty

const hashVersion = new RandomizedSetHash();
hashVersion.insert(9);
console.log(hashVersion.getRandom()); // 9

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    array only    insert O(n), remove O(n), random O(1), space O(n)
    hash set only insert O(1), remove O(1), random O(n), space O(n)
    array + map   all three O(1) average, space O(n)
- WHY TWO STRUCTURES:
    uniform random needs an index into a dense array; O(1) lookup needs a
    hash map. Neither alone can do both, so I keep both in sync.
- THE ONE TRICK TO REMEMBER:
    swap-with-last then pop. Removing from the middle of an array is O(n)
    only because of the shifting - and nothing here cares about order, so
    I simply do not shift.
- THE REAL TRAP:
    removing the last element. The swap becomes a self-assignment that
    rewrites the map entry for the value I am deleting, so the delete must
    come after. Getting that order wrong leaves a stale index that makes
    getRandom return a removed value.
- WHY "AVERAGE" O(1):
    hash map operations are constant on average; a pathological hash could
    still chain. Worth saying rather than claiming worst-case O(1).
- FOLLOW-UPS:
    Insert Delete GetRandom O(1) - Duplicates allowed (LC 381, the map
    stores a SET of indices per value),
    LRU Cache (LC 146), LFU Cache (LC 460), Design HashMap (LC 706).
*/

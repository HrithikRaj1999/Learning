/*
Common Elements in Two Lists (LC 349 / 350)   [Q2.7.2]

  A) unique intersection  (LC 349)
     [1,2,2,1], [2,2] -> [2]
  B) keep duplicates      (LC 350)
     [1,2,2,1], [2,2] -> [2,2]

Ask which one they want BEFORE writing. It changes the data
structure from a Set to a count Map.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- BRUTE: for every element of A, scan B. O(n*m). Say it, move on.

- HASH SET (unique version):
      put all of A into a Set
      walk B, if the Set has the value it is common
      put results in a second Set so nothing repeats
  O(n+m) time, O(n) space. Put the SMALLER array in the set.

- COUNT MAP (duplicates version):
      count A's values in a Map
      walk B: count > 0 -> take it and decrement
  The decrement is what caps the output at min(countA, countB).

- SORTED INPUT: two pointers instead, O(1) extra space.
      equal -> take, move both
      a < b -> move a
      a > b -> move b
  If the arrays are already sorted, this beats hashing on memory.
  If they are NOT sorted, sorting costs O(n log n) - only worth it
  when memory is the constraint, or one array is huge and on disk.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
A = [1,2,2,1], B = [2,2]

UNIQUE (Set)
  setA = {1,2}
  walk B: 2 in setA -> take 2, remember it
          2 in setA -> already taken, skip
  answer [2]

WITH DUPLICATES (count Map)
  counts of A = {1:2, 2:2}
  walk B: 2 -> count 2 > 0 -> take, count becomes 1   out [2]
          2 -> count 1 > 0 -> take, count becomes 0   out [2,2]
  answer [2,2]
  (if B were [2,2,2] the third 2 finds count 0 -> not taken)

TWO POINTERS on sorted A=[1,2,2,4], B=[2,2,3]

  i=0 (1)  j=0 (2)   1 < 2 -> i++
  i=1 (2)  j=0 (2)   equal -> take 2, i++, j++      out [2]
  i=2 (2)  j=1 (2)   equal -> take 2, i++, j++      out [2,2]
  i=3 (4)  j=2 (3)   4 > 3 -> j++
  j past the end -> stop
*/

// ============================================================
// 3) BRUTE FORCE - NESTED LOOPS
// ============================================================
/*
    Time  : O(n * m)   Space : O(1) beyond the output.
*/
function intersectionBrute(a, b) {
  const result = [];

  for (const value of a) {
    // is this value anywhere in b, and not already recorded?
    if (b.includes(value) && !result.includes(value)) {
      result.push(value);
    }
  }

  return result;
}

// ============================================================
// 4) OPTIMAL A - UNIQUE INTERSECTION, HASH SET (LC 349)
// ============================================================
/*
    Time  : O(n + m)   Space : O(min(n, m)) if I set-ify the
    smaller array, which is the detail worth saying.
*/
function intersection(a, b) {
  // build the set from the SMALLER array to save memory
  const [small, large] = a.length <= b.length ? [a, b] : [b, a];

  const lookup = new Set(small);
  const taken = new Set();
  const result = [];

  for (const value of large) {
    // present in both, and not reported yet
    if (lookup.has(value) && !taken.has(value)) {
      taken.add(value);
      result.push(value);
    }
  }

  return result;
}

// ============================================================
// 5) OPTIMAL B - KEEP DUPLICATES, COUNT MAP (LC 350)
// ============================================================
/*
- The decrement is the whole trick: each match consumes one copy.
    Time  : O(n + m)   Space : O(min(n, m))
*/
function intersect(a, b) {
  const [small, large] = a.length <= b.length ? [a, b] : [b, a];

  // how many copies of each value the small array still offers
  const counts = new Map();
  for (const value of small) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  const result = [];
  for (const value of large) {
    const left = counts.get(value) || 0;
    if (left > 0) {
      result.push(value);
      // one copy consumed
      counts.set(value, left - 1);
    }
  }

  return result;
}

// ============================================================
// 6) IF BOTH ARE SORTED - TWO POINTERS, O(1) SPACE
// ============================================================
/*
    Time  : O(n + m)   Space : O(1) beyond the output.
- The version to use when the inputs are already sorted, or too
  big to fit a hash table in memory.
*/
function intersectSorted(a, b) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      result.push(a[i]);
      i++;
      j++;
    } else if (a[i] < b[j]) {
      // a's value is too small to ever match - drop it
      i++;
    } else {
      j++;
    }
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(intersection([1, 2, 2, 1], [2, 2])); // [2]
console.log(intersection([4, 9, 5], [9, 4, 9, 8, 4])); // [4,9] (order may vary)
console.log(intersection([1, 2], [3, 4])); // []
console.log(intersection([], [1])); // []

console.log(intersect([1, 2, 2, 1], [2, 2])); // [2,2]
console.log(intersect([4, 9, 5], [9, 4, 9, 8, 4])); // [4,9] or [9,4]
console.log(intersect([1, 2, 2, 1], [2])); // [2]

console.log(intersectSorted([1, 2, 2, 4], [2, 2, 3])); // [2,2]
console.log(intersectSorted([1, 3], [2, 4])); // []
console.log(intersectionBrute([1, 2, 2, 1], [2, 2])); // [2]

/*
============================================================
7) SAY OUT LOUD
============================================================
- FIRST QUESTION TO THE INTERVIEWER:
    "Should duplicates appear in the output?" Unique -> Set,
    duplicates -> count Map. Getting this wrong is the whole
    difference between LC 349 and LC 350.
- COMPLEXITY:
    brute        O(n*m) time, O(1) space
    hash         O(n+m) time, O(min(n,m)) space   <- ship this
    two pointers O(n+m) time, O(1) space, needs sorted input
    (sorting first costs O(n log n + m log m))
- WHY HASH THE SMALLER ARRAY:
    Memory is proportional to whatever goes into the table, so
    hashing the smaller side is strictly better. Free point.
- FOLLOW-UP THEY LIKE - "what if one array is huge, on disk?":
    Load the small one into a hash set and STREAM the big one
    past it. Or sort both externally and use the two-pointer
    merge, which needs no memory at all.
- ORDER OF THE OUTPUT is usually unspecified - confirm it.
- FOLLOW-UPS:
    Intersection of three arrays, union of two arrays, LC 350's
    sorted follow-up, and "find the common elements of k lists"
    which is the same merge idea with k pointers or a heap.
*/

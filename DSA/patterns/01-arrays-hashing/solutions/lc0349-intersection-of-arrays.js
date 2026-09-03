/*
Intersection of Two Arrays (LC 349)

Return the values that appear in BOTH arrays. Each value once, any order.

  [1,2,2,1], [2,2]     -> [2]
  [4,9,5], [9,4,9,8,4] -> [9,4]  or [4,9]
  [1,2], [3,4]         -> []
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- "Each value once" is the giveaway: the answer is a SET, so duplicates
  inside either input are irrelevant.
- Put the smaller array in a Set, then walk the other one and keep the hits.
- To avoid printing a value twice I move each hit into a result Set (or
  delete it from the lookup Set as I take it).

- The ladder:
    1. for each value in a, scan all of b      O(n * m)
    2. sort both, walk with two pointers       O(n log n + m log m), O(1) extra
    3. Set of the smaller array, one pass      O(n + m) time, O(min(n,m)) space
       over the other

- Traps:
    - duplicates in the output. [1,2,2,1] and [2,2] must give [2], not [2,2].
    - either array can be empty -> answer is [].
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SET view, a = [4,9,5], b = [9,4,9,8,4]

  a is shorter, so build the lookup from a:
    lookup = { 4, 9, 5 }
  result = {}

  b[0] = 9   lookup has 9? YES  -> result = { 9 }
  b[1] = 4   lookup has 4? YES  -> result = { 9, 4 }
  b[2] = 9   lookup has 9? YES  -> result already holds 9, Set ignores it
  b[3] = 8   lookup has 8? no
  b[4] = 4   lookup has 4? YES  -> already there

  answer [9,4]

  INVARIANT: result is a Set, so the "each value once" rule is enforced by
  the data structure instead of by extra code.

TWO POINTER view, a = [1,2,2,1] -> sorted [1,1,2,2]
                  b = [2,2]     -> sorted [2,2]

  i=0 (1)  j=0 (2)   1 < 2  -> advance i
  i=1 (1)  j=0 (2)   1 < 2  -> advance i
  i=2 (2)  j=0 (2)   equal  -> take 2, result = [2]
                     then skip ALL 2s on both sides:
                        i moves 2 -> 3 -> 4 (past the end)
                        j moves 0 -> 1 -> 2 (past the end)
  i = 4 is past the end -> stop

  answer [2]

  The "skip all equal" step is what stops [2,2] from being emitted twice.
*/

// ============================================================
// 3) BRUTE FORCE - SCAN THE SECOND ARRAY FOR EVERY VALUE
// ============================================================
/*
- For each value in a, search b, and remember what I already output.
    Time  : O(n * m)   Space : O(k) for the seen list
- Correct, obviously slow, and it makes the duplicate rule visible.
*/
function intersectionBrute(nums1, nums2) {
  if (nums1.length === 0 || nums2.length === 0) return [];

  const result = [];

  for (let i = 0; i < nums1.length; i++) {
    // skip values I have already emitted
    let alreadyAdded = false;
    for (let r = 0; r < result.length; r++) {
      if (result[r] === nums1[i]) alreadyAdded = true;
    }
    if (alreadyAdded) continue;

    for (let j = 0; j < nums2.length; j++) {
      if (nums1[i] === nums2[j]) {
        result.push(nums1[i]);
        break;
      }
    }
  }

  return result;
}

// ============================================================
// 4) BETTER - SORT BOTH, TWO POINTERS
// ============================================================
/*
- Sorted input lets me advance whichever side is behind.
    Time  : O(n log n + m log m)   Space : O(n + m) for the copies
- This is the answer when the arrays are already sorted, or when they are
  huge files on disk that cannot be hashed in memory.
*/
function intersectionSorted(nums1, nums2) {
  if (nums1.length === 0 || nums2.length === 0) return [];

  const a = nums1.slice().sort((x, y) => x - y);
  const b = nums2.slice().sort((x, y) => x - y);

  const result = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] < b[j]) {
      i++;
    } else if (a[i] > b[j]) {
      j++;
    } else {
      result.push(a[i]);

      // jump past every copy so the value is emitted only once
      const value = a[i];
      while (i < a.length && a[i] === value) i++;
      while (j < b.length && b[j] === value) j++;
    }
  }

  return result;
}

// ============================================================
// 5) OPTIMAL - SET OF THE SMALLER ARRAY (THE ONE TO WRITE)
// ============================================================
/*
- Hash the smaller side so the memory bill is O(min(n, m)), then stream
  the larger side past it.
    Time  : O(n + m)   Space : O(min(n, m))
*/
function intersection(nums1, nums2) {
  if (nums1.length === 0 || nums2.length === 0) return [];

  // hash the shorter array to keep the memory bill small
  const smaller = nums1.length <= nums2.length ? nums1 : nums2;
  const larger = nums1.length <= nums2.length ? nums2 : nums1;

  const lookup = new Set(smaller);
  const result = new Set();

  for (let i = 0; i < larger.length; i++) {
    // present on both sides - the Set silently drops repeats
    if (lookup.has(larger[i])) result.add(larger[i]);
  }

  return Array.from(result);
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(intersection([1, 2, 2, 1], [2, 2])); // [2]
console.log(intersection([4, 9, 5], [9, 4, 9, 8, 4])); // [9,4]
console.log(intersection([1, 2], [3, 4])); // []
console.log(intersection([], [1, 2])); // []   empty
console.log(intersection([1], [1])); // [1]  single

console.log(intersectionBrute([1, 2, 2, 1], [2, 2])); // [2]
console.log(intersectionSorted([4, 9, 5], [9, 4, 9, 8, 4])); // [4,9]
console.log(intersectionSorted([1, 2, 2, 1], [2, 2])); // [2]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    scan for each value  O(n*m) time, O(k) space
    sort + two pointers  O(n log n + m log m) time, O(1) extra if in place
    hash the smaller     O(n + m) time, O(min(n,m)) space
- WHY A SET AND NOT A MAP:
    the output wants each value once and never asks how many times, so
    membership is the only thing I need to store.
- WHY HASH THE SMALLER SIDE:
    it makes the space bound O(min(n,m)) instead of O(n). Free win, and
    interviewers notice it.
- WHEN SORTING WINS:
    already-sorted input, or data too large for memory - two pointers then
    stream both sides with O(1) extra space.
- THE REAL TRAP:
    emitting duplicates. Let the result Set (or the skip-all-equal loop in
    the sorted version) enforce uniqueness.
- FOLLOW-UPS:
    Intersection of Two Arrays II (LC 350, keep multiplicity),
    Intersection of Three Sorted Arrays (LC 1213),
    Contains Duplicate (LC 217).
*/

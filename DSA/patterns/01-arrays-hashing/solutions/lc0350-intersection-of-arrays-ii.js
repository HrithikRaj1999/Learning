/*
Intersection of Two Arrays II (LC 350)

Return the common values, but KEEP the multiplicity: a value appears in
the answer as many times as it appears in both arrays.

  [1,2,2,1], [2,2]     -> [2,2]     (2 appears twice in each)
  [4,9,5], [9,4,9,8,4] -> [4,9]     (4 once on the left, 9 once on the left)
  [1,2], [2,2]         -> [2]       (only one 2 on the left)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Same as LC 349 but with COUNTS instead of membership, so the structure
  changes from Set to Map.
- For each value, the answer takes min(countInA, countInB) copies.
- Implementation shortcut: count the smaller array, then walk the larger
  one and spend a count each time it is still positive.

- The ladder:
    1. scan and cross out                  O(n * m) time
    2. sort both, two pointers             O(n log n + m log m), O(1) extra
    3. count the smaller array, spend the  O(n + m) time, O(min(n,m)) space
       counts while streaming the larger

- Traps:
    - min, not sum: [1,2] vs [2,2] gives one 2, not two.
    - the follow-up "what if the arrays are sorted?" wants the two pointer
      version; "what if one array is huge / on disk?" wants counting the
      SMALL one and streaming the big one.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
COUNT AND SPEND view, a = [1,2,2,1], b = [2,2]

  b is shorter, so count b:   counts = { 2:2 }
  result = []

  a[0] = 1   counts[1] missing -> skip
  a[1] = 2   counts[2] = 2 > 0 -> take it
             result = [2],   counts[2] = 2 - 1 = 1
  a[2] = 2   counts[2] = 1 > 0 -> take it
             result = [2,2], counts[2] = 1 - 0... = 0
  a[3] = 1   counts[1] missing -> skip

  answer [2,2]

  INVARIANT: counts[v] is "copies of v still unclaimed on the small side".
  Decrementing is what caps the output at min(countA, countB).

MIN CASE, a = [1,2], b = [2,2]

  a is shorter, count a:   counts = { 1:1, 2:1 }
  b[0] = 2  counts[2] = 1 > 0 -> take, result = [2], counts[2] = 0
  b[1] = 2  counts[2] = 0     -> skip, the left side ran out
  answer [2]        min(1, 2) = 1 copy, exactly right

TWO POINTER view, a = [1,2,2,1] -> [1,1,2,2],  b = [2,2] -> [2,2]

  i=0 (1)  j=0 (2)   1 < 2  -> i++
  i=1 (1)  j=0 (2)   1 < 2  -> i++
  i=2 (2)  j=0 (2)   equal  -> push 2, i=3, j=1     result [2]
  i=3 (2)  j=1 (2)   equal  -> push 2, i=4, j=2     result [2,2]
  i past the end -> stop

  Here I advance BOTH by one on a match (no skip-all-equal), and that is
  precisely the difference from LC 349.
*/

// ============================================================
// 3) BRUTE FORCE - SCAN AND CROSS OUT
// ============================================================
/*
- For each value in a, find an unused copy in b and mark it consumed.
    Time  : O(n * m)   Space : O(m) for the used flags
- Slow, but the "consume one copy" rule is impossible to misread.
*/
function intersectBrute(nums1, nums2) {
  if (nums1.length === 0 || nums2.length === 0) return [];

  const used = new Array(nums2.length).fill(false);
  const result = [];

  for (let i = 0; i < nums1.length; i++) {
    for (let j = 0; j < nums2.length; j++) {
      if (!used[j] && nums2[j] === nums1[i]) {
        // claim this copy so it cannot be matched twice
        used[j] = true;
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
- On a match advance BOTH pointers by one, which naturally emits
  min(countA, countB) copies.
    Time  : O(n log n + m log m)   Space : O(n + m) for the copies
- The right answer when the input is already sorted or too big to hash.
*/
function intersectSorted(nums1, nums2) {
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
      // one copy from each side is consumed - this is the min() in action
      result.push(a[i]);
      i++;
      j++;
    }
  }

  return result;
}

// ============================================================
// 5) OPTIMAL - COUNT THE SMALLER, SPEND WHILE STREAMING
// ============================================================
/*
- Hash only the shorter array, then stream the longer one past it.
    Time  : O(n + m)   Space : O(min(n, m))
*/
function intersect(nums1, nums2) {
  if (nums1.length === 0 || nums2.length === 0) return [];

  // count the shorter side to keep memory at O(min(n, m))
  const smaller = nums1.length <= nums2.length ? nums1 : nums2;
  const larger = nums1.length <= nums2.length ? nums2 : nums1;

  const counts = new Map();
  for (let i = 0; i < smaller.length; i++) {
    counts.set(smaller[i], (counts.get(smaller[i]) || 0) + 1);
  }

  const result = [];

  for (let i = 0; i < larger.length; i++) {
    const left = counts.get(larger[i]) || 0;

    // still have an unclaimed copy on the small side - pair them up
    if (left > 0) {
      result.push(larger[i]);
      counts.set(larger[i], left - 1);
    }
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(intersect([1, 2, 2, 1], [2, 2])); // [2,2]
console.log(intersect([4, 9, 5], [9, 4, 9, 8, 4])); // [9,4] or [4,9]
console.log(intersect([1, 2], [2, 2])); // [2]   min applies
console.log(intersect([], [1])); // []    empty
console.log(intersect([1, 1, 1], [1])); // [1]   min applies

console.log(intersectBrute([1, 2, 2, 1], [2, 2])); // [2,2]
console.log(intersectSorted([1, 2, 2, 1], [2, 2])); // [2,2]
console.log(intersectSorted([1, 2], [2, 2])); // [2]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    scan and cross out   O(n*m) time, O(m) space
    sort + two pointers  O(n log n + m log m) time, O(1) extra in place
    count + stream       O(n + m) time, O(min(n,m)) space
- THE DIFFERENCE FROM LC 349:
    349 wants a SET (each value once) so I skip all equal copies. 350 wants
    a MULTISET, so on a match I advance both pointers by exactly one, which
    is the same as taking min(countA, countB).
- THE THREE OFFICIAL FOLLOW-UPS, ANSWERED:
    "sorted input?"   -> two pointers, no hashing at all.
    "nums1 much smaller?" -> hash nums1, stream nums2. That is what my
                          optimal version already does.
    "nums2 on disk, cannot fit in memory?" -> load nums1 into a count map,
                          then stream nums2 in chunks past it.
- THE REAL TRAP:
    taking every match instead of min. Decrementing the count is what caps
    it correctly.
- FOLLOW-UPS:
    Intersection of Two Arrays (LC 349), Merge Sorted Array (LC 88),
    Find Common Characters (LC 1002).
*/

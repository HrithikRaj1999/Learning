/*
Prefix Sum and Line Sweep   [Q2.8 OA pattern, Aug 2025]

Two patterns that solve most "range" OA questions.

A) PREFIX SUM  - answer "sum of range [i..j]" in O(1) after O(n)
   setup, subarray sum equals k (LC 560), running sum (LC 1480).
B) LINE SWEEP / DIFFERENCE ARRAY - apply many range updates in
   O(1) each, then one pass to materialise. Also the standard
   answer for "minimum meeting rooms" and "car pooling".
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
PREFIX SUM
- prefix[i] = sum of the first i elements.
      sum(i..j) = prefix[j+1] - prefix[i]
  Because the big block minus the front block leaves the middle.
- Make the array size n+1 with prefix[0] = 0. That extra slot
  removes every "if i === 0" special case.

SUBARRAY SUM = K (the OA favourite)
- Walk once with a running sum. At each point ask:
      "have I seen the running sum (running - k) before?"
  If yes, the piece between then and now sums to exactly k.
- A Map counts how many times each running sum was seen.
  Seed it with {0: 1} - that stands for the empty prefix, which
  is what makes a subarray starting at index 0 count.

DIFFERENCE ARRAY / LINE SWEEP
- To add v over the range [l, r], do NOT touch every cell.
      diff[l] += v      "from here on, v more"
      diff[r+1] -= v    "from here on, cancel it"
  Then the prefix sum of diff IS the final array. m updates cost
  O(m), not O(m * n).
- Same idea for intervals: +1 at the start, -1 at the end, sweep
  and track the running count. The peak is the max overlap.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
PREFIX SUM, arr = [2, 4, 1, 3]

  index :      0  1  2  3
  arr   :      2  4  1  3
  prefix: 0    2  6  7 10        (prefix has one extra slot)
          ^ prefix[0] = 0

  sum(1..2) = 4 + 1 = 5
            = prefix[3] - prefix[1] = 7 - 2 = 5  ✓

SUBARRAY SUM = K, arr = [1,2,3], k = 3

  seen = {0:1}     running = 0
  i=0  running 1   need 1-3 = -2 -> not seen   seen {0:1, 1:1}
  i=1  running 3   need 3-3 =  0 -> seen once  count = 1  ([1,2])
                                                seen {0:1,1:1,3:1}
  i=2  running 6   need 6-3 =  3 -> seen once  count = 2  ([3])
  answer 2

DIFFERENCE ARRAY, n = 5, updates: add 2 over [1,3], add 3 over [0,2]

  diff after update 1 :  0  2  0  0 -2  0
  diff after update 2 :  3  2  0 -3 -2  0
                         ^ +3 at 0        ^ -3 at index 3

  prefix sum of diff  :  3  5  5  2  0
  index               :  0  1  2  3  4
  check index 1: 2 + 3 = 5 ✓   index 3: only the first update -> 2 ✓

MAX OVERLAP (meeting rooms), meetings [0,30],[5,10],[15,20]

  events sorted by time: +1@0  +1@5  -1@10  +1@15  -1@20  -1@30
  running:                 1     2     1      2      1      0
  peak = 2 -> 2 rooms needed
*/

// ============================================================
// 3) A) PREFIX SUM - RANGE SUM QUERIES
// ============================================================
/*
    Build : O(n) time, O(n) space
    Query : O(1)
- Beats re-summing (O(n) per query) as soon as there are 2+ queries.
*/
function buildPrefix(arr) {
  // one extra slot at the front so no query needs a special case
  const prefix = new Array(arr.length + 1).fill(0);

  for (let i = 0; i < arr.length; i++) {
    prefix[i + 1] = prefix[i] + arr[i];
  }

  return prefix;
}

function rangeSum(prefix, from, to) {
  // big block minus the front block leaves [from..to]
  return prefix[to + 1] - prefix[from];
}

// ============================================================
// 4) A) SUBARRAY SUM EQUALS K - BRUTE FORCE
// ============================================================
/*
    Time  : O(n^2)   Space : O(1)
*/
function subarraySumBrute(arr, k) {
  let count = 0;

  for (let start = 0; start < arr.length; start++) {
    let running = 0;
    for (let end = start; end < arr.length; end++) {
      running += arr[end];
      if (running === k) count++;
    }
  }

  return count;
}

// ============================================================
// 5) A) SUBARRAY SUM EQUALS K - OPTIMAL (LC 560)
// ============================================================
/*
- STEP 1: seen = {0: 1}, the empty prefix.
- STEP 2: running sum as I walk.
- STEP 3: add however many times (running - k) has been seen.
- STEP 4: record the current running sum.
    Time  : O(n)   Space : O(n)
- Works with negative numbers, which is why a sliding window
  does NOT work here.
*/
function subarraySum(arr, k) {
  // running sum -> how many times it has occurred
  const seen = new Map([[0, 1]]);
  let running = 0;
  let count = 0;

  for (const value of arr) {
    running += value;

    // every earlier point with sum (running - k) starts a valid
    // subarray that ends right here
    const needed = running - k;
    if (seen.has(needed)) count += seen.get(needed);

    seen.set(running, (seen.get(running) || 0) + 1);
  }

  return count;
}

// ============================================================
// 6) B) DIFFERENCE ARRAY - MANY RANGE UPDATES, ONE PASS
// ============================================================
/*
- Each update is O(1); building the final array is O(n).
    Time  : O(updates + n)   Space : O(n)
*/
function applyRangeUpdates(length, updates) {
  // one extra slot so an update ending at the last index is safe
  const diff = new Array(length + 1).fill(0);

  for (const [from, to, value] of updates) {
    // "from here on, add value"
    diff[from] += value;
    // "from here on, take it back again"
    diff[to + 1] -= value;
  }

  // the prefix sum of the diff array IS the final array
  const result = new Array(length).fill(0);
  let running = 0;
  for (let i = 0; i < length; i++) {
    running += diff[i];
    result[i] = running;
  }

  return result;
}

// ============================================================
// 7) B) LINE SWEEP - MAX OVERLAPPING INTERVALS (MEETING ROOMS 2)
// ============================================================
/*
- Turn each interval into two events, sort by time, sweep.
- On a tie, the END must be processed BEFORE the start, otherwise
  a meeting ending at 10 and one starting at 10 look like an
  overlap. Ask the interviewer which rule they want.
    Time  : O(n log n) for the sort   Space : O(n)
*/
function maxOverlap(intervals) {
  const events = [];

  for (const [start, end] of intervals) {
    events.push([start, 1]); // someone arrives
    events.push([end, -1]); // someone leaves
  }

  events.sort((a, b) => {
    if (a[0] !== b[0]) return a[0] - b[0];
    // at the same timestamp, leaving happens first (-1 before +1)
    return a[1] - b[1];
  });

  let running = 0;
  let peak = 0;

  for (const [, change] of events) {
    running += change;
    if (running > peak) peak = running;
  }

  return peak;
}

// ============================================================
// QUICK CHECK
// ============================================================
const prefix = buildPrefix([2, 4, 1, 3]);
console.log(prefix); // [0,2,6,7,10]
console.log(rangeSum(prefix, 1, 2)); // 5
console.log(rangeSum(prefix, 0, 3)); // 10
console.log(rangeSum(prefix, 2, 2)); // 1

console.log(subarraySum([1, 2, 3], 3)); // 2
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, -1, 0], 0)); // 3   (negatives work)
console.log(subarraySum([], 0)); // 0
console.log(subarraySumBrute([1, -1, 0], 0)); // 3

console.log(applyRangeUpdates(5, [[1, 3, 2], [0, 2, 3]])); // [3,5,5,2,0]
console.log(applyRangeUpdates(3, [])); // [0,0,0]

console.log(maxOverlap([[0, 30], [5, 10], [15, 20]])); // 2
console.log(maxOverlap([[7, 10], [2, 4]])); // 1
console.log(maxOverlap([])); // 0

/*
============================================================
8) SAY OUT LOUD
============================================================
- WHEN I REACH FOR PREFIX SUM:
    Many range-sum queries on data that does not change. O(n)
    setup turns every query into O(1). If the data DOES change,
    a Fenwick tree / BIT gives O(log n) updates and queries -
    name it, that is the expected follow-up.
- WHY A SLIDING WINDOW FAILS ON SUBARRAY-SUM-EQUALS-K:
    A window only works when growing it never decreases the sum.
    With negative numbers that breaks, so the prefix-sum map is
    the correct tool. If the problem promises all positives, a
    two-pointer window is O(1) space and better.
- THE {0: 1} SEED:
    It represents the empty prefix, which is what lets a subarray
    that starts at index 0 be counted. Forgetting it silently
    loses answers - the classic bug in this problem.
- DIFFERENCE ARRAY IN ONE SENTENCE:
    Store the CHANGES instead of the values, so a range update is
    two writes; the prefix sum turns changes back into values.
- SWEEP TIE-BREAKING:
    End before start when touching intervals should not count as
    overlapping. That single comparator line is what the graders
    test.
- FOLLOW-UPS:
    Range sum query immutable (LC 303) and 2D (LC 304),
    car pooling (LC 1094 - difference array), corporate flight
    bookings (LC 1109), my calendar (LC 729), and product of
    array except self (LC 238 - prefix and suffix products).
*/

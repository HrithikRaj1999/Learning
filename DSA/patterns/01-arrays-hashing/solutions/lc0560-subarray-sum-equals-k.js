/*
Subarray Sum Equals K (LC 560)

Count how many CONTIGUOUS subarrays add up to exactly k.
Numbers can be negative.

  nums = [1,1,1], k = 2   -> 2   ([1,1] at 0..1 and [1,1] at 1..2)
  nums = [1,2,3], k = 3   -> 2   ([1,2] and [3])
  nums = [1,-1,0], k = 0  -> 3   ([1,-1], [0], [1,-1,0])
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Let prefix[i] = sum of nums[0..i-1]. Then the sum of the window (j..i-1)
  is prefix[i] - prefix[j].
- I want that to equal k, so:   prefix[i] - prefix[j] = k
                          ->    prefix[j] = prefix[i] - k
- So while walking, I ask: "how many earlier prefix sums equal
  currentSum - k?" That is a Map from prefix value to COUNT.
- Counts, not indices, because many earlier positions can share a prefix.

- The ladder:
    1. every start, every end, sum inside     O(n^3)
    2. every start, extend the end, running   O(n^2) time, O(1) space
       sum
    3. prefix sum + Map of counts             O(n) time, O(n) space

- Traps:
    - seed the Map with { 0: 1 }. That represents "empty prefix", and it is
      what lets a subarray starting at index 0 be counted.
    - sliding window does NOT work here - negatives break monotonicity.
    - look up BEFORE inserting the current prefix, or k = 0 double counts.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
PREFIX + MAP view, nums = [1,2,3], k = 3

  seen = { 0:1 }    <- the empty prefix, sum 0, seen once
  sum = 0, total = 0

  i=0  x=1   sum = 0 + 1 = 1
             need = sum - k = 1 - 3 = -2
             seen has -2? no,  total stays 0
             seen[1] = 1        seen = { 0:1, 1:1 }

  i=1  x=2   sum = 1 + 2 = 3
             need = 3 - 3 = 0
             seen has 0? YES x1  -> total = 0 + 1 = 1
                                    (the subarray is nums[0..1] = [1,2])
             seen[3] = 1        seen = { 0:1, 1:1, 3:1 }

  i=2  x=3   sum = 3 + 3 = 6
             need = 6 - 3 = 3
             seen has 3? YES x1  -> total = 1 + 1 = 2
                                    (the subarray is nums[2..2] = [3])
             seen[6] = 1        seen = { 0:1, 1:1, 3:1, 6:1 }

  answer 2

  WHY seed { 0:1 }: at i=1 the match was the empty prefix. Without the seed
  the whole-prefix subarray [1,2] would be missed.

NEGATIVE case, nums = [1,-1,0], k = 0

  seen = { 0:1 }, sum = 0, total = 0

  i=0  x=1    sum = 1    need = 1 - 0 = 1   seen has 1? no     seen={0:1,1:1}
  i=1  x=-1   sum = 0    need = 0 - 0 = 0   seen has 0? YES x1 total = 1
                                            ([1,-1])
                         seen[0] = 1 + 1 = 2   seen={0:2,1:1}
  i=2  x=0    sum = 0    need = 0           seen has 0? YES x2 total = 1+2 = 3
                                            ([0] and [1,-1,0])
                         seen[0] = 2 + 1 = 3

  answer 3

  INVARIANT: seen counts every prefix STRICTLY BEFORE the current index.
  The count (not a flag) is what makes the x2 hit above correct.
*/

// ============================================================
// 3) BRUTE FORCE - EVERY SUBARRAY, SUMMED FROM SCRATCH
// ============================================================
/*
- Pick a start, pick an end, add up everything in between.
    Time  : O(n^3)   Space : O(1)
- Only worth saying as a sentence, then fixing the wasted re-summing.
*/
function subarraySumBrute(nums, k) {
  if (nums.length === 0) return 0;

  let total = 0;

  for (let start = 0; start < nums.length; start++) {
    for (let end = start; end < nums.length; end++) {
      let windowSum = 0;

      for (let i = start; i <= end; i++) windowSum = windowSum + nums[i];

      if (windowSum === k) total++;
    }
  }

  return total;
}

// ============================================================
// 4) BETTER - FIX THE START, EXTEND THE END
// ============================================================
/*
- Keep a running sum as the end grows, so no re-summing.
    Time  : O(n^2)   Space : O(1)
- This is the version to write if the interviewer bans extra memory.
*/
function subarraySumRunning(nums, k) {
  if (nums.length === 0) return 0;

  let total = 0;

  for (let start = 0; start < nums.length; start++) {
    let windowSum = 0;

    for (let end = start; end < nums.length; end++) {
      // extend the window by one element instead of re-adding all of it
      windowSum = windowSum + nums[end];
      if (windowSum === k) total++;
    }
  }

  return total;
}

// ============================================================
// 5) OPTIMAL - PREFIX SUM + HASHMAP OF COUNTS (THE ONE TO WRITE)
// ============================================================
/*
- One pass. At each index, count how many earlier prefixes equal sum - k.
    Time  : O(n)   Space : O(n)
*/
function subarraySum(nums, k) {
  if (nums.length === 0) return 0;

  // prefix sum value -> how many indices produced it
  // 0 appears once for free: the empty prefix before index 0
  const seen = new Map();
  seen.set(0, 1);

  let sum = 0;
  let total = 0;

  for (let i = 0; i < nums.length; i++) {
    sum = sum + nums[i];

    // every earlier prefix equal to (sum - k) closes one valid subarray
    const need = sum - k;
    if (seen.has(need)) total = total + seen.get(need);

    // record myself only after looking up, so I never match myself
    seen.set(sum, (seen.get(sum) || 0) + 1);
  }

  return total;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(subarraySum([1, 1, 1], 2)); // 2
console.log(subarraySum([1, 2, 3], 3)); // 2
console.log(subarraySum([1, -1, 0], 0)); // 3   negatives
console.log(subarraySum([], 0)); // 0   empty
console.log(subarraySum([3], 3)); // 1   single hit

console.log(subarraySumBrute([1, -1, 0], 0)); // 3
console.log(subarraySumRunning([1, 1, 1], 2)); // 2
console.log(subarraySumRunning([1, 2, 3], 3)); // 2

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    all subarrays, re-sum   O(n^3) time, O(1) space
    running sum             O(n^2) time, O(1) space
    prefix + map            O(n) time, O(n) space
- WHY THE MAP WORKS:
    sum(j..i) = prefix[i] - prefix[j]. Fixing i turns "find a window
    summing to k" into "find prefix[j] = prefix[i] - k", which is a lookup.
- WHY NOT A SLIDING WINDOW:
    a window only works when growing it never decreases the sum. Negatives
    break that, so shrinking on "too big" is unsound. This is the single
    most common wrong answer to this problem.
- THE REAL TRAP:
    the { 0: 1 } seed, and storing COUNTS not indices. Both are needed:
    the seed catches subarrays starting at 0, the counts catch repeats.
- FOLLOW-UPS:
    Continuous Subarray Sum (LC 523, prefix modulo k),
    Subarray Sums Divisible by K (LC 974),
    Maximum Size Subarray Sum Equals k (LC 325, store first index instead).
*/

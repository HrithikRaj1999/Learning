/*
Find the Missing Number (LC 268)   [Q2.7.6]

An array holds n distinct numbers taken from 0..n, so exactly ONE
is missing. Find it.

  [3,0,1]       -> 2      (n = 3, range 0..3)
  [9,6,4,2,3,5,7,0,1] -> 8
  [0]           -> 1
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Four ways, each better than the last. Walk the ladder out loud.

  1. SORT then find the first index i where arr[i] !== i.
     O(n log n).

  2. HASH SET of everything, then test 0..n. O(n) time, O(n) space.

  3. SUM FORMULA: 0+1+...+n = n(n+1)/2. Subtract the actual sum.
     The gap IS the missing number. O(n) time, O(1) space.

  4. XOR: a ^ a = 0 and a ^ 0 = a. XOR every index AND every value
     together; each present number cancels itself and only the
     missing one survives. O(n) time, O(1) space, and NO overflow -
     that is why interviewers prefer it over the sum.

- The sum version is the easy one to say; the XOR version is the
  one that scores.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
nums = [3,0,1], n = 3, so the range is 0,1,2,3

SUM
  expected = 3*4/2 = 6
  actual   = 3+0+1 = 4
  missing  = 6 - 4 = 2   ✓

XOR (write the numbers in binary if it helps)
  start x = 0
  fold in every INDEX 0..n and every VALUE

  indexes 0,1,2,3 -> x = 0^1^2^3
  values  3,0,1   -> x = x^3^0^1

  x = (0^0) ^ (1^1) ^ (3^3) ^ 2
    =   0   ^   0   ^   0   ^ 2
    = 2   ✓

  Every number that IS present appears twice - once as an index,
  once as a value - and cancels. The missing one appears once.

WHY 0..n AND NOT 1..n:
  the array has n items but the range has n+1 numbers, which is
  what makes exactly one missing. Confirm the range with them.
*/

// ============================================================
// 3) BRUTE FORCE - SORT AND SCAN
// ============================================================
/*
    Time  : O(n log n)   Space : O(n) for the copy.
*/
function missingNumberSort(nums) {
  const sorted = [...nums].sort((a, b) => a - b);

  for (let i = 0; i < sorted.length; i++) {
    // the first place where the value does not match its index
    if (sorted[i] !== i) return i;
  }

  // nothing missing inside, so it is the last number
  return sorted.length;
}

// ============================================================
// 4) BETTER - HASH SET
// ============================================================
/*
    Time  : O(n)   Space : O(n)
*/
function missingNumberSet(nums) {
  const present = new Set(nums);

  for (let i = 0; i <= nums.length; i++) {
    if (!present.has(i)) return i;
  }

  return -1;
}

// ============================================================
// 5) OPTIMAL A - SUM FORMULA
// ============================================================
/*
    Time  : O(n)   Space : O(1)
- Watch for overflow in Java/C++ when n is large: n(n+1)/2 can
  exceed int. Use long, or subtract as you go.
*/
function missingNumberSum(nums) {
  const n = nums.length;
  // 0 + 1 + ... + n
  const expected = (n * (n + 1)) / 2;

  let actual = 0;
  for (const num of nums) actual += num;

  return expected - actual;
}

// ============================================================
// 6) OPTIMAL B - XOR (NO OVERFLOW, THE ONE THEY LIKE)
// ============================================================
/*
- STEP 1: start with n, because the index loop only reaches n-1.
- STEP 2: fold in each index i and each value nums[i].
- STEP 3: every present number cancels itself out, the missing
    one is left.
    Time  : O(n)   Space : O(1)
*/
function missingNumber(nums) {
  // seed with n so the full range 0..n is covered
  let result = nums.length;

  for (let i = 0; i < nums.length; i++) {
    // index and value both folded in - pairs cancel
    result = result ^ i ^ nums[i];
  }

  return result;
}

// ============================================================
// 7) VARIANT - TWO NUMBERS MISSING, OR ONE MISSING FROM 1..n
// ============================================================
/*
- Range 1..n instead of 0..n: expected = n(n+1)/2 with n = length+1.
- If the array can be modified, index marking works too: negate
  the slot for each value, then the still-positive slot is the
  missing number. Same trick as find-duplicates.
*/
function missingFromOneToN(nums) {
  const n = nums.length + 1;
  const expected = (n * (n + 1)) / 2;

  let actual = 0;
  for (const num of nums) actual += num;

  return expected - actual;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(missingNumber([3, 0, 1])); // 2
console.log(missingNumber([0, 1])); // 2   (missing the last one)
console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
console.log(missingNumber([1])); // 0   (missing the first one)
console.log(missingNumber([0])); // 1

console.log(missingNumberSum([3, 0, 1])); // 2
console.log(missingNumberSet([3, 0, 1])); // 2
console.log(missingNumberSort([9, 6, 4, 2, 3, 5, 7, 0, 1])); // 8
console.log(missingFromOneToN([1, 2, 4, 5])); // 3

/*
============================================================
8) SAY OUT LOUD
============================================================
- THE LADDER:
    sort   O(n log n) time, O(1)-O(n) space
    set    O(n) time, O(n) space
    sum    O(n) time, O(1) space, can overflow
    XOR    O(n) time, O(1) space, cannot overflow  <- best answer
- WHY XOR WORKS IN ONE SENTENCE:
    a ^ a = 0, so pairing every index with every value cancels
    everything that is present, and the missing number is the
    only value left standing.
- THE THREE EDGE CASES:
    missing 0 (the array is 1..n), missing n (the array is 0..n-1),
    and a single-element array. Test all three - graders always
    include them.
- CLARIFY THE RANGE FIRST: 0..n or 1..n? The formula changes.
- IF TWO NUMBERS ARE MISSING:
    XOR gives the xor of both. Split the numbers into two groups
    by any set bit of that xor and the problem becomes two
    independent single-missing problems. Same trick as LC 260.
- FOLLOW-UPS:
    Single number (LC 136 - pure XOR), find all disappeared
    numbers (LC 448 - index marking), first missing positive
    (LC 41 - the hard version, still index-as-hash).
*/

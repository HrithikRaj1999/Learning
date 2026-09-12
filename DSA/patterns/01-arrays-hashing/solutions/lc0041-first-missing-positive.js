/*
First Missing Positive (LC 41)

Return the smallest POSITIVE integer that is not in nums.
Must run in O(n) time and O(1) extra space.

  [1,2,0]       -> 3   (1 and 2 present, so 3 is first missing)
  [3,4,-1,1]    -> 2   (1 present, 2 missing)
  [7,8,9,11,12] -> 1   (nothing small is present)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The answer is ALWAYS between 1 and n+1, where n = nums.length.
  Why: n slots can hold at most n distinct positives. If they are exactly
  1..n the answer is n+1; otherwise some value in 1..n is missing.
- That bound is the whole problem. It means I only care about values in
  1..n and can throw away everything else (negatives, zero, huge numbers).
- With only n interesting values and n slots, the array can be its own
  hash table: put value v at index v-1. This is CYCLIC SORT.
- Then one sweep: the first index i where nums[i] != i+1 gives i+1.

- The ladder:
    1. for v = 1,2,3... scan the array for v         O(n^2) time, O(1) space
    2. Set of everything, then test 1,2,3...         O(n) time, O(n) space
    3. cyclic sort in place, then one sweep          O(n) time, O(1) space

- Traps:
    - the swap must be a WHILE, not an IF - the value swapped in may also
      be misplaced.
    - guard against an infinite loop when nums[i] and its target are equal
      (duplicates), otherwise it swaps forever.
    - only touch values in [1, n]; skip everything else.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
CYCLIC SORT view, nums = [3,4,-1,1],  n = 4
Goal: value v should sit at index v-1.

  index   0   1   2   3
  value   3   4  -1   1

  i=0  nums[0] = 3, target index = 3 - 1 = 2, nums[2] = -1
       3 != -1 and 3 is in [1,4] -> swap slots 0 and 2
       [-1, 4, 3, 1]
       now nums[0] = -1, not in [1,4] -> stop swapping here, move on

  i=1  nums[1] = 4, target index = 4 - 1 = 3, nums[3] = 1
       4 != 1 -> swap slots 1 and 3
       [-1, 1, 3, 4]
       now nums[1] = 1, target index = 0, nums[0] = -1
       1 != -1 -> swap slots 1 and 0
       [1, -1, 3, 4]
       now nums[1] = -1, not in range -> stop, move on

  i=2  nums[2] = 3, target index = 2, that IS index 2 -> already home
  i=3  nums[3] = 4, target index = 3, already home

  final [1, -1, 3, 4]

  SWEEP - the first slot where value != index + 1

    index   0   1   2   3
    value   1  -1   3   4
    want    1   2   3   4
                ^
                index 1 holds -1 but wants 2 -> answer 2

  INVARIANT after the sort: if the value v is anywhere in 1..n, then it
  sits at index v-1. So a wrong value at index i proves i+1 is missing.

FULL ARRAY case, nums = [1,2,0], n = 3
  after cyclic sort: [1,2,0]     (0 is out of range, left alone)
  sweep: index 0 has 1 ok, index 1 has 2 ok, index 2 has 0 but wants 3
  -> answer 3

NOTHING SMALL case, nums = [7,8,9,11,12], n = 5
  every value is > n, so nothing moves
  sweep: index 0 has 7 but wants 1 -> answer 1
*/

// ============================================================
// 3) BRUTE FORCE - TRY 1, 2, 3, ... AND SCAN EACH TIME
// ============================================================
/*
- For candidate v, scan the whole array. First candidate not found wins.
    Time  : O(n^2)   Space : O(1)
- The bound (answer <= n+1) is what makes the outer loop terminate.
*/
function firstMissingPositiveBrute(nums) {
  if (nums.length === 0) return 1;

  // the answer can never exceed n + 1
  for (let candidate = 1; candidate <= nums.length + 1; candidate++) {
    let found = false;

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === candidate) {
        found = true;
        break;
      }
    }

    if (!found) return candidate;
  }

  return nums.length + 1;
}

// ============================================================
// 4) BETTER - SET OF EVERYTHING PRESENT
// ============================================================
/*
- One pass to build the Set, then test 1, 2, 3, ... in order.
    Time  : O(n)   Space : O(n)
- Right time bound, wrong space bound - this is the version the follow-up
  attacks, and it does not mutate the input.
*/
function firstMissingPositiveSet(nums) {
  if (nums.length === 0) return 1;

  const present = new Set(nums);

  for (let candidate = 1; candidate <= nums.length; candidate++) {
    if (!present.has(candidate)) return candidate;
  }

  // 1..n were all present, so the answer is one past the end
  return nums.length + 1;
}

// ============================================================
// 5) OPTIMAL - CYCLIC SORT IN PLACE (THE ONE TO WRITE)
// ============================================================
/*
- Send every value v in [1,n] to index v-1 by swapping, then sweep.
    Time  : O(n)   Space : O(1)
- Each swap puts one value in its permanent home, so at most n swaps happen
  in total even though the while loop is nested. That is why it is linear.
*/
function firstMissingPositive(nums) {
  if (nums.length === 0) return 1;

  const n = nums.length;

  for (let i = 0; i < n; i++) {
    // keep swapping until slot i holds something that belongs here (or junk)
    while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
      const target = nums[i] - 1;
      // send nums[i] home, and bring whatever lived there back to slot i
      const swap = nums[target];
      nums[target] = nums[i];
      nums[i] = swap;
    }
  }

  for (let i = 0; i < n; i++) {
    // slot i should hold i+1; if it does not, i+1 is nowhere in the array
    if (nums[i] !== i + 1) return i + 1;
  }

  return n + 1;
}

// ============================================================
// 6) FOLLOW-UP - MARKING VARIANT, IF MUTATION ORDER MATTERS LESS
// ============================================================
/*
- Same O(1) space, different flavour: overwrite junk with n+1, then use
  negation as the "seen" flag, exactly like LC 448.
    Time  : O(n)   Space : O(1)
- Useful to know because it avoids the tricky while-swap loop entirely.
*/
function firstMissingPositiveMarking(nums) {
  if (nums.length === 0) return 1;

  const n = nums.length;
  const OUT_OF_RANGE = n + 1;

  // step 1: erase everything that cannot be the answer
  for (let i = 0; i < n; i++) {
    if (nums[i] <= 0 || nums[i] > n) nums[i] = OUT_OF_RANGE;
  }

  // step 2: for each surviving value v, flag slot v-1 negative
  for (let i = 0; i < n; i++) {
    const value = Math.abs(nums[i]);
    if (value <= n && nums[value - 1] > 0) nums[value - 1] = -nums[value - 1];
  }

  // step 3: the first slot still positive was never flagged
  for (let i = 0; i < n; i++) {
    if (nums[i] > 0) return i + 1;
  }

  return n + 1;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(firstMissingPositive([1, 2, 0])); // 3
console.log(firstMissingPositive([3, 4, -1, 1])); // 2
console.log(firstMissingPositive([7, 8, 9, 11, 12])); // 1
console.log(firstMissingPositive([])); // 1   empty
console.log(firstMissingPositive([1])); // 2   single
console.log(firstMissingPositive([1, 1])); // 2   duplicate, no infinite loop

console.log(firstMissingPositiveBrute([3, 4, -1, 1])); // 2
console.log(firstMissingPositiveSet([7, 8, 9, 11, 12])); // 1
console.log(firstMissingPositiveMarking([3, 4, -1, 1])); // 2
console.log(firstMissingPositiveMarking([1, 2, 0])); // 3

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    scan per candidate  O(n^2) time, O(1) space
    presence set        O(n) time, O(n) space
    cyclic sort         O(n) time, O(1) space
- THE KEY OBSERVATION:
    the answer lies in [1, n+1]. n slots cannot hold more than n distinct
    positives, so anything outside that window is noise I can ignore.
    Stating this bound first is what makes the O(1) solution obvious.
- WHY THE NESTED WHILE IS STILL O(n):
    every swap permanently places one value at its correct index, and a
    placed value is never moved again. At most n swaps happen in total.
- THE REAL TRAP:
    the loop guard. It must be a while (the incoming value may also be
    misplaced), and it must stop when nums[target] already equals nums[i],
    or duplicates like [1,1] swap forever.
- FOLLOW-UPS:
    Find All Numbers Disappeared (LC 448, same idea, easier),
    Find All Duplicates (LC 442), Find the Duplicate Number (LC 287),
    Missing Number (LC 268, XOR or sum formula).
*/

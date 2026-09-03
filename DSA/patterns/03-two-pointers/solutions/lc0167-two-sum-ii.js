/*
Two Sum II - Input Array Is Sorted (LC 167)

The array is already sorted ascending. Find the two values adding to
target and return their 1-BASED indices. Exactly one answer exists.
Must use O(1) extra space.

  [2,7,11,15], target = 9  -> [1,2]   (2 + 7 = 9)
  [2,3,4],     target = 6  -> [1,3]   (2 + 4 = 6)
  [-1,0],      target = -1 -> [1,2]
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The array being SORTED is the whole gift. It means I can compare the
  current sum with the target and know which direction to move:
      sum too small -> the only way to grow is a bigger left value
      sum too big   -> the only way to shrink is a smaller right value
- So one pointer at each end, converging. Each step throws away one value
  forever, so the loop runs at most n times.
- Why is throwing that value away safe? If nums[left] + nums[right] < target
  then nums[left] paired with ANYTHING at or below right is also too small,
  since nums[right] is the largest remaining. So left can never be part of
  the answer with any remaining partner - it is safe to discard.
- The hash map from LC 1 would work, but it costs O(n) space, and the
  problem explicitly forbids that.

- The ladder:
    1. every pair                                 O(n^2) time, O(1) space
    2. for each i, BINARY SEARCH for the partner   O(n log n) time, O(1)
    3. two pointers converging from both ends      O(n) time, O(1) space

- Traps:
    - the answer is 1-BASED, so add 1 to each index.
    - do not use a hash map: it passes but violates the stated O(1) space.
    - values can be negative, which is fine - only the ordering matters.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
CONVERGING view, nums = [2,3,4], target = 6

  index    0  1  2
  value    2  3  4

  left = 0 (2), right = 2 (4)
      sum = 2 + 4 = 6  == target -> return [0+1, 2+1] = [1,3]

Now a case that needs moves, nums = [2,7,11,15], target = 18

  left = 0 (2), right = 3 (15)
      sum = 2 + 15 = 17  < 18  -> too small, move LEFT up
                                  (15 is the biggest partner 2 will ever
                                   get, and it still fell short, so index 0
                                   is useless - discard it)
  left = 1 (7), right = 3 (15)
      sum = 7 + 15 = 22  > 18  -> too big, move RIGHT down
                                  (7 is the smallest partner 15 will ever
                                   get, and it already overshot)
  left = 1 (7), right = 2 (11)
      sum = 7 + 11 = 18  == 18 -> return [2, 3]

  INVARIANT: every pair that could still sum to target lies inside
  [left, right]. Each move provably eliminates one index entirely, so no
  answer is ever skipped and the loop is linear.

WHY IT CANNOT MISS THE ANSWER, drawn as the search space

    left ->                          <- right
    [ 2 ,  7 ,  11 ,  15 ]
      ^                ^
      sum too small: EVERY pair using index 0 and something <= right is
      also too small, because 15 is the largest available. So the whole
      first row of the pair table is eliminated in one step, not just
      one cell.

NEGATIVE case, nums = [-1,0], target = -1
  left = 0 (-1), right = 1 (0)
  sum = -1 + 0 = -1 == target -> [1,2]
*/

// ============================================================
// 3) BRUTE FORCE - EVERY PAIR
// ============================================================
/*
- Ignore the sorting entirely and test all pairs.
    Time  : O(n^2)   Space : O(1)
- Say it in one sentence, then immediately point out that the sorted order
  is information I am wasting.
*/
function twoSumBrute(numbers, target) {
  if (numbers.length < 2) return [];

  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      // the answer is 1-based, hence the +1 on both indices
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
    }
  }

  return [];
}

// ============================================================
// 4) BETTER - BINARY SEARCH FOR EACH PARTNER
// ============================================================
/*
- For each i, the partner value is fixed at target - numbers[i], and the
  array is sorted, so I can binary search for it to the right of i.
    Time  : O(n log n)   Space : O(1)
- A genuine use of the sorted order, but it still restarts the search for
  every i, which is the waste the two-pointer version removes.
*/
function twoSumBinarySearch(numbers, target) {
  if (numbers.length < 2) return [];

  for (let i = 0; i < numbers.length; i++) {
    const wanted = target - numbers[i];

    // search only to the right so a value never pairs with itself
    let low = i + 1;
    let high = numbers.length - 1;

    while (low <= high) {
      const mid = low + Math.floor((high - low) / 2);

      if (numbers[mid] === wanted) return [i + 1, mid + 1];

      if (numbers[mid] < wanted) low = mid + 1;
      else high = mid - 1;
    }
  }

  return [];
}

// ============================================================
// 5) OPTIMAL - TWO POINTERS CONVERGING (THE ONE TO WRITE)
// ============================================================
/*
- One pointer at each end. Compare the sum with the target and move the
  pointer that can possibly help.
    Time  : O(n)   Space : O(1)
*/
function twoSum(numbers, target) {
  if (numbers.length < 2) return [];

  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];

    // the problem wants 1-based positions
    if (sum === target) return [left + 1, right + 1];

    if (sum < target) {
      // too small, and numbers[right] is already the largest partner
      // available, so numbers[left] can never work - discard it
      left++;
    } else {
      // too big, and numbers[left] is the smallest partner available
      right--;
    }
  }

  return [];
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(twoSum([2, 7, 11, 15], 9)); // [1,2]
console.log(twoSum([2, 3, 4], 6)); // [1,3]
console.log(twoSum([-1, 0], -1)); // [1,2]   negatives
console.log(twoSum([2, 7, 11, 15], 18)); // [2,3]
console.log(twoSum([1, 2], 99)); // []      no answer
console.log(twoSum([], 0)); // []      empty
console.log(twoSum([5, 5], 10)); // [1,2]   duplicates

console.log(twoSumBrute([2, 7, 11, 15], 18)); // [2,3]
console.log(twoSumBinarySearch([2, 7, 11, 15], 18)); // [2,3]
console.log(twoSumBinarySearch([2, 3, 4], 6)); // [1,3]
console.log(twoSumBinarySearch([5, 5], 10)); // [1,2]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    every pair       O(n^2) time, O(1) space
    binary search    O(n log n) time, O(1) space
    two pointers     O(n) time, O(1) space
- WHY TWO POINTERS IS CORRECT, NOT JUST FAST:
    when the sum is too small, numbers[right] is the biggest partner
    numbers[left] will ever see. If even that falls short, no remaining
    pair using left can reach the target, so discarding left loses nothing.
    The mirror argument covers the too-big case. Each step eliminates a
    whole row or column of the pair table, not one cell.
- WHY NOT THE HASH MAP FROM LC 1:
    it works, but it is O(n) space and this problem explicitly asks for
    O(1). Using the sortedness is the entire point of the question.
- THE REAL TRAP:
    1-based indices. Returning [left, right] instead of [left+1, right+1]
    is the single most common wrong answer here.
- FOLLOW-UPS:
    Two Sum (LC 1, unsorted so a hash map wins),
    3Sum (LC 15, fix one value then run this exact loop),
    4Sum (LC 18), Container With Most Water (LC 11, the same converging
    pointers with a different move rule).
*/

/*
Two Sum (LC 1)

Given nums and a target, return the two INDICES whose values add to target.
Exactly one answer exists. I cannot use the same index twice.

  nums = [2,7,11,15], target = 9  -> [0,1]   (2 + 7 = 9)
  nums = [3,2,4],      target = 6  -> [1,2]   (2 + 4 = 6, not 3+3)
  nums = [3,3],        target = 6  -> [0,1]
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- For each number x, the partner I need is fixed: complement = target - x.
- So the real question is only "have I already seen complement?".
- "Have I seen it?" is a Map/Set question, and a Map answers it in O(1).

- The ladder:
    1. try every pair                        O(n^2) time, O(1) space
    2. sort + two pointers                   O(n log n), but sorting LOSES
       the original indices, so I must carry them
    3. one pass, Map of value -> index        O(n) time, O(n) space

- Traps:
    - duplicates: [3,3] must still work, so I store the index of the FIRST 3
      and find it when I stand on the second 3.
    - I must check the map BEFORE inserting the current number, otherwise
      x pairs with itself when target = 2*x.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
BRUTE view, nums = [2,7,11,15], target = 9

  i=0 (2)  j=1 (7)   2 + 7 = 9  == 9  -> return [0,1]

ONE PASS MAP view, nums = [3,2,4], target = 6

  seen = {}                      (value -> index)

  i=0  x=3   complement = 6 - 3 = 3
             seen has 3? no
             seen = { 3:0 }
  i=1  x=2   complement = 6 - 2 = 4
             seen has 4? no
             seen = { 3:0, 2:1 }
  i=2  x=4   complement = 6 - 4 = 2
             seen has 2? YES at index 1
             return [1, 2]
                    ^     ^
                    old   current

  INVARIANT: seen always holds every index STRICTLY LEFT of i.
  That is why an index can never pair with itself.

DUPLICATE case, nums = [3,3], target = 6

  i=0  x=3   complement = 3, seen has 3? no    seen = { 3:0 }
  i=1  x=3   complement = 3, seen has 3? YES at 0
             return [0, 1]        the map kept the LEFT 3, so this is legal
*/

// ============================================================
// 3) BRUTE FORCE - CHECK EVERY PAIR
// ============================================================
/*
- Fix i, then walk every j to its right and test the sum.
    Time  : O(n^2)   Space : O(1)
- Totally fine to say this out loud first, then improve it.
*/
function twoSumBrute(nums, target) {
  if (nums.length < 2) return [];

  for (let i = 0; i < nums.length; i++) {
    // j starts at i+1 so a number never pairs with itself
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) return [i, j];
    }
  }

  return [];
}

// ============================================================
// 4) BETTER - SORT A COPY, THEN TWO POINTERS
// ============================================================
/*
- Sorting lets me shrink the search from both ends, but it destroys the
  original indices, so I sort (value, index) pairs instead.
    Time  : O(n log n)   Space : O(n)
- Slower than the Map, but this is the version that survives when the
  interviewer says "no extra hash map".
*/
function twoSumSorted(nums, target) {
  if (nums.length < 2) return [];

  // keep the original position next to each value
  const pairs = [];
  for (let i = 0; i < nums.length; i++) pairs.push([nums[i], i]);
  pairs.sort((a, b) => a[0] - b[0]);

  let left = 0;
  let right = pairs.length - 1;

  while (left < right) {
    const sum = pairs[left][0] + pairs[right][0];

    if (sum === target) return [pairs[left][1], pairs[right][1]];

    if (sum < target) {
      // too small - only a bigger left value can help
      left++;
    } else {
      // too big - shrink from the right
      right--;
    }
  }

  return [];
}

// ============================================================
// 5) OPTIMAL - ONE PASS HASH MAP (THE ONE TO WRITE)
// ============================================================
/*
- Walk once. For each x ask the map for target - x.
- Check first, insert after: that keeps the map holding only earlier indices.
    Time  : O(n)   Space : O(n)
*/
function twoSum(nums, target) {
  if (nums.length < 2) return [];

  // value -> the index where that value was last seen
  const seen = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    // the partner already passed by, so the pair is complete
    if (seen.has(complement)) return [seen.get(complement), i];

    // only now record myself, so I can never match myself
    seen.set(nums[i], i);
  }

  return [];
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(twoSum([2, 7, 11, 15], 9)); // [0,1]
console.log(twoSum([3, 2, 4], 6)); // [1,2]
console.log(twoSum([3, 3], 6)); // [0,1]   duplicate case
console.log(twoSum([], 0)); // []       empty
console.log(twoSum([1], 1)); // []       too short

console.log(twoSumBrute([3, 2, 4], 6)); // [1,2]
console.log(twoSumSorted([3, 2, 4], 6)); // [1,2]
console.log(twoSumSorted([3, 3], 6)); // [0,1]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    every pair      O(n^2) time, O(1) space
    sort + pointers O(n log n) time, O(n) space
    one pass map    O(n) time, O(n) space
- WHY THE MAP IS ALLOWED:
    the pair is unordered, so seeing either half is enough. I trade O(n)
    space for O(1) lookup - the classic space-for-time swap.
- THE REAL TRAP:
    inserting before checking. Then target = 2*x makes x match itself and
    I return [i, i]. Check first, insert after.
- WHY NOT TWO POINTERS BY DEFAULT:
    two pointers needs sorted input, and sorting throws away the indices
    the question actually asks for.
- FOLLOW-UPS:
    Two Sum II - sorted input (LC 167, pure two pointers, no map),
    3Sum (LC 15, sort then two pointers inside a loop),
    4Sum (LC 18), Two Sum III design (LC 170).
*/

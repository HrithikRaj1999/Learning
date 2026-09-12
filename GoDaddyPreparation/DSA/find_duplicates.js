/*
Find Duplicate Elements in an Array   [Q2.7.1]

They explicitly want BRUTE FORCE FIRST, then the optimal.

  [1,2,3,2,4,1] -> [1,2]   (values that appear more than once)

Then the famous variants:
  LC 217 - does ANY duplicate exist?          (boolean)
  LC 287 - exactly one duplicate, values 1..n, O(1) space, no
           modifying the array                (Floyd's cycle)
  LC 442 - values 1..n, find ALL duplicates in O(1) extra space
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- BRUTE: compare every pair. O(n^2), no extra memory. Say it,
  give the complexity, then improve. Do not skip this step - the
  question is literally testing the progression.

- SORT: equal values become neighbours, so one pass finds them.
  O(n log n) time, O(1) extra if sorting in place - but it
  destroys the original order.

- HASH SET: remember what I have already seen. First time -> add.
  Second time -> it is a duplicate. O(n) time, O(n) space.
  This is the normal answer.

- SPECIAL CASE, values are 1..n: then value v belongs at index
  v-1, so the ARRAY ITSELF can be the hash table.
      negative marking : flip the sign at index v-1; already
                         negative means v was seen before
      cycle detection  : treat i -> nums[i] as a linked list;
                         a repeated value creates a cycle, so
                         Floyd's tortoise and hare finds it in
                         O(n) time and O(1) space WITHOUT writing.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
HASH SET, nums = [1,2,3,2,4,1]

  value  seen set        duplicate?
   1     {}          ->  no, add 1      {1}
   2     {1}         ->  no, add 2      {1,2}
   3     {1,2}       ->  no, add 3      {1,2,3}
   2     {1,2,3}     ->  YES            output [2]
   4                 ->  no, add 4
   1     has 1       ->  YES            output [2,1]

  (use a second set for the output, otherwise a value appearing
   three times is reported twice)

NEGATIVE MARKING, nums = [4,3,2,7,8,2,3,1]  (values 1..n)

  index  0  1  2  3  4  5  6  7
  value  4  3  2  7  8  2  3  1

  see 4 -> mark index 3:  [4,3,2,-7,8,2,3,1]
  see 3 -> mark index 2:  [4,3,-2,-7,8,2,3,1]
  see 2 -> mark index 1:  [4,-3,-2,-7,8,2,3,1]
  see 7 -> mark index 6:  [4,-3,-2,-7,8,2,-3,1]
  see 8 -> mark index 7:  [4,-3,-2,-7,8,2,-3,-1]
  see 2 -> index 1 is ALREADY negative -> 2 is a duplicate
  see 3 -> index 2 is ALREADY negative -> 3 is a duplicate
  see 1 -> mark index 0

  duplicates [2,3], no extra memory used

FLOYD, nums = [1,3,4,2,2]  (exactly one duplicate)
  follow i -> nums[i]:  0 -> 1 -> 3 -> 2 -> 4 -> 2 -> 4 ...
  the sequence cycles, and the entry point of the cycle IS the
  duplicated value (2).
*/

// ============================================================
// 3) BRUTE FORCE - COMPARE EVERY PAIR
// ============================================================
/*
    Time  : O(n^2)   Space : O(1) beyond the output.
*/
function findDuplicatesBrute(nums) {
  const duplicates = [];

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] !== nums[j]) continue;

      // found a twin - only report the value once
      if (!duplicates.includes(nums[i])) duplicates.push(nums[i]);
      break;
    }
  }

  return duplicates;
}

// ============================================================
// 4) BETTER - SORT, THEN LOOK AT NEIGHBOURS
// ============================================================
/*
    Time  : O(n log n)   Space : O(n) for the copy (O(1) if I am
    allowed to sort the input in place).
- Also destroys the original order - mention that trade-off.
*/
function findDuplicatesSort(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const duplicates = [];

  for (let i = 1; i < sorted.length; i++) {
    // equal to my left neighbour, and not already recorded
    if (sorted[i] === sorted[i - 1]) {
      if (duplicates[duplicates.length - 1] !== sorted[i]) {
        duplicates.push(sorted[i]);
      }
    }
  }

  return duplicates;
}

// ============================================================
// 5) OPTIMAL GENERAL CASE - HASH SET, ONE PASS
// ============================================================
/*
    Time  : O(n)   Space : O(n)
- Works for any values: negatives, strings, huge numbers.
*/
function findDuplicates(nums) {
  const seen = new Set();
  const reported = new Set();
  const duplicates = [];

  for (const num of nums) {
    if (!seen.has(num)) {
      seen.add(num);
      continue;
    }

    // second (or later) sighting - report it exactly once
    if (!reported.has(num)) {
      reported.add(num);
      duplicates.push(num);
    }
  }

  return duplicates;
}

/*
- LC 217 flavour: only "does a duplicate exist".
*/
function containsDuplicate(nums) {
  const seen = new Set();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}

// ============================================================
// 6) O(1) SPACE - NEGATIVE MARKING (VALUES 1..n ONLY, LC 442)
// ============================================================
/*
- Value v marks index v-1 by making it negative. A value whose
  slot is already negative has been seen before.
- Uses the sign bit as a free boolean. The array is modified,
  but it can be restored by taking absolute values afterwards.
    Time  : O(n)   Space : O(1)
*/
function findDuplicatesInPlace(nums) {
  const arr = [...nums];
  const duplicates = [];

  for (let i = 0; i < arr.length; i++) {
    // the sign is a marker, so always read the real value
    const value = Math.abs(arr[i]);
    const slot = value - 1;

    if (arr[slot] < 0) {
      // this slot was already marked -> value seen before
      duplicates.push(value);
    } else {
      arr[slot] = -arr[slot];
    }
  }

  return duplicates;
}

// ============================================================
// 7) O(1) SPACE, NO WRITING - FLOYD'S CYCLE (LC 287)
// ============================================================
/*
- Only for: n+1 numbers, each in 1..n, exactly one repeated value.
- Treat index -> value as a linked list. The repeat makes a cycle,
  and the cycle entrance is the duplicate.
    Time  : O(n)   Space : O(1), input untouched.
*/
function findTheDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];

  // phase 1 - find any point inside the cycle
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // phase 2 - walk one pointer from the start; they meet at the
  // entrance of the cycle, which is the duplicated value
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }

  return slow;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(findDuplicates([1, 2, 3, 2, 4, 1])); // [2,1]
console.log(findDuplicates([1, 1, 1])); // [1]
console.log(findDuplicates([1, 2, 3])); // []
console.log(findDuplicates([])); // []
console.log(findDuplicatesBrute([1, 2, 3, 2, 4, 1])); // [1,2]
console.log(findDuplicatesSort([1, 2, 3, 2, 4, 1])); // [1,2]

console.log(containsDuplicate([1, 2, 3, 1])); // true
console.log(containsDuplicate([1, 2, 3])); // false

console.log(findDuplicatesInPlace([4, 3, 2, 7, 8, 2, 3, 1])); // [2,3]
console.log(findTheDuplicate([1, 3, 4, 2, 2])); // 2
console.log(findTheDuplicate([3, 1, 3, 4, 2])); // 3

/*
============================================================
8) SAY OUT LOUD
============================================================
- THE LADDER (this is what is being graded):
    brute pairs   O(n^2) time, O(1) space
    sort          O(n log n) time, O(1) extra, order destroyed
    hash set      O(n) time, O(n) space      <- normal answer
    marking       O(n) time, O(1) space, only when values are 1..n
                  and writing is allowed
    Floyd cycle   O(n) time, O(1) space, no writes, but only for
                  the "exactly one duplicate in 1..n" version
- QUESTIONS I ASK FIRST:
    Can I modify the array? What is the value range? Do you want
    every duplicate, or just whether one exists, or the value?
    Each answer unlocks a different technique - that is the point
    of the question.
- WHY MARKING NEEDS values in 1..n:
    Index v-1 must exist. A 0 or a negative input value breaks it,
    and so does any value bigger than n.
- REPEATED REPORTING: a value appearing three times must not be
  printed twice - that is why there is a second "reported" set.
- FOLLOW-UPS:
    Missing number (LC 268), find all numbers disappeared
    (LC 448 - same marking trick), single number (LC 136, XOR),
    first missing positive (LC 41 - index-as-hash again).
*/

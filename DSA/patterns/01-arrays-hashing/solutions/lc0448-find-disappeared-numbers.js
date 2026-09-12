/*
Find All Numbers Disappeared in an Array (LC 448)

nums has n values, each between 1 and n. Some appear twice, some never.
Return every value in 1..n that is missing.

  [4,3,2,7,8,2,3,1] -> [5,6]   (n = 8; 5 and 6 never appear)
  [1,1]             -> [2]
  [1,2,3]           -> []      (nothing missing)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- The values are 1..n and the array has n slots. That is not a coincidence:
  the array can be its own hash table. Value v belongs at index v-1.
- So I can record "v was seen" by damaging slot v-1 in a reversible way.
  Negating it is perfect: the sign is a flag, the magnitude keeps the value.
- After marking, any slot still POSITIVE was never visited, so index + 1
  is a missing number.

- The ladder:
    1. for each candidate 1..n, scan the array   O(n^2) time, O(1) space
    2. Set of everything present, then check      O(n) time, O(n) space
       1..n
    3. index marking by negation                  O(n) time, O(1) extra

- Traps:
    - always read nums[i] through Math.abs, because an earlier step may
      already have flipped its sign.
    - do not negate twice; check the sign first, or a duplicate un-marks it.
    - the output array does not count towards the space bound - say so.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
INDEX MARKING view, nums = [4,3,2,7,8,2,3,1],  n = 8

  index   0   1   2   3   4   5   6   7
  value   4   3   2   7   8   2   3   1

  PASS 1 - mark index (|value| - 1) negative

  i=0  |4| -> slot 3   nums[3] = 7  -> -7
       [4, 3, 2, -7, 8, 2, 3, 1]
  i=1  |3| -> slot 2   nums[2] = 2  -> -2
       [4, 3, -2, -7, 8, 2, 3, 1]
  i=2  |-2| = 2 -> slot 1   nums[1] = 3 -> -3      <- abs matters here
       [4, -3, -2, -7, 8, 2, 3, 1]
  i=3  |-7| = 7 -> slot 6   nums[6] = 3 -> -3
       [4, -3, -2, -7, 8, 2, -3, 1]
  i=4  |8| -> slot 7   nums[7] = 1 -> -1
       [4, -3, -2, -7, 8, 2, -3, -1]
  i=5  |2| -> slot 1   nums[1] = -3, already negative -> leave it
       [4, -3, -2, -7, 8, 2, -3, -1]
  i=6  |-3| = 3 -> slot 2   already negative -> leave it
  i=7  |-1| = 1 -> slot 0   nums[0] = 4 -> -4
       [-4, -3, -2, -7, 8, 2, -3, -1]

  PASS 2 - a positive slot was never marked

  index   0    1    2    3    4    5    6    7
  value  -4   -3   -2   -7    8    2   -3   -1
                             ^    ^
                             |    index 5 positive -> 5 + 1 = 6 missing
                             index 4 positive -> 4 + 1 = 5 missing

  answer [5,6]

  INVARIANT: sign of nums[i] answers "did the value i+1 appear anywhere?".
  Magnitude is untouched, so the original data is still readable via abs.

SMALL CASE, nums = [1,1],  n = 2
  i=0  |1| -> slot 0   nums[0] = 1 -> -1     [-1, 1]
  i=1  |-1| = 1 -> slot 0   already negative -> leave  [-1, 1]
  pass 2: index 1 is positive -> 1 + 1 = 2 missing   answer [2]
*/

// ============================================================
// 3) BRUTE FORCE - SEARCH FOR EVERY CANDIDATE
// ============================================================
/*
- For each v in 1..n, scan the array looking for it.
    Time  : O(n^2)   Space : O(1) extra
- Fine to say, then point out the repeated scanning is the waste.
*/
function findDisappearedNumbersBrute(nums) {
  if (nums.length === 0) return [];

  const missing = [];

  for (let value = 1; value <= nums.length; value++) {
    let found = false;

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] === value) {
        found = true;
        break;
      }
    }

    if (!found) missing.push(value);
  }

  return missing;
}

// ============================================================
// 4) BETTER - SET OF EVERYTHING PRESENT
// ============================================================
/*
- One pass builds the Set, one pass over 1..n reads the answer off it.
    Time  : O(n)   Space : O(n)
- This is the honest O(n) answer before the O(1) space follow-up lands.
*/
function findDisappearedNumbersSet(nums) {
  if (nums.length === 0) return [];

  const present = new Set(nums);
  const missing = [];

  for (let value = 1; value <= nums.length; value++) {
    if (!present.has(value)) missing.push(value);
  }

  return missing;
}

// ============================================================
// 5) OPTIMAL - INDEX MARKING BY NEGATION (THE ONE TO WRITE)
// ============================================================
/*
- Use the array itself as the hash table. Sign = "seen", magnitude = value.
    Time  : O(n)   Space : O(1) extra (the output list is not counted)
- Note this MUTATES the input; a restore pass can undo it if required.
*/
function findDisappearedNumbers(nums) {
  if (nums.length === 0) return [];

  // pass 1: for every value v, flag the slot that v owns
  for (let i = 0; i < nums.length; i++) {
    // abs because this slot may already have been flipped by an earlier step
    const slot = Math.abs(nums[i]) - 1;

    // flip once only, so a duplicate cannot un-mark it
    if (nums[slot] > 0) nums[slot] = -nums[slot];
  }

  // pass 2: a slot still positive was never claimed by any value
  const missing = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) missing.push(i + 1);
  }

  return missing;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(findDisappearedNumbers([4, 3, 2, 7, 8, 2, 3, 1])); // [5,6]
console.log(findDisappearedNumbers([1, 1])); // [2]
console.log(findDisappearedNumbers([1, 2, 3])); // []
console.log(findDisappearedNumbers([])); // []   empty
console.log(findDisappearedNumbers([2, 2])); // [1]

console.log(findDisappearedNumbersBrute([4, 3, 2, 7, 8, 2, 3, 1])); // [5,6]
console.log(findDisappearedNumbersSet([1, 1])); // [2]
console.log(findDisappearedNumbersSet([4, 3, 2, 7, 8, 2, 3, 1])); // [5,6]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    scan per candidate  O(n^2) time, O(1) space
    presence set        O(n) time, O(n) space
    index marking       O(n) time, O(1) extra space
- WHY INDEX MARKING IS ALLOWED:
    the values are exactly 1..n and there are exactly n slots, so value v
    has a private home at index v-1. That bijection turns the array into a
    zero-cost hash table.
- WHY NEGATION AND NOT DELETION:
    negation is reversible - the sign carries one bit of new information
    while the magnitude preserves the original value, so pass 2 can still
    read the data.
- THE REAL TRAP:
    forgetting Math.abs when reading nums[i]. Once signs start flipping,
    the raw value is unusable as an index.
- WHAT I WOULD ASK:
    "may I mutate the input?" If not, the Set version at O(n) space is the
    honest answer, or I restore the signs in a third pass.
- FOLLOW-UPS:
    Find All Duplicates in an Array (LC 442, same trick, collect the ones
    already negative), First Missing Positive (LC 41, cyclic sort),
    Find the Duplicate Number (LC 287, Floyd cycle detection).
*/

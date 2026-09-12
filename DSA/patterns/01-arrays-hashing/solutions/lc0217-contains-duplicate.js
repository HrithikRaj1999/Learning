/*
Contains Duplicate (LC 217)

Return true if ANY value shows up more than once in nums.

  [1,2,3,1]         -> true   (1 appears twice)
  [1,2,3,4]         -> false  (all different)
  [1,1,1,3,3,4,3,2] -> true
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- I do not need counts. I only need "did I meet this number before?".
- A Set answers exactly that in O(1), so one pass is enough.
- The moment a number is already in the Set I can stop - no need to
  finish the array.

- The ladder:
    1. compare every pair                    O(n^2) time, O(1) space
    2. sort, then look at neighbours         O(n log n) time, O(1) extra
    3. Set, stop on first repeat             O(n) time, O(n) space

- Traps:
    - empty array and single element are both false.
    - sorting mutates the caller's array unless I copy it.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SET view, nums = [1,2,3,1]

  seen = {}

  i=0  x=1   seen has 1? no    seen = {1}
  i=1  x=2   seen has 2? no    seen = {1,2}
  i=2  x=3   seen has 3? no    seen = {1,2,3}
  i=3  x=1   seen has 1? YES -> return true
             ^
             this 1 was added at i=0

  INVARIANT: seen holds exactly the values at indices 0..i-1.

SORT view, nums = [1,2,3,1] -> sorted [1,1,2,3]

  index   0  1  2  3
  value   1  1  2  3
          ^--^
          equal neighbours -> true

  Duplicates can only hide next to each other once sorted. That is the
  whole reason neighbour-checking is enough.

FALSE case, nums = [1,2,3,4] -> sorted [1,2,3,4]
          1!=2, 2!=3, 3!=4 -> false
*/

// ============================================================
// 3) BRUTE FORCE - COMPARE EVERY PAIR
// ============================================================
/*
- Test nums[i] against every nums[j] to its right.
    Time  : O(n^2)   Space : O(1)
- Fine as a first sentence, then improve.
*/
function containsDuplicateBrute(nums) {
  if (nums.length < 2) return false;

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] === nums[j]) return true;
    }
  }

  return false;
}

// ============================================================
// 4) BETTER - SORT AND CHECK NEIGHBOURS
// ============================================================
/*
- After sorting, equal values are guaranteed to sit side by side.
    Time  : O(n log n)   Space : O(n) for the copy, O(1) if allowed in place
- This is the answer when the interviewer bans extra hash structures.
*/
function containsDuplicateSorted(nums) {
  if (nums.length < 2) return false;

  // copy so the caller's array is not reordered
  const sorted = nums.slice().sort((a, b) => a - b);

  for (let i = 1; i < sorted.length; i++) {
    // equal neighbours is the only shape a duplicate can take now
    if (sorted[i] === sorted[i - 1]) return true;
  }

  return false;
}

// ============================================================
// 5) OPTIMAL - SET, STOP ON FIRST REPEAT (THE ONE TO WRITE)
// ============================================================
/*
- One pass, O(1) membership test, early exit.
    Time  : O(n)   Space : O(n)
*/
function containsDuplicate(nums) {
  if (nums.length < 2) return false;

  // every value I have already walked past
  const seen = new Set();

  for (let i = 0; i < nums.length; i++) {
    // met before -> answer is settled, no need to scan the rest
    if (seen.has(nums[i])) return true;
    seen.add(nums[i]);
  }

  return false;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(containsDuplicate([1, 2, 3, 1])); // true
console.log(containsDuplicate([1, 2, 3, 4])); // false
console.log(containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2])); // true
console.log(containsDuplicate([])); // false   empty
console.log(containsDuplicate([7])); // false   single

console.log(containsDuplicateBrute([1, 2, 3, 1])); // true
console.log(containsDuplicateSorted([1, 2, 3, 4])); // false
console.log(containsDuplicateSorted([1, 2, 3, 1])); // true

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    every pair   O(n^2) time, O(1) space
    sort         O(n log n) time, O(1) extra if sorting in place
    set          O(n) time, O(n) space
- WHY THE SET IS ALLOWED:
    the question is pure membership, not position or count, so a Set is
    the smallest structure that answers it.
- WHY SORTING WORKS:
    sorting makes equality LOCAL - two equal values must become neighbours,
    so one neighbour sweep is complete proof.
- THE REAL TRAP:
    the space question. If memory is tight, sorting in place is O(1) extra
    and only costs a log factor - say that trade-off out loud.
- FOLLOW-UPS:
    Contains Duplicate II (LC 219, duplicate within distance k - sliding
    window Set), Contains Duplicate III (LC 220, bucketing),
    Valid Anagram (LC 242, counts instead of membership).
*/

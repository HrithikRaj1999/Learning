/*
Majority Element (LC 169)

One value appears MORE than n/2 times. Return it. It is guaranteed
to exist.

  [3,2,3]           -> 3   (3 appears 2 times, n/2 = 1.5)
  [2,2,1,1,1,2,2]   -> 2   (4 times out of 7)
  [1]               -> 1
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- "More than half" is a very strong promise. Two things fall out of it:
    a) after sorting, the middle slot MUST be the majority - a block
       longer than half the array always covers the centre.
    b) if I pair up every majority element with a different element and
       throw both away, I run out of "different" elements first. Whatever
       survives is the majority. That is Boyer-Moore voting.

- The ladder:
    1. count each value with a Map, take the max    O(n) time, O(n) space
    2. sort and return the middle                   O(n log n), O(1) extra
    3. Boyer-Moore vote                             O(n) time, O(1) space

- Traps:
    - Boyer-Moore is only valid because a majority is GUARANTEED. Without
      that promise the candidate must be verified in a second pass.
    - a tie (exactly n/2) is not a majority - the problem says strictly more.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
BOYER-MOORE view, nums = [2,2,1,1,1,2,2]

  candidate = none, count = 0

  x=2  count 0 -> adopt 2      candidate 2, count = 0 + 1 = 1
  x=2  same as candidate       count = 1 + 1 = 2
  x=1  different               count = 2 - 1 = 1
  x=1  different               count = 1 - 1 = 0
  x=1  count 0 -> adopt 1      candidate 1, count = 0 + 1 = 1
  x=2  different               count = 1 - 1 = 0
  x=2  count 0 -> adopt 2      candidate 2, count = 0 + 1 = 1

  answer 2   (correct: 2 appears 4 times out of 7)

  INVARIANT: count is "how many unmatched copies of candidate I hold".
  Every -1 cancels one candidate against one non-candidate. The majority
  has more copies than everything else combined, so it cannot be wiped out.

  cancellations:  (2,1) (2,1) (1,2)   leftover: 2   <- survivor

SORT view, nums = [2,2,1,1,1,2,2] -> sorted [1,1,1,2,2,2,2]

  index   0  1  2  3  4  5  6
  value   1  1  1  2  2  2  2
                    ^
                    middle = index floor(7/2) = 3 -> 2

  The 2-block has length 4 > 7/2 = 3.5, so it must straddle index 3.
*/

// ============================================================
// 3) BRUTE FORCE - COUNT WITH A MAP
// ============================================================
/*
- Count every value, then take the one whose count passes n/2.
    Time  : O(n)   Space : O(n)
- Fast in time, but the O(n) space is exactly what the follow-up attacks.
*/
function majorityElementCount(nums) {
  if (nums.length === 0) return -1;

  // value -> how many times it appeared
  const counts = new Map();
  const threshold = nums.length / 2;

  for (let i = 0; i < nums.length; i++) {
    const next = (counts.get(nums[i]) || 0) + 1;
    counts.set(nums[i], next);

    // strictly more than half - answer is settled the moment it happens
    if (next > threshold) return nums[i];
  }

  return -1;
}

// ============================================================
// 4) BETTER - SORT AND TAKE THE MIDDLE
// ============================================================
/*
- A block longer than half the array always covers the centre index.
    Time  : O(n log n)   Space : O(n) for the copy (O(1) if sorting in place)
- One line of real logic, and easy to justify with the picture above.
*/
function majorityElementSorted(nums) {
  if (nums.length === 0) return -1;

  const sorted = nums.slice().sort((a, b) => a - b);

  // the majority block is wider than half, so it owns the middle slot
  return sorted[Math.floor(sorted.length / 2)];
}

// ============================================================
// 5) OPTIMAL - BOYER-MOORE VOTING (THE ONE TO WRITE)
// ============================================================
/*
- Hold one candidate and a running count. Same value votes up, any other
  value votes down. On zero, adopt the current value as the new candidate.
    Time  : O(n)   Space : O(1)
*/
function majorityElement(nums) {
  if (nums.length === 0) return -1;

  let candidate = nums[0];
  let count = 0;

  for (let i = 0; i < nums.length; i++) {
    if (count === 0) {
      // everything so far cancelled out - start fresh here
      candidate = nums[i];
      count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      // cancel one candidate against this different value
      count--;
    }
  }

  return candidate;
}

// ============================================================
// 6) FOLLOW-UP - VERIFY WHEN A MAJORITY IS NOT GUARANTEED
// ============================================================
/*
- Boyer-Moore always returns something. If the promise is removed, that
  something can be wrong, so I recount it once.
    Time  : O(n)   Space : O(1)
*/
function majorityElementOrNull(nums) {
  if (nums.length === 0) return null;

  const candidate = majorityElement(nums);

  // second pass proves the candidate really passes n/2
  let occurrences = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === candidate) occurrences++;
  }

  return occurrences > nums.length / 2 ? candidate : null;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(majorityElement([3, 2, 3])); // 3
console.log(majorityElement([2, 2, 1, 1, 1, 2, 2])); // 2
console.log(majorityElement([1])); // 1       single
console.log(majorityElement([])); // -1      empty

console.log(majorityElementCount([2, 2, 1, 1, 1, 2, 2])); // 2
console.log(majorityElementSorted([3, 2, 3])); // 3
console.log(majorityElementSorted([2, 2, 1, 1, 1, 2, 2])); // 2
console.log(majorityElementOrNull([1, 2, 3, 4])); // null    no majority
console.log(majorityElementOrNull([3, 2, 3])); // 3

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    hash counts   O(n) time, O(n) space
    sort          O(n log n) time, O(1) extra in place
    Boyer-Moore   O(n) time, O(1) space
- WHY BOYER-MOORE IS ALLOWED:
    each count-- deletes one majority element AND one non-majority element.
    The majority has strictly more than half, so it outnumbers everything
    else combined and cannot be fully cancelled. The survivor is it.
- THE REAL TRAP:
    the guarantee. Drop "a majority always exists" and the algorithm still
    returns a value, just a wrong one. Always mention the verify pass.
- WHY THE MIDDLE ELEMENT WORKS:
    a run longer than n/2 cannot fit entirely on either side of the centre,
    so it must contain index floor(n/2).
- FOLLOW-UPS:
    Majority Element II (LC 229, > n/3 - keep TWO candidates and verify),
    generalised to n/k with k-1 candidates,
    Find the Duplicate Number (LC 287, another O(1) space trick).
*/

/*
Product of Array Except Self (LC 238)

answer[i] = product of every number EXCEPT nums[i].
No division allowed. Must run in O(n).

  [1,2,3,4]    -> [24,12,8,6]     (24 = 2*3*4, 12 = 1*3*4, ...)
  [-1,1,0,-3,3]-> [0,0,9,0,0]     (zeros make most slots 0)
  [2,3]        -> [3,2]
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Everything except me = (everything to my LEFT) x (everything to my RIGHT).
- Both of those are running products, so each one is a single sweep.
- Division would be one line, but a single zero destroys it, and two zeros
  destroy it worse. That is exactly why the problem bans it.
- The space trick: write the left products straight into the answer array,
  then multiply the right products in on the way back. One extra variable.

- The ladder:
    1. for each i, multiply the other n-1 values   O(n^2) time, O(1) extra
    2. left[] and right[] arrays, then combine     O(n) time, O(n) space
    3. answer holds left, sweep back with a        O(n) time, O(1) extra
       running right variable

- Traps:
    - zeros. This is why division is banned; my approach never divides so
      zeros need no special case at all.
    - left[0] = 1 and right[n-1] = 1 - "product of nothing" is 1, not 0.
    - overflow in Java/C++ - products of 32-bit ints need long.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
TWO ARRAY view, nums = [1,2,3,4]

  index        0     1     2     3
  nums         1     2     3     4

  left[i] = product of everything strictly left of i
  left[0] = 1                 (nothing to the left)
  left[1] = left[0] * nums[0] = 1 * 1 = 1
  left[2] = left[1] * nums[1] = 1 * 2 = 2
  left[3] = left[2] * nums[2] = 2 * 3 = 6
  left        1     1     2     6

  right[i] = product of everything strictly right of i
  right[3] = 1                (nothing to the right)
  right[2] = right[3] * nums[3] = 1 * 4 = 4
  right[1] = right[2] * nums[2] = 4 * 3 = 12
  right[0] = right[1] * nums[1] = 12 * 2 = 24
  right      24    12     4     1

  answer[i] = left[i] * right[i]
  answer     1*24  1*12  2*4   6*1
           =  24    12    8     6

O(1) SPACE view, same input. Pass 1 fills answer with left products:

  answer      1     1     2     6

  Pass 2 walks right to left with one variable rightProduct = 1:

  i=3   answer[3] = 6 * 1 = 6     rightProduct = 1 * nums[3] = 1 * 4 = 4
  i=2   answer[2] = 2 * 4 = 8     rightProduct = 4 * nums[2] = 4 * 3 = 12
  i=1   answer[1] = 1 * 12 = 12   rightProduct = 12 * nums[1] = 12 * 2 = 24
  i=0   answer[0] = 1 * 24 = 24   rightProduct = 24 * nums[0] = 24 * 1 = 24

  answer     24    12     8     6      same result, no right[] array

  INVARIANT: when I stand on i going backwards, rightProduct already holds
  the product of nums[i+1..n-1] and nothing else.

ZERO case, nums = [-1,1,0,-3,3]
  left      1   -1   -1    0    0
  right     0    0   -9    3    1
  answer    0    0    9    0    0     zeros handled with no special code
*/

// ============================================================
// 3) BRUTE FORCE - MULTIPLY THE OTHERS EACH TIME
// ============================================================
/*
- For every i, loop the whole array skipping i.
    Time  : O(n^2)   Space : O(1) extra
- Say it, then immediately say "the repeated work is the prefix product".
*/
function productExceptSelfBrute(nums) {
  if (nums.length === 0) return [];

  const answer = new Array(nums.length).fill(1);

  for (let i = 0; i < nums.length; i++) {
    let product = 1;

    for (let j = 0; j < nums.length; j++) {
      // skip myself - that is the whole point of the question
      if (j !== i) product = product * nums[j];
    }

    answer[i] = product;
  }

  return answer;
}

// ============================================================
// 4) BETTER - EXPLICIT LEFT AND RIGHT ARRAYS
// ============================================================
/*
- One sweep builds every prefix product, one sweep builds every suffix
  product, then multiply them pairwise.
    Time  : O(n)   Space : O(n)
- Write this one first on the whiteboard - it makes the idea undeniable.
*/
function productExceptSelfTwoArrays(nums) {
  if (nums.length === 0) return [];

  const n = nums.length;
  const left = new Array(n).fill(1);
  const right = new Array(n).fill(1);

  // product of nothing is 1, so left[0] stays 1
  for (let i = 1; i < n; i++) left[i] = left[i - 1] * nums[i - 1];

  // same on the other side, right[n-1] stays 1
  for (let i = n - 2; i >= 0; i--) right[i] = right[i + 1] * nums[i + 1];

  const answer = new Array(n).fill(1);
  for (let i = 0; i < n; i++) answer[i] = left[i] * right[i];

  return answer;
}

// ============================================================
// 5) OPTIMAL - PREFIX IN THE ANSWER, SUFFIX IN A VARIABLE
// ============================================================
/*
- The output array does not count as extra space, so I reuse it for the
  left products, then fold the right products in on the return trip.
    Time  : O(n)   Space : O(1) extra
*/
function productExceptSelf(nums) {
  if (nums.length === 0) return [];

  const n = nums.length;
  const answer = new Array(n).fill(1);

  // pass 1: answer[i] = product of everything left of i
  for (let i = 1; i < n; i++) answer[i] = answer[i - 1] * nums[i - 1];

  // pass 2: fold in everything right of i, carried in one variable
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] = answer[i] * rightProduct;
    // only now does nums[i] join the suffix, so it never multiplies itself
    rightProduct = rightProduct * nums[i];
  }

  return answer;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(productExceptSelf([1, 2, 3, 4])); // [24,12,8,6]
console.log(productExceptSelf([-1, 1, 0, -3, 3])); // [0,0,9,0,0]
console.log(productExceptSelf([2, 3])); // [3,2]
console.log(productExceptSelf([])); // []       empty
console.log(productExceptSelf([0, 0])); // [0,0]    two zeros

console.log(productExceptSelfBrute([1, 2, 3, 4])); // [24,12,8,6]
console.log(productExceptSelfTwoArrays([-1, 1, 0, -3, 3])); // [0,0,9,0,0]
console.log(productExceptSelfTwoArrays([1, 2, 3, 4])); // [24,12,8,6]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    multiply others   O(n^2) time, O(1) extra
    left + right      O(n) time, O(n) space
    prefix in output  O(n) time, O(1) extra (output not counted)
- WHY IT SPLITS CLEANLY:
    "all except i" factorises into left-of-i times right-of-i. Both halves
    are prefix products, so each is one linear sweep.
- WHY DIVISION IS BANNED:
    total / nums[i] breaks on a single zero, and gives nonsense with two.
    My version never divides, so zeros need zero special handling - say that.
- THE REAL TRAP:
    the identity element. "Product of nothing" is 1. Seeding left[0] or
    rightProduct with 0 zeroes the entire answer.
- SMALL JS QUIRK:
    node prints -0 when a negative number is multiplied by 0. It compares
    equal to 0, so it is only a printing artefact, not a wrong answer.
- FOLLOW-UPS:
    Subarray Sum Equals K (LC 560, prefix sums instead of products),
    Range Sum Query (LC 303), Maximum Product Subarray (LC 152).
*/

/*
Multiply Strings (LC 43)

Multiply two non-negative numbers given as strings. No BigInt, no
converting the whole thing to a number.

  "2" x "3"      -> "6"
  "123" x "456"  -> "56088"
  "0" x "12345"  -> "0"
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Grade-school long multiplication, but with one very useful observation
  that removes all the shifting and padding:
        digit i of a (from the right) times digit j of b (from the right)
        always lands in result positions i+j and i+j+1
  So I can allocate a result array of length n+m up front and add every
  partial product straight into its home. No intermediate rows at all.
- Positions: i+j+1 takes the ones digit of the product, i+j takes the carry.
- At the end, strip the leading zeros (there is at most one extra).

- The ladder:
    1. parse to Number, multiply, stringify        WRONG past 2^53
    2. BigInt                                      correct, but dodges the
                                                   question
    3. one result array, add each digit product    O(n*m) time, O(n+m) space
       into position i+j / i+j+1

- Traps:
    - "0" x anything is "0"; without a guard the leading-zero strip can
      eat the whole answer and return "".
    - the carry must be ADDED to the existing value at i+j, not assigned -
      several partial products land in the same slot.
    - it is easiest to index from the RIGHT, so I loop i and j downward.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
POSITION RULE, a = "123" (n=3), b = "456" (m=3)
result has n + m = 6 slots

  a index    0    1    2          b index    0    1    2
  a digit    1    2    3          b digit    4    5    6

  result slots:   0    1    2    3    4    5

  Take a[2] = 3 and b[2] = 6.  product = 18
      positions i+j = 4  and  i+j+1 = 5
      result[5] += 18 % 10 = 8
      result[4] += floor(18/10) = 1
      result   [0, 0, 0, 0, 1, 8]

  Take a[2] = 3 and b[1] = 5.  product = 15
      positions i+j = 3 and i+j+1 = 4
      result[4] currently 1, so 1 + 15 = 16
      result[4] = 16 % 10 = 6,  carry 1 into result[3]
      result   [0, 0, 0, 1, 6, 8]
                          ^
                          the carry was ADDED, not overwritten

  Take a[2] = 3 and b[0] = 4.  product = 12
      i+j = 2, i+j+1 = 3.  result[3] = 1 + 12 = 13
      result[3] = 3, carry 1 into result[2]
      result   [0, 0, 1, 3, 6, 8]

  That row finished 3 x 456 = 1368, and it is sitting in slots 2..5.
  Continuing with a[1] = 2 and a[0] = 1 the same way ends at:

      result   [0, 5, 6, 0, 8, 8]

  strip the single leading zero -> "56088"
  check: 123 x 456 = 56088   OK

WHY i+j AND i+j+1:
  a[i] sits at power 10^(n-1-i), b[j] sits at 10^(m-1-j).
  Their product sits at 10^(n+m-2-i-j), which is index i+j+1 in an array of
  length n+m counted from the left. Its carry goes one slot left, i+j.

ZERO case, a = "0", b = "12345"
  every product is 0, so result is all zeros
  stripping leading zeros would leave "" -> the guard returns "0" instead
*/

// ============================================================
// 3) BRUTE FORCE - PARSE TO NUMBER (AND WHY IT IS WRONG)
// ============================================================
/*
- Convert, multiply, convert back.
    Time  : O(n + m)   Space : O(1)
- WRONG for the real constraints: the inputs run to 200 digits, which is
  astronomically past Number.MAX_SAFE_INTEGER. Name it, reject it.
*/
function multiplyUnsafe(num1, num2) {
  return String(Number(num1) * Number(num2));
}

// ============================================================
// 4) BETTER - BIGINT
// ============================================================
/*
- Genuinely correct, and what I would ship in production.
    Time  : O(n * m) inside the BigInt library   Space : O(n + m)
- I would mention it, then write the manual version, because the question
  is testing whether I can do the digit bookkeeping myself.
*/
function multiplyBigInt(num1, num2) {
  return String(BigInt(num1) * BigInt(num2));
}

// ============================================================
// 5) OPTIMAL - ONE RESULT ARRAY, POSITION i+j / i+j+1
// ============================================================
/*
- Every digit pair goes straight to its final home. No partial rows,
  no shifting, no padding with zeros.
    Time  : O(n * m)   Space : O(n + m)
*/
const CODE_ZERO = "0".charCodeAt(0);
const DECIMAL_BASE = 10;

function multiply(num1, num2) {
  // a single zero makes the whole product zero
  if (num1 === "0" || num2 === "0") return "0";

  const n = num1.length;
  const m = num2.length;

  // the product of an n-digit and an m-digit number needs at most n+m digits
  const result = new Array(n + m).fill(0);

  // walk both numbers from their least significant digit
  for (let i = n - 1; i >= 0; i--) {
    const digitA = num1.charCodeAt(i) - CODE_ZERO;

    for (let j = m - 1; j >= 0; j--) {
      const digitB = num2.charCodeAt(j) - CODE_ZERO;

      // add onto whatever earlier products already landed in this slot
      const sum = digitA * digitB + result[i + j + 1];

      result[i + j + 1] = sum % DECIMAL_BASE;
      // the carry ADDS to the slot on the left, it never overwrites it
      result[i + j] = result[i + j] + Math.floor(sum / DECIMAL_BASE);
    }
  }

  // at most one leading zero can survive, but a loop is safest
  let start = 0;
  while (start < result.length - 1 && result[start] === 0) start++;

  return result.slice(start).join("");
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(multiply("2", "3")); // "6"
console.log(multiply("123", "456")); // "56088"
console.log(multiply("0", "12345")); // "0"     zero guard
console.log(multiply("9", "9")); // "81"    carry
console.log(multiply("99", "99")); // "9801"
console.log(multiply("1", "1")); // "1"
console.log(multiply("999999999", "999999999")); // "999999998000000001"

// past Number.MAX_SAFE_INTEGER, where the naive version dies
const bigA = "123456789123456789";
const bigB = "987654321987654321";
console.log(multiply(bigA, bigB) === multiplyBigInt(bigA, bigB)); // true
console.log(multiplyUnsafe(bigA, bigB) === multiply(bigA, bigB)); // false <- bug
console.log(multiply(bigA, bigB)); // 121932631356500531347203169112635269
console.log(multiplyBigInt("123", "456")); // "56088"

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    parse to Number  O(n+m) but INCORRECT past 53 bits
    BigInt           correct, hides the algorithm
    manual           O(n * m) time, O(n + m) space
- THE ONE OBSERVATION THAT MAKES IT EASY:
    a[i] * b[j] always lands at result positions i+j and i+j+1. Knowing
    that, I allocate n+m slots and add every product directly into place -
    no partial rows, no shifting, no zero padding.
- WHY THE CARRY IS ADDED, NOT ASSIGNED:
    many digit pairs share the same target slot, so each one must accumulate
    onto what is already there. Assigning loses previous work - that is the
    most common bug in this problem.
- WHY n + m SLOTS IS ENOUGH:
    an n-digit and an m-digit number multiply to at most n+m digits
    (999 * 99 = 98901, which is 5 = 3 + 2). At most one leading zero, but I
    strip in a loop anyway.
- THE REAL TRAP:
    the "0" guard. Without it, an all-zero result array strips down to the
    empty string.
- FOLLOW-UPS:
    Add Strings (LC 415), Add Binary (LC 67), Plus One (LC 66),
    Pow(x, n) (LC 50, fast exponentiation), and Karatsuba if the
    interviewer pushes on beating O(n*m).
*/

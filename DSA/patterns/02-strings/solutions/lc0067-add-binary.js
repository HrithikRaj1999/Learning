/*
Add Binary (LC 67)

Add two binary strings and return the sum as a binary string.

  a = "11",   b = "1"    -> "100"    (3 + 1 = 4)
  a = "1010", b = "1011" -> "10101"  (10 + 11 = 21)
  a = "0",    b = "0"    -> "0"
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- This is the addition I learned as a child, just in base 2 instead of 10.
  Start at the RIGHT (least significant) end, add the two digits plus the
  carry, write down sum % 2, carry sum / 2.
- The strings can be different lengths, so a missing digit counts as 0
  instead of ending the loop early.
- The loop must also keep going while the carry is still 1, otherwise
  "1" + "1" loses its leading 1 and gives "0" instead of "10".

- The ladder:
    1. parse both to numbers, add, convert back        O(n) but OVERFLOWS
    2. parse with BigInt, add, convert back            O(n), correct but
                                                       dodges the question
    3. digit by digit with a carry, right to left      O(max(n,m)) time,
                                                       O(max(n,m)) output

- Traps:
    - the strings can be 10^4 long, so Number() silently loses precision
      past 2^53. That is exactly why the problem is asked as strings.
    - a final carry must be pushed after the loop.
    - build an array of digits and reverse+join once; += in a loop is slow.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
DIGIT BY DIGIT view, a = "1010", b = "1011"

           1 0 1 0
         + 1 0 1 1
         ---------

  i = 3 (rightmost)   0 + 1 + carry 0 = 1
                      write 1 % 2 = 1,  carry = floor(1/2) = 0
                      digits [1]
  i = 2               1 + 1 + carry 0 = 2
                      write 2 % 2 = 0,  carry = floor(2/2) = 1
                      digits [1,0]
  i = 1               0 + 0 + carry 1 = 1
                      write 1 % 2 = 1,  carry = 0
                      digits [1,0,1]
  i = 0               1 + 1 + carry 0 = 2
                      write 0,          carry = 1
                      digits [1,0,1,0]
  loop ends but carry = 1, so push it
                      digits [1,0,1,0,1]

  reverse -> "10101"          check: 10 + 11 = 21 = 10101 in binary  OK

  INVARIANT: digits holds the answer LEAST significant first, so exactly
  one reverse at the very end puts it right.

DIFFERENT LENGTHS, a = "11", b = "1"

           1 1
         +   1        <- b has nothing at position 0, treat it as 0
         -----

  i(a) = 1, i(b) = 0   1 + 1 + 0 = 2   write 0, carry 1   digits [0]
  i(a) = 0, i(b) = -1  1 + 0 + 1 = 2   write 0, carry 1   digits [0,0]
                          ^
                          b ran out - contributes 0, not "stop"
  both exhausted, carry = 1 -> push    digits [0,0,1]

  reverse -> "100"      check: 3 + 1 = 4 = 100  OK

  The carry push is what turns "00" into "100". Forgetting it is the
  single most common bug in this problem.
*/

// ============================================================
// 3) BRUTE FORCE - PARSE TO NUMBER, ADD, CONVERT BACK
// ============================================================
/*
- Two lines, and it passes the small examples.
    Time  : O(n)   Space : O(n)
- WRONG for real input: binary strings up to 10^4 digits blow far past
  Number.MAX_SAFE_INTEGER, so the result silently becomes garbage. Worth
  saying out loud and then rejecting.
*/
function addBinaryUnsafe(a, b) {
  const sum = parseInt(a, 2) + parseInt(b, 2);
  return sum.toString(2);
}

// ============================================================
// 4) BETTER - BIGINT
// ============================================================
/*
- BigInt has no precision limit, so this is genuinely correct.
    Time  : O(n) (BigInt conversion is linear-ish)   Space : O(n)
- I would mention it as the "in production I would use this" answer, then
  write the manual version because the question is testing carry handling.
*/
function addBinaryBigInt(a, b) {
  const sum = BigInt("0b" + a) + BigInt("0b" + b);
  return sum.toString(2);
}

// ============================================================
// 5) OPTIMAL - DIGIT BY DIGIT WITH A CARRY (THE ONE TO WRITE)
// ============================================================
/*
- Walk both strings from the right, add with a carry, collect digits.
    Time  : O(max(n, m))   Space : O(max(n, m)) for the output
*/
const BINARY_BASE = 2;

function addBinary(a, b) {
  if (a.length === 0) return b;
  if (b.length === 0) return a;

  const digits = [];
  let i = a.length - 1;
  let j = b.length - 1;
  let carry = 0;

  // keep going while either string has digits OR a carry is still pending
  while (i >= 0 || j >= 0 || carry > 0) {
    // a string that has run out contributes 0, it does not end the loop
    const digitA = i >= 0 ? a.charCodeAt(i) - 48 : 0;
    const digitB = j >= 0 ? b.charCodeAt(j) - 48 : 0;

    const sum = digitA + digitB + carry;

    digits.push(sum % BINARY_BASE);
    carry = Math.floor(sum / BINARY_BASE);

    i--;
    j--;
  }

  // digits were collected least significant first
  return digits.reverse().join("");
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(addBinary("11", "1")); // "100"
console.log(addBinary("1010", "1011")); // "10101"
console.log(addBinary("0", "0")); // "0"
console.log(addBinary("1", "1")); // "10"    final carry
console.log(addBinary("", "101")); // "101"   empty
console.log(addBinary("1111", "1")); // "10000" carry ripples all the way

// the big input the naive version cannot survive
// bigA is 2^61 + 1, so bigA + 1 must keep the low bits
const bigA = "1" + "0".repeat(60) + "1";
const bigB = "1";
console.log(addBinary(bigA, bigB)); // "1" + 59 zeros + "10"
console.log(addBinary(bigA, bigB) === addBinaryBigInt(bigA, bigB)); // true
console.log(addBinaryUnsafe(bigA, bigB) === addBinary(bigA, bigB)); // false <- the bug
console.log(addBinaryUnsafe(bigA, bigB)); // "1" + 61 zeros, low bits lost

console.log(addBinaryBigInt("1010", "1011")); // "10101"

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    parse to Number   O(n) time but INCORRECT past 53 bits
    BigInt            O(n) time, O(n) space, correct
    manual carry      O(max(n,m)) time, O(max(n,m)) output space
- WHY THE INPUT IS A STRING:
    that is the whole point. Up to 10^4 binary digits is far beyond
    Number.MAX_SAFE_INTEGER, so any parse-and-add answer is silently wrong.
    I would name that before writing code.
- THE LOOP CONDITION IS THE ANSWER:
    "i >= 0 || j >= 0 || carry > 0" handles unequal lengths AND the final
    carry in one expression. Three separate cases collapse into one line.
- THE REAL TRAP:
    dropping the last carry. "1" + "1" gives "0" instead of "10" if the
    loop stops when both strings are exhausted.
- WHY I REVERSE AT THE END:
    digits arrive least significant first. Pushing and reversing once is
    O(n); unshifting each digit to the front would be O(n^2).
- FOLLOW-UPS:
    Add Strings (LC 415, base 10, same skeleton),
    Add Two Numbers (LC 2, the same carry loop over linked lists),
    Plus One (LC 66), Multiply Strings (LC 43).
*/

/*
String to Integer / atoi (LC 8)

Read a number out of the front of a string, following C's atoi rules:
  1. skip leading spaces
  2. optional single '+' or '-'
  3. read digits until a non-digit or the end
  4. ignore everything after
  5. clamp to the 32-bit range [-2147483648, 2147483647]
  6. no digits at all -> 0

  "42"              -> 42
  "   -042"         -> -42
  "1337c0d3"        -> 1337   (stops at 'c')
  "words and 987"   -> 0      (first non-space is a letter)
  "-91283472332"    -> -2147483648  (clamped)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- There is no clever algorithm here. This question is pure EDGE CASE
  discipline, and the interviewer is watching whether I handle the stages
  in the right order and never skip one.
- The four stages are strictly ordered and each is a small loop:
      whitespace -> sign -> digits -> clamp
  A stage that fails means everything after it is skipped.
- The only real thinking is the overflow check. I must detect it BEFORE
  the multiply, not after, because after the multiply the value is already
  wrong in a fixed-width language.

- The ladder:
    1. trust the language: Number(s) or parseInt   WRONG - different rules
    2. state machine, build the number, clamp      O(n) time, O(1) space
       at the end (works in JS, breaks in C++)
    3. state machine, detect overflow BEFORE       O(n) time, O(1) space
       the multiply - portable and exact

- Traps:
    - only ONE sign is allowed. "+-12" is 0, not 12.
    - whitespace is skipped only at the FRONT. " 4 2" is 4, not 42.
    - a lone "+" or "-" with no digits is 0.
    - JavaScript has no int32, so I have to clamp by hand.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
STAGE MACHINE view, s = "   -042abc"

  index    0    1    2    3    4    5    6    7    8    9
  char    ' '  ' '  ' '  '-'  '0'  '4'  '2'  'a'  'b'  'c'

  STAGE 1 skip spaces
      i = 0 space -> i = 1 space -> i = 2 space -> i = 3 ('-') stop
  STAGE 2 sign
      s[3] is '-' -> sign = -1, i = 4
  STAGE 3 digits
      i=4  '0'  value = 0 * 10 + 0 = 0        i = 5
      i=5  '4'  value = 0 * 10 + 4 = 4        i = 6
      i=6  '2'  value = 4 * 10 + 2 = 42       i = 7
      i=7  'a'  not a digit -> STOP reading
  STAGE 4 apply sign and clamp
      -1 * 42 = -42, inside range -> answer -42

  Leading zeros need no special code: 0*10 + 0 is still 0.

CLAMP view, s = "-91283472332",  INT_MIN = -2147483648

  digits build up: 9, 91, 912, ... 9128347233, then the last '2'
  before the final step:   value = 9128347233
  9128347233 already exceeds 2147483648, so with the '-' sign
  the answer is clamped to INT_MIN = -2147483648

  OVERFLOW CHECK BEFORE THE MULTIPLY, using LIMIT = 2147483647:
      value = 214748364, next digit = 8
      is value > floor(LIMIT / 10) = 214748364 ?  no, equal
      is value == 214748364 AND digit > 7 ?  8 > 7  YES -> overflow now
                                          ^
                                          the last digit of INT_MAX
      so I stop and clamp without ever computing the bad value.

REJECT cases:
  "words and 987"   first non-space is 'w', not sign or digit -> 0
  "+-12"            sign '+' consumed, then '-' is not a digit -> 0
  " 4 2"            reads 4, hits a space which is not a digit -> 4
  "-"               sign consumed, no digits follow -> 0

  INVARIANT: `value` always holds the magnitude of the digits read so far,
  and it is guaranteed to be within range because I check before growing.
*/

// ============================================================
// 3) BRUTE FORCE - LET THE LANGUAGE PARSE IT (AND WHY IT IS WRONG)
// ============================================================
/*
- Number(s) or parseInt(s, 10) look like the answer.
    Time  : O(n)   Space : O(1)
- WRONG on several inputs. parseInt is close but does not clamp; Number is
  far off - it rejects trailing junk and accepts "0x1f" and "1e3".
  Naming the exact differences is worth more than the code.
*/
function myAtoiUsingParseInt(s) {
  const parsed = parseInt(s, 10);
  // parseInt gives NaN for no digits and never clamps to 32 bits
  if (Number.isNaN(parsed)) return 0;
  return parsed;
}

// ============================================================
// 4) BETTER - STAGE MACHINE, CLAMP AT THE END
// ============================================================
/*
- Walk the four stages, build the full value, then clamp once.
    Time  : O(n)   Space : O(1)
- Correct in JavaScript because numbers are doubles and hold values far
  past 2^31. It would be WRONG in C++ or Java, where the multiply itself
  overflows and the clamp comes too late.
*/
const INT_MAX = 2147483647;
const INT_MIN = -2147483648;
const CODE_ZERO = "0".charCodeAt(0);

function myAtoiClampLate(s) {
  if (s.length === 0) return 0;

  let i = 0;

  // stage 1: leading whitespace only
  while (i < s.length && s[i] === " ") i++;

  // stage 2: at most one sign
  let sign = 1;
  if (i < s.length && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }

  // stage 3: digits
  let value = 0;
  while (i < s.length && isDigit(s[i])) {
    value = value * 10 + (s.charCodeAt(i) - CODE_ZERO);
    i++;
  }

  // stage 4: sign then clamp
  // guard 0 first, or JavaScript hands back -0 for input like "-"
  if (value === 0) return 0;
  const signed = sign * value;
  if (signed > INT_MAX) return INT_MAX;
  if (signed < INT_MIN) return INT_MIN;
  return signed;
}

function isDigit(ch) {
  const code = ch.charCodeAt(0);
  return code >= 48 && code <= 57;
}

// ============================================================
// 5) OPTIMAL - DETECT OVERFLOW BEFORE THE MULTIPLY
// ============================================================
/*
- Same four stages, but the digit loop refuses to grow past the limit.
    Time  : O(n)   Space : O(1)
- This version is portable: it never computes a value outside int32, so it
  is exactly what I would write in C++ or Java too.
*/
const MAX_DIV_TEN = Math.floor(INT_MAX / 10); // 214748364
const MAX_LAST_DIGIT = INT_MAX % 10; // 7

function myAtoi(s) {
  if (s.length === 0) return 0;

  let i = 0;

  // stage 1: skip leading spaces, and only leading ones
  while (i < s.length && s[i] === " ") i++;

  // stage 2: a single optional sign
  let sign = 1;
  if (i < s.length && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }

  // stage 3: digits, refusing to overflow
  let value = 0;
  while (i < s.length && isDigit(s[i])) {
    const digit = s.charCodeAt(i) - CODE_ZERO;

    // would value * 10 + digit pass INT_MAX? check BEFORE doing it
    const wouldOverflow =
      value > MAX_DIV_TEN || (value === MAX_DIV_TEN && digit > MAX_LAST_DIGIT);

    if (wouldOverflow) return sign === 1 ? INT_MAX : INT_MIN;

    value = value * 10 + digit;
    i++;
  }

  // no digits read leaves value at 0, which is exactly the required answer
  // return plain 0, or JavaScript reports -0 for an input like "-"
  if (value === 0) return 0;

  return sign * value;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(myAtoi("42")); // 42
console.log(myAtoi("   -042")); // -42     spaces + sign + leading zeros
console.log(myAtoi("1337c0d3")); // 1337    stops at a letter
console.log(myAtoi("words and 987")); // 0       never starts
console.log(myAtoi("-91283472332")); // -2147483648  clamped low
console.log(myAtoi("91283472332")); // 2147483647   clamped high
console.log(myAtoi("")); // 0       empty
console.log(myAtoi("+-12")); // 0       two signs
console.log(myAtoi(" 4 2")); // 4       inner space stops it
console.log(myAtoi("-")); // 0       sign with no digits
console.log(myAtoi("2147483647")); // 2147483647   exactly INT_MAX
console.log(myAtoi("-2147483648")); // -2147483648  exactly INT_MIN

console.log(myAtoiClampLate("-91283472332")); // -2147483648
console.log(myAtoiClampLate("1337c0d3")); // 1337
console.log(myAtoiUsingParseInt("-91283472332")); // -91283472332  <- not clamped
console.log(myAtoiUsingParseInt("words and 987")); // 0

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY: O(n) time, O(1) space for every version. This question is not
  about complexity at all - it is about handling the stages exactly.
- THE FOUR STAGES, IN ORDER:
    skip leading spaces -> at most one sign -> digits -> clamp.
    I would name them before writing a line, because getting the ORDER
    right is most of the marks.
- WHY I CHECK OVERFLOW BEFORE THE MULTIPLY:
    in C++ or Java, value * 10 + digit has already wrapped by the time I
    could test it. Comparing against INT_MAX/10 and its last digit catches
    it while the value is still valid. Same code works in every language.
- THE EDGE CASES I WOULD LIST OUT LOUD:
    "+-12" is 0 (one sign only), " 4 2" is 4 (spaces do not resume),
    "-" is 0 (sign with no digits), "0000123" is 123 (leading zeros are
    free), "words 987" is 0 (parsing must start immediately).
- ONE JAVASCRIPT-ONLY DETAIL:
    sign * 0 gives -0 when the sign is negative, so "-" would print -0.
    It compares equal to 0, but I return 0 explicitly so the output is clean.
- WHY NOT parseInt:
    it does not clamp, and it accepts forms atoi must reject. Number() is
    worse still - it rejects any trailing junk and accepts "0x1f".
- FOLLOW-UPS:
    Valid Number (LC 65, a much bigger state machine),
    Reverse Integer (LC 7, the same overflow-before-multiply check),
    Add Binary (LC 67), Multiply Strings (LC 43).
*/

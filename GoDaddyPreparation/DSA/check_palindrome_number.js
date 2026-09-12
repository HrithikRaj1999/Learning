/*
Palindrome Number (LC 9)

Return true if the integer x reads the same forwards and backwards.
No converting to a string.

  121   -> true
  -121  -> false   ("121-" backwards)
  10    -> false   ("01" backwards)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- So reverse only HALF.

- Peel digits off the back of x and glue them onto reverse:
      reverse = reverse * 10 + (x % 10)   // take last digit
      x       = floor(x / 10)             // drop last digit
  x shrinks, reverse grows.

- Stop when x <= reverse. That means half the digits moved over.

- Even count (1221): x = 12, reverse = 12 -> compare x === reverse.
- Odd count (12321): x = 12, reverse = 123 -> middle digit 3 is
  stuck in reverse. Drop it: compare x === floor(reverse / 10).

- Early false: negative x is never a palindrome.
  Ending in 0 is not either, unless x is 0 itself
  (a palindrome cannot START with 0).
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
x = 1221 (even count)

  x      reverse
  1221   0
  122    1        took 1
  12     12       took 2      <- now x <= reverse, stop
  x === reverse -> true

x = 12321 (odd count)

  x      reverse
  12321  0
  1232   1
  123    12
  12     123      <- stop, 3 is the middle digit
  floor(123 / 10) = 12 === x -> true

x = 123 (not a palindrome)

  x      reverse
  123    0
  12     3
  1      32       <- stop
  1 !== 32 and 1 !== floor(32 / 10) = 3 -> false

x = 10
  ends in 0 and is not 0 -> false right away
*/

// ============================================================
// 3) SKELETON
// ============================================================
/*
isPalindrome(x)
  if x < 0 or (x ends in 0 and x != 0) -> false
  reverse = 0
  while x > reverse
      move last digit of x into reverse
  return x === reverse or x === floor(reverse / 10)
*/

function isPalindrome(x) {
  // negatives have the minus in front, and a real number cannot
  // start with 0, so anything ending in 0 (except 0) fails
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;

  let reverse = 0;

  // move digits from the back of x onto reverse, stop at the middle
  while (x > reverse) {
    // x % 10 is the last digit, *10 shifts reverse left one place
    reverse = reverse * 10 + (x % 10);
    // drop the digit we just used
    x = Math.floor(x / 10);
  }

  // even digit count -> halves match exactly
  // odd digit count  -> reverse holds one extra middle digit, drop it
  return x === reverse || x === Math.floor(reverse / 10);
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(isPalindrome(121)); // true
console.log(isPalindrome(1221)); // true
console.log(isPalindrome(12321)); // true
console.log(isPalindrome(-121)); // false
console.log(isPalindrome(10)); // false
console.log(isPalindrome(0)); // true
console.log(isPalindrome(123)); // false
console.log(isPalindrome(1000021)); // false

/*
============================================================
4) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Time  : O(d) where d = number of digits, so O(log10 n).
    Space : O(1) - two numbers only.
- WHY HALF AND NOT FULL:
    Reversing all of 1463847412 style inputs can pass INT_MAX in
    languages with fixed 32 bit ints. Half reversal never can,
    because it holds at most half the digits.
- WHY THE LOOP CONDITION IS x > reverse:
    It is the moment the two halves meet. For an odd digit count
    reverse ends up one digit longer, which is the middle digit,
    and the middle digit never affects a palindrome.
- EDGE CASES:
    0 -> true. Negatives -> false. Trailing zero -> false.
    Single digit -> one pass: x = 5 becomes x = 0, reverse = 5,
    and 0 === floor(5 / 10) = 0 -> true.
- STRING VERSION:
    s = String(x), two pointers from both ends. O(d) time but
    O(d) space, and the question usually bans it.
- FOLLOW-UPS:
    Palindrome linked list, valid palindrome with letters only
    (LC 125), palindrome after deleting at most one char (LC 680).
*/

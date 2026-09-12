/*
Valid Palindrome (LC 125)

Ignore case and every non alphanumeric character. Is what is left the
same forwards and backwards?

  "A man, a plan, a canal: Panama" -> true   ("amanaplanacanalpanama")
  "race a car"                     -> false  ("raceacar")
  " "                              -> true   (nothing left, and "" is a palindrome)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- A palindrome means position i matches position n-1-i. So I put one
  pointer at each end and walk them towards each other.
- The only wrinkle is the junk. Instead of building a cleaned string
  (which costs O(n) memory), I let each pointer SKIP over junk in place.
- Compare in lower case so 'A' and 'a' match.

- The ladder:
    1. clean into a new string, reverse it, compare   O(n) time, O(n) space
    2. clean into a new string, two pointers on it    O(n) time, O(n) space
    3. two pointers on the ORIGINAL, skipping junk    O(n) time, O(1) space

- Traps:
    - the skip loops must also check left < right, or a string of pure
      junk walks the pointer off the end.
    - alphanumeric means letters AND digits. "0P" is false, not true.
    - an empty or all-junk string is a palindrome.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
TWO POINTER SKIP view, s = "A man, a plan"   (short slice for clarity)

  index   0  1  2  3  4  5  6  7  8  9 10 11 12
  char    A  ' ' m  a  n  ,  ' ' a  ' ' p  l  a  n

  left = 0 (A), right = 12 (n)
    both alnum:  'a' vs 'n'  -> not equal -> false

Now the real one, s = "aba, "  (trailing junk)

  index   0  1  2  3  4
  char    a  b  a  ,  ' '

  left=0 (a), right=4 (' ')
    right is junk -> right = 3
  left=0 (a), right=3 (',')
    right is junk -> right = 2
  left=0 (a), right=2 (a)
    'a' == 'a'  -> left = 1, right = 1
  left=1, right=1  ->  left < right is false -> stop, return true

  INVARIANT: everything strictly outside [left, right] has already been
  matched. When the pointers meet or cross, every pair has been checked.

FALSE case, s = "race a car" -> letters "raceacar"

  r a c e a c a r
  ^             ^   r == r   ok
    ^         ^     a == a   ok
      ^     ^       c == c   ok
        ^ ^         e vs a   NOT equal -> false

ALL JUNK case, s = " "
  left = 0, right = 0. left < right is already false -> true immediately.
  This is why the outer loop condition must be checked before comparing.
*/

// ============================================================
// 3) BRUTE FORCE - CLEAN, REVERSE, COMPARE
// ============================================================
/*
- Strip the junk into a new string, reverse it, test equality.
    Time  : O(n)   Space : O(n)
- Shortest to write and always correct. Say it, then attack the space.
*/
function isPalindromeClean(s) {
  if (s.length === 0) return true;

  const cleaned = [];

  for (let i = 0; i < s.length; i++) {
    if (isAlphanumeric(s[i])) cleaned.push(s[i].toLowerCase());
  }

  const forward = cleaned.join("");
  const backward = cleaned.slice().reverse().join("");

  return forward === backward;
}

function isAlphanumeric(ch) {
  const code = ch.charCodeAt(0);
  const isDigit = code >= 48 && code <= 57; // '0'..'9'
  const isUpper = code >= 65 && code <= 90; // 'A'..'Z'
  const isLower = code >= 97 && code <= 122; // 'a'..'z'
  return isDigit || isUpper || isLower;
}

// ============================================================
// 4) BETTER - CLEAN ONCE, THEN TWO POINTERS
// ============================================================
/*
- Same cleaning pass, but no reversed copy: walk the cleaned array from
  both ends.
    Time  : O(n)   Space : O(n)
- Half the memory of the reverse version, and it leads straight to the
  in-place answer.
*/
function isPalindromeTwoPass(s) {
  if (s.length === 0) return true;

  const cleaned = [];
  for (let i = 0; i < s.length; i++) {
    if (isAlphanumeric(s[i])) cleaned.push(s[i].toLowerCase());
  }

  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

// ============================================================
// 5) OPTIMAL - TWO POINTERS ON THE ORIGINAL (THE ONE TO WRITE)
// ============================================================
/*
- Never build anything. Each pointer skips junk itself, then they compare.
    Time  : O(n)   Space : O(1)
*/
function isPalindrome(s) {
  if (s.length === 0) return true;

  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // walk past junk, but never past the other pointer
    while (left < right && !isAlphanumeric(s[left])) left++;
    while (left < right && !isAlphanumeric(s[right])) right--;

    // compare case-insensitively; both sides are known alphanumeric now
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;

    left++;
    right--;
  }

  return true;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car")); // false
console.log(isPalindrome(" ")); // true   all junk
console.log(isPalindrome("")); // true   empty
console.log(isPalindrome("0P")); // false  digit vs letter
console.log(isPalindrome("aba")); // true   odd length
console.log(isPalindrome(".,;")); // true   pure junk

console.log(isPalindromeClean("A man, a plan, a canal: Panama")); // true
console.log(isPalindromeTwoPass("race a car")); // false
console.log(isPalindromeTwoPass("0P")); // false

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    clean + reverse   O(n) time, O(n) space
    clean + pointers  O(n) time, O(n) space
    in-place pointers O(n) time, O(1) space
- WHY TWO POINTERS:
    a palindrome is a symmetry condition on pairs (i, n-1-i). Meeting in
    the middle checks every pair exactly once, so one pass is enough.
- WHY THE SKIP LOOPS NEED left < right:
    without it, a string like " " or ".,;" walks a pointer past the end and
    then dereferences undefined. This is the bug interviewers plant.
- THE REAL TRAP:
    "alphanumeric" includes DIGITS. "0P" lowercases to "0p", which is not
    a palindrome. Many people only skip non-letters and get this wrong.
- WHY I DO NOT USE A REGEX:
    it works, but it allocates a second string and hides the O(n) space.
    I would mention it as the one-liner and then write the O(1) version.
- FOLLOW-UPS:
    Valid Palindrome II (LC 680, allow one deletion),
    Palindrome Linked List (LC 234, no random access),
    Longest Palindromic Substring (LC 5, expand around centre).
*/

/*
Longest Palindromic Substring (LC 5)

Return the longest substring of s that reads the same both ways.

  "babad" -> "bab"   (or "aba", both length 3)
  "cbbd"  -> "bb"
  "a"     -> "a"
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Every palindrome has a CENTRE. If I stand on the centre and push both
  pointers outward while the characters match, I grow the biggest
  palindrome centred there in one sweep.
- There are two kinds of centre:
      odd  length: a single character,  "aba" centred on 'b'
      even length: the gap between two, "abba" centred between the b's
  So for a string of length n there are 2n-1 possible centres, and each
  expansion costs at most O(n). That gives O(n^2), no extra memory.
- The DP table also gives O(n^2) time but costs O(n^2) memory, so expand
  around centre is strictly better for this problem.

- The ladder:
    1. every substring, check if palindrome        O(n^3) time, O(1) space
    2. DP table isPal[i][j]                        O(n^2) time, O(n^2) space
    3. expand around all 2n-1 centres              O(n^2) time, O(1) space
    (4. Manacher's algorithm is O(n), but nobody expects it in an
        interview - I would name it and move on)

- Traps:
    - forgetting the even centres. "cbbd" has its answer "bb" between two
      characters, not on one.
    - after expanding, left and right have gone ONE STEP TOO FAR, so the
      slice bounds are left+1 .. right.
    - empty input returns "".
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
EXPAND AROUND CENTRE view, s = "babad"

  index   0  1  2  3  4
  char    b  a  b  a  d

  ODD centre at index 1 ('a'):
      left = 1, right = 1
      s[1] == s[1]      -> expand: left = 0, right = 2
      s[0] = 'b', s[2] = 'b', equal -> expand: left = -1, right = 3
      left = -1 is out of bounds -> stop
      the palindrome is s[left+1 .. right-1] = s[0..2] = "bab", length 3
                          ^
                          left and right each overshot by one

  EVEN centre between index 1 and 2:
      left = 1 ('a'), right = 2 ('b')
      'a' != 'b' -> no expansion at all, length 0

  ODD centre at index 2 ('b'):
      left = 2, right = 2 -> expand to left = 1, right = 3
      s[1] = 'a', s[3] = 'a', equal -> expand to left = 0, right = 4
      s[0] = 'b', s[4] = 'd', NOT equal -> stop
      palindrome = s[1..3] = "aba", length 3

  best so far is length 3, first found was "bab" -> answer "bab"

  INVARIANT: when the expand loop stops, s[left+1 .. right-1] is the
  longest palindrome centred here. Both pointers always overshoot by one.

EVEN CENTRE case, s = "cbbd"

  index   0  1  2  3
  char    c  b  b  d

  even centre between 1 and 2:
      left = 1 ('b'), right = 2 ('b'), equal -> expand: left = 0, right = 3
      s[0] = 'c', s[3] = 'd', not equal -> stop
      palindrome = s[1..2] = "bb", length 2

  Every odd centre here gives length 1, so the answer is "bb".
  Without even centres I would wrongly return "c".

DP TABLE view, s = "cbbd".  isPal[i][j] = is s[i..j] a palindrome?

        j=0   j=1   j=2   j=3
  i=0    T     F     F     F
  i=1    -     T     T     F
  i=2    -     -     T     F
  i=3    -     -     -     T
               ^
               isPal[1][2]: s[1]==s[2] ('b'=='b') and the gap is < 2,
               so it is true with no inner check needed.

  Rule: isPal[i][j] = (s[i] == s[j]) AND (j - i < 2 OR isPal[i+1][j-1])
  I must fill it by increasing LENGTH, because [i][j] depends on the
  shorter [i+1][j-1].
*/

// ============================================================
// 3) BRUTE FORCE - CHECK EVERY SUBSTRING
// ============================================================
/*
- Try all O(n^2) substrings and test each in O(n).
    Time  : O(n^3)   Space : O(1)
- Say it in one sentence, then point out the repeated inner checks.
*/
function longestPalindromeBrute(s) {
  if (s.length === 0) return "";

  let best = "";

  for (let start = 0; start < s.length; start++) {
    for (let end = start; end < s.length; end++) {
      if (end - start + 1 > best.length && isPalindromeRange(s, start, end)) {
        best = s.slice(start, end + 1);
      }
    }
  }

  return best;
}

function isPalindromeRange(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

// ============================================================
// 4) BETTER - DP TABLE OF isPal[i][j]
// ============================================================
/*
- A substring is a palindrome when its ends match and its inside already is.
  Fill by increasing length so the inside is always known first.
    Time  : O(n^2)   Space : O(n^2)
- Removes the repeated inner checks, but the memory is the price.
*/
function longestPalindromeDP(s) {
  if (s.length === 0) return "";

  const n = s.length;
  const isPal = new Array(n);
  for (let i = 0; i < n; i++) isPal[i] = new Array(n).fill(false);

  let bestStart = 0;
  let bestLength = 1;

  // every single character is a palindrome
  for (let i = 0; i < n; i++) isPal[i][i] = true;

  // grow by length so [i+1][j-1] is always computed before [i][j]
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i + length - 1 < n; i++) {
      const j = i + length - 1;

      if (s[i] !== s[j]) continue;

      // length 2 has no inside, so matching ends is already enough
      if (length === 2 || isPal[i + 1][j - 1]) {
        isPal[i][j] = true;

        if (length > bestLength) {
          bestLength = length;
          bestStart = i;
        }
      }
    }
  }

  return s.slice(bestStart, bestStart + bestLength);
}

// ============================================================
// 5) OPTIMAL - EXPAND AROUND EVERY CENTRE (THE ONE TO WRITE)
// ============================================================
/*
- 2n-1 centres, each expanded outward while the characters match.
    Time  : O(n^2)   Space : O(1)
- Same time as the DP but no table, and much shorter to write correctly.
*/
function longestPalindrome(s) {
  if (s.length === 0) return "";

  let bestStart = 0;
  let bestLength = 1;

  for (let centre = 0; centre < s.length; centre++) {
    // odd length: the palindrome sits ON this character
    const odd = expandFrom(s, centre, centre);
    if (odd.length > bestLength) {
      bestLength = odd.length;
      bestStart = odd.start;
    }

    // even length: the palindrome sits BETWEEN this character and the next
    const even = expandFrom(s, centre, centre + 1);
    if (even.length > bestLength) {
      bestLength = even.length;
      bestStart = even.start;
    }
  }

  return s.slice(bestStart, bestStart + bestLength);
}

function expandFrom(s, left, right) {
  // push outward while both sides exist and still match
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--;
    right++;
  }

  // the loop overshot by one on each side, so pull back in
  return { start: left + 1, length: right - left - 1 };
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(longestPalindrome("babad")); // "bab"
console.log(longestPalindrome("cbbd")); // "bb"    even centre
console.log(longestPalindrome("a")); // "a"
console.log(longestPalindrome("")); // ""     empty
console.log(longestPalindrome("ac")); // "a"    no real palindrome
console.log(longestPalindrome("aaaa")); // "aaaa" whole string

console.log(longestPalindromeBrute("babad")); // "bab"
console.log(longestPalindromeDP("cbbd")); // "bb"
console.log(longestPalindromeDP("babad")); // "bab"
console.log(longestPalindromeDP("aaaa")); // "aaaa"

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    all substrings   O(n^3) time, O(1) space
    DP table         O(n^2) time, O(n^2) space
    expand centres   O(n^2) time, O(1) space
    Manacher         O(n) time, O(n) space - I would name it, not write it
- WHY CENTRES:
    every palindrome is determined entirely by its centre and its radius.
    There are only 2n-1 centres, so enumerating centres instead of
    substrings drops a whole factor of n.
- WHY 2n-1 AND NOT n:
    even-length palindromes are centred in the GAP between characters.
    Missing those is the classic bug - "cbbd" returns "c" instead of "bb".
- THE REAL TRAP:
    the off-by-one after expanding. The while loop always exits one step
    past the valid range, so the answer is s[left+1 .. right-1] and the
    length is right - left - 1.
- WHY NOT DP HERE:
    same time bound but O(n^2) memory. DP is the right tool when I need the
    isPal table for something else, like Palindrome Partitioning II.
- FOLLOW-UPS:
    Palindromic Substrings (LC 647, same expansion but count instead of
    max), Palindrome Partitioning (LC 131), Longest Palindromic
    Subsequence (LC 516, a different DP - subsequence, not substring).
*/

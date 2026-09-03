/*
Palindromic Substrings (LC 647)

Count how many substrings of s are palindromes. Substrings at different
positions count separately, even if they look the same.

  "abc" -> 3   ("a","b","c")
  "aaa" -> 6   ("a","a","a","aa","aa","aaa")
  "aba" -> 4   ("a","b","a","aba")
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Exactly the same machine as Longest Palindromic Substring (LC 5), with
  one line changed: instead of remembering the biggest, I add 1 every time
  the expansion succeeds.
- Why that counts correctly: every palindrome has exactly ONE centre, so
  walking all 2n-1 centres and counting each successful expansion visits
  every palindromic substring exactly once. No double counting, no misses.
- Each successful step of the expand loop IS one palindrome.

- The ladder:
    1. every substring, check if palindrome      O(n^3) time, O(1) space
    2. DP table isPal[i][j], count the trues     O(n^2) time, O(n^2) space
    3. expand around all 2n-1 centres, count     O(n^2) time, O(1) space

- Traps:
    - single characters count. "abc" is 3, not 0.
    - even centres again - "aa" contributes the substring "aa".
    - count each successful expansion step, not just the longest one.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
EXPAND AND COUNT view, s = "aaa"

  index   0  1  2
  char    a  a  a

  ODD centre 0:   left=0, right=0
      s[0]==s[0]  -> count = 0 + 1 = 1   ("a" at 0)
      expand to left=-1 -> out of bounds, stop
  EVEN centre 0/1: left=0, right=1
      s[0]=='a', s[1]=='a' -> count = 1 + 1 = 2   ("aa" at 0..1)
      expand to left=-1 -> stop

  ODD centre 1:   left=1, right=1
      match -> count = 2 + 1 = 3   ("a" at 1)
      expand: left=0, right=2, s[0]=='a', s[2]=='a'
              match -> count = 3 + 1 = 4   ("aaa" at 0..2)
      expand: left=-1 -> stop
  EVEN centre 1/2: left=1, right=2
      s[1]=='a', s[2]=='a' -> count = 4 + 1 = 5   ("aa" at 1..2)
      expand: left=0, right=3, right out of bounds -> stop

  ODD centre 2:   left=2, right=2
      match -> count = 5 + 1 = 6   ("a" at 2)
      expand: right=3 out of bounds -> stop
  EVEN centre 2/3: right=3 is out of bounds immediately, 0 palindromes

  answer 6

  The six found:  a(0)  a(1)  a(2)  aa(0-1)  aa(1-2)  aaa(0-2)
  Each one was counted at exactly one centre - that is why there is no
  double counting.

  INVARIANT: one successful pass of the expand loop = one distinct
  palindromic substring, identified by (centre, radius).

NO PALINDROME case, s = "abc"

  odd 0: "a"  count 1        even 0/1: 'a' vs 'b' no match
  odd 1: "b"  count 2        even 1/2: 'b' vs 'c' no match
  odd 2: "c"  count 3        even 2/3: out of bounds
  answer 3     the single characters are the only palindromes
*/

// ============================================================
// 3) BRUTE FORCE - CHECK EVERY SUBSTRING
// ============================================================
/*
- Try all O(n^2) substrings, test each in O(n).
    Time  : O(n^3)   Space : O(1)
- Fine as an opening sentence, then fix the repeated inner work.
*/
function countSubstringsBrute(s) {
  if (s.length === 0) return 0;

  let count = 0;

  for (let start = 0; start < s.length; start++) {
    for (let end = start; end < s.length; end++) {
      if (isPalindromeRange(s, start, end)) count++;
    }
  }

  return count;
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
// 4) BETTER - DP TABLE, COUNT THE TRUE CELLS
// ============================================================
/*
- isPal[i][j] is true when the ends match and the inside is a palindrome.
  The answer is simply how many cells are true.
    Time  : O(n^2)   Space : O(n^2)
- Worth writing when the interviewer wants the table for a follow-up.
*/
function countSubstringsDP(s) {
  if (s.length === 0) return 0;

  const n = s.length;
  const isPal = new Array(n);
  for (let i = 0; i < n; i++) isPal[i] = new Array(n).fill(false);

  let count = 0;

  // single characters
  for (let i = 0; i < n; i++) {
    isPal[i][i] = true;
    count++;
  }

  // grow by length so the inner substring is always solved first
  for (let length = 2; length <= n; length++) {
    for (let i = 0; i + length - 1 < n; i++) {
      const j = i + length - 1;

      if (s[i] !== s[j]) continue;

      // length 2 has no inside, so matching ends is enough
      if (length === 2 || isPal[i + 1][j - 1]) {
        isPal[i][j] = true;
        count++;
      }
    }
  }

  return count;
}

// ============================================================
// 5) OPTIMAL - EXPAND AROUND EVERY CENTRE (THE ONE TO WRITE)
// ============================================================
/*
- 2n-1 centres; every successful expansion step is one palindrome.
    Time  : O(n^2)   Space : O(1)
*/
function countSubstrings(s) {
  if (s.length === 0) return 0;

  let count = 0;

  for (let centre = 0; centre < s.length; centre++) {
    // odd length palindromes sit ON this character
    count = count + expandAndCount(s, centre, centre);

    // even length palindromes sit BETWEEN this character and the next
    count = count + expandAndCount(s, centre, centre + 1);
  }

  return count;
}

function expandAndCount(s, left, right) {
  let found = 0;

  while (left >= 0 && right < s.length && s[left] === s[right]) {
    // this exact (left, right) window is one palindromic substring
    found++;
    left--;
    right++;
  }

  return found;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(countSubstrings("abc")); // 3
console.log(countSubstrings("aaa")); // 6
console.log(countSubstrings("aba")); // 4
console.log(countSubstrings("")); // 0    empty
console.log(countSubstrings("a")); // 1    single
console.log(countSubstrings("aaaa")); // 10   n(n+1)/2 when all equal

console.log(countSubstringsBrute("aaa")); // 6
console.log(countSubstringsDP("aba")); // 4
console.log(countSubstringsDP("aaaa")); // 10

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    all substrings   O(n^3) time, O(1) space
    DP table         O(n^2) time, O(n^2) space
    expand centres   O(n^2) time, O(1) space
- WHY COUNTING BY CENTRE IS EXACT:
    every palindrome has exactly one centre - a character for odd lengths,
    a gap for even ones. So (centre, radius) is a unique name for every
    palindromic substring. Enumerating those names counts each one once.
- THIS IS LC 5 WITH ONE LINE CHANGED:
    the same expansion; I add instead of comparing lengths. Saying that
    out loud is the pattern recognition the round is testing.
- THE REAL TRAP:
    counting only the longest palindrome per centre. Every step of the
    expansion is its own substring, so the count increments inside the loop.
- SANITY CHECK I WOULD MENTION:
    for a string of n identical characters the answer must be n(n+1)/2 -
    "aaaa" gives 10. Good quick self-test on the whiteboard.
- FOLLOW-UPS:
    Longest Palindromic Substring (LC 5),
    Palindromic Substrings with distinct values (LC 1930),
    Count Different Palindromic Subsequences (LC 730, much harder DP).
*/

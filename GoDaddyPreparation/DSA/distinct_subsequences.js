/*
Distinct Subsequences - count s2 inside s1 (LC 115)   [Q2.1.2]

How many DIFFERENT ways can we pick characters from s1 (order kept,
gaps allowed) so that the picked characters spell s2?

  s1 = "rabbbit", s2 = "rabbit" -> 3
  s1 = "babgbag", s2 = "bag"    -> 5
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Not a search, a COUNT. So I add answers, never take a max.

- Stand at s1[i] and s2[j] and ask one question:
      does s1[i] match s2[j]?

- MATCH  -> two choices, and BOTH are valid, so add them:
      use this char   -> move both pointers
      skip this char  -> move only s1
- NO MATCH -> only one choice: skip the s1 char.

- Base cases (order matters):
      s2 finished  -> 1  (found one full way)
      s1 finished  -> 0  (s2 still left, impossible)

- Same (i, j) is reached many times -> memo -> then a 2D table.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
s1 = "babgbag", s2 = "bag"  -> answer 5
The 5 ways (capital = picked):

  BAbgbAG      B A ... G
  BAbgBAg
  BabgBAG
  bABgbAG   (wait - only 'b','a','g' in order matter)
  ... easier to trust the table below.

DP table, dp[i][j] = ways to build first j chars of s2
using first i chars of s1.

            ""   b    a    g       <- s2 (j)
      ""     1   0    0    0
      b      1   1    0    0
      a      1   1    1    0
      b      1   2    1    0
      g      1   2    1    1
      b      1   3    1    1
      a      1   3    4    1
      g      1   3    4    5   <- answer
      ^
      s1 (i)

READ ROW 0: empty s1 can build empty s2 in exactly 1 way
            (pick nothing), and cannot build anything else.
READ COLUMN 0: empty s2 is always buildable in 1 way.

Cell dp[3][1] = 2 : s1 = "bab", s2 = "b" -> two b's to choose from.
Cell dp[7][3] = 5 : match 'g' -> dp[6][2] (=4, use it)
                              + dp[6][3] (=1, skip it) = 5.
*/

// ============================================================
// 3) BRUTE FORCE - PLAIN RECURSION
// ============================================================
/*
- Try both choices on every match, count the leaves that finished s2.
    Time  : O(2^n) - branching on every match.
    Space : O(n) recursion stack.
*/
function numDistinctBrute(s1, s2) {
  function recurse(i, j) {
    // s2 fully built - one valid way found
    if (j < 0) return 1;
    // s1 exhausted but s2 still has characters left
    if (i < 0) return 0;

    if (s1[i] === s2[j]) {
      // use this char + skip this char, BOTH count
      return recurse(i - 1, j - 1) + recurse(i - 1, j);
    }

    // cannot use it, only skip
    return recurse(i - 1, j);
  }

  return recurse(s1.length - 1, s2.length - 1);
}

// ============================================================
// 4) BETTER - MEMOISATION (TOP DOWN)
// ============================================================
/*
- Only n*m distinct (i, j) states exist, so cache each one.
- Fill the memo with -1, because 0 is a REAL answer here.
    Time  : O(n*m)   Space : O(n*m) + O(n) stack.
*/
function numDistinctMemo(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  // -1 = not computed yet (0 is a valid count, so never use 0)
  const memo = Array.from({ length: n }, () => Array(m).fill(-1));

  function recurse(i, j) {
    if (j < 0) return 1;
    if (i < 0) return 0;
    if (memo[i][j] !== -1) return memo[i][j];

    let answer;
    if (s1[i] === s2[j]) {
      answer = recurse(i - 1, j - 1) + recurse(i - 1, j);
    } else {
      answer = recurse(i - 1, j);
    }

    memo[i][j] = answer;
    return answer;
  }

  return recurse(n - 1, m - 1);
}

// ============================================================
// 5) OPTIMAL - TABULATION (BOTTOM UP, WHAT THEY ASK FOR)
// ============================================================
/*
- STEP 1: shift indexes by 1 so index 0 can mean "empty string".
    Consequence: dp[i][j] compares s1[i-1] with s2[j-1].
- STEP 2: dp[i][0] = 1 for every i - empty s2 needs one way
    (pick nothing). dp[0][j] = 0 for j > 0 - empty s1 cannot
    build a non-empty s2.
- STEP 3: grow i and j, copy the recurrence:
      match    -> dp[i][j] = dp[i-1][j-1] + dp[i-1][j]
      mismatch -> dp[i][j] = dp[i-1][j]
- STEP 4: answer is dp[n][m].
    Time  : O(n*m)   Space : O(n*m), no recursion stack.
*/
function numDistinct(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  // empty s2 can always be built exactly one way: take nothing
  for (let i = 0; i <= n; i++) {
    dp[i][0] = 1;
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      // remember the index shift: s1[i-1] and s2[j-1]
      if (s1[i - 1] === s2[j - 1]) {
        // use this character  + leave this character
        dp[i][j] = dp[i - 1][j - 1] + dp[i - 1][j];
      } else {
        // characters differ, the only option is to skip s1's char
        dp[i][j] = dp[i - 1][j];
      }
    }
  }

  return dp[n][m];
}

// ============================================================
// 6) SPACE OPTIMAL - ONE ROW, RIGHT TO LEFT
// ============================================================
/*
- Row i reads only row i-1, so one row is enough.
- Walk j BACKWARDS. Going forward would overwrite row[j-1] before
  it is used as the "previous row" diagonal value.
    Time  : O(n*m)   Space : O(m).
*/
function numDistinctOneRow(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  const row = Array(m + 1).fill(0);
  // empty s2 -> one way
  row[0] = 1;

  for (let i = 1; i <= n; i++) {
    // backwards, so row[j-1] is still the PREVIOUS row's value
    for (let j = m; j >= 1; j--) {
      if (s1[i - 1] === s2[j - 1]) {
        row[j] = row[j - 1] + row[j];
      }
      // mismatch means row[j] stays as it is - that IS dp[i-1][j]
    }
  }

  return row[m];
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(numDistinct("rabbbit", "rabbit")); // 3
console.log(numDistinct("babgbag", "bag")); // 5
console.log(numDistinct("abc", "abc")); // 1
console.log(numDistinct("abc", "d")); // 0
console.log(numDistinct("aaa", "a")); // 3
console.log(numDistinct("abc", "")); // 1

console.log(numDistinctBrute("rabbbit", "rabbit")); // 3
console.log(numDistinctMemo("babgbag", "bag")); // 5
console.log(numDistinctOneRow("babgbag", "bag")); // 5
console.log(numDistinctOneRow("rabbbit", "rabbit")); // 3

/*
============================================================
7) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Brute : O(2^n) time, O(n) stack.
    Memo / table : O(n*m) time, O(n*m) space.
    One row : O(n*m) time, O(m) space. Mention this ONLY if asked,
    as the prep note says.
- WHY ADD AND NOT MAX:
    LCS asks "how long", this asks "how many". Counting problems
    add both branches; optimisation problems take the best one.
    Same table shape, different combine step.
- WHY dp[i][0] = 1:
    There is exactly one way to build an empty target - choose
    nothing. Setting it to 0 makes the whole table collapse to 0.
- WHY THE ONE-ROW LOOP GOES BACKWARDS:
    row[j] needs row[j-1] from the OLD row. Forward order would
    have already overwritten it with the new row's value.
- OVERFLOW: counts grow fast (2^n in the worst case). In Java or
  C++ this needs long / the problem guarantees it fits in 32 bits.
  In JS numbers are doubles, exact up to 2^53.
- FOLLOW-UPS:
    Is s2 a subsequence of s1 (LC 392, two pointers, O(n)),
    LCS (max instead of sum), Edit Distance, Wildcard Matching.
*/

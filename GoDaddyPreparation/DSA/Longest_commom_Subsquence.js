/*
Longest Common Subsequence (LC 1143)

Given s1 and s2, return the length of the longest subsequence
present in both. Subsequence = keep the relative order, but we
are allowed to skip characters.

  s1 = "abdce", s2 = "ade"  ->  "ade"  ->  answer 3
*/

// ============================================================
// 1) BRUTE FORCE - PLAIN RECURSION
// ============================================================
/*
IDEA:
- "Stand at the LAST index of both strings and ask ONE question:
   do s1[i] and s2[j] match? Then recurse on a smaller version of
   the same problem."

STEPS & WHY:
- STEP 1: base case - if index1 < 0 or index2 < 0, return 0.
    WHY: a negative index means that string is empty, and an empty
    string shares nothing with anything.

- STEP 2: if s1[i] === s2[j], return 1 + recurse(i-1, j-1).
    WHY: a matching character is definitely usable in the answer,
    and using it consumes ONE character from each string, so both
    indexes must move back.

- STEP 3: if they do not match, return max(recurse(i-1, j),
  recurse(i, j-1)).
    WHY: at least one of these two characters is useless, but I
    cannot tell which one, so I try both drops and keep the bigger.
    This is why no greedy scan works here.

- STEP 4: start the whole thing at recurse(n-1, m-1).
    WHY: that is the full string on both sides.

TIME & SPACE:
    Time  : O(2^(n+m)) - every mismatch branches into two calls.
    Space : O(n+m) recursion stack, no extra storage.
*/
function lcsBrute(s1, s2) {
  function recurse(index1, index2) {
    // one string became empty, nothing common is left
    if (index1 < 0 || index2 < 0) return 0;

    // characters match: take it and shrink both strings
    if (s1[index1] === s2[index2]) {
      return 1 + recurse(index1 - 1, index2 - 1);
    }

    // no match: drop a char from s1, or drop a char from s2
    const dropFromS1 = recurse(index1 - 1, index2);
    const dropFromS2 = recurse(index1, index2 - 1);
    return Math.max(dropFromS1, dropFromS2);
  }

  // start from the last index of both strings
  return recurse(s1.length - 1, s2.length - 1);
}

// ============================================================
// 2) BETTER - MEMOIZATION (2D ARRAY, TOP DOWN)
// ============================================================
/*
IDEA:
- "The recursion is slow only because the same pair (i, j) is
   reached through many different paths. So cache every answer."

STEPS & WHY:
- STEP 1: count the changing parameters - here i and j, both
  bounded by n and m. Create an (n x m) memo grid filled with -1.
    WHY: two bounded parameters means only n*m DISTINCT states,
    so a 2D array covers all of them.

- STEP 2: build the grid with
  Array.from({length: n}, () => Array(m).fill(-1)).
    WHY: the callback runs n times, so each row is its own array.
    NEVER Array(n).fill(Array(m).fill(-1)) - that reuses ONE array
    reference for every row, so writing one cell writes a whole
    column.

- STEP 3: fill with -1, not 0.
    WHY: 0 is a valid LCS answer, so using it as the "not computed"
    marker silently makes the table lie.

- STEP 4: keep the recursion body identical, but first check
  `if (memo[i][j] !== -1) return memo[i][j]`.
    WHY: this is the whole speedup - a repeated state returns in O(1).

- STEP 5: write into memo[i][j] just before returning.
    WHY: every path out of the function must store its result, or
    the state gets recomputed anyway.

TIME & SPACE:
    Time  : O(n*m) - each state is computed exactly once.
    Space : O(n*m) table + O(n+m) recursion stack.
*/
function lcsMemo(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  // memo[i][j] = answer for that state, -1 means "not recursed yet"
  // the inner Array.from runs n times, so every row is a NEW array
  const memo = Array.from({ length: n }, () => Array(m).fill(-1));

  function recurse(index1, index2) {
    if (index1 < 0 || index2 < 0) return 0;

    // this exact state was already recursed, reuse it
    if (memo[index1][index2] !== -1) return memo[index1][index2];

    let answer;
    if (s1[index1] === s2[index2]) {
      answer = 1 + recurse(index1 - 1, index2 - 1);
    } else {
      const shortenS1 = recurse(index1 - 1, index2);
      const shortenS2 = recurse(index1, index2 - 1);
      answer = Math.max(shortenS1, shortenS2);
    }

    // store before returning
    memo[index1][index2] = answer;
    return answer;
  }

  return recurse(n - 1, m - 1);
}

// ============================================================
// 3) OPTIMAL - TABULATION (BOTTOM UP, NO RECURSION)
// ============================================================
/*
IDEA:
- "Remove recursion completely: build the same table from the
   empty-string corner outward, so every cell is already there
   when a later cell needs it."

STEPS & WHY:
- STEP 1: shift every index by one, and define
  dp[i][j] = LCS of the first i chars of s1 and first j chars of s2.
    WHY: the recursion used -1 for "empty string" and an array
    cannot hold index -1. Consequence: dp[i][j] talks about
    s1[i-1] and s2[j-1]. Mixing that up is the #1 bug here.

- STEP 2: create an (n+1) x (m+1) grid filled with 0.
    WHY: that IS the base case, already written - row 0 and column 0
    mean "one string is empty", which shares nothing.

- STEP 3: loop i from 1..n and j from 1..m.
    WHY: the recursion SHRANK the indexes, so the table must GROW
    them, otherwise a cell is read before it is written.

- STEP 4: copy the recurrence into the loop body -
  match -> dp[i][j] = 1 + dp[i-1][j-1] (diagonal),
  mismatch -> dp[i][j] = max(dp[i-1][j], dp[i][j-1]).
    WHY: it is the exact same logic as the recursion, only the
    direction changed.

- STEP 5: return dp[n][m].
    WHY: bottom-right = both strings used in full.

VISUAL (s1 = "abdce", s2 = "ade"):

        ""   a    d    e        <- s2 (j)
   ""    0   0    0    0
   a     0   1    1    1
   b     0   1    1    1
   d     0   1    2    2
   c     0   1    2    2
   e     0   1    2    3   <- answer dp[5][3]
   ^
   s1 (i)

   dp[1][1]: 'a' === 'a' -> 1 + dp[0][0] = 1
   dp[2][1]: 'b' !== 'a' -> max(dp[1][1], dp[2][0]) = 1
   dp[3][2]: 'd' === 'd' -> 1 + dp[2][1] = 2
   dp[5][3]: 'e' === 'e' -> 1 + dp[4][2] = 3

TIME & SPACE:
    Time  : O(n*m) - one pass over the table.
    Space : O(n*m) table, and NO recursion stack, so long
            strings cannot blow the stack.
*/
function lcsTabulation(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  // STEP 1 - base case: (n+1) x (m+1) grid filled with 0,
  // row 0 and column 0 already mean "empty string"
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  // STEP 2 - recursion shrinks indexes, so here we grow them
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      // STEP 3 - the recurrence, with the index shift applied
      if (s1[i - 1] === s2[j - 1]) {
        // match: diagonal move, +1
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        // mismatch: best of dropping a char from either string
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // full strings answer sits in the bottom-right corner
  return dp[n][m];
}

// ============================================================
// 4) SPACE OPTIMAL - TWO ROWS, THEN ONE ROW
// ============================================================
/*
IDEA:
- "Row i only ever reads row i-1, so keeping the whole grid is
   waste. Keep the same loops and throw the old rows away."

STEPS & WHY:
- STEP 1: list the cells the recurrence reads - dp[i-1][j-1]
  (diagonal), dp[i-1][j] (above), dp[i][j-1] (left).
    WHY: all three live in the current row or the one just above,
    so two rows are enough. This check is how you know the
    optimisation is even legal.

- STEP 2 (two rows): keep previousRow and currentRow, run the same
  j loop, and after each i do previousRow = currentRow.
    WHY: O(m) space instead of O(n*m), same number of cells visited.

- STEP 3 (one row): reuse a single `row` and carry the diagonal by
  hand - save `above = row[j]` BEFORE writing row[j], then at the
  end of the iteration set `diagonal = above`.
    WHY: row[j-1] has already been overwritten by the current row,
    so it is the LEFT cell; the old row[j] is the value I still
    need as the diagonal for the NEXT j. Saving it first is the
    whole trick.

- STEP 4: seed diagonal = 0 at the start of each i.
    WHY: the diagonal for j = 1 is dp[i-1][0], which is always 0.

- TRADE-OFF: the full table is gone, so I can only report the
  LENGTH - printing the actual string needs approach 5.

TIME & SPACE:
    Time  : O(n*m) - unchanged, same number of cells visited.
    Space : O(m) - one row of length m+1, no recursion stack.
*/
function lcsTwoRows(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  // row 0 of the table: empty s1 against every prefix of s2
  let previousRow = Array(m + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    const currentRow = Array(m + 1).fill(0);

    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        // diagonal = previous row, previous column
        currentRow[j] = 1 + previousRow[j - 1];
      } else {
        // above = previousRow[j], left = currentRow[j - 1]
        currentRow[j] = Math.max(previousRow[j], currentRow[j - 1]);
      }
    }

    // this row becomes the "above" row for the next i
    previousRow = currentRow;
  }

  return previousRow[m];
}

function lcsOneRow(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  // single row, reused for every i
  const row = Array(m + 1).fill(0);

  for (let i = 1; i <= n; i++) {
    // diagonal for j = 1 is dp[i-1][0], which is always 0
    let diagonal = 0;

    for (let j = 1; j <= m; j++) {
      // row[j] is still the PREVIOUS row here, save it before writing
      const above = row[j];

      if (s1[i - 1] === s2[j - 1]) {
        row[j] = 1 + diagonal;
      } else {
        // row[j - 1] was already overwritten, so it is the left cell
        row[j] = Math.max(above, row[j - 1]);
      }

      // the old row[j] becomes the diagonal for the next j
      diagonal = above;
    }
  }

  return row[m];
}

// ============================================================
// 5) OPTIONAL - PRINT THE ACTUAL LCS STRING (BACKTRACKING)
// ============================================================
/*
IDEA:
- "The table already knows the answer. I just replay the decision
   that filled each cell, walking back from the bottom-right."

STEPS & WHY:
- STEP 1: build the full table exactly like approach 3.
    WHY: backtracking needs the WHOLE grid, so the O(m) two-row
    version cannot do this. That is the price paid for space.

- STEP 2: start at i = n, j = m and loop while i > 0 && j > 0.
    WHY: hitting 0 on either side means an empty string, which is
    the edge of the table.

- STEP 3: if s1[i-1] === s2[j-1], push that character and do
  i--, j--.
    WHY: a match means the cell came from the diagonal, so that
    character really is part of the LCS.

- STEP 4: otherwise move towards the bigger neighbour - up when
  dp[i-1][j] >= dp[i][j-1], else left.
    WHY: on a mismatch the cell simply copied its bigger neighbour,
    so that neighbour is where the answer came from. Ties are
    arbitrary - `>=` just picks one valid LCS, and several LCS of
    the same length can exist.

- STEP 5: reverse the collected characters before joining.
    WHY: the walk went from the END to the START, so they come out
    backwards.

TIME & SPACE:
    Time  : O(n*m) to fill + O(n+m) to walk back = O(n*m).
    Space : O(n*m) for the grid, which we now genuinely need.
*/
function lcsString(s1, s2) {
  const n = s1.length;
  const m = s2.length;

  // same table as approach 3
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // walk back from the bottom-right corner
  const characters = [];
  let i = n;
  let j = m;

  while (i > 0 && j > 0) {
    if (s1[i - 1] === s2[j - 1]) {
      // this cell came from the diagonal, so the char is in the LCS
      characters.push(s1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      // the cell copied the value from above
      i--;
    } else {
      // the cell copied the value from the left
      j--;
    }
  }

  // collected from the end, so flip it
  characters.reverse();

  return { length: dp[n][m], lcs: characters.join("") };
}

// ============================================================
// QUICK CHECK
// ============================================================
const s1 = "abdce";
const s2 = "ade";

console.log(lcsBrute(s1, s2)); // 3  ("ade")
console.log(lcsMemo(s1, s2)); // 3
console.log(lcsTabulation(s1, s2)); // 3

console.log(lcsTwoRows(s1, s2)); // 3
console.log(lcsOneRow(s1, s2)); // 3

console.log(lcsOneRow("abc", "abc")); // 3
console.log(lcsOneRow("abc", "def")); // 0
console.log(lcsOneRow("", "abc")); // 0
console.log(lcsOneRow("bsbininm", "jmjkbkjkv")); // 1
console.log(lcsOneRow("ezupkr", "ubmrapg")); // 2

console.log(lcsString(s1, s2)); // { length: 3, lcs: 'ade' }
console.log(lcsString("AGGTAB", "GXTXAYB")); // { length: 4, lcs: 'GTAB' }
console.log(lcsString("abc", "def")); // { length: 0, lcs: '' }

/*
============================================================
SAY OUT LOUD
============================================================
- COMPARISON:
    Brute      : O(2^(n+m)) time, O(n+m) stack.
    Memo       : O(n*m) time, O(n*m) table + O(n+m) stack.
    Tabulation : O(n*m) time, O(n*m) table, no stack.
    Two / one row : O(n*m) time, O(m) space.
- CAN TIME GO BELOW O(n*m)?
    Not in general. There is no known strongly sub-quadratic
    LCS algorithm, and it is conditionally ruled out under SETH.
    Special cases do better: if the alphabet is small or the
    answer is short, Hunt-Szymanski runs in O((r + n) log n)
    where r is the number of matching pairs, and bit-parallel
    tricks give O(n*m / wordSize). I would only mention these,
    not code them in an interview.
- CHEAP PRACTICAL WINS:
    Trim the common prefix and suffix first (each trimmed char
    is a guaranteed match), and make s2 the SHORTER string so
    the O(m) row is as small as possible.
- WHEN I KEEP THE FULL TABLE:
    Only if the interviewer wants the actual string. lcsString
    backtracks through the grid in O(n+m) after filling it, so
    the O(m) row version cannot be used there. If they only ask
    for the length, I ship the O(m) version.
- MULTIPLE ANSWERS:
    Several different subsequences can share the maximum length
    ("ab" and "ba" style ties). Backtracking returns ONE valid
    answer, decided by which way I break the tie. Listing all of
    them is exponential in the worst case.
- HOW TO PRINT THE ACTUAL LCS:
    Start at dp[n][m]. If the characters match, that char is in
    the answer, move diagonally. Otherwise move to the larger of
    dp[i-1][j] and dp[i][j-1]. Reverse what you collected.
- LIKELY FOLLOW-UPS:
    Longest Common Substring (mismatch resets the cell to 0),
    Min insertions/deletions to convert s1 to s2
      = (n - lcs) + (m - lcs),
    Shortest Common Supersequence = n + m - lcs,
    Longest Palindromic Subsequence = LCS(s, reverse(s)),
    Edit Distance (same table shape, three moves instead of two).
*/

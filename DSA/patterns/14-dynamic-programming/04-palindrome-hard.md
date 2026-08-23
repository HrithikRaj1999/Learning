# DP — Palindrome & Hard

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 647 | Medium | Palindromic Substrings | dp[i][j] / expand center | Amazon, Google, Facebook |
| 5 | Medium | Longest Palindromic Substring | dp[i][j] or expand center | Google, Amazon, Microsoft |
| 72 | Medium | Edit Distance | 2D dp insert/delete/replace | Amazon, Google, Microsoft |
| 10 | Hard | Regular Expression Matching | 2D dp with `*` / `.` | Google, Amazon, Facebook |
| 312 | Hard | Burst Balloons | Interval DP (last balloon) | Amazon, Google |

**Key skill**: interval DP (LC 312) — iterate by interval length, decide the *last* action in the range, not the first.

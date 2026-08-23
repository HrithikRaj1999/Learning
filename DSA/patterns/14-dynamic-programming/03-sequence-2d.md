# DP — Sequence & 2D

Two indices / two strings → grid DP.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 300 | Medium | Longest Increasing Subsequence | dp[i] or patience O(n log n) | Google, Microsoft, Amazon |
| 139 | Medium | Word Break | dp[i] reachable + dict set | Bloomberg, Amazon, Google |
| 152 | Medium | Maximum Product Subarray | Track max/min product | Amazon, Google, LinkedIn |
| 62 | Medium | Unique Paths | Grid dp[i][j]=up+left | Amazon, Google, Bloomberg |
| 1143 | Medium | Longest Common Subsequence | 2D dp on two strings | Amazon, Google, Microsoft |
| 309 | Medium | Best Time to Buy/Sell with Cooldown | State machine DP | Amazon, Google |

**Key skill**: LIS in O(n log n) — keep a "tails" array and binary-search the insert position (LC 300).

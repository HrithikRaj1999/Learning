# 14. Dynamic Programming

Hardest topic — needs recursion, arrays, and pattern recognition. Overlapping subproblems + optimal substructure → cache states.

## Ladder

1. [1D DP](01-1d-dp.md) — stairs, rob, decode
2. [Knapsack & coins](02-knapsack-coins.md) — bounded/unbounded, subset sum
3. [Sequence & 2D](03-sequence-2d.md) — LIS, LCS, grid paths
4. [Palindrome & hard](04-palindrome-hard.md) — edit distance, regex, interval DP

## Method (always the same 4 steps)

```text
1. Define the state:  dp[i] / dp[i][j] = ...
2. Recurrence:        dp[i] from smaller states
3. Base cases
4. Order of evaluation (bottom-up) or memoize (top-down)
```

## Cue

"Count the ways", "min/max cost to reach", "can you partition/reach", "longest/shortest subsequence" — and greedy fails → DP.

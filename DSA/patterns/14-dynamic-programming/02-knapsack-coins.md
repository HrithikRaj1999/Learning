# DP — Knapsack & Coins

Choose items to hit a target. Watch loop order: unbounded (coin outer? amount?) vs 0/1.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 322 | Medium | Coin Change | Unbounded min-coins DP | Google, Amazon, Meta, Bloomberg |
| 377 | Medium | Combination Sum IV | Count ordered ways (amount outer) | Amazon, Google |
| 416 | Medium | Partition Equal Subset Sum | 0/1 knapsack boolean | Amazon, Google, Facebook |
| 494 | Medium | Target Sum | Subset-sum counting | Amazon, Google, Facebook |

**Key skill**: order matters — combinations (unordered) put the item loop outside; permutations (ordered, LC 377) put amount outside.

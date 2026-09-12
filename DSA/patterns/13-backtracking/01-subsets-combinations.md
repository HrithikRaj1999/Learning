# Backtracking — Subsets & Combinations

`start` index prevents reusing earlier elements → no duplicate sets.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 78 | Medium | Subsets | Include/exclude each element | Amazon, Google, Meta, Bloomberg |
| 90 | Medium | Subsets II | Sort + skip duplicate siblings | Amazon, Google |
| 77 | Medium | Combinations | Choose k via start index | Amazon, Google |
| 39 | Medium | Combination Sum | Reuse allowed (start = i) | Amazon, Google, Bloomberg |
| 40 | Medium | Combination Sum II | No reuse (start = i+1) + skip dups | Amazon, Google |

**Key skill**: to skip duplicates, sort first and `if i > start && a[i]==a[i-1]: continue`.

# Backtracking — Permutations

Order matters → track used elements instead of a start index.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 46 | Medium | Permutations | used[] array / swap | Google, Amazon, Meta, Microsoft |
| 47 | Medium | Permutations II | Sort + skip used duplicates | Amazon, Google |
| 784 | Medium | Letter Case Permutation | Branch on letter case | Amazon, Google |
| 526 | Medium | Beautiful Arrangement | Backtrack with divisibility prune | Amazon, Google |

**Key skill**: LC 47 — skip `a[i]` if `a[i]==a[i-1]` and `a[i-1]` is not used in the current path (dedupe permutations).

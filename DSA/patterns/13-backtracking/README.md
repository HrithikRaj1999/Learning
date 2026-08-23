# 13. Backtracking

Build a candidate incrementally, undo the last choice, try the next. DFS over the decision tree with pruning.

## Ladder

1. [Subsets & combinations](01-subsets-combinations.md) — include/exclude, start index
2. [Permutations](02-permutations.md) — used-array / swap
3. [String & grid](03-string-grid.md) — partitions, phone, word search
4. [Constraint & hard](04-constraint-hard.md) — N-Queens, Sudoku, k-partition

## Template

```text
backtrack(path, choices):
    if goal: record(path); return
    for choice in choices:
        if invalid(choice): continue   # prune
        path.push(choice)
        backtrack(path, nextChoices)
        path.pop()                      # undo
```

## Cue

"All subsets / permutations / combinations", "partition into", "place with constraints" → backtracking. Prune early to survive exponential blowup.

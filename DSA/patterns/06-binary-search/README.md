# 06. Binary Search

Halve the search space each step → O(log n). Works on sorted data *and* on a monotonic answer space.

## Ladder

1. [Classic](01-classic.md) — sorted array, lower/upper bound
2. [Bounds & peak](02-bounds-and-peak.md) — first/last position, peaks
3. [Rotated & matrix](03-rotated-and-matrix.md) — pivoted arrays, 2D
4. [Search on answer](04-search-on-answer.md) — binary search the result value

## Core idea

If you can write a monotonic predicate `feasible(x)` (false…false, true…true), binary search the smallest true `x`. This unlocks "minimum capacity / speed / time" problems.

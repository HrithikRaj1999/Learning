# 03. Two Pointers

Two indices moving through data to drop a nested loop → O(n) instead of O(n²).

## Ladder

1. [Opposite ends](01-opposite-ends.md) — converge from both sides (sorted arrays, kSum)
2. [Fast/slow in-place](02-fast-slow-inplace.md) — partition and compact arrays
3. [Linked-list pointers](03-linked-list-pointers.md) — cycle, middle, nth-from-end
4. [Greedy & hard](04-greedy-and-hard.md) — partition labels, trapping rain water

## Core idea

Sorted input + "find a pair/triple" → opposite pointers. In-place removal → slow writes, fast reads.

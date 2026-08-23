# 04. Sliding Window

Extends two pointers: a window `[left, right]` that grows/shrinks over a contiguous run.

## Ladder

1. [Fixed window](01-fixed-window.md) — window of size k slides
2. [Dynamic window](02-dynamic-window.md) — grow right, shrink left on violation
3. [At-most-K & counting](03-at-most-k-and-counting.md) — exactly-K = atMost(K) − atMost(K-1)
4. [Deque & hard](04-deque-and-hard.md) — monotonic deque, min-window

## Core idea

"Longest/shortest/count of contiguous subarray with property X" → sliding window. Keep window valid by shrinking `left`.

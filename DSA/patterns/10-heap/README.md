# 10. Heap / Priority Queue

O(log n) insert + O(1) peek of the min/max. The tool for "top-K", "kth", "median", and greedy scheduling.

## Ladder

1. [Top-K & kth](01-top-k.md) — size-K heap, quickselect alt
2. [Greedy scheduling](02-greedy-scheduling.md) — pick best-next repeatedly
3. [Two heaps](03-two-heaps.md) — median, capital, streaming
4. [Intervals, hard & design](04-intervals-hard-design.md) — merge-k, skyline, Twitter

## Core idea

"Kth largest / top K" → heap of size K (min-heap for largest). "Median of a stream" → two heaps. "Always take the smallest/largest next" → greedy heap.

# Binary Search — On the Answer

The most important interview variant: binary search the *result*, not an index.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 875 | Medium | Koko Eating Bananas | Min speed s.t. finishes in h | Amazon, Google, Facebook |
| 1011 | Medium | Capacity To Ship Packages Within D Days | Min capacity feasible | Amazon, Google |
| 410 | Hard | Split Array Largest Sum | Min largest-subarray-sum | Amazon, Google |
| 774 | Hard | Minimize Max Distance to Gas Station | Binary search on real answer | Google, Amazon |
| 658 | Medium | Find K Closest Elements | Binary search window start | Amazon, Google |
| 981 | Medium | Time Based Key-Value Store | Sorted timestamps + bsearch | Amazon, Google, Meta |
| 4 | Hard | Median of Two Sorted Arrays | Partition binary search | Google, Amazon, Meta, Goldman Sachs |

**Key skill**: define `canDo(x)` monotonic, then find the boundary — same code, only the predicate changes.

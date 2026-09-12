# Prefix Sum — Difference Array & 2D

Range updates in O(1); 2D prefix for submatrix sums.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 1109 | Medium | Corporate Flight Bookings | Difference array | Amazon, Google |
| 1094 | Medium | Car Pooling | Difference array on timeline | Amazon |
| 370 | Medium | Range Addition | Difference array | Amazon, Google |
| 304 | Medium | Range Sum Query 2D — Immutable | 2D prefix sum | Amazon, Google |
| 1314 | Medium | Matrix Block Sum | 2D prefix sum | Amazon |
| 1343 | Medium | # Subarrays Size K Avg ≥ Threshold | Fixed window sum | Amazon |
| 209 | Medium | Minimum Size Subarray Sum | Prefix / window | Amazon, Google, Facebook |
| 1220 | Hard | Count Vowels Permutation | DP transition (prefix-like) | Amazon, Google |

**Key skill**: difference array — add `+v` at `l`, `−v` at `r+1`; one prefix pass materializes all range adds.

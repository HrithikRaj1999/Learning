# Prefix Sum + HashMap

Count/find subarrays by storing seen prefix sums.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 560 | Medium | Subarray Sum Equals K | Map of prefix-sum counts | Amazon, Google, Meta, Facebook |
| 525 | Medium | Contiguous Array | Map balance (0→−1) first index | Amazon, Facebook |
| 930 | Medium | Binary Subarrays With Sum | Prefix count / atMost | Amazon |
| 325 | Medium | Maximum Size Subarray Sum Equals k | Map first index of prefix | Amazon, Facebook |
| 523 | Medium | Continuous Subarray Sum | Prefix modulo k, map remainder | Amazon, Google, Facebook |
| 974 | Medium | Subarray Sums Divisible by K | Prefix modulo count | Amazon, Google |

**Key skill**: to find "sum = k", look up `prefix − k` in the map; for divisibility, key on `prefix % k`.

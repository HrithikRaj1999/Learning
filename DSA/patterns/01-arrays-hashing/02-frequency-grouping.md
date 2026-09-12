# Arrays & Hashing — Frequency & Grouping

Use a hash key to group items; use counts to rank.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 49 | Medium | Group Anagrams | Sorted-string / char-count key | Amazon, Bloomberg, Google, Meta |
| 347 | Medium | Top K Frequent Elements | Bucket sort by frequency | Google, Amazon, Meta, Apple |
| 451 | Medium | Sort Characters By Frequency | Frequency + bucket sort | Amazon, Google |

**Key skill**: canonical hash key (sorted string or count tuple) to collapse equivalents. Bucket sort beats a heap when counts are bounded → O(n).

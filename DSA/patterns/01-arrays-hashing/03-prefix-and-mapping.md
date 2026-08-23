# Arrays & Hashing — Prefix & Mapping Tricks

Prefix products, two-way mappings, and using the array's own indices as a hash.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 238 | Medium | Product of Array Except Self | Prefix × suffix, no division | Google, Amazon, Apple, Meta |
| 560 | Medium | Subarray Sum Equals K | Prefix sum + HashMap of counts | Amazon, Google, Meta, Facebook |
| 205 | Easy | Isomorphic Strings | Two-way char mapping | Amazon, LinkedIn, Bloomberg |
| 290 | Easy | Word Pattern | Bijection word↔char | Amazon, Bloomberg |
| 349 | Easy | Intersection of Two Arrays | Set intersection | Google, Amazon |
| 350 | Easy | Intersection of Two Arrays II | Frequency map min-count | Google, Amazon, Bloomberg |
| 448 | Easy | Find All Numbers Disappeared | Index marking (negate) | Google, Amazon |

**Key skill**: index-as-hash — mark `nums[abs(x)-1]` negative to record "seen" with O(1) extra space.

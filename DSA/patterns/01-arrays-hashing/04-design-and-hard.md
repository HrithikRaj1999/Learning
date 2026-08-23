# Arrays & Hashing — Design & Hard

O(1) data structures and index placement. Interview favorites.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 128 | Medium | Longest Consecutive Sequence | Set + sequence-start expansion (O(n)) | Google, Amazon, Bloomberg, Meta |
| 41 | Hard | First Missing Positive | Cyclic index placement, O(1) space | Amazon, Google, Microsoft |
| 271 | Medium | Encode and Decode Strings | Length-prefixed serialization | Google, Meta, Bloomberg |
| 706 | Easy | Design HashMap | Bucket array + chaining | Amazon, Google |
| 380 | Medium | Insert Delete GetRandom O(1) | HashMap + array swap-remove | Google, Amazon, Meta |

**Key skill**: swap-to-end deletion keeps an array dense for O(1) random access (LC 380). Cyclic sort places `n` at index `n-1` (LC 41).

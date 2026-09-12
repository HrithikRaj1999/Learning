# Bit — Advanced & Bitmask

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 137 | Medium | Single Number II | Bit-count mod 3 | Amazon, Google |
| 260 | Medium | Single Number III | XOR + lowest-set-bit split | Amazon, Google |
| 78 | Medium | Subsets | Iterate masks 0..2ⁿ | Amazon, Google, Meta |
| 318 | Medium | Maximum Product of Word Lengths | Bitmask of letters, AND==0 | Amazon, Google |
| 393 | Medium | UTF-8 Validation | Leading-bit parsing | Amazon |
| 89 | Medium | Gray Code | `i ^ (i >> 1)` | Amazon, Google |
| 1318 | Medium | Minimum Flips to Make a OR b Equal to c | Per-bit compare | Amazon |

**Key skill**: LC 260 — XOR all gives `a^b`; its lowest set bit differs between the two singles, so partition and XOR each group.

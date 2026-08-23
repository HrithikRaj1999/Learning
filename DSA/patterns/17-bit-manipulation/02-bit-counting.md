# Bit — Counting

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 191 | Easy | Number of 1 Bits | `x & (x-1)` loop | Amazon, Apple, Microsoft |
| 338 | Easy | Counting Bits | dp[i] = dp[i>>1] + (i&1) | Amazon, Google |
| 190 | Easy | Reverse Bits | Shift + OR 32 times | Amazon, Apple |
| 477 | Medium | Total Hamming Distance | Count per-bit 0s×1s | Amazon, Google |

**Key skill**: `x & (x-1)` clears the lowest set bit — loop count = number of set bits, faster than checking all 32 (LC 191).

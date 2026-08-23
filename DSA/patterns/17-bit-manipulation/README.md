# 17. Bit Manipulation

Bit tricks for O(1) space and fast set operations. Know the identities cold.

## Ladder

1. [XOR basics](01-xor-basics.md) — self-cancel, missing number
2. [Bit counting](02-bit-counting.md) — popcount, DP on bits
3. [Power & arithmetic](03-power-arithmetic.md) — power-of-two, add without `+`
4. [Advanced & bitmask](04-advanced-bitmask.md) — subsets, state compression

## Identities to memorize

```text
x ^ x = 0        x ^ 0 = x        (XOR cancels pairs)
x & (x-1)        drops lowest set bit
x & (-x)         isolates lowest set bit
x & 1            parity (odd/even)
x >> 1           divide by 2
1 << k           bit mask for position k
```

## Cue

"Find the single/missing number", "count bits", "power of two", "subsets via mask", "no extra space" → bit manipulation.

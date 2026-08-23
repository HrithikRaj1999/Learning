# 05. Prefix Sum & Kadane

Precompute cumulative sums so any range query is O(1). Kadane is the running-best DP for max subarray.

## Ladder

1. [Prefix basics](01-prefix-basics.md) — range sums, pivot, product
2. [Kadane](02-kadane.md) — max subarray / product / circular
3. [Prefix + HashMap](03-prefix-hashmap.md) — count subarrays with sum = k
4. [Difference array & 2D](04-difference-array-2d.md) — range updates, matrix sums

## Core idea

`sum(i..j) = prefix[j+1] − prefix[i]`. To count subarrays with sum k, store prefix counts in a map.

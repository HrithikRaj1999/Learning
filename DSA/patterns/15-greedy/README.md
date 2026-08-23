# 15. Greedy

Make the locally optimal choice and never revisit. Only correct when a local choice provably leads to the global optimum.

## Ladder

1. [Jump & reach](01-jump-reach.md) — reachability, min jumps
2. [Interval & sort greedy](02-intervals-sort.md) — sort, then take
3. [Counting & stack greedy](03-counting-stack.md) — change, candy, remove-k
4. [Profit & heap](04-profit-heap.md) — stock, triplets, scheduling

## Cue vs DP

Greedy when a *sorting + single sweep* or *exchange argument* proves optimality. If a choice's value depends on future choices, it's usually DP, not greedy. **Always sanity-check greedy with a counterexample.**

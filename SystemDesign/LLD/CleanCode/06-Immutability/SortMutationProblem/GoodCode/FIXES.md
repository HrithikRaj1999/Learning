# Immutability — Sort Mutation — Fix Hints
> `sort`/`reverse`/`splice` mutate; copy first.
## Wrong now
`topThree` calls `scores.sort(...)` which reorders the CALLER's array as a side
effect.
## Hints
- [ ] Copy before sorting: `[...scores].sort(...)` (or `scores.toSorted(...)` where available).
- [ ] Same care for `reverse`/`splice` — prefer `toReversed`/`slice`/`with`.
- [ ] Type params `readonly number[]` so the compiler blocks in-place mutators.
## Done-when
- [ ] Calling `topThree` leaves the input array unchanged.

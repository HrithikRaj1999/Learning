# Clean Code — Immutability Fix Hints
> Don't mutate inputs or shared state. Return new values.
## Wrong now
`addItem` pushes into the caller's array; `applyDiscount` overwrites the input
array. The original objects change behind the caller's back → hidden bugs,
aliasing surprises.
## Hints
- [ ] Return a NEW object/array instead of mutating: spread (`[...cart.items, item]`,
      `{ ...cart, items: [...] }`), `map`, `filter` — not `push`/index assignment.
- [ ] Treat parameters as read-only. Mark them `readonly` / use
      `ReadonlyArray<T>` to let the compiler enforce it.
- [ ] `Object.freeze` (or `as const`) for true constants.
- [ ] If a big structure makes copies costly, reach for a structural-sharing lib
      (Immer/Immutable.js) — mention the trade-off.
## Done-when
- [ ] Calling these functions never alters the caller's original data.
- [ ] Inputs are typed `readonly`; tests assert originals are unchanged.

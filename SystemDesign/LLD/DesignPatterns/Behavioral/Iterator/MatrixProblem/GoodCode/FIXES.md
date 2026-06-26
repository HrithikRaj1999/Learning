# Iterator — Matrix — Fix Hints
> Iterate cells without exposing the 2D array.
## Wrong now
`data` is public `number[][]`; consumers write nested loops tied to row-major
storage. Switching to a flat array or sparse map breaks them.
## Hints
- [ ] Make `data` private; expose `get(r,c)`/`set(r,c)` and an iterator.
- [ ] Implement `[Symbol.iterator]()` yielding `{ row, col, value }` in a defined order.
- [ ] Consumers use `for (const cell of matrix)`; storage is hidden.
## Done-when
- [ ] No consumer indexes `data`; storage can change freely.

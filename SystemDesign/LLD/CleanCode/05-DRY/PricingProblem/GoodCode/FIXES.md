# Clean Code — DRY Fix Hints
> One piece of knowledge = one place. Duplication breeds drift + bug-multiplication.
## Wrong now
Three near-identical `priceWithTax*` functions differ only by rate. Email
validation copy-pasted in `createUser` and `updateUser` (will drift).
## Hints
- [ ] Parameterize the variation: one `priceWithTax(price, taxRate)` (and a named
      `SHIPPING_FEE` constant instead of literal `5`).
- [ ] Keep tax rates in a lookup (`Map`/config), not in function names.
- [ ] Extract `validateEmail(email)` once; both create/update call it.
- [ ] But beware false DRY: only merge code that shares the same REASON to change,
      not code that merely looks similar today (don't over-couple).
## Done-when
- [ ] A tax-rule or validation change is a single edit.
- [ ] No copy-pasted logic blocks remain.

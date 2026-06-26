# LSP — Bank Account Problem — Fix Hints
> A subtype must honor every promise the base type makes.
## Wrong now
`FixedDeposit.withdraw()` throws, so `payOut(acc)` (written against `Account`)
crashes. The subtype strengthened a precondition the base didn't have.
## Hints
- [ ] Don't model "can't withdraw" by overriding-to-throw. Re-split the hierarchy.
- [ ] Base `Account` = deposit + balance. Add a separate `Withdrawable` interface
      with `withdraw()`; only accounts that actually allow it implement it.
- [ ] `payOut` accepts `Withdrawable`, not `Account` → a `FixedDeposit` can't be
      passed (compile-time safety, no runtime throw).
- [ ] Or model maturity as state and expose `withdraw` only when eligible.
## Done-when
- [ ] A function over the base/interface works for every subtype, no try/catch.

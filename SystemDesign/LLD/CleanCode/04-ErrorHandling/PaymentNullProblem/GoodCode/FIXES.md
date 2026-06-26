# Error Handling — Payment Null — Fix Hints
> `null` on failure pushes the crash far from the cause.
## Wrong now
`charge` returns `null` for two different failures; the caller dereferences
`.id` and crashes with no idea why.
## Hints
- [ ] Throw specific errors (`InvalidCardError`, `InvalidAmountError`) OR return a
      typed `Result` carrying the reason.
- [ ] Distinguish failure causes — a single `null` erases information.
- [ ] Validate inputs at the boundary; fail fast with a clear message.
## Done-when
- [ ] Callers can't deref a null; each failure mode is distinguishable.

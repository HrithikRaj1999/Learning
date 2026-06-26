# Naming — Banking Problem — Fix Hints
> Names reveal intent; no decoding required.
## Wrong now
`proc`, `acc.b`, `amt`, `t === 1/2`, `st` — meaningless. Transaction types are
magic numbers.
## Hints
- [ ] `proc` → `processTransaction`; `acc.b` → `account.balance`; `st` → `account.status`.
- [ ] Replace `t === 1/2` with a `TransactionType` enum (`Deposit`, `Withdraw`).
- [ ] Return type should express outcome (`TransactionResult`), not a bare boolean.
- [ ] Booleans/predicates: `hasSufficientFunds`.
## Done-when
- [ ] No magic codes; each name states its role.

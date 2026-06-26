# Guard Clauses — Auth Check — Fix Hints
> Reject invalid cases first; keep the grant flat + last.
## Wrong now
5-deep nesting; the "can edit" result is buried; each `else` sits far from its
condition.
## Hints
- [ ] Invert each into an early return: `if (!user) return "no user";` etc.
- [ ] Stack guards top-to-bottom; after them, return the grant un-indented.
- [ ] No `else` needed after a returning guard.
- [ ] Consider a small `isOwnerOrAdmin(user, doc)` predicate to flatten further.
## Done-when
- [ ] Max nesting 1–2; the success path is the last line.

# Chain of Responsibility — Expense Approval — Fix Hints
> Each approver handles its limit or passes the request up.
## Wrong now
One if/else ladder hardcodes every approval tier + limits.
## Hints
- [ ] Abstract `Approver` with `setNext()` and `approve(amount)`.
- [ ] `TeamLead`, `Manager`, `Director`, `VP` each handle up to their limit,
      else delegate to `next`.
- [ ] Build the chain; client submits to the first approver.
- [ ] New tier = insert a handler; limits live in their own class.
## Done-when
- [ ] No central amount switch; reordering = re-linking the chain.

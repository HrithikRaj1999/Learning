# Clean Code — Guard Clauses Fix Hints
> Handle invalid cases first and return early. Keep the happy path flat + last.
## Wrong now
5 levels of nested `if/else` ("arrow code"). The real work is buried deepest;
the `else` branches are far from their conditions.
## Hints
- [ ] Invert each condition into an early return (a guard):
      `if (!user) return "no user";` then continue at the top level.
- [ ] Stack the guards top-to-bottom; after them, the happy path is un-indented.
- [ ] Keep nesting ≤ 2–3 levels. No `else` needed after a guard that returns.
- [ ] Consider extracting the eligibility checks into a small predicate function
      if the list grows.
## Done-when
- [ ] Max nesting depth is 1–2.
- [ ] The success line is the last, least-indented statement.
- [ ] No `else` blocks that just hold error returns.

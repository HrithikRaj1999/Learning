# Builder — Fix Hints
> Intent: construct a complex object step by step; readable, validated, immutable result.
## Wrong now
8-arg constructor of mostly booleans → call site is unreadable, flags easily
swapped, illegal combos uncaught.
## Hints
- [ ] Create a `PizzaBuilder` with chainable methods: `.size()`, `.addCheese()`,
      `.addPepperoni()` … each returns `this`.
- [ ] A final `.build()` validates invariants (e.g. reject stuffedCrust + glutenFree)
      and returns an immutable `Pizza`.
- [ ] Keep `Pizza`'s constructor narrow/private; only the builder calls it.
- [ ] Call site reads like prose: `new PizzaBuilder().size("L").addCheese().build()`.
## Watch out
- Don't reach for Builder when 2-3 params suffice — that's over-engineering.
- A plain options object (`{ size, cheese }`) is the lightweight TS alternative; mention it.

# OCP — Fix Hints (Open/Closed Principle)

> Goal: add new behavior by **adding a class**, never by editing a tested one.

## What is wrong
`calculate()` and `cost()` both `switch` over `CustomerType`. A new tier means
editing both switches → modification of working code → regression risk. Two
switches over the same enum is the textbook OCP smell.

## Hints to fix (no code given)
- [ ] Define a `DiscountPolicy` interface: `apply(amount): number`.
- [ ] One concrete policy per tier: `RegularDiscount`, `PremiumDiscount`,
      `VipDiscount`. Each owns its own rule.
- [ ] `DiscountCalculator` receives a policy (constructor/strategy) and just
      calls `policy.apply(amount)`. It never knows the tier list.
- [ ] New tier (`StudentDiscount`) = **new file only**. Zero edits to existing classes.
- [ ] Resolve the type→policy mapping at the edge (a registry/`Map` or factory),
      not with a switch buried in business logic.
- [ ] Kill the silent `default` bug: unknown tier should fail loud, not full-price.

## Mind the line
- This is OCP via the **Strategy pattern**. Note how closely they overlap.
- Do NOT over-engineer: only abstract the axis that actually varies (the discount rule).

## Done-when checklist
- [ ] Adding a tier requires creating one class and registering it — nothing else.
- [ ] No `switch`/`if-else` ladder over `CustomerType` remains in calculators.
- [ ] Existing policy classes are untouched when you extend.

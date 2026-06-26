# Visitor — Employee Report — Fix Hints
> Roll up different metrics over a fixed set of roles via visitors.
## Wrong now
`annualCost` (and future `bonus`, `taxReport`) each `instanceof`-branch over roles.
## Hints
- [ ] `EmployeeVisitor` interface: `visitEngineer`, `visitManager`, `visitContractor`.
- [ ] Each role implements `accept(visitor)`.
- [ ] `CostVisitor`, `BonusVisitor`, `TaxVisitor` are new ops; role classes unchanged.
## Done-when
- [ ] New metric = one visitor; roles never edited for it.

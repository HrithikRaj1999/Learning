# Composite — Org Chart Problem — Fix Hints
> Treat an individual and a manager-with-reports uniformly.
## Wrong now
`totalSalary` branches `instanceof` and owns the recursion. Every roll-up
(headcount, salary) repeats the branching.
## Hints
- [ ] `OrgNode` interface: `totalSalary(): number` (and `headcount()`).
- [ ] `Employee.totalSalary()` returns own salary (leaf).
- [ ] `Manager.totalSalary()` = own + sum of `report.totalSalary()` (composite).
- [ ] Client calls `node.totalSalary()` — no instanceof, no recursion in client.
## Done-when
- [ ] New roll-up = one method on the interface; no branching.

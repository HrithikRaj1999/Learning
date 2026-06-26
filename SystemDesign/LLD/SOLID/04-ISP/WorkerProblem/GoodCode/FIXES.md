# ISP — Worker Problem — Fix Hints
> Split a fat interface along the lines that clients actually use.
## Wrong now
`IWorker` forces `RobotWorker` to stub eat/sleep/takeBreak with throws. Any
client holding `IWorker` can't trust those methods.
## Hints
- [ ] Split by capability: `Workable { work() }`, `Feedable { eat() }`,
      `Restable { sleep(); takeBreak() }`.
- [ ] `HumanWorker implements Workable, Feedable, Restable`.
- [ ] `RobotWorker implements Workable` only — no stubs, no throws.
- [ ] A scheduler that only assigns tasks depends on `Workable`, nothing more.
## Done-when
- [ ] No class stubs/throws a method it can't honor.

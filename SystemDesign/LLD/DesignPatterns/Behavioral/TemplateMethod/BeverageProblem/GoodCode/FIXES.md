# Template Method — Beverage — Fix Hints
> The GoF caffeine example: shared brew skeleton, varying steps.
## Wrong now
`Tea` and `Coffee` repeat boil/pour; only brew + condiment differ. Skeleton change
edits both.
## Hints
- [ ] Abstract `CaffeineBeverage` with a concrete `prepare()` (template method)
      calling: boilWater → brew → pourInCup → addCondiments.
- [ ] `boilWater`/`pourInCup` are concrete (shared).
- [ ] `brew` + `addCondiments` are abstract; `Tea`/`Coffee` override them.
- [ ] Optional "hook" (e.g. `wantsCondiments()`) for conditional steps.
## Done-when
- [ ] Skeleton lives once; subclasses override only what varies.

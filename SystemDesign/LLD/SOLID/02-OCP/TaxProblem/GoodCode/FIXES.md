# OCP — Tax Problem — Fix Hints
> Tax rules change constantly; isolate each so the core never reopens.
## Wrong now
One `switch` over region; `default: 0` silently under-charges unknown regions
(a compliance bug). New region edits a widely-used class.
## Hints
- [ ] `TaxRule` interface: `appliesTo(region)` + `rate()` (or `compute(amount)`).
- [ ] One rule class per region; register them in a `Map`/list.
- [ ] `TaxCalculator` finds the matching rule; if none, FAIL LOUD (throw), never 0.
- [ ] New jurisdiction = new rule class, registered. No core edits.
## Done-when
- [ ] Unknown region throws, not silently 0.
- [ ] Adding a region needs no change to existing rules.

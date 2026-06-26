# Strategy — Shipping Cost — Fix Hints
> Each carrier's rate formula is its own strategy.
## Wrong now
`cost()` switches on carrier with rate formulas inline; bad default (999) hides
errors; new carrier edits the class.
## Hints
- [ ] `ShippingStrategy` interface: `cost(weightKg): number`.
- [ ] `FedExStrategy`, `UpsStrategy`, `DhlStrategy` own their formulas.
- [ ] `ShippingCalculator` is given a strategy; unknown carrier fails loud at selection.
- [ ] Resolve carrier→strategy in a registry at the edge.
## Done-when
- [ ] No carrier switch; no silent default; new carrier = new class.

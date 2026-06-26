# Strategy — Fix Hints
> Intent: define a family of interchangeable algorithms; pick one at runtime.
## Wrong now
`pay()` switches over method and inlines each algorithm. New method edits this
class; algorithms can't be reused/tested in isolation.
## Hints
- [ ] Define a `PaymentStrategy` interface: `pay(amount)`.
- [ ] One class per algorithm: `CardStrategy`, `PaypalStrategy`, `CryptoStrategy`.
- [ ] `PaymentProcessor` receives a strategy (constructor or per-call) and calls
      `strategy.pay(amount)` — no switch, no knowledge of concretes.
- [ ] New method = new strategy class. Processor untouched (OCP).
- [ ] Resolve string→strategy at the edge (registry/Map), not in business logic.
## Note
- This is the runtime twin of OCP's Open/Closed example. Compare them.

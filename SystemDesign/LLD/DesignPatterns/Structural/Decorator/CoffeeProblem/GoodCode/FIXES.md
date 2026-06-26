# Decorator — Fix Hints
> Intent: add responsibilities to an object dynamically by wrapping it.
## Wrong now
One class per add-on combination → 2^N classes, prices duplicated and drift-prone.
## Hints
- [ ] Define a `Beverage` interface: `cost()`, `desc()`.
- [ ] `Coffee` is the concrete base component.
- [ ] Create an abstract `AddOnDecorator` that HOLDS a `Beverage` and implements
      `Beverage` (wrapper).
- [ ] `Milk`, `Sugar`, `Whip` extend it; each adds to `inner.cost()` and
      `inner.desc()`.
- [ ] Compose at runtime: `new Whip(new Milk(new Coffee()))`. Any combo, no new class.
## vs Inheritance
- Decorator = composition at runtime; subclassing = fixed at compile time.
  This is the OCP-friendly way to add features.

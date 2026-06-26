# Factory Method — Fix Hints
> Intent: defer instantiation to subclasses/a method; client codes to an interface.
## Wrong now
`planDelivery` knows every concrete class and `new`s them in an if/else. Adding
"air" edits this method.
## Hints
- [ ] Define a `Transport` interface with `deliver()`.
- [ ] Make `Logistics` abstract with an abstract `createTransport(): Transport`
      (the factory method). `planDelivery()` calls it, stays generic.
- [ ] Subclasses `RoadLogistics`/`SeaLogistics` override `createTransport()` to
      return the right concrete.
- [ ] Client picks a subclass; business logic never sees `new`.
- [ ] New transport = new Transport impl + new Logistics subclass. No edits.
## vs Abstract Factory
- Factory Method = one product, chosen by subclass. Abstract Factory = families
  of related products. Don't confuse them.

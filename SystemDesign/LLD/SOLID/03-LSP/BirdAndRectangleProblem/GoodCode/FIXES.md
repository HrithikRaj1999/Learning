# LSP — Fix Hints (Liskov Substitution Principle)

> Goal: any subtype can replace its base type and **nothing breaks**.

## What is wrong
- `Penguin extends Bird` but `fly()` throws. Code written against `Bird`
  (`makeAllFly`) crashes when handed a `Penguin`. The subtype removed a
  guarantee the base type promised.
- `Square extends Rectangle` breaks `Rectangle`'s invariant ("width and height
  vary independently"). A function that sets width then asserts area is wrong for Square.

## Hints to fix (no code given)
- [ ] Stop modeling capability through inheritance you can't honor. Split the
      hierarchy: a base `Bird`, and a separate `Flyable` ability
      (interface) implemented only by birds that actually fly.
- [ ] `makeAllFly` should accept `Flyable[]`, not `Bird[]`. A `Penguin` simply
      isn't `Flyable`, so it can't be passed — compile-time safety, no throw.
- [ ] For Square/Rectangle: prefer **composition over inheritance**, or model
      both as an immutable `Shape` with an `area()` and no shared mutable setters.
      A `Square` is not a behavioral `Rectangle`; don't force the IS-A.

## The test that proves it
- [ ] Write one function against the base/interface. It must give correct
      results for **every** subtype with no `instanceof` checks and no try/catch
      guarding against a subtype.

## Smells that signal LSP breaks
- Overrides that `throw`, return `null`, or no-op.
- `if (x instanceof Subtype)` in client code.
- Strengthened preconditions / weakened postconditions in an override.

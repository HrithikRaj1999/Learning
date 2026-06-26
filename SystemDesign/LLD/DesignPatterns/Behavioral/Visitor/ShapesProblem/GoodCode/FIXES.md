# Visitor — Fix Hints
> Intent: add new operations to an object structure WITHOUT changing the element
> classes.
## Wrong now
Each new operation (`area`, `perimeter`, `export`) is its own `instanceof` ladder.
Operations are scattered; forgetting a shape is a silent gap.
## Hints
- [ ] Define a `ShapeVisitor` interface with a method per element:
      `visitCircle(c)`, `visitSquare(s)`, `visitTriangle(t)`.
- [ ] Each shape implements `accept(visitor)` and calls back the matching
      `visit*` (double dispatch) — this replaces `instanceof`.
- [ ] A new operation = a new visitor class (`AreaVisitor`, `PerimeterVisitor`),
      element classes untouched.
- [ ] The compiler now forces every visitor to handle every shape (no silent gaps).
## Trade-off (state it!)
- Visitor makes adding OPERATIONS easy but adding a new ELEMENT hard (must touch
  every visitor). Use it when the element set is stable and operations grow.

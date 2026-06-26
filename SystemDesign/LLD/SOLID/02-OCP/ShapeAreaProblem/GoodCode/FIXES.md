# OCP — Shape Area Problem — Fix Hints
> Add a shape by adding a class, not by editing a switch.
## Wrong now
`area()` switches on `type`. New shape edits this method; `perimeter()` will
duplicate the switch.
## Hints
- [ ] Define a `Shape` interface with `area(): number` (and `perimeter()`).
- [ ] `Circle`, `Rectangle`, `Triangle` each implement their own math.
- [ ] `AreaCalculator` just calls `shape.area()` — polymorphism replaces switch.
- [ ] New shape = new class. Existing classes untouched.
## Done-when
- [ ] No `switch (type)` anywhere; adding Hexagon = one new file.

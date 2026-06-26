# Abstract Factory — Fix Hints
> Intent: create FAMILIES of related objects without naming concretes; guarantee
> they match.
## Wrong now
OS checks duplicated per widget; nothing stops mixing Win + Mac widgets (the bad
code literally does). No family guarantee.
## Hints
- [ ] Define product interfaces: `Button`, `Checkbox`.
- [ ] Define a `GuiFactory` interface: `createButton()`, `createCheckbox()`.
- [ ] Concrete factories `WinFactory`, `MacFactory` return only their own family.
- [ ] Client receives ONE factory and asks it for all widgets → impossible to mix.
- [ ] Pick the factory once at startup (composition root).
## Done-when
- [ ] No `if (os===...)` inside widget-building code.
- [ ] A factory can only produce a consistent family; mismatches are unrepresentable.

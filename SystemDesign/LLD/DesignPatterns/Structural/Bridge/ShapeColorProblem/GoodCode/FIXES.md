# Bridge — Fix Hints
> Intent: split an abstraction from its implementation so both vary independently.
## Wrong now
`{Red,Blue} x {Circle,Square}` baked into class names → M*N explosion. Each new
color or shape multiplies classes.
## Hints
- [ ] Identify the two independent axes: Shape (abstraction) and Color/Renderer
      (implementation).
- [ ] Define a `Color`/`Renderer` interface (the implementation side).
- [ ] `Shape` holds a reference to a `Color` (the "bridge") and delegates to it.
- [ ] `Circle`/`Square` extend `Shape`; `Red`/`Blue` implement `Color`.
- [ ] Now M shapes + N colors = M+N classes, composed at runtime.
## Done-when
- [ ] Adding a color adds ONE class, works with every existing shape automatically.

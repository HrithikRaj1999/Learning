# Composite — UI Component Problem — Fix Hints
> Leaf widgets and container panels implement the same component interface.
## Wrong now
`draw` branches `instanceof` Widget vs Panel and recurses in the client. Every
operation (draw, measure, hitTest) repeats the branching.
## Hints
- [ ] `UIComponent` interface: `draw(): string` (and `measure()`, etc.).
- [ ] `Widget.draw()` renders itself; `Panel.draw()` composes children's draw().
- [ ] A panel can hold widgets AND panels uniformly (it's a `UIComponent` list).
- [ ] Client calls `root.draw()` only.
## Done-when
- [ ] No instanceof; nesting works to any depth via one interface.

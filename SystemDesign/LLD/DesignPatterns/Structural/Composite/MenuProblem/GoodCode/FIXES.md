# Composite — Menu Problem — Fix Hints
> A menu item and a submenu share one interface.
## Wrong now
`render` uses `instanceof` to branch item vs submenu and owns the recursion.
## Hints
- [ ] `MenuComponent` interface: `render(indent): string` (and `price()`).
- [ ] `MenuItem` renders itself (leaf); `Submenu` renders header + children
      (composite, recursion inside).
- [ ] Client just calls `root.render()`.
## Done-when
- [ ] No instanceof; adding "total price" is one interface method.

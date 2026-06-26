# Memento — Canvas Undo — Fix Hints
> Capture canvas state opaquely; don't expose the shape list.
## Wrong now
`shapes` is public so undo can `pop()` it. Internals leak; undo breaks if storage
changes (e.g. layers, z-order).
## Hints
- [ ] Make `shapes` private; add `save(): Memento` / `restore(m)` on the canvas.
- [ ] History stack (caretaker) stores mementos; undo restores the previous one.
- [ ] Memento copies state deeply so restoring is independent.
## Done-when
- [ ] Undo works without any public access to canvas internals.

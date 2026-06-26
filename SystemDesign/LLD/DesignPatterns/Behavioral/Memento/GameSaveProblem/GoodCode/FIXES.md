# Memento — Game Save — Fix Hints
> The game makes its own snapshot; outsiders just hold it.
## Wrong now
External code copies fields by hand and shares the `inventory` array by reference,
so later play corrupts the save. New fields get forgotten.
## Hints
- [ ] `GameState.save(): Memento` creates a deep, opaque snapshot of ALL its state.
- [ ] `GameState.load(m)` restores from it.
- [ ] A `SaveManager` (caretaker) stores mementos without inspecting them.
- [ ] Make fields private; only the game reads/writes them.
## Done-when
- [ ] Saves are immutable + independent; later play can't mutate them.

# Command — Text Editor Undo — Fix Hints
> Reify each edit as a command with execute()/undo().
## Wrong now
Edits mutate `content` directly with no history → undo impossible without rewrite.
## Hints
- [ ] `Command` interface: `execute()` + `undo()`.
- [ ] `TypeCommand`, `DeleteCommand` hold the data needed to reverse themselves.
- [ ] Editor runs `cmd.execute()` and pushes it on a history stack.
- [ ] Undo pops + calls `undo()`; redo re-pushes.
## Done-when
- [ ] Every action is undoable; redo works; no direct mutation in the editor API.

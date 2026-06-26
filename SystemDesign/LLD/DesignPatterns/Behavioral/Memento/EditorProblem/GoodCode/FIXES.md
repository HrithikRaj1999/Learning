# Memento — Fix Hints
> Intent: capture/restore an object's state without exposing its internals.
## Wrong now
Undo code reads/writes the editor's public fields by hand. Encapsulation broken;
add a field → undo silently forgets it.
## Hints
- [ ] The originator (`TextEditor`) creates a `save(): Memento` snapshot of its
      OWN full state, and `restore(m: Memento)` to roll back.
- [ ] `Memento` is opaque — exposes nothing about the internals to outsiders.
- [ ] A `Caretaker` (history/undo stack) stores mementos but never inspects them.
- [ ] Make editor fields private again; only the editor reads/writes them.
- [ ] Adding a new field → update `save`/`restore` once; undo stays correct.
## Done-when
- [ ] Undo stack holds opaque mementos; caretaker can't read editor internals.

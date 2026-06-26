# Memento — Form Wizard — Fix Hints
> Snapshot the whole wizard state at each step for clean "back".
## Wrong now
"Back" manually copies a subset of fields (forgets `plan`); restore is inconsistent.
## Hints
- [ ] `Wizard.save(): Memento` captures full state per step; `restore(m)` rolls back.
- [ ] Push a memento onto a stack on each "next"; pop on "back".
- [ ] Caretaker (the wizard controller) never reads memento internals.
## Done-when
- [ ] "Back" restores every field exactly; adding a field can't be forgotten.

# Factory Method — Dialog Button Problem — Fix Hints
> The GoF canonical example: Dialog defers Button creation to subclasses.
## Wrong now
`Dialog.render()` branches on platform to `new` a button. Creation tangled with
rendering; new platform edits Dialog.
## Hints
- [ ] `Button` interface with `render()`.
- [ ] Abstract `Dialog` with abstract `createButton(): Button`; `render()` calls it.
- [ ] `WindowsDialog`/`WebDialog` override `createButton()`.
- [ ] Pick the dialog subclass once at startup.
## Done-when
- [ ] `Dialog.render()` has no platform branch and no `new`.

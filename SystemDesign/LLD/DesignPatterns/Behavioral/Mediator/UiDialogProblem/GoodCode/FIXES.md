# Mediator — UI Dialog — Fix Hints
> Widgets report to a dialog mediator that updates the rest.
## Wrong now
`ListBox` directly flips `okButton.enabled`. As widgets grow, every interaction
adds another direct reference — the classic GoF dialog problem.
## Hints
- [ ] `DialogMediator` with `widgetChanged(sender)`.
- [ ] A concrete dialog knows all widgets and encodes interaction rules centrally.
- [ ] Widgets call `mediator.widgetChanged(this)`; they don't touch siblings.
## Done-when
- [ ] No widget references another widget directly.

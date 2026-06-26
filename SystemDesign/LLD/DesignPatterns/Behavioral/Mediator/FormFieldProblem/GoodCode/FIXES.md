# Mediator — Form Field — Fix Hints
> Fields notify a mediator; the mediator coordinates the others.
## Wrong now
`Checkbox` holds a direct ref to `TextInput` and toggles it. Each new
interdependency wires more fields together → unmaintainable.
## Hints
- [ ] `FormMediator` with `notify(sender, event)`.
- [ ] A `Form implements FormMediator` knows all fields and encodes the rules
      ("when agree toggles, enable/disable the input") in one place.
- [ ] Fields hold only the mediator ref and call `mediator.notify(this, "toggle")`.
- [ ] Fields never reference each other.
## Done-when
- [ ] All cross-field rules live in the mediator; fields are decoupled.

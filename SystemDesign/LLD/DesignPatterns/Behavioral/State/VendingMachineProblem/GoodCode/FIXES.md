# State — Fix Hints
> Intent: object changes behavior when its internal state changes — as if it
> changed class.
## Wrong now
A `state` string is switched on in every method. Same switch duplicated; adding
a state edits every method; transitions are scattered and easy to get wrong.
## Hints
- [ ] Define a `State` interface with the events as methods: `insertCoin()`,
      `pressButton()`.
- [ ] One class per state: `IdleState`, `HasMoneyState`, `DispensingState`. Each
      implements only its own behavior + decides the next state.
- [ ] `VendingMachine` holds a current `State` and delegates events to it
      (`this.state.insertCoin()`); transitions = `machine.setState(next)`.
- [ ] No switches; each state's transitions live in that state class.
## vs Strategy
- Same structure (delegate to an object) but State objects swap THEMSELVES based
  on transitions; Strategy is chosen by the client and usually fixed.

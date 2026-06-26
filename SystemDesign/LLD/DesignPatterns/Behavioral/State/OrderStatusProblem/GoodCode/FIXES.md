# State — Order Status — Fix Hints
> Each status is a state class with only its legal transitions.
## Wrong now
Every method switches on `status`; transition rules are scattered and easy to get
wrong (e.g. ship after cancel).
## Hints
- [ ] `OrderState` interface: `pay()`, `ship()`, `cancel()`.
- [ ] `PendingState`, `PaidState`, `ShippedState`, `CancelledState` implement only
      their legal moves; illegal ones throw/no-op clearly.
- [ ] `Order` delegates actions to its current state; transitions = swap the state.
## Done-when
- [ ] Illegal transitions are impossible by construction; no status switches.

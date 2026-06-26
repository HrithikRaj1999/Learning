# Immutability — Shared State — Fix Hints
> Replace state with new values; don't mutate a global in place.
## Wrong now
A mutable global `appState` is changed everywhere; no audit of transitions; hard
to debug and unsafe to share.
## Hints
- [ ] Make updates return a NEW state: `nextState = { ...state, user }`.
- [ ] Centralize transitions in a reducer-style function (one place applies changes).
- [ ] Treat state as `readonly`; the store swaps the reference, callers never mutate.
- [ ] Now each transition is traceable + testable (old in → new out).
## Done-when
- [ ] No in-place mutation of shared state; updates are pure transformations.

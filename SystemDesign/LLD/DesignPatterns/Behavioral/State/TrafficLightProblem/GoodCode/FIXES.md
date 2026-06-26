# State — Traffic Light — Fix Hints
> Each color is a state object that knows its successor.
## Wrong now
`next()` switches on a color string; transition order is implicit; new state edits
the switch.
## Hints
- [ ] `LightState` interface: `next(light): void` (sets the next state).
- [ ] `RedState`, `GreenState`, `YellowState` each set the machine to the next state.
- [ ] `TrafficLight` delegates `next()` to its current state.
- [ ] Adding "blinking" = a new state class inserted into the cycle.
## Done-when
- [ ] No color switch; each state owns its own transition.

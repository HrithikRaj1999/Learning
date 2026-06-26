# State — Media Player — Fix Hints
> The same button does different things per state — model the states.
## Wrong now
`playPause()` switches on a state string; behavior per state is tangled in one method.
## Hints
- [ ] `PlayerState` interface: `playPause(player)`, `stop(player)`.
- [ ] `StoppedState`, `PlayingState`, `PausedState` each implement their behavior +
      next state.
- [ ] `Player` delegates to its current state; transitions swap states.
## Done-when
- [ ] No state string switch; each state's behavior is isolated + testable.

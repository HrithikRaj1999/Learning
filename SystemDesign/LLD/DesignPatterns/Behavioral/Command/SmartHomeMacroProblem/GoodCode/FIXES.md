# Command — Smart Home Macro — Fix Hints
> Commands compose into user-defined macros (composite command).
## Wrong now
`goodNight()` is a hardcoded sequence; users can't build/reorder scenes or
schedule them.
## Hints
- [ ] `Command` interface: `execute()`.
- [ ] `LightsOffCommand`, `SetTempCommand`, `LockDoorCommand`.
- [ ] A `MacroCommand` holds a list of commands and executes them in order
      (Composite + Command).
- [ ] Users build macros from a command palette; a scheduler can run any command.
## Done-when
- [ ] New scenes are data (a list of commands), not new functions.

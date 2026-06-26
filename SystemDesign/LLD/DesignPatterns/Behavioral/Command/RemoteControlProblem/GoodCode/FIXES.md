# Command — Fix Hints
> Intent: turn a request into an object → enables undo, queue, log, macro.
## Wrong now
Button (invoker) is hardwired to receivers via if/else. No undo, no history,
buttons not reconfigurable.
## Hints
- [ ] Define a `Command` interface: `execute()` (and `undo()` if needed).
- [ ] One command class per action: `LightOnCommand`, `FanStartCommand`; each
      holds its receiver and calls the right method.
- [ ] `RemoteControl` stores `Command`s by slot and just calls `cmd.execute()` —
      it knows nothing about Light/Fan.
- [ ] For undo: push executed commands onto a history stack; `undo()` pops + reverses.
- [ ] Reconfiguring a button = assigning a different command object.
## Payoffs
- Queueing, logging, macro (composite of commands), redo all fall out of this.

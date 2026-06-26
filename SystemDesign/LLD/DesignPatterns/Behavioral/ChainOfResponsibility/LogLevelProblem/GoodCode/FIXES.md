# Chain of Responsibility — Log Level — Fix Hints
> Each handler decides whether to log this level, then forwards.
## Wrong now
One function repeats level comparisons to pick sinks; new sink or level edits it.
## Hints
- [ ] Abstract `LogHandler` with a `level` threshold, `setNext()`, `handle(level, msg)`.
- [ ] `ConsoleHandler`, `FileHandler`, `EmailHandler` each act if the message
      meets their level, then call `next`.
- [ ] Wire the chain console→file→email.
- [ ] New sink = new handler appended; no central conditionals.
## Done-when
- [ ] Adding a sink doesn't touch existing handlers.

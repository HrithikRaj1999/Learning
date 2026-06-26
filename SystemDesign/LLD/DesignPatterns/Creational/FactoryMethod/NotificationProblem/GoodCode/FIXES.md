# Factory Method — Notification Problem — Fix Hints
> Let a method/subclass decide which notification to create.
## Wrong now
`AlertManager.alert()` `new`s each concrete via if/else. Adding "push" edits this.
## Hints
- [ ] `Notification` interface with `send(msg)`.
- [ ] Abstract creator with `createNotification(): Notification` (factory method);
      `alert()` uses it generically.
- [ ] Subclasses `EmailAlertManager`/`SmsAlertManager` override the factory method.
- [ ] (Or a parameterized factory + registry if you don't want subclasses.)
## Done-when
- [ ] Business code never `new`s a concrete notification.

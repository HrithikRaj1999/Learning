# Decorator — Notifier Problem — Fix Hints
> Stack notification channels dynamically per user prefs.
## Wrong now
One class per channel subset → 2^N classes; can't honor arbitrary user prefs.
## Hints
- [ ] `Notifier` interface: `send(msg)`. A base `EmailNotifier` (or a no-op base).
- [ ] `NotifierDecorator` wraps an inner `Notifier`; calls inner.send() then adds
      its own channel.
- [ ] `SlackDecorator`, `SmsDecorator` add channels.
- [ ] Build the stack from a user's channel list at runtime.
## Done-when
- [ ] Any subset of channels works without new classes.

# OCP — Notification Channel Problem — Fix Hints
> New channel = new class, not a new branch.
## Wrong now
`send()` if/else over channel; per-channel rules (SMS 160-char cap is missing —
real bug) buried in branches. New channel edits this method.
## Hints
- [ ] `NotificationChannel` interface: `send(to, msg)`.
- [ ] `EmailChannel`, `SmsChannel` (enforce/split the 160-char limit here),
      `PushChannel` — each owns its own rules.
- [ ] `Notifier` holds/looks up channels in a registry; no branching on strings.
- [ ] Adding `SlackChannel` = new class + register. Core untouched.
## Done-when
- [ ] No channel `if/else`; SMS length handled in `SmsChannel` only.

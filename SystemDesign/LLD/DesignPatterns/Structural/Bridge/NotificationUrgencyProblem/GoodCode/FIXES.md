# Bridge — Notification Urgency Problem — Fix Hints
> Urgency policy and delivery channel are orthogonal.
## Wrong now
`{Normal,Critical} x {Email,Push}` → 4 classes; adding SMS or a new urgency
multiplies them; the "page on-call" rule is duplicated.
## Hints
- [ ] `Channel` interface (impl side): `send(msg)`.
- [ ] `EmailChannel`, `PushChannel`, `SmsChannel`.
- [ ] `Alert` (abstraction) holds a channel; `NormalAlert`/`CriticalAlert` extend
      it — critical adds escalation once, then delegates to the channel.
- [ ] Compose urgency x channel at runtime.
## Done-when
- [ ] Escalation logic lives in one place; channels add as single classes.

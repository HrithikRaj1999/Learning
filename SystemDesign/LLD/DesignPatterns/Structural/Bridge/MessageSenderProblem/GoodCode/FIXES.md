# Bridge — Message/Sender Problem — Fix Hints
> Separate WHAT (message type) from HOW (channel).
## Wrong now
`{Text,Image} x {Email,Sms}` baked into classes → combinatorial explosion.
## Hints
- [ ] `Channel` interface (impl side): `deliver(payload)`.
- [ ] `EmailChannel`, `SmsChannel`, `SlackChannel` implement it.
- [ ] `Message` (abstraction) holds a `Channel`; `TextMessage`/`ImageMessage`
      extend `Message` and format their payload, then delegate to the channel.
- [ ] Types + channels compose freely at runtime.
## Done-when
- [ ] New channel = one class; works with every message type.

# Observer — Event Bus / Signup — Fix Hints
> Emit a "user.signed_up" event; let listeners react.
## Wrong now
`signup` calls email + analytics + CRM directly. The core flow is coupled to every
side effect; adding one edits signup.
## Hints
- [ ] Define an event/subject ("UserSignedUp") with subscribe/notify.
- [ ] Listeners (`EmailListener`, `AnalyticsListener`, `CrmListener`) implement an
      observer + self-register.
- [ ] `signup` does core work then publishes the event; it doesn't know the listeners.
- [ ] This is the pub/sub flavor of Observer (decoupled side effects).
## Done-when
- [ ] New signup side effect = new listener, zero changes to `signup`.

# Functions — Registration Problem — Fix Hints
> One function, one job, one level of abstraction.
## Wrong now
`registerUser` validates, hashes, saves, emails, tracks, and audits — six jobs,
mixed high/low level, untestable as a unit.
## Hints
- [ ] Extract `validateRegistration`, `hashPassword`, then orchestrate small calls.
- [ ] Side effects (save/email/analytics/audit) belong to injected services, not inline.
- [ ] The top function should read as a sequence of named steps (~10 lines).
- [ ] Keep the hash in a real hashing util (the inline loop is also a security smell).
## Done-when
- [ ] Each step is independently testable; top function is a thin orchestrator.

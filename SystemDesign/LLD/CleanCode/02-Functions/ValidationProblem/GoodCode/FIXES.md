# Functions — Flag Args Problem — Fix Hints
> A boolean flag means the function does more than one thing.
## Wrong now
`save(user, validate, sendEmail, dryRun)` — three flags select three behaviors;
the body branches on each.
## Hints
- [ ] Split by behavior: `validateUser`, `previewUser` (dry run), `saveUser`.
- [ ] Caller composes the steps it actually wants; no flags.
- [ ] Email is a separate effect the caller triggers, not a parameter.
## Done-when
- [ ] No boolean parameters steer behavior; each function does one thing.

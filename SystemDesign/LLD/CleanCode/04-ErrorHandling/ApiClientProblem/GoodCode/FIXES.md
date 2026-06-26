# Error Handling — API Client — Fix Hints
> Don't blend error sentinels into the success shape.
## Wrong now
A catch-all turns every failure into `{ error: true, code: -1 }`, mixed with the
valid user shape. Distinct errors (missing id vs 404) are flattened.
## Hints
- [ ] Catch narrowly; don't lump network, validation, and 404 into one value.
- [ ] Return a discriminated union: `{ ok: true, user } | { ok: false, error }`.
- [ ] Map transport errors to domain errors with context; log details server-side.
- [ ] Throw `Error` subclasses, never strings.
## Done-when
- [ ] Success and failure are structurally distinct; causes are preserved.

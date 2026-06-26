# Immutability — Default Mutation — Fix Hints
> Never hand out a reference to a shared default and mutate it.
## Wrong now
`withTag` aliases `DEFAULT_OPTIONS` and pushes into its `tags`, permanently
polluting the default for everyone.
## Hints
- [ ] Return a fresh copy: `{ ...DEFAULT_OPTIONS, tags: [...DEFAULT_OPTIONS.tags, tag] }`.
- [ ] `Object.freeze` the default so accidental mutation throws (in strict mode).
- [ ] Treat constants as immutable; build new values from them.
## Done-when
- [ ] The default is never modified; each call yields an independent object.

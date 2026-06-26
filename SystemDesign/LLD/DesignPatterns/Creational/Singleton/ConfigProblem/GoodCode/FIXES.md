# Singleton — Config Problem — Fix Hints
> Config is read once; everyone shares one source of truth.
## Wrong now
Each `new AppConfig()` re-parses .env and holds its own copy. Mutating one
doesn't reflect in another → divergent config.
## Hints
- [ ] Private constructor + `static getInstance()` caching one instance.
- [ ] Parse once on first access (lazy); reuse forever.
- [ ] Idiomatic TS alt: a module-level `export const config = loadConfig()` —
      modules import the same binding (note this trade-off).
- [ ] Keep settings immutable (`readonly` / freeze) so no module can corrupt shared state.
## Done-when
- [ ] .env parsed exactly once; all modules read identical values.

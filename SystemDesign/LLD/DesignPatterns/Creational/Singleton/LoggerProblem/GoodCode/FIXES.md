# Singleton — Fix Hints
> Intent: exactly ONE instance, globally reachable, created lazily.
## Wrong now
Three `new Logger()` → three buffers, file handle/config work repeated. No shared state.
## Hints
- [ ] Make the constructor `private` so `new Logger()` is impossible outside.
- [ ] Add a `static getInstance()` that lazily creates and caches one instance.
- [ ] Store the single instance in a `private static` field.
- [ ] All modules call `Logger.getInstance()` → one buffer, one handle.
- [ ] (TS note) A module-level `export const logger = ...` is often the simpler,
      idiomatic singleton — mention this trade-off.
## Watch out
- Singleton is global mutable state → hard to test, hides dependencies. Prefer DI
  in large apps. Know WHEN not to use it.
- Guard against concurrent init if your runtime is multi-threaded (less of an issue in Node).

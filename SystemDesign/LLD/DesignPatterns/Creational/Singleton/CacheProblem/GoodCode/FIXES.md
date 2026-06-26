# Singleton — Cache Problem — Fix Hints
> One cache instance, or it isn't a cache.
## Wrong now
`writer` and `reader` hold different `Map`s. Writes never reach reads → 100% miss
rate, defeats the cache, wastes memory.
## Hints
- [ ] Single shared instance via `getInstance()` (or one exported module const).
- [ ] All readers/writers touch the same backing store.
- [ ] Add TTL/eviction inside the single owner, not per-copy.
- [ ] For tests, expose a `reset()`/clear so the singleton doesn't leak state across tests.
## Done-when
- [ ] A write through one reference is visible through any other.

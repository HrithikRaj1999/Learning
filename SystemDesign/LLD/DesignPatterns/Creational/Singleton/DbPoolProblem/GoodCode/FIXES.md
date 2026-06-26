# Singleton — DB Pool Problem — Fix Hints
> A connection pool MUST be a single shared instance.
## Wrong now
Each service builds its own pool → connections multiply and exhaust the DB
(`too many connections` outage). Classic production incident.
## Hints
- [ ] Make the pool a singleton: private constructor + `getInstance()`.
- [ ] All services borrow connections from the ONE pool.
- [ ] Consider passing the pool via DI instead of a global, so it's testable —
      singleton-via-composition-root, not hidden global.
- [ ] Ensure thread/async safety of lazy init in your runtime.
## Done-when
- [ ] Total connections = pool size, regardless of #services.

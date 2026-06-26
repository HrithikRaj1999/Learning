# Naming — Game Loop Problem — Fix Hints
> Even hot loops deserve readable names.
## Wrong now
`upd`, `e`, `o`, `vx/vy`, `o.h`, `o.d`, `o.t`, magic `3` — unreadable.
## Hints
- [ ] `upd` → `updateEntities`; `e` → `entities`; `o` → `entity`.
- [ ] `o.h` → `entity.health`; `o.d` → `entity.isDead`; `o.t` → `entity.cooldown`.
- [ ] `vx/vy` → `velocityX/velocityY` (or a `velocity` vector).
- [ ] Magic `3` → `MAX_COOLDOWN_SECONDS` constant.
## Done-when
- [ ] No single-letter domain vars; no magic numbers.

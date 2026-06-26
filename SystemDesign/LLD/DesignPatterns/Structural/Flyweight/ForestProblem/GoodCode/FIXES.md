# Flyweight — Fix Hints
> Intent: share immutable "intrinsic" state across many objects to save memory.
## Wrong now
Each `Tree` copies the same mesh + texture. Memory scales with tree count, not
species count.
## Hints
- [ ] Split state: INTRINSIC (shared, immutable: mesh, texture, species) vs
      EXTRINSIC (unique per object: x, y).
- [ ] Create a `TreeType` flyweight holding only intrinsic state.
- [ ] A `TreeFactory` caches and returns one shared `TreeType` per species.
- [ ] `Tree` stores x, y + a reference to the shared `TreeType` (no copy).
- [ ] Now memory scales with #species, not #trees.
## Done-when
- [ ] 1M oaks share ONE mesh object.
- [ ] Intrinsic state is immutable (sharing mutable state is a bug).

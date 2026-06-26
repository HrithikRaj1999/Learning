# Prototype — Fix Hints
> Intent: create new objects by cloning an existing instance, skipping costly setup.
## Wrong now
Each `new GameUnit("orc")` reloads meshes. Manual copy shares nested refs
(`stats`) → mutating one unit corrupts another.
## Hints
- [ ] Give units a `clone(): GameUnit` method that returns a fresh copy WITHOUT
      re-running the expensive constructor (build base once, clone many).
- [ ] Make `clone()` a **deep** copy of mutable nested state (`stats`, `inventory`)
      so copies are independent. Beware shallow copy / shared references.
- [ ] Keep a registry of pre-built prototypes; spawn = `prototype.clone()`.
- [ ] Consider `structuredClone()` for deep copy in modern runtimes — note caveats
      (functions, class identity).
## Done-when
- [ ] Spawning N units runs expensive setup once, not N times.
- [ ] Mutating a clone never affects the original or siblings.

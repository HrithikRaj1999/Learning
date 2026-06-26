# LSP — Read-Only Collection Problem — Fix Hints
> Don't inherit a mutable contract you intend to disable.
## Wrong now
`ImmutableList extends MutableList` but `add()` is a silent no-op. Code that
calls `add()` (like `fillWithDefaults`) is silently broken — list stays empty.
## Hints
- [ ] Invert the hierarchy: a small `ReadableList` (get, size) is the BASE.
- [ ] `MutableList` EXTENDS readable by adding `add()`/`remove()`.
- [ ] `ImmutableList` implements only `ReadableList` — it never claims `add()`.
- [ ] Functions that need to mutate take `MutableList`; read-only consumers take
      `ReadableList`. The type system prevents the bad call.
## Done-when
- [ ] No mutator is overridden to no-op/throw.
- [ ] Passing an immutable list where mutation is required won't compile.

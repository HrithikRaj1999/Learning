# Composite — Fix Hints
> Intent: treat individual objects and compositions uniformly via one interface.
## Wrong now
`totalSize` uses `instanceof` to branch File vs Folder and owns the recursion.
Every new operation re-implements the same branching.
## Hints
- [ ] Define a common `FileSystemNode` interface with `size(): number`
      (and e.g. `print(indent)`).
- [ ] `File.size()` returns its own size (leaf).
- [ ] `Folder.size()` sums `child.size()` over children (composite) — recursion
      lives INSIDE Folder, not the client.
- [ ] Client calls `node.size()` with zero type checks; leaf and group look the same.
## Done-when
- [ ] No `instanceof` in client code.
- [ ] Adding a new operation = one method on the interface, implemented by both.

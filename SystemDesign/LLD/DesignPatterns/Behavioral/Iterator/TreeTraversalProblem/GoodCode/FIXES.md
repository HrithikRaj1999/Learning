# Iterator — Tree Traversal — Fix Hints
> Expose traversal, not the node structure.
## Wrong now
Clients recurse over `node.children` directly — coupled to the internal shape;
every client re-implements DFS; switching to BFS or another structure breaks them.
## Hints
- [ ] Give the tree an iterator (implement `[Symbol.iterator]()` as a generator)
      that yields values in a defined order (DFS/BFS).
- [ ] Offer multiple iterators (`dfs()`, `bfs()`) if needed — same collection,
      different traversal objects.
- [ ] Clients use `for (const v of tree)`; node internals stay private.
## Done-when
- [ ] No client touches `children`; traversal order is the tree's concern.

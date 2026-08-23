# 09. Trees & BST

Recursion made visual. Learn the two traversals first, then the "return info up the tree" pattern, then BST rules, then build/design.

## Ladder

1. [Traversals — DFS & BFS](01-traversals.md) — the two engines everything else uses
2. [DFS returning height/info](02-dfs-return-height.md) — diameter, balance, LCA
3. [BST-specific](03-bst.md) — ordering invariant, inorder = sorted
4. [Build, design & hard](04-build-design-hard.md) — construct, serialize, max path

## Two engines

- **DFS (recursion / stack)**: preorder (root first), inorder (BST → sorted), postorder (children first, "return info up").
- **BFS (queue)**: level-order; use when the answer depends on depth/levels.

## Decision cue

| Question shape | Use |
|---|---|
| "level", "depth-by-depth", "right side view" | BFS |
| "path", "height", "compare subtrees", "return value from children" | DFS postorder |
| "kth smallest", "validate order", "range" in a BST | Inorder DFS |

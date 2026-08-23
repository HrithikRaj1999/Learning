# Trees — Binary Search Tree

Invariant: left < node < right. Inorder traversal yields sorted order.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 98 | Medium | Validate Binary Search Tree | DFS with (min, max) bounds | Amazon, Meta, Google, Microsoft |
| 230 | Medium | Kth Smallest Element in a BST | Inorder, stop at k | Amazon, Google, Bloomberg |
| 235 | Medium | Lowest Common Ancestor of a BST | Walk by value comparison | Amazon, Meta, Microsoft |
| 99 | Medium | Recover Binary Search Tree | Inorder, find swapped pair | Amazon, Microsoft |

**Key skill**: pass down `(low, high)` bounds — a node is valid only if `low < val < high` (LC 98). Never validate against just the parent.

# Trees — Traversals (DFS & BFS)

Start here. Every later tree problem reuses one of these two engines.

## DFS foundation

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 104 | Easy | Maximum Depth of Binary Tree | Postorder height | Amazon, Google, LinkedIn |
| 100 | Easy | Same Tree | Parallel DFS compare | Amazon, Bloomberg |
| 226 | Easy | Invert Binary Tree | Swap children recursively | Google, Amazon, Meta |
| 572 | Easy | Subtree of Another Tree | DFS + sameTree check | Amazon, Meta |
| 112 | Easy | Path Sum | DFS carry remaining sum | Amazon, Microsoft |

## BFS foundation

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 102 | Medium | Binary Tree Level Order Traversal | Queue, level by level | Google, Amazon, Bloomberg, Microsoft |
| 199 | Medium | Binary Tree Right Side View | BFS, take last per level | Meta, Amazon, Microsoft |
| 116 | Medium | Populating Next Right Pointers | BFS / level links | Amazon, Microsoft, Meta |

**Key skill**: BFS — record `len = queue.size()` at each level start, then process exactly that many nodes.

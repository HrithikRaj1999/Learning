# Trees — DFS Returning Height / Info

The "compute answer from children's return values" pattern (postorder). Highest-value tree technique.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 543 | Easy | Diameter of Binary Tree | Height + update global max | Amazon, Google, Meta |
| 110 | Easy | Balanced Binary Tree | Height, −1 sentinel on imbalance | Amazon, Google |
| 1448 | Medium | Count Good Nodes in Binary Tree | DFS carry max-on-path | Amazon, Microsoft |
| 113 | Medium | Path Sum II | DFS + backtracking path | Amazon, Bloomberg |
| 236 | Medium | Lowest Common Ancestor of Binary Tree | Postorder found-left/found-right | Amazon, Meta, Google, Microsoft |

**Key skill**: return one value up (height/found) while updating a global answer — one pass, O(n) (LC 543, 236).

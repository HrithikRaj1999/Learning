# Trees — Build, Design & Hard

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 105 | Medium | Construct Tree from Preorder & Inorder | Recursion + index map | Amazon, Google, Microsoft |
| 124 | Hard | Binary Tree Maximum Path Sum | DFS gain, drop negatives | Amazon, Google, Meta, Microsoft |
| 297 | Hard | Serialize and Deserialize Binary Tree | Preorder with null markers | Microsoft, Amazon, Google, Meta |

**Key skill**: LC 124 — each node returns max *downward* gain (≥0) to its parent, but updates the global answer with left+node+right.

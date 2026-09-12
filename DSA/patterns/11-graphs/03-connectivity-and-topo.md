# Graphs — Connectivity & Topological Sort

Union-Find for merging sets; topo sort for prerequisite ordering + cycle detection.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 133 | Medium | Clone Graph | DFS/BFS + old→new map | Amazon, Google, Facebook |
| 323 | Medium | Number of Connected Components | Union-Find / DFS | Amazon, Google |
| 261 | Medium | Graph Valid Tree | Union-Find, n−1 edges, no cycle | Amazon, Google, Facebook |
| 684 | Medium | Redundant Connection | Union-Find, first cycle edge | Amazon, Google |
| 721 | Medium | Accounts Merge | Union-Find on emails | Amazon, Google, Facebook |
| 207 | Medium | Course Schedule | Topo sort / cycle detect | Amazon, Google, TikTok, Uber |
| 210 | Medium | Course Schedule II | Kahn's ordering | Amazon, Apple, Google |
| 269 | Hard | Alien Dictionary | Build graph + topo sort | Amazon, Google, Facebook |

**Key skill**: Kahn's algorithm — start from in-degree 0 nodes; if you can't emit all N, a cycle exists (LC 207/210).

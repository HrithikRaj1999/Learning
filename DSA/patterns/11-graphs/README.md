# 11. Graphs & Matrix BFS/DFS

Grids are graphs (each cell = node, edges to 4 neighbors). Master traversal, then the specialized algorithms.

## Ladder

1. [Grid DFS/BFS](01-grid-dfs-bfs.md) — flood fill, area, boundary
2. [Multi-source & shortest path BFS](02-multi-source-bfs.md) — spread from many sources
3. [Connectivity & topological sort](03-connectivity-and-topo.md) — Union-Find, cycle, ordering
4. [Weighted & hard](04-weighted-hard.md) — Dijkstra, Bellman-Ford, Euler

## Algorithm cheat sheet

| Need | Algorithm |
|---|---|
| Reachable region / count components | DFS or BFS or Union-Find |
| Shortest path, **unweighted** | BFS (multi-source if many starts) |
| Shortest path, **weighted ≥0** | Dijkstra (min-heap) |
| Shortest path, weights or ≤K stops | Bellman-Ford |
| Ordering with prerequisites / cycle detect | Topological sort (Kahn's or DFS) |
| Dynamic connectivity / merge sets | Union-Find (path compression + rank) |

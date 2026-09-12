# Graphs — Multi-Source & Shortest-Path BFS

BFS gives shortest path in *unweighted* graphs. Seed the queue with all sources at once.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 994 | Medium | Rotting Oranges | Multi-source BFS, count rounds | Amazon, Google, Microsoft |
| 542 | Medium | 01 Matrix | Multi-source BFS from all 0s | Amazon, Google |
| 1091 | Medium | Shortest Path in Binary Matrix | BFS 8-directional | Amazon, Google |
| 127 | Hard | Word Ladder | BFS over word graph | Amazon, Google, Facebook |

**Key skill**: push *every* source into the queue before starting — the first time you reach a cell is its shortest distance (LC 994, 542).

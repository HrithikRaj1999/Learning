# BFS — one file per question

Every file runs: `node DSA/bsf/<file>.js` and prints the expected answers.
Layout in each: PROBLEM (exact name) → INTUITION → STEPS IN WORDS → code
→ QUICK CHECK → SAY OUT LOUD.

| # | Question | File |
|---|----------|------|
| 1 | Breadth First Search of a graph (BFS order) | [01_bfs_traversal_graph.js](01_bfs_traversal_graph.js) |
| 2 | Shortest path in an unweighted graph (fewest hops) | [02_shortest_path_unweighted_graph.js](02_shortest_path_unweighted_graph.js) |
| 3 | Number of Islands (LC 200) | [03_number_of_islands.js](03_number_of_islands.js) |
| 4 | Rotting Oranges (LC 994) | [04_rotting_oranges.js](04_rotting_oranges.js) |

The one idea behind all four: **BFS spreads in circles using a line (queue),
so the first time you meet something is the shortest way to it.**

Next questions of the same shape: word ladder (LC 127), shortest path in a
binary matrix (LC 1091, 8 directions), walls and gates (LC 286),
01 matrix (LC 542), course schedule (LC 207), clone graph (LC 133).

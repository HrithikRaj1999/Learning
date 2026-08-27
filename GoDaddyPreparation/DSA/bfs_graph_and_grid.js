/*
BFS - graph and grid   [Q2.6.4 / Q2.6.5]

Three shapes of the same algorithm, all asked as "a BFS variation":
  A) traverse / shortest path in an unweighted GRAPH
  B) number of islands in a GRID (LC 200)
  C) rotting oranges - multi-source BFS with levels (LC 994)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- BFS = explore in RINGS. All nodes at distance 1, then all at
  distance 2, and so on. A QUEUE gives exactly that order
  (first in, first out).
- DFS uses a stack / recursion and dives deep instead. Use DFS to
  ask "is it reachable", use BFS to ask "how FAR is it".

- The 4 lines that never change:
      1. push the start into the queue, mark it VISITED
      2. pop the front
      3. push every unvisited neighbour, mark visited AT PUSH TIME
      4. repeat until the queue is empty

- MARK ON PUSH, NOT ON POP. Marking on pop lets the same node be
  queued many times, and the queue explodes.

- BFS gives the SHORTEST path only when every edge costs the same.
  Different costs -> Dijkstra.

- LEVEL BY LEVEL: record queue.length before the loop and process
  exactly that many nodes. That count IS one ring / one minute.

- A GRID is just a graph: cell (r,c) has up to 4 neighbours,
  (r+1,c) (r-1,c) (r,c+1) (r,c-1). Nothing else changes.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
A) GRAPH   1 - 2 - 4
           |   |
           3 - -

  adjacency: 1:[2,3]  2:[1,4,3]  3:[1,2]  4:[2]

  start at 1
    queue [1]        visited {1}      order: 1
    pop 1  -> push 2,3     queue [2,3]  visited {1,2,3}
    pop 2  -> push 4       queue [3,4]  visited {1,2,3,4}
             (1 and 3 already visited, skipped)
    pop 3  -> nothing new  queue [4]
    pop 4  -> nothing new  queue []
    order = 1,2,3,4     distance 4 from 1 = 2 hops

B) ISLANDS grid ('1' land, '0' water)

     1 1 0 0
     1 1 0 0
     0 0 1 0

  (0,0) is land and unvisited -> islands = 1, BFS floods
      (0,0)(0,1)(1,0)(1,1) -> all marked
  keep scanning... (2,2) is land, unvisited -> islands = 2
  answer 2

C) ROTTING ORANGES, 2 = rotten, 1 = fresh, 0 = empty

  minute 0        minute 1        minute 2        minute 3
   2 1 1           2 2 1           2 2 2           2 2 2
   1 1 0           2 1 0           2 2 0           2 2 0
   0 1 1           0 1 1           0 2 1           0 2 2

  queue starts with EVERY rotten cell (multi-source).
  One round of the queue = one minute = one ring of the BFS.
  Here the last fresh orange rots in minute 4 -> answer 4.

  If one fresh orange has no rotten neighbour ever, the queue
  empties while fresh > 0 -> answer -1.
*/

// ============================================================
// 3) A) BFS ON A GRAPH - TRAVERSAL + SHORTEST PATH
// ============================================================
/*
- Adjacency list = Map from node -> array of neighbours.
- The Set is what stops infinite loops on cycles.
    Time  : O(V + E) - every node and every edge once.
    Space : O(V) for the queue and the visited set.
*/
function bfsOrder(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  // head index instead of shift(), because shift() is O(n)
  let head = 0;

  while (head < queue.length) {
    const node = queue[head];
    head++;
    order.push(node);

    for (const neighbour of graph.get(node) || []) {
      // mark AT PUSH TIME, never at pop time
      if (visited.has(neighbour)) continue;
      visited.add(neighbour);
      queue.push(neighbour);
    }
  }

  return order;
}

/*
- Shortest number of hops in an unweighted graph. Same loop, plus
  a distance map filled when a node is first discovered.
*/
function shortestHops(graph, start, target) {
  if (start === target) return 0;

  const distance = new Map([[start, 0]]);
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head];
    head++;

    for (const neighbour of graph.get(node) || []) {
      if (distance.has(neighbour)) continue;

      // first time a node is seen IS its shortest distance
      distance.set(neighbour, distance.get(node) + 1);
      if (neighbour === target) return distance.get(neighbour);

      queue.push(neighbour);
    }
  }

  // never reached
  return -1;
}

// ============================================================
// 4) B) NUMBER OF ISLANDS - BFS FLOOD FILL (LC 200)
// ============================================================
/*
- Scan every cell. Land that is still unvisited starts a NEW island,
  then BFS sinks the whole island so it is never counted again.
    Time  : O(rows * cols) - each cell is enqueued at most once.
    Space : O(min(rows, cols)) for the queue in the worst case.
*/
const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function numIslands(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;

  // copy so the caller's grid is not sunk
  const cells = grid.map((row) => [...row]);
  let islands = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] !== "1") continue;

      // a fresh piece of land - one more island
      islands++;

      const queue = [[r, c]];
      let head = 0;
      // sink it immediately so it is not queued twice
      cells[r][c] = "0";

      while (head < queue.length) {
        const [row, col] = queue[head];
        head++;

        for (const [dr, dc] of DIRECTIONS) {
          const nextRow = row + dr;
          const nextCol = col + dc;

          // stay inside the grid
          if (nextRow < 0 || nextRow >= rows) continue;
          if (nextCol < 0 || nextCol >= cols) continue;
          // only land is worth visiting
          if (cells[nextRow][nextCol] !== "1") continue;

          cells[nextRow][nextCol] = "0";
          queue.push([nextRow, nextCol]);
        }
      }
    }
  }

  return islands;
}

// ============================================================
// 5) C) ROTTING ORANGES - MULTI-SOURCE BFS WITH LEVELS (LC 994)
// ============================================================
/*
- Every rotten orange goes into the queue BEFORE the loop starts.
  All of them spread at the same time - that is multi-source BFS.
- One round of the queue = one minute. Count the rounds.
- If any fresh orange is left at the end, return -1.
    Time  : O(rows * cols)   Space : O(rows * cols)
*/
function orangesRotting(grid) {
  const rows = grid.length;
  if (rows === 0) return 0;
  const cols = grid[0].length;

  const cells = grid.map((row) => [...row]);
  const queue = [];
  let fresh = 0;

  // seed the queue with EVERY rotten orange
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] === 2) queue.push([r, c]);
      if (cells[r][c] === 1) fresh++;
    }
  }

  // nothing fresh to rot - zero minutes needed
  if (fresh === 0) return 0;

  let head = 0;
  let minutes = 0;

  while (head < queue.length) {
    // exactly the oranges that rotted in the PREVIOUS minute
    const levelSize = queue.length - head;
    minutes++;

    for (let i = 0; i < levelSize; i++) {
      const [row, col] = queue[head];
      head++;

      for (const [dr, dc] of DIRECTIONS) {
        const nextRow = row + dr;
        const nextCol = col + dc;

        if (nextRow < 0 || nextRow >= rows) continue;
        if (nextCol < 0 || nextCol >= cols) continue;
        // only FRESH oranges can rot
        if (cells[nextRow][nextCol] !== 1) continue;

        cells[nextRow][nextCol] = 2;
        fresh--;
        queue.push([nextRow, nextCol]);
      }
    }

    // everything rotted - stop counting, do not add an empty minute
    if (fresh === 0) return minutes;
  }

  // some fresh orange had no rotten neighbour ever
  return -1;
}

// ============================================================
// QUICK CHECK
// ============================================================
const graph = new Map([
  [1, [2, 3]],
  [2, [1, 4, 3]],
  [3, [1, 2]],
  [4, [2]],
]);

console.log(bfsOrder(graph, 1)); // [1,2,3,4]
console.log(shortestHops(graph, 1, 4)); // 2
console.log(shortestHops(graph, 1, 1)); // 0
console.log(shortestHops(new Map([[1, []], [9, []]]), 1, 9)); // -1

console.log(numIslands([
  ["1", "1", "0", "0"],
  ["1", "1", "0", "0"],
  ["0", "0", "1", "0"],
])); // 2
console.log(numIslands([["0"]])); // 0
console.log(numIslands([["1"]])); // 1

console.log(orangesRotting([
  [2, 1, 1],
  [1, 1, 0],
  [0, 1, 1],
])); // 4
console.log(orangesRotting([
  [2, 1, 1],
  [0, 1, 1],
  [1, 0, 1],
])); // -1  (bottom-left orange is unreachable)
console.log(orangesRotting([[0, 2]])); // 0

/*
============================================================
6) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Graph : O(V + E) time, O(V) space.
    Grid  : O(rows * cols) time - each cell enters the queue once.
- BFS OR DFS?
    "Is it connected / reachable" -> either works, DFS is shorter.
    "Shortest path / minimum steps" -> BFS, because it finishes a
    whole ring before going deeper. DFS can find a long path first.
    Very deep graph -> BFS also avoids stack overflow.
- WEIGHTS: BFS is only shortest-path-correct when all edges cost
  the same. Add weights and it becomes Dijkstra (priority queue),
  or 0-1 BFS with a deque if the weights are only 0 and 1.
- THE TWO BUGS THEY WATCH FOR:
    1. marking visited on POP instead of PUSH - duplicates flood
       the queue and the complexity blows up.
    2. using queue.shift() in JS - that is O(n) per pop, so the
       whole BFS silently becomes O(n^2). I use a head index.
- LEVELS: capture queue length BEFORE the inner loop. That count
  is one ring, which is what "minutes" or "steps" means.
- MULTI-SOURCE: seeding the queue with every source at once is the
  trick behind rotting oranges, walls and gates (LC 286), and
  01 matrix (LC 542). Worth naming as a pattern.
- FOLLOW-UPS:
    Word ladder (LC 127), shortest path in a binary matrix
    (LC 1091, 8 directions), course schedule (LC 207 - BFS
    topological sort with in-degrees), clone graph (LC 133).
*/

/*
BFS - graph and grid   [Q2.6.4 / Q2.6.5]
Same idea, three questions: A) walk a graph + count steps
B) count islands (LC 200)   C) rotting oranges (LC 994)

THE SAME 4 LINES EVERY TIME
  put the start in the line, mark it as seen
  while the line is not empty:
      take the front one out
      for each neighbour not seen yet: mark it seen, put it in the line

THINGS TO REMEMBER (and to say out loud)
  - Mark a node as seen when you PUT IT IN the line, not when you take it out.
    If you wait, the same node joins the line many times and it blows up.
  - BFS gives the shortest path only if every step costs the same.
    If steps cost different amounts, you need Dijkstra instead.
  - A grid is a graph. One box touches 4 boxes: up, down, left, right.
  - To count steps or minutes: check how long the line is BEFORE the inner
    loop. That many boxes = one circle = one step = one minute.
  - Do not use queue.shift() in JS. It is slow (it moves the whole array).
    Keep a `head` number that walks forward instead.

  1 - 2 - 4        start at 1:  line [1] -> take 1, add 2 and 3
  |   |                         take 2, add 4
  3 --+                         order 1,2,3,4    1 to 4 = 2 steps
*/

// ============================================================
// A) GRAPH: what order do we visit?      O(V + E) time, O(V) space
// ============================================================
/* IN WORDS
   put the start in the line and mark it seen
   keep taking the front one out and writing it down
   every neighbour we have not seen yet: mark it, put it in the line  */
function bfsOrder(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  let head = 0; // head index instead of shift()

  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);

    for (const nb of graph.get(node) || []) {
      if (visited.has(nb)) continue;
      visited.add(nb); // mark AT PUSH TIME
      queue.push(nb);
    }
  }
  return order;
}

// ============================================================
// A2) GRAPH: how many steps from start to target?      O(V + E)
// ============================================================
/* IN WORDS
   same loop. Instead of "seen or not", store HOW FAR each node is.
   The first time we meet a node is always its shortest distance,
   so: distance of neighbour = distance of this node + 1.
   Line goes empty and we never met the target -> return -1.  */
function shortestHops(graph, start, target) {
  if (start === target) return 0;

  const distance = new Map([[start, 0]]);
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];

    for (const nb of graph.get(node) || []) {
      if (distance.has(nb)) continue;
      distance.set(nb, distance.get(node) + 1);
      if (nb === target) return distance.get(nb);
      queue.push(nb);
    }
  }
  return -1;
}

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// ============================================================
// B) COUNT ISLANDS (LC 200)                      O(rows * cols)
// ============================================================
/* IN WORDS
   look at every box in the grid.
   found land we have not touched yet? that is a NEW island, so add 1,
   then BFS all the land joined to it and turn it into water.
   Turning land into water is our "seen" mark, so we never count it twice.  */
function numIslands(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const cells = grid.map((row) => [...row]); // do not sink the caller's grid
  let islands = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] !== "1") continue;

      islands++; // fresh piece of land = one more island
      const queue = [[r, c]];
      let head = 0;
      cells[r][c] = "0";

      while (head < queue.length) {
        const [row, col] = queue[head++];

        for (const [dr, dc] of DIRECTIONS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (cells[nr][nc] !== "1") continue;

          cells[nr][nc] = "0"; // sink on push
          queue.push([nr, nc]);
        }
      }
    }
  }
  return islands;
}

// ============================================================
// C) ROTTING ORANGES (LC 994)                     O(rows * cols)
// ============================================================
/* IN WORDS
   all the rotten oranges start rotting at the same time,
   so put EVERY rotten box in the line before the loop starts.
   One full round of the line = one minute: rot the fresh neighbours.
   No fresh oranges left -> return the minutes.
   Line goes empty but some orange is still fresh -> nobody could reach it -> -1.  */
function orangesRotting(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const cells = grid.map((row) => [...row]);
  const queue = [];
  let fresh = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] === 2) queue.push([r, c]);
      if (cells[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0; // nothing to rot

  let head = 0;
  let minutes = 0;

  while (head < queue.length) {
    const levelSize = queue.length - head; // exactly last minute's oranges
    minutes++;

    for (let i = 0; i < levelSize; i++) {
      const [row, col] = queue[head++];

      for (const [dr, dc] of DIRECTIONS) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (cells[nr][nc] !== 1) continue; // only FRESH can rot

        cells[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc]);
      }
    }
    if (fresh === 0) return minutes; // stop before counting an empty minute
  }
  return -1; // some orange was never reachable
}

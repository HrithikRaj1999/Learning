/*
PROBLEM:  Number of Islands  (LC 200)
ASKED AS: grid of '1' land and '0' water, count how many separate islands.
          Land joined up, down, left or right counts as one island.

INTUITION
- A grid IS a graph. One box touches 4 boxes: up, down, left, right.
- Walk over every box. When we find land nobody has touched yet,
  that is a brand new island, so add 1.
- Then BFS from that box and turn ALL land joined to it into water.
  Now it can never be counted again.
- Turning land into water is our "seen" mark. No extra Set needed.

STEPS IN WORDS
1. Copy the grid, so we do not damage the caller's grid.
2. For every box in the grid:
   - if it is water or already sunk, skip it.
   - it is land: count one more island, put it in the line, sink it.
3. While the line is not empty: take a box out, look at its 4 neighbours.
   Any neighbour that is land: sink it and put it in the line.
4. When the line empties, that island is fully gone. Keep scanning.

TRAP: sink a box the moment you put it in the line.
      Sinking later lets the same box join the line 4 times.
*/

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function numIslands(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const cells = grid.map((row) => [...row]);
  let islands = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (cells[r][c] !== "1") continue;

      islands++; // land nobody has touched = a new island
      const queue = [[r, c]];
      let head = 0;
      cells[r][c] = "0"; // sink it now

      while (head < queue.length) {
        const [row, col] = queue[head++];

        for (const [dr, dc] of DIRECTIONS) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (cells[nr][nc] !== "1") continue;

          cells[nr][nc] = "0"; // sink on the way in
          queue.push([nr, nc]);
        }
      }
    }
  }
  return islands;
}

// QUICK CHECK
console.log(numIslands([
  ["1", "1", "0", "0"],
  ["1", "1", "0", "0"],
  ["0", "0", "1", "0"],
])); // 2
console.log(numIslands([["1"]])); // 1
console.log(numIslands([["0"]])); // 0

/*
SAY OUT LOUD
- Time O(rows x cols): every box is looked at once and joins the line once.
- Space O(min(rows, cols)) for the line in the worst case.
- DFS works too and is shorter to write, but a huge island can blow the
  call stack. BFS uses the heap instead, so it is safer for big grids.
- If they say "do not change the input", keep a separate seen grid
  (or the copy I made here) instead of sinking the original.
- Diagonal islands? Just add the 4 diagonal pairs to DIRECTIONS.
*/

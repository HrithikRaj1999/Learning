/*
PROBLEM:  Rotting Oranges  (LC 994)
ASKED AS: grid, 0 = empty, 1 = fresh orange, 2 = rotten orange.
          Every minute a rotten orange rots the 4 boxes next to it.
          Return the minutes until nothing fresh is left, or -1.

INTUITION
- All the rotten oranges start rotting at the SAME time.
  So put every rotten box in the line before the loop starts.
  (Name for this: multi-source BFS.)
- One full round of the line = one minute. The circle that BFS
  spreads in is exactly the minute counter we need.
- Count the fresh oranges first. Every time one rots, count it down.
  Fresh reaches 0 -> that is the answer.
  Line empties while some fresh are left -> nobody could reach them -> -1.

STEPS IN WORDS
1. Walk the grid once: put every rotten box in the line, count the fresh ones.
2. No fresh oranges at all -> answer is 0 minutes.
3. Loop while the line has boxes:
   - remember how many are in the line right now. That is this minute's batch.
   - add 1 minute.
   - take out exactly that many boxes. For each one, look at its 4 neighbours;
     a FRESH neighbour turns rotten, fresh goes down by 1, and it joins the line.
   - fresh hits 0 -> return the minutes.
4. Line is empty and fresh is still above 0 -> return -1.

TRAP: read the line length BEFORE the inner loop, or you mix the oranges that
      rot this minute with the ones that rot next minute.
TRAP: return the moment fresh hits 0, or you count one extra empty minute.

  minute 0     minute 1     minute 2
   2 1 1        2 2 1        2 2 2
   1 1 0        2 1 0        2 2 0
   0 1 1        0 1 1        0 2 1
*/

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function orangesRotting(grid) {
  if (grid.length === 0) return 0;
  const rows = grid.length;
  const cols = grid[0].length;
  const cells = grid.map((row) => [...row]);
  const queue = [];
  let fresh = 0;

  // start with EVERY rotten orange in the line
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
    const batch = queue.length - head; // exactly last minute's oranges
    minutes++;

    for (let i = 0; i < batch; i++) {
      const [row, col] = queue[head++];

      for (const [dr, dc] of DIRECTIONS) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (cells[nr][nc] !== 1) continue; // only fresh ones can rot

        cells[nr][nc] = 2;
        fresh--;
        queue.push([nr, nc]);
      }
    }
    if (fresh === 0) return minutes; // stop before an empty minute
  }
  return -1; // some orange was never reached
}

// QUICK CHECK
console.log(orangesRotting([[2, 1, 1], [1, 1, 0], [0, 1, 1]])); // 4
console.log(orangesRotting([[2, 1, 1], [0, 1, 1], [1, 0, 1]])); // -1
console.log(orangesRotting([[0, 2]])); // 0

/*
SAY OUT LOUD
- Time O(rows x cols), space O(rows x cols) for the line.
- Why BFS and not DFS? We need the FEWEST minutes, and BFS finishes one
  whole circle before the next. DFS has no idea what a minute is.
- Multi-source is the pattern to name: seed the line with every source.
  Same trick solves walls and gates (LC 286) and 01 matrix (LC 542).
- Edge cases they check: no fresh oranges (0), a fresh orange walled off (-1),
  and an empty grid.
*/

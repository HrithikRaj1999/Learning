/*
Zigzag Conversion (LC 6)

Write the string in a zigzag down and up across numRows rows, then read
it off row by row.

  "PAYPALISHIRING", numRows = 3   ->  "PAHNAPLSIIGYIR"

      P   A   H   N
      A P L S I I G
      Y   I   R

  "PAYPALISHIRING", numRows = 4   ->  "PINALSIGYAHRPI"
  numRows = 1                     ->  the string unchanged
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- I never need to build the 2D grid. All I need to know is WHICH ROW each
  character belongs to, and then append it to that row's buffer.
- The row index just bounces: 0,1,2,...,numRows-1, then back down
  numRows-2,...,1,0, then up again. So I keep a `step` of +1 or -1 and
  flip it whenever I hit the top or the bottom row.
- Joining the row buffers at the end gives the answer.

- The ladder:
    1. build a real numRows x n grid of characters   O(numRows * n) time
       and space, then read it row by row
    2. one buffer per row, bounce the row index      O(n) time, O(n) space
    3. jump straight to the indices of each row       O(n) time, O(n) output
       using the period formula, no bouncing

- Traps:
    - numRows = 1 makes the bounce degenerate (top and bottom are the same
      row) and a naive step flip can loop forever or divide by zero in the
      formula version. Return the string unchanged.
    - numRows >= s.length also just returns the string, and the bouncing
      code already handles it - no special case needed.
    - the middle rows get TWO characters per zigzag period, the first and
      last get one.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
BOUNCING ROW INDEX view, s = "PAYPALISHIRING", numRows = 3

  char   P  A  Y  P  A  L  I  S  H  I  R  I  N  G
  row    0  1  2  1  0  1  2  1  0  1  2  1  0  1
  step  +1 +1 -1 -1 +1 +1 -1 -1 +1 +1 -1 -1 +1 +1
            ^     ^
            |     hit row 0 -> flip step to +1
            hit row 2 (last) -> flip step to -1

  walking it:
    'P' row 0   rows = [ "P",  "",   ""  ]   at row 0 -> step = +1, row -> 1
    'A' row 1   rows = [ "P",  "A",  ""  ]   row -> 2
    'Y' row 2   rows = [ "P",  "A",  "Y" ]   at last row -> step = -1, row -> 1
    'P' row 1   rows = [ "P",  "AP", "Y" ]   row -> 0
    'A' row 0   rows = [ "PA", "AP", "Y" ]   at row 0 -> step = +1, row -> 1
    'L' row 1   rows = [ "PA", "APL","Y" ]   row -> 2
    'I' row 2   rows = [ "PA", "APL","YI"]   flip, row -> 1
    'S' row 1   ...

  final rows:
      row 0   "PAHN"
      row 1   "APLSIIG"
      row 2   "YIR"

  join -> "PAHNAPLSIIGYIR"

  INVARIANT: `row` is always in [0, numRows-1], because the step flips
  exactly at the two boundaries.

PERIOD / DIRECT INDEX view, numRows = 4, s = "PAYPALISHIRING"

  The pattern repeats every  period = 2 * numRows - 2 = 2*4 - 2 = 6

      P     I     N
      A   L S   I G
      Y A   H R
      P     I
  index 0     1     2     3     4     5   | 6     7 ...
        P     A     Y     P     A     L   | I     S
        r0    r1    r2    r3    r2    r1  | r0    r1

  row 0 takes indices 0, 6, 12, ...            step of exactly `period`
  row 3 (last) takes 3, 9, ...                 step of exactly `period`
  row 1 (middle) takes 1, then 5, then 7, 11...
                       ^        ^
                       going down   coming back up
      the "up" index is  i + period - 2*row  =  1 + 6 - 2 = 5   correct

  So a middle row r contributes TWO characters per period, at i and at
  i + period - 2*r. First and last rows contribute one.

DEGENERATE case, numRows = 1
  period = 2*1 - 2 = 0 -> the formula version would loop forever.
  The bouncing version would flip step every single character.
  Both need the guard: numRows == 1 returns s unchanged.
*/

// ============================================================
// 3) BRUTE FORCE - BUILD THE ACTUAL GRID
// ============================================================
/*
- Allocate numRows x n of blanks, walk the zigzag writing characters in,
  then read the grid row by row skipping blanks.
    Time  : O(numRows * n)   Space : O(numRows * n)
- Wasteful, but it is the picture in the problem statement, so it is a
  reasonable thing to describe before optimising.
*/
function convertGrid(s, numRows) {
  if (numRows <= 1 || numRows >= s.length) return s;

  const grid = new Array(numRows);
  for (let r = 0; r < numRows; r++) grid[r] = new Array(s.length).fill("");

  let row = 0;
  let step = 1;

  for (let column = 0; column < s.length; column++) {
    grid[row][column] = s[column];

    // turn around at the top and the bottom
    if (row === 0) step = 1;
    else if (row === numRows - 1) step = -1;

    row = row + step;
  }

  const pieces = [];
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < s.length; c++) {
      if (grid[r][c] !== "") pieces.push(grid[r][c]);
    }
  }

  return pieces.join("");
}

// ============================================================
// 4) OPTIMAL - ONE BUFFER PER ROW, BOUNCE THE INDEX
// ============================================================
/*
- Drop the columns entirely. Only the row matters, so keep numRows buffers
  and bounce a row pointer between 0 and numRows-1.
    Time  : O(n)   Space : O(n)
- This is the version to write in an interview: short and hard to get wrong.
*/
function convert(s, numRows) {
  // one row means no zigzag at all; also guards the step flip below
  if (numRows <= 1 || numRows >= s.length) return s;

  const rows = new Array(numRows);
  for (let r = 0; r < numRows; r++) rows[r] = [];

  let row = 0;
  let step = 1;

  for (let i = 0; i < s.length; i++) {
    rows[row].push(s[i]);

    // reverse direction at the top and bottom rows
    if (row === 0) step = 1;
    else if (row === numRows - 1) step = -1;

    row = row + step;
  }

  const pieces = [];
  for (let r = 0; r < numRows; r++) pieces.push(rows[r].join(""));

  return pieces.join("");
}

// ============================================================
// 5) BEST - JUMP DIRECTLY TO EACH ROW'S INDICES
// ============================================================
/*
- The pattern has period 2*numRows - 2. Row r takes index i, and middle
  rows also take i + period - 2*r. So I can emit the answer in order with
  no per-row buffers at all.
    Time  : O(n)   Space : O(n) for the output only
- Fewer allocations, and it shows I understand the geometry rather than
  just simulating it.
*/
function convertDirect(s, numRows) {
  if (numRows <= 1 || numRows >= s.length) return s;

  const period = 2 * numRows - 2;
  const pieces = [];

  for (let row = 0; row < numRows; row++) {
    for (let i = row; i < s.length; i = i + period) {
      // the downward stroke always contributes this character
      pieces.push(s[i]);

      // middle rows get a second character on the upward stroke
      const upward = i + period - 2 * row;
      const isMiddleRow = row > 0 && row < numRows - 1;

      if (isMiddleRow && upward < s.length) pieces.push(s[upward]);
    }
  }

  return pieces.join("");
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(convert("PAYPALISHIRING", 3)); // "PAHNAPLSIIGYIR"
console.log(convert("PAYPALISHIRING", 4)); // "PINALSIGYAHRPI"
console.log(convert("A", 1)); // "A"     numRows 1
console.log(convert("AB", 1)); // "AB"    numRows 1
console.log(convert("", 3)); // ""      empty
console.log(convert("AB", 5)); // "AB"    more rows than characters

console.log(convertGrid("PAYPALISHIRING", 3)); // "PAHNAPLSIIGYIR"
console.log(convertDirect("PAYPALISHIRING", 3)); // "PAHNAPLSIIGYIR"
console.log(convertDirect("PAYPALISHIRING", 4)); // "PINALSIGYAHRPI"
console.log(convertDirect("AB", 1)); // "AB"

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    build the grid   O(numRows * n) time and space
    row buffers      O(n) time, O(n) space
    direct indices   O(n) time, O(n) output only
- THE KEY REALISATION:
    the column position is irrelevant. Reading the grid row by row means
    only the ROW of each character matters, so I never build the grid.
- WHY THE STEP FLIP IS ENOUGH:
    the zigzag is just an index bouncing between 0 and numRows-1. Flipping
    the sign at both boundaries reproduces it exactly, in two lines.
- THE PERIOD FORMULA:
    2*numRows - 2 - one full stroke down (numRows) plus the way back up
    (numRows - 2, since the top and bottom are not repeated).
- THE REAL TRAP:
    numRows == 1. The period becomes 0 and the direct version loops
    forever; the bouncing version flips the step on every character. Guard
    it first. numRows >= length also short-circuits, though it is optional.
- FOLLOW-UPS:
    Spiral Matrix (LC 54, another traversal-order simulation),
    Rotate Image (LC 48), Diagonal Traverse (LC 498).
*/

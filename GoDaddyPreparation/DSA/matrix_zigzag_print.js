/*
Print a Matrix in Zig-Zag Order   [Q2.3.1]

Given rows and cols, print the matrix in zig-zag (snake) order:
row 0 left to right, row 1 right to left, row 2 left to right...

  1  2  3  4          ->  1 2 3 4  8 7 6 5  9 10 11 12
  5  6  7  8
  9 10 11 12

FIRST ASK: which zig-zag? Row snake (above) or DIAGONAL zig-zag
(LC 498)? Both are below. The interviewer wants a 3x4 dry run.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
ROW SNAKE (the common one)
- Walk rows top to bottom, always.
- Even row index -> columns 0 .. cols-1
  Odd  row index -> columns cols-1 .. 0
- That is it. One if/else inside the row loop. No direction bugs.
- The "direction flag" version is the same thing with a boolean
  that flips at the end of every row.

DIAGONAL ZIG-ZAG (LC 498)
- Move along diagonals. Every cell on one diagonal has the same
  (row + col) sum. Diagonal number d = 0 .. rows+cols-2.
- Even d -> walk the diagonal going UP-RIGHT.
  Odd  d -> walk it going DOWN-LEFT.
- Start cell of each diagonal is the boundary case to get right.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
3x4 matrix, ROW SNAKE

     c0  c1  c2  c3
 r0   1   2   3   4     -> row 0 even: left to right   1 2 3 4
 r1   5   6   7   8     -> row 1 odd : right to left   8 7 6 5
 r2   9  10  11  12     -> row 2 even: left to right   9 10 11 12

  path:  1 -> 2 -> 3 -> 4
                        |
         5 <- 6 <- 7 <- 8
         |
         9 -> 10 -> 11 -> 12

  output: [1,2,3,4,8,7,6,5,9,10,11,12]

Same 3x4, DIAGONAL ZIG-ZAG (sum row+col shown)

  sum 0 : (0,0)                       -> 1
  sum 1 : (0,1) (1,0)                 -> 2 5      going down-left
  sum 2 : (2,0) (1,1) (0,2)           -> 9 6 3    going up-right
  sum 3 : (0,3) (1,2) (2,1)           -> 4 7 10   going down-left
  sum 4 : (2,2) (1,3)                 -> 11 8     going up-right
  sum 5 : (2,3)                       -> 12

  output: [1,2,5,9,6,3,4,7,10,11,8,12]
*/

// ============================================================
// 3) ROW SNAKE - VERSION A, EVEN / ODD ROW
// ============================================================
/*
- Cleanest to write under pressure. No mutable direction state.
    Time  : O(rows * cols) - every cell touched once.
    Space : O(1) extra (output not counted).
*/
function zigzagRows(matrix) {
  const result = [];
  const rows = matrix.length;
  if (rows === 0) return result;
  const cols = matrix[0].length;

  for (let row = 0; row < rows; row++) {
    if (row % 2 === 0) {
      // even row: left to right
      for (let col = 0; col < cols; col++) {
        result.push(matrix[row][col]);
      }
    } else {
      // odd row: right to left
      for (let col = cols - 1; col >= 0; col--) {
        result.push(matrix[row][col]);
      }
    }
  }

  return result;
}

// ============================================================
// 4) ROW SNAKE - VERSION B, DIRECTION FLAG (WHAT THEY SAID)
// ============================================================
/*
- Same output, one boolean that flips after each row.
- The bug to avoid: flipping inside the column loop instead of
  after it.
    Time  : O(rows * cols)   Space : O(1)
*/
function zigzagRowsFlag(matrix) {
  const result = [];
  const rows = matrix.length;
  if (rows === 0) return result;
  const cols = matrix[0].length;

  // true = left to right, false = right to left
  let leftToRight = true;

  for (let row = 0; row < rows; row++) {
    // pick the start and the step for this row
    const start = leftToRight ? 0 : cols - 1;
    const step = leftToRight ? 1 : -1;

    for (let count = 0; count < cols; count++) {
      const col = start + step * count;
      result.push(matrix[row][col]);
    }

    // flip ONCE per row, after the whole row is done
    leftToRight = !leftToRight;
  }

  return result;
}

// ============================================================
// 5) DIAGONAL ZIG-ZAG (LC 498) - IF THAT IS WHAT THEY MEANT
// ============================================================
/*
- Diagonal d holds every cell where row + col === d.
- Even d -> go UP-RIGHT: start at the lowest valid row.
  Odd  d -> go DOWN-LEFT: start at the highest valid row... i.e.
  just walk the same diagonal in the opposite direction.
- Boundary: row cannot exceed rows-1 and col cannot exceed cols-1,
  which is why the start row is clamped with Math.min.
    Time  : O(rows * cols)   Space : O(1) extra.
*/
function zigzagDiagonal(matrix) {
  const result = [];
  const rows = matrix.length;
  if (rows === 0) return result;
  const cols = matrix[0].length;

  for (let d = 0; d <= rows + cols - 2; d++) {
    // on diagonal d, row can be at most d, and at most rows-1
    const startRow = Math.min(d, rows - 1);
    // the matching column, guaranteed inside the matrix
    const startCol = d - startRow;

    if (d % 2 === 0) {
      // even diagonal: walk UP-RIGHT (row down, col up)
      let row = startRow;
      let col = startCol;
      while (row >= 0 && col < cols) {
        result.push(matrix[row][col]);
        row--;
        col++;
      }
    } else {
      // odd diagonal: walk DOWN-LEFT, so start from the other end
      let col = Math.min(d, cols - 1);
      let row = d - col;
      while (col >= 0 && row < rows) {
        result.push(matrix[row][col]);
        row++;
        col--;
      }
    }
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
const matrix3x4 = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
];

console.log(zigzagRows(matrix3x4));
// [1,2,3,4, 8,7,6,5, 9,10,11,12]
console.log(zigzagRowsFlag(matrix3x4));
// same
console.log(zigzagDiagonal(matrix3x4));
// [1,2,5,9,6,3,4,7,10,11,8,12]

console.log(zigzagRows([[1, 2, 3]])); // [1,2,3]  single row
console.log(zigzagRows([[1], [2], [3]])); // [1,2,3]  single column
console.log(zigzagRows([])); // []
console.log(zigzagDiagonal([[1, 2], [3, 4]])); // [1,2,3,4]

/*
============================================================
6) SAY OUT LOUD
============================================================
- FIRST SENTENCE IN THE INTERVIEW:
    "Zig-zag can mean row snake or diagonal - which one?"
    Getting this wrong costs the whole question.
- COMPLEXITY:
    Both are O(rows * cols) time, which is optimal - every cell
    must be printed. O(1) extra space, the output does not count.
- ROW SNAKE, WHY EVEN/ODD BEATS A FLAG:
    No state to forget to flip. If they explicitly ask for a
    direction flag, flip it AFTER the inner loop, never inside.
- DIAGONAL, THE BOUNDARY RULE:
    Every cell on diagonal d satisfies row + col = d, with
    0 <= row < rows and 0 <= col < cols. Clamping the start with
    Math.min is what keeps the walk inside the matrix.
- EDGE CASES: empty matrix, single row, single column, 1x1,
  and a non-square matrix - they usually give 3x4 exactly because
  square matrices hide index bugs.
- FOLLOW-UPS:
    Spiral matrix (LC 54 - four boundaries shrinking),
    rotate image 90 degrees (LC 48 - transpose then reverse rows),
    diagonal traverse (LC 498), and printing in a spiral is the
    most common next question after this one.
*/

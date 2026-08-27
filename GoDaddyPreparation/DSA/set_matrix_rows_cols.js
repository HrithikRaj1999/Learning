/*
Set Matrix Rows and Columns   [Q2.3.2]  (variant of LC 73)

If a cell holds the marker value, set that WHOLE row and that WHOLE
column to the marker. GoDaddy asked it with 1 as the marker; LeetCode
73 uses 0. Same problem, one constant changes.

  1 0 0        1 1 1
  0 0 0   ->   1 0 0      (marker = 1, cell (0,0) is 1)
  0 0 0        1 0 0

Do it in place, O(1) extra space if they push.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- THE TRAP: if I write markers while scanning, the new markers look
  like original ones and the whole matrix turns into markers.
  So: FIRST find, THEN write. Two phases, always.

- Easy version: remember which rows and which cols must be filled
  in two boolean arrays. O(rows + cols) space. This is already
  a good answer.

- O(1) version: store those two boolean arrays INSIDE the matrix -
  use row 0 and column 0 as the notepad.
      cell (0,0) is shared by both, so one extra flag is needed
      for the first column.
- Then write the body first (rows 1.., cols 1..), and only at the
  very end write row 0 and column 0, because they were holding
  the notes until then.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
marker = 1, input:

      c0 c1 c2
  r0   1  0  0
  r1   0  0  0
  r2   0  0  0

WRONG (write while scanning):
  see (0,0)=1 -> fill row 0 and col 0
      1 1 1
      1 0 0
      1 0 0
  keep scanning, now (0,1) is 1 too -> fill column 1 as well
      -> everything becomes 1. Garbage.

RIGHT (two phases):
  phase 1 - only LOOK:   rowsToFill = {0},  colsToFill = {0}
  phase 2 - now write:
      1 1 1
      1 0 0
      1 0 0

O(1) VERSION notepad, marker = 1, input

      c0 c1 c2
  r0   0  0  0
  r1   0  1  0      <- the only marker, at (1,1)
  r2   0  0  0

  step 1: does column 0 contain a marker? -> no -> firstColHas = false
  step 2: scan the body (r>=1, c>=1). (1,1) is a marker, so write
          the note into row 0 and column 0:
              matrix[0][1] = 1   and   matrix[1][0] = 1

      r0   0  1  0     <- notes live here now
      r1   1  1  0
      r2   0  0  0

  step 3: fill the body from the notes
      r0   0  1  0
      r1   1  1  1     <- row 1 filled
      r2   0  1  0     <- column 1 filled
  step 4: row 0 has no note at (0,0) -> leave row 0 alone
          firstColHas is false -> leave column 0 alone

  final
      0 1 0
      1 1 1
      0 1 0
*/

// ============================================================
// 3) BRUTE FORCE - COPY THE MATRIX
// ============================================================
/*
- Scan the original, write into a fresh copy. No interference at all.
    Time  : O(rows * cols)   Space : O(rows * cols)  <- the problem
*/
function setMarkerBrute(matrix, marker) {
  const rows = matrix.length;
  if (rows === 0) return matrix;
  const cols = matrix[0].length;

  // a separate output means writes never affect the scan
  const copy = matrix.map((row) => [...row]);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === marker) {
        for (let k = 0; k < cols; k++) copy[r][k] = marker;
        for (let k = 0; k < rows; k++) copy[k][c] = marker;
      }
    }
  }

  return copy;
}

// ============================================================
// 4) BETTER - TWO BOOLEAN ARRAYS
// ============================================================
/*
- Phase 1 note down which rows/cols are hit, phase 2 write.
    Time  : O(rows * cols)   Space : O(rows + cols)
- Perfectly acceptable answer. Offer the O(1) one after.
*/
function setMarkerTwoArrays(matrix, marker) {
  const rows = matrix.length;
  if (rows === 0) return matrix;
  const cols = matrix[0].length;

  const rowHit = Array(rows).fill(false);
  const colHit = Array(cols).fill(false);

  // PHASE 1 - look only, never write
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (matrix[r][c] === marker) {
        rowHit[r] = true;
        colHit[c] = true;
      }
    }
  }

  // PHASE 2 - now it is safe to write
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rowHit[r] || colHit[c]) {
        matrix[r][c] = marker;
      }
    }
  }

  return matrix;
}

// ============================================================
// 5) OPTIMAL - O(1) SPACE, ROW 0 AND COL 0 AS THE NOTEPAD
// ============================================================
/*
- STEP 1: remember separately whether column 0 itself has a marker,
    because (0,0) can only hold ONE of the two notes.
- STEP 2: scan the body (r >= 1, c >= 1) and write notes into
    matrix[r][0] and matrix[0][c].
- STEP 3: fill the body from those notes.
- STEP 4: row 0 last (note is matrix[0][0]), then column 0 last
    (note is the saved flag). Order matters - doing them earlier
    would destroy the notes still needed.
    Time  : O(rows * cols)   Space : O(1)
*/
function setMarker(matrix, marker) {
  const rows = matrix.length;
  if (rows === 0) return matrix;
  const cols = matrix[0].length;

  // does column 0 contain a marker on its own?
  let firstColHasMarker = false;
  for (let r = 0; r < rows; r++) {
    if (matrix[r][0] === marker) firstColHasMarker = true;
  }

  // does row 0 contain a marker on its own?
  let firstRowHasMarker = false;
  for (let c = 0; c < cols; c++) {
    if (matrix[0][c] === marker) firstRowHasMarker = true;
  }

  // PHASE 1 - body only, notes go into row 0 / column 0
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][c] === marker) {
        matrix[r][0] = marker; // this row is hit
        matrix[0][c] = marker; // this column is hit
      }
    }
  }

  // PHASE 2 - body reads the notes
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (matrix[r][0] === marker || matrix[0][c] === marker) {
        matrix[r][c] = marker;
      }
    }
  }

  // PHASE 3 - row 0, only now that nobody needs the notes
  if (firstRowHasMarker) {
    for (let c = 0; c < cols; c++) matrix[0][c] = marker;
  }

  // PHASE 4 - column 0, last of all
  if (firstColHasMarker) {
    for (let r = 0; r < rows; r++) matrix[r][0] = marker;
  }

  return matrix;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(setMarker([
  [1, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
], 1));
// [ [1,1,1], [1,0,0], [1,0,0] ]

console.log(setMarker([
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
], 1));
// [ [0,1,0], [1,1,1], [0,1,0] ]

console.log(setMarkerTwoArrays([
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0],
], 1));
// same

// LeetCode 73 flavour: marker is 0
console.log(setMarker([
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
], 0));
// [ [1,0,1], [0,0,0], [1,0,1] ]

console.log(setMarker([[1]], 1)); // [ [1] ]
console.log(setMarker([], 1)); // []
console.log(setMarkerBrute([[1, 0], [0, 0]], 1)); // [ [1,1], [1,0] ]

/*
============================================================
7) SAY OUT LOUD
============================================================
- COMPLEXITY:
    All versions O(rows * cols) time - every cell must be read.
    Space: copy O(r*c) -> two arrays O(r+c) -> notepad O(1).
    Walk them through that ladder, do not jump to O(1) silently.
- THE ONE-LINE REASON FOR TWO PHASES:
    Written markers are indistinguishable from original markers.
    Scanning and writing in the same pass makes the matrix lie.
- WHY (0,0) NEEDS A SEPARATE FLAG:
    It is the note for row 0 AND the note for column 0. One cell
    cannot hold two independent booleans, so one of them moves
    into a real variable.
- WHY ROW 0 AND COL 0 ARE WRITTEN LAST:
    They are the notepad. Filling them earlier erases the notes
    the body still has to read.
- MARKER VALUE:
    Ask what the marker is (they used 1, LeetCode uses 0) and
    whether the matrix can hold other values. If any value is
    possible, the O(1) notepad still works because the notes are
    only read for equality against the marker.
- FOLLOW-UPS:
    Game of Life (LC 289 - same "do not disturb the scan" issue,
    solved by encoding two states in one cell), rotate image
    (LC 48), spiral matrix (LC 54).
*/

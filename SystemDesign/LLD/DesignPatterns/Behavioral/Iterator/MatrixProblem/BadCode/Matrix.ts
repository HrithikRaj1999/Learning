// =============================================================================
// WHAT IS WRONG — missing Iterator pattern
// =============================================================================
// PATTERN IDEA: expose a way to traverse a collection (next()/done, or an
// iterable) WITHOUT revealing how it's stored. Consumers loop over elements, not
// over the internal representation.
//
// WHAT'S WRONG HERE: Matrix.data is public number[][]. Every consumer writes
// nested row/col loops and hardcodes "it's a row-major 2D array."
//
// REAL SCENARIO: you switch storage to a flat Float64Array (for performance) or
// a sparse map. Every nested loop in every consumer breaks, because they all
// depend on the exact shape. You also can't offer alternative traversals
// (column-major, diagonal) without each caller rewriting loops.
//
// WHY BAD: storage is leaked, so consumers are coupled to it; traversal logic is
// duplicated everywhere; changing internals is a breaking change.
//
// HOW TO FIX (no code): keep data private; give Matrix an iterator (e.g. an
// each()/[Symbol.iterator]) that yields cells. Consumers iterate without knowing
// the backing structure; you can add row/column/diagonal iterators and swap
// storage freely.
// =============================================================================
// ❌ NO ITERATOR — the 2D backing array is public; every consumer writes nested
// loops and depends on row-major storage.
export class Matrix {
  public data: number[][]; // exposed internals
  constructor(rows: number, cols: number) {
    this.data = Array.from({ length: rows }, () => Array(cols).fill(0));
  }
}
const m = new Matrix(2, 2);
m.data[0][1] = 5;
// consumer knows it's number[][] and iterates manually:
for (let r = 0; r < m.data.length; r++)
  for (let c = 0; c < m.data[r].length; c++) console.log(m.data[r][c]);

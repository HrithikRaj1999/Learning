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

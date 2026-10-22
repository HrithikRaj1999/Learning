'use strict';

globalThis.VectorMathReady = import('https://esm.sh/ml-matrix@6.12.1?bundle').then(library => {
  const { Matrix, SingularValueDecomposition, pseudoInverse } = library;
  const tolerance = 1e-10;
  const clean = value => Math.abs(value) < tolerance ? 0 : value;
  const norm = values => Matrix.columnVector(values).norm();

  function matrixFromVectors(vectors) {
    if (!Array.isArray(vectors) || vectors.length < 1 || vectors.length > 6) throw new Error('Use one to six vectors.');
    const dimension = vectors[0].length;
    if (dimension < 1 || dimension > 6 || vectors.some(vector => vector.length !== dimension || vector.some(value => !Number.isFinite(value)))) {
      throw new Error('Each vector needs the same number of finite coordinates, from one to six.');
    }
    return new Matrix(vectors).transpose();
  }

  function decomposition(matrix) {
    return new SingularValueDecomposition(matrix, { autoTranspose: true });
  }

  function rankOf(matrix, threshold) {
    return decomposition(matrix).diagonal.filter(value => value > threshold).length;
  }

  function analyze(vectors) {
    const matrix = matrixFromVectors(vectors);
    const singular = decomposition(matrix);
    const threshold = tolerance * Math.max(matrix.rows, matrix.columns) * (singular.diagonal[0] || 1);
    const rank = singular.diagonal.filter(value => value > threshold).length;
    const pivots = [];
    for (let column = 0; column < matrix.columns && pivots.length < rank; column++) {
      const candidate = new Matrix([...pivots, column].map(index => matrix.getColumn(index))).transpose();
      if (rankOf(candidate, threshold) > pivots.length) pivots.push(column);
    }
    const free = Array.from({ length: matrix.columns }, (_, index) => index).filter(index => !pivots.includes(index));
    const reduced = Matrix.zeros(matrix.rows, matrix.columns);
    let basisInverse = null;
    if (rank) {
      const basisMatrix = new Matrix(pivots.map(index => matrix.getColumn(index))).transpose();
      basisInverse = pseudoInverse(basisMatrix, threshold);
      const coordinates = basisInverse.mmul(matrix);
      for (let row = 0; row < rank; row++) {
        for (let column = 0; column < matrix.columns; column++) reduced.set(row, column, clean(coordinates.get(row, column)));
        pivots.forEach((column, pivotRow) => reduced.set(row, column, row === pivotRow ? 1 : 0));
      }
    }
    const nullBasis = free.map(column => {
      const vector = Array(matrix.columns).fill(0);
      vector[column] = 1;
      pivots.forEach((pivot, row) => { vector[pivot] = clean(-reduced.get(row, column)); });
      return vector;
    });
    return {
      matrix, rank, pivots, free, threshold, basisInverse,
      dimension: matrix.rows,
      count: matrix.columns,
      nullity: matrix.columns - rank,
      independent: rank === matrix.columns,
      spansAmbient: rank === matrix.rows,
      rref: reduced.to2DArray(),
      columnBasis: pivots.map(index => matrix.getColumn(index)),
      rowBasis: Array.from({ length: rank }, (_, index) => reduced.getRow(index)),
      nullBasis,
      orthonormalBasis: Array.from({ length: rank }, (_, index) => singular.leftSingularVectors.getColumn(index))
    };
  }

  function combine(vectors, coefficients) {
    const matrix = matrixFromVectors(vectors);
    if (coefficients.length !== matrix.columns || coefficients.some(value => !Number.isFinite(value))) throw new Error('One finite coefficient is required per vector.');
    return matrix.mmul(Matrix.columnVector(coefficients)).to1DArray();
  }

  function solve(analysis, target) {
    if (target.length !== analysis.dimension || target.some(value => !Number.isFinite(value))) throw new Error('The target must belong to the selected coordinate space.');
    const particular = Array(analysis.count).fill(0);
    if (analysis.rank) {
      const coordinates = analysis.basisInverse.mmul(Matrix.columnVector(target)).to1DArray();
      analysis.pivots.forEach((column, row) => { particular[column] = coordinates[row]; });
    }
    const closest = analysis.matrix.mmul(Matrix.columnVector(particular)).to1DArray();
    const residual = Matrix.sub(Matrix.columnVector(target), Matrix.columnVector(closest)).to1DArray();
    const residualNorm = norm(residual);
    const consistent = residualNorm <= tolerance * Math.max(norm(target), analysis.matrix.norm() * norm(particular)) * analysis.dimension;
    return {
      particular, closest, residual, residualNorm, consistent,
      augmentedRank: analysis.rank + (consistent ? 0 : 1),
      kind: !consistent ? 'No exact solution' : analysis.nullity ? 'Infinitely many solutions' : 'Unique solution'
    };
  }

  function transform(vectors, values) {
    const matrix = matrixFromVectors(vectors);
    if (values.length !== matrix.rows || values.some(row => row.length !== matrix.rows || row.some(value => !Number.isFinite(value)))) throw new Error('A square transformation matrix is required.');
    return new Matrix(values).mmul(matrix).transpose().to2DArray();
  }

  function project(vectors, axes) {
    return vectors.map(vector => axes.map(axis => axis === null ? 0 : vector[axis]));
  }

  function reductionSteps(vectors) {
    const working = matrixFromVectors(vectors);
    const pivotTolerance = tolerance * working.norm();
    const steps = [{ operation: 'A', matrix: working.to2DArray() }];
    let pivotRow = 0;
    for (let column = 0; column < working.columns && pivotRow < working.rows; column++) {
      let selectedRow = pivotRow;
      for (let row = pivotRow + 1; row < working.rows; row++) {
        if (Math.abs(working.get(row, column)) > Math.abs(working.get(selectedRow, column))) selectedRow = row;
      }
      if (Math.abs(working.get(selectedRow, column)) <= pivotTolerance) continue;
      if (selectedRow !== pivotRow) {
        working.swapRows(selectedRow, pivotRow);
        steps.push({ operation: `R_{${pivotRow + 1}}\\leftrightarrow R_{${selectedRow + 1}}`, matrix: working.to2DArray() });
      }
      const pivot = working.get(pivotRow, column);
      if (Math.abs(pivot - 1) > tolerance) {
        for (let entry = 0; entry < working.columns; entry++) working.set(pivotRow, entry, clean(working.get(pivotRow, entry) / pivot));
        steps.push({ operation: `R_{${pivotRow + 1}}\\leftarrow \\frac{1}{${formatTex(pivot)}}R_{${pivotRow + 1}}`, matrix: working.to2DArray() });
      }
      for (let row = 0; row < working.rows; row++) {
        if (row === pivotRow) continue;
        const factor = working.get(row, column);
        if (Math.abs(factor) < tolerance) continue;
        for (let entry = 0; entry < working.columns; entry++) working.set(row, entry, clean(working.get(row, entry) - factor * working.get(pivotRow, entry)));
        steps.push({ operation: `R_{${row + 1}}\\leftarrow R_{${row + 1}}${factor < 0 ? '+' : '-'}(${formatTex(Math.abs(factor))})R_{${pivotRow + 1}}`, matrix: working.to2DArray() });
      }
      pivotRow++;
    }
    return steps;
  }

  const format = value => String(Number(value.toPrecision(7)));
  const formatTex = value => format(value).replace(/e([+-]?\d+)/i, '\\times 10^{$1}');
  const identity = dimension => Matrix.eye(dimension).to2DArray();
  return { analyze, combine, solve, transform, project, reductionSteps, format, formatTex, norm, identity, tolerance };
});
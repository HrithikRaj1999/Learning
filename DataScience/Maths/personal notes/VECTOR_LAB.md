# Vector Lab

Open [Vector Lab](space-span-subspace.html) directly in a browser. No development server is needed.

## Start Here

1. **Space** chooses the number of coordinates per vector, from one to six.
2. **Vectors** chooses the number of generating vectors, from one to six.
3. Edit a vector's coordinates in its colored row.
4. Change the coefficients to construct a linear combination.
5. Change views to inspect the same data using different methods.

The initial example has four vectors in R3. Vector four is the sum of vectors one and two.

## Views

| View | Purpose |
|---|---|
| Explore | Generating vectors, combinations, spans, and projections |
| Basis & rank | Original pivot columns, RREF, row operations, row space, and null space |
| Solve Ax = b | Span membership, particular solutions, free coefficients, and residuals |
| Transform | Square matrix transformations, including scaling and dimension reduction |
| Practice | Six constructed Lecture 3 questions, feedback, worked answers, and a timer |

RREF means reduced row echelon form. In the solver, the unknown coefficient vector is called c: A c = b.

## Higher Dimensions

The 3D view displays three selected coordinates, not the complete geometry of R4, R5, or R6.
The 2D view displays two selected coordinates. Choose **All coordinates** to compare every component.

Rank, independence, membership, and basis calculations always use every coordinate.
A projection can hide independent directions. Overlapping arrows do not prove dependence in the full space.
Coordinate-profile crossings also do not establish dependence or intersection of the original vectors.

## Workspaces

The current vectors and settings are saved in this browser's local storage.
Undo and redo restore recent mathematical edits. The toolbar imports and exports workspace JSON.
PNG export captures the active graph. These files stay local; no account or backend is used.

## Requirements And Limits

Internet access loads pinned versions of Three.js, ml-matrix, ECharts, KaTeX, and Lucide.
The 3D view needs WebGL. Algebra and the all-coordinate chart remain available without WebGL.
Local scripts and the HTML entry page must remain together in this folder.

Inputs accept finite values with magnitude at most 1,000,000. Calculations use floating-point numbers.
Numerical rank uses a relative threshold based on singular values; nearly dependent data can be sensitive.
Row-operation displays use numerical arithmetic, not exact fractions or symbolic algebra.
Transformation matrices map the selected coordinate space into itself.
The tool does not decide whether arbitrary user-written sets are subspaces: its U is always a span.

## Course Context

Source: [Essential Mathematics, Lecture 3](../Class%20material/Lecture%203.pdf).
Practice questions are constructed examples, not predictions of the examination.
The full-space dimension, basis size, and number of coordinates are deliberately reported separately.
# DSEZC411 — Essential Mathematics for Data Science

Notes distilled from `Lecture 1.pdf`, `Lecture_2.pdf` (`Lecture_2-1` / `Lecture_2-2` are byte-identical copies), and `Assignment_1.pdf`.


> **Exam prep:** full step-wise solutions to every Assignment 1 question live in [`ASSIGNMENT_1_SOLUTIONS.md`](./ASSIGNMENT_1_SOLUTIONS.md). Use this file to understand the theory, that file to write answers.


---

## 0. Plain-English primer (read this first if the notation is new)

### `R^n` just means "list of n numbers"

`R` = all real numbers: `1`, `-4`, `2.7`, `0`.

- `R^3` = all lists of **3** real numbers — `(1, 1, 1)`, `(-2, 7.5, 3)`. This is ordinary 3D space; a point needs x, y, z.
- `R^5` = all lists of **5** real numbers — `(1, 2, 1, 2, -1)`. Cannot be drawn, but the rules are identical to 3D with five slots instead of three.

The superscript is only a count of slots. Nothing deeper.

### Why one matrix produces both `R^3` and `R^5`

```
C = [ 1   2   1   2  -1 ]   <- a ROW: 5 numbers  -> vector in R^5
    [ 1   1   0  -1   4 ]
    [ 1  -2   4   1   0 ]
      ^
      a COLUMN: 3 numbers -> vector in R^3
```

Same matrix, two slicing directions. Columns of a `3 x 5` matrix live in `R^3`; rows live in `R^5`.

### Span = "everywhere you can reach"

Only two moves are allowed on vectors:
1. **Scale** one — multiply by any real number (`3v`, `-0.5v`, `0v`)
2. **Add** them together

**Span = the set of every point reachable using those two moves.** (Formally: all linear combinations.)

| Vectors | Span | Why |
|---------|------|-----|
| `v = (1,0,0)` | the x-axis, a **line** | scaling only slides along one direction; no move ever produces a y or z |
| `v = (1,0,0)`, `w = (0,1,0)` | the **plane** `z = 0` | `3v + 5w = (3,5,0)`; every `(a,b,0)` is reachable, nothing with `z != 0` is |
| `v = (1,0,0)`, `w = (2,0,0)` | still just the **line** | `w = 2v` adds no new direction — a freeloader |

That third row is the entire reason for row reduction: **pivots identify which vectors are freeloaders.**

### Dimension = how many independent directions the span has

| Span | Dimension |
|------|-----------|
| just the origin | 0 |
| a line | 1 |
| a plane | 2 |
| all of 3D space | 3 |

### Basis = the minimum crew that still reaches everywhere

Drop the freeloaders, keep the workers. Remove any member of a basis and you permanently lose a direction.

### Applied to `C`

- **Column space** = span of C's 5 columns, each in `R^3`. Reduction finds 3 pivots, so only 3 columns carry new directions; the other 2 are freeloaders. Three independent directions inside `R^3` reach **everything** — line -> plane -> all of space. So `dim = 3` and the column space *is* all of `R^3`.
- **Row space** = span of C's 3 rows, each in `R^5`. All 3 are independent, so it is a 3-dimensional "slab" sitting inside 5D space — not all of `R^5`, which would need 5 independent directions.

Both dimensions equal 3. That shared number is the **rank**.

---

## 1. Lecture 1 — Vectors, Matrices, Gaussian Elimination

### Vectors
A vector is **any** object that can be added to another of its kind and scaled by a real number, producing the same kind of object. Geometric arrows in 2D/3D are one example; polynomials and matrices are others. Course works mainly in `R^n`.

- Addition: elementwise.
- Scalar multiplication: elementwise.
- Dot product: `<x, y> = sum_{i=1..n} x_i * y_i`.

### Matrices
An `(m, n)` matrix is an `m*n` tuple laid out in `m` rows and `n` columns. Row vector = `(1, n)` matrix. Column vector = `(m, 1)` matrix. `R^{m×n}` = set of all real `(m, n)` matrices. Addition is elementwise.

### Elementary row operations
Three, and only three:
1. Swap two rows — `R1 <-> R3`
2. Scale a row by a nonzero constant — `R4 <- 4*R4`
3. Add a multiple of one row to another — `R2 <- R2 - 4*R1`

**Key property:** these operations never change the solution set of `Ax = b`. That is the entire reason the algorithm is legal.

### Row echelon form (REF)
- **Pivot** = first nonzero entry in a row.
- All all-zero rows sit at the bottom.
- Each pivot lies strictly to the right of the pivot in the row above → staircase pattern.

### Reduced row echelon form (RREF)
- Every pivot equals 1.
- Pivot is the only nonzero entry in its column.

### Linear systems
`Ax = b` where `A ∈ R^{m×n}`, `x` is `n×1`, `b` is `m×1`.
- `b = 0` → **homogeneous** system.
- `b ≠ 0` → **non-homogeneous**.

**Augmented matrix** `[A | b]` is the object you actually row-reduce.

### Number of solutions
Exactly zero, one, or infinitely many. Never two, never five.
- 2 variables: solution is a point (unique), a line (infinite), or empty (parallel lines).
- 3 variables: each equation is a plane. Three planes meet in a point (unique), a line (infinite), or nowhere (none).

### Gaussian elimination — solving `Ax = b`
1. Build augmented matrix `[A | b]`.
2. Row-reduce to RREF.
3. **Particular solution** `x_p`: set all free variables to 0, read pivot variables off directly.
4. **Homogeneous solutions** `x_h`: solve `Ax = 0`; one basis vector per free variable (set that free var to 1, the rest to 0).
5. **General solution**: `x_g = x_p + λ1*h1 + λ2*h2 + ...`

Lecture example:

```
[1 3 2 0 21 | 5]      RREF      [1 3 0 0  3 | 1]
[0 0 2 0 18 | 4]  ---------->   [0 0 1 0  9 | 2]
[0 0 0 1 -4 | 0]                [0 0 0 1 -4 | 0]

x_p = (1, 0, 2, 0, 0)^T
x_h = λ1 (-3, 1, 0, 0, 0)^T + λ2 (-3, 0, -9, 4, 1)^T
x_g = x_p + x_h
```

### Matrix inverse — Gauss-Jordan
`A` invertible ⟺ RREF of `A` is `I_n` ⟺ every column is a pivot column.
Row-reduce `[A | I]` until the left block is `I`; the right block is then `A^{-1}`.

---

## 2. Lecture 2 — Groups, Vector Spaces, Subspaces, Span

### Linear combination
Given `x_1 ... x_k ∈ V`, any `v = λ1 x_1 + ... + λk x_k` is a linear combination.
The all-zero choice of `λ`s trivially gives `0`. The interesting question is whether a **non-trivial** combination can give `0`.

### Linear (in)dependence
- **Dependent**: there exist `λ_i`, at least one nonzero, with `sum λ_i x_i = 0`.
- **Independent**: `sum λ_i x_i = 0` forces every `λ_i = 0`.

Facts:
- Every finite set is either dependent or independent. No third case.
- If any vector in the set is the zero vector → automatically dependent (give it λ=1, everything else 0).
- If all vectors are nonzero: dependent ⟺ one of them is a linear combination of the others.

### Algorithm for checking independence
Put the vectors in as **columns** of a matrix `A`, reduce to row echelon form.
- **Pivot columns** → the independent vectors.
- **Non-pivot columns** → expressible as a linear combination of the pivot columns to their left.

Lecture example: `A = [[1,2,3],[2,4,4]]` reduces to `[[1,2,3],[0,0,-2]]`. Pivots in columns 1 and 3; column 2 is `2 × column 1`.

### Abelian group `(G, ⊗)`
1. **Closure**: `x ⊗ y ∈ G`
2. **Associativity**: `(x ⊗ y) ⊗ z = x ⊗ (y ⊗ z)`
3. **Identity**: `∃ e ∈ G`, `x ⊗ e = x`
4. **Inverse**: `∀x ∃y`, `x ⊗ y = y ⊗ x = e`
5. **Commutativity**: `x ⊗ y = y ⊗ x`

Examples: `(Z, +)` is Abelian. `(N_0, +)` is not a group — no inverses. `(Z, ·)` is not a group — identity exists (1) but most elements have no integer inverse.

### Real vector space `V = (𝒱, +, ·)`
`(𝒱, +)` is an Abelian group, plus an outer operation `· : R × 𝒱 → 𝒱` satisfying:
- **Distributivity**: `λ·(x + y) = λ·x + λ·y` and `(λ + ψ)·x = λ·x + ψ·x`
- **Associativity (outer)**: `λ·(ψ·x) = (λψ)·x`
- **Neutral element (outer)**: `1·x = x`

Elements of `𝒱` are called vectors. The neutral element of `(𝒱, +)` is the zero vector `[0, 0, ..., 0]^T`.

Examples: `R^n`; also `R^{m×n}` — matrices themselves form a vector space under elementwise addition and scalar multiplication.

### Vector subspace `U ⊆ V`
`U = (𝒰, +, ·)` with `𝒰 ⊆ 𝒱` is a subspace when it is itself a vector space under the restricted operations.

**Proof obligation (this is the standard exam recipe — only two things to check):**
1. `𝒰 ≠ ∅` (in practice: show `0 ∈ 𝒰`)
2. **Closure**:
   - `∀λ ∈ R, ∀x ∈ 𝒰` → `λx ∈ 𝒰`
   - `∀x, y ∈ 𝒰` → `x + y ∈ 𝒰`

Everything else (associativity, distributivity, commutativity, existence of the identity) is **inherited from `V`** for free, since those laws already hold for all `x ∈ V` and `𝒰 ⊆ 𝒱`. That inheritance is *why* the check is only two lines.

Examples:
- The y-axis in `R^2` → **is** a subspace.
- The square `-1 ≤ x ≤ 1, -1 ≤ y ≤ 1` in `R^2` → **not** a subspace (scaling by 5 escapes the set).
- `span(x_1, ..., x_m) ⊆ R^n` → always a subspace.
- **Nullspace** of `A` (solution set of `Ax = 0`) → a subspace. This is why homogeneous systems get special attention.

### Span
For `A = {x_1, ..., x_k} ⊆ V`, the set of **all** linear combinations of `A` is `span[A]`. If `span[A] = V`, `A` spans `V`.

### Basis and dimension (used by the assignment, follows directly from the above)
- **Basis** = a spanning set that is also linearly independent. Minimal spanning set / maximal independent set.
- **Dimension** = number of vectors in a basis.
- For a matrix: `rank(A)` = number of pivots = `dim(column space)` = `dim(row space)`. Row rank always equals column rank.
- **Rank–nullity**: for `A ∈ R^{m×n}`, `rank(A) + dim(null(A)) = n`.

---

## 3. Assignment 1 — what each question is really testing

Due **28 Aug 2026, 11:30 pm**. Handwritten, scanned, single PDF named `<BITS-ID>.pdf`. Individual, not group.

| Q | Marks | Tests |
|---|-------|-------|
| Q1 | 1 | Subspace proof from a defining condition (`sum x_i = 0`) |
| Q2 | 2 | Gaussian elimination: particular + homogeneous + general solution |
| Q3 | 2 | Column space / row space: subspace proof + basis + dimension |
| Q4 | 2 | Intersection of subspaces `S1 ∩ S2` |
| Q5 | 3 | Sum of subspaces `S1 + S2` |

---

## 4. Q3 in detail — what it wants, why, and what it is for

```
C = [ 1   2   1   2  -1 ]
    [ 1   1   0  -1   4 ]
    [ 1  -2   4   1   0 ]
```
`C` is `3 × 5`: three rows, five columns. Each **column** lives in `R^3` (3 entries). Each **row** lives in `R^5` (5 entries). That is the whole reason part (i) says `R^3` and part (ii) says `R^5` — it is not arbitrary, it falls out of the shape.

### (i) Column space

**Prove it is a subspace of `R^3`.**
The column space is `span{c_1, ..., c_5}`. Lecture 2 gives the result directly: *a span is always a subspace*. Reproduce the two-line proof rather than citing it:
- Non-empty: `0 = 0·c_1 + ... + 0·c_5` is in the set.
- Closed under `+`: `(sum a_i c_i) + (sum b_i c_i) = sum (a_i + b_i) c_i`, still a linear combination.
- Closed under scaling: `λ (sum a_i c_i) = sum (λ a_i) c_i`, still a linear combination.

All associativity / distributivity / identity laws are inherited from `R^3`. Done.

**Find basis and dimension.** Apply the Lecture 2 algorithm — vectors as columns, reduce to row echelon form, pivot columns are the independent ones:

```
R2 <- R2 - R1,  R3 <- R3 - R1:      R3 <- R3 - 4*R2:

[1   2   1   2  -1]                 [1   2   1   2   -1]
[0  -1  -1  -3   5]        ->       [0  -1  -1  -3    5]
[0  -4   3  -1   1]                 [0   0   7  11  -19]
```

Three pivots, in columns 1, 2, 3. So:

**Basis (take the pivot columns of the ORIGINAL `C`, not of the echelon form):**
```
(1, 1, 1)^T ,  (2, 1, -2)^T ,  (1, 0, 4)^T
```
**Dimension = 3.**

Since `dim = 3` and the space sits inside `R^3`, the column space **is all of `R^3`** — meaning `Cx = b` is solvable for every `b ∈ R^3`. Columns 4 and 5 are redundant; the RREF shows exactly how:
`c_4 = (-17/7) c_1 + (10/7) c_2 + (11/7) c_3`, `c_5 = (44/7) c_1 - (16/7) c_2 - (19/7) c_3`.

> **Common trap:** the basis vectors must be the pivot columns of `C` itself. Row operations preserve *which* columns are dependent, but they change the column space itself.

### (ii) Row space

**Prove it is a subspace of `R^5`.** Identical argument — it is a span of five-component vectors, so it is a subspace of `R^5`.

**Find basis and dimension.** Here the rule flips: row operations **preserve** the row space (each new row is a linear combination of old rows, and the process is reversible). So you take the nonzero rows of the echelon form directly:
```
(1,  2,  1,  2,  -1)
(0, -1, -1, -3,   5)
(0,  0,  7, 11, -19)
```
**Dimension = 3.**

### The point of the question
Row rank = column rank = **3**. Two spaces that live in completely different ambient spaces (`R^3` vs `R^5`), built from the same matrix, have the same dimension. That number is `rank(C)`. Rank–nullity then gives `dim(null(C)) = 5 - 3 = 2`, matching the two free variables (`x_4`, `x_5`).

### Why any of this is needed
- **Rank tells you what a linear system can do.** Column space = the set of `b` for which `Ax = b` is solvable. Full column-space rank here means every right-hand side is reachable.
- **Nullspace dimension tells you how non-unique the answer is.** `dim null = 2` means every solvable system has a 2-parameter family of solutions — exactly the `x_g = x_p + λ1 h1 + λ2 h2` shape from Lecture 1.
- **Basis = minimal honest description.** Five columns, but only three carry information. Stripping redundancy is the same idea that later becomes PCA, low-rank factorization, and dimensionality reduction.

### Where it shows up in data science
| Concept | Real use |
|---------|----------|
| Column space | Least squares: `Xβ̂` is the projection of `y` onto `col(X)`. The normal equations only work because of this. |
| Rank deficiency | Perfectly collinear features (e.g. one-hot with all levels kept) make `X^T X` singular → regression coefficients undefined. Detected by exactly this rank computation. |
| Nullspace | Directions in feature space that the model cannot distinguish. Nonzero nullspace = non-identifiable parameters. |
| Dimension / basis | PCA finds a low-dimensional basis; rank is the ceiling on how few dimensions can hold the data losslessly. |
| Row space | Independent constraints in a system. Redundant rows = redundant equations/observations. |
| Gaussian elimination | The core routine underneath `numpy.linalg.solve`, LU decomposition, and most direct solvers. |

### Answer checklist for Q3
- [ ] Stated the two subspace axioms (non-empty + closure under `+` and scalar `·`), and noted the rest is inherited from the parent space
- [ ] Showed the row reduction steps
- [ ] Column basis taken from **original `C`**, not from the echelon form
- [ ] Row basis taken from the **echelon form** rows
- [ ] Both dimensions stated as 3, and noted that this common value is `rank(C)`

---

## 5. Quick verification with sympy

```python
import sympy as sp
C = sp.Matrix([[1, 2, 1, 2, -1],
               [1, 1, 0, -1, 4],
               [1, -2, 4, 1, 0]])
C.rref()          # ([[1,0,0,-17/7,44/7],[0,1,0,10/7,-16/7],[0,0,1,11/7,-19/7]], (0,1,2))
C.rank()          # 3
C.columnspace()   # (1,1,1), (2,1,-2), (1,0,4)
C.rowspace()      # the three echelon rows
C.nullspace()     # 2 vectors -> confirms rank-nullity 3 + 2 = 5
```

Use this to check, not to submit — the assignment requires handwritten work.

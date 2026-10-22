# Lecture 1 - Exam Practice

**Topics:** Linear Systems, Gaussian Elimination, General Solution, Inverse

**Course:** DSEZC411 Essential Mathematics for Data Science

**Source:** `Maths/Class material/Lecture 1.pdf`, Webinar 1, Assignment 1 (Q2) and Quiz 1 question patterns

**Status:** practice for the midterm. These are predictions, not guaranteed exam questions.

### Fixed Notation
| Write | Meaning |
| :--- | :--- |
| $A,x,b$ | Coefficient matrix, unknown vector, right-hand side |
| $x_1,x_2,\ldots$ | Coordinates of the unknown vector |
| $t$ or $t_1,t_2$ | Free real parameters |
| $x_p,x_h$ | Particular and homogeneous solutions |
| $R_i,I$ | Row i; identity matrix |

> **Exam layout:** Given → AIM → numbered working → check → conclusion.
> Keep the same letters within each question type; standard topic symbols stay unchanged.

**Sections:** Formula sheet | Fixed routines | Solved examples | Practice questions.

---

## 1. Formula Sheet

### 1.1 Vectors and the dot product

A **vector** $x \in \mathbb{R}^n$ is an ordered list of $n$ real numbers. The **dot product** of $x,y \in \mathbb{R}^n$ multiplies matching entries and adds the products:

$$
\langle x, y\rangle \;=\; x^{\top}y \;=\; \sum_{i=1}^{n} x_i\,y_i
\qquad\qquad
\lVert x\rVert = \sqrt{\langle x,x\rangle}
$$

Two vectors are **orthogonal** (perpendicular) when $\langle x,y\rangle = 0$.

### 1.2 Matrix arithmetic

| Operation | Rule | Size rule |
| :--- | :--- | :--- |
| $A + B$, $\alpha A$ | entry by entry | $A$ and $B$ must have the same size |
| $AB$ | entry $(i,j)$ = row $i$ of $A$ times column $j$ of $B$ | $(m\times k)(k\times n) \to m\times n$ |
| $A^{\top}$ | rows become columns | $m\times n \to n\times m$ |

In general $AB \ne BA$: matrix multiplication is **not commutative**.

### 1.3 A linear system as $Ax = b$

$$
\begin{aligned}
2x_1 + 3x_2 + 5x_3 &= 1\\
4x_1 - 2x_2 - 7x_3 &= 8
\end{aligned}
\qquad\Longleftrightarrow\qquad
\underbrace{\begin{bmatrix} 2 & 3 & 5\\ 4 & -2 & -7\end{bmatrix}}_{A}
\underbrace{\begin{bmatrix} x_1\\ x_2\\ x_3\end{bmatrix}}_{x}
=
\underbrace{\begin{bmatrix} 1\\ 8\end{bmatrix}}_{b}
$$

- $A \in \mathbb{R}^{m\times n}$ holds the coefficients; $b$ holds the right-hand sides.
- If $b = \mathbf{0}$ the system is **homogeneous**; otherwise it is **non-homogeneous**.
- The **augmented matrix** writes them side by side: $[\,A \mid b\,]$.

### 1.4 The three elementary row operations

| Name | Symbol | Effect |
| :--- | :--- | :--- |
| Swap two rows | $R_i \leftrightarrow R_j$ | exchange rows |
| Scale a row | $R_i \leftarrow c\,R_i,\; c \ne 0$ | multiply a whole row by a non-zero number |
| Add a multiple of a row | $R_i \leftarrow R_i + c\,R_j$ | add $c$ times another row to this row |

These never change the solution set, which is why elimination is allowed.

### 1.5 Row echelon form (REF) and reduced row echelon form (RREF)

- **Pivot:** the first non-zero entry in a row.
- **REF:** zero rows at the bottom; each pivot lies to the right of the pivot in the row above (a staircase).
- **RREF:** additionally every pivot equals $1$ and is the **only** non-zero entry in its column.
- **Basic variables** sit in pivot columns; **free variables** sit in non-pivot columns.
- **REF is enough** for rank, consistency, the number of solutions and back-substitution.
- **RREF is needed** to read $x_p$ and the $v_i$ straight off, and to find $A^{-1}$.

### 1.6 How many solutions? (rank test)

Let $r = \operatorname{rank}(A)$ (number of pivots) and $n$ = number of unknowns.

| Situation after elimination | Rank condition | Number of solutions |
| :--- | :--- | :--- |
| A row reads $[\,0\;\cdots\;0 \mid c\,]$ with $c \ne 0$ | $\operatorname{rank}(A) < \operatorname{rank}([A\mid b])$ | **none** (inconsistent) |
| Consistent, no free variable | $\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) = n$ | **exactly one** |
| Consistent, at least one free variable | $\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) < n$ | **infinitely many** |

A row $[\,0\;\cdots\;0 \mid 0\,]$ is harmless: it reads $0 = 0$.

### 1.7 General solution of $Ax = b$

$$
x_{g} \;=\; \underbrace{x_p}_{\text{one particular solution: } Ax_p = b} \;+\; \underbrace{t_1 v_1 + t_2 v_2 + \cdots}_{x_h:\ \text{all solutions of } Ax = \mathbf{0}},
\qquad t_i \in \mathbb{R}
$$

It works because $A(x_p + x_h) = Ax_p + Ax_h = b + \mathbf 0 = b$.

**Reading the pieces straight off RREF**

| Piece | Right side | Free variables | Basic entries |
| :--- | :--- | :--- | :--- |
| $x_p$ | keep $b$ | all $= 0$ | the constants after the bar |
| $v_f$, one per free column $f$ | $\mathbf 0$ | $1$ in slot $f$, $0$ in the other free slots | minus the entries of column $f$ |

$$
(v_f)_f = 1,
\qquad
(v_f)_{\text{basic } i} = -\,[\text{RREF}]_{i,f}
$$

The sign flips because a pivot row $x_i + c\,x_f = 0$ means $x_i = -c\,x_f$. The $1$ in its own free slot and the $0$s in the other free slots make $v_1,\dots,v_k$ automatically independent, so they form a **basis** of $\operatorname{Null}(A)$.

### 1.8 Rank–Nullity check

$$
\operatorname{rank}(A) \;+\; \operatorname{nullity}(A) \;=\; n
\qquad\text{(pivots + free variables = number of columns)}
$$

### 1.9 Inverse

$A \in \mathbb{R}^{n\times n}$ is **invertible** when some $A^{-1}$ gives $AA^{-1} = A^{-1}A = I_n$.

$$
\left[\,A \mid I\,\right]
\quad\xrightarrow{\text{row operations}}\quad
\left[\,I \mid A^{-1}\,\right]
\qquad\qquad
\begin{bmatrix} a & b\\ c & d\end{bmatrix}^{-1} = \frac{1}{ad - bc}\begin{bmatrix} d & -b\\ -c & a\end{bmatrix}
$$

$A$ is invertible $\iff$ every column has a pivot $\iff$ $\det A \ne 0$.

---

## 2. Fixed Exam Routines

> Use the same headings for the same question type. Keep each named row operation.

### Routine A - Solve and classify $Ax = b$
Step | Write
--- | ---
1 | **Setting Up**
2 | **Row Reduction**
3 | **Rank And Variables**
4 | **Solution**
5 | **Check And Conclusion**

### Routine B - General solution $x = x_p + x_h$
Step | Write
--- | ---
1 | **Setting Up**
2 | **Row Reduction**
3 | **Basic And Free Variables**
4 | **General Solution**
5 | **Factor, Check And Conclude**

### Routine C - Inverse by Gauss–Jordan
Step | Write
--- | ---
1 | **Setting Up**
2 | **Forward Row Reduction**
3 | **Invertibility**
4 | **Find The Inverse**
5 | **Check And Conclusion**

### Routine D - Matrix arithmetic warm-ups
Step | Write
--- | ---
1 | **Sizes**
2 | **Calculation**
3 | **Check And Conclusion**

> **Stop rule:** If a required test fails, state the failure and conclusion.
---

## 3. Solved Examples — Solve and Classify $Ax = b$

> Follow the matching fixed routine above.

### Example A1 — exactly one solution

**Given** the system

$$
\begin{aligned}
x_1 + x_2 + x_3 &= 2\\
2x_1 + 3x_2 - x_3 &= 9\\
3x_1 - x_2 + 2x_3 &= -1
\end{aligned}
$$

**AIM:** Solve for $x_1, x_2, x_3$ and state how many solutions the system has.

#### 1. Setting Up

One row per equation, right-hand sides after the bar.

$$
\left[\begin{array}{ccc|c}
1 & 1 & 1 & 2\\
2 & 3 & -1 & 9\\
3 & -1 & 2 & -1
\end{array}\right]
$$

#### 2. Row Reduction

The pivot is the $1$ at position $(1,1)$.

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;1,\;-3 \mid 5)$ |
| $R_3 \leftarrow R_3 - 3R_1$ | $(0,\;-4,\;-1 \mid -7)$ |

$$
\left[\begin{array}{ccc|c}
1 & 1 & 1 & 2\\
0 & 1 & -3 & 5\\
0 & -4 & -1 & -7
\end{array}\right]
$$

The pivot is the $1$ at position $(2,2)$.

| Operation | New row |
| :--- | :--- |
| $R_3 \leftarrow R_3 + 4R_2$ | $(0,\;0,\;-13 \mid 13)$ |

$$
\left[\begin{array}{ccc|c}
1 & 1 & 1 & 2\\
0 & 1 & -3 & 5\\
0 & 0 & -13 & 13
\end{array}\right]
\qquad \textbf{REF}
$$

#### 3. Rank And Variables

No row reads $0 = c \ne 0$, so the system is consistent.

$$
\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) = 3
$$

Pivots in columns 1, 2, 3, so $x_1,x_2,x_3$ are all basic and there is **no free variable**. Rank $= 3 = n$, so the solution is **unique**.

#### 4. Solution

$$
\begin{aligned}
\text{row 3:}\quad -13x_3 &= 13 &&\Longrightarrow\; x_3 = -1\\
\text{row 2:}\quad x_2 - 3(-1) &= 5 &&\Longrightarrow\; x_2 = 2\\
\text{row 1:}\quad x_1 + 2 + (-1) &= 2 &&\Longrightarrow\; x_1 = 1
\end{aligned}
$$

#### 5. Check And Conclusion

| Equation | Put in $(1,2,-1)$ | Result |
| :--- | :--- | :--- |
| $x_1 + x_2 + x_3 = 2$ | $1 + 2 - 1$ | $2$ ✓ |
| $2x_1 + 3x_2 - x_3 = 9$ | $2 + 6 + 1$ | $9$ ✓ |
| $3x_1 - x_2 + 2x_3 = -1$ | $3 - 2 - 2$ | $-1$ ✓ |

Rank–Nullity: $3 + 0 = 3 = n$ ✓

$$
\boxed{\;x = \begin{bmatrix} 1\\ 2\\ -1\end{bmatrix}\ \text{is the only solution}\;}
$$

---

### Example A2 — no solution

**Given** the system

$$
\begin{aligned}
x + 2y + 3z &= 1\\
2x + 4y + 7z &= 5\\
3x + 6y + 10z &= 7
\end{aligned}
$$

**AIM:** Decide whether the system has a solution.

#### 1. Setting Up

$$
\left[\begin{array}{ccc|c}
1 & 2 & 3 & 1\\
2 & 4 & 7 & 5\\
3 & 6 & 10 & 7
\end{array}\right]
$$

#### 2. Row Reduction

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;0,\;1 \mid 3)$ |
| $R_3 \leftarrow R_3 - 3R_1$ | $(0,\;0,\;1 \mid 4)$ |

$$
\left[\begin{array}{ccc|c}
1 & 2 & 3 & 1\\
0 & 0 & 1 & 3\\
0 & 0 & 1 & 4
\end{array}\right]
$$

Column 2 is all zeros below row 1, so it gets no pivot. Move right to column 3, where row 2 has pivot $1$.

| Operation | New row |
| :--- | :--- |
| $R_3 \leftarrow R_3 - R_2$ | $(0,\;0,\;0 \mid 1)$ |

$$
\left[\begin{array}{ccc|c}
1 & 2 & 3 & 1\\
0 & 0 & 1 & 3\\
0 & 0 & 0 & 1
\end{array}\right]
\qquad \textbf{REF}
$$

#### 3. Rank Test

Read the last row as an equation:

$$
0x + 0y + 0z = 1
\qquad\Longrightarrow\qquad
0 = 1 \quad\text{(impossible)}
$$

$$
\operatorname{rank}(A) = 2 \;<\; 3 = \operatorname{rank}([A\mid b])
$$

#### 4. Conclusion

The contradiction $0=1$ proves inconsistency. No back-substitution is possible.

$$
\boxed{\;\text{No solution, because } \operatorname{rank}(A) \ne \operatorname{rank}([A\mid b])\;}
$$

---

### Example A3 — infinitely many solutions

**Given** the system

$$
\begin{aligned}
x_1 + 2x_2 - x_3 &= 3\\
2x_1 + 5x_2 + x_3 &= 8\\
3x_1 + 7x_2 \phantom{{}+x_3} &= 11
\end{aligned}
$$

**AIM:** Solve the system and state how many solutions it has.

#### 1. Setting Up

The third equation has no $x_3$, so its coefficient is $0$.

$$
\left[\begin{array}{ccc|c}
1 & 2 & -1 & 3\\
2 & 5 & 1 & 8\\
3 & 7 & 0 & 11
\end{array}\right]
$$

#### 2. Row Reduction

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;1,\;3 \mid 2)$ |
| $R_3 \leftarrow R_3 - 3R_1$ | $(0,\;1,\;3 \mid 2)$ |

Rows 2 and 3 are now identical, so one of them dies.

| Operation | New row |
| :--- | :--- |
| $R_3 \leftarrow R_3 - R_2$ | $(0,\;0,\;0 \mid 0)$ |

$$
\left[\begin{array}{ccc|c}
1 & 2 & -1 & 3\\
0 & 1 & 3 & 2\\
0 & 0 & 0 & 0
\end{array}\right]
\qquad \textbf{REF}
$$

#### 3. Rank And Variables

The zero row reads $0 = 0$, which is always true, so the system is consistent.

$$
\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) = 2
$$

| Columns | Type | Variables |
| :--- | :--- | :--- |
| 1, 2 (pivot) | basic | $x_1, x_2$ |
| 3 (no pivot) | free | $x_3$ |

Rank $2 < 3 = n$, so there are **infinitely many** solutions.

#### 4. Solution

Name the free variable $x_3 = t$ and keep it symbolic.

$$
\begin{aligned}
\text{row 2:}\quad x_2 + 3t &= 2 &&\Longrightarrow\; x_2 = 2 - 3t\\
\text{row 1:}\quad x_1 + 2(2 - 3t) - t &= 3 &&\Longrightarrow\; x_1 = -1 + 7t
\end{aligned}
$$

Factor into a constant part and a $t$ part:

$$
x = \begin{bmatrix} -1 + 7t\\ 2 - 3t\\ t\end{bmatrix}
= \begin{bmatrix} -1\\ 2\\ 0\end{bmatrix} + t\begin{bmatrix} 7\\ -3\\ 1\end{bmatrix}
$$

#### 5. Check And Conclusion

Substitute with $t$ still symbolic, so the check covers every solution at once.

| Equation | Substitution | Result |
| :--- | :--- | :--- |
| $x_1 + 2x_2 - x_3 = 3$ | $(-1 + 7t) + 2(2 - 3t) - t$ | $3$ ✓ |
| $2x_1 + 5x_2 + x_3 = 8$ | $2(-1 + 7t) + 5(2 - 3t) + t$ | $8$ ✓ |
| $3x_1 + 7x_2 = 11$ | $3(-1 + 7t) + 7(2 - 3t)$ | $11$ ✓ |

Every $t$ cancels. Rank–Nullity: $2 + 1 = 3 = n$ ✓

$$
\boxed{\;x = \begin{bmatrix} -1\\ 2\\ 0\end{bmatrix} + t\begin{bmatrix} 7\\ -3\\ 1\end{bmatrix},\quad t \in \mathbb{R} \;\;\text{— a line in } \mathbb{R}^3\;}
$$

---

### Example A4 — a system with parameters $k$ and $m$

**Given** the system

$$
\begin{aligned}
x + y + z &= 6\\
x + 2y + 3z &= 10\\
x + 2y + kz &= m
\end{aligned}
$$

**AIM:** Find the values of $k$ and $m$ for which the system has (a) exactly one solution, (b) no solution, (c) infinitely many solutions.

#### 1. Setting Up

Keep $k$ and $m$ as letters and treat them like numbers.

$$
\left[\begin{array}{ccc|c}
1 & 1 & 1 & 6\\
1 & 2 & 3 & 10\\
1 & 2 & k & m
\end{array}\right]
$$

#### 2. Row Reduction

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - R_1$ | $(0,\;1,\;2 \mid 4)$ |
| $R_3 \leftarrow R_3 - R_1$ | $(0,\;1,\;k-1 \mid m-6)$ |

| Operation | New row |
| :--- | :--- |
| $R_3 \leftarrow R_3 - R_2$ | $(0,\;0,\;k-3 \mid m-10)$ |

$$
\left[\begin{array}{ccc|c}
1 & 1 & 1 & 6\\
0 & 1 & 2 & 4\\
0 & 0 & k-3 & m-10
\end{array}\right]
\qquad \textbf{REF}
$$

#### 3. Rank And Variables

Everything now depends on the last row:

$$(k-3)\,z = m - 10$$

| Case | Last row becomes | Ranks | Consistent? |
| :--- | :--- | :--- | :--- |
| $k \ne 3$ | pivot $k - 3 \ne 0$ | $3 = 3$ | yes |
| $k = 3,\ m \ne 10$ | $[\,0\;0\;0 \mid m - 10 \ne 0\,]$ | $2 < 3$ | **no** |
| $k = 3,\ m = 10$ | $[\,0\;0\;0 \mid 0\,]$ | $2 = 2$ | yes |

**Why the split is forced.** You may divide by $k-3$ only when $k - 3 \ne 0$. That one fact creates all three cases.

| Case | Pivots | Free | Solutions |
| :--- | :--- | :--- | :--- |
| $k \ne 3$ | 3 | none | **exactly one** |
| $k = 3,\ m \ne 10$ | 2 | — | **none** |
| $k = 3,\ m = 10$ | 2 | $z$ | **infinitely many** |

#### 4. Solution

Rows 1 and 2 are the same in both, so solve them once:

$$
y = 4 - 2z,
\qquad
x = 6 - (4 - 2z) - z = 2 + z
$$

Only row 3 differs — it pins $z$ down or releases it:

| Case | Row 3 gives | Solution |
| :--- | :--- | :--- |
| $k \ne 3$ | $z = \dfrac{m-10}{k-3}$ | $x = (2+z,\; 4-2z,\; z)$, one point |
| $k = 3,\ m = 10$ | $0 = 0$, so $z = t$ free | $x = (2,4,0) + t(1,-2,1)$, a line |

#### 5. Check And Conclusion

Unique case, take $k = 4$, $m = 14$: then $z = 4$, $y = -4$, $x = 6$.

$$
6 - 4 + 4 = 6 \;✓
\qquad
6 - 8 + 12 = 10 \;✓
\qquad
6 - 8 + 4(4) = 14 = m \;✓
$$

Infinite case, equation 3 with $k = 3$ and $t$ symbolic:

$$
(2 + t) + 2(4 - 2t) + 3t = 10 = m \;✓
$$

**Determinant shortcut** — finds the boundary fast, but still write the row work for marks:

$$
\det\begin{bmatrix} 1 & 1 & 1\\ 1 & 2 & 3\\ 1 & 2 & k\end{bmatrix}
= (2k - 6) - (k - 3) + (2 - 2) = k - 3
$$

$\det \ne 0 \iff k \ne 3 \iff$ exactly one solution. Only when $\det = 0$ does $m$ decide between none and infinitely many.

$$
\boxed{\;k \ne 3:\ \text{one}\qquad k = 3,\ m \ne 10:\ \text{none}\qquad k = 3,\ m = 10:\ \text{infinitely many}\;}
$$

---

### Example A5 — a $2\times 2$ system with a parameter (quiz style)

**Given** the system

$$
\begin{aligned}
x + 2y &= 3\\
2x + ky &= 6
\end{aligned}
$$

**AIM:** Find $k$ so that the system has (a) exactly one solution, (b) infinitely many solutions. Can it ever have no solution?

#### 1. Setting Up

$$
\left[\begin{array}{cc|c}
1 & 2 & 3\\
2 & k & 6
\end{array}\right]
$$

#### 2. Row Reduction

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;k-4 \mid 0)$ |

(only two rows, nothing left to clear).

$$
\left[\begin{array}{cc|c}
1 & 2 & 3\\
0 & k-4 & 0
\end{array}\right]
$$

#### 3. Rank And Variables

Look at the number after the bar in row 2: it is $0$, and it stays $0$ whatever $k$ is. A row can only kill a system if it reads $0 = c$ with $c \ne 0$.

So the system is **always consistent** — "no solution" is impossible here.

The last row is $(k-4)\,y = 0$.

| Case | Is $k-4$ a pivot? | Free | Solutions |
| :--- | :--- | :--- | :--- |
| $k \ne 4$ | yes | none | **exactly one** |
| $k = 4$ | no, row 2 is $[\,0\;0 \mid 0\,]$ | $y$ | **infinitely many** |

#### 4. Solution

| Case | Row 2 gives | Row 1 gives | Solution |
| :--- | :--- | :--- | :--- |
| $k \ne 4$ | $(k-4)y = 0 \Rightarrow y = 0$ | $x = 3$ | $(3,\,0)$ |
| $k = 4$ | $0 = 0 \Rightarrow y = t$ | $x = 3 - 2t$ | $(3,0) + t(-2,1)$ |

#### 5. Check And Conclusion

$$
(3,0):\quad 3 + 0 = 3 \;✓ \quad\text{and}\quad 6 + 0 = 6 \;✓ \quad\text{for every } k
$$

$$
(3-2t,\,t) \text{ with } k = 4:\quad 3 - 2t + 2t = 3 \;✓ \quad\text{and}\quad 6 - 4t + 4t = 6 \;✓
$$

$$
\boxed{\;k \ne 4:\ (x,y) = (3,0)\qquad k = 4:\ (3,0) + t(-2,1)\qquad \text{never none}\;}
$$

---

## 4. Practice Questions — Solve and Classify

> Marks shown are my estimate of exam weight, not official.

**Q1. (5 marks)** Solve by Gaussian elimination and state the number of solutions:

$$
\begin{aligned}
x_1 + 2x_2 + x_3 &= 9\\
2x_1 + 3x_2 - x_3 &= 9\\
3x_1 - x_2 + 2x_3 &= 4
\end{aligned}
$$

**Pattern:** A1. Use the five headings in Routine A.

**Q2. (4 marks)** Decide whether this system has no solution, one solution or infinitely many. Justify with ranks.

$$
\begin{aligned}
x + 2y - z &= 1\\
2x + 5y + z &= 4\\
x + 3y + 2z &= 5
\end{aligned}
$$

*Hint: after Step 3, read the last row carefully, as in Examples A2 and A3.*

**Q3. (5 marks)** For which values of $k$ and $m$ does the system have (a) one solution, (b) no solution, (c) infinitely many solutions?

$$
\begin{aligned}
x + y + z &= 3\\
x + 2y + 4z &= 5\\
x + 3y + kz &= m
\end{aligned}
$$

*Hint: follow Example A4. Your last row should be $(0,\,0,\,k - c \mid m - d)$ for two numbers $c, d$.*

**Q4. (3 marks)** Find $k$ for which the system has infinitely many solutions:

$$
\begin{aligned}
3x + 6y &= 9\\
x + ky &= 3
\end{aligned}
$$

*Hint: as in Example A5. Swap the rows first so the pivot is $1$.*

---

## 5. Solved Examples — General Solution $x = x_p + x_h$

> Follow the matching fixed routine above.

### Example B1 — the lecture's example

**Given** $Ax = b$ with

$$
A = \begin{bmatrix}
1 & 3 & 2 & 0 & 21\\
0 & 0 & 2 & 0 & 18\\
0 & 0 & 0 & 1 & -4
\end{bmatrix},
\qquad
b = \begin{bmatrix} 5\\ 4\\ 0\end{bmatrix}
$$

**AIM:** Find a particular solution, all solutions of $Ax = \mathbf 0$, and the general solution.

#### 1. Setting Up

Five unknowns, so five columns before the bar.

$$
\left[\begin{array}{ccccc|c}
1 & 3 & 2 & 0 & 21 & 5\\
0 & 0 & 2 & 0 & 18 & 4\\
0 & 0 & 0 & 1 & -4 & 0
\end{array}\right]
$$

#### 2. Row Reduction

Already in REF: pivots $1, 2, 1$ in columns 1, 3, 4, each to the right of the one above, all zeros below them. **No row operation needed.**

| Operation | Why | New row |
| :--- | :--- | :--- |
| $R_2 \leftarrow \tfrac12 R_2$ | make the pivot $1$ | $(0,\;0,\;1,\;0,\;9 \mid 2)$ |
| $R_1 \leftarrow R_1 - 2R_2$ | clear the $2$ above that pivot | $(1,\;3,\;0,\;0,\;3 \mid 1)$ |

Column 4 already has zeros above its pivot, so we are done.

$$
\left[\begin{array}{ccccc|c}
1 & 3 & 0 & 0 & 3 & 1\\
0 & 0 & 1 & 0 & 9 & 2\\
0 & 0 & 0 & 1 & -4 & 0
\end{array}\right]
\qquad \textbf{RREF}
$$

#### 3. Basic And Free Variables

| Columns | Type | Variables |
| :--- | :--- | :--- |
| 1, 3, 4 (pivot) | basic | $x_1, x_3, x_4$ |
| 2, 5 (no pivot) | free | $x_2, x_5$ |

No row reads $0 = c \ne 0$, and $\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) = 3 < 5$, so there are infinitely many solutions. One equation per pivot row:

$$
\begin{aligned}
\text{row 1:}\quad x_1 + 3x_2 + 3x_5 &= 1\\
\text{row 2:}\quad x_3 + 9x_5 &= 2\\
\text{row 3:}\quad x_4 - 4x_5 &= 0
\end{aligned}
$$

#### 4. General Solution

Two free variables need two different symbols, kept symbolic to the end so nothing is lost.

$$
x_2 = t_1,
\qquad
x_5 = t_2,
\qquad
t_1,t_2 \in \mathbb{R}
$$

$$
\begin{aligned}
\text{row 3:}\quad x_4 &= 4t_2\\
\text{row 2:}\quad x_3 &= 2 - 9t_2\\
\text{row 1:}\quad x_1 &= 1 - 3t_1 - 3t_2
\end{aligned}
$$

#### 5. Factor, Check And Conclude

$$
x = \begin{bmatrix} 1 - 3t_1 - 3t_2\\ t_1\\ 2 - 9t_2\\ 4t_2\\ t_2\end{bmatrix}
= \underbrace{\begin{bmatrix} 1\\ 0\\ 2\\ 0\\ 0\end{bmatrix}}_{x_p}
+ t_1\underbrace{\begin{bmatrix} -3\\ 1\\ 0\\ 0\\ 0\end{bmatrix}}_{v_1}
+ t_2\underbrace{\begin{bmatrix} -3\\ 0\\ -9\\ 4\\ 1\end{bmatrix}}_{v_2}
$$

The constant column is $x_p$; the column multiplying $t_i$ is $v_i$. Check against the **original** $A$:

| Vector | Row 1 | Row 2 | Row 3 | Target |
| :--- | :--- | :--- | :--- | :--- |
| $x_p$ | $1 + 2(2) = 5$ ✓ | $2(2) = 4$ ✓ | $0$ ✓ | $b$ |
| $v_1$ | $-3 + 3 = 0$ ✓ | $0$ ✓ | $0$ ✓ | $\mathbf 0$ |
| $v_2$ | $-3 - 18 + 21 = 0$ ✓ | $-18 + 18 = 0$ ✓ | $4 - 4 = 0$ ✓ | $\mathbf 0$ |

Rank–Nullity: $3 + 2 = 5 = n$ ✓

$$
\boxed{\;x_g = \begin{bmatrix} 1\\ 0\\ 2\\ 0\\ 0\end{bmatrix}
+ t_1\begin{bmatrix} -3\\ 1\\ 0\\ 0\\ 0\end{bmatrix}
+ t_2\begin{bmatrix} -3\\ 0\\ -9\\ 4\\ 1\end{bmatrix},\quad t_1,t_2 \in \mathbb{R}\;}
$$

**In words.** $x_p$ hits the target $b$; the $t$ part adds everything $A$ sends to $\mathbf 0$, so the total still hits $b$.

---

### Example B2 — full elimination, two free variables

**Given**

$$
\begin{aligned}
x_1 + 2x_2 + x_3 + x_4 &= 4\\
2x_1 + 4x_2 + 3x_3 + x_4 &= 9\\
-x_1 - 2x_2 + x_3 - 3x_4 &= -2
\end{aligned}
$$

**AIM:** Find the general solution in the form $x_p + t_1 v_1 + t_2 v_2$.

#### 1. Setting Up

$$
\left[\begin{array}{cccc|c}
1 & 2 & 1 & 1 & 4\\
2 & 4 & 3 & 1 & 9\\
-1 & -2 & 1 & -3 & -2
\end{array}\right]
$$

#### 2. Row Reduction

Column 2 is all zeros below row 1, so it gets no pivot; the next pivot is in column 3.

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;0,\;1,\;-1 \mid 1)$ |
| $R_3 \leftarrow R_3 + R_1$ | $(0,\;0,\;2,\;-2 \mid 2)$ |
| $R_3 \leftarrow R_3 - 2R_2$ | $(0,\;0,\;0,\;0 \mid 0)$ |

$$
\left[\begin{array}{cccc|c}
1 & 2 & 1 & 1 & 4\\
0 & 0 & 1 & -1 & 1\\
0 & 0 & 0 & 0 & 0
\end{array}\right]
\qquad \textbf{REF}
$$

| Operation | New row |
| :--- | :--- |
| $R_1 \leftarrow R_1 - R_2$ | $(1,\;2,\;0,\;2 \mid 3)$ |

$$
\left[\begin{array}{cccc|c}
1 & 2 & 0 & 2 & 3\\
0 & 0 & 1 & -1 & 1\\
0 & 0 & 0 & 0 & 0
\end{array}\right]
\qquad \textbf{RREF}
$$

#### 3. Basic And Free Variables

| Columns | Type | Variables |
| :--- | :--- | :--- |
| 1, 3 (pivot) | basic | $x_1, x_3$ |
| 2, 4 (no pivot) | free | $x_2, x_4$ |

The zero row reads $0 = 0$, and $\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) = 2 < 4$. One equation per pivot row:

$$
x_1 + 2x_2 + 2x_4 = 3,
\qquad
x_3 - x_4 = 1
$$

#### 4. General Solution

$$
x_2 = t_1,
\qquad
x_4 = t_2,
\qquad
t_1,t_2 \in \mathbb{R}
$$

$$
\begin{aligned}
\text{row 2:}\quad x_3 &= 1 + t_2\\
\text{row 1:}\quad x_1 &= 3 - 2t_1 - 2t_2
\end{aligned}
$$

#### 5. Factor, Check And Conclude

$$
x = \begin{bmatrix} 3 - 2t_1 - 2t_2\\ t_1\\ 1 + t_2\\ t_2\end{bmatrix}
= \underbrace{\begin{bmatrix} 3\\ 0\\ 1\\ 0\end{bmatrix}}_{x_p}
+ t_1\underbrace{\begin{bmatrix} -2\\ 1\\ 0\\ 0\end{bmatrix}}_{v_1}
+ t_2\underbrace{\begin{bmatrix} -2\\ 0\\ 1\\ 1\end{bmatrix}}_{v_2}
$$

| Vector | Eq. 1 | Eq. 2 | Eq. 3 | Target |
| :--- | :--- | :--- | :--- | :--- |
| $x_p$ | $3 + 0 + 1 + 0 = 4$ ✓ | $6 + 0 + 3 + 0 = 9$ ✓ | $-3 - 0 + 1 - 0 = -2$ ✓ | $b$ |
| $v_1$ | $-2 + 2 = 0$ ✓ | $-4 + 4 = 0$ ✓ | $2 - 2 = 0$ ✓ | $\mathbf 0$ |
| $v_2$ | $-2 + 1 + 1 = 0$ ✓ | $-4 + 3 + 1 = 0$ ✓ | $2 + 1 - 3 = 0$ ✓ | $\mathbf 0$ |

Rank–Nullity: $2 + 2 = 4 = n$ ✓

$$
\boxed{\;x_g = \begin{bmatrix} 3\\ 0\\ 1\\ 0\end{bmatrix}
+ t_1\begin{bmatrix} -2\\ 1\\ 0\\ 0\end{bmatrix}
+ t_2\begin{bmatrix} -2\\ 0\\ 1\\ 1\end{bmatrix},\quad t_1,t_2 \in \mathbb{R}\;}
$$

---

### Example B3 — two equations, three unknowns

**Given**

$$
\begin{aligned}
x_1 - x_2 + 2x_3 &= 1\\
2x_1 - x_2 + 5x_3 &= 4
\end{aligned}
$$

**AIM:** Find the general solution and describe it geometrically.

#### 1. Setting Up

$$
\left[\begin{array}{ccc|c}
1 & -1 & 2 & 1\\
2 & -1 & 5 & 4
\end{array}\right]
$$

#### 2. Row Reduction

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;1,\;1 \mid 2)$ |

| Operation | New row |
| :--- | :--- |
| $R_1 \leftarrow R_1 + R_2$ | $(1,\;0,\;3 \mid 3)$ |

$$
\left[\begin{array}{ccc|c}
1 & 0 & 3 & 3\\
0 & 1 & 1 & 2
\end{array}\right]
\qquad \textbf{RREF}
$$

#### 3. Basic And Free Variables

Basic $x_1, x_2$; free $x_3$. Here $\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) = 2 < 3$, and the pivot rows read

$$
x_1 + 3x_3 = 3,
\qquad
x_2 + x_3 = 2
$$

#### 4. General Solution

$x_3 = t$, $t \in \mathbb{R}$.

$$
\begin{aligned}
\text{row 2:}\quad x_2 &= 2 - t\\
\text{row 1:}\quad x_1 &= 3 - 3t
\end{aligned}
$$

#### 5. Factor, Check And Conclude

$$
x = \begin{bmatrix} 3 - 3t\\ 2 - t\\ t\end{bmatrix}
= \underbrace{\begin{bmatrix} 3\\ 2\\ 0\end{bmatrix}}_{x_p} + t\underbrace{\begin{bmatrix} -3\\ -1\\ 1\end{bmatrix}}_{v}
$$

| Vector | Eq. 1 | Eq. 2 | Target |
| :--- | :--- | :--- | :--- |
| $x_p$ | $3 - 2 + 0 = 1$ ✓ | $6 - 2 + 0 = 4$ ✓ | $b$ |
| $v$ | $-3 + 1 + 2 = 0$ ✓ | $-6 + 1 + 5 = 0$ ✓ | $\mathbf 0$ |

Rank–Nullity: $2 + 1 = 3 = n$ ✓

$$
\boxed{\;x_g = (3,2,0) + t(-3,-1,1),\quad t \in \mathbb{R} \;\;\text{— a line in } \mathbb{R}^3 \text{ where the two planes meet}\;}
$$

---

### Example B4 — homogeneous system, null space

**Given** $Ax = \mathbf 0$ with

$$
A = \begin{bmatrix}
1 & 2 & -1 & 3\\
2 & 4 & -1 & 5
\end{bmatrix}
$$

**AIM:** Find all solutions, give a basis for the null space, and verify Rank–Nullity.

#### 1. Setting Up

The right side is all zeros, and row operations keep it zero.

$$
\left[\begin{array}{cccc|c}
1 & 2 & -1 & 3 & 0\\
2 & 4 & -1 & 5 & 0
\end{array}\right]
$$

#### 2. Row Reduction

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;0,\;1,\;-1 \mid 0)$ |

| Operation | New row |
| :--- | :--- |
| $R_1 \leftarrow R_1 + R_2$ | $(1,\;2,\;0,\;2 \mid 0)$ |

$$
\left[\begin{array}{cccc|c}
1 & 2 & 0 & 2 & 0\\
0 & 0 & 1 & -1 & 0
\end{array}\right]
\qquad \textbf{RREF}
$$

#### 3. Basic And Free Variables

Basic $x_1, x_3$; free $x_2, x_4$. A homogeneous system is always consistent, because $x = \mathbf 0$ always works. The pivot rows read

$$
x_1 + 2x_2 + 2x_4 = 0,
\qquad
x_3 - x_4 = 0
$$

#### 4. General Solution

$x_2 = t_1$, $x_4 = t_2$, both in $\mathbb{R}$.

$$
\begin{aligned}
\text{row 2:}\quad x_3 &= t_2\\
\text{row 1:}\quad x_1 &= -2t_1 - 2t_2
\end{aligned}
$$

#### 5. Factor, Check And Conclude

The constant column is $\mathbf 0$, so $x_p = \mathbf 0$ and the general solution *is* the null space.

$$
x = \begin{bmatrix} -2t_1 - 2t_2\\ t_1\\ t_2\\ t_2\end{bmatrix}
= t_1\underbrace{\begin{bmatrix} -2\\ 1\\ 0\\ 0\end{bmatrix}}_{v_1} + t_2\underbrace{\begin{bmatrix} -2\\ 0\\ 1\\ 1\end{bmatrix}}_{v_2}
$$

| Vector | Row 1: $x_1 + 2x_2 - x_3 + 3x_4$ | Row 2: $2x_1 + 4x_2 - x_3 + 5x_4$ |
| :--- | :--- | :--- |
| $v_1$ | $-2 + 2 - 0 + 0 = 0$ ✓ | $-4 + 4 - 0 + 0 = 0$ ✓ |
| $v_2$ | $-2 + 0 - 1 + 3 = 0$ ✓ | $-4 + 0 - 1 + 5 = 0$ ✓ |

Rank–Nullity: $2 + 2 = 4 = n$ ✓

$$
\boxed{\;\operatorname{Null}(A) = \operatorname{span}\{v_1, v_2\},\quad \text{basis } \{v_1,v_2\},\quad \dim = 2\;}
$$

---

### Example B5 — given in REF, read the pieces off RREF

**Given** the augmented matrix

$$
\left[\begin{array}{cccc|c}
1 & 2 & 0 & 3 & 4\\
0 & 0 & 2 & 4 & 6\\
0 & 0 & 0 & 0 & 0
\end{array}\right]
$$

**AIM:** Find the general solution in the form $x_p + t_1 v_1 + t_2 v_2$, state rank and nullity, and check Rank–Nullity.

#### 1. Setting Up

Already given: four unknowns, so four columns before the bar.

#### 2. Row Reduction

Already in REF: pivots $1$ and $2$ in columns 1 and 3, zeros below both, zero row at the bottom. **No row operation needed.**

| Operation | Why | New row |
| :--- | :--- | :--- |
| $R_2 \leftarrow \tfrac12 R_2$ | make the pivot $1$ | $(0,\;0,\;1,\;2 \mid 3)$ |

Column 3 already has $0$ above its pivot, so we are done.

$$
\left[\begin{array}{cccc|c}
1 & 2 & 0 & 3 & 4\\
0 & 0 & 1 & 2 & 3\\
0 & 0 & 0 & 0 & 0
\end{array}\right]
\qquad \textbf{RREF}
$$

#### 3. Basic And Free Variables

| Columns | Type | Variables |
| :--- | :--- | :--- |
| 1, 3 (pivot) | basic | $x_1, x_3$ |
| 2, 4 (no pivot) | free | $x_2, x_4$ |

The zero row reads $0 = 0$, and $\operatorname{rank}(A) = \operatorname{rank}([A\mid b]) = 2 < 4$. One equation per pivot row:

$$
x_1 + 2x_2 + 3x_4 = 4,
\qquad
x_3 + 2x_4 = 3
$$

#### 4. General Solution

$x_2 = t_1$, $x_4 = t_2$, both in $\mathbb{R}$.

$$
\begin{aligned}
\text{row 2:}\quad x_3 &= 3 - 2t_2\\
\text{row 1:}\quad x_1 &= 4 - 2t_1 - 3t_2
\end{aligned}
$$

#### 5. Factor, Check And Conclude

$$
x = \begin{bmatrix} 4 - 2t_1 - 3t_2\\ t_1\\ 3 - 2t_2\\ t_2\end{bmatrix}
= \underbrace{\begin{bmatrix} 4\\ 0\\ 3\\ 0\end{bmatrix}}_{x_p}
+ t_1\underbrace{\begin{bmatrix} -2\\ 1\\ 0\\ 0\end{bmatrix}}_{v_1}
+ t_2\underbrace{\begin{bmatrix} -3\\ 0\\ -2\\ 1\end{bmatrix}}_{v_2}
$$

Cross-check with the sign-flip card of 1.7 — no back-substitution needed:

| Free column | Entries in the pivot rows | Flip the sign | Vector |
| :--- | :--- | :--- | :--- |
| col 2 | $(2,\,0)$ | $(-2,\,0)$ | $v_1 = (-2,\,1,\,0,\,0)$ ✓ |
| col 4 | $(3,\,2)$ | $(-3,\,-2)$ | $v_2 = (-3,\,0,\,-2,\,1)$ ✓ |

Check against the **original** rows $x_1 + 2x_2 + 3x_4$ and $2x_3 + 4x_4$:

| Vector | Row 1 | Row 2 | Target |
| :--- | :--- | :--- | :--- |
| $x_p$ | $4 + 0 + 0 = 4$ ✓ | $2(3) + 0 = 6$ ✓ | $b$ |
| $v_1$ | $-2 + 2 + 0 = 0$ ✓ | $0 + 0 = 0$ ✓ | $\mathbf 0$ |
| $v_2$ | $-3 + 0 + 3 = 0$ ✓ | $2(-2) + 4 = 0$ ✓ | $\mathbf 0$ |

Rank–Nullity: $2 + 2 = 4 = n$ ✓

$$
\boxed{\;x_g = \begin{bmatrix} 4\\ 0\\ 3\\ 0\end{bmatrix}
+ t_1\begin{bmatrix} -2\\ 1\\ 0\\ 0\end{bmatrix}
+ t_2\begin{bmatrix} -3\\ 0\\ -2\\ 1\end{bmatrix},\quad t_1,t_2 \in \mathbb{R}\;}
$$

---

## 6. Practice Questions — General Solution

**Q5. (6 marks)** Find the general solution in the form $x_p + t_1 v_1 + t_2 v_2$:

$$
\left[\begin{array}{cccc|c}
1 & 3 & 0 & 2 & 5\\
0 & 0 & 3 & 6 & 9\\
0 & 0 & 0 & 0 & 0
\end{array}\right]
$$

State rank and nullity, and check Rank–Nullity.
*Hint: already in REF, as in Example B5. Scale row 2 first, then use the sign-flip card of 1.7 to confirm your $v_1, v_2$.*

**Q6. (5 marks)** Find the general solution and describe it geometrically:

$$
\begin{aligned}
x_1 + x_2 + 2x_3 &= 3\\
2x_1 + 3x_2 + 5x_3 &= 8
\end{aligned}
$$

*Hint: same shape as Example B3; expect one free variable.*

**Q7. (6 marks)** Find the general solution in the form $x_p + t_1 v_1 + t_2 v_2$:

$$
\begin{aligned}
x_1 - x_2 + x_3 + 2x_4 &= 1\\
2x_1 - 2x_2 + 3x_3 + 3x_4 &= 4\\
x_1 - x_2 + 2x_3 + x_4 &= 3
\end{aligned}
$$

*Hint: follow Example B2. Column 2 will have no pivot.*

**Q8. (5 marks)** Find a basis for the null space of

$$
A = \begin{bmatrix}
1 & -1 & 2 & 1\\
2 & -2 & 5 & 3
\end{bmatrix}
$$

and verify Rank–Nullity.
*Hint: as in Example B4, $x_p = \mathbf 0$.*

---

### Extra drill — Q21–Q30, same type, more repetitions

Numbered from Q21 so the earlier numbering is unchanged. For each one give: RREF, basic and free variables, rank, nullity, $x_p$, every $v_i$, the general solution, the Rank–Nullity check, and the check $Ax_p = b$, $Av_i = \mathbf 0$ against the **original** matrix.

**Q21. (6 marks)** Already in REF — one scaling is all Step 3 needs:

$$
\left[\begin{array}{cccc|c}
1 & 4 & 0 & 2 & 7\\
0 & 0 & 5 & 10 & 15\\
0 & 0 & 0 & 0 & 0
\end{array}\right]
$$

*Hint: Example B5 exactly. Expect two free variables.*

**Q22. (7 marks)** Already in reduced row echelon form. Identify basic and free variables directly:

$$
\left[\begin{array}{ccccc|c}
1 & 2 & 0 & 4 & 1 & 3\\
0 & 0 & 1 & -2 & 5 & 6\\
0 & 0 & 0 & 0 & 0 & 0
\end{array}\right]
$$

*Hint: three free variables, so three $t$'s and three $v_i$. Read them with the sign-flip card of 1.7.*

**Q23. (6 marks)** In REF but **not** in RREF — Step 3 has real work:

$$
\left[\begin{array}{cccc|c}
1 & 3 & 2 & 0 & 8\\
0 & 0 & 1 & 4 & 2\\
0 & 0 & 0 & 0 & 0
\end{array}\right]
$$

*Hint: clear the $2$ sitting above the second pivot before reading anything off.*

**Q24. (6 marks)** Find a basis for the null space and verify Rank–Nullity:

$$
A = \begin{bmatrix}
1 & -2 & 0 & 3\\
0 & 0 & 1 & -1\\
2 & -4 & 1 & 5
\end{bmatrix}
$$

*Hint: homogeneous, so $x_p = \mathbf 0$ and the general solution is the null space itself.*

**Q25. (4 marks)** Find the general solution:

$$
\left[\begin{array}{ccc|c}
1 & 2 & -1 & 3\\
0 & 1 & 1 & 2\\
0 & 0 & 3 & 6
\end{array}\right]
$$

*Hint: count the pivots first. What does nullity $= 0$ do to the $t$ part?*

**Q26. (3 marks)** Classify and justify with ranks:

$$
\left[\begin{array}{ccc|c}
1 & 2 & 1 & 4\\
0 & 1 & 3 & 2\\
0 & 0 & 0 & 5
\end{array}\right]
$$

*Hint: read the last row as an equation before doing anything else.*

**Q27. (7 marks)** Not in REF — do the full forward pass first:

$$
\begin{aligned}
x_1 + x_2 + 2x_3 + x_4 &= 5\\
2x_1 + 2x_2 + 5x_3 + 3x_4 &= 12\\
x_1 + x_2 + 3x_3 + 2x_4 &= 7
\end{aligned}
$$

*Hint: column 2 will get no pivot, and one row will vanish.*

**Q28. (5 marks)** Already in RREF — read $x_p$ and the $v_i$ straight off, no back-substitution:

$$
\left[\begin{array}{ccccc|c}
1 & 0 & -3 & 0 & 2 & 7\\
0 & 1 & 4 & 0 & -5 & 1\\
0 & 0 & 0 & 1 & 6 & 3
\end{array}\right]
$$

*Hint: pivots in columns 1, 2, 4. Flip the sign of each free column's entries.*

**Q29. (2 marks)** Explain why the number of vectors $v_i$ always equals the number of free variables, and why $v_1,\dots,v_k$ are automatically linearly independent.

**Q30. (2 marks)** A consistent system has $n = 6$ unknowns and $\operatorname{rank}(A) = 4$. State the nullity, the number of $t$'s in the general solution, and the dimension of the solution set.

---

## 7. Solved Examples — Inverse by Gauss–Jordan

> Follow the matching fixed routine above.

### Example C1 — a $2\times 2$ matrix

**Given**

$$
A = \begin{bmatrix} 1 & 2\\ 3 & 7\end{bmatrix}
$$

**AIM:** Find $A^{-1}$ by the Gauss–Jordan algorithm.

#### 1. Setting Up

$$
\left[\begin{array}{cc|cc}
1 & 2 & 1 & 0\\
3 & 7 & 0 & 1
\end{array}\right]
$$

#### 2. Forward Row Reduction

Apply every operation to **all four** columns.

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 3R_1$ | $(0,\;1 \mid -3,\;1)$ |

#### 3. Invertibility

Pivots in both columns, no zero row on the left, so $A$ **is invertible** — continue.

#### 4. Find The Inverse

| Operation | New row |
| :--- | :--- |
| $R_1 \leftarrow R_1 - 2R_2$ | $(1,\;0 \mid 7,\;-2)$ |

Both are already $1$, so nothing to do.

$$
\left[\begin{array}{cc|cc}
1 & 0 & 7 & -2\\
0 & 1 & -3 & 1
\end{array}\right]
$$

$$
A^{-1} = \begin{bmatrix} 7 & -2\\ -3 & 1\end{bmatrix}
$$

#### 5. Check And Conclusion

$$
AA^{-1} =
\begin{bmatrix} 1(7) + 2(-3) & 1(-2) + 2(1)\\ 3(7) + 7(-3) & 3(-2) + 7(1)\end{bmatrix}
= \begin{bmatrix} 1 & 0\\ 0 & 1\end{bmatrix} \;✓
$$

Formula check: $\det A = 7 - 6 = 1$, and $\tfrac{1}{1}\begin{bmatrix} 7 & -2\\ -3 & 1\end{bmatrix}$ agrees ✓

$$
\boxed{\;A^{-1} = \begin{bmatrix} 7 & -2\\ -3 & 1\end{bmatrix}\;}
$$

---

### Example C2 — an upper-triangular $3\times 3$ matrix

**Given**

$$
A = \begin{bmatrix}
2 & 1 & 1\\
0 & 1 & 1\\
0 & 0 & 1
\end{bmatrix}
$$

**AIM:** Find $A^{-1}$, or show it does not exist.

#### 1. Setting Up

$$
\left[\begin{array}{ccc|ccc}
2 & 1 & 1 & 1 & 0 & 0\\
0 & 1 & 1 & 0 & 1 & 0\\
0 & 0 & 1 & 0 & 0 & 1
\end{array}\right]
$$

#### 2. Forward Row Reduction

$A$ is upper triangular, so every entry below a pivot is already $0$. **Nothing to do.**

#### 3. Invertibility

Pivots $2, 1, 1$ are all non-zero, one per column, so $A$ **is invertible** — continue.

#### 4. Find The Inverse

| Operation | Clears | New row |
| :--- | :--- | :--- |
| $R_2 \leftarrow R_2 - R_3$ | column 3 | $(0,\;1,\;0 \mid 0,\;1,\;-1)$ |
| $R_1 \leftarrow R_1 - R_3$ | column 3 | $(2,\;1,\;0 \mid 1,\;0,\;-1)$ |
| $R_1 \leftarrow R_1 - R_2$ | column 2 | $(2,\;0,\;0 \mid 1,\;-1,\;0)$ |

Only row 1 needs it.

| Operation | New row |
| :--- | :--- |
| $R_1 \leftarrow \tfrac12 R_1$ | $\left(1,\;0,\;0 \;\middle\vert\; \tfrac12,\;-\tfrac12,\;0\right)$ |

$$
A^{-1} = \begin{bmatrix}
\tfrac12 & -\tfrac12 & 0\\
0 & 1 & -1\\
0 & 0 & 1
\end{bmatrix}
$$

#### 5. Check And Conclusion

Row $i$ of $A$ times column $j$ of $A^{-1}$:

| Entry | Working | Value |
| :--- | :--- | :--- |
| $(1,1)$ | $2\cdot\tfrac12 + 1\cdot 0 + 1\cdot 0$ | $1$ ✓ |
| $(1,2)$ | $2\left(-\tfrac12\right) + 1(1) + 1(0)$ | $0$ ✓ |
| $(1,3)$ | $2(0) + 1(-1) + 1(1)$ | $0$ ✓ |
| $(2,2)$ | $0 + 1(1) + 1(0)$ | $1$ ✓ |
| $(2,3)$ | $0 + 1(-1) + 1(1)$ | $0$ ✓ |
| $(3,3)$ | $0 + 0 + 1(1)$ | $1$ ✓ |

Entries below the diagonal are $0$ because both matrices are upper triangular.

$$
\boxed{\;A \text{ is invertible, with } A^{-1} \text{ as above}\;}
$$

---

### Example C3 — a full $3\times 3$ matrix

**Given**

$$
A = \begin{bmatrix}
1 & 2 & 3\\
0 & 1 & 4\\
5 & 6 & 0
\end{bmatrix}
$$

**AIM:** Find $A^{-1}$ by the Gauss–Jordan algorithm.

#### 1. Setting Up

$$
\left[\begin{array}{ccc|ccc}
1 & 2 & 3 & 1 & 0 & 0\\
0 & 1 & 4 & 0 & 1 & 0\\
5 & 6 & 0 & 0 & 0 & 1
\end{array}\right]
$$

#### 2. Forward Row Reduction

Row 2 already starts with $0$, so only row 3 needs work.

| Operation | New row |
| :--- | :--- |
| $R_3 \leftarrow R_3 - 5R_1$ | $(0,\;-4,\;-15 \mid -5,\;0,\;1)$ |
| $R_3 \leftarrow R_3 + 4R_2$ | $(0,\;0,\;1 \mid -5,\;4,\;1)$ |

$$
\left[\begin{array}{ccc|ccc}
1 & 2 & 3 & 1 & 0 & 0\\
0 & 1 & 4 & 0 & 1 & 0\\
0 & 0 & 1 & -5 & 4 & 1
\end{array}\right]
$$

#### 3. Invertibility

Pivots $1, 1, 1$ in all three columns, so $A$ **is invertible** — continue.

#### 4. Find The Inverse

| Operation | Clears | New row |
| :--- | :--- | :--- |
| $R_2 \leftarrow R_2 - 4R_3$ | column 3 | $(0,\;1,\;0 \mid 20,\;-15,\;-4)$ |
| $R_1 \leftarrow R_1 - 3R_3$ | column 3 | $(1,\;2,\;0 \mid 16,\;-12,\;-3)$ |
| $R_1 \leftarrow R_1 - 2R_2$ | column 2 | $(1,\;0,\;0 \mid -24,\;18,\;5)$ |

All are already $1$.

$$
\left[\begin{array}{ccc|ccc}
1 & 0 & 0 & -24 & 18 & 5\\
0 & 1 & 0 & 20 & -15 & -4\\
0 & 0 & 1 & -5 & 4 & 1
\end{array}\right]
$$

$$
A^{-1} = \begin{bmatrix}
-24 & 18 & 5\\
20 & -15 & -4\\
-5 & 4 & 1
\end{bmatrix}
$$

#### 5. Check And Conclusion

| Row of $A$ | $\times$ col 1 $(-24,20,-5)$ | $\times$ col 2 $(18,-15,4)$ | $\times$ col 3 $(5,-4,1)$ |
| :--- | :--- | :--- | :--- |
| $(1,2,3)$ | $-24 + 40 - 15 = 1$ ✓ | $18 - 30 + 12 = 0$ ✓ | $5 - 8 + 3 = 0$ ✓ |
| $(0,1,4)$ | $20 - 20 = 0$ ✓ | $-15 + 16 = 1$ ✓ | $-4 + 4 = 0$ ✓ |
| $(5,6,0)$ | $-120 + 120 = 0$ ✓ | $90 - 90 = 0$ ✓ | $25 - 24 = 1$ ✓ |

$$
\boxed{\;A^{-1} = \begin{bmatrix} -24 & 18 & 5\\ 20 & -15 & -4\\ -5 & 4 & 1\end{bmatrix}\;}
$$

---

### Example C4 — a matrix with no inverse

**Given**

$$
A = \begin{bmatrix}
1 & 2 & 3\\
2 & 4 & 7\\
1 & 2 & 4
\end{bmatrix}
$$

**AIM:** Find $A^{-1}$, or show it does not exist.

#### 1. Setting Up

$$
\left[\begin{array}{ccc|ccc}
1 & 2 & 3 & 1 & 0 & 0\\
2 & 4 & 7 & 0 & 1 & 0\\
1 & 2 & 4 & 0 & 0 & 1
\end{array}\right]
$$

#### 2. Forward Row Reduction

Column 2 is all zeros below row 1, so it gets no pivot; move to column 3.

| Operation | New row |
| :--- | :--- |
| $R_2 \leftarrow R_2 - 2R_1$ | $(0,\;0,\;1 \mid -2,\;1,\;0)$ |
| $R_3 \leftarrow R_3 - R_1$ | $(0,\;0,\;1 \mid -1,\;0,\;1)$ |
| $R_3 \leftarrow R_3 - R_2$ | $(0,\;0,\;0 \mid 1,\;-1,\;1)$ |

$$
\left[\begin{array}{ccc|ccc}
1 & 2 & 3 & 1 & 0 & 0\\
0 & 0 & 1 & -2 & 1 & 0\\
0 & 0 & 0 & 1 & -1 & 1
\end{array}\right]
$$

#### 3. Invertibility

Row 3 of the **left** block is all zeros: only 2 pivots for 3 columns, so the left block can never become $I_3$. **Stop** — $A$ is *singular*.

#### 4. Check And Conclusion

Confirm by expanding the determinant along row 1:

$$
\det A = 1(4\cdot4 - 7\cdot2) - 2(2\cdot4 - 7\cdot1) + 3(2\cdot2 - 4\cdot1) = 2 - 2 + 0 = 0 \;✓
$$

The reason: column 2 is exactly $2\times$ column 1, so the columns are dependent.

$$
\boxed{\;A \text{ has no inverse}\;}
$$

---

## 8. Practice Questions — Inverse

**Q9. (3 marks)** Use the Gauss–Jordan algorithm to find the inverse of

$$
A = \begin{bmatrix} 2 & 5\\ 1 & 3\end{bmatrix}
$$

and check it with the $2\times 2$ formula.
*Hint: swap the rows first so the first pivot is $1$, then follow Example C1.*

**Q10. (4 marks)** Find the inverse of

$$
A = \begin{bmatrix}
1 & 2 & 0\\
0 & 1 & 3\\
0 & 0 & 1
\end{bmatrix}
$$

and verify $AA^{-1} = I$.
*Hint: upper triangular, as in Example C2.*

**Q11. (6 marks)** Find the inverse of

$$
A = \begin{bmatrix}
1 & 1 & 0\\
1 & 2 & 1\\
0 & 1 & 2
\end{bmatrix}
$$

*Hint: full forward and backward pass, as in Example C3. All entries of $A^{-1}$ are whole numbers.*

**Q12. (4 marks)** Decide whether

$$
A = \begin{bmatrix}
1 & 2 & 1\\
2 & 5 & 3\\
1 & 3 & 2
\end{bmatrix}
$$

is invertible. Justify with Gauss–Jordan and confirm with the determinant.
*Hint: watch for a zero row on the left, as in Example C4.*

---

## 9. Solved Examples — Matrix Arithmetic Warm-Ups (quiz style)

Four short questions, the same three steps every time: sizes, compute, check.

### Example D1 — matrix times matrix, and $AB \ne BA$

**Given** $A = \begin{bmatrix} 1 & 2\\ 3 & 4\end{bmatrix}$, $B = \begin{bmatrix} 2 & 0\\ 1 & 3\end{bmatrix}$.

**AIM:** Compute $AB$ and $BA$.

#### 1. Sizes

$(2\times 2)(2\times 2) \to 2\times 2$ both ways.

#### 2. Calculation

row of the left matrix times column of the right one.

$$
AB = \begin{bmatrix} 1(2) + 2(1) & 1(0) + 2(3)\\ 3(2) + 4(1) & 3(0) + 4(3)\end{bmatrix} = \begin{bmatrix} 4 & 6\\ 10 & 12\end{bmatrix},
\qquad
BA = \begin{bmatrix} 2(1) + 0(3) & 2(2) + 0(4)\\ 1(1) + 3(3) & 1(2) + 3(4)\end{bmatrix} = \begin{bmatrix} 2 & 4\\ 10 & 14\end{bmatrix}
$$

#### 3. Check And Conclusion

Entry $(1,1)$ is $4$ in $AB$ but $2$ in $BA$, so $AB \ne BA$. Order matters in matrix multiplication.

---

### Example D2 — matrix times vector

**Given** $A = \begin{bmatrix} 2 & 1 & 0\\ 1 & -1 & 3\end{bmatrix}$, $x = \begin{bmatrix} 1\\ 2\\ 1\end{bmatrix}$.

**AIM:** Compute $Ax$.

#### 1. Sizes

$(2\times 3)(3\times 1) \to 2\times 1$, so the answer has two entries.

#### 2. Calculation

each row of $A$ dotted with $x$.

$$
Ax = \begin{bmatrix} 2(1) + 1(2) + 0(1)\\ 1(1) + (-1)(2) + 3(1)\end{bmatrix} = \begin{bmatrix} 4\\ 2\end{bmatrix}
$$

#### 3. Check And Conclusion

$Ax$ is also $1\times$ column 1 $+\,2\times$ column 2 $+\,1\times$ column 3:

$$
1\begin{bmatrix} 2\\ 1\end{bmatrix} + 2\begin{bmatrix} 1\\ -1\end{bmatrix} + 1\begin{bmatrix} 0\\ 3\end{bmatrix} = \begin{bmatrix} 4\\ 2\end{bmatrix} \;✓
$$

---

### Example D3 — combination and transpose

**Given** $A = \begin{bmatrix} 1 & -2\\ 3 & 0\end{bmatrix}$, $B = \begin{bmatrix} 4 & 1\\ -1 & 2\end{bmatrix}$.

**AIM:** Compute $2A - B^{\top}$.

#### 1. Sizes

All $2\times 2$, so the subtraction is allowed.

#### 2. Calculation

Transpose $B$ (rows become columns) and double $A$:

$$
B^{\top} = \begin{bmatrix} 4 & -1\\ 1 & 2\end{bmatrix},
\qquad
2A = \begin{bmatrix} 2 & -4\\ 6 & 0\end{bmatrix}
$$

Subtract position by position:

$$
2A - B^{\top} = \begin{bmatrix} 2 - 4 & -4 - (-1)\\ 6 - 1 & 0 - 2\end{bmatrix} = \begin{bmatrix} -2 & -3\\ 5 & -2\end{bmatrix}
$$

#### 3. Check And Conclusion

Watch the double negative in entry $(1,2)$: $-4 - (-1) = -3$ ✓

---

### Example D4 — dot product, length and orthogonality

**Given** $x = (1,\,2,\,-1)$, $y = (3,\,-1,\,1)$.

**AIM:** Compute $\langle x,y\rangle$ and $\lVert x\rVert$, and decide whether $x \perp y$.

#### 1. Sizes

Both are in $\mathbb{R}^3$, so the dot product is defined and is a single number.

#### 2. Calculation

$$
\langle x,y\rangle = 1(3) + 2(-1) + (-1)(1) = 3 - 2 - 1 = 0,
\qquad
\lVert x\rVert = \sqrt{1 + 4 + 1} = \sqrt6
$$

#### 3. Check And Conclusion

A zero dot product means the vectors are orthogonal: $x \perp y$ ✓

---

## 10. Practice Questions — Warm-Ups

**Q13. (2 marks)** For $A = \begin{bmatrix} 2 & 1\\ 0 & 3\end{bmatrix}$ and $B = \begin{bmatrix} 1 & 4\\ 2 & -1\end{bmatrix}$, compute $AB$ and $BA$. Are they equal?
*Hint: as in Example D1.*

**Q14. (2 marks)** For $A = \begin{bmatrix} 1 & 0\\ 2 & -1\end{bmatrix}$ and $B = \begin{bmatrix} 0 & 3\\ 1 & 1\end{bmatrix}$, compute $3A - 2B$ and $(AB)^{\top}$.
*Hint: as in Examples D1 and D3.*

---

## 11. Practice Questions — Short Theory (2 marks each)

**Q15.** Name the three elementary row operations and say why they do not change the solution set.

**Q16.** Define a pivot. State the difference between row echelon form and reduced row echelon form.

**Q17.** A system has 4 unknowns and its augmented matrix reduces to 3 pivots with no inconsistent row. How many solutions does it have, and why?

**Q18.** Explain why a homogeneous system $Ax = \mathbf 0$ can never be inconsistent.

**Q19.** State the rank condition that tells you a system $Ax = b$ has no solution.

**Q20.** In the Gauss–Jordan algorithm, what does it mean if the left block cannot be reduced to $I_n$? Give one other test for the same fact.

---

## 12. Exam Traps

1. Applying a row operation to the coefficient part but forgetting the column after the bar (or the right block in Gauss–Jordan).
2. Reading $[\,0\;0\;0 \mid 0\,]$ as "no solution". That row is harmless; only $[\,0\;0\;0 \mid c \ne 0\,]$ kills the system.
3. Calling a solution unique when a free variable exists. Count pivots against the number of unknowns first.
4. Freezing a free variable at a number while building the general solution. Give each free variable its own $t_i$, keep it symbolic, and let $x_p$ and the $v_i$ appear from the column factoring.
5. Using $b$ when building the homogeneous vectors. The particular solution uses $b$; the homogeneous vectors use $\mathbf 0$.
6. Not naming row operations. Marks are given for $R_2 \leftarrow R_2 - 2R_1$ written explicitly.
7. Stopping at REF when the question asks for RREF (every pivot $1$ and alone in its column).
8. In a $k, m$ question, forgetting the third case: $k$ makes the pivot vanish, then $m$ decides between none and infinitely many.
9. Writing $AB = BA$ without checking. Matrix multiplication is not commutative.
10. Writing one $t$ for two different free variables. That forces them equal and shrinks the solution set.
11. Writing steps that the question has already ended. An inconsistent system stops at the rank check; a singular matrix stops at the zero-row check.

---

**Recall chain:** augmented matrix → row operations to REF → consistency and rank → basic and free variables → one $t_i$ per free variable → back-substitute → factor the columns into $x_p$ and the $v_i$ → check and Rank–Nullity; and for inverses: $[\,A \mid I\,]$ → forward → zero-row check → backward → scale → read → multiply to check

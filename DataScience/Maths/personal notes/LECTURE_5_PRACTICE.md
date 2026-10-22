# Lecture 5 - Exam Practice

**Topics:** QR Decomposition, SVD, Low-Rank Approximation

**Course:** DSEZC411 Essential Mathematics for Data Science

**Source:** `Maths/Class material/Lecture_5.pdf`, Webinar 2

**Status:** practice for the midterm. These are predictions, not guaranteed exam questions.

### Fixed Notation
| Write | Meaning |
| :--- | :--- |
| $a_i,u_i,e_i$ in QR | Column, perpendicular remainder, unit vector |
| $Q,R$ | Orthonormal columns; upper-triangular factor |
| $U,\Sigma,V$ in SVD | Left vectors, singular values, right vectors |
| $\sigma_i,u_i,v_i$ in SVD | Singular value and its matching unit vectors |

> **Exam layout:** Given → AIM → numbered working → check → conclusion.
> Keep the same letters within each question type; standard topic symbols stay unchanged.

**Sections:** Formula sheet | Fixed routines | Solved examples | Practice questions.

---

## 1. Formula Sheet

### 1.1 Inner product, length, projection

$$
\langle x,y\rangle = x^{\top}y,
\qquad
\lVert x\rVert = \sqrt{\langle x,x\rangle},
\qquad
\text{projection of } a \text{ on a unit vector } e:\;\; \langle a,e\rangle\,e
$$

A vector is a **unit vector** when its length is $1$; to normalize, divide by the length.

### 1.2 Orthogonal matrix

$Q$ is **orthogonal** when its columns are orthonormal (unit length, mutually perpendicular):

$$
Q^{\top}Q = I
\qquad\Longleftrightarrow\qquad
Q^{-1} = Q^{\top}\;\;(\text{square } Q)
$$

### 1.3 QR decomposition by Gram–Schmidt

For $A \in \mathbb{R}^{m\times k}$ with independent columns $a_1,\dots,a_k$: $A = QR$, $Q$ with orthonormal columns ($m\times k$), $R$ upper triangular ($k\times k$).

$$
\begin{aligned}
u_1 &= a_1, & e_1 &= \frac{u_1}{\lVert u_1\rVert}\\
u_2 &= a_2 - \langle a_2,e_1\rangle e_1, & e_2 &= \frac{u_2}{\lVert u_2\rVert}\\
u_3 &= a_3 - \langle a_3,e_1\rangle e_1 - \langle a_3,e_2\rangle e_2, & e_3 &= \frac{u_3}{\lVert u_3\rVert}
\end{aligned}
$$

$$
Q = \begin{bmatrix} e_1 & e_2 & \cdots & e_k\end{bmatrix},
\qquad
R = Q^{\top}A,
\qquad
R_{ii} = \lVert u_i\rVert,
\quad
R_{ij} = \langle e_i, a_j\rangle \;(i < j),
\quad
R_{ij} = 0 \;(i > j)
$$

Every number in $R$ is already computed during Gram–Schmidt.

### 1.4 Singular value decomposition (SVD)

For any $A \in \mathbb{R}^{m\times n}$ of rank $r$:

$$
A = U\,\Sigma\,V^{\top}
$$

| Piece | Size | What it is |
| :--- | :--- | :--- |
| $U$ | $m\times m$ | orthogonal; columns $u_i$ = left-singular vectors = unit eigenvectors of $AA^{\top}$ |
| $\Sigma$ | $m\times n$ (same as $A$) | $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_r > 0$ on the diagonal, zeros elsewhere |
| $V$ | $n\times n$ | orthogonal; columns $v_j$ = right-singular vectors = unit eigenvectors of $A^{\top}A$ |

Key links:

$$
\sigma_i = \sqrt{\lambda_i\!\left(A^{\top}A\right)},
\qquad
u_i = \frac{1}{\sigma_i}\,A\,v_i,
\qquad
v_i = \frac{1}{\sigma_i}\,A^{\top}u_i
\qquad (i = 1,\dots,r)
$$

- $A^{\top}A$ and $AA^{\top}$ share the same non-zero eigenvalues: find them from the **smaller** one.
- Singular values are never negative; rank $r$ = number of non-zero singular values.
- If $m > n$, $\Sigma$ has zero rows at the bottom; if $m < n$, zero columns on the right.
- Missing columns of $U$ or $V$ (when $\sigma = 0$ or the matrix is not square) are **completed** with unit vectors perpendicular to the ones already found.

### 1.5 Sum of rank-1 matrices and rank-$k$ approximation

$$
A = \sum_{i=1}^{r} \sigma_i\, u_i v_i^{\top}
\qquad\qquad
\hat A(k) = \sum_{i=1}^{k} \sigma_i\, u_i v_i^{\top}\quad (k < r)
$$

- Keep the $k$ largest singular values: they carry the most important structure of $A$.
- The error is exactly the dropped terms: $A - \hat A(k) = \sum_{i=k+1}^{r}\sigma_i u_i v_i^{\top}$.
- Storage: $\hat A(k)$ needs $k(m + n + 1)$ numbers instead of $mn$.

---

## 2. Fixed Exam Routines

> Use the same headings for the same question type. Keep each named row operation.

### Routine A - QR by Gram–Schmidt
Step | Write
--- | ---
1 | **Columns And Sizes**
2 | **Gram-Schmidt**
3 | **Check Orthonormality**
4 | **Matrices Q And R**
5 | **Check And Conclusion**

### Routine B - SVD
Step | Write
--- | ---
1 | **Sizes And Matrix Products**
2 | **Eigenvalues And Unit Eigenvectors**
3 | **Singular Values And Remaining Vectors**
4 | **Check**
5 | **Conclusion**

### Routine C - Rank-$k$ approximation
Step | Write
--- | ---
1 | **Rank-One Sum**
2 | **Keep And Compute**
3 | **Rank And Error**
4 | **Check And Storage**
5 | **Conclusion**

> **Stop rule:** If a required test fails, state the failure and conclusion.
---

## 3. Solved Examples — QR by Gram–Schmidt

> Follow the matching fixed routine above.

### Example A1 — the lecture's $2\times 2$ matrix

**Given**

$$
A = \begin{bmatrix} 1 & 1\\ 1 & 0\end{bmatrix}
$$

**AIM:** Find $Q$ (orthogonal) and $R$ (upper triangular) with $A = QR$.

#### 1. Columns And Sizes

$$
a_1 = \begin{bmatrix} 1\\ 1\end{bmatrix},
\qquad
a_2 = \begin{bmatrix} 1\\ 0\end{bmatrix},
\qquad
Q,\, R \in \mathbb{R}^{2\times 2}
$$

#### 2. Gram-Schmidt

**First vector:** nothing to subtract.

$$
u_1 = a_1 = \begin{bmatrix} 1\\ 1\end{bmatrix}
$$

**Length:** $\lVert u_1\rVert = \lVert a_1\rVert = \sqrt{1^2 + 1^2} = \sqrt2$.

**Normalize:**

$$
e_1 = \frac{u_1}{\lVert u_1\rVert} = \frac{1}{\sqrt2}\begin{bmatrix} 1\\ 1\end{bmatrix}
$$

**Projection coefficient:**

$$
\langle a_2, e_1\rangle = \tfrac{1}{\sqrt2}(1\cdot 1 + 0\cdot 1) = \tfrac{1}{\sqrt2}
$$

**Subtract the projection** (note $\tfrac{1}{\sqrt2}\cdot\tfrac{1}{\sqrt2} = \tfrac12$):

$$
u_2 = a_2 - \langle a_2,e_1\rangle e_1
= \begin{bmatrix} 1\\ 0\end{bmatrix} - \begin{bmatrix} \tfrac12\\ \tfrac12\end{bmatrix}
= \begin{bmatrix} \tfrac12\\ -\tfrac12\end{bmatrix}
$$

**Normalize:**

$$
\lVert u_2\rVert = \sqrt{\tfrac14 + \tfrac14} = \tfrac{1}{\sqrt2},
\qquad
e_2 = \sqrt2\,u_2 = \frac{1}{\sqrt2}\begin{bmatrix} 1\\ -1\end{bmatrix}
$$

**Not needed:** $A$ has only two columns.

#### 3. Check Orthonormality

$$
\langle e_1, e_2\rangle = \tfrac12(1 - 1) = 0 \;✓
\qquad
\lVert e_1\rVert = \lVert e_2\rVert = 1 \;✓
$$

#### 4. Matrices Q And R

$$
Q = \frac{1}{\sqrt2}\begin{bmatrix} 1 & 1\\ 1 & -1\end{bmatrix},
\qquad
R = \begin{bmatrix} \lVert u_1\rVert & \langle e_1,a_2\rangle\\ 0 & \lVert u_2\rVert\end{bmatrix}
= \begin{bmatrix} \sqrt2 & \tfrac{1}{\sqrt2}\\ 0 & \tfrac{1}{\sqrt2}\end{bmatrix}
$$

#### 5. Check And Conclusion

**Column by column:**

$$
\text{col 1: } \sqrt2\,e_1 = \begin{bmatrix} 1\\ 1\end{bmatrix} = a_1 \;✓
\qquad
\text{col 2: } \tfrac{1}{\sqrt2}e_1 + \tfrac{1}{\sqrt2}e_2 = \begin{bmatrix} \tfrac12 + \tfrac12\\ \tfrac12 - \tfrac12\end{bmatrix} = a_2 \;✓
$$

**Hence** $A = QR$ with $Q$, $R$ above.

**Sign note:** slide 3 shows the same factorization with some columns of $Q$ and rows of $R$ multiplied by $-1$. QR is unique only up to such sign flips; Gram–Schmidt always gives a positive diagonal in $R$.

---

### Example A2 — a $2\times 2$ matrix with decimal answers

**Given**

$$
A = \begin{bmatrix} 3 & 1\\ 4 & 2\end{bmatrix}
$$

**AIM:** Find $A = QR$ by Gram–Schmidt.

#### 1. Columns And Sizes

$$
a_1 = (3,\,4),
\qquad
a_2 = (1,\,2)
$$

#### 2. Gram-Schmidt

$$
\lVert a_1\rVert = \sqrt{9 + 16} = 5,
\qquad
e_1 = \tfrac15(3,\,4) = (0.6,\,0.8)
$$

**Coefficient:**

$$
\langle a_2,e_1\rangle = 1(0.6) + 2(0.8) = 2.2
$$

**Subtract the projection:**

$$
u_2 = (1,\,2) - 2.2\,(0.6,\,0.8) = (1 - 1.32,\; 2 - 1.76) = (-0.32,\; 0.24)
$$

**Normalize:**

$$
\lVert u_2\rVert = \sqrt{0.1024 + 0.0576} = \sqrt{0.16} = 0.4,
\qquad
e_2 = \frac{(-0.32,\;0.24)}{0.4} = (-0.8,\; 0.6)
$$

**Not needed:** two columns.

#### 3. Check Orthonormality

$$
\langle e_1,e_2\rangle = 0.6(-0.8) + 0.8(0.6) = -0.48 + 0.48 = 0 \;✓
\qquad
\lVert e_2\rVert = \sqrt{0.64 + 0.36} = 1 \;✓
$$

#### 4. Matrices Q And R

$$
Q = \begin{bmatrix} 0.6 & -0.8\\ 0.8 & 0.6\end{bmatrix},
\qquad
R = \begin{bmatrix} 5 & 2.2\\ 0 & 0.4\end{bmatrix}
$$

#### 5. Check And Conclusion

**Column 1:** $5\,e_1 = (3,\,4) = a_1$ ✓

**Column 2:** $2.2\,e_1 + 0.4\,e_2 = (1.32 - 0.32,\; 1.76 + 0.24) = (1,\,2) = a_2$ ✓

**Hence** $A = QR$ with $Q$, $R$ above.

---

### Example A3 — a tall $3\times 2$ matrix (thin QR)

**Given**

$$
A = \begin{bmatrix} 1 & 0\\ 1 & 1\\ 0 & 1\end{bmatrix}
$$

**AIM:** Find $Q \in \mathbb{R}^{3\times 2}$ with orthonormal columns and upper-triangular $R \in \mathbb{R}^{2\times 2}$ with $A = QR$.

#### 1. Columns And Sizes

$$
a_1 = (1,\,1,\,0),
\qquad
a_2 = (0,\,1,\,1)
$$

#### 2. Gram-Schmidt

$$
\lVert a_1\rVert = \sqrt2,
\qquad
e_1 = \tfrac{1}{\sqrt2}(1,\,1,\,0)
$$

**Coefficient:**

$$
\langle a_2,e_1\rangle = \tfrac{1}{\sqrt2}(0 + 1 + 0) = \tfrac{1}{\sqrt2}
$$

**Subtract the projection** $\tfrac{1}{\sqrt2}e_1 = (\tfrac12,\,\tfrac12,\,0)$:

$$
u_2 = (0,\,1,\,1) - \left(\tfrac12,\,\tfrac12,\,0\right) = \left(-\tfrac12,\,\tfrac12,\,1\right)
$$

**Normalize:**

$$
\lVert u_2\rVert = \sqrt{\tfrac14 + \tfrac14 + 1} = \sqrt{\tfrac32} = \tfrac{\sqrt6}{2},
\qquad
e_2 = \tfrac{2}{\sqrt6}\left(-\tfrac12,\,\tfrac12,\,1\right) = \tfrac{1}{\sqrt6}(-1,\,1,\,2)
$$

**Not needed:** two columns, so $Q$ has two columns.

#### 3. Check Orthonormality

$$
\langle e_1,e_2\rangle = \tfrac{1}{\sqrt{12}}(-1 + 1 + 0) = 0 \;✓
\qquad
\lVert e_2\rVert^2 = \tfrac16(1 + 1 + 4) = 1 \;✓
$$

#### 4. Matrices Q And R

$$
Q = \begin{bmatrix} \tfrac{1}{\sqrt2} & -\tfrac{1}{\sqrt6}\\ \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt6}\\ 0 & \tfrac{2}{\sqrt6}\end{bmatrix},
\qquad
R = \begin{bmatrix} \sqrt2 & \tfrac{1}{\sqrt2}\\ 0 & \tfrac{\sqrt6}{2}\end{bmatrix}
$$

#### 5. Check And Conclusion

**Column 2:** $\tfrac{1}{\sqrt2}e_1 + \tfrac{\sqrt6}{2}e_2 = \left(\tfrac12,\tfrac12,0\right) + \tfrac12(-1,\,1,\,2) = (0,\,1,\,1) = a_2$ ✓ (column 1 is $\sqrt2\,e_1 = a_1$ ✓)

**Hence** $A = QR$. Here $Q^{\top}Q = I_2$ but $QQ^{\top} \ne I_3$, because $Q$ is not square.

---

### Example A4 — a $3\times 3$ matrix

**Given**

$$
A = \begin{bmatrix} 1 & 1 & 0\\ 1 & 0 & 1\\ 0 & 1 & 1\end{bmatrix}
$$

**AIM:** Find $A = QR$ by Gram–Schmidt.

#### 1. Columns And Sizes

$$
a_1 = (1,\,1,\,0),
\qquad
a_2 = (1,\,0,\,1),
\qquad
a_3 = (0,\,1,\,1)
$$

#### 2. Gram-Schmidt

$$
\lVert a_1\rVert = \sqrt2,
\qquad
e_1 = \tfrac{1}{\sqrt2}(1,\,1,\,0)
$$

**Coefficient:** $\langle a_2,e_1\rangle = \tfrac{1}{\sqrt2}(1 + 0 + 0) = \tfrac{1}{\sqrt2}$.

**Subtract** $\tfrac{1}{\sqrt2}e_1 = (\tfrac12,\tfrac12,0)$:

$$
u_2 = (1,\,0,\,1) - \left(\tfrac12,\,\tfrac12,\,0\right) = \left(\tfrac12,\,-\tfrac12,\,1\right)
$$

**Normalize:** $\lVert u_2\rVert = \sqrt{\tfrac32} = \tfrac{\sqrt6}{2}$, so $e_2 = \tfrac{1}{\sqrt6}(1,\,-1,\,2)$.

**Two coefficients:**

$$
\langle a_3,e_1\rangle = \tfrac{1}{\sqrt2}(0 + 1 + 0) = \tfrac{1}{\sqrt2},
\qquad
\langle a_3,e_2\rangle = \tfrac{1}{\sqrt6}(0 - 1 + 2) = \tfrac{1}{\sqrt6}
$$

**The two projections as vectors:**

$$
\tfrac{1}{\sqrt2}e_1 = \left(\tfrac12,\,\tfrac12,\,0\right),
\qquad
\tfrac{1}{\sqrt6}e_2 = \left(\tfrac16,\,-\tfrac16,\,\tfrac26\right)
$$

**Subtract both from $a_3$:**

$$
u_3 = \left(0 - \tfrac12 - \tfrac16,\;\; 1 - \tfrac12 + \tfrac16,\;\; 1 - 0 - \tfrac26\right) = \left(-\tfrac23,\;\tfrac23,\;\tfrac23\right)
$$

**Normalize:** $\lVert u_3\rVert = \sqrt{3\cdot\tfrac49} = \tfrac{2}{\sqrt3}$, so $e_3 = \tfrac{1}{\sqrt3}(-1,\,1,\,1)$.

#### 3. Check Orthonormality

$$
(1,1,0)\cdot(1,-1,2) = 0,
\qquad
(1,1,0)\cdot(-1,1,1) = 0,
\qquad
(1,-1,2)\cdot(-1,1,1) = -1 - 1 + 2 = 0 \;✓
$$

#### 4. Matrices Q And R

$$
Q = \begin{bmatrix}
\tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt6} & -\tfrac{1}{\sqrt3}\\
\tfrac{1}{\sqrt2} & -\tfrac{1}{\sqrt6} & \tfrac{1}{\sqrt3}\\
0 & \tfrac{2}{\sqrt6} & \tfrac{1}{\sqrt3}
\end{bmatrix},
\qquad
R = \begin{bmatrix}
\sqrt2 & \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2}\\
0 & \tfrac{\sqrt6}{2} & \tfrac{1}{\sqrt6}\\
0 & 0 & \tfrac{2}{\sqrt3}
\end{bmatrix}
$$

#### 5. Check And Conclusion

**Column 3 of $QR$:**

$$
\tfrac{1}{\sqrt2}e_1 + \tfrac{1}{\sqrt6}e_2 + \tfrac{2}{\sqrt3}e_3
= \left(\tfrac12 + \tfrac16 - \tfrac23,\;\; \tfrac12 - \tfrac16 + \tfrac23,\;\; 0 + \tfrac13 + \tfrac23\right) = (0,\,1,\,1) = a_3 \;✓
$$

**Hence** $A = QR$ with $Q$ orthogonal and $R$ upper triangular.

---

## 4. Practice Questions — QR

> Marks shown are my estimate of exam weight, not official.

**Q1. (4 marks)** Find the QR decomposition of $A = \begin{bmatrix} 1 & 2\\ 1 & 0\end{bmatrix}$ and verify $QR = A$.
*Hint: same $a_1$ as Example A1.*

**Q2. (5 marks)** Find the thin QR decomposition ($Q$ is $3\times 2$, $R$ is $2\times 2$) of

$$
A = \begin{bmatrix} 2 & 1\\ 2 & 0\\ 1 & 1\end{bmatrix}
$$

*Hint: as in Example A3. $\lVert a_1\rVert = 3$ and every entry of $R$ is a whole number.*

**Q3. (4 marks)** Find the QR decomposition of $A = \begin{bmatrix} 3 & -1\\ 4 & 7\end{bmatrix}$.
*Hint: as in Example A2; $e_1 = (0.6, 0.8)$ again.*

---

## 5. Solved Examples — Singular Value Decomposition

> Follow the matching fixed routine above.

### Example B1 — the lecture's $2\times 3$ matrix

**Given**

$$
A = \begin{bmatrix} 1 & 0 & 1\\ -2 & 1 & 0\end{bmatrix}
$$

**AIM:** Find $U$, $\Sigma$, $V$ with $A = U\Sigma V^{\top}$.

#### 1. Sizes And Matrix Products

**Sizes:** $A$ is $2\times 3$, so $U$ is $2\times 2$, $\Sigma$ is $2\times 3$, $V$ is $3\times 3$.

**$AA^{\top}$ is $2\times 2$ (smaller than the $3\times 3$ $A^{\top}A$):**

$$
AA^{\top} = \begin{bmatrix} 1 + 0 + 1 & -2 + 0 + 0\\ -2 + 0 + 0 & 4 + 1 + 0\end{bmatrix} = \begin{bmatrix} 2 & -2\\ -2 & 5\end{bmatrix}
$$

#### 2. Eigenvalues And Unit Eigenvectors

**Characteristic polynomial:**

$$
\lambda^2 - 7\lambda + (10 - 4) = \lambda^2 - 7\lambda + 6 = (\lambda - 6)(\lambda - 1)
$$

**Singular values, largest first:** $\sigma_1 = \sqrt6$, $\sigma_2 = 1$. Two non-zero values, so $\operatorname{rank}A = 2$. ($A^{\top}A$ has the same $6$ and $1$ plus an extra $0$.)

**$\lambda = 6$:**

$$
AA^{\top} - 6I = \begin{bmatrix} -4 & -2\\ -2 & -1\end{bmatrix}
\;\Longrightarrow\;
-4x_1 - 2x_2 = 0
\;\Longrightarrow\;
x_2 = -2x_1
\;\Longrightarrow\;
u_1 = \tfrac{1}{\sqrt5}(1,\,-2)
$$

**$\lambda = 1$:**

$$
AA^{\top} - I = \begin{bmatrix} 1 & -2\\ -2 & 4\end{bmatrix}
\;\Longrightarrow\;
x_1 = 2x_2
\;\Longrightarrow\;
u_2 = \tfrac{1}{\sqrt5}(2,\,1)
$$

**Check:** $\langle u_1,u_2\rangle = \tfrac15(2 - 2) = 0$ ✓

#### 3. Singular Values And Remaining Vectors

$$
\Sigma = \begin{bmatrix} \sqrt6 & 0 & 0\\ 0 & 1 & 0\end{bmatrix}
$$

The last column is zero because $m = 2 < n = 3$.

**First:**

$$
A^{\top}u_1 = \tfrac{1}{\sqrt5}\begin{bmatrix} 1 & -2\\ 0 & 1\\ 1 & 0\end{bmatrix}\begin{bmatrix} 1\\ -2\end{bmatrix} = \tfrac{1}{\sqrt5}(5,\,-2,\,1),
\qquad
v_1 = \frac{1}{\sqrt6}\cdot\frac{1}{\sqrt5}(5,\,-2,\,1) = \tfrac{1}{\sqrt{30}}(5,\,-2,\,1)
$$

**Second:**

$$
A^{\top}u_2 = \tfrac{1}{\sqrt5}(2 - 2,\; 0 + 1,\; 2 + 0) = \tfrac{1}{\sqrt5}(0,\,1,\,2),
\qquad
v_2 = \tfrac{1}{1}\cdot\tfrac{1}{\sqrt5}(0,\,1,\,2)
$$

**Complete $V$ with a unit vector perpendicular to $v_1$ and $v_2$.** Solve $(5,-2,1)\cdot x = 0$ and $(0,1,2)\cdot x = 0$:

$$
x_2 = -2x_3,
\qquad
5x_1 + 4x_3 + x_3 = 0 \Rightarrow x_1 = -x_3
\qquad\Longrightarrow\qquad
v_3 = \tfrac{1}{\sqrt6}(-1,\,-2,\,1)
$$

This is the eigenvector of $A^{\top}A$ for $\lambda = 0$.

#### 4. Check

**First term:** the constants combine to $\dfrac{\sqrt6}{\sqrt5\sqrt{30}} = \dfrac15$:

$$
\sigma_1 u_1 v_1^{\top} = \frac15\begin{bmatrix} 1\\ -2\end{bmatrix}\begin{bmatrix} 5 & -2 & 1\end{bmatrix} = \begin{bmatrix} 1 & -0.4 & 0.2\\ -2 & 0.8 & -0.4\end{bmatrix}
$$

**Second term:** constants $\dfrac{1}{\sqrt5\sqrt5} = \dfrac15$:

$$
\sigma_2 u_2 v_2^{\top} = \frac15\begin{bmatrix} 2\\ 1\end{bmatrix}\begin{bmatrix} 0 & 1 & 2\end{bmatrix} = \begin{bmatrix} 0 & 0.4 & 0.8\\ 0 & 0.2 & 0.4\end{bmatrix}
$$

**Add:** $\begin{bmatrix} 1 & 0 & 1\\ -2 & 1 & 0\end{bmatrix} = A$ ✓

#### 5. Conclusion

**Hence**

$$
A =
\underbrace{\begin{bmatrix} \tfrac{1}{\sqrt5} & \tfrac{2}{\sqrt5}\\ -\tfrac{2}{\sqrt5} & \tfrac{1}{\sqrt5}\end{bmatrix}}_{U}
\underbrace{\begin{bmatrix} \sqrt6 & 0 & 0\\ 0 & 1 & 0\end{bmatrix}}_{\Sigma}
\underbrace{\begin{bmatrix} \tfrac{5}{\sqrt{30}} & 0 & -\tfrac{1}{\sqrt6}\\ -\tfrac{2}{\sqrt{30}} & \tfrac{1}{\sqrt5} & -\tfrac{2}{\sqrt6}\\ \tfrac{1}{\sqrt{30}} & \tfrac{2}{\sqrt5} & \tfrac{1}{\sqrt6}\end{bmatrix}^{\!\top}}_{V^{\top}}
$$

which matches slide 14.

---

### Example B2 — a rank-1 matrix (a zero singular value)

**Given**

$$
A = \begin{bmatrix} 2 & 2\\ 1 & 1\end{bmatrix}
$$

**AIM:** Find the SVD of $A$.

#### 1. Sizes And Matrix Products

$U$, $\Sigma$, $V$ are all $2\times 2$. Both products are $2\times 2$; use $A^{\top}A$:

$$
A^{\top}A = \begin{bmatrix} 2 & 1\\ 2 & 1\end{bmatrix}\begin{bmatrix} 2 & 2\\ 1 & 1\end{bmatrix} = \begin{bmatrix} 5 & 5\\ 5 & 5\end{bmatrix}
$$

#### 2. Eigenvalues And Unit Eigenvectors

$$
\lambda^2 - 10\lambda + 0 = \lambda(\lambda - 10)
\quad\Longrightarrow\quad
\lambda = 10,\; 0
\quad\Longrightarrow\quad
\sigma_1 = \sqrt{10},\;\; \sigma_2 = 0
$$

One non-zero singular value, so $\operatorname{rank}A = 1$.

**$\lambda = 10$:** $\begin{bmatrix} -5 & 5\\ 5 & -5\end{bmatrix}$ gives $x_1 = x_2$: $\;v_1 = \tfrac{1}{\sqrt2}(1,\,1)$.

**$\lambda = 0$:** $\begin{bmatrix} 5 & 5\\ 5 & 5\end{bmatrix}$ gives $x_1 = -x_2$: $\;v_2 = \tfrac{1}{\sqrt2}(1,\,-1)$.

#### 3. Singular Values And Remaining Vectors

$$
\Sigma = \begin{bmatrix} \sqrt{10} & 0\\ 0 & 0\end{bmatrix}
$$

**$u_1$:**

$$
Av_1 = \tfrac{1}{\sqrt2}(4,\,2),
\qquad
u_1 = \frac{1}{\sqrt{10}}\cdot\frac{1}{\sqrt2}(4,\,2) = \frac{1}{\sqrt{20}}(4,\,2) = \tfrac{1}{\sqrt5}(2,\,1)
$$

**$u_2$ cannot come from $Av_2/\sigma_2$,** because $\sigma_2 = 0$. Choose the unit vector perpendicular to $u_1$ (swap the entries, change one sign):

$$
u_2 = \tfrac{1}{\sqrt5}(-1,\,2),
\qquad
\langle u_1,u_2\rangle = \tfrac15(-2 + 2) = 0 \;✓
$$

#### 4. Check

$$
\sigma_1 u_1 v_1^{\top} = \sqrt{10}\cdot\frac{1}{\sqrt5}\cdot\frac{1}{\sqrt2}\begin{bmatrix} 2\\ 1\end{bmatrix}\begin{bmatrix} 1 & 1\end{bmatrix}
= 1\cdot\begin{bmatrix} 2 & 2\\ 1 & 1\end{bmatrix} = A \;✓
$$

The second term is $0\cdot u_2 v_2^{\top}$, which adds nothing.

#### 5. Conclusion

**Hence**

$$
A = \begin{bmatrix} \tfrac{2}{\sqrt5} & -\tfrac{1}{\sqrt5}\\ \tfrac{1}{\sqrt5} & \tfrac{2}{\sqrt5}\end{bmatrix}
\begin{bmatrix} \sqrt{10} & 0\\ 0 & 0\end{bmatrix}
\begin{bmatrix} \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2}\\ \tfrac{1}{\sqrt2} & -\tfrac{1}{\sqrt2}\end{bmatrix}^{\!\top}
$$

**Lesson:** when a singular value is $0$, complete $U$ (or $V$) with perpendicular unit vectors instead of dividing by zero.

---

### Example B3 — a tall $3\times 2$ matrix (completing $U$)

**Given**

$$
A = \begin{bmatrix} 1 & 1\\ 0 & 1\\ 1 & 0\end{bmatrix}
$$

**AIM:** Find the full SVD of $A$.

#### 1. Sizes And Matrix Products

**Sizes:** $U$ is $3\times 3$, $\Sigma$ is $3\times 2$, $V$ is $2\times 2$.

**$A^{\top}A$ is the smaller ($2\times 2$):**

$$
A^{\top}A = \begin{bmatrix} 1 + 0 + 1 & 1 + 0 + 0\\ 1 + 0 + 0 & 1 + 1 + 0\end{bmatrix} = \begin{bmatrix} 2 & 1\\ 1 & 2\end{bmatrix}
$$

#### 2. Eigenvalues And Unit Eigenvectors

$$
\lambda^2 - 4\lambda + 3 = (\lambda - 3)(\lambda - 1)
\quad\Longrightarrow\quad
\sigma_1 = \sqrt3,\;\; \sigma_2 = 1
$$

**$\lambda = 3$:** $\begin{bmatrix} -1 & 1\\ 1 & -1\end{bmatrix}$ gives $x_1 = x_2$: $\;v_1 = \tfrac{1}{\sqrt2}(1,\,1)$.

**$\lambda = 1$:** $\begin{bmatrix} 1 & 1\\ 1 & 1\end{bmatrix}$ gives $x_1 = -x_2$: $\;v_2 = \tfrac{1}{\sqrt2}(1,\,-1)$.

#### 3. Singular Values And Remaining Vectors

$$
\Sigma = \begin{bmatrix} \sqrt3 & 0\\ 0 & 1\\ 0 & 0\end{bmatrix}
$$

The bottom row is zero because $m = 3 > n = 2$.

**$u_1$:**

$$
Av_1 = \tfrac{1}{\sqrt2}(2,\,1,\,1),
\qquad
u_1 = \frac{1}{\sqrt3}\cdot\frac{1}{\sqrt2}(2,\,1,\,1) = \tfrac{1}{\sqrt6}(2,\,1,\,1)
$$

**$u_2$:**

$$
Av_2 = \tfrac{1}{\sqrt2}(0,\,-1,\,1),
\qquad
u_2 = \tfrac{1}{1}\cdot\tfrac{1}{\sqrt2}(0,\,-1,\,1)
$$

**$u_3$: a unit vector perpendicular to $u_1$ and $u_2$.** Solve $(2,1,1)\cdot x = 0$ and $(0,-1,1)\cdot x = 0$:

$$
x_3 = x_2,
\qquad
2x_1 + 2x_2 = 0 \Rightarrow x_1 = -x_2
\qquad\Longrightarrow\qquad
u_3 = \tfrac{1}{\sqrt3}(1,\,-1,\,-1)
$$

**Check $U$:** $(2,1,1)\cdot(0,-1,1) = 0$, $(2,1,1)\cdot(1,-1,-1) = 0$, $(0,-1,1)\cdot(1,-1,-1) = 0$ ✓

#### 4. Check

**First term** (constants $\tfrac{\sqrt3}{\sqrt6\sqrt2} = \tfrac12$):

$$
\sigma_1 u_1 v_1^{\top} = \frac12\begin{bmatrix} 2\\ 1\\ 1\end{bmatrix}\begin{bmatrix} 1 & 1\end{bmatrix} = \begin{bmatrix} 1 & 1\\ 0.5 & 0.5\\ 0.5 & 0.5\end{bmatrix}
$$

**Second term** (constants $\tfrac{1}{\sqrt2\sqrt2} = \tfrac12$):

$$
\sigma_2 u_2 v_2^{\top} = \frac12\begin{bmatrix} 0\\ -1\\ 1\end{bmatrix}\begin{bmatrix} 1 & -1\end{bmatrix} = \begin{bmatrix} 0 & 0\\ -0.5 & 0.5\\ 0.5 & -0.5\end{bmatrix}
$$

**Add:** $\begin{bmatrix} 1 & 1\\ 0 & 1\\ 1 & 0\end{bmatrix} = A$ ✓

#### 5. Conclusion

**Hence**

$$
A =
\begin{bmatrix} \tfrac{2}{\sqrt6} & 0 & \tfrac{1}{\sqrt3}\\ \tfrac{1}{\sqrt6} & -\tfrac{1}{\sqrt2} & -\tfrac{1}{\sqrt3}\\ \tfrac{1}{\sqrt6} & \tfrac{1}{\sqrt2} & -\tfrac{1}{\sqrt3}\end{bmatrix}
\begin{bmatrix} \sqrt3 & 0\\ 0 & 1\\ 0 & 0\end{bmatrix}
\begin{bmatrix} \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2}\\ \tfrac{1}{\sqrt2} & -\tfrac{1}{\sqrt2}\end{bmatrix}^{\!\top}
$$

---

### Example B4 — a wide $2\times 3$ matrix (start from $AA^{\top}$)

**Given**

$$
A = \begin{bmatrix} 3 & 2 & 2\\ 2 & 3 & -2\end{bmatrix}
$$

**AIM:** Find the full SVD of $A$.

#### 1. Sizes And Matrix Products

**Sizes:** $U$ is $2\times 2$, $\Sigma$ is $2\times 3$, $V$ is $3\times 3$.

**$AA^{\top}$ is the smaller:**

$$
AA^{\top} = \begin{bmatrix} 9 + 4 + 4 & 6 + 6 - 4\\ 6 + 6 - 4 & 4 + 9 + 4\end{bmatrix} = \begin{bmatrix} 17 & 8\\ 8 & 17\end{bmatrix}
$$

#### 2. Eigenvalues And Unit Eigenvectors

$$
\lambda^2 - 34\lambda + (289 - 64) = \lambda^2 - 34\lambda + 225 = (\lambda - 25)(\lambda - 9)
\quad\Longrightarrow\quad
\sigma_1 = 5,\;\; \sigma_2 = 3
$$

**$\lambda = 25$:** $\begin{bmatrix} -8 & 8\\ 8 & -8\end{bmatrix}$ gives $x_1 = x_2$: $\;u_1 = \tfrac{1}{\sqrt2}(1,\,1)$.

**$\lambda = 9$:** $\begin{bmatrix} 8 & 8\\ 8 & 8\end{bmatrix}$ gives $x_1 = -x_2$: $\;u_2 = \tfrac{1}{\sqrt2}(1,\,-1)$.

#### 3. Singular Values And Remaining Vectors

$$
\Sigma = \begin{bmatrix} 5 & 0 & 0\\ 0 & 3 & 0\end{bmatrix}
$$

**$v_1$:**

$$
A^{\top}u_1 = \tfrac{1}{\sqrt2}(3 + 2,\; 2 + 3,\; 2 - 2) = \tfrac{1}{\sqrt2}(5,\,5,\,0),
\qquad
v_1 = \tfrac15\cdot\tfrac{1}{\sqrt2}(5,\,5,\,0) = \tfrac{1}{\sqrt2}(1,\,1,\,0)
$$

**$v_2$:**

$$
A^{\top}u_2 = \tfrac{1}{\sqrt2}(3 - 2,\; 2 - 3,\; 2 + 2) = \tfrac{1}{\sqrt2}(1,\,-1,\,4),
\qquad
v_2 = \tfrac{1}{3\sqrt2}(1,\,-1,\,4)
$$

Length check: $\tfrac{1}{3\sqrt2}\sqrt{1 + 1 + 16} = \tfrac{\sqrt{18}}{3\sqrt2} = 1$ ✓
**$v_3$ perpendicular to both.** Solve $(1,1,0)\cdot x = 0$ and $(1,-1,4)\cdot x = 0$:

$$
x_2 = -x_1,
\qquad
x_1 + x_1 + 4x_3 = 0 \Rightarrow x_1 = -2x_3
\qquad\Longrightarrow\qquad
v_3 = \tfrac13(2,\,-2,\,-1)
$$

#### 4. Check

$$
\sigma_1u_1v_1^{\top} = \frac52\begin{bmatrix} 1 & 1 & 0\\ 1 & 1 & 0\end{bmatrix} = \begin{bmatrix} 2.5 & 2.5 & 0\\ 2.5 & 2.5 & 0\end{bmatrix},
\qquad
\sigma_2u_2v_2^{\top} = \frac12\begin{bmatrix} 1 & -1 & 4\\ -1 & 1 & -4\end{bmatrix} = \begin{bmatrix} 0.5 & -0.5 & 2\\ -0.5 & 0.5 & -2\end{bmatrix}
$$

Sum: $\begin{bmatrix} 3 & 2 & 2\\ 2 & 3 & -2\end{bmatrix} = A$ ✓

#### 5. Conclusion

**Hence** $A = U\Sigma V^{\top}$ with

$$
U = \tfrac{1}{\sqrt2}\begin{bmatrix} 1 & 1\\ 1 & -1\end{bmatrix},
\qquad
\Sigma = \begin{bmatrix} 5 & 0 & 0\\ 0 & 3 & 0\end{bmatrix},
\qquad
V = \begin{bmatrix} \tfrac{1}{\sqrt2} & \tfrac{1}{3\sqrt2} & \tfrac23\\ \tfrac{1}{\sqrt2} & -\tfrac{1}{3\sqrt2} & -\tfrac23\\ 0 & \tfrac{4}{3\sqrt2} & -\tfrac13\end{bmatrix}
$$

---

## 6. Practice Questions — SVD

**Q4. (5 marks)** Find the SVD of the rank-1 matrix $A = \begin{bmatrix} 1 & 2\\ 2 & 4\end{bmatrix}$.
*Hint: as in Example B2; one singular value is $0$.*

**Q5. (6 marks)** Find the full SVD of

$$
A = \begin{bmatrix} 1 & 0\\ 1 & 1\\ 0 & 1\end{bmatrix}
$$

State the sizes of $U$, $\Sigma$ and $V$ first. Complete $U$ with a third unit vector.
*Hint: as in Example B3; $A^{\top}A$ is the same matrix as there.*

**Q6. (4 marks)** Find the SVD of $A = \begin{bmatrix} 2 & 0\\ 0 & -3\end{bmatrix}$.
*Hint: singular values are never negative and are listed largest first; the minus sign goes into $U$.*

---

## 7. Solved Examples — Rank-$k$ Approximation

> Follow the matching fixed routine above.

### Example C1 — rank-1 approximation of the lecture's matrix

**Given** $A = \begin{bmatrix} 1 & 0 & 1\\ -2 & 1 & 0\end{bmatrix}$ with its SVD from Example B1 ($\sigma_1 = \sqrt6$, $\sigma_2 = 1$).

**AIM:** Find the best rank-1 approximation $\hat A(1)$ and the part it leaves out.

#### 1. Rank-One Sum

$$
A = \sigma_1 u_1 v_1^{\top} + \sigma_2 u_2 v_2^{\top}
\qquad (r = 2)
$$

#### 2. Keep And Compute

$$
\hat A(1) = \sigma_1 u_1 v_1^{\top}
$$

$$
\hat A(1) = \frac15\begin{bmatrix} 1\\ -2\end{bmatrix}\begin{bmatrix} 5 & -2 & 1\end{bmatrix} = \begin{bmatrix} 1 & -0.4 & 0.2\\ -2 & 0.8 & -0.4\end{bmatrix}
$$

#### 3. Rank And Error

**Row 2 is $-2\times$ row 1:** $-2(1, -0.4, 0.2) = (-2, 0.8, -0.4)$ ✓. One independent row: rank 1.

$$
A - \hat A(1) = \begin{bmatrix} 0 & 0.4 & 0.8\\ 0 & 0.2 & 0.4\end{bmatrix} = \sigma_2 u_2 v_2^{\top}\;\;(\text{B1, Step 4}) \;✓
$$

#### 4. Check And Storage

**$\sigma_1 = \sqrt6 \approx 2.45$ is larger than $\sigma_2 = 1$,** so the kept term carries most of $A$.

#### 5. Conclusion

**Hence** $\hat A(1) = \begin{bmatrix} 1 & -0.4 & 0.2\\ -2 & 0.8 & -0.4\end{bmatrix}$ and the error is $\sigma_2u_2v_2^{\top}$.

---

### Example C2 — rank-1 approximation of a tall matrix

**Given** $A = \begin{bmatrix} 1 & 1\\ 0 & 1\\ 1 & 0\end{bmatrix}$ with its SVD from Example B3 ($\sigma_1 = \sqrt3$, $\sigma_2 = 1$).

**AIM:** Find $\hat A(1)$ and the error.

#### 1. Rank-One Sum

$A = \sigma_1u_1v_1^{\top} + \sigma_2u_2v_2^{\top}$.

#### 2. Keep And Compute

$\hat A(1) = \sigma_1 u_1 v_1^{\top}$.

$$
\hat A(1) = \begin{bmatrix} 1 & 1\\ 0.5 & 0.5\\ 0.5 & 0.5\end{bmatrix}
$$

#### 3. Rank And Error

both columns are equal, so rank 1 ✓

$$
A - \hat A(1) = \begin{bmatrix} 1 - 1 & 1 - 1\\ 0 - 0.5 & 1 - 0.5\\ 1 - 0.5 & 0 - 0.5\end{bmatrix} = \begin{bmatrix} 0 & 0\\ -0.5 & 0.5\\ 0.5 & -0.5\end{bmatrix} = \sigma_2 u_2 v_2^{\top} \;✓
$$

#### 4. Check And Storage

$\sigma_1 = \sqrt3 \approx 1.73 > \sigma_2 = 1$; the approximation keeps the stronger direction $v_1 = \tfrac{1}{\sqrt2}(1,1)$ (the two columns treated alike).

#### 5. Conclusion

**Hence** $\hat A(1)$ is the matrix in Step 2, with error $\sigma_2u_2v_2^{\top}$.

---

### Example C3 — rank-1 approximation and storage

**Given** $A = \begin{bmatrix} 3 & 2 & 2\\ 2 & 3 & -2\end{bmatrix}$ with its SVD from Example B4 ($\sigma_1 = 5$, $\sigma_2 = 3$).

**AIM:** Find $\hat A(1)$, the error, and compare storage for a large matrix.

#### 1. Rank-One Sum

$A = 5\,u_1v_1^{\top} + 3\,u_2v_2^{\top}$.

#### 2. Keep And Compute

$\hat A(1) = 5\,u_1v_1^{\top}$.

$$
\hat A(1) = \begin{bmatrix} 2.5 & 2.5 & 0\\ 2.5 & 2.5 & 0\end{bmatrix}
$$

#### 3. Rank And Error

the two rows are equal, so rank 1 ✓

$$
A - \hat A(1) = \begin{bmatrix} 0.5 & -0.5 & 2\\ -0.5 & 0.5 & -2\end{bmatrix} = 3\,u_2v_2^{\top} \;✓
$$

#### 4. Check And Storage

**$\sigma_1 = 5$ against $\sigma_2 = 3$:** the kept term is the larger one, but the dropped one is not tiny, so the error here is visible.

**Storage for a rank-$k$ approximation of an $m\times n$ matrix:** $k$ vectors $u_i$ ($m$ numbers each), $k$ vectors $v_i$ ($n$ each) and $k$ singular values:

$$
k(m + n + 1)\;\text{ numbers instead of }\; mn
$$

For this $2\times 3$ matrix, $1\cdot(2 + 3 + 1) = 6 = mn$: no saving. For a $1000\times 1000$ image with $k = 20$: $20 \cdot 2001 = 40{,}020$ numbers instead of $1{,}000{,}000$.

#### 5. Conclusion

**Hence** $\hat A(1) = \begin{bmatrix} 2.5 & 2.5 & 0\\ 2.5 & 2.5 & 0\end{bmatrix}$; low-rank approximation pays off for large matrices whose singular values drop quickly.

---

## 8. Practice Questions — Approximation

**Q7. (3 marks)** Using your answer to Q5, write the rank-1 approximation $\hat A(1)$ and the error matrix $A - \hat A(1)$. Check that the error equals $\sigma_2u_2v_2^{\top}$.
*Hint: as in Example C2.*

**Q8. (2 marks)** A data matrix is $100\times 50$. How many numbers are needed to store its rank-5 approximation, and what fraction of the original storage is that?

**Pattern:** C3, Check And Storage.

---

## 9. Practice Questions — Short Theory (2 marks each)

**Q9.** Define an orthogonal matrix. What is its inverse?

**Q10.** In QR, why is $R$ always upper triangular?

**Q11.** Explain why $\Sigma$ has the same size as $A$, and describe its shape when $m > n$ and when $m < n$.

**Q12.** How are the singular values of $A$ related to the eigenvalues of $A^{\top}A$? Why use the smaller of $A^{\top}A$ and $AA^{\top}$?

**Q13.** Derive $u_i = \dfrac{1}{\sigma_i}Av_i$ starting from $A = U\Sigma V^{\top}$.

**Q14.** Write the formula for the rank-$k$ approximation $\hat A(k)$ and say why it keeps the largest singular values.

---

## 10. Exam Traps

1. Forgetting to normalize $u_i$ in Gram–Schmidt, so $Q$ is not orthogonal.
2. Projecting on the original $a_j$ instead of the orthonormal $e_j$.
3. Writing $\Sigma$ as square when $A$ is not square. It must match the size of $A$.
4. Listing singular values in increasing order, or writing a negative one. Convention: $\sigma_1 \ge \sigma_2 \ge \dots \ge 0$.
5. Pairing $u_i$ with the wrong $v_i$. Always compute one side from the other ($u_i = Av_i/\sigma_i$) so they match.
6. Dividing by a zero singular value. Complete $U$ or $V$ with perpendicular unit vectors instead.
7. Taking $\sigma_i = \lambda_i$ instead of $\sigma_i = \sqrt{\lambda_i}$.
8. Computing the $3\times 3$ product's eigenvalues when the $2\times 2$ product gives the same non-zero ones faster.

---

**Recall chain:** QR: normalize → subtract projections → normalize → $R_{ii} = \lVert u_i\rVert$, $R_{ij} = \langle e_i,a_j\rangle$; SVD: smaller product → eigenvalues → $\sigma = \sqrt\lambda$ → eigenvectors → other side by $A v/\sigma$ → complete → $\Sigma$ same size as $A$ → verify by rank-1 sum

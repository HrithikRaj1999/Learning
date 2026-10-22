# Lecture 4 - Exam Practice

**Topics:** Linear Maps, Eigenvalues, Diagonalization, Spectral Theorem, Cholesky

**Course:** DSEZC411 Essential Mathematics for Data Science

**Source:** `Maths/Class material/Lecture_4.pdf`, Webinar 2, Quiz 1 (PD / PSD questions)

**Status:** practice for the midterm. These are predictions, not guaranteed exam questions.

### Fixed Notation
| Write | Meaning |
| :--- | :--- |
| $T,x,y,t$ | Map, arbitrary vectors, real scalar |
| $\lambda,x$ | Eigenvalue and non-zero eigenvector |
| $P,D$ | Eigenvector matrix; matching diagonal eigenvalues |
| $L$ | Lower-triangular Cholesky factor |

> **Exam layout:** Given → AIM → numbered working → check → conclusion.
> Keep the same letters within each question type; standard topic symbols stay unchanged.

**Sections:** Formula sheet | Fixed routines | Solved examples | Practice questions.

---

## 1. Formula Sheet

### 1.1 Linear transformation

$T : V \to W$ is a **linear transformation** (linear map) when, for all $x,y \in V$ and $t \in \mathbb{R}$:

$$
T(x + y) = T(x) + T(y)
\qquad\text{and}\qquad
T(t x) = t\,T(x)
$$

Consequence: every linear map sends $\mathbf 0$ to $\mathbf 0$, since $T(\mathbf 0) = T(0\cdot x) = 0\cdot T(x) = \mathbf 0$. Every linear map $\mathbb{R}^n \to \mathbb{R}^m$ is $T(x) = Ax$ for an $m\times n$ matrix $A$.

**Fast failure filters:** a constant term ($a + 1$), a product ($ab$), a power ($a^2$), an absolute value $|a|$, or $\sin a$ breaks linearity.

### 1.2 Trace and determinant

$$
\operatorname{Tr}(A) = \sum_{i=1}^{n} a_{ii},
\qquad
\det\begin{bmatrix} a & b\\ c & d\end{bmatrix} = ad - bc
$$

| Property | Statement |
| :--- | :--- |
| Additivity | $\operatorname{Tr}(A + B) = \operatorname{Tr}(A) + \operatorname{Tr}(B)$ |
| Scaling | $\operatorname{Tr}(t A) = t\,\operatorname{Tr}(A)$ |
| Identity | $\operatorname{Tr}(I_n) = n$ |
| Cyclic | $\operatorname{Tr}(AB) = \operatorname{Tr}(BA)$ for $A \in \mathbb{R}^{n\times k},\, B \in \mathbb{R}^{k\times n}$ |

### 1.3 Characteristic polynomial

$$
p_A(\lambda) = \det(A - \lambda I)
\qquad\qquad
2\times 2:\quad p_A(\lambda) = \lambda^2 - \operatorname{Tr}(A)\,\lambda + \det(A)
$$

### 1.4 Eigenvalues and eigenvectors

$\lambda \in \mathbb{R}$ is an **eigenvalue** of $A$ with **eigenvector** $x \ne \mathbf 0$ when

$$
A x = \lambda x
$$

- Eigenvalues are the roots of $\det(A - \lambda I) = 0$.
- Eigenvectors for $\lambda$ are the non-zero vectors in $\operatorname{Null}(A - \lambda I)$; this null space is the **eigenspace** $E_\lambda$.
- If $x$ is an eigenvector, so is $c\,x$ for any $c \ne 0$.
- The set of all eigenvalues is the **spectrum**.

Checks that always hold (counting repeated eigenvalues):

$$
\sum \lambda_i = \operatorname{Tr}(A),
\qquad
\prod \lambda_i = \det(A)
$$

### 1.5 Useful properties

- $A$ and $A^{\top}$ have the same eigenvalues, because $\det(A - \lambda I) = \det(A^{\top} - \lambda I)$.
- Eigenvectors of $n$ **distinct** eigenvalues are linearly independent, so $A$ is diagonalizable.
- A triangular matrix has its eigenvalues on the diagonal.
- **Spectral theorem:** a symmetric $A$ has real eigenvalues and an orthonormal basis of eigenvectors.

### 1.6 Diagonal matrices

$$
D = \begin{bmatrix} d_1 & & \\ & \ddots & \\ & & d_n\end{bmatrix}:
\qquad
\det D = d_1 \cdots d_n,
\qquad
D^k = \operatorname{diag}\left(d_1^k,\dots,d_n^k\right),
\qquad
D^{-1} = \operatorname{diag}\left(\tfrac{1}{d_1},\dots,\tfrac{1}{d_n}\right)
$$

### 1.7 Diagonalization and eigendecomposition

$$
D = P^{-1} A P
\qquad\Longleftrightarrow\qquad
A = P D P^{-1}
\qquad\Longleftrightarrow\qquad
AP = PD
$$

The columns of $P$ are eigenvectors; the diagonal of $D$ holds the matching eigenvalues **in the same order**. This needs $n$ independent eigenvectors.

For **symmetric** $A$, choose unit, orthogonal eigenvectors $p_i$; then $P^{-1} = P^{\top}$ and

$$
A = P D P^{\top} = \sum_{i=1}^{n} \lambda_i\, p_i p_i^{\top}
$$

### 1.8 Positive definite and Cholesky

A symmetric $A$ is **positive definite (PD)** when $x^{\top}Ax > 0$ for every $x \ne \mathbf 0$, and **positive semi-definite (PSD)** when $x^{\top}Ax \ge 0$.

| Test on symmetric $A$ | PD | PSD |
| :--- | :--- | :--- |
| Eigenvalues | all $> 0$ | all $\ge 0$ |
| $2\times 2$ quick test | $a > 0$ and $\det > 0$ | $a \ge 0$, $d \ge 0$, $\det \ge 0$ |

A symmetric PD matrix factors as $A = LL^{\top}$, $L$ lower triangular with positive diagonal (**Cholesky**). For $3\times 3$:

$$
\begin{aligned}
l_{11} &= \sqrt{a_{11}}, & l_{21} &= \frac{a_{21}}{l_{11}}, & l_{31} &= \frac{a_{31}}{l_{11}},\\
l_{22} &= \sqrt{a_{22} - l_{21}^2}, & l_{32} &= \frac{a_{32} - l_{31}l_{21}}{l_{22}}, & l_{33} &= \sqrt{a_{33} - \left(l_{31}^2 + l_{32}^2\right)}
\end{aligned}
$$

If a square root receives a negative number, $A$ is not PD and has no Cholesky factor.

---

## 2. Fixed Exam Routines

> Use the same headings for the same question type. Keep each named row operation.

### Routine A - Is $T$ a linear transformation? (always all three tests)
Step | Write
--- | ---
1 | **Zero Test**
2 | **Addition**
3 | **Scalar Multiplication**
4 | **Counterexample Or Verification**
5 | **Conclusion**

### Routine B - Eigenvalues, eigenvectors, diagonalization
Step | Write
--- | ---
1 | **Characteristic Polynomial**
2 | **Eigenvalues**
3 | **Eigenvectors And Check**
4 | **Matrices P And D**
5 | **Check And Conclusion**

### Routine C - Symmetric matrix, $A = PDP^{\top}$
Step | Write
--- | ---
1 | **Eigenvalues**
2 | **Eigenvectors**
3 | **Normalize**
4 | **Matrices P And D**
5 | **Check And Conclusion**

### Routine D - Cholesky $A = LL^{\top}$
Step | Write
--- | ---
1 | **Preconditions**
2 | **Set Up L**
3 | **Find The Entries**
4 | **Check**
5 | **Conclusion**

### Routine E - PD / PSD check (quiz)
Step | Write
--- | ---
1 | **Symmetry**
2 | **Diagonal Entries**
3 | **Determinant And Eigenvalues**
4 | **Conclusion**

> **Stop rule:** If a required test fails, state the failure and conclusion.
---

## 3. Solved Examples — Is $T$ a Linear Transformation?

> Follow the matching fixed routine above.

### Example A1 — the lecture's map (linear)

**Given** $T : \mathbb{R}^3 \to \mathbb{R}^3$,

$$
T\!\begin{bmatrix} a\\ b\\ c\end{bmatrix}
= \begin{bmatrix} a + b - c\\ 2a + 3b + 4c\\ 3a + 3c\end{bmatrix}
$$

**AIM:** Decide whether $T$ is a linear transformation.

#### 1. Zero Test

**Put $a = b = c = 0$:**

$$
T\!\begin{bmatrix} 0\\ 0\\ 0\end{bmatrix}
= \begin{bmatrix} 0 + 0 - 0\\ 0 + 0 + 0\\ 0 + 0\end{bmatrix}
= \begin{bmatrix} 0\\ 0\\ 0\end{bmatrix} \;✓
$$

**Passing this test is necessary but not enough,** so continue.

#### 2. Addition

**Two general vectors and their sum:**

$$
x = \begin{bmatrix} a\\ b\\ c\end{bmatrix},
\quad
y = \begin{bmatrix} p\\ q\\ r\end{bmatrix},
\quad
x + y = \begin{bmatrix} a + p\\ b + q\\ c + r\end{bmatrix}
$$

**Left side: replace $a$ by $a+p$, $b$ by $b+q$, $c$ by $c+r$:**

$$
T(x + y) = \begin{bmatrix}
(a+p) + (b+q) - (c+r)\\
2(a+p) + 3(b+q) + 4(c+r)\\
3(a+p) + 3(c+r)
\end{bmatrix}
$$

**Right side: apply $T$ separately, then add:**

$$
T(x) + T(y) = \begin{bmatrix}
(a + b - c) + (p + q - r)\\
(2a + 3b + 4c) + (2p + 3q + 4r)\\
(3a + 3c) + (3p + 3r)
\end{bmatrix}
$$

**Compare entry by entry** (expand the brackets in 2b):

| Entry | $T(x+y)$ expanded | $T(x) + T(y)$ | Equal? |
| :--- | :--- | :--- | :--- |
| 1 | $a + p + b + q - c - r$ | $a + b - c + p + q - r$ | ✓ |
| 2 | $2a + 2p + 3b + 3q + 4c + 4r$ | $2a + 3b + 4c + 2p + 3q + 4r$ | ✓ |
| 3 | $3a + 3p + 3c + 3r$ | $3a + 3c + 3p + 3r$ | ✓ |

#### 3. Scalar Multiplication

**Left side:** $t x = (t a, t b, t c)$, so

$$
T(t x) = \begin{bmatrix}
t a + t b - t c\\
2t a + 3t b + 4t c\\
3t a + 3t c
\end{bmatrix}
$$

**Right side:**

$$
t\,T(x) = \begin{bmatrix}
t(a + b - c)\\
t(2a + 3b + 4c)\\
t(3a + 3c)
\end{bmatrix}
$$

**Compare:** factor $t$ out of each entry of 3a to get exactly 3b ✓

#### 4. Counterexample Or Verification

**None needed:** every test passed with general letters.

#### 5. Conclusion

| Test | Result |
| :--- | :--- |
| Zero test | ✓ |
| Addition | ✓ |
| Scalar multiplication | ✓ |
**Hence** $T$ is a linear transformation. Its matrix holds the coefficients of $a, b, c$ row by row:

$$
T(x) = Ax,
\qquad
A = \begin{bmatrix} 1 & 1 & -1\\ 2 & 3 & 4\\ 3 & 0 & 3\end{bmatrix}
$$

---

### Example A2 — a square inside (not linear)

**Given** $T : \mathbb{R}^2 \to \mathbb{R}^2$, $\;T(a,b) = (a + b,\; a^2)$.

**AIM:** Decide whether $T$ is linear.

#### 1. Zero Test

$T(0,0) = (0 + 0,\; 0^2) = (0,0)$ ✓. Continue: the square is still suspicious.

#### 2. Addition

**Left side:** $T(x + y) = \big((a+p) + (b+q),\; (a+p)^2\big)$.

**Right side:** $T(x) + T(y) = \big(a + b + p + q,\; a^2 + p^2\big)$.

**Compare:** entry 1 matches. Entry 2:

$$
(a + p)^2 = a^2 + 2ap + p^2 \;\ne\; a^2 + p^2 \quad\text{whenever } ap \ne 0
$$

✗

#### 3. Scalar Multiplication

**Left side:** $T(t x) = \big(t a + t b,\; t^2 a^2\big)$.

**Right side:** $t T(x) = \big(t a + t b,\; t a^2\big)$.

**Compare entry 2:** $t^2 a^2 \ne t a^2$ unless $t \in \{0, 1\}$ or $a = 0$ ✗

#### 4. Counterexample Or Verification

**Addition:** $x = y = (1,0)$:

$$
T(x + y) = T(2,0) = (2,\,4),
\qquad
T(x) + T(y) = (1,1) + (1,1) = (2,\,2) \;\ne\; (2,4)
$$

**Scaling:** $x = (1,0)$, $t = 2$:

$$
T(2,0) = (2,\,4),
\qquad
2\,T(1,0) = 2(1,1) = (2,\,2) \;\ne\; (2,4)
$$

#### 5. Conclusion

| Test | Result |
| :--- | :--- |
| Zero test | ✓ |
| Addition | ✗ |
| Scalar multiplication | ✗ |
**Hence** $T$ is **not** linear. Passing the zero test did not save it.

---

### Example A3 — a constant shift (not linear)

**Given** $T : \mathbb{R}^2 \to \mathbb{R}^2$, $\;T(a,b) = (a + 1,\; b)$.

**AIM:** Decide whether $T$ is linear.

#### 1. Zero Test

$T(0,0) = (1,\,0) \ne (0,0)$ ✗. This already decides it, but run all three tests.

#### 2. Addition

**Left side:** $T(x + y) = (a + p + 1,\; b + q)$.

**Right side:** $T(x) + T(y) = (a + 1 + p + 1,\; b + q) = (a + p + 2,\; b + q)$.

**Entry 1 differs by $1$ for every $x, y$** ✗

#### 3. Scalar Multiplication

**Left side:** $T(t x) = (t a + 1,\; t b)$.

**Right side:** $t T(x) = (t a + t,\; t b)$.

**Entry 1 differs unless $t = 1$** ✗

#### 4. Counterexample Or Verification

**Addition:** $x = y = (0,0)$: $T(0,0) = (1,0)$ but $T(0,0) + T(0,0) = (2,0)$.

**Scaling:** $x = (1,1)$, $t = 2$: $T(2,2) = (3,2)$ but $2T(1,1) = 2(2,1) = (4,2)$.

#### 5. Conclusion

| Test | Result |
| :--- | :--- |
| Zero test | ✗ |
| Addition | ✗ |
| Scalar multiplication | ✗ |
**Hence** $T$ is **not** linear. A shift by a constant (an *affine* map) is never linear.

---

### Example A4 — a map from $\mathbb{R}^3$ to $\mathbb{R}^2$ (linear)

**Given** $T : \mathbb{R}^3 \to \mathbb{R}^2$, $\;T(a,b,c) = (a - 2b,\; b + 3c)$.

**AIM:** Decide whether $T$ is linear, and if so give its matrix.

#### 1. Zero Test

$T(0,0,0) = (0 - 0,\; 0 + 0) = (0,0)$ ✓

#### 2. Addition

**Left side:**

$$
T(x + y) = \big((a + p) - 2(b + q),\;\; (b + q) + 3(c + r)\big)
$$

**Right side:**

$$
T(x) + T(y) = \big((a - 2b) + (p - 2q),\;\; (b + 3c) + (q + 3r)\big)
$$

**Expand and regroup:** entry 1 is $a + p - 2b - 2q$ on both sides; entry 2 is $b + q + 3c + 3r$ on both sides ✓

#### 3. Scalar Multiplication

$T(t x) = (t a - 2t b,\; t b + 3t c) = t(a - 2b,\; b + 3c) = t T(x)$ ✓

#### 4. Counterexample Or Verification

**None needed.**

#### 5. Conclusion

| Test | Result |
| :--- | :--- |
| Zero test | ✓ |
| Addition | ✓ |
| Scalar multiplication | ✓ |
**Hence** $T$ is linear with the $2\times 3$ matrix (input size $3$, output size $2$):

$$
A = \begin{bmatrix} 1 & -2 & 0\\ 0 & 1 & 3\end{bmatrix}
$$

---

## 4. Practice Questions — Linear Maps

> Marks shown are my estimate of exam weight, not official.

**Q1. (4 marks)** Decide whether $T(a,b) = (2a - b,\; a + 3b)$ is linear. If it is, give its matrix.
*Hint: same five steps as Example A4.*

**Q2. (4 marks)** Decide whether $T(a,b) = (ab,\; a)$ is linear. Give numbers for every failed test.
*Hint: the product filter, as in Example A2.*

**Q3. (4 marks)** Decide whether $T : \mathbb{R}^3 \to \mathbb{R}^2$, $T(a,b,c) = (a + b,\; c + 2)$ is linear.
*Hint: as in Example A3; still run all three tests.*

**Q4. (4 marks)** Decide whether $T(a,b) = (|a|,\; b)$ is linear.
*Hint: the zero test passes. Try $t = -1$, and try $x = (1,0)$, $y = (-1,0)$.*

---

## 5. Solved Examples — Eigenvalues, Eigenvectors, Diagonalization

> Follow the matching fixed routine above.

### Example B1 — the lecture's matrix

**Given**

$$
A = \begin{bmatrix} 1 & 4\\ 2 & 3\end{bmatrix}
$$

**AIM:** Find the eigenvalues and eigenvectors of $A$, then diagonalize it.

#### 1. Characteristic Polynomial

**Subtract $\lambda$ from the diagonal entries only:**

$$
A - \lambda I = \begin{bmatrix} 1 - \lambda & 4\\ 2 & 3 - \lambda\end{bmatrix}
$$

**Main diagonal product minus the other diagonal product:**

$$
\begin{aligned}
\det(A - \lambda I) &= (1 - \lambda)(3 - \lambda) - (4)(2)\\
&= 3 - \lambda - 3\lambda + \lambda^2 - 8\\
&= \lambda^2 - 4\lambda - 5
\end{aligned}
$$

**Cross-check with $\lambda^2 - \operatorname{Tr}(A)\lambda + \det(A)$:** $\operatorname{Tr}A = 4$, $\det A = 3 - 8 = -5$ ✓

#### 2. Eigenvalues

**Factor:**

$$
\lambda^2 - 4\lambda - 5 = (\lambda - 5)(\lambda + 1) = 0
\quad\Longrightarrow\quad
\lambda_1 = -1,\quad \lambda_2 = 5
$$

**Checks:** $-1 + 5 = 4 = \operatorname{Tr}A$ ✓, $\;(-1)(5) = -5 = \det A$ ✓

#### 3. Eigenvectors And Check

**$\lambda_1 = -1$:**

$$
A + I = \begin{bmatrix} 2 & 4\\ 2 & 4\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 - R_1\;}
\begin{bmatrix} 2 & 4\\ 0 & 0\end{bmatrix}
$$

One equation, $2x_1 + 4x_2 = 0$, so $x_1 = -2x_2$. Free $x_2 = 1$:

$$
p_1 = \begin{bmatrix} -2\\ 1\end{bmatrix}
$$

**$\lambda_2 = 5$:**

$$
A - 5I = \begin{bmatrix} -4 & 4\\ 2 & -2\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 + \frac12 R_1\;}
\begin{bmatrix} -4 & 4\\ 0 & 0\end{bmatrix}
$$

$-4x_1 + 4x_2 = 0$, so $x_1 = x_2$. Free $x_2 = 1$:

$$
p_2 = \begin{bmatrix} 1\\ 1\end{bmatrix}
$$

$$
A p_1 = \begin{bmatrix} -2 + 4\\ -4 + 3\end{bmatrix} = \begin{bmatrix} 2\\ -1\end{bmatrix} = -1\cdot p_1 \;✓
\qquad
A p_2 = \begin{bmatrix} 1 + 4\\ 2 + 3\end{bmatrix} = \begin{bmatrix} 5\\ 5\end{bmatrix} = 5\cdot p_2 \;✓
$$

#### 4. Matrices P And D

$$
P = \begin{bmatrix} p_1 & p_2\end{bmatrix} = \begin{bmatrix} -2 & 1\\ 1 & 1\end{bmatrix},
\qquad
D = \begin{bmatrix} -1 & 0\\ 0 & 5\end{bmatrix},
\qquad
\det P = -2 - 1 = -3 \ne 0
$$

Two distinct eigenvalues guarantee independent eigenvectors, so $P$ is invertible.

#### 5. Check And Conclusion

**Inverse of a $2\times 2$** (swap the diagonal, negate the off-diagonal, divide by $\det$):

$$
P^{-1} = \frac{1}{-3}\begin{bmatrix} 1 & -1\\ -1 & -2\end{bmatrix}
= \begin{bmatrix} -\tfrac13 & \tfrac13\\ \tfrac13 & \tfrac23\end{bmatrix}
$$

**$AP$ (each column is $\lambda_i p_i$):**

$$
AP = \begin{bmatrix} 2 & 5\\ -1 & 5\end{bmatrix}
$$

**$P^{-1}(AP)$:**

$$
\begin{bmatrix} -\tfrac13 & \tfrac13\\ \tfrac13 & \tfrac23\end{bmatrix}
\begin{bmatrix} 2 & 5\\ -1 & 5\end{bmatrix}
= \begin{bmatrix} -\tfrac23 - \tfrac13 & -\tfrac53 + \tfrac53\\ \tfrac23 - \tfrac23 & \tfrac53 + \tfrac{10}{3}\end{bmatrix}
= \begin{bmatrix} -1 & 0\\ 0 & 5\end{bmatrix} = D \;✓
$$

**Hence** $A$ is diagonalizable with eigenvalues $-1, 5$ and eigenvectors $(-2,1), (1,1)$ (matches slide 16).

---

### Example B2 — another $2\times 2$ with distinct eigenvalues

**Given**

$$
A = \begin{bmatrix} 4 & 1\\ 2 & 3\end{bmatrix}
$$

**AIM:** Find $P$ and $D$ with $P^{-1}AP = D$.

#### 1. Characteristic Polynomial

$$
A - \lambda I = \begin{bmatrix} 4 - \lambda & 1\\ 2 & 3 - \lambda\end{bmatrix}
$$

$$
(4 - \lambda)(3 - \lambda) - 2 = 12 - 7\lambda + \lambda^2 - 2 = \lambda^2 - 7\lambda + 10
$$

Cross-check: $\operatorname{Tr}A = 7$, $\det A = 12 - 2 = 10$ ✓

#### 2. Eigenvalues

$$
(\lambda - 2)(\lambda - 5) = 0 \quad\Longrightarrow\quad \lambda_1 = 2,\;\; \lambda_2 = 5
$$

Checks: $2 + 5 = 7$ ✓, $\;2 \times 5 = 10$ ✓

#### 3. Eigenvectors And Check

**$\lambda_1 = 2$:**

$$
A - 2I = \begin{bmatrix} 2 & 1\\ 2 & 1\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 - R_1\;}
\begin{bmatrix} 2 & 1\\ 0 & 0\end{bmatrix}
$$

$2x_1 + x_2 = 0$, so $x_2 = -2x_1$. Free $x_1 = 1$: $\;p_1 = (1,\,-2)$.
**$\lambda_2 = 5$:**

$$
A - 5I = \begin{bmatrix} -1 & 1\\ 2 & -2\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 + 2R_1\;}
\begin{bmatrix} -1 & 1\\ 0 & 0\end{bmatrix}
$$

$-x_1 + x_2 = 0$, so $x_1 = x_2$. Free $x_2 = 1$: $\;p_2 = (1,\,1)$.

$$
A p_1 = \begin{bmatrix} 4 - 2\\ 2 - 6\end{bmatrix} = \begin{bmatrix} 2\\ -4\end{bmatrix} = 2\,p_1 \;✓
\qquad
A p_2 = \begin{bmatrix} 4 + 1\\ 2 + 3\end{bmatrix} = \begin{bmatrix} 5\\ 5\end{bmatrix} = 5\,p_2 \;✓
$$

#### 4. Matrices P And D

$$
P = \begin{bmatrix} 1 & 1\\ -2 & 1\end{bmatrix},
\qquad
D = \begin{bmatrix} 2 & 0\\ 0 & 5\end{bmatrix},
\qquad
\det P = 1 + 2 = 3 \ne 0
$$

#### 5. Check And Conclusion

$P^{-1} = \dfrac13\begin{bmatrix} 1 & -1\\ 2 & 1\end{bmatrix}$ and $AP = \begin{bmatrix} 2 & 5\\ -4 & 5\end{bmatrix}$.
**Multiply:**

$$
P^{-1}AP = \frac13\begin{bmatrix} 2 + 4 & 5 - 5\\ 4 - 4 & 10 + 5\end{bmatrix} = \frac13\begin{bmatrix} 6 & 0\\ 0 & 15\end{bmatrix} = \begin{bmatrix} 2 & 0\\ 0 & 5\end{bmatrix} = D \;✓
$$

**Hence** $A = PDP^{-1}$ with $P$ and $D$ above.

---

### Example B3 — a repeated eigenvalue: not diagonalizable (the lecture's question)

**Given**

$$
A = \begin{bmatrix} 0 & 1\\ 0 & 0\end{bmatrix}
$$

**AIM:** Find the eigenvalues and eigenvectors, and decide whether $A$ is diagonalizable.

#### 1. Characteristic Polynomial

$$
A - \lambda I = \begin{bmatrix} -\lambda & 1\\ 0 & -\lambda\end{bmatrix}
$$

$$
(-\lambda)(-\lambda) - (1)(0) = \lambda^2
$$

#### 2. Eigenvalues

$\lambda^2 = 0 \Rightarrow \lambda = 0$, a **repeated** root (algebraic multiplicity 2).
**Checks:** $0 + 0 = 0 = \operatorname{Tr}A$ ✓, $\;0 \cdot 0 = 0 = \det A$ ✓

#### 3. Eigenvectors And Check

**$A - 0I = A$,** already in REF: the only equation is $x_2 = 0$.

**Pivot in column 2, so $x_1$ is free.** With $x_1 = 1$: $\;p_1 = (1,0)$, and $E_0 = \operatorname{span}\{p_1\}$ has dimension $1$.

$$
A p_1 = \begin{bmatrix} 0(1) + 1(0)\\ 0\end{bmatrix} = \begin{bmatrix} 0\\ 0\end{bmatrix} = 0\cdot p_1 \;✓
$$

#### 4. Matrices P And D

**$P$ needs two independent eigenvectors** for a $2\times 2$ matrix.

**Every eigenvector is a multiple of $(1,0)$,** so any two are dependent and every candidate $P$ has $\det P = 0$. No invertible $P$ exists.

#### 5. Check And Conclusion

**Hence** $A$ has one eigenvalue $0$ (repeated twice) with a one-dimensional eigenspace, and $A$ is **not diagonalizable**.

**Lesson:** a repeated eigenvalue can leave too few eigenvectors. Compare Example B4, where it does not.

---

### Example B4 — a $3\times 3$ with a repeated eigenvalue that IS diagonalizable

**Given**

$$
A = \begin{bmatrix} 2 & 1 & 0\\ 1 & 2 & 0\\ 0 & 0 & 3\end{bmatrix}
$$

**AIM:** Find all eigenvalues and eigenvectors, and diagonalize $A$.

#### 1. Characteristic Polynomial

$$
A - \lambda I = \begin{bmatrix} 2 - \lambda & 1 & 0\\ 1 & 2 - \lambda & 0\\ 0 & 0 & 3 - \lambda\end{bmatrix}
$$

**Expand along row 3** (two zeros make it short):

$$
\begin{aligned}
\det(A - \lambda I) &= (3 - \lambda)\det\begin{bmatrix} 2 - \lambda & 1\\ 1 & 2 - \lambda\end{bmatrix}\\
&= (3 - \lambda)\left[(2 - \lambda)^2 - 1\right]\\
&= (3 - \lambda)\left(\lambda^2 - 4\lambda + 3\right)\\
&= (3 - \lambda)(\lambda - 1)(\lambda - 3)
\end{aligned}
$$

#### 2. Eigenvalues

$\lambda_1 = 1$ and $\lambda_2 = \lambda_3 = 3$ (repeated).
**Checks:** $1 + 3 + 3 = 7 = 2 + 2 + 3 = \operatorname{Tr}A$ ✓, $\;1\cdot3\cdot3 = 9 = 3(4 - 1) = \det A$ ✓

#### 3. Eigenvectors And Check

**$\lambda = 1$:**

$$
A - I = \begin{bmatrix} 1 & 1 & 0\\ 1 & 1 & 0\\ 0 & 0 & 2\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 - R_1,\;\; R_2 \leftrightarrow R_3\;}
\begin{bmatrix} 1 & 1 & 0\\ 0 & 0 & 2\\ 0 & 0 & 0\end{bmatrix}
$$

$x_1 + x_2 = 0$ and $x_3 = 0$; free $x_2$. With $x_2 = -1$: $\;p_1 = (1,\,-1,\,0)$.
**$\lambda = 3$:**

$$
A - 3I = \begin{bmatrix} -1 & 1 & 0\\ 1 & -1 & 0\\ 0 & 0 & 0\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 + R_1\;}
\begin{bmatrix} -1 & 1 & 0\\ 0 & 0 & 0\\ 0 & 0 & 0\end{bmatrix}
$$

One equation, $x_1 = x_2$; **two** free variables $x_2, x_3$:

$$
x_2 = 1, x_3 = 0:\;\; p_2 = (1,\,1,\,0)
\qquad\qquad
x_2 = 0, x_3 = 1:\;\; p_3 = (0,\,0,\,1)
$$

The eigenspace $E_3$ has dimension $2$, matching the multiplicity $2$.

$$
Ap_1 = (2 - 1,\; 1 - 2,\; 0) = (1,-1,0) = 1\cdot p_1 \;✓
\qquad
Ap_2 = (3,\,3,\,0) = 3\,p_2 \;✓
\qquad
Ap_3 = (0,\,0,\,3) = 3\,p_3 \;✓
$$

#### 4. Matrices P And D

$$
P = \begin{bmatrix} 1 & 1 & 0\\ -1 & 1 & 0\\ 0 & 0 & 1\end{bmatrix},
\qquad
D = \begin{bmatrix} 1 & 0 & 0\\ 0 & 3 & 0\\ 0 & 0 & 3\end{bmatrix},
\qquad
\det P = 1\cdot(1 + 1) = 2 \ne 0
$$

#### 5. Check And Conclusion

**Since $P$ is invertible, $AP = PD$ is the same statement as $P^{-1}AP = D$.** Compare column by column:

| Column | $A\,p_i$ | $\lambda_i\,p_i$ |
| :--- | :--- | :--- |
| 1 | $(1,-1,0)$ | $1\cdot(1,-1,0)$ ✓ |
| 2 | $(3,3,0)$ | $3\cdot(1,1,0)$ ✓ |
| 3 | $(0,0,3)$ | $3\cdot(0,0,1)$ ✓ |
**Hence** $A$ is diagonalizable although $3$ is repeated, because its eigenspace has dimension $2$. (It is symmetric, so the spectral theorem guarantees this.)

---

## 6. Practice Questions — Diagonalization

**Q5. (6 marks)** Find the eigenvalues and eigenvectors of

$$
A = \begin{bmatrix} 5 & 4\\ 1 & 2\end{bmatrix}
$$

then find $P$ and $D$ with $P^{-1}AP = D$, and verify.
**Pattern:** B2. Use the five headings in Routine B.

**Q6. (4 marks)** Find the eigenvalues and eigenspaces of

$$
A = \begin{bmatrix} 3 & 1\\ 0 & 3\end{bmatrix}
$$

Is $A$ diagonalizable? Justify.
*Hint: compare with Example B3.*

**Q7. (6 marks)** Find all eigenvalues and eigenvectors of

$$
A = \begin{bmatrix} 4 & 0 & 1\\ 0 & 2 & 0\\ 1 & 0 & 4\end{bmatrix}
$$

and diagonalize $A$.
*Hint: expand along row 2, as in Example B4 (which expanded along row 3).*

---

## 7. Solved Examples — Symmetric Matrices, $A = PDP^{\top}$

> Follow the matching fixed routine above.

### Example C1 — the lecture's example

**Given**

$$
A = \begin{bmatrix} 2.5 & -1\\ -1 & 2.5\end{bmatrix}
$$

**AIM:** Write $A = PDP^{\top}$ with $P$ orthogonal.

#### 1. Eigenvalues

$$
\det\begin{bmatrix} 2.5 - \lambda & -1\\ -1 & 2.5 - \lambda\end{bmatrix}
= (2.5 - \lambda)^2 - 1
= \lambda^2 - 5\lambda + 5.25
$$

**Quadratic formula:**

$$
\lambda = \frac{5 \pm \sqrt{25 - 21}}{2} = \frac{5 \pm 2}{2}
\quad\Longrightarrow\quad
\lambda_1 = 3.5,\;\; \lambda_2 = 1.5
$$

**Checks:** $3.5 + 1.5 = 5 = \operatorname{Tr}A$ ✓, $\;3.5 \times 1.5 = 5.25 = 6.25 - 1 = \det A$ ✓

#### 2. Eigenvectors

**$\lambda_1 = 3.5$:** $A - 3.5I = \begin{bmatrix} -1 & -1\\ -1 & -1\end{bmatrix}$, so $x_1 = -x_2$: $\;v_1 = (1,\,-1)$.

**$\lambda_2 = 1.5$:** $A - 1.5I = \begin{bmatrix} 1 & -1\\ -1 & 1\end{bmatrix}$, so $x_1 = x_2$: $\;v_2 = (1,\,1)$.

#### 3. Normalize

**Both have length $\sqrt2$:**

$$
p_1 = \tfrac{1}{\sqrt2}(1,\,-1),
\qquad
p_2 = \tfrac{1}{\sqrt2}(1,\,1)
$$

**Orthogonal:** $\langle p_1,p_2\rangle = \tfrac12(1 - 1) = 0$ ✓

#### 4. Matrices P And D

$$
P = \begin{bmatrix} \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2}\\ -\tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2}\end{bmatrix},
\qquad
D = \begin{bmatrix} 3.5 & 0\\ 0 & 1.5\end{bmatrix},
\qquad
P^{\top} = \begin{bmatrix} \tfrac{1}{\sqrt2} & -\tfrac{1}{\sqrt2}\\ \tfrac{1}{\sqrt2} & \tfrac{1}{\sqrt2}\end{bmatrix}
$$

#### 5. Check And Conclusion

$$
3.5\cdot\tfrac12\begin{bmatrix} 1 & -1\\ -1 & 1\end{bmatrix}
+ 1.5\cdot\tfrac12\begin{bmatrix} 1 & 1\\ 1 & 1\end{bmatrix}
= \begin{bmatrix} 1.75 + 0.75 & -1.75 + 0.75\\ -1.75 + 0.75 & 1.75 + 0.75\end{bmatrix}
= \begin{bmatrix} 2.5 & -1\\ -1 & 2.5\end{bmatrix} \;✓
$$

**Hence** $A = PDP^{\top}$ with $P$, $D$ above (matches slide 20).

---

### Example C2 — equal diagonal entries

**Given**

$$
A = \begin{bmatrix} 3 & 1\\ 1 & 3\end{bmatrix}
$$

**AIM:** Find an orthogonal $P$ and diagonal $D$ with $A = PDP^{\top}$.

#### 1. Eigenvalues

$$
(3 - \lambda)^2 - 1 = \lambda^2 - 6\lambda + 8
$$

$$
(\lambda - 4)(\lambda - 2) = 0 \quad\Longrightarrow\quad \lambda_1 = 4,\;\; \lambda_2 = 2
$$

Checks: $4 + 2 = 6$ ✓, $\;4 \times 2 = 8 = 9 - 1$ ✓

#### 2. Eigenvectors

**$\lambda_1 = 4$:** $\begin{bmatrix} -1 & 1\\ 1 & -1\end{bmatrix}$ gives $x_1 = x_2$: $\;v_1 = (1,1)$.

**$\lambda_2 = 2$:** $\begin{bmatrix} 1 & 1\\ 1 & 1\end{bmatrix}$ gives $x_1 = -x_2$: $\;v_2 = (1,-1)$.

#### 3. Normalize

$$
p_1 = \tfrac{1}{\sqrt2}(1,\,1),
\qquad
p_2 = \tfrac{1}{\sqrt2}(1,\,-1),
\qquad
\langle p_1,p_2\rangle = \tfrac12(1 - 1) = 0 \;✓
$$

#### 4. Matrices P And D

$$
P = \frac{1}{\sqrt2}\begin{bmatrix} 1 & 1\\ 1 & -1\end{bmatrix} = P^{\top},
\qquad
D = \begin{bmatrix} 4 & 0\\ 0 & 2\end{bmatrix}
$$

(This $P$ happens to be symmetric, so $P^{\top} = P$.)

#### 5. Check And Conclusion

$$
4\cdot\tfrac12\begin{bmatrix} 1 & 1\\ 1 & 1\end{bmatrix} + 2\cdot\tfrac12\begin{bmatrix} 1 & -1\\ -1 & 1\end{bmatrix}
= \begin{bmatrix} 2 + 1 & 2 - 1\\ 2 - 1 & 2 + 1\end{bmatrix}
= \begin{bmatrix} 3 & 1\\ 1 & 3\end{bmatrix} \;✓
$$

**Hence** $A = PDP^{\top}$ with eigenvalues $4, 2$. Both are positive, so $A$ is also positive definite.

---

### Example C3 — unequal diagonal entries

**Given**

$$
A = \begin{bmatrix} 2 & 2\\ 2 & 5\end{bmatrix}
$$

**AIM:** Find an orthogonal $P$ and diagonal $D$ with $A = PDP^{\top}$.

#### 1. Eigenvalues

$$
(2 - \lambda)(5 - \lambda) - 4 = \lambda^2 - 7\lambda + 6
$$

$$
(\lambda - 6)(\lambda - 1) = 0 \quad\Longrightarrow\quad \lambda_1 = 6,\;\; \lambda_2 = 1
$$

Checks: $6 + 1 = 7 = \operatorname{Tr}A$ ✓, $\;6 \times 1 = 6 = 10 - 4$ ✓

#### 2. Eigenvectors

**$\lambda_1 = 6$:**

$$
A - 6I = \begin{bmatrix} -4 & 2\\ 2 & -1\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 + \frac12 R_1\;}
\begin{bmatrix} -4 & 2\\ 0 & 0\end{bmatrix}
$$

$-4x_1 + 2x_2 = 0$, so $x_2 = 2x_1$: $\;v_1 = (1,\,2)$.
**$\lambda_2 = 1$:**

$$
A - I = \begin{bmatrix} 1 & 2\\ 2 & 4\end{bmatrix}
\xrightarrow{\;R_2 \leftarrow R_2 - 2R_1\;}
\begin{bmatrix} 1 & 2\\ 0 & 0\end{bmatrix}
$$

$x_1 + 2x_2 = 0$, so $x_1 = -2x_2$: $\;v_2 = (-2,\,1)$.

#### 3. Normalize

$$
\lVert v_1\rVert = \lVert v_2\rVert = \sqrt{1 + 4} = \sqrt5,
\qquad
p_1 = \tfrac{1}{\sqrt5}(1,\,2),
\quad
p_2 = \tfrac{1}{\sqrt5}(-2,\,1),
\qquad
\langle p_1,p_2\rangle = \tfrac15(-2 + 2) = 0 \;✓
$$

#### 4. Matrices P And D

$$
P = \frac{1}{\sqrt5}\begin{bmatrix} 1 & -2\\ 2 & 1\end{bmatrix},
\qquad
D = \begin{bmatrix} 6 & 0\\ 0 & 1\end{bmatrix},
\qquad
P^{\top} = \frac{1}{\sqrt5}\begin{bmatrix} 1 & 2\\ -2 & 1\end{bmatrix}
$$

#### 5. Check And Conclusion

$$
6\cdot\tfrac15\begin{bmatrix} 1 & 2\\ 2 & 4\end{bmatrix} + 1\cdot\tfrac15\begin{bmatrix} 4 & -2\\ -2 & 1\end{bmatrix}
= \tfrac15\begin{bmatrix} 6 + 4 & 12 - 2\\ 12 - 2 & 24 + 1\end{bmatrix}
= \tfrac15\begin{bmatrix} 10 & 10\\ 10 & 25\end{bmatrix}
= \begin{bmatrix} 2 & 2\\ 2 & 5\end{bmatrix} \;✓
$$

**Hence** $A = PDP^{\top}$ with $P$, $D$ above.

---

## 8. Practice Questions — Symmetric Eigendecomposition

**Q8. (6 marks)** Find the eigendecomposition $A = PDP^{\top}$, with orthonormal eigenvectors, of

$$
A = \begin{bmatrix} 5 & 2\\ 2 & 2\end{bmatrix}
$$

*Hint: as in Example C3; verify with the sum $\lambda_1p_1p_1^{\top} + \lambda_2p_2p_2^{\top}$.*

**Q9. (5 marks)** Find $A = PDP^{\top}$ for

$$
A = \begin{bmatrix} 1 & 2\\ 2 & 1\end{bmatrix}
$$

Is $A$ positive definite? Explain using the eigenvalues.
*Hint: as in Example C2; one eigenvalue is negative.*

---

## 9. Solved Examples — Cholesky Decomposition

> Follow the matching fixed routine above.

### Example D1 — the lecture's matrix

**Given**

$$
A = \begin{bmatrix} 9 & 3 & 6\\ 3 & 5 & 10\\ 6 & 10 & 45\end{bmatrix}
$$

**AIM:** Find lower-triangular $L$ with positive diagonal such that $A = LL^{\top}$.

#### 1. Preconditions

**Symmetric:** $a_{12} = a_{21} = 3$, $a_{13} = a_{31} = 6$, $a_{23} = a_{32} = 10$ ✓

**Positive definite:** confirmed at the end, if every square root is of a positive number.

#### 2. Set Up L

$$
L = \begin{bmatrix} l_{11} & 0 & 0\\ l_{21} & l_{22} & 0\\ l_{31} & l_{32} & l_{33}\end{bmatrix}
$$

#### 3. Find The Entries

$$
l_{11} = \sqrt{a_{11}} = \sqrt{9} = 3,
\qquad
l_{21} = \frac{a_{21}}{l_{11}} = \frac{3}{3} = 1,
\qquad
l_{31} = \frac{a_{31}}{l_{11}} = \frac{6}{3} = 2
$$

$$
l_{22} = \sqrt{a_{22} - l_{21}^2} = \sqrt{5 - 1} = 2,
\qquad
l_{32} = \frac{a_{32} - l_{31}\,l_{21}}{l_{22}} = \frac{10 - (2)(1)}{2} = 4
$$

$$
l_{33} = \sqrt{a_{33} - \left(l_{31}^2 + l_{32}^2\right)} = \sqrt{45 - (4 + 16)} = \sqrt{25} = 5
$$

#### 4. Check

**The factor:**

$$
L = \begin{bmatrix} 3 & 0 & 0\\ 1 & 2 & 0\\ 2 & 4 & 5\end{bmatrix},
\qquad
L^{\top} = \begin{bmatrix} 3 & 1 & 2\\ 0 & 2 & 4\\ 0 & 0 & 5\end{bmatrix}
$$

**Row $i$ of $L$ times column $j$ of $L^{\top}$:**

$$
\begin{aligned}
(1,1)&: 3\cdot3 = 9 & (1,2)&: 3\cdot1 = 3 & (1,3)&: 3\cdot2 = 6\\
(2,2)&: 1 + 4 = 5 & (2,3)&: 2 + 8 = 10 & (3,3)&: 4 + 16 + 25 = 45
\end{aligned}
$$

The lower entries follow by symmetry. Every entry matches $A$ ✓

#### 5. Conclusion

**All square roots were of positive numbers** ($9, 4, 25$), so $A$ is positive definite.

**Hence** $A = LL^{\top}$ with $L$ above (matches slide 22).

---

### Example D2 — negative off-diagonal entries

**Given**

$$
A = \begin{bmatrix} 4 & -2 & 2\\ -2 & 10 & -7\\ 2 & -7 & 21\end{bmatrix}
$$

**AIM:** Find the Cholesky factor $L$.

#### 1. Preconditions

**Symmetric:** $-2 = -2$, $2 = 2$, $-7 = -7$ ✓

#### 2. Set Up L

**Same lower-triangular shape as Example D1.**

#### 3. Find The Entries

$$
l_{11} = \sqrt4 = 2,
\qquad
l_{21} = \frac{-2}{2} = -1,
\qquad
l_{31} = \frac{2}{2} = 1
$$

**Diagonal:** squaring removes the minus sign:

$$
l_{22} = \sqrt{10 - (-1)^2} = \sqrt9 = 3
$$

**Below it:** watch the double minus:

$$
l_{32} = \frac{a_{32} - l_{31}l_{21}}{l_{22}} = \frac{-7 - (1)(-1)}{3} = \frac{-7 + 1}{3} = -2
$$

$$
l_{33} = \sqrt{21 - \left(1^2 + (-2)^2\right)} = \sqrt{21 - 5} = \sqrt{16} = 4
$$

#### 4. Check

$$
L = \begin{bmatrix} 2 & 0 & 0\\ -1 & 3 & 0\\ 1 & -2 & 4\end{bmatrix}
$$

| Entry | Row $i$ of $L$ $\cdot$ row $j$ of $L$ | Value |
| :--- | :--- | :--- |
| $(1,1)$ | $2\cdot2$ | $4$ ✓ |
| $(2,1)$ | $(-1)(2)$ | $-2$ ✓ |
| $(3,1)$ | $(1)(2)$ | $2$ ✓ |
| $(2,2)$ | $(-1)^2 + 3^2$ | $10$ ✓ |
| $(3,2)$ | $(1)(-1) + (-2)(3)$ | $-7$ ✓ |
| $(3,3)$ | $1 + 4 + 16$ | $21$ ✓ |

(Entry $(i,j)$ of $LL^{\top}$ is row $i$ of $L$ dotted with row $j$ of $L$.)

#### 5. Conclusion

**Square roots of $4, 9, 16$, all positive:** $A$ is positive definite.

**Hence** $A = LL^{\top}$ with $L$ above. Off-diagonal entries of $L$ may be negative; only the diagonal must be positive.

---

### Example D3 — a $2\times 2$ matrix

**Given**

$$
A = \begin{bmatrix} 4 & 2\\ 2 & 5\end{bmatrix}
$$

**AIM:** Find the Cholesky factor $L$.

#### 1. Preconditions

**Symmetric:** $2 = 2$ ✓

#### 2. Set Up L

$$
L = \begin{bmatrix} l_{11} & 0\\ l_{21} & l_{22}\end{bmatrix}
$$

#### 3. Find The Entries

$$
l_{11} = \sqrt4 = 2,
\qquad
l_{21} = \frac{2}{2} = 1
$$

$$
l_{22} = \sqrt{5 - 1^2} = \sqrt4 = 2
$$

**Not needed:** a $2\times 2$ matrix has only two columns.

#### 4. Check

$$
L = \begin{bmatrix} 2 & 0\\ 1 & 2\end{bmatrix},
\qquad
LL^{\top} = \begin{bmatrix} 2\cdot2 & 2\cdot1\\ 1\cdot2 & 1\cdot1 + 2\cdot2\end{bmatrix} = \begin{bmatrix} 4 & 2\\ 2 & 5\end{bmatrix} \;✓
$$

#### 5. Conclusion

**Hence** $A = LL^{\top}$ with $L = \begin{bmatrix} 2 & 0\\ 1 & 2\end{bmatrix}$, and $A$ is positive definite.

---

### Example D4 — no Cholesky factor exists

**Given**

$$
A = \begin{bmatrix} 1 & 2\\ 2 & 1\end{bmatrix}
$$

**AIM:** Find the Cholesky factor of $A$, or show that none exists.

#### 1. Preconditions

**Symmetric:** $2 = 2$ ✓. Positive definiteness is still unknown.

#### 2. Set Up L

**Same $2\times 2$ shape as Example D3.**

#### 3. Find The Entries

$$
l_{11} = \sqrt1 = 1,
\qquad
l_{21} = \frac{2}{1} = 2
$$

$$
l_{22} = \sqrt{a_{22} - l_{21}^2} = \sqrt{1 - 4} = \sqrt{-3}
$$

**The square root of a negative number is not real.** The algorithm breaks down here.

**Not reached.**

#### 4. Check

**There is no real $L$.** Confirm with eigenvalues: $\lambda^2 - 2\lambda - 3 = (\lambda - 3)(\lambda + 1)$, so $\lambda = 3, -1$. A negative eigenvalue means $A$ is not positive definite ✓

#### 5. Conclusion

**Hence** $A$ has **no** Cholesky decomposition, because it is not positive definite. Symmetry alone is not enough.

---

## 10. Practice Questions — Cholesky

**Q10. (5 marks)** Find the Cholesky factor $L$ of

$$
A = \begin{bmatrix} 4 & 2 & 2\\ 2 & 5 & 3\\ 2 & 3 & 6\end{bmatrix}
$$

and verify $LL^{\top} = A$.
**Pattern:** D1. Every entry of $L$ is a whole number.

**Q11. (3 marks)** Find the Cholesky factor of $A = \begin{bmatrix} 9 & 6\\ 6 & 5\end{bmatrix}$.
*Hint: as in Example D3.*

**Q12. (3 marks)** Does $A = \begin{bmatrix} 4 & 6\\ 6 & 8\end{bmatrix}$ have a Cholesky decomposition? Justify.
*Hint: as in Example D4; confirm with $\det A$.*

---

## 11. Solved Examples — PD / PSD Checks and Trace (quiz style)

Three questions with the same four steps (symmetry → diagonal → determinant → conclude), then one trace-property check.

### Example E1 — positive definite

**Given** $A = \begin{bmatrix} 2 & -1\\ -1 & 2\end{bmatrix}$.

**AIM:** Decide whether $A$ is PD, PSD or neither.

#### 1. Symmetry

$b = c = -1$ ✓

#### 2. Diagonal Entries

$a = 2 > 0$ and $d = 2 > 0$ ✓

#### 3. Determinant And Eigenvalues

$\det A = 4 - 1 = 3 > 0$. Check: $\lambda^2 - 4\lambda + 3 = (\lambda - 1)(\lambda - 3)$, so $\lambda = 1, 3$, both $> 0$ ✓

#### 4. Conclusion

**positive definite** (so also PSD).

---

### Example E2 — PSD but not PD

**Given** $A = \begin{bmatrix} 1 & 1\\ 1 & 1\end{bmatrix}$.

**AIM:** Decide whether $A$ is PD, PSD or neither.

#### 1. Symmetry

$b = c = 1$ ✓

#### 2. Diagonal Entries

$a = d = 1 \ge 0$ ✓

#### 3. Determinant And Eigenvalues

$\det A = 1 - 1 = 0$, not $> 0$. Eigenvalues: $\lambda(\lambda - 2) = 0$, so $\lambda = 0, 2$.

#### 4. Conclusion

**PSD but not PD.** For example $x = (1,-1)$ gives $x^{\top}Ax = 0$ with $x \ne \mathbf 0$.

---

### Example E3 — four matrices at once (MCQ)

**Given**

$$
\text{(a) }\begin{bmatrix} 1 & 2\\ 3 & 4\end{bmatrix}
\quad
\text{(b) }\begin{bmatrix} 1 & 2\\ 2 & 1\end{bmatrix}
\quad
\text{(c) }\begin{bmatrix} 0 & 0\\ 0 & 0\end{bmatrix}
\quad
\text{(d) }\begin{bmatrix} 7 & 0\\ 0 & 25\end{bmatrix}
$$

**AIM:** Classify each as PD, PSD only, or neither.

#### 1. Symmetry

(a) has $b = 2 \ne 3 = c$, so it is out immediately. (b), (c), (d) are symmetric.

#### 2. Diagonal Entries

(b) $1, 1 > 0$; (c) $0, 0 \ge 0$ but not $> 0$; (d) $7, 25 > 0$.

#### 3. Determinant And Eigenvalues

| Matrix | $\det$ | Eigenvalues |
| :--- | :--- | :--- |
| (b) | $1 - 4 = -3 < 0$ | $3, -1$ |
| (c) | $0$ | $0, 0$ |
| (d) | $175 > 0$ | $7, 25$ |

#### 4. Conclusion

| Matrix | Verdict |
| :--- | :--- |
| (a) | neither (not symmetric) |
| (b) | neither (negative eigenvalue; *indefinite*) |
| (c) | PSD only |
| (d) | PD |

---

### Example E4 — the cyclic trace property

**Given** $A = \begin{bmatrix} 1 & 2 & 0\\ 0 & 1 & 3\end{bmatrix}$, $B = \begin{bmatrix} 1 & 0\\ 2 & 1\\ 0 & 1\end{bmatrix}$.

**AIM:** Verify $\operatorname{Tr}(AB) = \operatorname{Tr}(BA)$.

#### 1. Sizes

$(2\times3)(3\times2) \to 2\times2$ for $AB$; $(3\times2)(2\times3) \to 3\times3$ for $BA$. Different sizes.

#### 2. Calculate AB

$$
AB = \begin{bmatrix} 1 + 4 + 0 & 0 + 2 + 0\\ 0 + 2 + 0 & 0 + 1 + 3\end{bmatrix} = \begin{bmatrix} 5 & 2\\ 2 & 4\end{bmatrix},
\qquad
\operatorname{Tr}(AB) = 5 + 4 = 9
$$

#### 3. Calculate BA

$$
BA = \begin{bmatrix} 1 & 2 & 0\\ 2 & 5 & 3\\ 0 & 1 & 3\end{bmatrix},
\qquad
\operatorname{Tr}(BA) = 1 + 5 + 3 = 9
$$

#### 4. Conclusion

$\operatorname{Tr}(AB) = \operatorname{Tr}(BA) = 9$ ✓, even though $AB$ and $BA$ have different sizes.

---

## 12. Practice Questions — PD / PSD and Trace

**Q13. (4 marks)** Classify each matrix as PD, PSD only, or neither:

$$
\text{(a) }\begin{bmatrix} 3 & 1\\ 1 & 3\end{bmatrix}
\quad
\text{(b) }\begin{bmatrix} 2 & 4\\ 4 & 8\end{bmatrix}
\quad
\text{(c) }\begin{bmatrix} 0 & 1\\ 1 & 0\end{bmatrix}
\quad
\text{(d) }\begin{bmatrix} 1 & 2\\ 0 & 1\end{bmatrix}
$$

*Hint: symmetry first, as in Example E3.*

**Q14. (3 marks)** For $A = \begin{bmatrix} 1 & 0 & 2\\ -1 & 3 & 1\end{bmatrix}$ and $B = \begin{bmatrix} 2 & 1\\ 0 & 1\\ 1 & 0\end{bmatrix}$, compute $\operatorname{Tr}(AB)$ and $\operatorname{Tr}(BA)$.
*Hint: as in Example E4.*

---

## 13. Practice Questions — Short Theory (2 marks each)

**Q15.** Define an eigenvalue and an eigenvector. Why must an eigenvector be non-zero?

**Q16.** Show that if $x$ is an eigenvector for $\lambda$, then $cx$ ($c \ne 0$) is also one.

**Q17.** Prove that $A$ and $A^{\top}$ have the same eigenvalues.

**Q18.** State the spectral theorem. Why can $P^{-1}$ be replaced by $P^{\top}$ for symmetric $A$?

**Q19.** Give the determinant, the $k$-th power and the inverse of a diagonal matrix. Why does $A = PDP^{-1}$ give $A^k = PD^kP^{-1}$?

**Q20.** Which matrices have a Cholesky decomposition, what shape is $L$, and what happens in the algorithm when $A$ is not positive definite?

---

## 14. Exam Traps

1. Subtracting $\lambda$ from every entry instead of only the diagonal.
2. Putting eigenvalues in $D$ in a different order from the eigenvector columns in $P$.
3. Skipping the checks $\sum\lambda = \operatorname{Tr}A$ and $\prod\lambda = \det A$; they catch most algebra slips.
4. Forgetting to normalize eigenvectors when the question asks for $A = PDP^{\top}$ with orthogonal $P$.
5. Assuming a repeated eigenvalue means "not diagonalizable". Count the eigenspace dimension (Examples B3 and B4).
6. Stopping the linear-map check after the zero test passes (Example A2), or skipping the other two after it fails (Example A3). Always run all three.
7. In Cholesky, forgetting to subtract the earlier squares, e.g. writing $l_{22} = \sqrt{a_{22}}$, or mishandling a double minus in $l_{32}$.
8. Calling a non-symmetric matrix PD because its determinant is positive. Symmetry comes first.

---

**Recall chain:** $A - \lambda I$ → $\det = 0$ → eigenvalues (check trace and determinant) → $\operatorname{Null}(A - \lambda I)$ → eigenvectors → $P$, $D$ → verify; linear maps: zero → addition → scalar, always all three; Cholesky: column by column, subtract earlier squares

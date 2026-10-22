# Lecture 3 - Exam Practice

**Topics:** Basis, Dimension, Rank, Null Space, Independence of Combinations

|



## 3. Solved Examples — Basis and Dimension of a Span

> **Row format:** One operation above each arrow; the complete updated matrix follows.
>
> **REF:** row echelon form. **RREF:** reduced row echelon form.
>
> Rank, independence, and a span's basis need only REF. RREF makes coefficients easier to read.

### Example A1 — the lecture's example (a span in $\mathbb{R}^5$)

**Given** $U = \operatorname{span}\{x_1,x_2,x_3,x_4\} \subseteq \mathbb{R}^5$ with

$$
x_1 = \begin{bmatrix} 1\\ 2\\ -1\\ -1\\ -1\end{bmatrix},\quad
x_2 = \begin{bmatrix} 2\\ -1\\ 1\\ 2\\ -2\end{bmatrix},\quad
x_3 = \begin{bmatrix} 3\\ -4\\ 3\\ 5\\ -3\end{bmatrix},\quad
x_4 = \begin{bmatrix} -1\\ 8\\ -5\\ -6\\ 1\end{bmatrix}
$$

**AIM:** Decide whether $\{x_1,x_2,x_3,x_4\}$ is a basis of $U$; find a basis and $\dim U$.

#### 1. Setting Up

$$
A = \begin{bmatrix}
1 & 2 & 3 & -1\\
2 & -1 & -4 & 8\\
-1 & 1 & 3 & -5\\
-1 & 2 & 5 & -6\\
-1 & -2 & -3 & 1
\end{bmatrix}
$$

#### 2. Row Reduction

**Clear column 1, one operation per row below the pivot:**

$$
\xrightarrow{R_2\leftarrow R_2-2R_1}
\begin{bmatrix}
1&2&3&-1\\
0&-5&-10&10\\
-1&1&3&-5\\
-1&2&5&-6\\
-1&-2&-3&1
\end{bmatrix}
$$

$$
\xrightarrow{R_3\leftarrow R_3+R_1}
\begin{bmatrix}
1&2&3&-1\\
0&-5&-10&10\\
0&3&6&-6\\
-1&2&5&-6\\
-1&-2&-3&1
\end{bmatrix}
$$

$$
\xrightarrow{R_4\leftarrow R_4+R_1}
\begin{bmatrix}
1&2&3&-1\\
0&-5&-10&10\\
0&3&6&-6\\
0&4&8&-7\\
-1&-2&-3&1
\end{bmatrix}
$$

$$
\xrightarrow{R_5\leftarrow R_5+R_1}
\begin{bmatrix}
1&2&3&-1\\
0&-5&-10&10\\
0&3&6&-6\\
0&4&8&-7\\
0&0&0&0
\end{bmatrix}
$$

**Simplify row 2:**

$$
\xrightarrow{R_2\leftarrow-\tfrac15 R_2}
\begin{bmatrix}
1&2&3&-1\\
0&1&2&-2\\
0&3&6&-6\\
0&4&8&-7\\
0&0&0&0
\end{bmatrix}
$$

**Clear column 2 below the new pivot:**

$$
\xrightarrow{R_3\leftarrow R_3-3R_2}
\begin{bmatrix}
1&2&3&-1\\
0&1&2&-2\\
0&0&0&0\\
0&4&8&-7\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_4\leftarrow R_4-4R_2}
\begin{bmatrix}
1&2&3&-1\\
0&1&2&-2\\
0&0&0&0\\
0&0&0&1\\
0&0&0&0
\end{bmatrix}
$$

**Move the non-zero row above the zero rows:**

$$
\xrightarrow{R_3\leftrightarrow R_4}
\begin{bmatrix}
1 & 2 & 3 & -1\\
0 & 1 & 2 & -2\\
0 & 0 & 0 & 1\\
0 & 0 & 0 & 0\\
0 & 0 & 0 & 0
\end{bmatrix}
\quad\text{(REF)}
$$

#### 3. Basis And Relations

**Pivots in columns 1, 2 and 4.** Column 3 has none. $\operatorname{rank}(A) = 3$.

**Take the ORIGINAL vectors in the pivot columns:** $\{x_1, x_2, x_4\}$.

**$\dim U = 3$.** Four spanning vectors but dimension 3, so $\{x_1,x_2,x_3,x_4\}$ is dependent and **not** a basis.

**Basis and dimension are already established. Continue only to find the dependency:**

$$
\xrightarrow{R_1\leftarrow R_1+R_3}
\begin{bmatrix}
1&2&3&0\\
0&1&2&-2\\
0&0&0&1\\
0&0&0&0\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_2\leftarrow R_2+2R_3}
\begin{bmatrix}
1&2&3&0\\
0&1&2&0\\
0&0&0&1\\
0&0&0&0\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_1\leftarrow R_1-2R_2}
\begin{bmatrix}
1&0&-1&0\\
0&1&2&0\\
0&0&0&1\\
0&0&0&0\\
0&0&0&0
\end{bmatrix}
\quad\text{(RREF)}
$$

**Read column 3 of the RREF, $(-1,2,0,0,0)$:** it is $-1\times$ column 1 $+\;2\times$ column 2, so

$$
x_3 = -x_1 + 2x_2
$$

#### 4. Check

$$
-\begin{bmatrix} 1\\ 2\\ -1\\ -1\\ -1\end{bmatrix}
+ 2\begin{bmatrix} 2\\ -1\\ 1\\ 2\\ -2\end{bmatrix}
= \begin{bmatrix} -1 + 4\\ -2 - 2\\ 1 + 2\\ 1 + 4\\ 1 - 4\end{bmatrix}
= \begin{bmatrix} 3\\ -4\\ 3\\ 5\\ -3\end{bmatrix} = x_3 \;✓
$$

#### 5. Conclusion

**Hence** a basis of $U$ is $\{x_1, x_2, x_4\}$ and $\dim U = 3$; the given set is not a basis because $x_3 = -x_1 + 2x_2$.

---

### Example A2 — four vectors in $\mathbb{R}^3$ spanning a plane

**Given**

$$
v_1 = \begin{bmatrix} 1\\ 2\\ 3\end{bmatrix},\quad
v_2 = \begin{bmatrix} 2\\ 4\\ 6\end{bmatrix},\quad
v_3 = \begin{bmatrix} 1\\ 0\\ 1\end{bmatrix},\quad
v_4 = \begin{bmatrix} 3\\ 4\\ 7\end{bmatrix}
$$

**AIM:** Find a basis and the dimension of $W = \operatorname{span}\{v_1,v_2,v_3,v_4\}$.

#### 1. Setting Up

$$
A = \begin{bmatrix}
1 & 2 & 1 & 3\\
2 & 4 & 0 & 4\\
3 & 6 & 1 & 7
\end{bmatrix}
$$

#### 2. Row Reduction

**Clear column 1:**

$$
\xrightarrow{R_2\leftarrow R_2-2R_1}
\begin{bmatrix}
1&2&1&3\\
0&0&-2&-2\\
3&6&1&7
\end{bmatrix}
$$

$$
\xrightarrow{R_3\leftarrow R_3-3R_1}
\begin{bmatrix}
1&2&1&3\\
0&0&-2&-2\\
0&0&-2&-2
\end{bmatrix}
$$

**Column 2 has only zeros below row 1,** so the next pivot is in column 3:

$$
\xrightarrow{R_3\leftarrow R_3-R_2}
\begin{bmatrix}
1 & 2 & 1 & 3\\
0 & 0 & -2 & -2\\
0 & 0 & 0 & 0
\end{bmatrix}
\quad\text{(REF)}
$$

#### 3. Basis And Relations

**Pivots in columns 1 and 3.** $\operatorname{rank}(A) = 2$.

**Original pivot vectors:** $\{v_1, v_3\}$. $\;\dim W = 2$, so $W$ is a plane through the origin in $\mathbb{R}^3$.

**Basis and dimension are already established. Continue only to find the dependencies:**

$$
\xrightarrow{R_2\leftarrow-\tfrac12 R_2}
\begin{bmatrix}
1&2&1&3\\
0&0&1&1\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_1\leftarrow R_1-R_2}
\begin{bmatrix}
1&2&0&2\\
0&0&1&1\\
0&0&0&0
\end{bmatrix}
\quad\text{(RREF)}
$$

**Read the non-pivot columns:** column 2 is $(2,0,0)$, so $v_2 = 2v_1$; column 4 is $(2,1,0)$, so $v_4 = 2v_1 + v_3$.

#### 4. Check

$$
2v_1 = (2,4,6) = v_2 \;✓
\qquad\qquad
2v_1 + v_3 = (2 + 1,\; 4 + 0,\; 6 + 1) = (3,4,7) = v_4 \;✓
$$

#### 5. Conclusion

**Hence** $\{v_1, v_3\}$ is a basis of $W$ and $\dim W = 2$.

---

### Example A3 — checking a basis of $\mathbb{R}^3$, and coordinates

**Given**

$$
\mathcal B = \left\{\,
p_1 = \begin{bmatrix} 1\\ 0\\ 0\end{bmatrix},\;
p_2 = \begin{bmatrix} 1\\ 1\\ 0\end{bmatrix},\;
p_3 = \begin{bmatrix} 1\\ 1\\ 1\end{bmatrix}
\,\right\}
$$

**AIM:** Prove $\mathcal B$ is a basis of $\mathbb{R}^3$, and express $v = (4, 3, 2)$ in this basis.

#### 1. Setting Up

$$
A = \begin{bmatrix}
1 & 1 & 1\\
0 & 1 & 1\\
0 & 0 & 1
\end{bmatrix}
$$

#### 2. Row Reduction

**Already upper triangular,** so already in REF. No row operation is needed.

#### 3. Basis And Relations

**Pivots in all three columns,** so $\operatorname{rank}(A) = 3$ and the vectors are independent (condition (a)).

**Spanning (condition (b)):** for any $w = (a,b,c)$, solve $t_1 p_1 + t_2 p_2 + t_3 p_3 = w$:

$$
\begin{aligned}
t_1 + t_2 + t_3 &= a\\
t_2 + t_3 &= b\\
t_3 &= c
\end{aligned}
\qquad\Longrightarrow\qquad
t_3 = c,\quad t_2 = b - c,\quad t_1 = a - b
$$

Real weights exist for every $(a,b,c)$, so $\mathcal B$ spans $\mathbb{R}^3$.
**Both conditions hold,** so $\mathcal B$ is a basis and $\dim\mathbb{R}^3 = 3$.

**Put $a = 4$, $b = 3$, $c = 2$ into the formulas:**

$$
t_1 = 4 - 3 = 1,
\qquad
t_2 = 3 - 2 = 1,
\qquad
t_3 = 2
$$

#### 4. Check

$$
1\begin{bmatrix} 1\\ 0\\ 0\end{bmatrix}
+ 1\begin{bmatrix} 1\\ 1\\ 0\end{bmatrix}
+ 2\begin{bmatrix} 1\\ 1\\ 1\end{bmatrix}
= \begin{bmatrix} 1 + 1 + 2\\ 0 + 1 + 2\\ 0 + 0 + 2\end{bmatrix}
= \begin{bmatrix} 4\\ 3\\ 2\end{bmatrix} \;✓
$$

#### 5. Conclusion

**Hence** $\mathcal B$ is a basis of $\mathbb{R}^3$ and $v = p_1 + p_2 + 2p_3$, so the coordinates of $v$ in $\mathcal B$ are $(1, 1, 2)$.

**A basis is not unique:** $\mathcal B$ differs from $\{e_1,e_2,e_3\}$ but has the same size.

---

### Example A4 — column space and row space of a matrix

**Given**

$$
A = \begin{bmatrix}
1 & 2 & 0 & 1\\
2 & 4 & 1 & 3\\
3 & 6 & 1 & 4
\end{bmatrix}
$$

**AIM:** Find a basis and the dimension of $\operatorname{Col}(A)$ and of $\operatorname{Row}(A)$, and check Rank–Nullity.

#### 1. Setting Up

**$\operatorname{Col}(A)$ is the span of the four columns of $A$,** so $A$ itself is the matrix to reduce.

#### 2. Row Reduction

**Clear column 1:**

$$
\xrightarrow{R_2\leftarrow R_2-2R_1}
\begin{bmatrix}
1&2&0&1\\
0&0&1&1\\
3&6&1&4
\end{bmatrix}
$$

$$
\xrightarrow{R_3\leftarrow R_3-3R_1}
\begin{bmatrix}
1&2&0&1\\
0&0&1&1\\
0&0&1&1
\end{bmatrix}
$$

**Next pivot in column 3:**

$$
\xrightarrow{R_3\leftarrow R_3-R_2}
\begin{bmatrix}
1 & 2 & 0 & 1\\
0 & 0 & 1 & 1\\
0 & 0 & 0 & 0
\end{bmatrix}
\quad\text{(REF and RREF)}
$$

#### 3. Basis And Relations

**Pivots in columns 1 and 3.** $\operatorname{rank}(A) = 2$.

**Column space: ORIGINAL columns 1 and 3 of $A$:**

$$
\operatorname{Col}(A) = \operatorname{span}\left\{ \begin{bmatrix} 1\\ 2\\ 3\end{bmatrix},\; \begin{bmatrix} 0\\ 1\\ 1\end{bmatrix} \right\},
\qquad
\dim \operatorname{Col}(A) = 2
$$

**Row space: the non-zero rows of the REF:**

$$
\operatorname{Row}(A) = \operatorname{span}\left\{ (1,\,2,\,0,\,1),\; (0,\,0,\,1,\,1) \right\},
\qquad
\dim \operatorname{Row}(A) = 2
$$

Row operations only combine rows, so the REF rows span the same row space.

**The REF is already reduced** (pivots $1$, zeros above them). Column 2 is $(2,0,0)$ and column 4 is $(1,1,0)$:

$$
\text{col}_2 = 2\,\text{col}_1,
\qquad
\text{col}_4 = \text{col}_1 + \text{col}_3
$$

#### 4. Check

**On the original columns:** $2(1,2,3) = (2,4,6)$ = column 2 ✓; $\;(1,2,3) + (0,1,1) = (1,3,4)$ = column 4 ✓

**Why the REF columns are NOT a basis of $\operatorname{Col}(A)$:** the REF column $(1,0,0)$ is not even in $\operatorname{Col}(A)$. Solving $a(1,2,3) + b(0,1,1) = (1,0,0)$ gives $a = 1$, $b = -2$, but then the third entry is $3 - 2 = 1 \ne 0$.

**Rank–Nullity:** two free variables ($x_2, x_4$), so $\operatorname{nullity}(A) = 2$ and $2 + 2 = 4 = n$ ✓

#### 5. Conclusion

**Hence** $\dim\operatorname{Col}(A) = \dim\operatorname{Row}(A) = \operatorname{rank}(A) = 2$, with the bases above.

---

### Example A5 - Basis And Coordinates In One Reduction

**Given**

$$
x_1=\begin{bmatrix}1\\1\\0\end{bmatrix},\qquad
x_2=\begin{bmatrix}0\\1\\1\end{bmatrix},\qquad
x_3=\begin{bmatrix}1\\0\\1\end{bmatrix},\qquad
v=\begin{bmatrix}2\\3\\1\end{bmatrix}.
$$

**AIM:** Prove the given vectors form a basis; find the coefficients that produce $v$.

> **Order:** Original augmented matrix → row echelon form (REF) → reduced row echelon form (RREF).
>
> Keep working on the same matrix. REF comes before RREF; neither requires restarting.

#### 1. Setting Up

Name the given vectors $x_1,x_2,x_3$, in their listed order.

The required coordinates are the real coefficients $a,b,c$:

$$
a x_1+b x_2+c x_3=v.
$$

Put the given vectors on the left and the target on the right:

$$
[A\mid v]=
\left[\begin{array}{ccc|c}
1&0&1&2\\
1&1&0&3\\
0&1&1&1
\end{array}\right].
$$

Left columns correspond to $a,b,c$. The last column is not another unknown.

#### 2. Row Reduction: REF

**Purpose:** Create zeros below the leading entries, called pivots.

Apply every operation to the entire row, including the target column.

$$
\xrightarrow{R_2\leftarrow R_2-R_1}
\left[\begin{array}{ccc|c}
1&0&1&2\\
0&1&-1&1\\
0&1&1&1
\end{array}\right]
$$

$$
\xrightarrow{R_3\leftarrow R_3-R_2}
\left[\begin{array}{ccc|c}
1&0&1&2\\
0&1&-1&1\\
0&0&2&0
\end{array}\right]
\quad\text{(REF)}.
$$

Three pivot columns: the given vectors are independent and span $\mathbb R^3$.

#### 3. Row Reduction: RREF

**Purpose:** Make the left block the identity matrix, so the coefficients can be read directly.

Continue from Step 2, in this order:

$$
\xrightarrow{R_3\leftarrow\tfrac12 R_3}
\left[\begin{array}{ccc|c}
1&0&1&2\\
0&1&-1&1\\
0&0&1&0
\end{array}\right]
$$

$$
\xrightarrow{R_1\leftarrow R_1-R_3}
\left[\begin{array}{ccc|c}
1&0&0&2\\
0&1&-1&1\\
0&0&1&0
\end{array}\right]
$$

$$
\xrightarrow{R_2\leftarrow R_2+R_3}
\left[\begin{array}{ccc|c}
1&0&0&2\\
0&1&0&1\\
0&0&1&0
\end{array}\right]
\quad\text{(RREF)}.
$$

The rows now say $a=2$, $b=1$, $c=0$.

Row operations preserve the solutions for $a,b,c$; the given basis vectors remain unchanged.

#### 4. Check

Use the given vectors only to verify the coefficients, not to restart elimination:

$$
\begin{aligned}
2x_1+x_2+0x_3
&=2\begin{bmatrix}1\\1\\0\end{bmatrix}
 +\begin{bmatrix}0\\1\\1\end{bmatrix}
 +0\begin{bmatrix}1\\0\\1\end{bmatrix}\\
&=\begin{bmatrix}2\\3\\1\end{bmatrix}=v.
\end{aligned}
$$

Basic coefficients: $a,b,c$. No free coefficient.

$$
\operatorname{rank}(A)=\operatorname{rank}([A\mid v])=3,
\qquad 3+0=3\quad\text{(rank + nullity)}.
$$

#### 5. Conclusion

$$
\boxed{\text{Hence the given vectors form a basis of }\mathbb R^3.}
$$

Coordinates in that same order:

$$
\boxed{[v]_{\mathcal B}=\begin{bmatrix}2\\1\\0\end{bmatrix},
\qquad\mathcal B=(x_1,x_2,x_3).}
$$

**Recall:** Attach target → REF → RREF → read coefficients → verify.

**Quick check:** Which RREF column contains $a,b,c$?

---

## 4. Practice Questions — Spans

> Marks shown are my estimate of exam weight, not official.

**Q1. (6 marks)** Find a basis and the dimension of

$$
U = \operatorname{span}\left\{
\begin{bmatrix} 1\\ 2\\ 0\\ 1\end{bmatrix},
\begin{bmatrix} 2\\ 4\\ 1\\ 3\end{bmatrix},
\begin{bmatrix} 0\\ 0\\ 1\\ 1\end{bmatrix},
\begin{bmatrix} 1\\ 1\\ 1\\ 1\end{bmatrix}
\right\} \subseteq \mathbb{R}^4
$$

Write every non-pivot vector as a combination of the pivot vectors.
**Pattern:** A1. Use the five headings in Routine A.

**Q2. (4 marks)** Find a basis and the dimension of

$$
W = \operatorname{span}\left\{
\begin{bmatrix} 1\\ -1\\ 2\end{bmatrix},
\begin{bmatrix} 2\\ -2\\ 4\end{bmatrix},
\begin{bmatrix} 0\\ 1\\ 1\end{bmatrix},
\begin{bmatrix} 1\\ 0\\ 3\end{bmatrix}
\right\}
$$

*Hint: as in Example A2; expect a plane.*

**Q3. (5 marks)** Show that

$$
\left\{
\begin{bmatrix} 1\\ 1\\ 0\end{bmatrix},
\begin{bmatrix} 0\\ 1\\ 1\end{bmatrix},
\begin{bmatrix} 1\\ 0\\ 1\end{bmatrix}
\right\}
$$

is a basis of $\mathbb{R}^3$, and find the coordinates of $v = (2,3,1)$ in this basis.

**Pattern:** Example A5.

**Q4. (5 marks)** For

$$
A = \begin{bmatrix}
1 & -1 & 2 & 0\\
2 & -2 & 5 & 1\\
1 & -1 & 3 & 1
\end{bmatrix}
$$

find bases for $\operatorname{Col}(A)$ and $\operatorname{Row}(A)$, state $\operatorname{rank}(A)$, and check Rank–Nullity.
*Hint: as in Example A4; one REF answers both parts.*

---

## 5. Solved Examples — Basis and Dimension from Equations (Null Space)

> Follow the matching fixed routine above.

### Example B1 — one equation in $\mathbb{R}^3$ (a plane)

**Given**

$$
U = \left\{\, x \in \mathbb{R}^3 \;\middle|\; x_1 + x_2 + x_3 = 0 \,\right\}
$$

**AIM:** Find a basis and the dimension of $U$.

#### 1. Setting Up

$$
A = \begin{bmatrix} 1 & 1 & 1\end{bmatrix},
\qquad
U = \operatorname{Null}(A)
$$

#### 2. Row Reduction

**One row with pivot $1$:** already in RREF.

#### 3. General Solution And Factoring

**Pivot column 1:** basic $x_1$. Free $x_2, x_3$.

$$
x_1 = -x_2 - x_3
$$

$$
x = \begin{bmatrix} -x_2 - x_3\\ x_2\\ x_3\end{bmatrix}
= x_2\begin{bmatrix} -1\\ 1\\ 0\end{bmatrix} + x_3\begin{bmatrix} -1\\ 0\\ 1\end{bmatrix}
$$

#### 4. Check

**Each vector's coordinates add to zero:** $-1 + 1 + 0 = 0$ ✓, $\;-1 + 0 + 1 = 0$ ✓

**Rank–Nullity:** $1 + 2 = 3$ ✓

#### 5. Conclusion

**Hence** a basis of $U$ is $\{(-1,1,0),\,(-1,0,1)\}$ and $\dim U = 3-1 = 2$.

---

### Example B2 — two equations in $\mathbb{R}^4$

**Given**

$$
U = \left\{\, x \in \mathbb{R}^4 \;\middle|\;
\begin{aligned} x_1 + x_2 - x_3 &= 0\\ x_2 + x_4 &= 0 \end{aligned}
\,\right\}
$$

**AIM:** Find a basis and the dimension of $U$.

#### 1. Setting Up

**A missing variable has coefficient $0$:**

$$
A = \begin{bmatrix}
1 & 1 & -1 & 0\\
0 & 1 & 0 & 1
\end{bmatrix}
$$

#### 2. Row Reduction

**Already in REF.** Clear above the second pivot:

$$
\xrightarrow{R_1\leftarrow R_1-R_2}
\begin{bmatrix}
1 & 0 & -1 & -1\\
0 & 1 & 0 & 1
\end{bmatrix}
\quad\text{(RREF)}
$$

#### 3. General Solution And Factoring

**Basic $x_1, x_2$; free $x_3, x_4$.**

$$
x_1 = x_3 + x_4,
\qquad
x_2 = -x_4
$$

$$
x = \begin{bmatrix} x_3 + x_4\\ -x_4\\ x_3\\ x_4\end{bmatrix}
= x_3\underbrace{\begin{bmatrix} 1\\ 0\\ 1\\ 0\end{bmatrix}}_{u_1} + x_4\underbrace{\begin{bmatrix} 1\\ -1\\ 0\\ 1\end{bmatrix}}_{u_2}
$$

#### 4. Check

| Vector | $x_1 + x_2 - x_3$ | $x_2 + x_4$ |
| :--- | :--- | :--- |
| $u_1$ | $1 + 0 - 1 = 0$ ✓ | $0 + 0 = 0$ ✓ |
| $u_2$ | $1 - 1 - 0 = 0$ ✓ | $-1 + 1 = 0$ ✓ |

Rank–Nullity: $2 + 2 = 4$ ✓

#### 5. Conclusion

**Hence** a basis of $U$ is $\{u_1, u_2\}$ and $\dim U = 4-2 = 2$. The two vectors are automatically independent: each has a $1$ in a free slot where the other has $0$.

---

### Example B3 — three equations, but only two independent ones

**Given**

$$
U = \left\{\, x \in \mathbb{R}^4 \;\middle|\;
\begin{aligned} x_1 + x_2 + x_3 + x_4 &= 0\\ x_1 - x_2 &= 0\\ 2x_1 + x_3 + x_4 &= 0 \end{aligned}
\,\right\}
$$

**AIM:** Find a basis and the dimension of $U$.

#### 1. Setting Up

$$
A = \begin{bmatrix}
1 & 1 & 1 & 1\\
1 & -1 & 0 & 0\\
2 & 0 & 1 & 1
\end{bmatrix}
$$

#### 2. Row Reduction

**Clear column 1:**

$$
\xrightarrow{R_2\leftarrow R_2-R_1}
\begin{bmatrix}
1&1&1&1\\
0&-2&-1&-1\\
2&0&1&1
\end{bmatrix}
$$

$$
\xrightarrow{R_3\leftarrow R_3-2R_1}
\begin{bmatrix}
1&1&1&1\\
0&-2&-1&-1\\
0&-2&-1&-1
\end{bmatrix}
$$

**Clear column 2:**

$$
\xrightarrow{R_3\leftarrow R_3-R_2}
\begin{bmatrix}
1&1&1&1\\
0&-2&-1&-1\\
0&0&0&0
\end{bmatrix}
\quad\text{(REF)}
$$

**Scale row 2 and clear above it:**

$$
\xrightarrow{R_2\leftarrow-\tfrac12 R_2}
\begin{bmatrix}
1&1&1&1\\
0&1&\tfrac12&\tfrac12\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_1\leftarrow R_1-R_2}
\begin{bmatrix}
1&0&\tfrac12&\tfrac12\\
0&1&\tfrac12&\tfrac12\\
0&0&0&0
\end{bmatrix}
\quad\text{(RREF)}
$$

#### 3. General Solution And Factoring

**Basic $x_1, x_2$; free $x_3, x_4$.**

**Count $m$ correctly:** three equations were written, but the zero row shows equation 3 = equation 1 + equation 2. So $m = 2$ (not 3) and $\dim U = 4 - 2 = 2$.

$$
x_1 = -\tfrac12 x_3 - \tfrac12 x_4,
\qquad
x_2 = -\tfrac12 x_3 - \tfrac12 x_4
$$

**Split by free variable:**

$$
x = x_3\begin{bmatrix} -\tfrac12\\ -\tfrac12\\ 1\\ 0\end{bmatrix} + x_4\begin{bmatrix} -\tfrac12\\ -\tfrac12\\ 0\\ 1\end{bmatrix}
$$

**Clear fractions.** A non-zero multiple of a basis vector is still a valid basis vector, so multiply each by $2$:

$$
u_1 = \begin{bmatrix} -1\\ -1\\ 2\\ 0\end{bmatrix},
\qquad
u_2 = \begin{bmatrix} -1\\ -1\\ 0\\ 2\end{bmatrix}
$$

#### 4. Check

| Vector | Eq. 1 | Eq. 2 | Eq. 3 |
| :--- | :--- | :--- | :--- |
| $u_1$ | $-1 - 1 + 2 + 0 = 0$ ✓ | $-1 + 1 = 0$ ✓ | $-2 + 2 + 0 = 0$ ✓ |
| $u_2$ | $-1 - 1 + 0 + 2 = 0$ ✓ | $-1 + 1 = 0$ ✓ | $-2 + 0 + 2 = 0$ ✓ |

Rank–Nullity: $2 + 2 = 4$ ✓

#### 5. Conclusion

**Hence** a basis of $U$ is $\{u_1,u_2\}$ and $\dim U = 2$.

**Quiz lesson:** $\dim = n - m$ counts only **independent** equations. Always row-reduce before counting.

---

### Example B4 — intersection of two subspaces

**Given** two planes through the origin in $\mathbb{R}^3$:

$$
S_1 = \left\{\, x \;\middle|\; x_1 + x_2 - x_3 = 0 \,\right\},
\qquad
S_2 = \left\{\, x \;\middle|\; x_1 - x_2 + x_3 = 0 \,\right\}
$$

**AIM:** Find a basis and the dimension of $S_1 \cap S_2$.

#### 1. Setting Up

**A vector is in $S_1 \cap S_2$ when it satisfies both equations,** so stack them:

$$
A = \begin{bmatrix}
1 & 1 & -1\\
1 & -1 & 1
\end{bmatrix},
\qquad
S_1 \cap S_2 = \operatorname{Null}(A)
$$

#### 2. Row Reduction

The right-hand side stays zero. Each arrow shows one operation and the complete resulting matrix.

$$
\xrightarrow{R_2\leftarrow R_2-R_1}
\begin{bmatrix}
1&1&-1\\
0&-2&2
\end{bmatrix}
\quad\text{(REF)}
$$

$$
\xrightarrow{R_2\leftarrow-\tfrac12 R_2}
\begin{bmatrix}
1&1&-1\\
0&1&-1
\end{bmatrix}
$$

$$
\xrightarrow{R_1\leftarrow R_1-R_2}
\begin{bmatrix}
1&0&0\\
0&1&-1
\end{bmatrix}
\quad\text{(RREF)}
$$

#### 3. General Solution And Factoring

**Basic $x_1, x_2$; free $x_3$.**

$$
x_1 = 0,
\qquad
x_2 = x_3
$$

$$
x = \begin{bmatrix} 0\\ x_3\\ x_3\end{bmatrix} = x_3\begin{bmatrix} 0\\ 1\\ 1\end{bmatrix}
$$

#### 4. Check

$$
S_1:\; 0 + 1 - 1 = 0 \;✓
\qquad
S_2:\; 0 - 1 + 1 = 0 \;✓
$$

#### 5. Conclusion

**Hence** $\{(0,1,1)\}$ is a basis of $S_1\cap S_2$, and $\dim(S_1\cap S_2)=3-2=1$.

---

## 6. Practice Questions — Equations

**Q5. (5 marks)** Find a basis and the dimension of

$$
U = \left\{\, x \in \mathbb{R}^4 \;\middle|\;
\begin{aligned} x_1 - x_2 + 2x_3 &= 0\\ x_3 - x_4 &= 0 \end{aligned}
\,\right\}
$$

and confirm Rank–Nullity.
*Hint: as in Example B2.*

**Q6. (3 marks)** Find a basis and the dimension of $U = \left\{\, x \in \mathbb{R}^3 \;\middle|\; 2x_1 - x_2 + 3x_3 = 0 \,\right\}$.
*Hint: as in Example B1; make $x_2$ the basic variable to avoid fractions.*

**Q7. (5 marks)** Find a basis and the dimension of

$$
U = \left\{\, x \in \mathbb{R}^4 \;\middle|\;
\begin{aligned} x_1 + x_2 - x_4 &= 0\\ x_2 + x_3 &= 0\\ x_1 + 2x_2 + x_3 - x_4 &= 0 \end{aligned}
\,\right\}
$$

*Hint: count $m$ carefully, as in Example B3.*

**Q8. (4 marks)** Find a basis and the dimension of $S_1 \cap S_2$, where

$$
S_1 = \left\{\, x \in \mathbb{R}^3 \;\middle|\; x_1 + x_2 + x_3 = 0 \,\right\},
\qquad
S_2 = \left\{\, x \in \mathbb{R}^3 \;\middle|\; x_1 - x_3 = 0 \,\right\}
$$

*Hint: stack the equations, as in Example B4.*

---

## 7. Solved Examples — Independence of Combinations

> Follow the matching fixed routine above.

### Example C1 — the lecture's example (four combinations)

**Given** independent vectors $b_1,b_2,b_3,b_4$ and

$$
\begin{aligned}
x_1 &= b_1 - 2b_2 + b_3 - b_4\\
x_2 &= -4b_1 - 2b_2 + 4b_4\\
x_3 &= 2b_1 + 3b_2 - b_3 - 3b_4\\
x_4 &= 17b_1 - 10b_2 + 11b_3 + b_4
\end{aligned}
$$

**AIM:** Decide whether $x_1,x_2,x_3,x_4$ are linearly independent.

#### 1. Coefficient Matrix

**Read the weights of $b_1,b_2,b_3,b_4$ in each $x_j$.** $x_2$ has no $b_3$, so its third weight is $0$:

$$
x_1 \to \begin{bmatrix} 1\\ -2\\ 1\\ -1\end{bmatrix},
\quad
x_2 \to \begin{bmatrix} -4\\ -2\\ 0\\ 4\end{bmatrix},
\quad
x_3 \to \begin{bmatrix} 2\\ 3\\ -1\\ -3\end{bmatrix},
\quad
x_4 \to \begin{bmatrix} 17\\ -10\\ 11\\ 1\end{bmatrix}
$$

**Why this is allowed:** the $b$'s are independent, so the $x$'s are independent exactly when these coefficient columns are (formula 1.4).

$$
C = \begin{bmatrix}
1 & -4 & 2 & 17\\
-2 & -2 & 3 & -10\\
1 & 0 & -1 & 11\\
-1 & 4 & -3 & 1
\end{bmatrix}
$$

#### 2. Row Reduction

$$
\xrightarrow{R_2\leftarrow R_2+2R_1}
\begin{bmatrix}
1&-4&2&17\\
0&-10&7&24\\
1&0&-1&11\\
-1&4&-3&1
\end{bmatrix}
$$

$$
\xrightarrow{R_3\leftarrow R_3-R_1}
\begin{bmatrix}
1&-4&2&17\\
0&-10&7&24\\
0&4&-3&-6\\
-1&4&-3&1
\end{bmatrix}
$$

$$
\xrightarrow{R_4\leftarrow R_4+R_1}
\begin{bmatrix}
1&-4&2&17\\
0&-10&7&24\\
0&4&-3&-6\\
0&0&-1&18
\end{bmatrix}
$$

**Make a smaller pivot first** (integer-friendly):

$$
\xrightarrow{R_2\leftarrow R_2+2R_3}
\begin{bmatrix}
1&-4&2&17\\
0&-2&1&12\\
0&4&-3&-6\\
0&0&-1&18
\end{bmatrix}
$$

**Remove the $4$ in row 3 using the new row 2:**

$$
\xrightarrow{R_3\leftarrow R_3+2R_2}
\begin{bmatrix}
1&-4&2&17\\
0&-2&1&12\\
0&0&-1&18\\
0&0&-1&18
\end{bmatrix}
$$

**Rows 3 and 4 are now identical:**

$$
\xrightarrow{R_4\leftarrow R_4-R_3}
\begin{bmatrix}
1 & -4 & 2 & 17\\
0 & -2 & 1 & 12\\
0 & 0 & -1 & 18\\
0 & 0 & 0 & 0
\end{bmatrix}
\quad\text{(REF)}
$$

#### 3. Rank

**Pivots in columns 1, 2, 3; column 4 has none.** $\operatorname{rank}(C) = 3 < 4$, so the columns are **dependent**.

#### 4. Dependency And Check

**Reduce to RREF:**

$$
\xrightarrow{R_3\leftarrow-R_3}
\begin{bmatrix}
1&-4&2&17\\
0&-2&1&12\\
0&0&1&-18\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_2\leftarrow R_2-R_3}
\begin{bmatrix}
1&-4&2&17\\
0&-2&0&30\\
0&0&1&-18\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_1\leftarrow R_1-2R_3}
\begin{bmatrix}
1&-4&0&53\\
0&-2&0&30\\
0&0&1&-18\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_2\leftarrow-\tfrac12 R_2}
\begin{bmatrix}
1&-4&0&53\\
0&1&0&-15\\
0&0&1&-18\\
0&0&0&0
\end{bmatrix}
$$

$$
\xrightarrow{R_1\leftarrow R_1+4R_2}
\begin{bmatrix}
1&0&0&-7\\
0&1&0&-15\\
0&0&1&-18\\
0&0&0&0
\end{bmatrix}
\quad\text{(RREF)}
$$

**Read column 4, $(-7,-15,-18,0)$:** $x_4 = -7x_1 - 15x_2 - 18x_3$ (this matches slide 7).

**Check on the coefficient vectors, row by row:**

$$
-7\begin{bmatrix} 1\\ -2\\ 1\\ -1\end{bmatrix}
-15\begin{bmatrix} -4\\ -2\\ 0\\ 4\end{bmatrix}
-18\begin{bmatrix} 2\\ 3\\ -1\\ -3\end{bmatrix}
= \begin{bmatrix} -7 + 60 - 36\\ 14 + 30 - 54\\ -7 + 0 + 18\\ 7 - 60 + 54\end{bmatrix}
= \begin{bmatrix} 17\\ -10\\ 11\\ 1\end{bmatrix} \;✓
$$

#### 5. Conclusion

**Hence** $x_1,x_2,x_3,x_4$ are linearly **dependent**, with $x_4 = -7x_1 - 15x_2 - 18x_3$; $\{x_1,x_2,x_3\}$ is independent.

---

### Example C2 — three combinations that are independent

**Given** independent $b_1,b_2,b_3$ and

$$
x_1 = b_1 + b_2,
\qquad
x_2 = b_2 + b_3,
\qquad
x_3 = b_1 + b_3
$$

**AIM:** Decide whether $x_1,x_2,x_3$ are linearly independent.

#### 1. Coefficient Matrix

$$
x_1 \to (1,\,1,\,0),
\qquad
x_2 \to (0,\,1,\,1),
\qquad
x_3 \to (1,\,0,\,1)
$$

$$
C = \begin{bmatrix}
1 & 0 & 1\\
1 & 1 & 0\\
0 & 1 & 1
\end{bmatrix}
$$

#### 2. Row Reduction

$$
\xrightarrow{R_2\leftarrow R_2-R_1}
\begin{bmatrix}
1&0&1\\
0&1&-1\\
0&1&1
\end{bmatrix}
$$

$$
\xrightarrow{R_3\leftarrow R_3-R_2}
\begin{bmatrix}
1 & 0 & 1\\
0 & 1 & -1\\
0 & 0 & 2
\end{bmatrix}
\quad\text{(REF)}
$$

#### 3. Rank

**Pivots $1, 1, 2$ in all three columns.** $\operatorname{rank}(C) = 3$: **independent**.

#### 4. Dependency And Check

**No dependency exists.** Check: $\det C = 1\cdot1\cdot2 = 2 \ne 0$ ✓

#### 5. Conclusion

**Hence** $x_1,x_2,x_3$ are linearly **independent**, although each is built from the same $b$'s.

---

### Example C3 — three combinations that cancel out

**Given** independent $b_1,b_2,b_3$ and

$$
x_1 = b_1 - b_2,
\qquad
x_2 = b_2 - b_3,
\qquad
x_3 = b_3 - b_1
$$

**AIM:** Decide whether $x_1,x_2,x_3$ are linearly independent.

#### 1. Coefficient Matrix

$$
x_1 \to (1,\,-1,\,0),
\qquad
x_2 \to (0,\,1,\,-1),
\qquad
x_3 \to (-1,\,0,\,1)
$$

$$
C = \begin{bmatrix}
1 & 0 & -1\\
-1 & 1 & 0\\
0 & -1 & 1
\end{bmatrix}
$$

#### 2. Row Reduction

$$
\xrightarrow{R_2\leftarrow R_2+R_1}
\begin{bmatrix}
1&0&-1\\
0&1&-1\\
0&-1&1
\end{bmatrix}
$$

$$
\xrightarrow{R_3\leftarrow R_3+R_2}
\begin{bmatrix}
1 & 0 & -1\\
0 & 1 & -1\\
0 & 0 & 0
\end{bmatrix}
\quad\text{(REF and RREF)}
$$

#### 3. Rank

**Pivots in columns 1 and 2 only.** $\operatorname{rank}(C) = 2 < 3$: **dependent**.

#### 4. Dependency And Check

**The REF is already the RREF.** Column 3 is $(-1,-1,0)$, so $x_3 = -x_1 - x_2$.

**Check with the $b$'s:**

$$
-x_1 - x_2 = -(b_1 - b_2) - (b_2 - b_3) = -b_1 + b_3 = x_3 \;✓
$$

#### 5. Conclusion

**Hence** $x_1,x_2,x_3$ are **dependent**: $x_1 + x_2 + x_3 = \mathbf 0$ is a non-trivial combination.

---

## 8. Practice Questions — Combinations

**Q9. (4 marks)** Let $b_1,b_2,b_3$ be linearly independent and

$$
x_1 = b_1 + b_2,
\qquad
x_2 = b_2 + b_3,
\qquad
x_3 = b_1 - b_3
$$

Decide whether $x_1,x_2,x_3$ are linearly independent. If not, write the dependency.
*Hint: compare with Examples C2 and C3; one sign changes the answer.*

**Q10. (4 marks)** Let $b_1,b_2,b_3$ be linearly independent and

$$
x_1 = b_1 + b_2 + b_3,
\qquad
x_2 = b_1 - b_2,
\qquad
x_3 = 2b_1 + b_3
$$

Decide whether $x_1,x_2,x_3$ are linearly independent, and write the dependency if there is one.
*Hint: $x_2$ has no $b_3$ and $x_3$ has no $b_2$ — put zeros in $C$.*

---

## 9. Solved Examples — Structural Subspace Proofs

> Follow the matching fixed routine above.

### Example D1 — the solutions of $Ax = \mathbf 0$ form a subspace

**Given** $A \in \mathbb{R}^{m\times n}$ and $U = \left\{\, x \in \mathbb{R}^n \;\middle|\; Ax = \mathbf 0 \,\right\}$.

**AIM:** Prove that $U$ is a subspace of $\mathbb{R}^n$.

#### 1. Setting Up

**Meaning:** $U$ is every vector that $A$ sends to the zero vector.

**Containment:** each such $x$ lies in $\mathbb{R}^n$, so $U \subseteq \mathbb{R}^n$ — a **subset, not yet a subspace**.

#### 2. Non-Emptiness

**To prove:** $\mathbf 0 \in U$.

**Working:** any matrix times the zero vector is the zero vector: $A\,\mathbf 0 = \mathbf 0$.

**Thus** $\mathbf 0 \in U$.

#### 3. Closure Under Addition (Inner Operation)

**Assumptions:** $x,y \in U$, so $Ax = \mathbf 0$ and $Ay = \mathbf 0$.

**Working:**

$$
\begin{aligned}
A(x + y) &= Ax + Ay &&\text{(matrix multiplication distributes over addition)}\\
         &= \mathbf 0 + \mathbf 0 &&\text{(assumptions)}\\
         &= \mathbf 0
\end{aligned}
$$

**Thus** $x + y \in U$.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**Assumptions:** $x \in U$ (so $Ax = \mathbf 0$) and $\alpha \in \mathbb{R}$.

**Working:**

$$
\begin{aligned}
A(\alpha x) &= \alpha\,(Ax) &&\text{(a scalar moves outside the product)}\\
            &= \alpha\,\mathbf 0 &&\text{(assumption)}\\
            &= \mathbf 0
\end{aligned}
$$

**Thus** $\alpha x \in U$.

#### 5. Conclusion

**✓ ✓ ✓,** and the remaining rules are inherited from $\mathbb{R}^n$.

**Hence** $U = \operatorname{Null}(A)$ is a subspace of $\mathbb{R}^n$, **proven**.

---

### Example D2 — the solutions of $Ax = b$, $b \ne \mathbf 0$, do NOT form a subspace

**Given** $A \in \mathbb{R}^{m\times n}$, $b \ne \mathbf 0$, and $S = \left\{\, x \in \mathbb{R}^n \;\middle|\; Ax = b \,\right\}$ with at least one member.

**AIM:** Prove that $S$ is not a subspace of $\mathbb{R}^n$.

#### 1. Setting Up

**Meaning:** $S$ is every solution of the non-homogeneous system; $S \subseteq \mathbb{R}^n$.

#### 2. Non-Emptiness

**Test $\mathbf 0$:** $A\,\mathbf 0 = \mathbf 0 \ne b$, so $\mathbf 0 \notin S$ ✗

#### 3. Closure Under Addition (Inner Operation)

**Take $x, y \in S$:** then $Ax = b$ and $Ay = b$.

**Working:** $A(x + y) = Ax + Ay = b + b = 2b \ne b$, because $b \ne \mathbf 0$. So $x + y \notin S$ ✗

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**Take $x \in S$ and $\alpha = 2$:** $A(2x) = 2Ax = 2b \ne b$, so $2x \notin S$ ✗

#### 5. Conclusion

**✗ ✗ ✗**

**Hence** $S$ is **not** a subspace. It is a shifted copy of $\operatorname{Null}(A)$: $S = x_p + \operatorname{Null}(A)$ (Lecture 1, general solution).

---

### Example D3 — the intersection of two subspaces is a subspace

**Given** subspaces $U_1, U_2$ of a vector space $V$, and $U_1 \cap U_2 = \left\{\, x \in V \;\middle|\; x \in U_1 \text{ and } x \in U_2 \,\right\}$.

**AIM:** Prove that $U_1 \cap U_2$ is a subspace of $V$.

#### 1. Setting Up

**Meaning:** the vectors that belong to both subspaces at once.

**Containment:** each member lies in $U_1 \subseteq V$, so $U_1 \cap U_2 \subseteq V$ — a **subset, not yet a subspace**.

**What we may use:** $U_1$ and $U_2$ are each subspaces, so each contains $\mathbf 0$ and each is closed under both operations.

#### 2. Non-Emptiness

**Working:** $\mathbf 0 \in U_1$ and $\mathbf 0 \in U_2$, because both are subspaces.

**Thus** $\mathbf 0 \in U_1 \cap U_2$.

#### 3. Closure Under Addition (Inner Operation)

**Assumptions:** $x, y \in U_1 \cap U_2$, so $x, y \in U_1$ and $x, y \in U_2$.

**Working:**
- $x, y \in U_1$ and $U_1$ is closed under addition $\Rightarrow x + y \in U_1$.
- $x, y \in U_2$ and $U_2$ is closed under addition $\Rightarrow x + y \in U_2$.
**Thus** $x + y$ is in both, so $x + y \in U_1 \cap U_2$.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**Assumptions:** $x \in U_1 \cap U_2$ and $\alpha \in \mathbb{R}$.

**Working:** $U_1$ closed under scaling $\Rightarrow \alpha x \in U_1$; $U_2$ closed under scaling $\Rightarrow \alpha x \in U_2$.

**Thus** $\alpha x \in U_1 \cap U_2$.

#### 5. Conclusion

**✓ ✓ ✓,** remaining rules inherited from $V$.

**Hence** $U_1 \cap U_2$ is a subspace of $V$, **proven**. Example B4 found a basis of one such intersection.

---

### Example D4 — the sum of two subspaces is a subspace

**Given** subspaces $U_1, U_2$ of $V$ and

$$
U_1 + U_2 = \left\{\, p + q \;\middle|\; p \in U_1,\; q \in U_2 \,\right\}
$$

**AIM:** Prove that $U_1 + U_2$ is a subspace of $V$.

#### 1. Setting Up

**Meaning:** every vector you can make by adding one piece from $U_1$ to one piece from $U_2$.

**Containment:** $p, q \in V$ and $V$ is closed under addition, so $p + q \in V$. Thus $U_1 + U_2 \subseteq V$ — a **subset, not yet a subspace**.

#### 2. Non-Emptiness

**Working:** $\mathbf 0 \in U_1$ and $\mathbf 0 \in U_2$, so $\mathbf 0 = \mathbf 0 + \mathbf 0$ has the required form.

**Thus** $\mathbf 0 \in U_1 + U_2$.

#### 3. Closure Under Addition (Inner Operation)

**Assumptions:** $x, y \in U_1 + U_2$, so there are pieces with

$$
x = p_1 + q_1,
\qquad
y = p_2 + q_2,
\qquad
p_1, p_2 \in U_1,\;\; q_1, q_2 \in U_2
$$

**Working: regroup the pieces by subspace:**

$$
x + y = (p_1 + q_1) + (p_2 + q_2) = \underbrace{(p_1 + p_2)}_{\in\, U_1} + \underbrace{(q_1 + q_2)}_{\in\, U_2}
$$

$p_1 + p_2 \in U_1$ because $U_1$ is closed under addition; likewise $q_1 + q_2 \in U_2$.
**Thus** $x + y$ has the form "piece of $U_1$ + piece of $U_2$", so $x + y \in U_1 + U_2$.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**Assumptions:** $x = p_1 + q_1$ as above, and $\alpha \in \mathbb{R}$.

**Working:**

$$
\alpha x = \alpha(p_1 + q_1) = \underbrace{\alpha p_1}_{\in\, U_1} + \underbrace{\alpha q_1}_{\in\, U_2}
\qquad\text{(distributivity; each subspace is closed under scaling)}
$$

**Thus** $\alpha x \in U_1 + U_2$.

#### 5. Conclusion

**✓ ✓ ✓,** remaining rules inherited from $V$.

**Hence** $U_1 + U_2$ is a subspace of $V$, **proven**.

**Basis of a sum:** pool the spanning vectors of $U_1$ and $U_2$ as columns and use Method A. Dimension check: $\dim(U_1 + U_2) = \dim U_1 + \dim U_2 - \dim(U_1 \cap U_2)$.

---

## 10. Practice Questions — Proofs

**Q11. (4 marks)** Let $U_1$ be the $x_1$-axis and $U_2$ the $x_2$-axis in $\mathbb{R}^2$. Show that $U_1 \cup U_2$ is **not** a subspace of $\mathbb{R}^2$, although $U_1$ and $U_2$ are.
*Hint: take one vector from each axis and add them, as in the disproofs of Lecture 2.*

**Q12. (5 marks)** Fix $a = (1,2,-1)$. Prove that $U = \left\{\, x \in \mathbb{R}^3 \;\middle|\; \langle a, x\rangle = 0 \,\right\}$ (all vectors perpendicular to $a$) is a subspace of $\mathbb{R}^3$, and find its dimension.
*Hint: $\langle a,x\rangle = a^{\top}x$, so $U = \operatorname{Null}(a^{\top})$. Follow Example D1, then Example B1.*

**Q13. (6 marks)** Let $U_1 = \operatorname{span}\{(1,0,0)\}$ and $U_2 = \operatorname{span}\{(0,1,0)\}$ in $\mathbb{R}^3$.
(a) Prove that $U_1 + U_2$ is a subspace, following Example D4.
(b) Find a basis and the dimension of $U_1 + U_2$, and describe it geometrically.
(c) Check the dimension formula in 5c of Example D4.

---

## 11. Practice Questions — Short Theory (2 marks each)

**Q14.** State the two conditions for a set to be a basis of a vector space. Define dimension.

**Q15.** Why is a basis not unique? Give two different bases of $\mathbb{R}^2$.

**Q16.** Explain why independence of $x_1,\dots,x_m$ can be tested using only their coefficient vectors with respect to independent $b_1,\dots,b_k$.

**Q17.** In the pivot-column method, why must the basis use the **original** vectors, not the columns of the echelon form? Why is the row-space rule different?

**Q18.** In $\dim U = n - m$, what exactly is $m$? Give an example where three equations give $m = 2$.

**Q19.** State the Rank–Nullity theorem and explain each term in one line.

---

## 12. Exam Traps

1. Taking column-space basis vectors from the **echelon form** instead of the original vectors in the pivot columns (Example A4, 6b).
2. Taking row-space basis vectors from the **original** rows without reducing. Use the non-zero REF rows.
3. Forgetting zero entries when building coefficient vectors (a missing $b_3$ means weight $0$).
4. Counting written equations instead of independent ones in $\dim = n - m$ (Example B3).
5. Claiming the solution set of $Ax = b$ is a subspace when $b \ne \mathbf 0$; the zero vector is not in it.
6. Setting both free variables to $1$ at the same time when building a null-space basis.
7. Mixing up the dimension of a span (number of pivots) with the number of given vectors.
8. In intersection and sum proofs, forgetting to say **which** subspace property justifies each membership.

---

**Recall chain:** columns into a matrix → REF → pivot columns → original pivot vectors form the basis → dimension = pivots → Rank–Nullity; for equations: $Ax = \mathbf 0$ → RREF → free variables → one vector each → $\dim = n - m$

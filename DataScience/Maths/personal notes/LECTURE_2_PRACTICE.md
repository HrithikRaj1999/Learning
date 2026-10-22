# Lecture 2 - Exam Practice

**Course:** DSEZC411 Essential Mathematics for Data Science | **Session:** 2

**Sources:** Lecture 2, Lecture 2a, Assignment 1 (Q1), and Quiz 1 patterns.

**Status:** Practice, not guaranteed exam questions. Practice marks are estimates.

> **Fixed routine:** Same letters. Same five headings within each question type. Change only the working.

| Topic | Solved examples | Your practice |
| :--- | :--- | :--- |
| Linear independence | A1-A5 | Q1-Q4 |
| Subspaces | B1-B5 | Q5-Q9 |
| Span | C1-C4 | Q10-Q13 |
| Short theory | Formula sheet | Q14-Q19 |

---

## 1. Fixed Notation

| Write | Meaning |
| :--- | :--- |
| $x_1,x_2,x_3,x_4$ | Given whole vectors, never coordinates |
| $x,y$ | Vectors being tested |
| $a,b,c,d,e,f$ | Real numbers: coefficients or coordinates |
| $t$ | Any real scalar in the scalar-multiplication test |
| $U\subseteq V$ | Every member of $U$ belongs to the vector space $V$ |
| $x\in U$, $x\notin U$ | $x$ belongs, or does not belong, to $U$ |
| $\mathbb R^n$, $\mathbf0$, $\varnothing$ | Real vectors with $n$ entries; zero vector; empty set |
| $A=[x_1\ x_2\ \cdots]$, $R_i$ | Vectors as matrix columns; row $i$ |

A **scalar** is a real number. A **coefficient** multiplies a vector.

---

## 2. Formula Sheet

### Linear Combination And Span

A linear combination multiplies vectors by real numbers, then adds them.

$$
x=a x_1+b x_2,\qquad a,b\in\mathbb R.
$$

The **span** contains all such combinations:

$$
U=\operatorname{span}\{x_1,x_2\}
 =\{a x_1+b x_2:a,b\in\mathbb R\}.
$$

For more vectors, add more terms. A span is always a subspace.

### Linear Independence

Start with

$$
a x_1+b x_2+c x_3=\mathbf0.
$$

| Solution | Conclusion |
| :--- | :--- |
| Only $a=b=c=0$ | Linearly independent; only the trivial combination |
| At least one non-zero coefficient works | Linearly dependent; a non-trivial combination exists |

**Row echelon form:** leading non-zero entries move right; entries below them are zero.

**Pivot:** a leading non-zero entry. **Rank:** number of pivots.

**Basic coefficients:** pivot columns. **Free coefficients:** non-pivot columns; choose their values.

**Nullity:** number of free coefficients.

$$
\operatorname{rank}(A)+\operatorname{nullity}(A)=\text{number of columns}.
$$

| Matrix or vector clue | Conclusion |
| :--- | :--- |
| Every column has a pivot | Independent |
| Some column has no pivot | Dependent |
| One given vector is $\mathbf0$ | Dependent |
| More than $n$ vectors in $\mathbb R^n$ | Dependent |

For a square matrix, $\det A=0$ also means dependence.

### Subspace Test

A **subspace** is a subset that remains a vector space under the same operations.

For $U\subseteq V$, check:

| Condition | Write |
| :--- | :--- |
| Non-emptiness | $\mathbf0\in U\Rightarrow U\ne\varnothing$ |
| Closure under addition (inner operation) | $x,y\in U\Rightarrow x+y\in U$ |
| Closure under scalar multiplication (outer operation) | $x\in U,\ t\in\mathbb R\Rightarrow tx\in U$ |

**Closure** means the result stays in $U$. The remaining rules are inherited from $V$.

> Prove with arbitrary letters. Disprove with one counterexample: inputs inside, result outside.
>
> Missing $\mathbf0$ disproves a subspace; it does **not** mean the set is empty.

### Abelian Group

For addition, $(G,+)$ is an **Abelian group** when these hold for all $x,y,z\in G$:

| Property | Write |
| :--- | :--- |
| Closure | $x+y\in G$ |
| Associativity | $(x+y)+z=x+(y+z)$ |
| Identity (neutral element) | $0\in G$, $x+0=0+x=x$ |
| Inverse | For each $x$, $-x\in G$ and $x+(-x)=(-x)+x=0$ |
| Commutativity | $x+y=y+x$ |

Integers under addition form an Abelian group. Non-negative integers lack negative inverses.

### Vector Space

A real **vector space** has an Abelian addition group and closed scalar multiplication.

For all $x,y\in V$ and $a,b\in\mathbb R$:

$$
\begin{aligned}
a(x+y)&=ax+ay &&\text{(distributivity)}\\
(a+b)x&=ax+bx &&\text{(distributivity)}\\
a(bx)&=(ab)x &&\text{(associativity)}\\
1x&=x &&\text{(identity)}.
\end{aligned}
$$

---

## 3. Solved Examples - Linear Independence

> **Routine A:** Setting Up → Row Reduction → Solve → Check → Conclusion.

### Example A1 - Dependent Vectors

**Given**

$$
x_1 = \begin{bmatrix} 1\\ 2\\ 1\end{bmatrix},
\qquad
x_2 = \begin{bmatrix} 2\\ 1\\ 3\end{bmatrix},
\qquad
x_3 = \begin{bmatrix} 4\\ 5\\ 5\end{bmatrix}
$$

**AIM:** Test linear independence and find any dependency.

#### 1. Setting Up

Let $a,b,c\in\mathbb R$ and $a x_1+b x_2+c x_3=\mathbf0$.

$$
A=[x_1\ x_2\ x_3]
 =\begin{bmatrix}1&2&4\\2&1&5\\1&3&5\end{bmatrix}.
$$

#### 2. Row Reduction

$$
R_2\leftarrow R_2-2R_1,\qquad R_3\leftarrow R_3-R_1
$$

$$
\begin{bmatrix}1&2&4\\0&-3&-3\\0&1&1\end{bmatrix}
$$

$$
R_2\leftrightarrow R_3,\qquad R_3\leftarrow R_3+3R_2
$$

$$
\begin{bmatrix}1&2&4\\0&1&1\\0&0&0\end{bmatrix}
$$

#### 3. Solve

Basic: $a,b$. Free: $c$.

$$
\begin{aligned}
b+c&=0 &&\Rightarrow b=-c,\\
a+2b+4c&=0 &&\Rightarrow a=-2c.
\end{aligned}
$$

Choose $c=-1$. Then $a=2$, $b=1$, so $2x_1+x_2-x_3=\mathbf0$.

#### 4. Check

$$
2x_1+x_2
=\begin{bmatrix}2+2\\4+1\\2+3\end{bmatrix}
=\begin{bmatrix}4\\5\\5\end{bmatrix}=x_3.
$$

Rank $=2$; nullity $=1$; $2+1=3$ columns.

#### 5. Conclusion

A non-trivial combination gives $\mathbf0$.

$$
\boxed{\text{Hence: linearly dependent.}}
\qquad x_3=2x_1+x_2.
$$

---

### Example A2 - Independent Vectors

**Given**

$$
x_1 = \begin{bmatrix} 1\\ 0\\ 1\end{bmatrix},
\qquad
x_2 = \begin{bmatrix} 0\\ 1\\ 1\end{bmatrix},
\qquad
x_3 = \begin{bmatrix} 1\\ 1\\ 0\end{bmatrix}
$$

**AIM:** Test linear independence.

#### 1. Setting Up

Let $a,b,c\in\mathbb R$ and $a x_1+b x_2+c x_3=\mathbf0$.

$$
A=\begin{bmatrix}1&0&1\\0&1&1\\1&1&0\end{bmatrix}.
$$

#### 2. Row Reduction

$$
R_3\leftarrow R_3-R_1,\qquad R_3\leftarrow R_3-R_2
$$

$$
\begin{bmatrix}1&0&1\\0&1&1\\0&0&-2\end{bmatrix}
$$

#### 3. Solve

Basic: $a,b,c$. No free coefficient.

$$
\begin{aligned}
-2c=0&\Rightarrow c=0,\\
b+c=0&\Rightarrow b=0,\\
a+c=0&\Rightarrow a=0.
\end{aligned}
$$

#### 4. Check

Every column has a pivot. Rank $=3$; nullity $=0$; $3+0=3$ columns.

#### 5. Conclusion

Only the trivial combination gives $\mathbf0$.

$$
\boxed{\text{Hence: linearly independent.}}
$$

---

### Example A3 - Find The Parameter

**Given**

$$
x_1 = \begin{bmatrix} 1\\ 2\\ 1\end{bmatrix},
\qquad
x_2 = \begin{bmatrix} 0\\ 1\\ 1\end{bmatrix},
\qquad
x_3 = \begin{bmatrix} 2\\ k\\ 3\end{bmatrix}
$$

**AIM:** Find the real number $k$ giving dependence, and find the dependency.

#### 1. Setting Up

Let $a,b,c\in\mathbb R$ and $a x_1+b x_2+c x_3=\mathbf0$.

$$
A=\begin{bmatrix}1&0&2\\2&1&k\\1&1&3\end{bmatrix}.
$$

#### 2. Row Reduction

$$
R_2\leftarrow R_2-2R_1,\qquad R_3\leftarrow R_3-R_1
$$

$$
\begin{bmatrix}1&0&2\\0&1&k-4\\0&1&1\end{bmatrix}
$$

$$
R_3\leftarrow R_3-R_2
$$

$$
\begin{bmatrix}1&0&2\\0&1&k-4\\0&0&5-k\end{bmatrix}
$$

#### 3. Solve

Dependence requires a missing pivot:

$$
5-k=0\Rightarrow k=5.
$$

At $k=5$, basic coefficients: $a,b$; free coefficient: $c$.

$$
a=-2c,\qquad b=-c.
$$

Choose $c=-1$. Then $a=2$, $b=1$.

#### 4. Check

$$
2x_1+x_2
=\begin{bmatrix}2+0\\4+1\\2+1\end{bmatrix}
=\begin{bmatrix}2\\5\\3\end{bmatrix}=x_3\quad(k=5).
$$

At $k=5$: rank $=2$; nullity $=1$; $2+1=3$ columns.

#### 5. Conclusion

$$
\boxed{\text{Hence: dependent exactly when }k=5.}
$$

Then $x_3=2x_1+x_2$. For $k\ne5$, every column pivots: the vectors are independent.

---

### Example A4 - Four Vectors In $\mathbb R^3$

**Given**

$$
x_1 = \begin{bmatrix} 1\\ 0\\ 1\end{bmatrix},\quad
x_2 = \begin{bmatrix} 0\\ 1\\ 1\end{bmatrix},\quad
x_3 = \begin{bmatrix} 1\\ 1\\ 0\end{bmatrix},\quad
x_4 = \begin{bmatrix} 2\\ 3\\ 3\end{bmatrix}
$$

**AIM:** Test dependence and express $x_4$ using $x_1,x_2,x_3$.

#### 1. Setting Up

Let $a,b,c,d\in\mathbb R$ and $a x_1+b x_2+c x_3+d x_4=\mathbf0$.

$$
A=\begin{bmatrix}1&0&1&2\\0&1&1&3\\1&1&0&3\end{bmatrix}.
$$

#### 2. Row Reduction

$$
R_3\leftarrow R_3-R_1,\qquad R_3\leftarrow R_3-R_2
$$

$$
\begin{bmatrix}1&0&1&2\\0&1&1&3\\0&0&-2&-2\end{bmatrix}
$$

#### 3. Solve

Basic: $a,b,c$. Free: $d$.

$$
\begin{aligned}
-2c-2d=0&\Rightarrow c=-d,\\
b+c+3d=0&\Rightarrow b=-2d,\\
a+c+2d=0&\Rightarrow a=-d.
\end{aligned}
$$

Choose $d=-1$. Then $a=1$, $b=2$, $c=1$.

#### 4. Check

$$
x_1+2x_2+x_3
=\begin{bmatrix}1+0+1\\0+2+1\\1+2+0\end{bmatrix}
=\begin{bmatrix}2\\3\\3\end{bmatrix}=x_4.
$$

Rank $=3$; nullity $=1$; $3+1=4$ columns.

#### 5. Conclusion

A non-trivial combination gives $\mathbf0$.

$$
\boxed{\text{Hence: linearly dependent.}}
$$

$$
x_4=x_1+2x_2+x_3.
$$

---

### Example A5 - Three Vectors In $\mathbb R^4$

**Given**

$$
x_1 = \begin{bmatrix} 1\\ 1\\ 0\\ 0\end{bmatrix},\quad
x_2 = \begin{bmatrix} 0\\ 1\\ 1\\ 0\end{bmatrix},\quad
x_3 = \begin{bmatrix} 0\\ 0\\ 1\\ 1\end{bmatrix}
$$

**AIM:** Test linear independence.

#### 1. Setting Up

Let $a,b,c\in\mathbb R$ and $a x_1+b x_2+c x_3=\mathbf0$.

$$
A=\begin{bmatrix}1&0&0\\1&1&0\\0&1&1\\0&0&1\end{bmatrix}.
$$

#### 2. Row Reduction

$$
\begin{aligned}
R_2&\leftarrow R_2-R_1,\\
R_3&\leftarrow R_3-R_2,\\
R_4&\leftarrow R_4-R_3.
\end{aligned}
$$

$$
\begin{bmatrix}1&0&0\\0&1&0\\0&0&1\\0&0&0\end{bmatrix}
$$

#### 3. Solve

Basic: $a,b,c$. No free coefficient.

$$
a=0,\qquad b=0,\qquad c=0.
$$

#### 4. Check

Every column has a pivot, despite the zero row.

Rank $=3$; nullity $=0$; $3+0=3$ columns.

#### 5. Conclusion

Only the trivial combination gives $\mathbf0$.

$$
\boxed{\text{Hence: linearly independent.}}
$$

---

## 4. Practice Questions - Linear Independence

> Use Routine A for every question. Answers are left for your practice.

**Q1. (4 marks)** Decide whether these vectors are linearly independent. If dependent, write one as a combination of the others.

$$
x_1 = \begin{bmatrix} 1\\ 1\\ 2\end{bmatrix},
\qquad
x_2 = \begin{bmatrix} 2\\ 3\\ 1\end{bmatrix},
\qquad
x_3 = \begin{bmatrix} 4\\ 5\\ 5\end{bmatrix}
$$

**Pattern:** A1.

**Q2. (4 marks)** Find $k$ such that the vectors are linearly dependent:

$$
x_1 = \begin{bmatrix} 1\\ 1\\ 0\end{bmatrix},
\qquad
x_2 = \begin{bmatrix} 1\\ k\\ 1\end{bmatrix},
\qquad
x_3 = \begin{bmatrix} 0\\ 1\\ 1\end{bmatrix}
$$

**Pattern:** A3. Swap rows if needed; avoid dividing by an expression containing $k$.

**Q3. (4 marks)** Show that the four vectors are dependent and write $x_4$ as a combination of $x_1, x_2, x_3$:

$$
x_1 = \begin{bmatrix} 1\\ 0\\ 0\end{bmatrix},\quad
x_2 = \begin{bmatrix} 1\\ 1\\ 0\end{bmatrix},\quad
x_3 = \begin{bmatrix} 1\\ 1\\ 1\end{bmatrix},\quad
x_4 = \begin{bmatrix} 3\\ 2\\ 1\end{bmatrix}
$$

**Pattern:** A4. The matrix is already in row echelon form.

**Q4. (3 marks)** Decide whether these vectors in $\mathbb{R}^4$ are linearly independent:

$$
x_1 = \begin{bmatrix} 1\\ 0\\ 1\\ 0\end{bmatrix},\quad
x_2 = \begin{bmatrix} 0\\ 1\\ 0\\ 1\end{bmatrix},\quad
x_3 = \begin{bmatrix} 1\\ 1\\ 1\\ 1\end{bmatrix}
$$

**Pattern:** A5. Count pivot columns, not zero rows.

---

## 5. Solved Examples - Subspaces

> **Routine B:** Setting Up → Non-Emptiness → Addition → Scalar Multiplication → Conclusion.
>
> Use the formal headings below. One failed condition is enough to disprove a subspace.

### Example B1 - Plane Through The Origin

**Given**

$$
U=\left\{\begin{bmatrix}a\\b\\c\end{bmatrix}\in\mathbb R^3:a+2b-c=0\right\}.
$$

**AIM:** Prove that $U$ is a subspace of $\mathbb R^3$.

#### 1. Setting Up

The third coordinate equals the first plus twice the second:

$$
c=a+2b,\qquad
x=\begin{bmatrix}a\\b\\a+2b\end{bmatrix}\in\mathbb R^3.
$$

Thus $U\subseteq\mathbb R^3$: a subset, not yet a subspace.

#### 2. Non-Emptiness

**To prove:** $\mathbf0\in U$.

**Working:** Choose $a=b=c=0$.

$$
0+2(0)-0=0.
$$

**Thus:** $\mathbf0\in U$, so $U\ne\varnothing$.

#### 3. Closure Under Addition (Inner Operation)

**To prove:** $x+y\in U$.

**Assumptions:** Let $x,y\in U$:

$$
x=\begin{bmatrix}a\\b\\c\end{bmatrix},\qquad
y=\begin{bmatrix}d\\e\\f\end{bmatrix},
$$

$$
a+2b-c=0,\qquad d+2e-f=0.
$$

**Working**

$$
x+y=\begin{bmatrix}a+d\\b+e\\c+f\end{bmatrix}.
$$

Test the defining equation; both grouped terms are zero by the assumptions:

$$
\begin{aligned}
&(a+d)+2(b+e)-(c+f)\\
&\quad=(a+2b-c)+(d+2e-f)\\
&\quad=0+0=0.
\end{aligned}
$$

**Thus:** $x+y\in U$.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**To prove:** $tx\in U$.

**Assumptions:** Let $x\in U$ and $t\in\mathbb R$. Then $a+2b-c=0$.

**Working**

$$
tx=\begin{bmatrix}ta\\tb\\tc\end{bmatrix}.
$$

$$
\begin{aligned}
ta+2tb-tc&=t(a+2b-c)\\
       &=t\cdot0=0.
\end{aligned}
$$

**Thus:** $tx\in U$.

#### 5. Conclusion

All three conditions hold. The remaining vector-space rules are inherited from $\mathbb R^3$.

$$
\boxed{\text{Hence }U\text{ is a subspace of }\mathbb R^3.}
$$

---

### Example B2 - Span Of Two Vectors

**Given**

$$
x_1=\begin{bmatrix}1\\0\\2\end{bmatrix},
\qquad
x_2=\begin{bmatrix}0\\1\\-1\end{bmatrix}.
$$

$$
U=\{a x_1+b x_2:a,b\in\mathbb R\}.
$$

**AIM:** Prove that $U$ is a subspace of $\mathbb R^3$.

#### 1. Setting Up

$U$ contains all linear combinations of the fixed vectors $x_1,x_2$.

$$
\begin{aligned}
x&=a x_1+b x_2\\
 &=a\begin{bmatrix}1\\0\\2\end{bmatrix}
+b\begin{bmatrix}0\\1\\-1\end{bmatrix}\\
 &=\begin{bmatrix}a\\b\\2a-b\end{bmatrix}\in\mathbb R^3.
\end{aligned}
$$

Thus $U\subseteq\mathbb R^3$: a subset, not yet a subspace.

#### 2. Non-Emptiness

**To prove:** $\mathbf0\in U$.

**Working:** Choose $a=b=0$.

$$
0x_1+0x_2=\mathbf0\in U.
$$

**Thus:** $U\ne\varnothing$.

#### 3. Closure Under Addition (Inner Operation)

**To prove:** $x+y\in U$.

**Assumptions:** Let $x,y\in U$, with $a,b,c,d\in\mathbb R$:

$$
x=a x_1+b x_2,\qquad y=c x_1+d x_2.
$$

**Working**

$$
\begin{aligned}
x+y&=(a x_1+b x_2)+(c x_1+d x_2)\\
 &=(a x_1+c x_1)+(b x_2+d x_2)\\
 &=(a+c)x_1+(b+d)x_2.
\end{aligned}
$$

Since $a+c,b+d\in\mathbb R$, this is a linear combination of $x_1,x_2$.

**Thus:** $x+y\in U$.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**To prove:** $tx\in U$.

**Assumptions:** Let $x=a x_1+b x_2\in U$ and $t\in\mathbb R$.

**Working**

$$
\begin{aligned}
tx&=t(a x_1+b x_2)\\
&=ta x_1+tb x_2\\
&=(ta)x_1+(tb)x_2.
\end{aligned}
$$

Since $ta,tb\in\mathbb R$, this is a linear combination of $x_1,x_2$.

**Thus:** $tx\in U$.

#### 5. Conclusion

All three conditions hold. The remaining vector-space rules are inherited from $\mathbb R^3$.

$$
\boxed{\text{Hence }U\text{ is a subspace of }\mathbb R^3.}
$$

---

### Example B3 - Scalar Multiplication Fails

**Given**

$$
U=\left\{\begin{bmatrix}a\\b\end{bmatrix}\in\mathbb R^2:a\ge0\right\}.
$$

**AIM:** Decide whether $U$ is a subspace of $\mathbb R^2$.

#### 1. Setting Up

The first coordinate is non-negative. Thus $U\subseteq\mathbb R^2$, not yet a subspace.

#### 2. Non-Emptiness

**To prove:** $\mathbf0\in U$.

**Working:** The first coordinate of $\mathbf0$ is $0\ge0$.

**Thus:** $\mathbf0\in U$, so $U\ne\varnothing$.

#### 3. Closure Under Addition (Inner Operation)

**To prove:** $x+y\in U$.

**Assumptions:** Let $x,y\in U$:

$$
x=\begin{bmatrix}a\\b\end{bmatrix},\qquad
y=\begin{bmatrix}c\\d\end{bmatrix},\qquad a,c\ge0.
$$

**Working**

$$
x+y=\begin{bmatrix}a+c\\b+d\end{bmatrix},\qquad a+c\ge0.
$$

**Thus:** $x+y\in U$.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**To prove:** $tx\in U$ for every real $t$.

**Assumptions:** Choose $x=\begin{bmatrix}1\\0\end{bmatrix}\in U$ and $t=-1$.

**Working**

$$
tx=\begin{bmatrix}-1\\0\end{bmatrix},\qquad -1<0.
$$

**Thus:** $tx\notin U$; scalar multiplication fails.

#### 5. Conclusion

Zero vector and addition pass; scalar multiplication fails.

$$
\boxed{\text{Hence }U\text{ is not a subspace of }\mathbb R^2.}
$$

---

### Example B4 - Zero Vector Is Missing

**Given**

$$
U=\left\{\begin{bmatrix}a\\b\end{bmatrix}\in\mathbb R^2:a+b=1\right\}.
$$

**AIM:** Decide whether $U$ is a subspace of $\mathbb R^2$.

#### 1. Setting Up

The coordinates sum to $1$. Thus $U\subseteq\mathbb R^2$, not yet a subspace.

#### 2. Non-Emptiness

**To prove:** $\mathbf0\in U$.

**Working**

$$
0+0=0\ne1.
$$

**Thus:** $\mathbf0\notin U$. This already disproves a subspace.

$U$ is not empty: $\begin{bmatrix}1\\0\end{bmatrix}\in U$.

#### 3. Closure Under Addition (Inner Operation)

**To prove:** $x+y\in U$.

**Assumptions:** Choose $x=\begin{bmatrix}1\\0\end{bmatrix}$ and $y=\begin{bmatrix}0\\1\end{bmatrix}$; both belong to $U$.

**Working**

$$
x+y=\begin{bmatrix}1\\1\end{bmatrix},\qquad 1+1=2\ne1.
$$

**Thus:** $x+y\notin U$; addition fails.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**To prove:** $tx\in U$ for every real $t$.

**Assumptions:** Choose $x=\begin{bmatrix}1\\0\end{bmatrix}\in U$ and $t=2$.

**Working**

$$
tx=\begin{bmatrix}2\\0\end{bmatrix},\qquad 2+0=2\ne1.
$$

**Thus:** $tx\notin U$; scalar multiplication fails.

#### 5. Conclusion

The zero vector is missing; both closure conditions also fail.

$$
\boxed{\text{Hence }U\text{ is not a subspace of }\mathbb R^2.}
$$

---

### Example B5 - Addition Fails

**Given**

$$
U=\left\{\begin{bmatrix}a\\b\end{bmatrix}\in\mathbb R^2:b=a^2\right\}.
$$

**AIM:** Decide whether $U$ is a subspace of $\mathbb R^2$.

#### 1. Setting Up

The second coordinate equals the first squared. Thus $U\subseteq\mathbb R^2$, not yet a subspace.

#### 2. Non-Emptiness

**To prove:** $\mathbf0\in U$.

**Working:** $0=0^2$.

**Thus:** $\mathbf0\in U$, so $U\ne\varnothing$.

#### 3. Closure Under Addition (Inner Operation)

**To prove:** $x+y\in U$.

**Assumptions:** Choose

$$
x=\begin{bmatrix}1\\1\end{bmatrix},\qquad
y=\begin{bmatrix}-1\\1\end{bmatrix}.
$$

Both belong to $U$, since $1=1^2=(-1)^2$.

**Working**

$$
x+y=\begin{bmatrix}0\\2\end{bmatrix},\qquad 2\ne0^2.
$$

**Thus:** $x+y\notin U$; addition fails.

#### 4. Closure Under Scalar Multiplication (Outer Operation)

**To prove:** $tx\in U$ for every real $t$.

**Assumptions:** Choose $x=\begin{bmatrix}1\\1\end{bmatrix}\in U$ and $t=2$.

**Working**

$$
tx=\begin{bmatrix}2\\2\end{bmatrix},\qquad 2\ne2^2.
$$

**Thus:** $tx\notin U$; scalar multiplication fails.

#### 5. Conclusion

The zero vector belongs to $U$, but both closure conditions fail.

$$
\boxed{\text{Hence }U\text{ is not a subspace of }\mathbb R^2.}
$$

---

## 6. Practice Questions - Subspaces

> Use Routine B. For a disproof, one valid counterexample is enough.

**Q5. (5 marks)** Prove that

$$
U=\left\{\begin{bmatrix}a\\b\\c\end{bmatrix}\in\mathbb R^3:2a-b+3c=0\right\}
$$

is a subspace of $\mathbb{R}^3$.

**Pattern:** B1.

**Q6. (5 marks)** Let $x_1=(1,1,0)$ and $x_2=(0,1,2)$.

Prove that $U=\operatorname{span}\{x_1,x_2\}$ is a subspace of $\mathbb R^3$.

**Pattern:** B2. Use $x=a x_1+b x_2$ and $y=c x_1+d x_2$.

**Q7. (4 marks)** Show that

$$
U=\left\{\begin{bmatrix}a\\b\end{bmatrix}\in\mathbb R^2:ab=0\right\}
$$

is **not** a subspace of $\mathbb R^2$. Identify the failed condition with a counterexample.

**Pattern:** B5.

**Q8. (5 marks)** Decide whether

$$
U=\left\{\begin{bmatrix}a\\b\\c\end{bmatrix}\in\mathbb R^3:a=2b,\ c=0\right\}
$$

is a subspace of $\mathbb R^3$. Prove or disprove.

**Pattern:** B1. Test both defining equations.

**Q9. (5 marks)** Prove that the symmetric $2\times2$ real matrices form a subspace:

$$
U=\left\{\begin{bmatrix}a&b\\b&c\end{bmatrix}:a,b,c\in\mathbb R\right\}
\subseteq\mathbb R^{2\times2}.
$$

**Symmetric:** entries match across the main diagonal.

**Pattern:** B1. Let $x,y$ be matrices; check that $x+y$ and $tx$ retain this form.

---

## 7. Solved Examples - Span

> **Routine C:** Setting Up → Equations → Solve → Check → Conclusion.

### Example C1 — the vector is in the span

**Given**

$$
x_1 = \begin{bmatrix} 1\\ 2\\ 1\end{bmatrix},
\qquad
x_2 = \begin{bmatrix} 2\\ 1\\ 3\end{bmatrix},
\qquad
x = \begin{bmatrix} 7\\ 5\\ 10\end{bmatrix}
$$

**AIM:** Decide whether $x \in \operatorname{span}\{x_1,x_2\}$; if so, write $x$ as a linear combination.

#### 1. Setting Up

**By definition of span,** $x \in \operatorname{span}\{x_1,x_2\}$ means real scalars $a, b$ exist with:

$$
x = a\,x_1 + b\,x_2
$$

#### 2. Equations

$$
a\begin{bmatrix} 1\\ 2\\ 1\end{bmatrix} + b\begin{bmatrix} 2\\ 1\\ 3\end{bmatrix}
= \begin{bmatrix} a + 2b\\ 2a + b\\ a + 3b\end{bmatrix}
$$

$$
\begin{aligned}
a + 2b &= 7 &&\text{(1)}\\
2a + b &= 5 &&\text{(2)}\\
a + 3b &= 10 &&\text{(3)}
\end{aligned}
$$

#### 3. Solve

**Equation (1):** $a = 7 - 2b$.

**Equation (2):**

$$
2(7 - 2b) + b = 5
\;\Longrightarrow\;
14 - 3b = 5
\;\Longrightarrow\;
b = 3
$$

**Back-substitute:** $a = 7 - 2(3) = 1$.

#### 4. Check

**Equation (3) was not used,** so it decides membership:

$$
a + 3b = 1 + 3(3) = 10 \;✓
$$

$$
1\begin{bmatrix} 1\\ 2\\ 1\end{bmatrix} + 3\begin{bmatrix} 2\\ 1\\ 3\end{bmatrix}
= \begin{bmatrix} 1 + 6\\ 2 + 3\\ 1 + 9\end{bmatrix}
= \begin{bmatrix} 7\\ 5\\ 10\end{bmatrix} = x \;✓
$$

#### 5. Conclusion

**Hence** $x \in \operatorname{span}\{x_1,x_2\}$, with $x = 1\cdot x_1 + 3\cdot x_2$.

---

### Example C2 — the vector is NOT in the span

**Given** the same $x_1 = (1,2,1)$, $x_2 = (2,1,3)$ and $x = (1,1,1)$.

**AIM:** Decide whether $x \in \operatorname{span}\{x_1,x_2\}$.

#### 1. Setting Up

$$
x = a\,x_1 + b\,x_2,
\qquad a,b \in \mathbb{R}
$$

#### 2. Equations

$$
\begin{aligned}
a + 2b &= 1 &&\text{(1)}\\
2a + b &= 1 &&\text{(2)}\\
a + 3b &= 1 &&\text{(3)}
\end{aligned}
$$

#### 3. Solve

**Equation (1):** $a = 1 - 2b$.

**Equation (2):**

$$
2(1 - 2b) + b = 1
\;\Longrightarrow\;
2 - 3b = 1
\;\Longrightarrow\;
b = \tfrac13
$$

**Back-substitute:** $a = 1 - \tfrac23 = \tfrac13$.

#### 4. Check

**Equation (3):**

$$
a + 3b = \tfrac13 + 1 = \tfrac43 \ne 1 \;✗
$$

**The only weights that satisfy (1) and (2) break (3),** so no weights satisfy all three. The system is inconsistent.

**Rank view:** as columns, $[\,x_1\;x_2\,]$ has rank $2$ but $[\,x_1\;x_2\mid x\,]$ has rank $3$, which confirms inconsistency ✓

#### 5. Conclusion

**Hence** $x \notin \operatorname{span}\{x_1,x_2\}$. Geometrically, $x$ is off the plane through the origin spanned by $x_1$ and $x_2$.

---

### Example C3 — which vectors lie in a span? (quiz style)

**Given** $x_1 = (1,0,1)$ and $x_2 = (0,1,1)$, and the options

$$
\text{(a) } (2,-1,1)
\qquad
\text{(b) } (1,1,1)
\qquad
\text{(c) } (3,2,5)
\qquad
\text{(d) } (1,2,4)
$$

**AIM:** Decide which options lie in $\operatorname{span}\{x_1,x_2\}$.

#### 1. Setting Up

**A general member of the span** is $a x_1 + b x_2$ with $a, b \in \mathbb{R}$.

#### 2. Equations

$$
a\begin{bmatrix} 1\\ 0\\ 1\end{bmatrix} + b\begin{bmatrix} 0\\ 1\\ 1\end{bmatrix}
= \begin{bmatrix} a\\ b\\ a + b\end{bmatrix}
$$

#### 3. Solve

**The first coordinate is $a$, the second is $b$,** and the third is their sum. So a vector $(a,b,c)$ is in the span exactly when

$$
c = a + b
$$

#### 4. Check

| Option | $a + b$ | $c$ | In span? |
| :--- | :--- | :--- | :--- |
| (a) $(2,-1,1)$ | $2 - 1 = 1$ | $1$ | ✓ |
| (b) $(1,1,1)$ | $1 + 1 = 2$ | $1$ | ✗ |
| (c) $(3,2,5)$ | $3 + 2 = 5$ | $5$ | ✓ |
| (d) $(1,2,4)$ | $1 + 2 = 3$ | $4$ | ✗ |

**For (c), $a = 3$, $b = 2$:** $3(1,0,1) + 2(0,1,1) = (3,2,5)$ ✓

#### 5. Conclusion

**Hence** (a) and (c) lie in the span; (b) and (d) do not. The span is the plane $c = a + b$ through the origin.

---

### Example C4 — find the coefficients in $\mathbb{R}^2$ (quiz style)

**Given** $x_1 = (1,2)$, $x_2 = (3,1)$ and the target $x = (7,4)$.

**AIM:** Find $a, b$ with $a\,x_1 + b\,x_2 = x$.

#### 1. Setting Up

$$
a\begin{bmatrix} 1\\ 2\end{bmatrix} + b\begin{bmatrix} 3\\ 1\end{bmatrix} = \begin{bmatrix} 7\\ 4\end{bmatrix}
$$

#### 2. Equations

$$
\begin{aligned}
a + 3b &= 7 &&\text{(1)}\\
2a + b &= 4 &&\text{(2)}
\end{aligned}
$$

#### 3. Solve

**Equation (1):** $a = 7 - 3b$.

**Equation (2):**

$$
2(7 - 3b) + b = 4
\;\Longrightarrow\;
14 - 5b = 4
\;\Longrightarrow\;
b = 2
$$

**Back-substitute:** $a = 7 - 6 = 1$.

#### 4. Check

$$
1\begin{bmatrix} 1\\ 2\end{bmatrix} + 2\begin{bmatrix} 3\\ 1\end{bmatrix} = \begin{bmatrix} 1 + 6\\ 2 + 2\end{bmatrix} = \begin{bmatrix} 7\\ 4\end{bmatrix} \;✓
$$

#### 5. Conclusion

**Hence** $a = 1$, $b = 2$.

---

## 8. Practice Questions — Span

**Q10. (4 marks)** Is

$$
x = \begin{bmatrix} 3\\ 8\\ 7\end{bmatrix}
\quad\text{in}\quad
\operatorname{span}\left\{ \begin{bmatrix} 1\\ 2\\ 1\end{bmatrix},\; \begin{bmatrix} 0\\ 1\\ 2\end{bmatrix} \right\}?
$$

If yes, give the coefficients and verify them.
*Hint: as in Example C1.*

**Q11. (4 marks)** Is $x = (1,0,0)$ in $\operatorname{span}\{(1,1,1),\,(1,2,3)\}$? Justify.
*Hint: as in Example C2; the third equation decides.*

**Q12. (3 marks)** Which of these lie in $\operatorname{span}\{(1,1,0),\,(0,1,1)\}$?
(a) $(2,3,1)$ (b) $(1,1,1)$ (c) $(0,2,2)$ (d) $(3,1,2)$
*Hint: find the rule first, as in Example C3.*

**Q13. (2 marks)** Find $a, b$ with $a(2,1) + b(1,3) = (5,5)$.
*Hint: as in Example C4.*

---

## 9. Practice Questions — Short Theory (2 marks each)

**Q14.** Define a linear combination, and explain the difference between a trivial and a non-trivial combination.

**Q15.** State the definition of linear independence. Why are vectors automatically dependent if one of them is $\mathbf 0$?

**Q16.** List the three conditions for a subset $U$ to be a subspace, naming the inner and outer operations.

**Q17.** Why do we not check associativity and distributivity when proving a subspace?

**Q18.** Name the five properties of an Abelian group. Why is $(\mathbb{N}_0,+)$ not one?

**Q19.** Explain why $\operatorname{span}\{x_1,\dots,x_m\}$ is always a subspace of $\mathbb{R}^n$, and why five vectors in $\mathbb{R}^4$ can never be independent.

---

## 10. Exam Traps

1. Writing the vectors as **rows** instead of columns when testing independence. Pivot columns identify the independent vectors.
2. Concluding "subspace" after checking only the zero vector. All three conditions are needed (Example B5).
3. Forgetting that $t$ can be negative or zero in the scalar test. That is where half-planes and "$\ge$" sets fail.
4. In a closure proof, assuming what must be proved. Assume only $x, y \in U$, then build and test the new vector.
5. Saying "not a subspace" without a concrete counterexample. Name the vector and the scalar.
6. Mixing spanning vectors with coordinates. In span proofs $x_1, x_2$ are fixed vectors; $a,b,c,d$ are real scalars.
7. Stopping after solving two span equations without testing the third. The unused equation decides membership (Example C2).
8. In a span proof, not saying **why** the new coefficients $a + c$, $t a$ are real. That sentence carries marks.

---

**Recall chain:** columns into a matrix → REF → pivots decide independence → RREF writes the dependency; for subspaces: set up → non-empty → closed under addition → closed under scaling → subspace; for span: $x = a x_1 + b x_2$ → equations → solve two → test the rest

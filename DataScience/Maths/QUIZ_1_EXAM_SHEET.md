# Quiz 1 — Solution Sheet

## 1. Which method for which question

Read the question, find its row, use that method. Every question in this quiz is one of these nine types.

| The question asks                                | Do this                                                                                | Used in                    |
| :----------------------------------------------- | :------------------------------------------------------------------------------------- | :------------------------- |
| Compute $AB$                                     | Row of $A$ $\times$ column of $B$                                                      | Q1                         |
| Compute $Ax$                                     | Each row of $A$ $\times$ the vector $x$                                                | Q5                         |
| Compute $2A - B$                                 | Entry by entry, position with position                                                 | Q7                         |
| Find $k$ so vectors are **dependent**            | Vectors as columns $\to$ $\det = 0$ $\to$ solve for $k$                                | Q2                         |
| Which vector is in $\text{span}\{v_1,v_2\}$      | Build $\alpha v_1 + \beta v_2$ $\to$ get a rule between coordinates $\to$ test options | Q6                         |
| Find $a, b$ with $a v_1 + b v_2 = \text{target}$ | Split into 2 equations $\to$ eliminate (or Cramer)                                     | Q9                         |
| Find $\dim(W)$                                   | $\dim(W) = n - m$                                                                      | Q3, Q4, Q10, Q11, Q12, Q14 |
| Which set is a **subspace**                      | 3 tests: origin, addition, scaling                                                     | Q8, Q16                    |
| Which matrix is **PSD / PD**                     | Symmetry first, then diagonal, then $\det$                                             | Q15, Q17, Q18              |
| Find $k$ for **infinitely many solutions**       | $\det = 0$ **and** the two equations are the same line                                 | Q13                        |
| Solve 2 equations in 2 unknowns                  | Add/subtract to kill one unknown, then back-substitute                                 | Q19                        |

---

## 2. Symbols

| Symbol                                | Meaning                                                                                        |
| :------------------------------------ | :--------------------------------------------------------------------------------------------- |
| $\mathbb{R}^2$, $\mathbb{R}^3$        | vectors made of 2 numbers / 3 numbers                                                          |
| $x_1, x_2, x_3$                       | coordinate 1, 2, 3 **of one vector $x$**                                                       |
| $u = (u_1, u_2)$, $w = (w_1, w_2)$    | two members of a set. Letter = which vector, subscript = which coordinate                      |
| $v_1, v_2, v_3$                       | whole vectors, named by the question itself                                                    |
| $a_{ij}$, $b_{ij}$                    | matrix entry in **row $i$, column $j$**                                                        |
| $a, b, c, d$                          | the four entries of a general $2\times2$ matrix $\begin{pmatrix} a & b \\ c & d \end{pmatrix}$ |
| $c$, $s$, $t$, $k$, $\alpha$, $\beta$ | plain single numbers                                                                           |
| $x^T$                                 | column written sideways: $(1,0,1)^T$ is a column                                               |
| $\mid$ inside $\{\ \}$                | "such that"                                                                                    |
| $n$                                   | how many numbers each vector carries (size of the surrounding space)                           |
| $m$                                   | how many **independent** rules (equations) are given                                           |
| $\dim(W)$                             | how many coordinates you may still choose freely                                               |
| $\det(A)$                             | one number from a square matrix. $\det = 0$ $\Rightarrow$ columns are dependent                |
| span                                  | every vector you can build by stretching and adding the given ones                             |
| subspace                              | contains the origin, and never escapes under $+$ or $\times$ number                            |
| PSD / PD                              | symmetric, plus $\ge 0$ conditions / plus $> 0$ conditions                                     |

---

## 3. $\dim(W) = n - m$, and what $m$ means

- $n$ = how many numbers each vector has. $\mathbb{R}^2 \to n=2$. $\mathbb{R}^3 \to n=3$.
- $m$ = how many **independent** rules. Count the "$=$" signs, then delete any equation that is another one multiplied by a number or made by adding others.
- $\dim(W) = n - m$ = how many coordinates are still free to choose.

**$m$ in four cases** (all inside $\mathbb{R}^3$, so $n = 3$):

| Rules given                        |  $m$  | Why                                         | $\dim$ | Shape       |
| :--------------------------------- | :---: | :------------------------------------------ | :----: | :---------- |
| $x_1 + x_2 + x_3 = 0$              |   1   | one "$=$" sign                              |   2    | plane       |
| $x_1 = 0$, $x_2 = 0$               |   2   | two different rules                         |   1    | line        |
| $x_1 + x_2 = 0$, $2x_1 + 2x_2 = 0$ | **1** | second $= 2 \times$ first, so it is not new |   2    | plane       |
| $x_1 = 0$, $x_2 = 0$, $x_3 = 0$    |   3   | three different rules                       |   0    | origin only |

**Two rules that are not equations:**

1. $x \ge 0$ has no "$=$" sign, so it is not a constraint equation. Such sets are usually not subspaces.
2. The right side must be $0$. $x_1 + x_2 = 5$ is not a subspace, so $\dim = n - m$ does not apply.

---

---

# Q1

**Question.** $A = \begin{pmatrix} 1 & 2 \\ -1 & 3 \end{pmatrix}$, $B = \begin{pmatrix} 2 & 0 \\ 4 & 1 \end{pmatrix}$. Find $C = AB$.

**Spot it.** Two matrices multiplied together $\to$ row $\times$ column.

### Method

1. Check sizes: columns of $A$ must equal rows of $B$. Answer size = rows of $A$ $\times$ columns of $B$.
2. Use $c_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j}$ — take **row $i$ of $A$** and **column $j$ of $B$**, multiply matching numbers, add.
3. Fill in all four entries.

### Working

| Step                            | Result                                                                   |
| :------------------------------ | :----------------------------------------------------------------------- |
| Sizes                           | $A$ is $2\times2$, $B$ is $2\times2$ $\to$ allowed, answer is $2\times2$ |
| $c_{11}$ = row 1 $\times$ col 1 | $(1)(2) + (2)(4) = 2 + 8 = 10$                                           |
| $c_{12}$ = row 1 $\times$ col 2 | $(1)(0) + (2)(1) = 0 + 2 = 2$                                            |
| $c_{21}$ = row 2 $\times$ col 1 | $(-1)(2) + (3)(4) = -2 + 12 = 10$                                        |
| $c_{22}$ = row 2 $\times$ col 2 | $(-1)(0) + (3)(1) = 0 + 3 = 3$                                           |

$$AB = \begin{pmatrix} 10 & 2 \\ 10 & 3 \end{pmatrix}$$

### Answer

$$\mathbf{(b) \ \begin{pmatrix} 10 & 2 \\ 10 & 3 \end{pmatrix}}$$

**Trap.** $AB \ne BA$. Row always from the **first** matrix, column always from the **second**.

---

---

# Q2

**Question.** Find $k$ so that $v_1 = (1,0,1)^T$, $v_2 = (0,1,1)^T$, $v_3 = (1,k,2)^T$ are linearly dependent.

**Spot it.** "Dependent" + as many vectors as coordinates $\to$ $\det = 0$.

### Method

1. Stand the vectors up as **columns** of a matrix $M$.
2. Expand $\det(M)$ along the row or column with the most zeros. Signs go $+\ -\ +$.
3. Set $\det(M) = 0$ and solve for $k$.

Small determinant needed in step 2: $\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc$.

### Working

$$M = \begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & k \\ 1 & 1 & 2 \end{pmatrix}$$

| Step               | Result                                                                                                                                                               |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Expand along row 1 | $1 \cdot \begin{vmatrix} 1 & k \\ 1 & 2 \end{vmatrix} - 0 \cdot \begin{vmatrix} 0 & k \\ 1 & 2 \end{vmatrix} + 1 \cdot \begin{vmatrix} 0 & 1 \\ 1 & 1 \end{vmatrix}$ |
| First small det    | $(1)(2) - (k)(1) = 2 - k$                                                                                                                                            |
| Middle term        | $\times \ 0$, so it disappears                                                                                                                                       |
| Third small det    | $(0)(1) - (1)(1) = -1$                                                                                                                                               |
| Add up             | $\det(M) = (2-k) - 0 + (-1) = 1 - k$                                                                                                                                 |
| Set to zero        | $1 - k = 0 \implies k = 1$                                                                                                                                           |

### Answer

$$\mathbf{(a) \ k = 1}$$

**Trap.** The signs alternate $+\ -\ +$ across the top row. Expanding along a row with a zero saves one whole calculation.

---

---

# Q3

**Question.** $W = \{ x \in \mathbb{R}^2 \mid x_1 = 2x_2 \}$. Find $\dim(W)$.

**Spot it.** Asks for a dimension $\to$ $\dim(W) = n - m$.

### Method (used again in Q4, Q10, Q11, Q12, Q14)

1. **Count $n$** = how many numbers each vector has.
2. **Rewrite each rule with $0$ on the right**, then **count $m$** = how many independent rules.
3. $\dim(W) = n - m$.
4. **Check:** call the free coordinates $s, t$, write $x$ as a sum of fixed vectors. The number of those vectors must equal your answer.

### Working

| Step            | Result                                                                                                   |
| :-------------- | :------------------------------------------------------------------------------------------------------- |
| 1. $n$          | vectors are $(x_1, x_2)$ $\to$ $n = 2$                                                                   |
| 2. rule and $m$ | $x_1 - 2x_2 = 0$ $\to$ $m = 1$                                                                           |
| 3. dimension    | $\dim(W) = 2 - 1 = 1$                                                                                    |
| 4. check        | free: $x_2 = t$; forced: $x_1 = 2t$; so $x = t\begin{pmatrix} 2 \\ 1 \end{pmatrix}$ $\to$ **1** vector ✓ |

### Answer

$$\mathbf{(b) \ 1}$$

**Picture.** A line through the origin. One direction to walk in = dimension 1.

---

---

# Q4

**Question.** $W = \{ x \in \mathbb{R}^3 \mid x_1 = 2x_2 + x_3 \}$. Find $\dim(W)$.

**Spot it.** Dimension $\to$ **same 4 steps as Q3**.

### Working

| Step            | Result                                             |
| :-------------- | :------------------------------------------------- |
| 1. $n$          | vectors are $(x_1, x_2, x_3)$ $\to$ $n = 3$        |
| 2. rule and $m$ | $x_1 - 2x_2 - x_3 = 0$ $\to$ $m = 1$               |
| 3. dimension    | $\dim(W) = 3 - 1 = 2$                              |
| 4. check        | free: $x_2 = s$, $x_3 = t$; forced: $x_1 = 2s + t$ |

$$x = \begin{pmatrix} 2s + t \\ s \\ t \end{pmatrix} = s \begin{pmatrix} 2 \\ 1 \\ 0 \end{pmatrix} + t \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} \quad \to \quad \textbf{2 vectors} \ \checkmark$$

The two vectors are not multiples of each other, so they are independent and form a basis.

### Answer

$$\mathbf{(d) \ 2}$$

**Picture.** A plane through the origin. Two directions to slide in = dimension 2.

---

---

# Q5

**Question.** $A = \begin{pmatrix} 2 & -1 \\ 3 & 4 \end{pmatrix}$, $x = \begin{pmatrix} 2 \\ -1 \end{pmatrix}$. Find $Ax$.

**Spot it.** Matrix times a vector $\to$ each row meets the whole vector.

### Method

1. Row 1 of $A$ against $x$ $\to$ first number of the answer.
2. Row 2 of $A$ against $x$ $\to$ second number of the answer.
3. Stack them into a column.

### Working

| Step  | Result                                |
| :---- | :------------------------------------ |
| Row 1 | $y_1 = (2)(2) + (-1)(-1) = 4 + 1 = 5$ |
| Row 2 | $y_2 = (3)(2) + (4)(-1) = 6 - 4 = 2$  |

$$Ax = \begin{pmatrix} 5 \\ 2 \end{pmatrix}$$

### Answer

$$\mathbf{(c) \ \begin{pmatrix} 5 \\ 2 \end{pmatrix}}$$

**Trap.** $(-1)(-1) = +1$. Minus times minus is plus.

---

---

# Q6

**Question.** Which vector is in $\text{span}\left\{ \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix} \right\}$? Options: **(a)** $(1,1,1)^T$, **(b)** $(2,-1,1)^T$, **(c)** $(2,-1,3)^T$, **(d)** $(0,2,1)^T$.

**Spot it.** "In the span" $\to$ turn the span into one rule between the coordinates, then test the options.

### Method

1. Build the general member: $\alpha v_1 + \beta v_2$.
2. Read off each coordinate. Replace $\alpha$ and $\beta$ by the coordinates they equal.
3. What is left is one rule. Test every option against it.

### Working

$$\alpha \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} + \beta \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix} = \begin{pmatrix} \alpha \\ \beta \\ \alpha + \beta \end{pmatrix} \quad \to \quad x_1 = \alpha, \ x_2 = \beta, \ x_3 = \alpha + \beta$$

$$\textbf{Rule: } x_3 = x_1 + x_2$$

| Option             | $x_1 + x_2$ | $x_3$ | Equal?  |
| :----------------- | :---------: | :---: | :------ |
| (a) $(1,1,1)$      |     $2$     |  $1$  | no      |
| **(b) $(2,-1,1)$** |     $1$     |  $1$  | **yes** |
| (c) $(2,-1,3)$     |     $1$     |  $3$  | no      |
| (d) $(0,2,1)$      |     $2$     |  $1$  | no      |

Confirm (b) by building it: $2v_1 + (-1)v_2 = (2, -1, 1)^T \ \checkmark$

### Answer

$$\mathbf{(b) \ (2, -1, 1)^T}$$

---

---

# Q7

**Question.** $A = \begin{pmatrix} 1 & -2 \\ 3 & 0 \end{pmatrix}$, $B = \begin{pmatrix} 4 & 1 \\ -1 & 2 \end{pmatrix}$. Find $2A - B$.

**Spot it.** Only $+$, $-$ and a number in front $\to$ work entry by entry. No row $\times$ column here.

### Method

1. Multiply every entry of $A$ by $2$.
2. Subtract $B$ position by position: row 1 col 1 with row 1 col 1, and so on.

### Working

| Step         | Result                                          |
| :----------- | :---------------------------------------------- |
| $2A$         | $\begin{pmatrix} 2 & -4 \\ 6 & 0 \end{pmatrix}$ |
| top-left     | $2 - 4 = -2$                                    |
| top-right    | $-4 - 1 = -5$                                   |
| bottom-left  | $6 - (-1) = 6 + 1 = 7$                          |
| bottom-right | $0 - 2 = -2$                                    |

$$2A - B = \begin{pmatrix} -2 & -5 \\ 7 & -2 \end{pmatrix}$$

### Answer

$$\mathbf{(d) \ \begin{pmatrix} -2 & -5 \\ 7 & -2 \end{pmatrix}}$$

**Trap.** Bottom-left is $6 - (-1) = 7$, not $5$.

---

---

# Q8

**Question.** Which is a subspace of $\mathbb{R}^2$? **(a)** $x + y = 1$, **(b)** $xy = 0$, **(c)** $x - 2y = 0$, **(d)** $x \ge 0$.

**Spot it.** "Which set is a subspace" $\to$ run the 3 tests.

### Method

Write a member as $u = (u_1, u_2)$ and a second as $w = (w_1, w_2)$. Let $c$ be any number.

1. **Origin:** does $(0,0)$ obey the rule?
2. **Addition:** is $u + w = (u_1 + w_1, \ u_2 + w_2)$ still in the set?
3. **Scaling:** is $cu = (cu_1, \ cu_2)$ still in the set, **for every** $c$, including negatives?

Stop at the first test that fails. **To fail** you only need one example with real numbers. **To pass** you must use letters, because it has to hold for every member.

**Fast filter:** cross out any rule with a non-zero right side, any $\ge$ or $\le$, and any two variables multiplied together.

### Working

| Option               | 1. Origin                   | 2. Addition                                                        | 3. Scaling                                                   | Verdict        |
| :------------------- | :-------------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------- | :------------- |
| (a) $x + y = 1$      | $0 + 0 = 0 \ne 1$ **fails** | —                                                                  | —                                                            | not a subspace |
| (b) $xy = 0$         | $(0)(0) = 0$ ✓              | $u=(1,0)$, $w=(0,1)$ $\to$ $u+w=(1,1)$, $(1)(1)=1 \ne 0$ **fails** | —                                                            | not a subspace |
| **(c) $x - 2y = 0$** | $0 - 2(0) = 0$ ✓            | ✓ (letters below)                                                  | ✓ (letters below)                                            | **subspace**   |
| (d) $x \ge 0$        | $0 \ge 0$ ✓                 | $u_1 + w_1 \ge 0$ ✓                                                | $u=(1,0)$, $c=-1$ $\to$ $(-1,0)$, $-1 \ge 0$ false **fails** | not a subspace |

**Proof for (c) with letters.** Members obey $u_1 - 2u_2 = 0$ and $w_1 - 2w_2 = 0$.

$$\text{Addition: } (u_1 + w_1) - 2(u_2 + w_2) = (u_1 - 2u_2) + (w_1 - 2w_2) = 0 + 0 = 0 \ \checkmark$$

$$\text{Scaling: } cu_1 - 2cu_2 = c(u_1 - 2u_2) = c \cdot 0 = 0 \ \checkmark$$

### Answer

$$\mathbf{(c) \ \{ (x,y) : x - 2y = 0 \}}$$

---

---

# Q9

**Question.** Find $(a, b)$ with $a \begin{pmatrix} 1 \\ 2 \end{pmatrix} + b \begin{pmatrix} 2 \\ -1 \end{pmatrix} = \begin{pmatrix} 5 \\ 0 \end{pmatrix}$.

**Spot it.** Find the two mixing amounts $\to$ split into 2 equations and solve.

### Method

1. Match the top numbers of both sides, then the bottom numbers. That gives 2 equations.
2. Solve by elimination, or by Cramer's rule below.
3. Put the answer back in to check.

Cramer for $\begin{cases} c_{11} a + c_{12} b = d_1 \\ c_{21} a + c_{22} b = d_2 \end{cases}$:
$$D = c_{11}c_{22} - c_{12}c_{21}, \qquad a = \frac{d_1 c_{22} - d_2 c_{12}}{D}, \qquad b = \frac{c_{11} d_2 - c_{21} d_1}{D}$$

_(The coefficients are called $c_{ij}$ and the right side $d_i$ only because the letters $a$ and $b$ are already used by the two unknowns. In Q13 and Q19, where the unknowns are $x$ and $y$, they are called $a_{ij}$ and $b_i$ as usual.)_

### Working

$$\begin{cases} a + 2b = 5 \\ 2a - b = 0 \end{cases} \qquad c_{11}=1, \ c_{12}=2, \ d_1=5, \quad c_{21}=2, \ c_{22}=-1, \ d_2=0$$

| Step  | Result                                                                                                                    |
| :---- | :------------------------------------------------------------------------------------------------------------------------ |
| $D$   | $(1)(-1) - (2)(2) = -1 - 4 = -5$                                                                                          |
| $a$   | $\dfrac{(5)(-1) - (0)(2)}{-5} = \dfrac{-5}{-5} = 1$                                                                       |
| $b$   | $\dfrac{(1)(0) - (2)(5)}{-5} = \dfrac{-10}{-5} = 2$                                                                       |
| check | $1\begin{pmatrix} 1 \\ 2 \end{pmatrix} + 2\begin{pmatrix} 2 \\ -1 \end{pmatrix} = \begin{pmatrix} 5 \\ 0 \end{pmatrix}$ ✓ |

### Answer

$$\mathbf{(c) \ (a, b) = (1, 2)}$$

**Faster in the exam.** Put each option into the equation. $(1,2)$ works in about 10 seconds.

---

---

# Q10

**Question.** $W = \{ x \in \mathbb{R}^3 \mid x_1 - x_2 = x_3 \}$. Find $\dim(W)$.

**Spot it.** Dimension $\to$ **same 4 steps as Q3**.

### Working

| Step            | Result                                                    |
| :-------------- | :-------------------------------------------------------- |
| 1. $n$          | $n = 3$                                                   |
| 2. rule and $m$ | move all to one side: $x_1 - x_2 - x_3 = 0$ $\to$ $m = 1$ |
| 3. dimension    | $\dim(W) = 3 - 1 = 2$                                     |
| 4. check        | free: $x_2 = s$, $x_3 = t$; forced: $x_1 = s + t$         |

$$x = \begin{pmatrix} s + t \\ s \\ t \end{pmatrix} = s \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix} + t \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} \quad \to \quad \textbf{2 vectors} \ \checkmark$$

### Answer

$$\mathbf{(d) \ 2}$$

**Step 2 matters.** Always push everything to one side first, so the rule reads "$\dots = 0$", then count.

---

---

# Q11

**Question.** $W = \{ x \in \mathbb{R}^3 \mid x_1 = 0 \}$. Find $\dim(W)$.

**Spot it.** Dimension $\to$ **same 4 steps as Q3**.

### Working

| Step            | Result                                        |
| :-------------- | :-------------------------------------------- |
| 1. $n$          | $n = 3$                                       |
| 2. rule and $m$ | $x_1 = 0$ $\to$ $m = 1$                       |
| 3. dimension    | $\dim(W) = 3 - 1 = 2$                         |
| 4. check        | free: $x_2 = s$, $x_3 = t$; forced: $x_1 = 0$ |

$$x = s \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix} + t \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} \quad \to \quad \textbf{2 vectors} \ \checkmark$$

### Answer

$$\mathbf{(d) \ 2}$$

**Note.** A rule like $x_1 = 0$ costs exactly **one** freedom, the same as any other single equation.

---

---

# Q12

**Question.** $W = \{ x \in \mathbb{R}^2 \mid x_1 = 0, \ x_2 \in \mathbb{R} \}$. Find $\dim(W)$.

**Spot it.** Dimension $\to$ **same 4 steps as Q3**.

### Working

| Step            | Result                                                                                 |
| :-------------- | :------------------------------------------------------------------------------------- |
| 1. $n$          | $n = 2$                                                                                |
| 2. rule and $m$ | $x_1 = 0$ $\to$ $m = 1$                                                                |
| 3. dimension    | $\dim(W) = 2 - 1 = 1$                                                                  |
| 4. check        | free: $x_2 = t$ $\to$ $x = t\begin{pmatrix} 0 \\ 1 \end{pmatrix}$ $\to$ **1 vector** ✓ |

### Answer

$$\mathbf{(b) \ 1}$$

**Compare with Q11.** Same rule $x_1 = 0$, but $\dim = 2$ there and $\dim = 1$ here, because $n$ changed. **Always check which space you are in first.**

---

---

# Q13

**Question.** Find $k$ so the system has **infinitely many** solutions: $\begin{cases} kx + y = 2 \\ 2x + 2y = 4 \end{cases}$

**Spot it.** "Infinitely many solutions" $\to$ two-part test, not one.

### Method

1. $\det(A) = 0$, where $A$ holds the coefficients. This makes the two lines parallel **or** identical.
2. Then check the whole equations match (divide one by a number and compare). This separates _identical_ (infinitely many) from _parallel_ (no solution).

### Working

$$A = \begin{pmatrix} k & 1 \\ 2 & 2 \end{pmatrix}$$

| Step           | Result                                                                                         |
| :------------- | :--------------------------------------------------------------------------------------------- |
| 1. $\det(A)$   | $(k)(2) - (1)(2) = 2k - 2$                                                                     |
| set to $0$     | $2k - 2 = 0 \implies k = 1$                                                                    |
| 2. match check | equation 2 $\div\ 2$ gives $x + y = 2$; with $k=1$ equation 1 is $x + y = 2$ — **identical** ✓ |

### Answer

$$\mathbf{(d) \ k = 1}$$

**Trap.** $\det = 0$ on its own could equally mean **no** solution. Only the matching right-hand sides prove "infinitely many".

---

---

# Q14

**Question.** $W = \{ x \in \mathbb{R}^2 \mid x_2 = 2x_1 \}$. Find $\dim(W)$.

**Spot it.** Dimension $\to$ **same 4 steps as Q3**.

### Working

| Step            | Result                                                                                                     |
| :-------------- | :--------------------------------------------------------------------------------------------------------- |
| 1. $n$          | $n = 2$                                                                                                    |
| 2. rule and $m$ | $x_2 - 2x_1 = 0$ $\to$ $m = 1$                                                                             |
| 3. dimension    | $\dim(W) = 2 - 1 = 1$                                                                                      |
| 4. check        | free: $x_1 = t$; forced: $x_2 = 2t$ $\to$ $x = t\begin{pmatrix} 1 \\ 2 \end{pmatrix}$ $\to$ **1 vector** ✓ |

### Answer

$$\mathbf{(d) \ 1}$$

**Note.** Q3 was $x_1 = 2x_2$ and this is $x_2 = 2x_1$. One equation in $\mathbb{R}^2$ always leaves 1 freedom. Only the direction of the line changes.

---

---

# Q15

**Question.** Which matrix is **Positive Semi-Definite (PSD)**? **(a)** $\begin{pmatrix} -1 & 0 \\ 0 & 1 \end{pmatrix}$, **(b)** $\begin{pmatrix} 1 & 3 \\ 2 & 8 \end{pmatrix}$, **(c)** $\begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix}$, **(d)** $\begin{pmatrix} 1 & 2 \\ 3 & 8 \end{pmatrix}$.

**Spot it.** PSD $\to$ three checks, in this order. Symmetry first, because it kills options in two seconds.

### Method

For $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$:

1. **Symmetric?** $b = c$. If not, stop — it cannot be PSD.
2. **Diagonal?** $a \ge 0$ **and** $d \ge 0$.
3. **Determinant?** $ad - bc \ge 0$.

Everything uses $\ge$, so **zeros are allowed**.

### Working

| Option                                                 | 1. $b = c$?         | 2. $a \ge 0$, $d \ge 0$? | 3. $\det \ge 0$? | Verdict |
| :----------------------------------------------------- | :------------------ | :----------------------- | :--------------- | :------ |
| (a) $\begin{pmatrix} -1 & 0 \\ 0 & 1 \end{pmatrix}$    | $0 = 0$ ✓           | $a = -1 < 0$ **fails**   | —                | not PSD |
| (b) $\begin{pmatrix} 1 & 3 \\ 2 & 8 \end{pmatrix}$     | $3 \ne 2$ **fails** | —                        | —                | not PSD |
| **(c) $\begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix}$** | $0 = 0$ ✓           | $0 \ge 0$, $0 \ge 0$ ✓   | $0 \ge 0$ ✓      | **PSD** |
| (d) $\begin{pmatrix} 1 & 2 \\ 3 & 8 \end{pmatrix}$     | $2 \ne 3$ **fails** | —                        | —                | not PSD |

### Answer

$$\mathbf{(c) \ \begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix}}$$

**Why the zero matrix counts.** It gives $x^T A x = 0$ always, and zero is not negative. This is exactly the case PSD allows and PD (Q17) forbids.

---

---

# Q16

**Question.** Which is a subspace of $\mathbb{R}^2$? **(a)** $y = 1$, **(b)** $x + y = 0$, **(c)** $x \ge 0$, **(d)** $x - y = 1$.

**Spot it.** Subspace $\to$ **same 3 tests as Q8**, same letters $u = (u_1, u_2)$, $w = (w_1, w_2)$, same order.

### Working

| Option              | 1. Origin                   | 2. Addition         | 3. Scaling                                                   | Verdict        |
| :------------------ | :-------------------------- | :------------------ | :----------------------------------------------------------- | :------------- |
| (a) $y = 1$         | $0 \ne 1$ **fails**         | —                   | —                                                            | not a subspace |
| **(b) $x + y = 0$** | $0 + 0 = 0$ ✓               | ✓ (letters below)   | ✓ (letters below)                                            | **subspace**   |
| (c) $x \ge 0$       | $0 \ge 0$ ✓                 | $u_1 + w_1 \ge 0$ ✓ | $u=(1,0)$, $c=-1$ $\to$ $(-1,0)$, $-1 \ge 0$ false **fails** | not a subspace |
| (d) $x - y = 1$     | $0 - 0 = 0 \ne 1$ **fails** | —                   | —                                                            | not a subspace |

**Proof for (b) with letters.** Members obey $u_1 + u_2 = 0$ and $w_1 + w_2 = 0$.

$$\text{Addition: } (u_1 + w_1) + (u_2 + w_2) = (u_1 + u_2) + (w_1 + w_2) = 0 + 0 = 0 \ \checkmark$$

$$\text{Scaling: } cu_1 + cu_2 = c(u_1 + u_2) = c \cdot 0 = 0 \ \checkmark$$

### Answer

$$\mathbf{(b) \ \{ (x,y) : x + y = 0 \}}$$

**One-line filter.** A line $ax + by = c$ is a subspace **only when $c = 0$**.

---

---

# Q17

**Question.** Which matrix is **Positive Definite (PD)**? **(a)** $\begin{pmatrix} -1 & 0 \\ 0 & 0 \end{pmatrix}$, **(b)** $\begin{pmatrix} 1 & 3 \\ 2 & 8 \end{pmatrix}$, **(c)** $\begin{pmatrix} 7 & 0 \\ 0 & 25 \end{pmatrix}$, **(d)** $\begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix}$.

**Spot it.** PD $\to$ same three checks as Q15, but every "$\ge$" becomes "$>$". **No zeros allowed.**

### Method

For $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$:

1. **Symmetric?** $b = c$.
2. **Top-left corner?** $a > 0$.
3. **Determinant?** $ad - bc > 0$.

### Working

| Option                                                  | 1. $b = c$?         | 2. $a > 0$?              | 3. $\det > 0$? | Verdict |
| :------------------------------------------------------ | :------------------ | :----------------------- | :------------- | :------ |
| (a) $\begin{pmatrix} -1 & 0 \\ 0 & 0 \end{pmatrix}$     | ✓                   | $-1 > 0$ false **fails** | $0 > 0$ false  | not PD  |
| (b) $\begin{pmatrix} 1 & 3 \\ 2 & 8 \end{pmatrix}$      | $3 \ne 2$ **fails** | —                        | —              | not PD  |
| **(c) $\begin{pmatrix} 7 & 0 \\ 0 & 25 \end{pmatrix}$** | $0 = 0$ ✓           | $7 > 0$ ✓                | $175 > 0$ ✓    | **PD**  |
| (d) $\begin{pmatrix} 0 & 0 \\ 0 & 0 \end{pmatrix}$      | ✓                   | $0 > 0$ false **fails**  | $0 > 0$ false  | not PD  |

### Answer

$$\mathbf{(c) \ \begin{pmatrix} 7 & 0 \\ 0 & 25 \end{pmatrix}}$$

**PSD vs PD in one line.** Same three checks. PSD uses $\ge$ (zeros fine), PD uses $>$ (no zeros). The zero matrix is PSD but not PD.

---

---

# Q18

**Question.** Which matrix is **PSD**? **(a)** $\begin{pmatrix} 1 & 3 \\ 2 & 1 \end{pmatrix}$, **(b)** $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$, **(c)** $\begin{pmatrix} -1 & 0 \\ 0 & -1 \end{pmatrix}$, **(d)** $\begin{pmatrix} 1 & 0 \\ 0 & -2 \end{pmatrix}$.

**Spot it.** PSD $\to$ **same 3 checks as Q15**. Three options are diagonal, so step 2 alone decides them.

**Shortcut.** For a diagonal matrix $\begin{pmatrix} a & 0 \\ 0 & d \end{pmatrix}$ the eigenvalues **are** $a$ and $d$. PSD just means $a \ge 0$ and $d \ge 0$.

### Working

| Option                                                 | 1. $b = c$?         | 2. $a \ge 0$, $d \ge 0$? | 3. $\det \ge 0$? | Verdict                     |
| :----------------------------------------------------- | :------------------ | :----------------------- | :--------------- | :-------------------------- |
| (a) $\begin{pmatrix} 1 & 3 \\ 2 & 1 \end{pmatrix}$     | $3 \ne 2$ **fails** | —                        | —                | not PSD                     |
| **(b) $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$** | ✓                   | $1 \ge 0$, $0 \ge 0$ ✓   | $0 \ge 0$ ✓      | **PSD**                     |
| (c) $\begin{pmatrix} -1 & 0 \\ 0 & -1 \end{pmatrix}$   | ✓                   | $-1 < 0$ **fails**       | —                | not PSD (negative definite) |
| (d) $\begin{pmatrix} 1 & 0 \\ 0 & -2 \end{pmatrix}$    | ✓                   | $-2 < 0$ **fails**       | —                | not PSD (indefinite)        |

### Answer

$$\mathbf{(b) \ \begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}}$$

**Note.** PSD but **not** PD, because $\det = 0$ (one eigenvalue is exactly zero).

---

---

# Q19

**Question.** Solve $\begin{cases} 2x + y = 7 \\ x - y = 2 \end{cases}$

**Spot it.** Two equations, two unknowns, and the $y$ terms are $+y$ and $-y$ $\to$ add them to kill $y$.

### Method

1. Add or subtract the two equations so one unknown disappears.
2. Solve the single equation that remains.
3. Put that value back into either original equation to get the other unknown.

### Working

| Step                                | Result                                       |
| :---------------------------------- | :------------------------------------------- |
| 1. add them                         | $(2x + y) + (x - y) = 7 + 2 \implies 3x = 9$ |
| 2. solve                            | $x = 3$                                      |
| 3. back-substitute into $x - y = 2$ | $3 - y = 2 \implies y = 1$                   |
| check in equation 1                 | $2(3) + 1 = 7$ ✓                             |

Cross-check with the inverse ($\det = (2)(-1) - (1)(1) = -3$):

$$\begin{pmatrix} x \\ y \end{pmatrix} = \frac{1}{-3} \begin{pmatrix} -1 & -1 \\ -1 & 2 \end{pmatrix} \begin{pmatrix} 7 \\ 2 \end{pmatrix} = -\frac{1}{3} \begin{pmatrix} -9 \\ -3 \end{pmatrix} = \begin{pmatrix} 3 \\ 1 \end{pmatrix} \ \checkmark$$

### Answer

$$\mathbf{(b) \ (x, y) = (3, 1)}$$

**Faster in the exam.** Put each option into both equations. $(3,1)$: $2(3)+1 = 7$ ✓ and $3-1 = 2$ ✓.

---

---

# Revision Sheet

### All answers

| Q | Type | Answer |
| :--: | :-- | :-- |
| 1 | matrix $\times$ matrix | **(b)** $\begin{pmatrix} 10 & 2 \\ 10 & 3 \end{pmatrix}$ |
| 2 | dependent $\to$ $\det = 0$ | **(a)** $k = 1$ |
| 3 | $\dim$, $\mathbb{R}^2$ | **(b)** $1$ |
| 4 | $\dim$, $\mathbb{R}^3$ | **(d)** $2$ |
| 5 | matrix $\times$ vector | **(c)** $\begin{pmatrix} 5 \\ 2 \end{pmatrix}$ |
| 6 | span | **(b)** $(2,-1,1)^T$ |
| 7 | $2A - B$ | **(d)** $\begin{pmatrix} -2 & -5 \\ 7 & -2 \end{pmatrix}$ |
| 8 | subspace | **(c)** $x - 2y = 0$ |
| 9 | mixing amounts | **(c)** $(1, 2)$ |
| 10 | $\dim$, $\mathbb{R}^3$ | **(d)** $2$ |
| 11 | $\dim$, $\mathbb{R}^3$ | **(d)** $2$ |
| 12 | $\dim$, $\mathbb{R}^2$ | **(b)** $1$ |
| 13 | infinitely many solutions | **(d)** $k = 1$ |
| 14 | $\dim$, $\mathbb{R}^2$ | **(d)** $1$ |
| 15 | PSD | **(c)** zero matrix |
| 16 | subspace | **(b)** $x + y = 0$ |
| 17 | PD | **(c)** $\begin{pmatrix} 7 & 0 \\ 0 & 25 \end{pmatrix}$ |
| 18 | PSD | **(b)** $\begin{pmatrix} 1 & 0 \\ 0 & 0 \end{pmatrix}$ |
| 19 | solve $2\times2$ system | **(b)** $(3, 1)$ |

### The five flows

| # | Flow | Steps |
| :--: | :-- | :-- |
| 1 | **Dimension** | count $n$ $\to$ write rules as "$\dots = 0$" and count $m$ $\to$ $\dim = n - m$ $\to$ check with free variables |
| 2 | **Subspace** | origin $\to$ addition $\to$ scaling. Fail with numbers, pass with letters |
| 3 | **Dependent vectors** | vectors as columns $\to$ $\det = 0$ $\to$ solve |
| 4 | **PSD / PD** | $b = c$ $\to$ diagonal $\to$ $\det$. PSD uses $\ge$, PD uses $>$ |
| 5 | **Two lines** | $\det \ne 0$ one solution; $\det = 0$ and equations match $\to$ infinitely many; $\det = 0$ and they clash $\to$ none |

### Fastest exam filters

- **Subspace:** cross out non-zero right sides, any $\ge$ or $\le$, and any $xy$.
- **PSD / PD:** check $b = c$ first — it usually removes two options instantly.
- **Any "solve" or "find the pair" question:** substitute the options rather than solving.

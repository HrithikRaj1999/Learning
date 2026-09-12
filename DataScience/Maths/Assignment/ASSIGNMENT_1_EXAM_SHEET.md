# Assignment 1 — Exam Sheet & Quick Reference

> ⏱ **Exam Time Limit:** 40 Minutes &nbsp;|&nbsp; 💯 **Total Marks:** 10 Marks &nbsp;|&nbsp; 🎯 **Target Pace:** 4 Min / Mark
>
> 📄 **Companion Document:** Detailed conceptual derivations and explanations live in [`ASSIGNMENT_1_SOLUTIONS.md`](./ASSIGNMENT_1_SOLUTIONS.md).

---

## ⏱️ Time Budget Allocation

| Question | Marks | Time Allocated | Cumulative Time | Priority Focus |
| :--- | :---: | :---: | :---: | :--- |
| **Q1** | 1 | 4 min | 4 min | Subset notation & summation algebra |
| **Q2** | 2 | 8 min | 12 min | RREF, basic/free variables, $x_p$, 5-component split for $x_h$ |
| **Q3** | 2 | 8 min | 20 min | Row-reduce $C$ once, pivot columns ($\text{Col}$), non-zero rows ($\text{Row}$) |
| **Q4** | 2 | 8 min | 28 min | Intersection proof, $Mz=0$ system, dual vector verification |
| **Q5** | 3 | 10 min | 38 min | Sum proof (piece split), pooled matrix rank, dimension formula |
| **Buffer** | — | 2 min | 40 min | Final check of "Thus proved" and "HENCE" conclusions |

> [!TIP]
> **Emergency Strategy:** If time runs out mid-proof, ensure you write **Steps 1–2** and the final **HENCE** statement. A complete logical structure with partial algebra scores higher than an incomplete proof missing conclusions.

---

## 🔤 Universal Variable System

*To ensure total consistency across all questions, use the exact same variable symbols throughout the entire exam sheet:*

| Symbol | Standard Role across ALL Questions | Appears In |
| :--- | :--- | :--- |
| $x, y$ | The two arbitrary vectors taken in Step 3 (Addition Closure) | Q1, Q3, Q4, Q5 |
| $x$ | The single arbitrary vector taken in Step 4 (Scalar Closure) | Q1, Q3, Q4, Q5 |
| $\lambda, \lambda_1, \lambda_2$ | Arbitrary real scalar(s) ($\lambda \in \mathbb{R}$) | All Questions |
| $a_i, b_i$ | Real scalar coefficients for vectors $x$ and $y$ respectively ($a_i, b_i \in \mathbb{R}$) | Q3, Q4, Q5 |
| $d_i = a_i + b_i \in \mathbb{R}$ | New sum coefficient in Step 3 ($\mathbb{R}$ closed under $+$, $d_i \in \mathbb{R}$) | Q3, Q4, Q5 |
| $e_i = \lambda a_i \in \mathbb{R}$ | New product coefficient in Step 4 ($\mathbb{R}$ closed under $\times$, $e_i \in \mathbb{R}$) | Q3, Q4, Q5 |
| $v_1, v_2$ | Spanning vectors of subspace $S_1$ | Q4, Q5 |
| $w_1, w_2$ | Spanning vectors of subspace $S_2$ | Q4, Q5 |
| $c_1 \dots c_5$ / $r_1, r_2, r_3$ | Column vectors / Row vectors of matrix $C$ | Q3 |

> [!NOTE]
> - In Q1, $x_i$ and $y_i$ denote the $i$-th scalar components of vectors $x$ and $y$.
> - In Q2, $x_1, x_2, x_3, x_4, x_5$ denote the system unknowns as defined by the problem statement.
> - In Q5, $p, q \in S_1 + S_2$ represent elements that split into pieces ($p = x + y$, $q = u + v$).

---

## 🏛️ Standardized Step Proof Template

Every proof step is formatted using this strict 4-part structure with spacious visual layout:

```
Step X: [Title]

To prove:     [Exact statement to be established in this step]

Assumptions:  [Explicit, complete statement of given set definitions / arbitrary choices]

Proof:
  Since we have: [State unpacked mathematical condition or starting identity]
  
  [Step-by-step mathematical working with explicit justifications]

Thus proved:  [Formal assertion concluding this specific step]
```

---

## ⚡ Essential Exam Reflexes

> [!IMPORTANT]
> 1. **"Subspace" Given in Prompt:** If $S_1, S_2$ are given as subspaces, then $0 \in S_1$, $S_1 \subseteq V$, and closures are **FREE**. Quote them directly; do not re-prove them!
> 2. **"Span" Set Definition:** To produce $0$ in $\text{span}\{v_1, v_2\}$, set all scalar coefficients to $0$.
> 3. **Closure Mechanics:** Coefficients add or absorb scalars ($d_i = a_i+b_i \in \mathbb{R}$, $e_i = \lambda a_i \in \mathbb{R}$). Vectors never change!
> 4. **Basis Selection Rule:**
>    - **Column Basis:** Pivot columns of the **ORIGINAL** matrix.
>    - **Row Basis:** Non-zero rows of the **ECHELON** (REF) matrix.
> 5. **Rank–Nullity Theorem:** $\dim = \text{rank} = \text{pivots}$. $\text{rank}(A) + \text{nullity}(A) = n$ ($\text{number of columns / unknowns}$).
> 6. **Intersection ($S_1 \cap S_2$):** One vector, two recipes $\implies a v_1 + b v_2 - c w_1 - d w_2 = 0$. Solve $M z = 0$ and verify both ways.
> 7. **Sum ($S_1 + S_2$):** One vector, two pieces $\implies$ Pool all vectors as columns in matrix $M$, row-reduce, count pivots.

---
---

# Q1 (1 Mark — 4 Min)

### Problem Statement
Prove that the set $U = \left\{ x \in \mathbb{R}^n : \sum_{i=1}^n x_i = 0 \right\}$ is a subspace of $\mathbb{R}^n$.

---

**AIM:** Prove that $U$ is a subspace of $\mathbb{R}^n$.

<br/>

### Step 1: Setup (Subset Property)

**Given:**  
Set $U = \left\{ x \in \mathbb{R}^n : \sum_{i=1}^n x_i = 0 \right\}$ and ambient vector space $V = \mathbb{R}^n$.

**Proof:**  
*Since we have* the clause $x \in \mathbb{R}^n$ declared prior to the colon in the set definition, candidate vectors are restricted to $\mathbb{R}^n$ before applying the summation condition $\sum_{i=1}^n x_i = 0$. Nothing belongs to $U$ without being in $\mathbb{R}^n$.

**Thus proved:**  
$$U \subseteq \mathbb{R}^n \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**  
$$0 \in U \implies U \neq \emptyset$$

**Assumptions:**  
Set definition of $U = \left\{ x \in \mathbb{R}^n : \sum_{i=1}^n x_i = 0 \right\}$.

**Proof:**  
*Since we have* the zero vector $0 = (0, 0, \dots, 0)^T \in \mathbb{R}^n$:

$$\sum_{i=1}^n 0_i = 0 + 0 + \dots + 0 = 0$$

The zero vector satisfies the defining summation condition of $U$.

**Thus proved:**  
$$0 \in U \implies U \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition (Inner Opⁿ)

**To prove:**  
$$x, y \in U \implies x + y \in U$$

**Assumptions:**  
Let $x, y \in U$ be arbitrary vectors.

**Proof:**  
*Since we have* $x \in U$ and $y \in U$, unpacking their definitions gives:

$$\sum_{i=1}^n x_i = 0 \quad \text{and} \quad \sum_{i=1}^n y_i = 0$$

Evaluating the component-wise sum of $x + y$:

$$\sum_{i=1}^n (x + y)_i = \sum_{i=1}^n (x_i + y_i) = \sum_{i=1}^n x_i + \sum_{i=1}^n y_i = 0 + 0 = 0$$

Since $\sum_{i=1}^n (x + y)_i = 0$, the vector $x + y$ satisfies the defining condition of $U$.

**Thus proved:**  
$$x + y \in U \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication (Outer Opⁿ)

**To prove:**  
$$x \in U, \, \lambda \in \mathbb{R} \implies \lambda x \in U$$

**Assumptions:**  
Let $x \in U$ be an arbitrary vector, and $\lambda \in \mathbb{R}$ be an arbitrary scalar.

**Proof:**  
*Since we have* $x \in U \implies \sum_{i=1}^n x_i = 0$:

$$\sum_{i=1}^n (\lambda x)_i = \sum_{i=1}^n \lambda x_i = \lambda \sum_{i=1}^n x_i = \lambda \cdot 0 = 0$$

Since $\sum_{i=1}^n (\lambda x)_i = 0$, the scaled vector $\lambda x$ satisfies the defining condition of $U$.

**Thus proved:**  
$$\lambda x \in U \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Overall Conclusion)

*Since we have* established:
1. $U \subseteq \mathbb{R}^n$ (Step 1)
2. $U \neq \emptyset$ because $0 \in U$ (Step 2)
3. $x, y \in U \implies x + y \in U$ (Step 3)
4. $x \in U, \lambda \in \mathbb{R} \implies \lambda x \in U$ (Step 4)

All remaining vector space axioms (associativity, commutativity, distributivity, neutral element) are inherited directly from ambient space $\mathbb{R}^n$ because $U \subseteq \mathbb{R}^n$.

$$\therefore U \text{ is a subspace of } \mathbb{R}^n. \quad \blacksquare$$

---
---

# Q2 (2 Marks — 8 Min)

### Problem Statement
Given $A \in \mathbb{R}^{3 \times 5}$ and $b \in \mathbb{R}^3$:
$$A = \begin{pmatrix} 1 & 2 & 3 & 4 & 6 \\ 1 & 1 & 7 & 4 & 4 \\ 1 & 5 & 4 & 2 & 1 \end{pmatrix}, \quad b = \begin{pmatrix} 60 \\ 60 \\ 36 \end{pmatrix}$$
(i) Find the particular solution $x_p$ of $Ax = b$.  
(ii) Find all solutions of the homogeneous system $Ax = 0$.  
(iii) Express the general solution $x_g$.

---

### Step 1: Form Augmented Matrix

**To prove:**  
Form the augmented matrix $[A \mid b]$ representing the system of 3 equations and 5 unknowns.

**Assumptions:**  
Matrix $A$ and column vector $b$ given by problem prompt.

**Proof:**  
*Since we have* $A \in \mathbb{R}^{3 \times 5}$ and $b \in \mathbb{R}^3$, assemble $[A \mid b]$:

$$[A \mid b] = \begin{pmatrix} 1 & 2 & 3 & 4 & 6 & \mid & 60 \\ 1 & 1 & 7 & 4 & 4 & \mid & 60 \\ 1 & 5 & 4 & 2 & 1 & \mid & 36 \end{pmatrix}$$

**Thus proved:**  
The augmented matrix $[A \mid b]$ is established.

<br/>

### Step 2: Forward Pass (REF) & Rank Consistency

**To prove:**  
Reduce $[A \mid b]$ to Row Echelon Form (REF) and determine system consistency.

**Assumptions:**  
Elementary row operations preserve the solution set of the system.

**Proof:**  
*Since we have* $[A \mid b]$, apply named row operations:

1. Apply $R_2 \leftarrow R_2 - R_1$ and $R_3 \leftarrow R_3 - R_1$:
$$\begin{pmatrix} 1 & 2 & 3 & 4 & 6 & \mid & 60 \\ 0 & -1 & 4 & 0 & -2 & \mid & 0 \\ 0 & 3 & 1 & -2 & -5 & \mid & -24 \end{pmatrix}$$

2. Apply $R_3 \leftarrow R_3 + 3R_2$ and $R_2 \leftarrow (-1)R_2$:
$$\begin{pmatrix} 1 & 2 & 3 & 4 & 6 & \mid & 60 \\ 0 & 1 & -4 & 0 & 2 & \mid & 0 \\ 0 & 0 & 13 & -2 & -11 & \mid & -24 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in columns 1, 2, and 3 ($1, 1, 13$).

**Rank Consistency Line:**  
$$\text{rank}(A) = \text{rank}([A \mid b]) = 3 < 5$$

Since $\text{rank}(A) = \text{rank}([A \mid b]) = 3$, the system is **consistent**.  
Since $\text{rank}(A) = 3 < 5 = n$, there are **infinitely many solutions**.

**Variable Classification:**  
- **Basic (Pivot) Variables:** $x_1, x_2, x_3$  
- **Free Variables:** $x_4, x_5$  

**Rank–Nullity Check:**  
$$\text{nullity}(A) = n - \text{rank}(A) = 5 - 3 = 2 \implies 2 \text{ null-space basis vectors}$$

**Thus proved:**  
The system is consistent with 3 basic variables and 2 free variables.

<br/>

### Step 3: Backward Pass (RREF)

**To prove:**  
Reduce REF to Reduced Row Echelon Form (RREF).

**Assumptions:**  
REF matrix from Step 2.

**Proof:**  
*Since we have* the REF matrix:

1. Apply $R_3 \leftarrow \frac{1}{13} R_3$:
$$\begin{pmatrix} 1 & 2 & 3 & 4 & 6 & \mid & 60 \\ 0 & 1 & -4 & 0 & 2 & \mid & 0 \\ 0 & 0 & 1 & -2/13 & -11/13 & \mid & -24/13 \end{pmatrix}$$

2. Apply $R_1 \leftarrow R_1 - 3R_3$ and $R_2 \leftarrow R_2 + 4R_3$:
$$\begin{pmatrix} 1 & 2 & 0 & 58/13 & 111/13 & \mid & 852/13 \\ 0 & 1 & 0 & -8/13 & -18/13 & \mid & -96/13 \\ 0 & 0 & 1 & -2/13 & -11/13 & \mid & -24/13 \end{pmatrix}$$

3. Apply $R_1 \leftarrow R_1 - 2R_2$:
$$\begin{pmatrix} 1 & 0 & 0 & 74/13 & 147/13 & \mid & 1044/13 \\ 0 & 1 & 0 & -8/13 & -18/13 & \mid & -96/13 \\ 0 & 0 & 1 & -2/13 & -11/13 & \mid & -24/13 \end{pmatrix} \quad (\text{RREF})$$

**Thus proved:**  
The RREF matrix is established.

<br/>

### Step 4: Particular Solution $x_p$

**To prove:**  
Find a single particular solution $x_p$ satisfying $A x_p = b$.

**Assumptions:**  
Set free variables to zero ($x_4 = 0, x_5 = 0$).

**Proof:**  
*Since we have* the RREF equations with $x_4 = 0, x_5 = 0$:

$$x_1 = \frac{1044}{13}, \quad x_2 = -\frac{96}{13}, \quad x_3 = -\frac{24}{13}$$

**Thus proved:**  
$$x_p = \frac{1}{13} \begin{pmatrix} 1044 \\ -96 \\ -24 \\ 0 \\ 0 \end{pmatrix}$$

<br/>

### Step 5: Homogeneous System Solution $x_h$ (5-Component Split)

**To prove:**  
Find all solutions $x_h$ satisfying $A x_h = 0$.

**Assumptions:**  
RREF matrix with right-hand side set to zero ($b=0$).

**Proof:**  
*Since we have* the RREF system with right-hand side zero, express basic variables in terms of free variables $x_4, x_5$:

$$x_1 = -\frac{74}{13}x_4 - \frac{147}{13}x_5, \quad x_2 = \frac{8}{13}x_4 + \frac{18}{13}x_5, \quad x_3 = \frac{2}{13}x_4 + \frac{11}{13}x_5$$

**Full 5-Component Column Factoring Split:**
$$x_h = \begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{pmatrix} = \begin{pmatrix} -\frac{74}{13}x_4 - \frac{147}{13}x_5 \\[2pt] \frac{8}{13}x_4 + \frac{18}{13}x_5 \\[2pt] \frac{2}{13}x_4 + \frac{11}{13}x_5 \\[2pt] x_4 \\[2pt] x_5 \end{pmatrix} = x_4 \begin{pmatrix} -74/13 \\ 8/13 \\ 2/13 \\ 1 \\ 0 \end{pmatrix} + x_5 \begin{pmatrix} -147/13 \\ 18/13 \\ 11/13 \\ 0 \\ 1 \end{pmatrix}$$

Absorbing factor $\frac{1}{13}$ into arbitrary scalars $\lambda_1, \lambda_2 \in \mathbb{R}$:

$$h_1 = \begin{pmatrix} -74 \\ 8 \\ 2 \\ 13 \\ 0 \end{pmatrix}, \quad h_2 = \begin{pmatrix} -147 \\ 18 \\ 11 \\ 0 \\ 13 \end{pmatrix}$$

**Thus proved:**  
$$x_h = \lambda_1 h_1 + \lambda_2 h_2 = \lambda_1 \begin{pmatrix} -74 \\ 8 \\ 2 \\ 13 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -147 \\ 18 \\ 11 \\ 0 \\ 13 \end{pmatrix}, \quad \lambda_1, \lambda_2 \in \mathbb{R}$$

<br/>

### Step 6: General Solution $x_g$ & Verification

**To prove:**  
Express the general solution $x_g = x_p + x_h$ and verify correctness.

**Assumptions:**  
Particular solution $x_p$ from Step 4 and homogeneous solution $x_h$ from Step 5.

**Proof:**  
*Since we have* $A x_p = b$ and $A x_h = 0$:

$$A(x_p + x_h) = A x_p + A x_h = b + 0 = b$$

**General Solution Expression:**  
$$x_g = \frac{1}{13}\begin{pmatrix} 1044 \\ -96 \\ -24 \\ 0 \\ 0 \end{pmatrix} + \lambda_1 \begin{pmatrix} -74 \\ 8 \\ 2 \\ 13 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -147 \\ 18 \\ 11 \\ 0 \\ 13 \end{pmatrix}, \quad \lambda_1, \lambda_2 \in \mathbb{R}$$

**Verification Table:**

| Vector | Computation $A \cdot (\text{vector})$ | Expected Output | Status |
| :---: | :---: | :---: | :---: |
| $x_p$ | $\frac{1}{13} A \cdot (1044, -96, -24, 0, 0)^T$ | $\begin{pmatrix} 60 \\ 60 \\ 36 \end{pmatrix} = b$ | $\checkmark$ Verified |
| $h_1$ | $A \cdot (-74, 8, 2, 13, 0)^T$ | $\begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix} = 0$ | $\checkmark$ Verified |
| $h_2$ | $A \cdot (-147, 18, 11, 0, 13)^T$ | $\begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix} = 0$ | $\checkmark$ Verified |

**Thus proved:**  
The general solution $x_g$ is fully established and verified. $\quad \blacksquare$

---
---

# Q3 (2 Marks — 8 Min)

### Problem Statement
Given $C \in \mathbb{R}^{3 \times 5}$:
$$C = \begin{pmatrix} 1 & 2 & 1 & 2 & -1 \\ 1 & 1 & 0 & -1 & 4 \\ 1 & -2 & 4 & 1 & 0 \end{pmatrix}$$
(i) Prove that $\text{Col}(C)$ is a subspace of $\mathbb{R}^3$. Find its basis and dimension.  
(ii) Prove that $\text{Row}(C)$ is a subspace of $\mathbb{R}^5$. Find its basis and dimension.

---

### Step 0: Single REF Reduction (Shared for Parts i & ii)

Apply $R_2 \leftarrow R_2 - R_1$ and $R_3 \leftarrow R_3 - R_1$:
$$\begin{pmatrix} 1 & 2 & 1 & 2 & -1 \\ 0 & -1 & -1 & -3 & 5 \\ 0 & -4 & 3 & -1 & 1 \end{pmatrix}$$

Apply $R_3 \leftarrow R_3 - 4R_2$:
$$\begin{pmatrix} 1 & 2 & 1 & 2 & -1 \\ 0 & -1 & -1 & -3 & 5 \\ 0 & 0 & 7 & 11 & -19 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **columns 1, 2, and 3** ($1, -1, 7$). Thus, $\text{rank}(C) = 3$.

---

## Part (i): Column Space $\text{Col}(C)$

**AIM:** Prove $U = \text{Col}(C)$ is a subspace of $\mathbb{R}^3$, and determine its basis and dimension.

<br/>

### Step 1: Setup (Subset Property)

**Given:**  
$U = \text{span}\{c_1, c_2, c_3, c_4, c_5\} = \left\{ x \in \mathbb{R}^3 : x = \sum_{i=1}^5 a_i c_i, a_i \in \mathbb{R} \right\}$ and ambient space $V = \mathbb{R}^3$.

**Proof:**  
*Since we have* each column vector $c_i \in \mathbb{R}^3$, and vector space $\mathbb{R}^3$ is closed under vector addition ($+$) and scalar multiplication ($\cdot$), any linear combination $x = \sum_{i=1}^5 a_i c_i$ remains inside $\mathbb{R}^3$.

**Thus proved:**  
$$U \subseteq \mathbb{R}^3 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**  
$$0 \in U \implies U \neq \emptyset$$

**Assumptions:**  
Definition of set $U = \text{span}\{c_1, \dots, c_5\}$.

**Proof:**  
*Since we have* scalar coefficients $a_1 = a_2 = a_3 = a_4 = a_5 = 0$:

$$\sum_{i=1}^5 0 \cdot c_i = 0 \cdot c_1 + 0 \cdot c_2 + 0 \cdot c_3 + 0 \cdot c_4 + 0 \cdot c_5 = \begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}$$

The zero vector is expressible as a linear combination of $\{c_i\}$.

**Thus proved:**  
$$0 \in U \implies U \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition

**To prove:**  
$$x, y \in U \implies x + y \in U$$

**Assumptions:**  
Let $x, y \in U$ be arbitrary vectors, where $x = \sum_{i=1}^5 a_i c_i$ ($a_i \in \mathbb{R}$) and $y = \sum_{i=1}^5 b_i c_i$ ($b_i \in \mathbb{R}$).

**Proof:**  
*Since we have* $x = \sum_{i=1}^5 a_i c_i$ and $y = \sum_{i=1}^5 b_i c_i$:

$$x + y = \sum_{i=1}^5 a_i c_i + \sum_{i=1}^5 b_i c_i = \sum_{i=1}^5 (a_i + b_i) c_i$$

Define $d_i = a_i + b_i$. Since $a_i, b_i \in \mathbb{R}$ and $\mathbb{R}$ is closed under $+$, $d_i \in \mathbb{R}$.

$$x + y = \sum_{i=1}^5 d_i c_i, \quad d_i \in \mathbb{R}$$

The sum $x + y$ is expressible as a linear combination of $\{c_i\}$ with real coefficients.

**Thus proved:**  
$$x + y \in U \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**  
$$x \in U, \, \lambda \in \mathbb{R} \implies \lambda x \in U$$

**Assumptions:**  
Let $x = \sum_{i=1}^5 a_i c_i$ ($a_i \in \mathbb{R}$) be an arbitrary vector, and $\lambda \in \mathbb{R}$ be an arbitrary scalar.

**Proof:**  
*Since we have* $x = \sum_{i=1}^5 a_i c_i$:

$$\lambda x = \lambda \sum_{i=1}^5 a_i c_i = \sum_{i=1}^5 (\lambda a_i) c_i$$

Define $e_i = \lambda a_i$. Since $\lambda, a_i \in \mathbb{R}$ and $\mathbb{R}$ is closed under $\times$, $e_i \in \mathbb{R}$.

$$\lambda x = \sum_{i=1}^5 e_i c_i, \quad e_i \in \mathbb{R}$$

The scaled vector $\lambda x$ is expressible as a linear combination of $\{c_i\}$ with real coefficients.

**Thus proved:**  
$$\lambda x \in U \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE & Basis/Dimension Conclusion

*Since we have* $U \neq \emptyset$, $U$ closed under $+$, and $U$ closed under $\lambda \cdot$, remaining axioms are inherited from $\mathbb{R}^3$. Hence $\text{Col}(C)$ is a subspace of $\mathbb{R}^3$.

- **Basis Selection Rule:** Pivot columns of the **ORIGINAL** matrix $C$ (Columns 1, 2, 3):
  $$\text{Basis}(\text{Col}(C)) = \left\{ \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 2 \\ 1 \\ -2 \end{pmatrix}, \begin{pmatrix} 1 \\ 0 \\ 4 \end{pmatrix} \right\}$$
- **Dimension:** $\dim(\text{Col}(C)) = 3 \implies \text{Col}(C) = \mathbb{R}^3$. $\quad \blacksquare$

---

## Part (ii): Row Space $\text{Row}(C)$

**AIM:** Prove $W = \text{Row}(C)$ is a subspace of $\mathbb{R}^5$, and determine its basis and dimension.

<br/>

### Step 1: Setup (Subset Property)

**Given:**  
$W = \text{span}\{r_1, r_2, r_3\} = \left\{ x \in \mathbb{R}^5 : x = \sum_{i=1}^3 a_i r_i, a_i \in \mathbb{R} \right\}$ and ambient space $V = \mathbb{R}^5$.

**Proof:**  
*Since we have* each row vector $r_i \in \mathbb{R}^5$, and $\mathbb{R}^5$ is closed under $+$ and $\cdot$, any linear combination $x = \sum_{i=1}^3 a_i r_i$ remains inside $\mathbb{R}^5$.

**Thus proved:**  
$$W \subseteq \mathbb{R}^5 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**  
$$0 \in W \implies W \neq \emptyset$$

**Proof:**  
*Since we have* coefficients $a_1 = a_2 = a_3 = 0 \implies 0 \cdot r_1 + 0 \cdot r_2 + 0 \cdot r_3 = (0, 0, 0, 0, 0)$.

**Thus proved:**  
$$0 \in W \implies W \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Steps 3 & 4: Closures

- **Addition:** *Since we have* $x = \sum a_i r_i$ and $y = \sum b_i r_i$, $x + y = \sum (a_i + b_i)r_i = \sum d_i r_i$ where $d_i = a_i + b_i \in \mathbb{R}$.  
  **Thus proved:** $x + y \in W$.
- **Scalar Mult:** *Since we have* $x = \sum a_i r_i$, $\lambda x = \sum (\lambda a_i)r_i = \sum e_i r_i$ where $e_i = \lambda a_i \in \mathbb{R}$.  
  **Thus proved:** $\lambda x \in W$.

<br/>

### HENCE & Basis/Dimension Conclusion

*Since we have* $W \neq \emptyset$, $W$ closed under $+$, and $W$ closed under $\lambda \cdot$, remaining axioms are inherited from $\mathbb{R}^5$. Hence $\text{Row}(C)$ is a subspace of $\mathbb{R}^5$.

- **Basis Selection Rule:** Non-zero rows of the **REF** matrix:
  $$\text{Basis}(\text{Row}(C)) = \left\{ (1, 2, 1, 2, -1), \, (0, -1, -1, -3, 5), \, (0, 0, 7, 11, -19) \right\}$$
- **Dimension:** $\dim(\text{Row}(C)) = 3$. $\quad \blacksquare$

> [!NOTE]
> **Fundamental Identity:** $\dim(\text{Col}(C)) = \dim(\text{Row}(C)) = 3 = \text{rank}(C)$ *(Row Rank = Column Rank)*.

---
---

# Q4 (2 Marks — 8 Min)

### Problem Statement
Given $v_1 = (1,0,2)^T, v_2 = (1,2,2)^T$ spanning subspace $S_1 = \text{span}\{v_1, v_2\} \subset \mathbb{R}^3$, and $w_1 = (1,1,0)^T, w_2 = (0,1,1)^T$ spanning subspace $S_2 = \text{span}\{w_1, w_2\} \subset \mathbb{R}^3$:  
(a) Prove that $S_1 \cap S_2$ is a subspace of $\mathbb{R}^3$.  
(b) Find the basis and dimension of $S_1 \cap S_2$.

---

## Part (a): Prove $S_1 \cap S_2$ is a Subspace of $\mathbb{R}^3$

**AIM:** Prove that $S_1 \cap S_2$ is a subspace of $\mathbb{R}^3$.

<br/>

### Step 1: Setup (Subset Property)

**Given:**  
$S_1, S_2$ are subspaces of $\mathbb{R}^3$ (given by problem prompt).

**Proof:**  
*Since we have* $x \in S_1 \cap S_2 \implies x \in S_1$. Since $S_1 \subseteq \mathbb{R}^3$, $x \in \mathbb{R}^3$.

**Thus proved:**  
$$S_1 \cap S_2 \subseteq S_1 \subseteq \mathbb{R}^3 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**  
$$0 \in S_1 \cap S_2 \implies S_1 \cap S_2 \neq \emptyset$$

**Proof:**  
*Since we have* $S_1$ is a subspace $\implies 0 \in S_1$, and $S_2$ is a subspace $\implies 0 \in S_2$.

**Thus proved:**  
$$0 \in S_1 \cap S_2 \implies S_1 \cap S_2 \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition

**To prove:**  
$$x, y \in S_1 \cap S_2 \implies x + y \in S_1 \cap S_2$$

**Assumptions:**  
Let $x, y \in S_1 \cap S_2 \implies x, y \in S_1$ and $x, y \in S_2$.

**Proof:**  
*Since we have* $x, y$ in both subspaces:
- In $S_1$: $x = a_1 v_1 + a_2 v_2$, $y = b_1 v_1 + b_2 v_2 \implies x + y = (a_1+b_1)v_1 + (a_2+b_2)v_2 = d_1 v_1 + d_2 v_2 \in S_1$ where $d_i = a_i + b_i \in \mathbb{R}$.
- In $S_2$: $x = a_3 w_1 + a_4 w_2$, $y = b_3 w_1 + b_4 w_2 \implies x + y = (a_3+b_3)w_1 + (a_4+b_4)w_2 = d_3 w_1 + d_4 w_2 \in S_2$ where $d_i = a_i + b_i \in \mathbb{R}$.

**Thus proved:**  
$$x + y \in S_1 \text{ and } x + y \in S_2 \implies x + y \in S_1 \cap S_2 \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**  
$$x \in S_1 \cap S_2, \, \lambda \in \mathbb{R} \implies \lambda x \in S_1 \cap S_2$$

**Assumptions:**  
Let $x \in S_1 \cap S_2$ arbitrary and $\lambda \in \mathbb{R}$.

**Proof:**  
*Since we have* $x$ in both subspaces:
- In $S_1$: $\lambda x = (\lambda a_1)v_1 + (\lambda a_2)v_2 = e_1 v_1 + e_2 v_2 \in S_1$ where $e_i = \lambda a_i \in \mathbb{R}$.
- In $S_2$: $\lambda x = (\lambda a_3)w_1 + (\lambda a_4)w_2 = e_3 w_1 + e_4 w_2 \in S_2$ where $e_i = \lambda a_i \in \mathbb{R}$.

**Thus proved:**  
$$\lambda x \in S_1 \text{ and } \lambda x \in S_2 \implies \lambda x \in S_1 \cap S_2 \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Conclusion for Part a)

*Since we have* $S_1 \cap S_2 \neq \emptyset$, closed under $+$, and closed under $\lambda \cdot$, remaining axioms are inherited from $\mathbb{R}^3$.

$$\therefore S_1 \cap S_2 \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

---

## Part (b): Basis and Dimension of $S_1 \cap S_2$

<br/>

### Step 5: Equate Parametrisations (Membership Equation)

**To prove:**  
Set up the homogeneous system $M z = 0$ for vector membership in $S_1 \cap S_2$.

**Proof:**  
*Since we have* $x \in S_1 \cap S_2$, express $x$ using both spanning recipes:

$$x = a v_1 + b v_2 \quad \text{and} \quad x = c w_1 + d w_2$$

Equate both recipes and move all terms to one side:

$$a v_1 + b v_2 - c w_1 - d w_2 = 0$$

$$a \begin{pmatrix} 1 \\ 0 \\ 2 \end{pmatrix} + b \begin{pmatrix} 1 \\ 2 \\ 2 \end{pmatrix} - c \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix} - d \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}$$

**Thus proved:**  
The membership equation is converted to $M z = 0$ with unknown vector $z = (a, b, c, d)^T$.

<br/>

### Step 6: Form Matrix $M$ & Row-Reduce

**To prove:**  
Solve $M z = 0$ via row reduction to find non-trivial coefficient solutions.

**Proof:**  
*Since we have* matrix $M = [v_1 \quad v_2 \quad -w_1 \quad -w_2]$:

$$M = \begin{pmatrix} 1 & 1 & -1 & 0 \\ 0 & 2 & -1 & -1 \\ 2 & 2 & 0 & -1 \end{pmatrix}$$

Apply $R_3 \leftarrow R_3 - 2R_1$:
$$\begin{pmatrix} 1 & 1 & -1 & 0 \\ 0 & 2 & -1 & -1 \\ 0 & 0 & 2 & -1 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in columns 1, 2, and 3 $\implies \text{rank}(M) = 3$.

- **Basic variables:** $a, b, c$
- **Free variable:** $d$
- **Rank–Nullity Theorem:**
  $$\text{nullity}(M) = (\text{number of columns}) - \text{rank}(M) = 4 - 3 = 1 \implies 1 \text{ free variable } (d)$$

**Thus proved:**  
The solution family has exactly 1 free variable $d$.

<br/>

### Step 7: Back-Substitution & Dual Verification

**To prove:**  
Recover the intersection vector and verify consistency across both $S_1$ and $S_2$ routes.

**Proof:**  
*Since we have* the REF equations:
- From $R_3$: $2c - d = 0 \implies c = d/2$
- From $R_2$: $2b - c - d = 0 \implies 2b = d/2 + d = 3d/2 \implies b = 3d/4$
- From $R_1$: $a + b - c = 0 \implies a = c - b = d/2 - 3d/4 = -d/4$

Setting $d = 4$ yields: $a = -1, \, b = 3, \, c = 2, \, d = 4$.

**Dual Vector Verification:**
- Via $S_1$: $x = -1(1,0,2)^T + 3(1,2,2)^T = (-1+3, 0+6, -2+6)^T = (2, 6, 4)^T$
- Via $S_2$: $x = 2(1,1,0)^T + 4(0,1,1)^T = (2+0, 2+4, 0+4)^T = (2, 6, 4)^T \quad \checkmark \text{ Verified!}$

Scaling down by 2 gives primitive vector $u = (1, 3, 2)^T$.

**Thus proved:**  
Vector $u = (1, 3, 2)^T$ belongs to $S_1 \cap S_2$.

<br/>

### Step 8: Basis and Dimension Conclusion

*Since we have* verified that all solutions are scalar multiples of $u = (1, 3, 2)^T$:

- **Basis of $S_1 \cap S_2$:**
  $$\text{Basis}(S_1 \cap S_2) = \left\{ \begin{pmatrix} 1 \\ 3 \\ 2 \end{pmatrix} \right\}$$
- **Dimension:** $\dim(S_1 \cap S_2) = 1 \quad (= \text{nullity}(M))$. $\quad \blacksquare$

> [!TIP]
> **Dimension Formula Cross-Check:**  
> $\dim(S_1 + S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 1 = 3 = \text{rank}[v_1 \ v_2 \ w_1 \ w_2] \quad \checkmark$

---
---

# Q5 (3 Marks — 10 Min)

### Problem Statement
Given $v_1 = (1,1,0,0)^T, v_2 = (0,1,1,0)^T$ spanning $S_1 = \text{span}\{v_1, v_2\} \subset \mathbb{R}^4$, and $w_1 = (0,0,1,1)^T, w_2 = (0,0,0,1)^T$ spanning $S_2 = \text{span}\{w_1, w_2\} \subset \mathbb{R}^4$.  
Set definition: $S_1 + S_2 = \{ x + y : x \in S_1, y \in S_2 \}$.  
(a) Prove that $S_1 + S_2$ is a subspace of $\mathbb{R}^4$.  
(b) Find the basis and dimension of $S_1 + S_2$.

---

## Part (a): Prove $S_1 + S_2$ is a Subspace of $\mathbb{R}^4$

**AIM:** Prove that $S_1 + S_2$ is a subspace of $\mathbb{R}^4$.

<br/>

### Step 1: Setup (Subset Property)

**Given:**  
$S_1 + S_2 = \{ p \in \mathbb{R}^4 : p = x + y, x \in S_1, y \in S_2 \}$ and ambient space $V = \mathbb{R}^4$.

**Proof:**  
*Since we have* $x \in S_1 \subseteq \mathbb{R}^4$ and $y \in S_2 \subseteq \mathbb{R}^4$, and $\mathbb{R}^4$ is closed under vector addition ($+$), the sum $x + y \in \mathbb{R}^4$.

**Thus proved:**  
$$S_1 + S_2 \subseteq \mathbb{R}^4 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**  
$$0 \in S_1 + S_2 \implies S_1 + S_2 \neq \emptyset$$

**Proof:**  
*Since we have* $S_1, S_2$ as subspaces $\implies 0 \in S_1$ and $0 \in S_2$. Express zero vector as $0 = 0 + 0$ with $0 \in S_1, 0 \in S_2$.

**Thus proved:**  
$$0 \in S_1 + S_2 \implies S_1 + S_2 \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition (Piece Split)

**To prove:**  
$$p, q \in S_1 + S_2 \implies p + q \in S_1 + S_2$$

**Assumptions:**  
Let $p, q \in S_1 + S_2$ be arbitrary elements. Unpack into pieces:

$$p = x + y \quad (x \in S_1, y \in S_2) \quad \text{and} \quad q = u + v \quad (u \in S_1, v \in S_2)$$

**Proof:**  
*Since we have* $p = x + y$ and $q = u + v$:

$$p + q = (x + y) + (u + v) = (x + u) + (y + v)$$

Since $S_1$ is a subspace, $x + u \in S_1$. Since $S_2$ is a subspace, $y + v \in S_2$.

**Thus proved:**  
$$p + q \in S_1 + S_2 \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**  
$$p \in S_1 + S_2, \, \lambda \in \mathbb{R} \implies \lambda p \in S_1 + S_2$$

**Assumptions:**  
Let $p = x + y$ ($x \in S_1, y \in S_2$) and $\lambda \in \mathbb{R}$.

**Proof:**  
*Since we have* $p = x + y$:

$$\lambda p = \lambda (x + y) = \lambda x + \lambda y$$

Since $S_1$ is a subspace, $\lambda x \in S_1$. Since $S_2$ is a subspace, $\lambda y \in S_2$.

**Thus proved:**  
$$\lambda p \in S_1 + S_2 \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Conclusion for Part a)

*Since we have* $S_1 + S_2 \neq \emptyset$, closed under $+$, and closed under $\lambda \cdot$, remaining axioms are inherited from $\mathbb{R}^4$.

$$\therefore S_1 + S_2 \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

---

## Part (b): Basis and Dimension of $S_1 + S_2$

<br/>

### Step 5: Pool Spanning Vectors into Matrix $M$

**To prove:**  
Form matrix $M$ by pooling all spanning vectors of $S_1$ and $S_2$ as columns.

**Proof:**  
*Since we have* $S_1 + S_2 = \text{span}\{v_1, v_2, w_1, w_2\}$, assemble $M$:

$$M = \begin{pmatrix} v_1 & v_2 & w_1 & w_2 \end{pmatrix} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 1 & 1 & 0 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

**Thus proved:**  
Matrix $M$ is established.

<br/>

### Step 6: Row-Reduce & Count Pivots

**To prove:**  
Determine linearly independent vectors by reducing $M$ to REF.

**Proof:**  
*Since we have* matrix $M$, apply named row operations:

1. Apply $R_2 \leftarrow R_2 - R_1$:
$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

2. Apply $R_3 \leftarrow R_3 - R_2$:
$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

3. Apply $R_4 \leftarrow R_4 - R_3$:
$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in columns 1, 2, 3, and 4. Thus, $\text{rank}(M) = 4$.

**Thus proved:**  
All four pooled vectors $\{v_1, v_2, w_1, w_2\}$ are linearly independent.

<br/>

### Step 7: Basis and Dimension Conclusion

*Since we have* 4 pivot columns in matrix $M$:

- **Basis Selection Rule:** Pivot columns of original matrix $M$:
  $$\text{Basis}(S_1 + S_2) = \left\{ \begin{pmatrix} 1 \\ 1 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 0 \\ 1 \end{pmatrix} \right\}$$
- **Dimension:** $\dim(S_1 + S_2) = 4$.
- **Space Identity:** Since $\dim(S_1 + S_2) = 4 = \dim \mathbb{R}^4 \implies S_1 + S_2 = \mathbb{R}^4$. $\quad \blacksquare$

<br/>

### Step 8: Dimension Formula Verification

$$\dim(S_1 + S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2)$$
$$\text{Here } \dim S_1 = 2, \quad \dim S_2 = 2, \quad S_1 \cap S_2 = \{0\} \implies \dim(S_1 \cap S_2) = 0$$
$$4 = 2 + 2 - 0 = 4 \quad \checkmark \text{ Confirmed!}$$

---
---

# 📋 Final 60-Second Pre-Submission Checklist

```
[ ] Every proof step strictly follows: To prove → Assumptions → Proof (Since we have) → Thus proved.
[ ] Every question ends with a formal "HENCE ... is a subspace of V" conclusion block.
[ ] Universal variables used consistently: x, y (vectors), λ (scalar), aᵢ, bᵢ (coefficients), dᵢ, eᵢ.
[ ] Never wrote "U ⊆ V, therefore U is a subspace" (subset ≠ subspace).
[ ] All row operations are explicitly named (e.g., R₂ ← R₂ - R₁).
[ ] Rank, basic variables, and free variables are explicitly labeled wherever a linear system was solved.
[ ] Q2 includes full 5-component vector split for x_h and complete verification table.
[ ] Q4 includes dual vector verification from both S₁ and S₂ routes.
[ ] Bases are written as formal sets { ... }, not as unbracketed matrices.
[ ] Dimension formula verified for Q4 and Q5 cross-checks.
```

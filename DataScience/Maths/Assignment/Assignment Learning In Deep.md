# Practise Questions

# TYPE A — Prove a Set Is (or Is Not) a Subspace

---

# Q1

> **This is the real Assignment 1 question — Q1 (1 Mark, 4 min).** Everything after it in TYPE A is practice built around the same skill.

### Question

Prove that the set
$$U = \left\{ x \in \mathbb{R}^n \;:\; \sum_{i=1}^n x_i = 0 \right\}$$
is a subspace of $\mathbb{R}^n$.

---

## Answer

**AIM:** Prove $U$ is a subspace of $\mathbb{R}^n$.

> **Why this one is easier than it looks:** the dimension $n$ is a symbol, not a number, so you cannot write out components. The whole proof therefore runs on **two summation identities** — $\sum(x_i + y_i) = \sum x_i + \sum y_i$ and $\sum \lambda x_i = \lambda \sum x_i$. Learn those two lines and the question is finished.

<br/>

### Step 1: Setup (Subset Property)

**To prove:**
$$U \subseteq \mathbb{R}^n$$

**Assumptions:**
$U = \left\{ x \in \mathbb{R}^n : \sum_{i=1}^n x_i = 0 \right\}$, ambient space $V = \mathbb{R}^n$.

**Proof:**
_Since we have_ the clause $x \in \mathbb{R}^n$ written **before** the colon in the set definition, every candidate vector is already required to live in $\mathbb{R}^n$ before the condition $\sum_{i=1}^n x_i = 0$ is even tested. Nothing can enter $U$ without first being in $\mathbb{R}^n$.

**Thus proved:**
$$U \subseteq \mathbb{R}^n \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**
$$0 \in U \implies U \neq \emptyset$$

**Assumptions:**
The zero vector of $\mathbb{R}^n$ is $0 = (0, 0, \dots, 0)^T$, with all $n$ components equal to $0$.

**Proof:**
_Since we have_ $0 = (0,0,\dots,0)^T \in \mathbb{R}^n$, substitute its components into the defining condition:

$$\sum_{i=1}^n 0_i = \underbrace{0 + 0 + \dots + 0}_{n \text{ terms}} = 0 \quad \checkmark$$

A sum of $n$ zeros is $0$ no matter how large $n$ is, so the zero vector satisfies the defining condition.

**Thus proved:**
$$0 \in U \implies U \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition

**To prove:**
$$x, y \in U \implies x + y \in U$$

**Assumptions:**
Let $x = (x_1, \dots, x_n)^T \in U$ and $y = (y_1, \dots, y_n)^T \in U$ be arbitrary.

**Proof:**
_Since we have_ $x \in U$ and $y \in U$, unpacking the definitions gives two facts:

$$\sum_{i=1}^n x_i = 0 \qquad \text{and} \qquad \sum_{i=1}^n y_i = 0$$

The $i$-th component of $x + y$ is $(x+y)_i = x_i + y_i$. Test it in the defining condition:

$$\sum_{i=1}^n (x+y)_i = \sum_{i=1}^n (x_i + y_i) = \underbrace{\sum_{i=1}^n x_i}_{=\,0 \text{ because } x \in U} + \underbrace{\sum_{i=1}^n y_i}_{=\,0 \text{ because } y \in U} = 0 + 0 = 0$$

The middle step — splitting one sum into two — is legal because addition in $\mathbb{R}$ is commutative and associative, so the $n$ terms may be reordered freely.

**Number check ($n = 4$):** take $x = (1, -1, 5, -5)^T$, sum $= 0 \;\checkmark$, and $y = (2, 3, -4, -1)^T$, sum $= 0 \;\checkmark$. Then $x + y = (3, 2, 1, -6)^T$ and $3 + 2 + 1 - 6 = 0 \;\checkmark$

**Thus proved:**
$$x + y \in U \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**
$$x \in U, \; \lambda \in \mathbb{R} \implies \lambda x \in U$$

**Assumptions:**
Let $x \in U$ be arbitrary and $\lambda \in \mathbb{R}$ be an arbitrary scalar.

**Proof:**
_Since we have_ $x \in U \implies \sum_{i=1}^n x_i = 0$, and the $i$-th component of $\lambda x$ is $(\lambda x)_i = \lambda x_i$:

$$\sum_{i=1}^n (\lambda x)_i = \sum_{i=1}^n \lambda x_i = \lambda \sum_{i=1}^n x_i = \lambda \cdot 0 = 0$$

The common factor $\lambda$ pulls out of the sum by distributivity — every term carries exactly one factor of $\lambda$.

**Number check ($n = 4$):** with $x = (1,-1,5,-5)^T$ and $\lambda = -3$, we get $\lambda x = (-3, 3, -15, 15)^T$ and $-3 + 3 - 15 + 15 = 0 \;\checkmark$

**Thus proved:**
$$\lambda x \in U \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Overall Conclusion)

_Since we have_ established:

1. $U \subseteq \mathbb{R}^n$ (Step 1)
2. $U \neq \emptyset$ because $0 \in U$ (Step 2)
3. $x, y \in U \implies x + y \in U$ (Step 3)
4. $x \in U, \lambda \in \mathbb{R} \implies \lambda x \in U$ (Step 4)

All remaining vector space axioms (associativity, commutativity, distributivity, existence of negatives, neutral element) are inherited from the ambient space $\mathbb{R}^n$ because $U \subseteq \mathbb{R}^n$.

$$\therefore U \text{ is a subspace of } \mathbb{R}^n. \quad \blacksquare$$

<br/>

### Bonus: Basis and Dimension (not asked, but worth knowing)

The single equation $\sum_{i=1}^n x_i = 0$ is a $1 \times n$ homogeneous system with matrix $A = (1 \ 1 \ \cdots \ 1)$, already in RREF with **one pivot** in column 1. So $x_1$ is basic, $x_2, \dots, x_n$ are free, and

$$\dim U = \text{nullity}(A) = n - \text{rank}(A) = n - 1$$

Solving the pivot row gives $x_1 = -(x_2 + x_3 + \dots + x_n)$, so a basis is

$$\text{Basis}(U) = \left\{ (-1,1,0,\dots,0)^T, \; (-1,0,1,\dots,0)^T, \; \dots, \; (-1,0,0,\dots,1)^T \right\}, \qquad \dim U = n-1$$

**Sanity check at $n = 3$:** basis $\{(-1,1,0)^T, (-1,0,1)^T\}$, $\dim = 2$ — the plane $x_1 + x_2 + x_3 = 0$ through the origin, exactly as expected.

> **Reading the answer:** one linear equation set equal to zero always removes exactly one degree of freedom, leaving a hyperplane through the origin. Note the phrase "**equal to zero**" — change the right-hand side to anything else and the zero vector drops out, killing the subspace (see Q4 part (i)).

---

---

# Q2

### Question

Let
$$U = \left\{ x \in \mathbb{R}^4 \;:\; x_1 + 2x_2 - x_3 + 3x_4 = 0 \right\}.$$
(i) Prove that $U$ is a subspace of $\mathbb{R}^4$.
(ii) Find a basis and the dimension of $U$.

---

## Answer

**AIM:** Prove $U$ is a subspace of $\mathbb{R}^4$, then find its basis and dimension.

<br/>

### Step 1: Setup (Subset Property)

**To prove:**
$$U \subseteq \mathbb{R}^4$$

**Assumptions:**
$U = \{ x \in \mathbb{R}^4 : x_1 + 2x_2 - x_3 + 3x_4 = 0 \}$, ambient space $V = \mathbb{R}^4$.

**Proof:**
_Since we have_ the clause $x \in \mathbb{R}^4$ written **before** the colon in the set definition, every candidate vector is already required to live in $\mathbb{R}^4$ before the equation $x_1 + 2x_2 - x_3 + 3x_4 = 0$ is even tested. Nothing outside $\mathbb{R}^4$ can enter $U$.

**Thus proved:**
$$U \subseteq \mathbb{R}^4 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**
$$0 \in U \implies U \neq \emptyset$$

**Assumptions:**
The zero vector of $\mathbb{R}^4$ is $0 = (0,0,0,0)^T$.

**Proof:**
_Since we have_ $0 = (0,0,0,0)^T \in \mathbb{R}^4$, substitute its components into the defining equation:

$$0_1 + 2(0_2) - 0_3 + 3(0_4) = 0 + 2(0) - 0 + 3(0) = 0 \quad \checkmark$$

The zero vector satisfies the defining condition.

**Thus proved:**
$$0 \in U \implies U \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition

**To prove:**
$$x, y \in U \implies x + y \in U$$

**Assumptions:**
Let $x = (x_1,x_2,x_3,x_4)^T \in U$ and $y = (y_1,y_2,y_3,y_4)^T \in U$ be arbitrary.

**Proof:**
_Since we have_ $x \in U$ and $y \in U$, unpacking the definitions gives two facts:

$$x_1 + 2x_2 - x_3 + 3x_4 = 0 \qquad \text{and} \qquad y_1 + 2y_2 - y_3 + 3y_4 = 0$$

Now test the sum $x + y = (x_1+y_1,\; x_2+y_2,\; x_3+y_3,\; x_4+y_4)^T$ in the defining equation:

$$(x_1+y_1) + 2(x_2+y_2) - (x_3+y_3) + 3(x_4+y_4)$$

Regroup the $x$-terms together and the $y$-terms together (allowed by commutativity and associativity of $+$ in $\mathbb{R}$):

$$= \underbrace{\left( x_1 + 2x_2 - x_3 + 3x_4 \right)}_{= \,0 \text{ because } x \in U} + \underbrace{\left( y_1 + 2y_2 - y_3 + 3y_4 \right)}_{= \,0 \text{ because } y \in U} = 0 + 0 = 0$$

**Number check:** take $x = (1, 1, 0, -1)^T$ — indeed $1 + 2 - 0 - 3 = 0$ — and $y = (2, -1, 0, 0)^T$ — indeed $2 - 2 - 0 + 0 = 0$. Their sum is $x + y = (3, 0, 0, -1)^T$ and $3 + 0 - 0 - 3 = 0 \;\checkmark$

**Thus proved:**
$$x + y \in U \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**
$$x \in U, \; \lambda \in \mathbb{R} \implies \lambda x \in U$$

**Assumptions:**
Let $x \in U$ be arbitrary and $\lambda \in \mathbb{R}$ be an arbitrary scalar.

**Proof:**
_Since we have_ $x \in U \implies x_1 + 2x_2 - x_3 + 3x_4 = 0$, test $\lambda x = (\lambda x_1, \lambda x_2, \lambda x_3, \lambda x_4)^T$:

$$\lambda x_1 + 2(\lambda x_2) - \lambda x_3 + 3(\lambda x_4) = \lambda \left( x_1 + 2x_2 - x_3 + 3x_4 \right) = \lambda \cdot 0 = 0$$

The factor $\lambda$ pulls out because every term in the expression is linear (degree exactly one) in the components — this is exactly why linear equations give subspaces and non-linear ones do not.

**Number check:** with $x = (1,1,0,-1)^T$ and $\lambda = 5$, we get $5x = (5,5,0,-5)^T$ and $5 + 10 - 0 - 15 = 0 \;\checkmark$

**Thus proved:**
$$\lambda x \in U \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Part i)

_Since we have_ established:

1. $U \subseteq \mathbb{R}^4$ (Step 1)
2. $U \neq \emptyset$ because $0 \in U$ (Step 2)
3. $x, y \in U \implies x + y \in U$ (Step 3)
4. $x \in U, \lambda \in \mathbb{R} \implies \lambda x \in U$ (Step 4)

All remaining vector space axioms (associativity, commutativity, distributivity, existence of negatives) are inherited from the ambient space $\mathbb{R}^4$ because $U \subseteq \mathbb{R}^4$.

$$\therefore U \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

<br/>

### Step 5: Basis and Dimension (Part ii)

**To prove:**
Find an explicit basis of $U$ and state $\dim U$.

**Proof:**
_Since we have_ the single defining equation, treat it as a $1 \times 4$ homogeneous system $Ax = 0$ with

$$A = \begin{pmatrix} 1 & 2 & -1 & 3 \end{pmatrix}$$

This matrix is already in RREF with **one pivot** in column 1. Therefore:

- **Basic (pivot) variable:** $x_1$
- **Free variables:** $x_2, x_3, x_4$
- **Rank–Nullity:** $\dim U = \text{nullity}(A) = n - \text{rank}(A) = 4 - 1 = 3$

Solve the pivot row for the basic variable:

$$x_1 = -2x_2 + x_3 - 3x_4$$

Write the full 4-component split, letting the free variables carry themselves:

$$x = \begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \end{pmatrix} = \begin{pmatrix} -2x_2 + x_3 - 3x_4 \\ x_2 \\ x_3 \\ x_4 \end{pmatrix} = x_2 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + x_3 \begin{pmatrix} 1 \\ 0 \\ 1 \\ 0 \end{pmatrix} + x_4 \begin{pmatrix} -3 \\ 0 \\ 0 \\ 1 \end{pmatrix}$$

**Verification of each basis vector in the original equation:**

| Vector               | $x_1 + 2x_2 - x_3 + 3x_4$       |      Result      |
| :------------------- | :------------------------------ | :--------------: |
| $u_1 = (-2,1,0,0)^T$ | $-2 + 2(1) - 0 + 3(0) = -2 + 2$ | $0 \;\checkmark$ |
| $u_2 = (1,0,1,0)^T$  | $1 + 2(0) - 1 + 3(0) = 1 - 1$   | $0 \;\checkmark$ |
| $u_3 = (-3,0,0,1)^T$ | $-3 + 2(0) - 0 + 3(1) = -3 + 3$ | $0 \;\checkmark$ |

**Linear independence:** look at components 2, 3, 4 of the three vectors — they form the identity pattern $(1,0,0), (0,1,0), (0,0,1)$. So if $\alpha u_1 + \beta u_2 + \gamma u_3 = 0$, reading rows 2, 3, 4 forces $\alpha = 0$, $\beta = 0$, $\gamma = 0$ immediately. Hence the set is linearly independent, and since it also spans $U$, it is a basis.

**Thus proved:**
$$\text{Basis}(U) = \left\{ \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 1 \\ 0 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} -3 \\ 0 \\ 0 \\ 1 \end{pmatrix} \right\}, \qquad \dim(U) = 3 \quad \blacksquare$$

> **Reading the answer:** one linear equation removed exactly one degree of freedom from $\mathbb{R}^4$, leaving a 3-dimensional hyperplane through the origin.

---

---

# Q3

### Question

Let
$$U = \left\{ x \in \mathbb{R}^3 \;:\; x_1 - x_2 = 0 \;\text{ and }\; x_2 - 2x_3 = 0 \right\}.$$
(i) Prove that $U$ is a subspace of $\mathbb{R}^3$.
(ii) Find a basis and the dimension of $U$.

---

## Answer

**AIM:** Prove $U$ is a subspace of $\mathbb{R}^3$, then find its basis and dimension.

<br/>

### Step 1: Setup (Subset Property)

**To prove:**
$$U \subseteq \mathbb{R}^3$$

**Proof:**
_Since we have_ the clause $x \in \mathbb{R}^3$ stated before the colon, every element of $U$ is an $\mathbb{R}^3$ vector that additionally satisfies **both** conditions $x_1 - x_2 = 0$ and $x_2 - 2x_3 = 0$. Adding conditions can only shrink a set, never push it outside $\mathbb{R}^3$.

**Thus proved:**
$$U \subseteq \mathbb{R}^3 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**
$$0 \in U \implies U \neq \emptyset$$

**Proof:**
_Since we have_ $0 = (0,0,0)^T \in \mathbb{R}^3$, check both conditions separately:

$$\text{Condition 1: } 0_1 - 0_2 = 0 - 0 = 0 \;\checkmark \qquad \text{Condition 2: } 0_2 - 2(0_3) = 0 - 0 = 0 \;\checkmark$$

Both hold, so the zero vector qualifies.

**Thus proved:**
$$0 \in U \implies U \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition

**To prove:**
$$x, y \in U \implies x + y \in U$$

**Assumptions:**
Let $x, y \in U$ be arbitrary. Both must satisfy **both** conditions.

**Proof:**
_Since we have_ $x \in U$ and $y \in U$, unpacking gives four facts:

$$x_1 - x_2 = 0, \quad x_2 - 2x_3 = 0, \quad y_1 - y_2 = 0, \quad y_2 - 2y_3 = 0$$

**Test condition 1 on $x + y$:**
$$(x+y)_1 - (x+y)_2 = (x_1 + y_1) - (x_2 + y_2) = \underbrace{(x_1 - x_2)}_{=\,0} + \underbrace{(y_1 - y_2)}_{=\,0} = 0 + 0 = 0 \;\checkmark$$

**Test condition 2 on $x + y$:**
$$(x+y)_2 - 2(x+y)_3 = (x_2 + y_2) - 2(x_3 + y_3) = \underbrace{(x_2 - 2x_3)}_{=\,0} + \underbrace{(y_2 - 2y_3)}_{=\,0} = 0 + 0 = 0 \;\checkmark$$

Because **both** conditions survive, the sum is back inside $U$.

**Number check:** $x = (2,2,1)^T$ satisfies $2 - 2 = 0$ and $2 - 2(1) = 0$. $y = (6,6,3)^T$ satisfies $6 - 6 = 0$ and $6 - 2(3) = 0$. Sum: $x + y = (8,8,4)^T$, and $8 - 8 = 0 \;\checkmark$, $8 - 2(4) = 0 \;\checkmark$

**Thus proved:**
$$x + y \in U \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**
$$x \in U, \; \lambda \in \mathbb{R} \implies \lambda x \in U$$

**Proof:**
_Since we have_ $x \in U$, both conditions hold. Test $\lambda x = (\lambda x_1, \lambda x_2, \lambda x_3)^T$:

$$\text{Condition 1: } \lambda x_1 - \lambda x_2 = \lambda(x_1 - x_2) = \lambda \cdot 0 = 0 \;\checkmark$$
$$\text{Condition 2: } \lambda x_2 - 2\lambda x_3 = \lambda(x_2 - 2x_3) = \lambda \cdot 0 = 0 \;\checkmark$$

**Number check:** $x = (2,2,1)^T$, $\lambda = -3 \implies \lambda x = (-6,-6,-3)^T$. Then $-6 - (-6) = 0 \;\checkmark$ and $-6 - 2(-3) = -6 + 6 = 0 \;\checkmark$

**Thus proved:**
$$\lambda x \in U \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Part i)

_Since we have_ $U \subseteq \mathbb{R}^3$, $U \neq \emptyset$, $U$ closed under $+$, and $U$ closed under $\lambda \cdot$, and all remaining axioms are inherited from $\mathbb{R}^3$:

$$\therefore U \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

<br/>

### Step 5: Basis and Dimension (Part ii)

**To prove:**
Find an explicit basis of $U$ and state $\dim U$.

**Proof:**
_Since we have_ two simultaneous homogeneous equations, write them as $Ax = 0$:

$$A = \begin{pmatrix} 1 & -1 & 0 \\ 0 & 1 & -2 \end{pmatrix}$$

This matrix is already in REF with pivots in columns 1 and 2, so $\text{rank}(A) = 2$.

- **Basic variables:** $x_1, x_2$
- **Free variable:** $x_3$
- **Rank–Nullity:** $\dim U = n - \text{rank}(A) = 3 - 2 = 1$

Back-substitute, working bottom row upward:

$$\text{Row 2: } x_2 - 2x_3 = 0 \implies x_2 = 2x_3$$
$$\text{Row 1: } x_1 - x_2 = 0 \implies x_1 = x_2 = 2x_3$$

Full 3-component split:

$$x = \begin{pmatrix} x_1 \\ x_2 \\ x_3 \end{pmatrix} = \begin{pmatrix} 2x_3 \\ 2x_3 \\ x_3 \end{pmatrix} = x_3 \begin{pmatrix} 2 \\ 2 \\ 1 \end{pmatrix}$$

**Verification with a real number:** put $x_3 = 7$, giving $x = (14,14,7)^T$. Condition 1: $14 - 14 = 0 \;\checkmark$. Condition 2: $14 - 2(7) = 0 \;\checkmark$

A single non-zero vector is automatically linearly independent, so it is a basis.

**Thus proved:**
$$\text{Basis}(U) = \left\{ \begin{pmatrix} 2 \\ 2 \\ 1 \end{pmatrix} \right\}, \qquad \dim(U) = 1 \quad \blacksquare$$

> **Reading the answer:** two independent linear equations removed two degrees of freedom from $\mathbb{R}^3$, leaving a 1-dimensional line through the origin in the direction $(2,2,1)^T$.

---

---

# Q4

### Question

Determine whether each of the following is a subspace of $\mathbb{R}^3$. Prove your answer.
$$\text{(i) } W_1 = \left\{ x \in \mathbb{R}^3 : x_1 + x_2 + x_3 = 6 \right\} \qquad \text{(ii) } W_2 = \left\{ x \in \mathbb{R}^3 : x_1 x_2 = 0 \right\}$$

---

## Answer

**AIM:** Test each set against the subspace conditions; a single failed condition is enough to disprove.

<br/>

## Part (i): $W_1 = \{ x \in \mathbb{R}^3 : x_1 + x_2 + x_3 = 6 \}$

### Step 1: Test Non-Emptiness / Zero Vector

**To prove:**
$$0 \notin W_1$$

**Proof:**
_Since we have_ $0 = (0,0,0)^T$, substitute into the defining equation:

$$0_1 + 0_2 + 0_3 = 0 + 0 + 0 = 0 \neq 6$$

The defining equation demands the value $6$, but the zero vector produces $0$. The condition fails.

**Thus proved:**
$$0 \notin W_1$$

Every subspace **must** contain the zero vector (take $\lambda = 0$ in the scalar-closure rule: $0 \cdot x = 0$ would have to stay inside). $W_1$ does not, so the test is already decisive.

<br/>

### Step 2: Confirm by Explicit Counterexamples (both closures also fail)

**Addition fails.** Take two genuine members:

$$x = (6,0,0)^T \quad \text{since } 6 + 0 + 0 = 6 \;\checkmark$$
$$y = (0,6,0)^T \quad \text{since } 0 + 6 + 0 = 6 \;\checkmark$$

Their sum is $x + y = (6,6,0)^T$, and

$$6 + 6 + 0 = 12 \neq 6 \implies x + y \notin W_1 \quad \text{(Addition closure FAILS)}$$

**Scalar multiplication fails.** Take $x = (6,0,0)^T \in W_1$ and $\lambda = 2$:

$$\lambda x = (12,0,0)^T \quad \text{and} \quad 12 + 0 + 0 = 12 \neq 6 \implies \lambda x \notin W_1 \quad \text{(Scalar closure FAILS)}$$

<br/>

### HENCE (Part i)

_Since we have_ $0 \notin W_1$, and both closure properties fail with explicit counterexamples:

$$\therefore W_1 \text{ is NOT a subspace of } \mathbb{R}^3. \quad \blacksquare$$

> **The rule to remember:** $x_1 + x_2 + x_3 = 6$ is an **affine plane** — a plane shifted away from the origin by 6 units of "sum". Only the _homogeneous_ version $x_1 + x_2 + x_3 = 0$ (right-hand side $= 0$) is a subspace. Any non-zero constant on the right-hand side kills the subspace instantly.

<br/>

## Part (ii): $W_2 = \{ x \in \mathbb{R}^3 : x_1 x_2 = 0 \}$

This one is more dangerous, because it **passes two of the three tests**. It is still not a subspace.

### Step 1: Zero Vector — PASSES

**Proof:**
_Since we have_ $0 = (0,0,0)^T$, we get $0_1 \cdot 0_2 = 0 \cdot 0 = 0 \;\checkmark$

$$0 \in W_2 \quad \text{(this test gives no objection)}$$

<br/>

### Step 2: Scalar Multiplication — PASSES

**Proof:**
_Since we have_ $x \in W_2 \implies x_1 x_2 = 0$, test $\lambda x$:

$$(\lambda x)_1 (\lambda x)_2 = (\lambda x_1)(\lambda x_2) = \lambda^2 (x_1 x_2) = \lambda^2 \cdot 0 = 0 \;\checkmark$$

$$\lambda x \in W_2 \quad \text{(this test also gives no objection)}$$

<br/>

### Step 3: Vector Addition — FAILS

**To prove:**
$$\exists \, x, y \in W_2 \text{ with } x + y \notin W_2$$

**Proof:**
_Since we have_ freedom in choosing the arbitrary vectors, pick the two "axis" vectors that each satisfy the condition for a _different_ reason:

$$x = (1,0,0)^T \quad \text{since } x_1 x_2 = 1 \cdot 0 = 0 \;\checkmark \quad \text{(second slot is zero)}$$
$$y = (0,1,0)^T \quad \text{since } y_1 y_2 = 0 \cdot 1 = 0 \;\checkmark \quad \text{(first slot is zero)}$$

Now add them:

$$x + y = (1,0,0)^T + (0,1,0)^T = (1,1,0)^T$$

Test the sum:

$$(x+y)_1 (x+y)_2 = 1 \cdot 1 = 1 \neq 0 \implies x + y \notin W_2$$

**Thus proved:**
$$W_2 \text{ is not closed under vector addition.}$$

<br/>

### HENCE (Part ii)

_Since we have_ found explicit $x, y \in W_2$ whose sum $x + y = (1,1,0)^T \notin W_2$, the addition-closure axiom fails.

$$\therefore W_2 \text{ is NOT a subspace of } \mathbb{R}^3. \quad \blacksquare$$

> **The rule to remember:** the condition $x_1 x_2 = 0$ is **not linear** — it multiplies two unknowns together. Geometrically $W_2$ is the _union of two planes_ ($x_1 = 0$ and $x_2 = 0$), and a union of two subspaces is almost never a subspace: you can start on one plane, add a vector from the other, and land off both. Contrast this with the set $U$ in Q1, where the condition was a genuine linear equation set equal to zero.

---

---

# TYPE B — Solve $Ax = b$: Particular, Homogeneous and General Solution

---

# Q5

> **This is the real Assignment 1 question — Q2 (2 Marks, 8 min).** Everything after it in TYPE B is practice built around the same skill.

### Question

Given $A \in \mathbb{R}^{3 \times 5}$ and $b \in \mathbb{R}^3$:
$$A = \begin{pmatrix} 1 & 2 & 3 & 4 & 6 \\ 1 & 1 & 7 & 4 & 4 \\ 1 & 5 & 4 & 2 & 1 \end{pmatrix}, \qquad b = \begin{pmatrix} 60 \\ 60 \\ 36 \end{pmatrix}$$
(i) Find the particular solution $x_p$ of $Ax = b$.
(ii) Find all solutions of the homogeneous system $Ax = 0$.
(iii) Express the general solution $x_g$.

---

## Answer

**AIM:** Row-reduce once, read off $x_p$ with the free variables switched off, then read off $x_h$ with $b$ switched off.

> **The one idea behind all three parts:** a single RREF answers everything. Set the free variables to $0$ and keep the right-hand side to get $x_p$; set the right-hand side to $0$ and let the free variables run to get $x_h$. Add them for $x_g$.

<br/>

### Step 1: Form the Augmented Matrix

**To prove:**
Assemble $[A \mid b]$, representing 3 equations in 5 unknowns.

**Assumptions:**
$A$ and $b$ as given in the prompt; the unknowns are $x_1, x_2, x_3, x_4, x_5$.

**Proof:**
_Since we have_ $A \in \mathbb{R}^{3 \times 5}$ and $b \in \mathbb{R}^3$, glue $b$ on as a sixth column:

$$[A \mid b] = \left(\begin{array}{ccccc|c} 1 & 2 & 3 & 4 & 6 & 60 \\ 1 & 1 & 7 & 4 & 4 & 60 \\ 1 & 5 & 4 & 2 & 1 & 36 \end{array}\right)$$

**Thus proved:**
The augmented matrix is established.

<br/>

### Step 2: Forward Pass (REF) and Rank Consistency

**To prove:**
Reduce $[A \mid b]$ to Row Echelon Form and decide consistency.

**Assumptions:**
Elementary row operations do not change the solution set of the system.

**Proof:**
_Since we have_ a leading $1$ in position $(1,1)$, use it to clear the rest of column 1.

**1.** Apply $R_2 \leftarrow R_2 - R_1$ and $R_3 \leftarrow R_3 - R_1$:

$$\left(\begin{array}{ccccc|c} 1 & 2 & 3 & 4 & 6 & 60 \\ 0 & -1 & 4 & 0 & -2 & 0 \\ 0 & 3 & 1 & -2 & -5 & -24 \end{array}\right)$$

**2.** Apply $R_3 \leftarrow R_3 + 3R_2$ (using the current $R_2$, whose pivot entry is $-1$):

$$\left(\begin{array}{ccccc|c} 1 & 2 & 3 & 4 & 6 & 60 \\ 0 & -1 & 4 & 0 & -2 & 0 \\ 0 & 0 & 13 & -2 & -11 & -24 \end{array}\right)$$

**3.** Apply $R_2 \leftarrow (-1)R_2$ to make the second pivot positive:

$$\left(\begin{array}{ccccc|c} 1 & 2 & 3 & 4 & 6 & 60 \\ 0 & 1 & -4 & 0 & 2 & 0 \\ 0 & 0 & 13 & -2 & -11 & -24 \end{array}\right) \quad (\text{REF})$$

Pivots sit in **columns 1, 2, 3** (values $1, 1, 13$).

**Rank consistency line:**
$$\text{rank}(A) = \text{rank}([A \mid b]) = 3 < 5 = n$$

Since $\text{rank}(A) = \text{rank}([A \mid b])$, the system is **consistent** — there is no row of the form $(0\ 0\ 0\ 0\ 0 \mid \text{non-zero})$. Since $\text{rank}(A) = 3 < 5$, there are **infinitely many solutions**.

**Variable classification:**

- **Basic (pivot) variables:** $x_1, x_2, x_3$ — columns 1, 2, 3 carry pivots
- **Free variables:** $x_4, x_5$ — columns 4, 5 carry no pivot

**Rank–Nullity:**
$$\text{nullity}(A) = n - \text{rank}(A) = 5 - 3 = 2 \implies \text{exactly } 2 \text{ null-space basis vectors}$$

**Thus proved:**
The system is consistent with 3 basic and 2 free variables.

<br/>

### Step 3: Backward Pass (RREF)

**To prove:**
Clear above each pivot to reach Reduced Row Echelon Form.

**Assumptions:**
The REF matrix from Step 2.

**Proof:**
_Since we have_ the REF matrix, normalise the last pivot and work upwards.

**1.** Apply $R_3 \leftarrow \tfrac{1}{13} R_3$:

$$\left(\begin{array}{ccccc|c} 1 & 2 & 3 & 4 & 6 & 60 \\ 0 & 1 & -4 & 0 & 2 & 0 \\ 0 & 0 & 1 & -\tfrac{2}{13} & -\tfrac{11}{13} & -\tfrac{24}{13} \end{array}\right)$$

**2.** Apply $R_1 \leftarrow R_1 - 3R_3$ and $R_2 \leftarrow R_2 + 4R_3$ to clear column 3:

$$\left(\begin{array}{ccccc|c} 1 & 2 & 0 & \tfrac{58}{13} & \tfrac{111}{13} & \tfrac{852}{13} \\[2pt] 0 & 1 & 0 & -\tfrac{8}{13} & -\tfrac{18}{13} & -\tfrac{96}{13} \\[2pt] 0 & 0 & 1 & -\tfrac{2}{13} & -\tfrac{11}{13} & -\tfrac{24}{13} \end{array}\right)$$

**3.** Apply $R_1 \leftarrow R_1 - 2R_2$ to clear column 2:

$$\left(\begin{array}{ccccc|c} 1 & 0 & 0 & \tfrac{74}{13} & \tfrac{147}{13} & \tfrac{1044}{13} \\[2pt] 0 & 1 & 0 & -\tfrac{8}{13} & -\tfrac{18}{13} & -\tfrac{96}{13} \\[2pt] 0 & 0 & 1 & -\tfrac{2}{13} & -\tfrac{11}{13} & -\tfrac{24}{13} \end{array}\right) \quad (\text{RREF})$$

The fractions all carry denominator $13$ because the third pivot was $13$ — this is normal, do not panic and do not round.

**Thus proved:**
The RREF is established.

<br/>

### Step 4: Particular Solution $x_p$

**To prove:**
Find one specific vector $x_p$ with $A x_p = b$.

**Assumptions:**
Switch the free variables off: $x_4 = 0$, $x_5 = 0$.

**Proof:**
_Since we have_ the RREF, each row now reads a basic variable directly. With $x_4 = x_5 = 0$ the free columns vanish and the rows say:

$$x_1 = \frac{1044}{13}, \qquad x_2 = -\frac{96}{13}, \qquad x_3 = -\frac{24}{13}$$

**Number check** (row 1 of the original $A$): $\tfrac{1044}{13} + 2\left(-\tfrac{96}{13}\right) + 3\left(-\tfrac{24}{13}\right) = \tfrac{1044 - 192 - 72}{13} = \tfrac{780}{13} = 60 \;\checkmark$

**Thus proved:**
$$x_p = \frac{1}{13}\begin{pmatrix} 1044 \\ -96 \\ -24 \\ 0 \\ 0 \end{pmatrix}$$

<br/>

### Step 5: Homogeneous Solution $x_h$ (Full 5-Component Split)

**To prove:**
Find every solution of $A x_h = 0$.

**Assumptions:**
The same RREF, now with the right-hand side set to $0$.

**Proof:**
_Since we have_ the RREF with a zero right-hand side, move the free columns across and express each basic variable in terms of $x_4, x_5$:

$$x_1 = -\frac{74}{13}x_4 - \frac{147}{13}x_5, \qquad x_2 = \frac{8}{13}x_4 + \frac{18}{13}x_5, \qquad x_3 = \frac{2}{13}x_4 + \frac{11}{13}x_5$$

Now write the **full 5-component column** and let the free variables carry themselves in rows 4 and 5:

$$x_h = \begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{pmatrix} = \begin{pmatrix} -\tfrac{74}{13}x_4 - \tfrac{147}{13}x_5 \\[3pt] \tfrac{8}{13}x_4 + \tfrac{18}{13}x_5 \\[3pt] \tfrac{2}{13}x_4 + \tfrac{11}{13}x_5 \\[3pt] x_4 \\[3pt] x_5 \end{pmatrix} = x_4 \begin{pmatrix} -\tfrac{74}{13} \\[2pt] \tfrac{8}{13} \\[2pt] \tfrac{2}{13} \\[2pt] 1 \\[2pt] 0 \end{pmatrix} + x_5 \begin{pmatrix} -\tfrac{147}{13} \\[2pt] \tfrac{18}{13} \\[2pt] \tfrac{11}{13} \\[2pt] 0 \\[2pt] 1 \end{pmatrix}$$

Each free variable is an arbitrary real, so the factor $\tfrac{1}{13}$ can be absorbed into it: replace $x_4$ by $13\lambda_1$ and $x_5$ by $13\lambda_2$ to clear all denominators. This is cosmetic — it changes the labels of the scalars, never the set of solutions.

$$h_1 = \begin{pmatrix} -74 \\ 8 \\ 2 \\ 13 \\ 0 \end{pmatrix}, \qquad h_2 = \begin{pmatrix} -147 \\ 18 \\ 11 \\ 0 \\ 13 \end{pmatrix}$$

**Number check** ($A h_1$, row 3): $-74 + 5(8) + 4(2) + 2(13) + 1(0) = -74 + 40 + 8 + 26 = 0 \;\checkmark$

**Thus proved:**
$$x_h = \lambda_1 h_1 + \lambda_2 h_2 = \lambda_1 \begin{pmatrix} -74 \\ 8 \\ 2 \\ 13 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -147 \\ 18 \\ 11 \\ 0 \\ 13 \end{pmatrix}, \qquad \lambda_1, \lambda_2 \in \mathbb{R}$$

<br/>

### Step 6: General Solution $x_g$ and Verification

**To prove:**
Express $x_g = x_p + x_h$ and confirm it solves $Ax = b$.

**Assumptions:**
$x_p$ from Step 4 and $x_h$ from Step 5.

**Proof:**
_Since we have_ $A x_p = b$ and $A x_h = 0$, linearity of matrix multiplication gives:

$$A(x_p + x_h) = A x_p + A x_h = b + 0 = b$$

So every vector of the form $x_p + x_h$ solves the system, and (because $\text{nullity} = 2$ exhausts all freedom) there are no others.

$$x_g = \frac{1}{13}\begin{pmatrix} 1044 \\ -96 \\ -24 \\ 0 \\ 0 \end{pmatrix} + \lambda_1 \begin{pmatrix} -74 \\ 8 \\ 2 \\ 13 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -147 \\ 18 \\ 11 \\ 0 \\ 13 \end{pmatrix}, \qquad \lambda_1, \lambda_2 \in \mathbb{R}$$

**Full verification table:**

| Vector | Row 1 of $A$                   | Row 2 of $A$                   | Row 3 of $A$                   | Expected           |    Status    |
| :----- | :----------------------------- | :----------------------------- | :----------------------------- | :----------------- | :----------: |
| $x_p$  | $\tfrac{1044-192-72}{13} = 60$ | $\tfrac{1044-96-168}{13} = 60$ | $\tfrac{1044-480-96}{13} = 36$ | $b = (60,60,36)^T$ | $\checkmark$ |
| $h_1$  | $-74+16+6+52 = 0$              | $-74+8+14+52 = 0$              | $-74+40+8+26 = 0$              | $0$                | $\checkmark$ |
| $h_2$  | $-147+36+33+78 = 0$            | $-147+18+77+52 = 0$            | $-147+90+44+13 = 0$            | $0$                | $\checkmark$ |

**Thus proved:**
The general solution is established and fully verified. $\quad \blacksquare$

> **Reading the answer:** the solution set is a 2-dimensional plane sitting in $\mathbb{R}^5$, shifted off the origin by $x_p$. It is **not** a subspace — $x_p \neq 0$ means $0$ is not a solution — which is exactly the difference between $Ax = b$ and $Ax = 0$.

---

---

# Q6

### Question

Given $A \in \mathbb{R}^{3 \times 4}$ and $b \in \mathbb{R}^3$:
$$A = \begin{pmatrix} 1 & 2 & -1 & 3 \\ 2 & 4 & 1 & 0 \\ 3 & 6 & 0 & 3 \end{pmatrix}, \qquad b = \begin{pmatrix} 5 \\ 7 \\ 12 \end{pmatrix}$$
(i) Find a particular solution $x_p$ of $Ax = b$.
(ii) Find all solutions of the homogeneous system $Ax = 0$.
(iii) Write the general solution $x_g$.

---

## Answer

### Step 1: Form the Augmented Matrix

**To prove:**
Assemble $[A \mid b]$, representing 3 equations in 4 unknowns.

**Proof:**
_Since we have_ $A \in \mathbb{R}^{3\times 4}$ and $b \in \mathbb{R}^{3}$:

$$[A \mid b] = \begin{pmatrix} 1 & 2 & -1 & 3 & \mid & 5 \\ 2 & 4 & 1 & 0 & \mid & 7 \\ 3 & 6 & 0 & 3 & \mid & 12 \end{pmatrix}$$

Written out, the three equations are
$$x_1 + 2x_2 - x_3 + 3x_4 = 5, \qquad 2x_1 + 4x_2 + x_3 = 7, \qquad 3x_1 + 6x_2 + 3x_4 = 12$$

**Thus proved:**
The augmented matrix is established.

<br/>

### Step 2: Forward Pass (REF) and Rank Consistency

**To prove:**
Reduce $[A \mid b]$ to REF and decide consistency.

**Proof:**
_Since we have_ $[A \mid b]$, apply named row operations.

**1. Apply $R_2 \leftarrow R_2 - 2R_1$** (arithmetic: $2-2(1)=0$, $4-2(2)=0$, $1-2(-1)=3$, $0-2(3)=-6$, $7-2(5)=-3$) **and $R_3 \leftarrow R_3 - 3R_1$** (arithmetic: $3-3=0$, $6-6=0$, $0+3=3$, $3-9=-6$, $12-15=-3$):

$$\begin{pmatrix} 1 & 2 & -1 & 3 & \mid & 5 \\ 0 & 0 & 3 & -6 & \mid & -3 \\ 0 & 0 & 3 & -6 & \mid & -3 \end{pmatrix}$$

**2. Apply $R_2 \leftarrow \tfrac{1}{3} R_2$:**

$$\begin{pmatrix} 1 & 2 & -1 & 3 & \mid & 5 \\ 0 & 0 & 1 & -2 & \mid & -1 \\ 0 & 0 & 3 & -6 & \mid & -3 \end{pmatrix}$$

**3. Apply $R_3 \leftarrow R_3 - 3R_2$:**

$$\begin{pmatrix} 1 & 2 & -1 & 3 & \mid & 5 \\ 0 & 0 & 1 & -2 & \mid & -1 \\ 0 & 0 & 0 & 0 & \mid & 0 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **columns 1 and 3**.

**Rank Consistency Line:**
$$\text{rank}(A) = \text{rank}([A \mid b]) = 2 < 4 = n$$

Since $\text{rank}(A) = \text{rank}([A \mid b])$, the system is **consistent**. Since $\text{rank} = 2 < 4$, there are **infinitely many solutions**.

The vanished last row is not an accident: row 3 of $A$ equals row 1 $+$ row 2, and correspondingly $12 = 5 + 7$ on the right-hand side, so the third equation carried no new information.

**Variable Classification:**

- **Basic (pivot) variables:** $x_1, x_3$
- **Free variables:** $x_2, x_4$

**Rank–Nullity Check:**
$$\text{nullity}(A) = n - \text{rank}(A) = 4 - 2 = 2 \implies 2 \text{ null-space basis vectors}$$

**Thus proved:**
The system is consistent with 2 basic and 2 free variables.

<br/>

### Step 3: Backward Pass (RREF)

**To prove:**
Reduce the REF to RREF so each pivot column is cleared above and below.

**Proof:**
_Since we have_ the REF, the only entry above a pivot that is non-zero is the $-1$ in row 1, column 3.

**Apply $R_1 \leftarrow R_1 + R_2$** (arithmetic: $-1+1 = 0$, $3+(-2) = 1$, $5+(-1) = 4$):

$$\begin{pmatrix} 1 & 2 & 0 & 1 & \mid & 4 \\ 0 & 0 & 1 & -2 & \mid & -1 \\ 0 & 0 & 0 & 0 & \mid & 0 \end{pmatrix} \quad (\text{RREF})$$

The two surviving equations are
$$x_1 + 2x_2 + x_4 = 4 \qquad \text{and} \qquad x_3 - 2x_4 = -1$$

**Thus proved:**
The RREF is established.

<br/>

### Step 4: Particular Solution $x_p$

**To prove:**
Find one specific vector $x_p$ with $A x_p = b$.

**Assumptions:**
Set every free variable to zero: $x_2 = 0$, $x_4 = 0$.

**Proof:**
_Since we have_ the RREF equations with $x_2 = x_4 = 0$:

$$x_1 + 2(0) + 0 = 4 \implies x_1 = 4$$
$$x_3 - 2(0) = -1 \implies x_3 = -1$$

**Verification (multiply out, term by term):** with $x_p = (4,0,-1,0)^T$,

$$\text{Row 1: } 1(4) + 2(0) + (-1)(-1) + 3(0) = 4 + 0 + 1 + 0 = 5 \;\checkmark$$
$$\text{Row 2: } 2(4) + 4(0) + 1(-1) + 0(0) = 8 + 0 - 1 + 0 = 7 \;\checkmark$$
$$\text{Row 3: } 3(4) + 6(0) + 0(-1) + 3(0) = 12 + 0 + 0 + 0 = 12 \;\checkmark$$

**Thus proved:**
$$x_p = \begin{pmatrix} 4 \\ 0 \\ -1 \\ 0 \end{pmatrix}$$

<br/>

### Step 5: Homogeneous Solution $x_h$ (Full 4-Component Split)

**To prove:**
Find all $x_h$ with $A x_h = 0$.

**Proof:**
_Since we have_ the same RREF with the right-hand side set to $0$, express the basic variables in terms of the free ones:

$$x_1 = -2x_2 - x_4, \qquad x_3 = 2x_4$$

Full 4-component column factoring split:

$$x_h = \begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \end{pmatrix} = \begin{pmatrix} -2x_2 - x_4 \\ x_2 \\ 2x_4 \\ x_4 \end{pmatrix} = x_2 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + x_4 \begin{pmatrix} -1 \\ 0 \\ 2 \\ 1 \end{pmatrix}$$

Rename the free variables as arbitrary scalars $\lambda_1 = x_2$, $\lambda_2 = x_4 \in \mathbb{R}$:

$$h_1 = \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix}, \qquad h_2 = \begin{pmatrix} -1 \\ 0 \\ 2 \\ 1 \end{pmatrix}$$

**Verification of $h_1$:**
$$\text{Row 1: } 1(-2) + 2(1) - 1(0) + 3(0) = -2 + 2 = 0 \;\checkmark$$
$$\text{Row 2: } 2(-2) + 4(1) + 1(0) + 0(0) = -4 + 4 = 0 \;\checkmark$$
$$\text{Row 3: } 3(-2) + 6(1) + 0 + 3(0) = -6 + 6 = 0 \;\checkmark$$

**Verification of $h_2$:**
$$\text{Row 1: } 1(-1) + 2(0) - 1(2) + 3(1) = -1 - 2 + 3 = 0 \;\checkmark$$
$$\text{Row 2: } 2(-1) + 4(0) + 1(2) + 0(1) = -2 + 2 = 0 \;\checkmark$$
$$\text{Row 3: } 3(-1) + 6(0) + 0(2) + 3(1) = -3 + 3 = 0 \;\checkmark$$

**Thus proved:**
$$x_h = \lambda_1 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -1 \\ 0 \\ 2 \\ 1 \end{pmatrix}, \qquad \lambda_1, \lambda_2 \in \mathbb{R}$$

<br/>

### Step 6: General Solution $x_g$ and Final Check

**To prove:**
$x_g = x_p + x_h$ solves $Ax = b$ for every choice of $\lambda_1, \lambda_2$.

**Proof:**
_Since we have_ $A x_p = b$ and $A h_1 = A h_2 = 0$, linearity gives

$$A(x_p + \lambda_1 h_1 + \lambda_2 h_2) = A x_p + \lambda_1 (A h_1) + \lambda_2 (A h_2) = b + \lambda_1 \cdot 0 + \lambda_2 \cdot 0 = b$$

**General Solution:**
$$x_g = \begin{pmatrix} 4 \\ 0 \\ -1 \\ 0 \end{pmatrix} + \lambda_1 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -1 \\ 0 \\ 2 \\ 1 \end{pmatrix}, \qquad \lambda_1, \lambda_2 \in \mathbb{R}$$

**Real-number spot check.** Choose $\lambda_1 = 2$ and $\lambda_2 = -1$:

$$x = \begin{pmatrix} 4 \\ 0 \\ -1 \\ 0 \end{pmatrix} + 2\begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} - \begin{pmatrix} -1 \\ 0 \\ 2 \\ 1 \end{pmatrix} = \begin{pmatrix} 4 - 4 + 1 \\ 0 + 2 - 0 \\ -1 + 0 - 2 \\ 0 + 0 - 1 \end{pmatrix} = \begin{pmatrix} 1 \\ 2 \\ -3 \\ -1 \end{pmatrix}$$

$$\text{Row 1: } 1(1) + 2(2) - 1(-3) + 3(-1) = 1 + 4 + 3 - 3 = 5 \;\checkmark$$
$$\text{Row 2: } 2(1) + 4(2) + 1(-3) + 0(-1) = 2 + 8 - 3 = 7 \;\checkmark$$
$$\text{Row 3: } 3(1) + 6(2) + 0(-3) + 3(-1) = 3 + 12 - 3 = 12 \;\checkmark$$

**Thus proved:**
The general solution is established and verified. $\quad \blacksquare$

---

---

# Q7

### Question

Given $A \in \mathbb{R}^{3 \times 5}$ and $b \in \mathbb{R}^3$:
$$A = \begin{pmatrix} 1 & 1 & 1 & 2 & 1 \\ 1 & 2 & 3 & 1 & 0 \\ 2 & 1 & 0 & 1 & 3 \end{pmatrix}, \qquad b = \begin{pmatrix} 8 \\ 9 \\ 11 \end{pmatrix}$$
(i) Find a particular solution $x_p$.
(ii) Find all solutions of $Ax = 0$.
(iii) Write the general solution $x_g$.

---

## Answer

### Step 1: Form the Augmented Matrix

$$[A \mid b] = \begin{pmatrix} 1 & 1 & 1 & 2 & 1 & \mid & 8 \\ 1 & 2 & 3 & 1 & 0 & \mid & 9 \\ 2 & 1 & 0 & 1 & 3 & \mid & 11 \end{pmatrix}$$

<br/>

### Step 2: Forward Pass (REF) and Rank Consistency

**Proof:**
_Since we have_ $[A \mid b]$:

**1. Apply $R_2 \leftarrow R_2 - R_1$** ($1-1=0$, $2-1=1$, $3-1=2$, $1-2=-1$, $0-1=-1$, $9-8=1$) **and $R_3 \leftarrow R_3 - 2R_1$** ($2-2=0$, $1-2=-1$, $0-2=-2$, $1-4=-3$, $3-2=1$, $11-16=-5$):

$$\begin{pmatrix} 1 & 1 & 1 & 2 & 1 & \mid & 8 \\ 0 & 1 & 2 & -1 & -1 & \mid & 1 \\ 0 & -1 & -2 & -3 & 1 & \mid & -5 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 + R_2$** ($-1+1=0$, $-2+2=0$, $-3-1=-4$, $1-1=0$, $-5+1=-4$):

$$\begin{pmatrix} 1 & 1 & 1 & 2 & 1 & \mid & 8 \\ 0 & 1 & 2 & -1 & -1 & \mid & 1 \\ 0 & 0 & 0 & -4 & 0 & \mid & -4 \end{pmatrix} \quad (\text{REF})$$

Notice the pivot in row 3 sits in **column 4**, not column 3 — columns 2 and 3 became proportional during elimination, so column 3 gets skipped.

Pivots lie in **columns 1, 2 and 4**.

**Rank Consistency Line:**
$$\text{rank}(A) = \text{rank}([A \mid b]) = 3 < 5 = n \implies \text{consistent, infinitely many solutions}$$

**Variable Classification:**

- **Basic variables:** $x_1, x_2, x_4$
- **Free variables:** $x_3, x_5$

**Rank–Nullity Check:**
$$\text{nullity}(A) = 5 - 3 = 2 \implies 2 \text{ null-space basis vectors}$$

<br/>

### Step 3: Backward Pass (RREF)

**1. Apply $R_3 \leftarrow -\tfrac{1}{4} R_3$** (turn the pivot $-4$ into $1$):

$$\begin{pmatrix} 1 & 1 & 1 & 2 & 1 & \mid & 8 \\ 0 & 1 & 2 & -1 & -1 & \mid & 1 \\ 0 & 0 & 0 & 1 & 0 & \mid & 1 \end{pmatrix}$$

**2. Clear column 4 above the pivot — apply $R_1 \leftarrow R_1 - 2R_3$ and $R_2 \leftarrow R_2 + R_3$:**

$$\begin{pmatrix} 1 & 1 & 1 & 0 & 1 & \mid & 6 \\ 0 & 1 & 2 & 0 & -1 & \mid & 2 \\ 0 & 0 & 0 & 1 & 0 & \mid & 1 \end{pmatrix}$$

**3. Clear column 2 above the pivot — apply $R_1 \leftarrow R_1 - R_2$** ($1-1=0$, $1-2=-1$, $1-(-1)=2$, $6-2=4$):

$$\begin{pmatrix} 1 & 0 & -1 & 0 & 2 & \mid & 4 \\ 0 & 1 & 2 & 0 & -1 & \mid & 2 \\ 0 & 0 & 0 & 1 & 0 & \mid & 1 \end{pmatrix} \quad (\text{RREF})$$

The three surviving equations are
$$x_1 - x_3 + 2x_5 = 4, \qquad x_2 + 2x_3 - x_5 = 2, \qquad x_4 = 1$$

<br/>

### Step 4: Particular Solution $x_p$

**Assumptions:** free variables $x_3 = 0$, $x_5 = 0$.

**Proof:**
$$x_1 = 4 + x_3 - 2x_5 = 4 + 0 - 0 = 4$$
$$x_2 = 2 - 2x_3 + x_5 = 2 - 0 + 0 = 2$$
$$x_4 = 1$$

**Verification with $x_p = (4,2,0,1,0)^T$:**
$$\text{Row 1: } 1(4) + 1(2) + 1(0) + 2(1) + 1(0) = 4 + 2 + 0 + 2 + 0 = 8 \;\checkmark$$
$$\text{Row 2: } 1(4) + 2(2) + 3(0) + 1(1) + 0(0) = 4 + 4 + 0 + 1 = 9 \;\checkmark$$
$$\text{Row 3: } 2(4) + 1(2) + 0(0) + 1(1) + 3(0) = 8 + 2 + 0 + 1 = 11 \;\checkmark$$

**Thus proved:**
$$x_p = \begin{pmatrix} 4 \\ 2 \\ 0 \\ 1 \\ 0 \end{pmatrix}$$

<br/>

### Step 5: Homogeneous Solution $x_h$ (Full 5-Component Split)

With the right-hand side zeroed:
$$x_1 = x_3 - 2x_5, \qquad x_2 = -2x_3 + x_5, \qquad x_4 = 0$$

$$x_h = \begin{pmatrix} x_1 \\ x_2 \\ x_3 \\ x_4 \\ x_5 \end{pmatrix} = \begin{pmatrix} x_3 - 2x_5 \\ -2x_3 + x_5 \\ x_3 \\ 0 \\ x_5 \end{pmatrix} = x_3 \begin{pmatrix} 1 \\ -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + x_5 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \\ 1 \end{pmatrix}$$

**Verification of $h_1 = (1,-2,1,0,0)^T$:**
$$\text{Row 1: } 1 - 2 + 1 + 0 + 0 = 0 \;\checkmark \qquad \text{Row 2: } 1 - 4 + 3 + 0 + 0 = 0 \;\checkmark \qquad \text{Row 3: } 2 - 2 + 0 + 0 + 0 = 0 \;\checkmark$$

**Verification of $h_2 = (-2,1,0,0,1)^T$:**
$$\text{Row 1: } -2 + 1 + 0 + 0 + 1 = 0 \;\checkmark \qquad \text{Row 2: } -2 + 2 + 0 + 0 + 0 = 0 \;\checkmark \qquad \text{Row 3: } -4 + 1 + 0 + 0 + 3 = 0 \;\checkmark$$

**Thus proved:**
$$x_h = \lambda_1 \begin{pmatrix} 1 \\ -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \\ 1 \end{pmatrix}, \qquad \lambda_1, \lambda_2 \in \mathbb{R}$$

<br/>

### Step 6: General Solution and Spot Check

$$x_g = \begin{pmatrix} 4 \\ 2 \\ 0 \\ 1 \\ 0 \end{pmatrix} + \lambda_1 \begin{pmatrix} 1 \\ -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + \lambda_2 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \\ 1 \end{pmatrix}, \qquad \lambda_1, \lambda_2 \in \mathbb{R}$$

**Real-number spot check.** Take $\lambda_1 = 1$, $\lambda_2 = 2$:

$$x = \begin{pmatrix} 4 + 1 - 4 \\ 2 - 2 + 2 \\ 0 + 1 + 0 \\ 1 + 0 + 0 \\ 0 + 0 + 2 \end{pmatrix} = \begin{pmatrix} 1 \\ 2 \\ 1 \\ 1 \\ 2 \end{pmatrix}$$

$$\text{Row 1: } 1 + 2 + 1 + 2 + 2 = 8 \;\checkmark$$
$$\text{Row 2: } 1 + 4 + 3 + 1 + 0 = 9 \;\checkmark$$
$$\text{Row 3: } 2 + 2 + 0 + 1 + 6 = 11 \;\checkmark$$

**Thus proved:**
The general solution is established and verified. $\quad \blacksquare$

---

---

# Q8

### Question

Given
$$A = \begin{pmatrix} 1 & 2 & 1 \\ 2 & 4 & 3 \\ 3 & 6 & 4 \end{pmatrix}, \qquad b = \begin{pmatrix} 1 \\ 3 \\ 5 \end{pmatrix}$$
(i) Decide whether $Ax = b$ has a solution.
(ii) Find all solutions of $Ax = 0$.
(iii) Determine exactly which right-hand sides $b$ make the system solvable, and solve one such case.

---

## Answer

### Step 1: Form the Augmented Matrix and Row-Reduce

**Proof:**
_Since we have_
$$[A \mid b] = \begin{pmatrix} 1 & 2 & 1 & \mid & 1 \\ 2 & 4 & 3 & \mid & 3 \\ 3 & 6 & 4 & \mid & 5 \end{pmatrix}$$

**1. Apply $R_2 \leftarrow R_2 - 2R_1$** ($2-2=0$, $4-4=0$, $3-2=1$, $3-2=1$) **and $R_3 \leftarrow R_3 - 3R_1$** ($3-3=0$, $6-6=0$, $4-3=1$, $5-3=2$):

$$\begin{pmatrix} 1 & 2 & 1 & \mid & 1 \\ 0 & 0 & 1 & \mid & 1 \\ 0 & 0 & 1 & \mid & 2 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 - R_2$** ($1-1 = 0$ on the left, but $2-1 = 1$ on the right):

$$\begin{pmatrix} 1 & 2 & 1 & \mid & 1 \\ 0 & 0 & 1 & \mid & 1 \\ 0 & 0 & 0 & \mid & 1 \end{pmatrix} \quad (\text{REF})$$

<br/>

### Step 2: Rank Test — the System Is Inconsistent

**To prove:**
$Ax = b$ has **no** solution.

**Proof:**
_Since we have_ the REF, read the two ranks separately:

- Coefficient part: pivots in columns 1 and 3 $\implies \text{rank}(A) = 2$
- Augmented matrix: an extra pivot appears in the bar column $\implies \text{rank}([A \mid b]) = 3$

$$\text{rank}(A) = 2 \neq 3 = \text{rank}([A \mid b])$$

The last row translates back into the equation

$$0 \cdot x_1 + 0 \cdot x_2 + 0 \cdot x_3 = 1 \quad \Longleftrightarrow \quad 0 = 1$$

which is false for every $(x_1,x_2,x_3)$.

**Thus proved:**
$$\text{The system } Ax = b \text{ is INCONSISTENT — no solution exists.} \quad \blacksquare$$

**Column-space view of the same fact.** $Ax = b$ is solvable exactly when $b \in \text{Col}(A)$. Here $c_2 = (2,4,6)^T = 2c_1$, so $\text{Col}(A) = \text{span}\{(1,2,3)^T, (1,3,4)^T\}$ — a 2-dimensional plane in $\mathbb{R}^3$. Try to write $b$ inside it:

$$\alpha \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix} + \beta \begin{pmatrix} 1 \\ 3 \\ 4 \end{pmatrix} = \begin{pmatrix} 1 \\ 3 \\ 5 \end{pmatrix} \implies \begin{cases} \alpha + \beta = 1 \\ 2\alpha + 3\beta = 3 \end{cases}$$

From the first, $\alpha = 1 - \beta$; substituting: $2(1-\beta) + 3\beta = 3 \implies 2 + \beta = 3 \implies \beta = 1, \; \alpha = 0$. Test row 3: $3(0) + 4(1) = 4 \neq 5$. So $b \notin \text{Col}(A)$ — the same conclusion reached geometrically.

<br/>

### Step 3: Solve the Homogeneous System $Ax = 0$

**To prove:**
Find every $x$ with $Ax = 0$. (This always has at least the trivial solution — inconsistency of $Ax=b$ never affects $Ax=0$.)

**Proof:**
_Since we have_ the same elimination with a zero right-hand side, the REF of $A$ alone is

$$\begin{pmatrix} 1 & 2 & 1 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix} \xrightarrow{\;R_1 \leftarrow R_1 - R_2\;} \begin{pmatrix} 1 & 2 & 0 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix} \quad (\text{RREF})$$

- **Basic variables:** $x_1, x_3$
- **Free variable:** $x_2$
- **Rank–Nullity:** $\text{nullity}(A) = 3 - 2 = 1$

Reading the RREF: $x_3 = 0$ and $x_1 = -2x_2$.

$$x_h = \begin{pmatrix} -2x_2 \\ x_2 \\ 0 \end{pmatrix} = x_2 \begin{pmatrix} -2 \\ 1 \\ 0 \end{pmatrix}$$

**Verification of $h_1 = (-2,1,0)^T$:**
$$\text{Row 1: } 1(-2) + 2(1) + 1(0) = -2 + 2 = 0 \;\checkmark$$
$$\text{Row 2: } 2(-2) + 4(1) + 3(0) = -4 + 4 = 0 \;\checkmark$$
$$\text{Row 3: } 3(-2) + 6(1) + 4(0) = -6 + 6 = 0 \;\checkmark$$

**Thus proved:**
$$x_h = \lambda \begin{pmatrix} -2 \\ 1 \\ 0 \end{pmatrix}, \quad \lambda \in \mathbb{R}, \qquad \text{Null}(A) = \text{span}\left\{(-2,1,0)^T\right\}, \quad \text{nullity} = 1$$

<br/>

### Step 4: Which $b$ Make the System Solvable?

**To prove:**
Find the exact condition on $b = (b_1, b_2, b_3)^T$ for consistency.

**Proof:**
_Since we have_ the same row operations, apply them to a symbolic right-hand side:

$$\begin{pmatrix} 1 & 2 & 1 & \mid & b_1 \\ 2 & 4 & 3 & \mid & b_2 \\ 3 & 6 & 4 & \mid & b_3 \end{pmatrix} \xrightarrow{\substack{R_2 \leftarrow R_2 - 2R_1 \\ R_3 \leftarrow R_3 - 3R_1}} \begin{pmatrix} 1 & 2 & 1 & \mid & b_1 \\ 0 & 0 & 1 & \mid & b_2 - 2b_1 \\ 0 & 0 & 1 & \mid & b_3 - 3b_1 \end{pmatrix}$$

$$\xrightarrow{\;R_3 \leftarrow R_3 - R_2\;} \begin{pmatrix} 1 & 2 & 1 & \mid & b_1 \\ 0 & 0 & 1 & \mid & b_2 - 2b_1 \\ 0 & 0 & 0 & \mid & (b_3 - 3b_1) - (b_2 - 2b_1) \end{pmatrix}$$

Simplify the last entry:
$$(b_3 - 3b_1) - (b_2 - 2b_1) = b_3 - 3b_1 - b_2 + 2b_1 = b_3 - b_1 - b_2$$

The system is consistent precisely when that entry is zero:

$$\boxed{\;b_3 = b_1 + b_2\;}$$

**Check against the given $b$:** $b_1 + b_2 = 1 + 3 = 4$, but $b_3 = 5 \neq 4$ — confirming the inconsistency found in Step 2.

**Thus proved:**
$Ax = b$ is solvable $\iff b_3 = b_1 + b_2$ (equivalently, $b \in \text{Col}(A)$).

<br/>

### Step 5: Repair the Right-Hand Side and Solve

**Assumptions:** replace $b$ by the nearest legal choice $b' = (1,3,4)^T$, which satisfies $4 = 1 + 3 \;\checkmark$

**Proof:**
The REF right-hand side becomes $b_2 - 2b_1 = 3 - 2 = 1$ and the last entry $0$:

$$\begin{pmatrix} 1 & 2 & 1 & \mid & 1 \\ 0 & 0 & 1 & \mid & 1 \\ 0 & 0 & 0 & \mid & 0 \end{pmatrix} \implies x_3 = 1, \qquad x_1 + 2x_2 + 1 = 1 \implies x_1 = -2x_2$$

Setting the free variable $x_2 = 0$ gives $x_p = (0,0,1)^T$.

**Verification:** $A x_p$ is just column 3 of $A$, namely $(1,3,4)^T = b' \;\checkmark$

**Thus proved:**
$$x_g = \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix} + \lambda \begin{pmatrix} -2 \\ 1 \\ 0 \end{pmatrix}, \qquad \lambda \in \mathbb{R} \quad \blacksquare$$

> **Reading the answer:** $\text{rank}(A) = \text{rank}([A\mid b])$ is the whole consistency test. If the ranks match, count $n - \text{rank}$ to know how many free parameters the answer carries; if they differ, stop and write "inconsistent".

---

---

# TYPE C — Column Space, Row Space, Null Space: Proof, Basis, Dimension

---

# Q9

> **This is the real Assignment 1 question — Q3 (2 Marks, 8 min).** Everything after it in TYPE C is practice built around the same skill.

### Question

Given $C \in \mathbb{R}^{3 \times 5}$:
$$C = \begin{pmatrix} 1 & 2 & 1 & 2 & -1 \\ 1 & 1 & 0 & -1 & 4 \\ 1 & -2 & 4 & 1 & 0 \end{pmatrix}$$
(i) Prove that $\text{Col}(C)$ is a subspace of $\mathbb{R}^3$. Find its basis and dimension.
(ii) Prove that $\text{Row}(C)$ is a subspace of $\mathbb{R}^5$. Find its basis and dimension.

---

## Answer

**AIM:** Row-reduce $C$ **once**, then use the same REF to answer both parts.

> **The two basis rules — do not mix them up:**
>
> - **Column basis:** pivot columns of the **ORIGINAL** matrix $C$ (row operations change columns, so the reduced columns are the wrong vectors).
> - **Row basis:** the non-zero rows of the **REF** (row operations only recombine rows, so the row space is unchanged).

<br/>

### Step 0: One Row Reduction, Shared by Both Parts

Apply $R_2 \leftarrow R_2 - R_1$ and $R_3 \leftarrow R_3 - R_1$:

$$\begin{pmatrix} 1 & 2 & 1 & 2 & -1 \\ 0 & -1 & -1 & -3 & 5 \\ 0 & -4 & 3 & -1 & 1 \end{pmatrix}$$

Apply $R_3 \leftarrow R_3 - 4R_2$:

$$\begin{pmatrix} 1 & 2 & 1 & 2 & -1 \\ 0 & -1 & -1 & -3 & 5 \\ 0 & 0 & 7 & 11 & -19 \end{pmatrix} \quad (\text{REF})$$

Pivots sit in **columns 1, 2, 3** (values $1, -1, 7$). Therefore $\text{rank}(C) = 3$.

---

## Part (i): Column Space $\text{Col}(C)$

**AIM:** Prove $U = \text{Col}(C)$ is a subspace of $\mathbb{R}^3$, then give its basis and dimension.

<br/>

### Step 1: Setup (Subset Property)

**To prove:**
$$U \subseteq \mathbb{R}^3$$

**Assumptions:**
$U = \text{Col}(C) = \text{span}\{c_1, c_2, c_3, c_4, c_5\} = \left\{ x \in \mathbb{R}^3 : x = \sum_{i=1}^5 a_i c_i, \; a_i \in \mathbb{R} \right\}$, where $c_i$ is the $i$-th column of $C$; ambient space $V = \mathbb{R}^3$.

**Proof:**
_Since we have_ each column $c_i \in \mathbb{R}^3$ (every column of $C$ has 3 entries), and $\mathbb{R}^3$ is closed under both $+$ and scalar $\cdot$, any linear combination $\sum_{i=1}^5 a_i c_i$ is built entirely out of operations that stay inside $\mathbb{R}^3$.

**Thus proved:**
$$U \subseteq \mathbb{R}^3 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**
$$0 \in U \implies U \neq \emptyset$$

**Assumptions:**
The span definition of $U$ allows any real coefficients — including all zeros.

**Proof:**
_Since we have_ freedom to pick $a_1 = a_2 = a_3 = a_4 = a_5 = 0$:

$$0 \cdot c_1 + 0 \cdot c_2 + 0 \cdot c_3 + 0 \cdot c_4 + 0 \cdot c_5 = (0,0,0)^T$$

This is the standard trick for any span: **set every coefficient to zero and the zero vector appears for free.**

**Thus proved:**
$$0 \in U \implies U \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition

**To prove:**
$$x, y \in U \implies x + y \in U$$

**Assumptions:**
Let $x = \sum_{i=1}^5 a_i c_i$ and $y = \sum_{i=1}^5 b_i c_i$ be arbitrary, with $a_i, b_i \in \mathbb{R}$.

**Proof:**
_Since we have_ both vectors written over the **same** spanning list $\{c_i\}$, add them term by term:

$$x + y = \sum_{i=1}^5 a_i c_i + \sum_{i=1}^5 b_i c_i = \sum_{i=1}^5 (a_i + b_i) c_i = \sum_{i=1}^5 d_i c_i$$

where $d_i = a_i + b_i$. Since $a_i, b_i \in \mathbb{R}$ and $\mathbb{R}$ is closed under $+$, each $d_i \in \mathbb{R}$.

Notice what did and did not change: the **coefficients** combined, the **vectors** $c_i$ stayed exactly the same. That is the whole mechanism of every span proof.

**Thus proved:**
$$x + y \in U \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**
$$x \in U, \; \lambda \in \mathbb{R} \implies \lambda x \in U$$

**Assumptions:**
Let $x = \sum_{i=1}^5 a_i c_i$ with $a_i \in \mathbb{R}$, and let $\lambda \in \mathbb{R}$ be arbitrary.

**Proof:**
_Since we have_ $x = \sum_{i=1}^5 a_i c_i$, distribute $\lambda$ across the sum:

$$\lambda x = \lambda \sum_{i=1}^5 a_i c_i = \sum_{i=1}^5 (\lambda a_i) c_i = \sum_{i=1}^5 e_i c_i$$

where $e_i = \lambda a_i$. Since $\lambda, a_i \in \mathbb{R}$ and $\mathbb{R}$ is closed under $\times$, each $e_i \in \mathbb{R}$. Again the coefficients absorbed the scalar; the vectors are untouched.

**Thus proved:**
$$\lambda x \in U \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE + Basis and Dimension (Part i)

_Since we have_ $U \subseteq \mathbb{R}^3$, $U \neq \emptyset$ because $0 \in U$, $U$ closed under $+$, and $U$ closed under scalar $\cdot$, all remaining vector space axioms are inherited from $\mathbb{R}^3$.

$$\therefore \text{Col}(C) \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

**Basis (pivot columns of the ORIGINAL $C$ — columns 1, 2, 3):**

$$\text{Basis}(\text{Col}(C)) = \left\{ \begin{pmatrix} 1 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 2 \\ 1 \\ -2 \end{pmatrix}, \begin{pmatrix} 1 \\ 0 \\ 4 \end{pmatrix} \right\}, \qquad \dim(\text{Col}(C)) = 3$$

**Space identity:** $\dim(\text{Col}(C)) = 3 = \dim \mathbb{R}^3$, and a 3-dimensional subspace of a 3-dimensional space must be the whole space, so $\text{Col}(C) = \mathbb{R}^3$. In plain terms: $Cx = b$ is solvable for **every** $b \in \mathbb{R}^3$.

---

## Part (ii): Row Space $\text{Row}(C)$

**AIM:** Prove $W = \text{Row}(C)$ is a subspace of $\mathbb{R}^5$, then give its basis and dimension.

<br/>

### Step 1: Setup (Subset Property)

**To prove:**
$$W \subseteq \mathbb{R}^5$$

**Assumptions:**
$W = \text{Row}(C) = \text{span}\{r_1, r_2, r_3\} = \left\{ x \in \mathbb{R}^5 : x = \sum_{i=1}^3 a_i r_i, \; a_i \in \mathbb{R} \right\}$, where $r_i$ is the $i$-th row of $C$; ambient space $V = \mathbb{R}^5$.

**Proof:**
_Since we have_ each row $r_i \in \mathbb{R}^5$ (every row of $C$ has 5 entries), and $\mathbb{R}^5$ is closed under $+$ and scalar $\cdot$, every linear combination $\sum_{i=1}^3 a_i r_i$ stays inside $\mathbb{R}^5$.

**Thus proved:**
$$W \subseteq \mathbb{R}^5 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**
$$0 \in W \implies W \neq \emptyset$$

**Proof:**
_Since we have_ the freedom to take $a_1 = a_2 = a_3 = 0$:

$$0 \cdot r_1 + 0 \cdot r_2 + 0 \cdot r_3 = (0,0,0,0,0)$$

**Thus proved:**
$$0 \in W \implies W \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Steps 3 and 4: Closures

The argument is identical to Part (i) with $r_i$ in place of $c_i$ and 3 coefficients instead of 5:

- **Addition:** _Since we have_ $x = \sum_{i=1}^3 a_i r_i$ and $y = \sum_{i=1}^3 b_i r_i$, then $x + y = \sum_{i=1}^3 (a_i + b_i) r_i = \sum_{i=1}^3 d_i r_i$ with $d_i = a_i + b_i \in \mathbb{R}$.
  **Thus proved:** $x + y \in W$.
- **Scalar multiplication:** _Since we have_ $x = \sum_{i=1}^3 a_i r_i$, then $\lambda x = \sum_{i=1}^3 (\lambda a_i) r_i = \sum_{i=1}^3 e_i r_i$ with $e_i = \lambda a_i \in \mathbb{R}$.
  **Thus proved:** $\lambda x \in W$.

<br/>

### HENCE + Basis and Dimension (Part ii)

_Since we have_ $W \subseteq \mathbb{R}^5$, $W \neq \emptyset$, and both closures, the remaining axioms are inherited from $\mathbb{R}^5$.

$$\therefore \text{Row}(C) \text{ is a subspace of } \mathbb{R}^5. \quad \blacksquare$$

**Basis (non-zero rows of the REF):**

$$\text{Basis}(\text{Row}(C)) = \left\{ (1, 2, 1, 2, -1), \; (0, -1, -1, -3, 5), \; (0, 0, 7, 11, -19) \right\}, \qquad \dim(\text{Row}(C)) = 3$$

These are linearly independent by their staircase pattern: the leading entries appear in columns 1, 2, 3 respectively, so no row can be built from the ones below it.

> **Fundamental identity:** $\dim(\text{Col}(C)) = \dim(\text{Row}(C)) = 3 = \text{rank}(C)$ — **row rank equals column rank**, even though the two spaces live in different ambient spaces ($\mathbb{R}^3$ and $\mathbb{R}^5$).

<br/>

### Bonus: Null Space and Rank–Nullity (not asked, but the natural third part)

**Proof:**
_Since we have_ pivots in columns 1, 2, 3, the free variables are $x_4, x_5$, and $\text{nullity}(C) = 5 - 3 = 2$.

Reading the REF rows from the bottom up:

- $R_3$: $7x_3 + 11x_4 - 19x_5 = 0 \implies x_3 = \dfrac{-11x_4 + 19x_5}{7}$
- $R_2$: $-x_2 - x_3 - 3x_4 + 5x_5 = 0 \implies x_2 = \dfrac{-10x_4 + 16x_5}{7}$
- $R_1$: $x_1 + 2x_2 + x_3 + 2x_4 - x_5 = 0 \implies x_1 = \dfrac{17x_4 - 44x_5}{7}$

Clearing the denominator by taking $x_4 = 7, x_5 = 0$ and then $x_4 = 0, x_5 = 7$:

$$n_1 = \begin{pmatrix} 17 \\ -10 \\ -11 \\ 7 \\ 0 \end{pmatrix}, \qquad n_2 = \begin{pmatrix} -44 \\ 16 \\ 19 \\ 0 \\ 7 \end{pmatrix}$$

**Verification of $n_1$:**
$$\text{Row 1: } 17 - 20 - 11 + 14 - 0 = 0 \;\checkmark \quad \text{Row 2: } 17 - 10 + 0 - 7 + 0 = 0 \;\checkmark \quad \text{Row 3: } 17 + 20 - 44 + 7 + 0 = 0 \;\checkmark$$

**Verification of $n_2$:**
$$\text{Row 1: } -44 + 32 + 19 + 0 - 7 = 0 \;\checkmark \quad \text{Row 2: } -44 + 16 + 0 - 0 + 28 = 0 \;\checkmark \quad \text{Row 3: } -44 - 32 + 76 + 0 + 0 = 0 \;\checkmark$$

**Rank–Nullity Theorem check:**
$$\text{rank}(C) + \text{nullity}(C) = 3 + 2 = 5 = n = \text{number of columns} \quad \checkmark \quad \blacksquare$$

> **Reading the answer:** $C$ is a wide matrix ($3 \times 5$), so it maps $\mathbb{R}^5$ **onto** all of $\mathbb{R}^3$ but crushes a 2-dimensional plane of $\mathbb{R}^5$ down to zero. Surjective, never injective.

---

---

# Q10

### Question

Given $C \in \mathbb{R}^{3 \times 4}$:
$$C = \begin{pmatrix} 1 & 2 & 3 & 1 \\ 2 & 4 & 7 & 3 \\ 1 & 2 & 4 & 2 \end{pmatrix}$$
(i) Prove that $\text{Col}(C)$ is a subspace of $\mathbb{R}^3$; find its basis and dimension.
(ii) Prove that $\text{Row}(C)$ is a subspace of $\mathbb{R}^4$; find its basis and dimension.
(iii) Find a basis and dimension of $\text{Null}(C)$ and verify the Rank–Nullity Theorem.

---

## Answer

### Step 0: One Row Reduction, Shared by All Three Parts

Name the columns $c_1, c_2, c_3, c_4 \in \mathbb{R}^3$ and the rows $r_1, r_2, r_3 \in \mathbb{R}^4$.

**1. Apply $R_2 \leftarrow R_2 - 2R_1$** ($2-2=0$, $4-4=0$, $7-6=1$, $3-2=1$) **and $R_3 \leftarrow R_3 - R_1$** ($1-1=0$, $2-2=0$, $4-3=1$, $2-1=1$):

$$\begin{pmatrix} 1 & 2 & 3 & 1 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 - R_2$:**

$$\begin{pmatrix} 1 & 2 & 3 & 1 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{pmatrix} \quad (\text{REF})$$

**3. Apply $R_1 \leftarrow R_1 - 3R_2$** ($3-3=0$, $1-3=-2$) to reach RREF:

$$\begin{pmatrix} 1 & 2 & 0 & -2 \\ 0 & 0 & 1 & 1 \\ 0 & 0 & 0 & 0 \end{pmatrix} \quad (\text{RREF})$$

Pivots lie in **columns 1 and 3**, so
$$\text{rank}(C) = 2$$

<br/>

## Part (i): Column Space $\text{Col}(C)$

**AIM:** Prove $U = \text{Col}(C)$ is a subspace of $\mathbb{R}^3$ and find its basis and dimension.

### Step 1: Setup (Subset Property)

**Given:**
$$U = \text{span}\{c_1,c_2,c_3,c_4\} = \left\{ x \in \mathbb{R}^3 : x = \sum_{i=1}^4 a_i c_i, \; a_i \in \mathbb{R} \right\}, \qquad V = \mathbb{R}^3$$

**Proof:**
_Since we have_ each column $c_i \in \mathbb{R}^3$ (each column has 3 entries), and $\mathbb{R}^3$ is itself closed under $+$ and scalar multiplication, every linear combination $\sum a_i c_i$ stays inside $\mathbb{R}^3$.

**Thus proved:**
$$U \subseteq \mathbb{R}^3 \quad \text{(Subset Property Established)}$$

### Step 2: Non-Emptiness

**Proof:**
_Since we have_ the choice $a_1 = a_2 = a_3 = a_4 = 0$:
$$0c_1 + 0c_2 + 0c_3 + 0c_4 = (0,0,0)^T$$

**Thus proved:**
$$0 \in U \implies U \neq \emptyset$$

### Step 3: Closure Under Vector Addition

**Assumptions:** let $x = \sum_{i=1}^4 a_i c_i$ and $y = \sum_{i=1}^4 b_i c_i$ with $a_i, b_i \in \mathbb{R}$.

**Proof:**
$$x + y = \sum_{i=1}^4 a_i c_i + \sum_{i=1}^4 b_i c_i = \sum_{i=1}^4 (a_i + b_i) c_i = \sum_{i=1}^4 d_i c_i$$

where $d_i = a_i + b_i \in \mathbb{R}$ because $\mathbb{R}$ is closed under addition. The **vectors** $c_i$ never changed — only the coefficients merged.

**Thus proved:** $x + y \in U$.

### Step 4: Closure Under Scalar Multiplication

**Proof:**
$$\lambda x = \lambda \sum_{i=1}^4 a_i c_i = \sum_{i=1}^4 (\lambda a_i) c_i = \sum_{i=1}^4 e_i c_i, \qquad e_i = \lambda a_i \in \mathbb{R}$$

**Thus proved:** $\lambda x \in U$.

### HENCE + Basis & Dimension

_Since we have_ $U \subseteq \mathbb{R}^3$, $U \neq \emptyset$, and both closures, with the remaining axioms inherited from $\mathbb{R}^3$:

$$\therefore \text{Col}(C) \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

**Basis Selection Rule — pivot columns of the ORIGINAL matrix** (columns 1 and 3):

$$\text{Basis}(\text{Col}(C)) = \left\{ \begin{pmatrix} 1 \\ 2 \\ 1 \end{pmatrix}, \begin{pmatrix} 3 \\ 7 \\ 4 \end{pmatrix} \right\}, \qquad \dim(\text{Col}(C)) = 2$$

**Why the other two columns are redundant — read the dependencies straight from the RREF:**

- RREF column 2 is $(2,0)^T$ in pivot coordinates $\implies c_2 = 2c_1$. Check: $2(1,2,1)^T = (2,4,2)^T \;\checkmark$ (that is exactly column 2).
- RREF column 4 is $(-2,1)^T$ $\implies c_4 = -2c_1 + c_3$. Check: $-2(1,2,1)^T + (3,7,4)^T = (-2+3,\, -4+7,\, -2+4)^T = (1,3,2)^T \;\checkmark$ (exactly column 4).

**Geometric reading:** $\dim(\text{Col}(C)) = 2 < 3$, so $\text{Col}(C)$ is a **plane through the origin** in $\mathbb{R}^3$, not all of $\mathbb{R}^3$. Its equation is $z_1 - z_2 + z_3 = 0$: check on the basis, $1 - 2 + 1 = 0 \;\checkmark$ and $3 - 7 + 4 = 0 \;\checkmark$

<br/>

## Part (ii): Row Space $\text{Row}(C)$

**AIM:** Prove $W = \text{Row}(C)$ is a subspace of $\mathbb{R}^4$ and find its basis and dimension.

### Step 1: Setup (Subset Property)

**Given:**
$$W = \text{span}\{r_1, r_2, r_3\} = \left\{ x \in \mathbb{R}^4 : x = \sum_{i=1}^3 a_i r_i, \; a_i \in \mathbb{R} \right\}, \qquad V = \mathbb{R}^4$$

**Proof:**
_Since we have_ each row $r_i \in \mathbb{R}^4$ (each row has 4 entries), and $\mathbb{R}^4$ is closed under $+$ and scalar multiplication, every combination $\sum a_i r_i$ stays inside $\mathbb{R}^4$.

**Thus proved:** $W \subseteq \mathbb{R}^4$.

### Step 2: Non-Emptiness

**Proof:** _Since we have_ $a_1 = a_2 = a_3 = 0$, we get $0r_1 + 0r_2 + 0r_3 = (0,0,0,0)$.

**Thus proved:** $0 \in W \implies W \neq \emptyset$.

### Steps 3 & 4: Closures

- **Addition:** $x = \sum a_i r_i$, $y = \sum b_i r_i \implies x + y = \sum (a_i + b_i) r_i = \sum d_i r_i$, $d_i \in \mathbb{R}$. **Thus proved:** $x + y \in W$.
- **Scalar:** $\lambda x = \sum (\lambda a_i) r_i = \sum e_i r_i$, $e_i \in \mathbb{R}$. **Thus proved:** $\lambda x \in W$.

### HENCE + Basis & Dimension

$$\therefore \text{Row}(C) \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

**Basis Selection Rule — non-zero rows of the ECHELON matrix:**

$$\text{Basis}(\text{Row}(C)) = \left\{ (1,2,3,1), \; (0,0,1,1) \right\}, \qquad \dim(\text{Row}(C)) = 2$$

**Why row reduction is legal here:** each row operation replaces a row by a linear combination of rows, so the span of the rows never changes. (This is exactly why the _column_ basis must be taken from the original matrix but the _row_ basis may be taken from the echelon form.)

**Dependency check on the original rows:** $r_2 = 2r_1 + r_2^{\text{ref}}$, and $r_3 = r_1 + r_2^{\text{ref}}$, i.e. $r_3 = r_2 - r_1$. Check: $(2,4,7,3) - (1,2,3,1) = (1,2,4,2) = r_3 \;\checkmark$

$$\dim(\text{Col}(C)) = \dim(\text{Row}(C)) = 2 = \text{rank}(C) \quad \text{(Row Rank} = \text{Column Rank)}$$

<br/>

## Part (iii): Null Space $\text{Null}(C)$

**Proof:**
_Since we have_ the RREF with pivots in columns 1 and 3:

- **Basic variables:** $x_1, x_3$
- **Free variables:** $x_2, x_4$

Reading the RREF rows: $x_1 + 2x_2 - 2x_4 = 0$ and $x_3 + x_4 = 0$, so

$$x_1 = -2x_2 + 2x_4, \qquad x_3 = -x_4$$

$$x = \begin{pmatrix} -2x_2 + 2x_4 \\ x_2 \\ -x_4 \\ x_4 \end{pmatrix} = x_2 \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix} + x_4 \begin{pmatrix} 2 \\ 0 \\ -1 \\ 1 \end{pmatrix}$$

**Verification of $n_1 = (-2,1,0,0)^T$:**
$$\text{Row 1: } 1(-2)+2(1)+3(0)+1(0) = 0 \;\checkmark \quad \text{Row 2: } 2(-2)+4(1)+7(0)+3(0) = 0 \;\checkmark \quad \text{Row 3: } 1(-2)+2(1)+4(0)+2(0) = 0 \;\checkmark$$

**Verification of $n_2 = (2,0,-1,1)^T$:**
$$\text{Row 1: } 2 + 0 - 3 + 1 = 0 \;\checkmark \quad \text{Row 2: } 4 + 0 - 7 + 3 = 0 \;\checkmark \quad \text{Row 3: } 2 + 0 - 4 + 2 = 0 \;\checkmark$$

**Thus proved:**
$$\text{Basis}(\text{Null}(C)) = \left\{ \begin{pmatrix} -2 \\ 1 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 2 \\ 0 \\ -1 \\ 1 \end{pmatrix} \right\}, \qquad \dim(\text{Null}(C)) = 2$$

**Rank–Nullity Theorem check:**
$$\text{rank}(C) + \text{nullity}(C) = 2 + 2 = 4 = n = \text{number of columns} \quad \checkmark \quad \blacksquare$$

---

---

# Q11

### Question

Given $C \in \mathbb{R}^{4 \times 3}$:
$$C = \begin{pmatrix} 1 & 2 & 0 \\ 0 & 1 & 1 \\ 1 & 1 & 1 \\ 2 & 0 & 3 \end{pmatrix}$$
(i) Prove that $\text{Col}(C)$ is a subspace of $\mathbb{R}^4$; find its basis and dimension.
(ii) Prove that $\text{Row}(C)$ is a subspace of $\mathbb{R}^3$; find its basis and dimension.
(iii) Find $\text{Null}(C)$ and verify Rank–Nullity.

---

## Answer

### Step 0: Row Reduction (Shared)

Here the matrix is **tall**: 4 rows, 3 columns. Columns live in $\mathbb{R}^4$, rows live in $\mathbb{R}^3$.

**1. Apply $R_3 \leftarrow R_3 - R_1$** ($1-1=0$, $1-2=-1$, $1-0=1$) **and $R_4 \leftarrow R_4 - 2R_1$** ($2-2=0$, $0-4=-4$, $3-0=3$):

$$\begin{pmatrix} 1 & 2 & 0 \\ 0 & 1 & 1 \\ 0 & -1 & 1 \\ 0 & -4 & 3 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 + R_2$** ($-1+1=0$, $1+1=2$) **and $R_4 \leftarrow R_4 + 4R_2$** ($-4+4=0$, $3+4=7$):

$$\begin{pmatrix} 1 & 2 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 2 \\ 0 & 0 & 7 \end{pmatrix}$$

**3. Apply $R_3 \leftarrow \tfrac{1}{2}R_3$, then $R_4 \leftarrow R_4 - 7R_3$:**

$$\begin{pmatrix} 1 & 2 & 0 \\ 0 & 1 & 1 \\ 0 & 0 & 1 \\ 0 & 0 & 0 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **columns 1, 2 and 3** $\implies \text{rank}(C) = 3$ (full **column** rank).

<br/>

## Part (i): Column Space $\text{Col}(C) \subseteq \mathbb{R}^4$

### Steps 1–4 (Subspace Proof)

**Setup:** $U = \text{span}\{c_1,c_2,c_3\} = \{x \in \mathbb{R}^4 : x = a_1c_1 + a_2c_2 + a_3c_3,\; a_i \in \mathbb{R}\}$.

- **Step 1 (Subset):** _Since we have_ each $c_i \in \mathbb{R}^4$ and $\mathbb{R}^4$ closed under $+$ and $\cdot$, every combination stays in $\mathbb{R}^4$. **Thus proved:** $U \subseteq \mathbb{R}^4$.
- **Step 2 (Non-empty):** _Since we have_ $a_1=a_2=a_3=0$, $0c_1+0c_2+0c_3 = (0,0,0,0)^T \in U$. **Thus proved:** $U \neq \emptyset$.
- **Step 3 (Addition):** $x = \sum a_ic_i$, $y = \sum b_ic_i \implies x+y = \sum(a_i+b_i)c_i = \sum d_ic_i$, $d_i \in \mathbb{R}$. **Thus proved:** $x+y \in U$.
- **Step 4 (Scalar):** $\lambda x = \sum(\lambda a_i)c_i = \sum e_ic_i$, $e_i \in \mathbb{R}$. **Thus proved:** $\lambda x \in U$.

### HENCE + Basis & Dimension

$$\therefore \text{Col}(C) \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

All three columns are pivot columns, so **none is redundant**:

$$\text{Basis}(\text{Col}(C)) = \left\{ \begin{pmatrix} 1 \\ 0 \\ 1 \\ 2 \end{pmatrix}, \begin{pmatrix} 2 \\ 1 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \\ 3 \end{pmatrix} \right\}, \qquad \dim(\text{Col}(C)) = 3$$

**Important:** $\dim(\text{Col}(C)) = 3 < 4$, so $\text{Col}(C) \neq \mathbb{R}^4$ — it is a 3-dimensional **hyperplane** inside $\mathbb{R}^4$. Concretely it is

$$\text{Col}(C) = \left\{ z \in \mathbb{R}^4 : 3z_1 + z_2 - 7z_3 + 2z_4 = 0 \right\}$$

**Check on each basis column:**
$$c_1:\; 3(1) + 0 - 7(1) + 2(2) = 3 - 7 + 4 = 0 \;\checkmark$$
$$c_2:\; 3(2) + 1 - 7(1) + 2(0) = 6 + 1 - 7 = 0 \;\checkmark$$
$$c_3:\; 3(0) + 1 - 7(1) + 2(3) = 1 - 7 + 6 = 0 \;\checkmark$$

<br/>

## Part (ii): Row Space $\text{Row}(C) \subseteq \mathbb{R}^3$

### Steps 1–4 (Subspace Proof)

**Setup:** $W = \text{span}\{r_1,r_2,r_3,r_4\} = \{x \in \mathbb{R}^3 : x = \sum_{i=1}^4 a_i r_i, \; a_i \in \mathbb{R}\}$.

- **Step 1 (Subset):** each $r_i \in \mathbb{R}^3$, and $\mathbb{R}^3$ is closed under both operations $\implies W \subseteq \mathbb{R}^3$.
- **Step 2 (Non-empty):** all $a_i = 0$ gives $(0,0,0) \in W \implies W \neq \emptyset$.
- **Step 3 (Addition):** $\sum a_ir_i + \sum b_ir_i = \sum d_ir_i$ with $d_i = a_i + b_i \in \mathbb{R} \implies x+y \in W$.
- **Step 4 (Scalar):** $\lambda \sum a_ir_i = \sum e_ir_i$ with $e_i = \lambda a_i \in \mathbb{R} \implies \lambda x \in W$.

### HENCE + Basis & Dimension

$$\therefore \text{Row}(C) \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

$$\text{Basis}(\text{Row}(C)) = \left\{ (1,2,0), \; (0,1,1), \; (0,0,1) \right\}, \qquad \dim(\text{Row}(C)) = 3$$

**Space identity:** $\dim(\text{Row}(C)) = 3 = \dim \mathbb{R}^3 \implies \text{Row}(C) = \mathbb{R}^3$ (the whole space).

**The redundant row.** Four vectors in $\mathbb{R}^3$ can never be independent, so one row must be a combination of the others. Solving $r_4 = \alpha r_1 + \beta r_2 + \gamma r_3$ gives $\alpha = -\tfrac{3}{2}, \beta = -\tfrac{1}{2}, \gamma = \tfrac{7}{2}$; clearing denominators:

$$2r_4 = -3r_1 - r_2 + 7r_3$$

**Check:** $-3(1,2,0) - (0,1,1) + 7(1,1,1) = (-3+7,\; -6-1+7,\; 0-1+7) = (4,0,6) = 2(2,0,3) = 2r_4 \;\checkmark$

<br/>

## Part (iii): Null Space and Rank–Nullity

**Proof:**
_Since we have_ pivots in **all three** columns, there are **no free variables**. Back-substituting the REF:

$$\text{Row 3: } x_3 = 0 \quad \implies \quad \text{Row 2: } x_2 + x_3 = 0 \implies x_2 = 0 \quad \implies \quad \text{Row 1: } x_1 + 2x_2 = 0 \implies x_1 = 0$$

**Thus proved:**
$$\text{Null}(C) = \{0\}, \qquad \text{Basis}(\text{Null}(C)) = \emptyset, \qquad \dim(\text{Null}(C)) = 0$$

**Rank–Nullity Theorem check:**
$$\text{rank}(C) + \text{nullity}(C) = 3 + 0 = 3 = n = \text{number of columns} \quad \checkmark$$

$$\blacksquare$$

> **Reading the answer:** full column rank $\iff$ null space is trivial $\iff$ the columns are linearly independent $\iff$ $Cx = b$ has at most one solution.

---

---

# Q12

### Question

Given $C \in \mathbb{R}^{4 \times 5}$:
$$C = \begin{pmatrix} 1 & 2 & 1 & 3 & 0 \\ 1 & 3 & 3 & 4 & 1 \\ 2 & 5 & 4 & 7 & 1 \\ 1 & 2 & 2 & 5 & 3 \end{pmatrix}$$
(i) Prove that $\text{Col}(C)$ is a subspace of $\mathbb{R}^4$; find its basis and dimension.
(ii) Prove that $\text{Row}(C)$ is a subspace of $\mathbb{R}^5$; find its basis and dimension.
(iii) Find a basis of $\text{Null}(C)$ and verify Rank–Nullity.

---

## Answer

### Step 0: Row Reduction (Shared)

**1. Apply $R_2 \leftarrow R_2 - R_1$, $R_3 \leftarrow R_3 - 2R_1$, $R_4 \leftarrow R_4 - R_1$:**

Row 2: $(1-1,\; 3-2,\; 3-1,\; 4-3,\; 1-0) = (0,1,2,1,1)$
Row 3: $(2-2,\; 5-4,\; 4-2,\; 7-6,\; 1-0) = (0,1,2,1,1)$
Row 4: $(1-1,\; 2-2,\; 2-1,\; 5-3,\; 3-0) = (0,0,1,2,3)$

$$\begin{pmatrix} 1 & 2 & 1 & 3 & 0 \\ 0 & 1 & 2 & 1 & 1 \\ 0 & 1 & 2 & 1 & 1 \\ 0 & 0 & 1 & 2 & 3 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 - R_2$** (rows 2 and 3 are identical, so row 3 wipes out):

$$\begin{pmatrix} 1 & 2 & 1 & 3 & 0 \\ 0 & 1 & 2 & 1 & 1 \\ 0 & 0 & 0 & 0 & 0 \\ 0 & 0 & 1 & 2 & 3 \end{pmatrix}$$

**3. Apply $R_3 \leftrightarrow R_4$** (push the zero row to the bottom):

$$\begin{pmatrix} 1 & 2 & 1 & 3 & 0 \\ 0 & 1 & 2 & 1 & 1 \\ 0 & 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 & 0 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **columns 1, 2 and 3** $\implies \text{rank}(C) = 3$.

The row that vanished tells us the original dependency: $r_3 = r_1 + r_2$. Check: $(1,2,1,3,0) + (1,3,3,4,1) = (2,5,4,7,1) = r_3 \;\checkmark$

**Continue to RREF** (needed for the null space in part iii):

**4. Apply $R_2 \leftarrow R_2 - 2R_3$** ($2-2=0$, $1-4=-3$, $1-6=-5$) **and $R_1 \leftarrow R_1 - R_3$** ($1-1=0$, $3-2=1$, $0-3=-3$):

$$\begin{pmatrix} 1 & 2 & 0 & 1 & -3 \\ 0 & 1 & 0 & -3 & -5 \\ 0 & 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 & 0 \end{pmatrix}$$

**5. Apply $R_1 \leftarrow R_1 - 2R_2$** ($2-2=0$, $1+6=7$, $-3+10=7$):

$$\begin{pmatrix} 1 & 0 & 0 & 7 & 7 \\ 0 & 1 & 0 & -3 & -5 \\ 0 & 0 & 1 & 2 & 3 \\ 0 & 0 & 0 & 0 & 0 \end{pmatrix} \quad (\text{RREF})$$

<br/>

## Part (i): Column Space $\text{Col}(C) \subseteq \mathbb{R}^4$

### Steps 1–4 (Subspace Proof)

**Setup:** $U = \text{span}\{c_1,\dots,c_5\} = \left\{ x \in \mathbb{R}^4 : x = \sum_{i=1}^5 a_i c_i, \; a_i \in \mathbb{R} \right\}$.

- **Step 1 (Subset):** _Since we have_ each $c_i \in \mathbb{R}^4$ and $\mathbb{R}^4$ closed under $+$ and $\cdot$: **thus proved** $U \subseteq \mathbb{R}^4$.
- **Step 2 (Non-empty):** all $a_i = 0$ gives the zero vector: **thus proved** $0 \in U$, $U \neq \emptyset$.
- **Step 3 (Addition):** $\sum a_ic_i + \sum b_ic_i = \sum (a_i+b_i)c_i = \sum d_i c_i$, $d_i \in \mathbb{R}$: **thus proved** $x + y \in U$.
- **Step 4 (Scalar):** $\lambda \sum a_ic_i = \sum (\lambda a_i)c_i = \sum e_i c_i$, $e_i \in \mathbb{R}$: **thus proved** $\lambda x \in U$.

### HENCE + Basis & Dimension

$$\therefore \text{Col}(C) \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

**Pivot columns of the ORIGINAL matrix** (columns 1, 2, 3):

$$\text{Basis}(\text{Col}(C)) = \left\{ \begin{pmatrix} 1 \\ 1 \\ 2 \\ 1 \end{pmatrix}, \begin{pmatrix} 2 \\ 3 \\ 5 \\ 2 \end{pmatrix}, \begin{pmatrix} 1 \\ 3 \\ 4 \\ 2 \end{pmatrix} \right\}, \qquad \dim(\text{Col}(C)) = 3$$

**The two redundant columns, read off the RREF:**

- RREF column 4 is $(7,-3,2)^T \implies c_4 = 7c_1 - 3c_2 + 2c_3$.
  Check: $7(1,1,2,1) - 3(2,3,5,2) + 2(1,3,4,2) = (7-6+2,\; 7-9+6,\; 14-15+8,\; 7-6+4) = (3,4,7,5) = c_4 \;\checkmark$
- RREF column 5 is $(7,-5,3)^T \implies c_5 = 7c_1 - 5c_2 + 3c_3$.
  Check: $7(1,1,2,1) - 5(2,3,5,2) + 3(1,3,4,2) = (7-10+3,\; 7-15+9,\; 14-25+12,\; 7-10+6) = (0,1,1,3) = c_5 \;\checkmark$

Since $3 < 4$, $\text{Col}(C)$ is a proper 3-dimensional subspace of $\mathbb{R}^4$.

<br/>

## Part (ii): Row Space $\text{Row}(C) \subseteq \mathbb{R}^5$

### Steps 1–4 (Subspace Proof)

**Setup:** $W = \text{span}\{r_1,r_2,r_3,r_4\} = \left\{ x \in \mathbb{R}^5 : x = \sum_{i=1}^4 a_i r_i, \; a_i \in \mathbb{R} \right\}$.

- **Step 1 (Subset):** each $r_i \in \mathbb{R}^5$, and $\mathbb{R}^5$ is closed under both operations $\implies W \subseteq \mathbb{R}^5$.
- **Step 2 (Non-empty):** all $a_i = 0$ gives $(0,0,0,0,0) \in W \implies W \neq \emptyset$.
- **Step 3 (Addition):** $\sum a_i r_i + \sum b_i r_i = \sum d_i r_i$ with $d_i = a_i + b_i \in \mathbb{R} \implies x + y \in W$.
- **Step 4 (Scalar):** $\lambda \sum a_i r_i = \sum e_i r_i$ with $e_i = \lambda a_i \in \mathbb{R} \implies \lambda x \in W$.

### HENCE + Basis & Dimension

$$\therefore \text{Row}(C) \text{ is a subspace of } \mathbb{R}^5. \quad \blacksquare$$

**Non-zero rows of the REF:**

$$\text{Basis}(\text{Row}(C)) = \left\{ (1,2,1,3,0), \; (0,1,2,1,1), \; (0,0,1,2,3) \right\}, \qquad \dim(\text{Row}(C)) = 3$$

$$\dim(\text{Col}(C)) = \dim(\text{Row}(C)) = 3 = \text{rank}(C) \quad \checkmark$$

<br/>

## Part (iii): Null Space and Rank–Nullity

**Proof:**
_Since we have_ the RREF with pivots in columns 1, 2, 3:

- **Basic variables:** $x_1, x_2, x_3$
- **Free variables:** $x_4, x_5$
- **Predicted nullity:** $5 - 3 = 2$

The RREF rows say:
$$x_1 + 7x_4 + 7x_5 = 0, \qquad x_2 - 3x_4 - 5x_5 = 0, \qquad x_3 + 2x_4 + 3x_5 = 0$$

so
$$x_1 = -7x_4 - 7x_5, \qquad x_2 = 3x_4 + 5x_5, \qquad x_3 = -2x_4 - 3x_5$$

**Full 5-component split:**

$$x = \begin{pmatrix} -7x_4 - 7x_5 \\ 3x_4 + 5x_5 \\ -2x_4 - 3x_5 \\ x_4 \\ x_5 \end{pmatrix} = x_4 \begin{pmatrix} -7 \\ 3 \\ -2 \\ 1 \\ 0 \end{pmatrix} + x_5 \begin{pmatrix} -7 \\ 5 \\ -3 \\ 0 \\ 1 \end{pmatrix}$$

**Verification of $n_1 = (-7,3,-2,1,0)^T$ against the ORIGINAL matrix:**
$$\text{Row 1: } 1(-7)+2(3)+1(-2)+3(1)+0(0) = -7+6-2+3 = 0 \;\checkmark$$
$$\text{Row 2: } 1(-7)+3(3)+3(-2)+4(1)+1(0) = -7+9-6+4 = 0 \;\checkmark$$
$$\text{Row 3: } 2(-7)+5(3)+4(-2)+7(1)+1(0) = -14+15-8+7 = 0 \;\checkmark$$
$$\text{Row 4: } 1(-7)+2(3)+2(-2)+5(1)+3(0) = -7+6-4+5 = 0 \;\checkmark$$

**Verification of $n_2 = (-7,5,-3,0,1)^T$:**
$$\text{Row 1: } -7+10-3+0+0 = 0 \;\checkmark \qquad \text{Row 2: } -7+15-9+0+1 = 0 \;\checkmark$$
$$\text{Row 3: } -14+25-12+0+1 = 0 \;\checkmark \qquad \text{Row 4: } -7+10-6+0+3 = 0 \;\checkmark$$

**Thus proved:**
$$\text{Basis}(\text{Null}(C)) = \left\{ \begin{pmatrix} -7 \\ 3 \\ -2 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} -7 \\ 5 \\ -3 \\ 0 \\ 1 \end{pmatrix} \right\}, \qquad \dim(\text{Null}(C)) = 2$$

**Rank–Nullity Theorem check:**
$$\text{rank}(C) + \text{nullity}(C) = 3 + 2 = 5 = n = \text{number of columns} \quad \checkmark \quad \blacksquare$$

---

---

# TYPE D — Intersection $S_1 \cap S_2$

---

# Q13

> **This is the real Assignment 1 question — Q4 (2 Marks, 8 min).** Everything after it in TYPE D is practice built around the same skill.

### Question

Let $v_1 = (1,0,2)^T$ and $v_2 = (1,2,2)^T$ span $S_1 = \text{span}\{v_1, v_2\} \subset \mathbb{R}^3$, and let $w_1 = (1,1,0)^T$ and $w_2 = (0,1,1)^T$ span $S_2 = \text{span}\{w_1, w_2\} \subset \mathbb{R}^3$.
(a) Prove that $S_1 \cap S_2$ is a subspace of $\mathbb{R}^3$.
(b) Find the basis and dimension of $S_1 \cap S_2$.

---

## Answer

**AIM:** Prove the intersection is a subspace, then find the vectors that have **two valid recipes** — one from each spanning set.

> **The exam shortcut for part (a):** $S_1$ and $S_2$ are handed to you as spans, hence already subspaces. So $0 \in S_1$, $0 \in S_2$, $S_i \subseteq \mathbb{R}^3$, and both closures inside each $S_i$ are **free**. Quote them; never re-prove them.

<br/>

## Part (a): $S_1 \cap S_2$ Is a Subspace of $\mathbb{R}^3$

### Step 1: Setup (Subset Property)

**To prove:**
$$S_1 \cap S_2 \subseteq \mathbb{R}^3$$

**Assumptions:**
$S_1, S_2$ are subspaces of $\mathbb{R}^3$ (each is a span of vectors in $\mathbb{R}^3$).

**Proof:**
_Since we have_ $x \in S_1 \cap S_2$, the definition of intersection forces $x \in S_1$ in particular. And $S_1 \subseteq \mathbb{R}^3$, so $x \in \mathbb{R}^3$. One containment is enough — you do not need both.

**Thus proved:**
$$S_1 \cap S_2 \subseteq S_1 \subseteq \mathbb{R}^3 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**
$$0 \in S_1 \cap S_2 \implies S_1 \cap S_2 \neq \emptyset$$

**Assumptions:**
$S_1$ and $S_2$ are subspaces, so each contains the zero vector.

**Proof:**
_Since we have_ $S_1$ a subspace $\implies 0 \in S_1$, and $S_2$ a subspace $\implies 0 \in S_2$. A vector lying in both sets lies in their intersection.

**Thus proved:**
$$0 \in S_1 \cap S_2 \implies S_1 \cap S_2 \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition

**To prove:**
$$x, y \in S_1 \cap S_2 \implies x + y \in S_1 \cap S_2$$

**Assumptions:**
Let $x, y \in S_1 \cap S_2$ be arbitrary, so $x, y \in S_1$ **and** $x, y \in S_2$.

**Proof:**
_Since we have_ $x$ and $y$ inside both subspaces, run the closure argument separately in each one:

- **In $S_1$:** $x = a_1 v_1 + a_2 v_2$ and $y = b_1 v_1 + b_2 v_2$, so
  $$x + y = (a_1 + b_1)v_1 + (a_2 + b_2)v_2 = d_1 v_1 + d_2 v_2 \in S_1, \qquad d_i = a_i + b_i \in \mathbb{R}$$
- **In $S_2$:** $x = a_3 w_1 + a_4 w_2$ and $y = b_3 w_1 + b_4 w_2$, so
  $$x + y = (a_3 + b_3)w_1 + (a_4 + b_4)w_2 = d_3 w_1 + d_4 w_2 \in S_2, \qquad d_i = a_i + b_i \in \mathbb{R}$$

The same vector $x + y$ landed in both sets, using two different recipes — which is precisely what membership of the intersection means.

**Thus proved:**
$$x + y \in S_1 \text{ and } x + y \in S_2 \implies x + y \in S_1 \cap S_2 \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**
$$x \in S_1 \cap S_2, \; \lambda \in \mathbb{R} \implies \lambda x \in S_1 \cap S_2$$

**Assumptions:**
Let $x \in S_1 \cap S_2$ be arbitrary and $\lambda \in \mathbb{R}$ an arbitrary scalar.

**Proof:**
_Since we have_ $x$ in both subspaces:

- **In $S_1$:** $\lambda x = (\lambda a_1)v_1 + (\lambda a_2)v_2 = e_1 v_1 + e_2 v_2 \in S_1$ with $e_i = \lambda a_i \in \mathbb{R}$
- **In $S_2$:** $\lambda x = (\lambda a_3)w_1 + (\lambda a_4)w_2 = e_3 w_1 + e_4 w_2 \in S_2$ with $e_i = \lambda a_i \in \mathbb{R}$

**Thus proved:**
$$\lambda x \in S_1 \text{ and } \lambda x \in S_2 \implies \lambda x \in S_1 \cap S_2 \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Part a)

_Since we have_ $S_1 \cap S_2 \subseteq \mathbb{R}^3$, $S_1 \cap S_2 \neq \emptyset$ because $0$ belongs to it, and closure under both operations, all remaining axioms are inherited from $\mathbb{R}^3$.

$$\therefore S_1 \cap S_2 \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

<br/>

## Part (b): Basis and Dimension of $S_1 \cap S_2$

### Step 5: Equate the Two Parametrisations

**To prove:**
Convert "$x$ has a recipe in $S_1$ **and** a recipe in $S_2$" into a homogeneous system $Mz = 0$.

**Assumptions:**
$x \in S_1 \cap S_2$ arbitrary, with coefficients $a, b, c, d \in \mathbb{R}$.

**Proof:**
_Since we have_ $x \in S_1$ and $x \in S_2$ simultaneously, write the two recipes for the **same** vector:

$$x = a v_1 + b v_2 \qquad \text{and} \qquad x = c w_1 + d w_2$$

Set them equal and move everything to one side:

$$a v_1 + b v_2 - c w_1 - d w_2 = 0$$

$$a \begin{pmatrix} 1 \\ 0 \\ 2 \end{pmatrix} + b \begin{pmatrix} 1 \\ 2 \\ 2 \end{pmatrix} - c \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix} - d \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}$$

**Thus proved:**
The membership condition is now the homogeneous system $M z = 0$ with unknown coefficient vector $z = (a,b,c,d)^T$.

<br/>

### Step 6: Form $M$ and Row-Reduce

**To prove:**
Solve $Mz = 0$ and count the degrees of freedom.

**Assumptions:**
$M = [\,v_1 \;\; v_2 \;\; -w_1 \;\; -w_2\,]$, columns in the order $a, b, c, d$.

**Proof:**
_Since we have_ the four coefficient vectors as columns:

$$M = \begin{pmatrix} 1 & 1 & -1 & 0 \\ 0 & 2 & -1 & -1 \\ 2 & 2 & 0 & -1 \end{pmatrix}$$

Apply $R_3 \leftarrow R_3 - 2R_1$:

$$\begin{pmatrix} 1 & 1 & -1 & 0 \\ 0 & 2 & -1 & -1 \\ 0 & 0 & 2 & -1 \end{pmatrix} \quad (\text{REF})$$

Pivots sit in columns 1, 2, 3, so $\text{rank}(M) = 3$.

- **Basic variables:** $a, b, c$
- **Free variable:** $d$
- **Rank–Nullity:** $\text{nullity}(M) = 4 - 3 = 1$, so exactly **one** free parameter

**Thus proved:**
The coefficient solutions form a 1-parameter family driven by $d$.

<br/>

### Step 7: Back-Substitution and Dual Verification

**To prove:**
Recover the intersection vector and confirm it via **both** routes.

**Proof:**
_Since we have_ the REF, back-substitute from the bottom row upward:

- $R_3$: $2c - d = 0 \implies c = \dfrac{d}{2}$
- $R_2$: $2b - c - d = 0 \implies 2b = \dfrac{d}{2} + d = \dfrac{3d}{2} \implies b = \dfrac{3d}{4}$
- $R_1$: $a + b - c = 0 \implies a = c - b = \dfrac{d}{2} - \dfrac{3d}{4} = -\dfrac{d}{4}$

Choose $d = 4$ to clear all fractions: $a = -1, \; b = 3, \; c = 2, \; d = 4$.

**Dual verification — the vector must come out identical both ways:**

- **Via $S_1$:** $x = -1(1,0,2)^T + 3(1,2,2)^T = (-1+3,\; 0+6,\; -2+6)^T = (2,6,4)^T$
- **Via $S_2$:** $x = 2(1,1,0)^T + 4(0,1,1)^T = (2+0,\; 2+4,\; 0+4)^T = (2,6,4)^T \quad \checkmark$

The two routes agree, so $(2,6,4)^T$ genuinely sits in both subspaces. Scaling down by $2$ gives the primitive direction $u = (1,3,2)^T$ — any non-zero multiple is an equally valid basis vector.

**Thus proved:**
$$u = (1,3,2)^T \in S_1 \cap S_2$$

<br/>

### Step 8: Basis and Dimension

_Since we have_ exactly one free parameter, every solution is a scalar multiple of $u$, so the intersection is the line through $u$:

$$\text{Basis}(S_1 \cap S_2) = \left\{ \begin{pmatrix} 1 \\ 3 \\ 2 \end{pmatrix} \right\}, \qquad \dim(S_1 \cap S_2) = 1 = \text{nullity}(M) \quad \blacksquare$$

<br/>

### Step 9: Dimension Formula Cross-Check

$$\dim(S_1 + S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 1 = 3$$

Independently, pool all four vectors and row-reduce:

$$[\,v_1 \; v_2 \; w_1 \; w_2\,] = \begin{pmatrix} 1 & 1 & 1 & 0 \\ 0 & 2 & 1 & 1 \\ 2 & 2 & 0 & 1 \end{pmatrix} \xrightarrow{R_3 \leftarrow R_3 - 2R_1} \begin{pmatrix} 1 & 1 & 1 & 0 \\ 0 & 2 & 1 & 1 \\ 0 & 0 & -2 & 1 \end{pmatrix}$$

$\text{rank} = 3 \quad \checkmark$ — the two computations agree, so the answer $\dim(S_1 \cap S_2) = 1$ is confirmed.

> **Reading the answer:** two distinct planes through the origin in $\mathbb{R}^3$ must cut in a line (they cannot miss each other — both pass through $0$). Getting $\dim = 1$ here is the geometrically expected result; getting $0$ would have signalled an arithmetic slip.

---

---

# Q14

### Question

Let $v_1 = (1,2,1)^T$, $v_2 = (2,1,0)^T$ span $S_1 = \text{span}\{v_1,v_2\} \subset \mathbb{R}^3$, and let $w_1 = (1,0,1)^T$, $w_2 = (3,3,2)^T$ span $S_2 = \text{span}\{w_1,w_2\} \subset \mathbb{R}^3$.
(a) Prove that $S_1 \cap S_2$ is a subspace of $\mathbb{R}^3$.
(b) Find a basis and the dimension of $S_1 \cap S_2$.

---

## Answer

## Part (a): $S_1 \cap S_2$ Is a Subspace of $\mathbb{R}^3$

### Step 1: Setup (Subset Property)

**Given:** $S_1, S_2$ are subspaces of $\mathbb{R}^3$ (each is a span of vectors from $\mathbb{R}^3$).

**Proof:**
_Since we have_ $x \in S_1 \cap S_2 \implies x \in S_1$, and $S_1 \subseteq \mathbb{R}^3$, it follows that $x \in \mathbb{R}^3$.

**Thus proved:**
$$S_1 \cap S_2 \subseteq S_1 \subseteq \mathbb{R}^3 \quad \text{(Subset Property Established)}$$

### Step 2: Non-Emptiness

**To prove:** $0 \in S_1 \cap S_2$.

**Proof:**
_Since we have_ $S_1$ a subspace $\implies 0 \in S_1$ (take $a_1 = a_2 = 0$ in $a_1v_1 + a_2v_2$), and $S_2$ a subspace $\implies 0 \in S_2$ (take $a_3 = a_4 = 0$). A vector lying in both sets lies in the intersection.

**Thus proved:**
$$0 \in S_1 \cap S_2 \implies S_1 \cap S_2 \neq \emptyset$$

### Step 3: Closure Under Vector Addition

**Assumptions:** let $x, y \in S_1 \cap S_2$, so $x, y \in S_1$ **and** $x, y \in S_2$.

**Proof:**
_Since we have_ membership in both subspaces, handle each side separately:

- **In $S_1$:** $x = a_1v_1 + a_2v_2$ and $y = b_1v_1 + b_2v_2 \implies x + y = (a_1+b_1)v_1 + (a_2+b_2)v_2 = d_1v_1 + d_2v_2 \in S_1$, where $d_i = a_i + b_i \in \mathbb{R}$.
- **In $S_2$:** $x = a_3w_1 + a_4w_2$ and $y = b_3w_1 + b_4w_2 \implies x + y = d_3w_1 + d_4w_2 \in S_2$, where $d_i = a_i + b_i \in \mathbb{R}$.

**Thus proved:**
$$x + y \in S_1 \text{ and } x + y \in S_2 \implies x + y \in S_1 \cap S_2$$

### Step 4: Closure Under Scalar Multiplication

**Assumptions:** let $x \in S_1 \cap S_2$ and $\lambda \in \mathbb{R}$.

**Proof:**

- **In $S_1$:** $\lambda x = (\lambda a_1)v_1 + (\lambda a_2)v_2 = e_1v_1 + e_2v_2 \in S_1$, where $e_i = \lambda a_i \in \mathbb{R}$.
- **In $S_2$:** $\lambda x = (\lambda a_3)w_1 + (\lambda a_4)w_2 = e_3w_1 + e_4w_2 \in S_2$.

**Thus proved:**
$$\lambda x \in S_1 \cap S_2$$

### HENCE (Part a)

_Since we have_ $S_1 \cap S_2 \subseteq \mathbb{R}^3$, non-empty, closed under $+$ and closed under scalar multiplication, with all remaining axioms inherited from $\mathbb{R}^3$:

$$\therefore S_1 \cap S_2 \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

<br/>

## Part (b): Basis and Dimension

### Step 5: Equate the Two Parametrisations

**Proof:**
_Since we have_ $x \in S_1 \cap S_2$, the **same** vector $x$ must have a recipe in each subspace:

$$x = a v_1 + b v_2 \qquad \text{and} \qquad x = c w_1 + d w_2$$

Equate and move everything to one side:

$$a v_1 + b v_2 - c w_1 - d w_2 = 0$$

$$a \begin{pmatrix} 1 \\ 2 \\ 1 \end{pmatrix} + b \begin{pmatrix} 2 \\ 1 \\ 0 \end{pmatrix} - c \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} - d \begin{pmatrix} 3 \\ 3 \\ 2 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}$$

**Thus proved:**
The membership question has become a homogeneous system $Mz = 0$ with unknown $z = (a,b,c,d)^T$.

### Step 6: Form $M$ and Row-Reduce

$$M = \begin{pmatrix} v_1 & v_2 & -w_1 & -w_2 \end{pmatrix} = \begin{pmatrix} 1 & 2 & -1 & -3 \\ 2 & 1 & 0 & -3 \\ 1 & 0 & -1 & -2 \end{pmatrix}$$

**1. Apply $R_2 \leftarrow R_2 - 2R_1$** ($2-2=0$, $1-4=-3$, $0+2=2$, $-3+6=3$) **and $R_3 \leftarrow R_3 - R_1$** ($1-1=0$, $0-2=-2$, $-1+1=0$, $-2+3=1$):

$$\begin{pmatrix} 1 & 2 & -1 & -3 \\ 0 & -3 & 2 & 3 \\ 0 & -2 & 0 & 1 \end{pmatrix}$$

**2. Apply $R_2 \leftarrow -\tfrac{1}{3}R_2$:**

$$\begin{pmatrix} 1 & 2 & -1 & -3 \\ 0 & 1 & -\tfrac{2}{3} & -1 \\ 0 & -2 & 0 & 1 \end{pmatrix}$$

**3. Apply $R_3 \leftarrow R_3 + 2R_2$** ($-2+2=0$, $0 - \tfrac{4}{3} = -\tfrac{4}{3}$, $1 - 2 = -1$):

$$\begin{pmatrix} 1 & 2 & -1 & -3 \\ 0 & 1 & -\tfrac{2}{3} & -1 \\ 0 & 0 & -\tfrac{4}{3} & -1 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in columns 1, 2, 3 $\implies \text{rank}(M) = 3$.

- **Basic variables:** $a, b, c$
- **Free variable:** $d$
- **Rank–Nullity:** $\text{nullity}(M) = 4 - 3 = 1 \implies$ a one-parameter family of coefficient solutions.

### Step 7: Back-Substitution and Dual Verification

**Proof:**
_Since we have_ the REF, solve upward:

$$\text{Row 3: } -\tfrac{4}{3}c - d = 0 \implies c = -\tfrac{3}{4}d$$

$$\text{Row 2: } b - \tfrac{2}{3}c - d = 0 \implies b = \tfrac{2}{3}\left(-\tfrac{3}{4}d\right) + d = -\tfrac{1}{2}d + d = \tfrac{1}{2}d$$

$$\text{Row 1: } a + 2b - c - 3d = 0 \implies a = -2\left(\tfrac{1}{2}d\right) + \left(-\tfrac{3}{4}d\right) + 3d = -d - \tfrac{3}{4}d + 3d = \tfrac{5}{4}d$$

Choose $d = 4$ to clear all denominators:

$$a = 5, \qquad b = 2, \qquad c = -3, \qquad d = 4$$

**Dual Vector Verification — build $x$ by both routes and compare:**

- **Via $S_1$:** $x = 5v_1 + 2v_2 = 5(1,2,1)^T + 2(2,1,0)^T = (5+4,\; 10+2,\; 5+0)^T = (9,12,5)^T$
- **Via $S_2$:** $x = -3w_1 + 4w_2 = -3(1,0,1)^T + 4(3,3,2)^T = (-3+12,\; 0+12,\; -3+8)^T = (9,12,5)^T \;\checkmark$

Both routes produce the identical vector, confirming it genuinely lies in both subspaces.

**Thus proved:** $u = (9,12,5)^T \in S_1 \cap S_2$.

### Step 8: Basis and Dimension

_Since we have_ exactly one free parameter $d$, every solution is a scalar multiple of $u$:

$$\text{Basis}(S_1 \cap S_2) = \left\{ \begin{pmatrix} 9 \\ 12 \\ 5 \end{pmatrix} \right\}, \qquad \dim(S_1 \cap S_2) = 1 \; (= \text{nullity}(M)) \quad \blacksquare$$

### Step 9: Dimension Formula Cross-Check

Pool all four spanning vectors as columns and find the rank:

$$P = \begin{pmatrix} 1 & 2 & 1 & 3 \\ 2 & 1 & 0 & 3 \\ 1 & 0 & 1 & 2 \end{pmatrix} \xrightarrow{\substack{R_2 \leftarrow R_2 - 2R_1 \\ R_3 \leftarrow R_3 - R_1}} \begin{pmatrix} 1 & 2 & 1 & 3 \\ 0 & -3 & -2 & -3 \\ 0 & -2 & 0 & -1 \end{pmatrix} \xrightarrow{\substack{R_2 \leftarrow -\frac13 R_2 \\ R_3 \leftarrow R_3 + 2R_2}} \begin{pmatrix} 1 & 2 & 1 & 3 \\ 0 & 1 & \tfrac{2}{3} & 1 \\ 0 & 0 & \tfrac{4}{3} & 1 \end{pmatrix}$$

$$\dim(S_1 + S_2) = \text{rank}(P) = 3$$

$$\dim(S_1 + S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 1 = 3 \quad \checkmark \text{ Confirmed}$$

Since $\dim(S_1+S_2) = 3 = \dim\mathbb{R}^3$, the two planes $S_1$ and $S_2$ together fill $\mathbb{R}^3$ and cross along the single line spanned by $(9,12,5)^T$.

---

---

# Q15

### Question

Let $v_1 = (1,1,0,1)^T$, $v_2 = (0,1,1,0)^T$ span $S_1 \subset \mathbb{R}^4$, and let $w_1 = (1,2,1,1)^T$, $w_2 = (1,0,1,2)^T$ span $S_2 \subset \mathbb{R}^4$.
(a) Prove that $S_1 \cap S_2$ is a subspace of $\mathbb{R}^4$.
(b) Find a basis and the dimension of $S_1 \cap S_2$.

---

## Answer

## Part (a): $S_1 \cap S_2$ Is a Subspace of $\mathbb{R}^4$

### Step 1: Setup (Subset Property)

**Proof:** _Since we have_ $x \in S_1 \cap S_2 \implies x \in S_1$, and $S_1 \subseteq \mathbb{R}^4$ (it is spanned by vectors of $\mathbb{R}^4$), we get $x \in \mathbb{R}^4$.

**Thus proved:** $S_1 \cap S_2 \subseteq \mathbb{R}^4$.

### Step 2: Non-Emptiness

**Proof:** _Since we have_ $0 = 0v_1 + 0v_2 \in S_1$ and $0 = 0w_1 + 0w_2 \in S_2$, the zero vector lies in both.

**Thus proved:** $0 \in S_1 \cap S_2 \implies S_1 \cap S_2 \neq \emptyset$.

### Step 3: Closure Under Vector Addition

**Assumptions:** let $x, y \in S_1 \cap S_2$.

**Proof:**

- **In $S_1$:** $x = a_1v_1 + a_2v_2$, $y = b_1v_1 + b_2v_2 \implies x+y = d_1v_1 + d_2v_2 \in S_1$ with $d_i = a_i + b_i \in \mathbb{R}$.
- **In $S_2$:** $x = a_3w_1 + a_4w_2$, $y = b_3w_1 + b_4w_2 \implies x+y = d_3w_1 + d_4w_2 \in S_2$ with $d_i = a_i + b_i \in \mathbb{R}$.

**Thus proved:** $x+y \in S_1 \cap S_2$.

### Step 4: Closure Under Scalar Multiplication

**Proof:** For $\lambda \in \mathbb{R}$: in $S_1$, $\lambda x = e_1v_1 + e_2v_2$; in $S_2$, $\lambda x = e_3w_1 + e_4w_2$; with $e_i = \lambda a_i \in \mathbb{R}$ in both cases.

**Thus proved:** $\lambda x \in S_1 \cap S_2$.

### HENCE (Part a)

$$\therefore S_1 \cap S_2 \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

<br/>

## Part (b): Basis and Dimension

### Step 5: Equate the Two Parametrisations

$$a v_1 + b v_2 - c w_1 - d w_2 = 0$$

$$a \begin{pmatrix} 1 \\ 1 \\ 0 \\ 1 \end{pmatrix} + b \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \end{pmatrix} - c \begin{pmatrix} 1 \\ 2 \\ 1 \\ 1 \end{pmatrix} - d \begin{pmatrix} 1 \\ 0 \\ 1 \\ 2 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 0 \\ 0 \end{pmatrix}$$

### Step 6: Form $M$ and Row-Reduce

$$M = \begin{pmatrix} v_1 & v_2 & -w_1 & -w_2 \end{pmatrix} = \begin{pmatrix} 1 & 0 & -1 & -1 \\ 1 & 1 & -2 & 0 \\ 0 & 1 & -1 & -1 \\ 1 & 0 & -1 & -2 \end{pmatrix}$$

**1. Apply $R_2 \leftarrow R_2 - R_1$** ($1-1=0$, $1-0=1$, $-2+1=-1$, $0+1=1$) **and $R_4 \leftarrow R_4 - R_1$** ($1-1=0$, $0$, $-1+1=0$, $-2+1=-1$):

$$\begin{pmatrix} 1 & 0 & -1 & -1 \\ 0 & 1 & -1 & 1 \\ 0 & 1 & -1 & -1 \\ 0 & 0 & 0 & -1 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 - R_2$** ($1-1=0$, $-1+1=0$, $-1-1=-2$):

$$\begin{pmatrix} 1 & 0 & -1 & -1 \\ 0 & 1 & -1 & 1 \\ 0 & 0 & 0 & -2 \\ 0 & 0 & 0 & -1 \end{pmatrix}$$

**3. Apply $R_4 \leftarrow R_4 - \tfrac{1}{2}R_3$** ($-1 + 1 = 0$):

$$\begin{pmatrix} 1 & 0 & -1 & -1 \\ 0 & 1 & -1 & 1 \\ 0 & 0 & 0 & -2 \\ 0 & 0 & 0 & 0 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **columns 1, 2 and 4** $\implies \text{rank}(M) = 3$.

- **Basic variables:** $a, b, d$
- **Free variable:** $c$ (column 3 has no pivot)
- **Rank–Nullity:** $\text{nullity}(M) = 4 - 3 = 1$

### Step 7: Back-Substitution and Dual Verification

$$\text{Row 3: } -2d = 0 \implies d = 0$$
$$\text{Row 2: } b - c + d = 0 \implies b = c - d = c$$
$$\text{Row 1: } a - c - d = 0 \implies a = c + d = c$$

Choose the free variable $c = 1$:
$$a = 1, \qquad b = 1, \qquad c = 1, \qquad d = 0$$

**Dual Vector Verification:**

- **Via $S_1$:** $x = 1v_1 + 1v_2 = (1,1,0,1)^T + (0,1,1,0)^T = (1,2,1,1)^T$
- **Via $S_2$:** $x = 1w_1 + 0w_2 = (1,2,1,1)^T \;\checkmark$

Both routes agree. (Here the reason is visible by eye: $w_1 = v_1 + v_2$, so $w_1$ itself sits in $S_1$ as well as in $S_2$.)

**Thus proved:** $u = (1,2,1,1)^T \in S_1 \cap S_2$.

### Step 8: Basis and Dimension

$$\text{Basis}(S_1 \cap S_2) = \left\{ \begin{pmatrix} 1 \\ 2 \\ 1 \\ 1 \end{pmatrix} \right\}, \qquad \dim(S_1 \cap S_2) = 1 \quad \blacksquare$$

### Step 9: Dimension Formula Cross-Check

$$P = \begin{pmatrix} 1 & 0 & 1 & 1 \\ 1 & 1 & 2 & 0 \\ 0 & 1 & 1 & 1 \\ 1 & 0 & 1 & 2 \end{pmatrix} \xrightarrow{\substack{R_2 \leftarrow R_2 - R_1 \\ R_4 \leftarrow R_4 - R_1}} \begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & 1 & -1 \\ 0 & 1 & 1 & 1 \\ 0 & 0 & 0 & 1 \end{pmatrix} \xrightarrow{R_3 \leftarrow R_3 - R_2} \begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & 1 & -1 \\ 0 & 0 & 0 & 2 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

One more step, $R_4 \leftarrow R_4 - \tfrac12 R_3$, empties row 4, leaving pivots in columns 1, 2, 4:

$$\dim(S_1+S_2) = \text{rank}(P) = 3$$

$$\dim(S_1+S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 1 = 3 \quad \checkmark \text{ Confirmed}$$

---

---

# Q16

### Question

Let $v_1 = (1,2,0,1)^T$, $v_2 = (0,1,1,0)^T$ span $S_1 \subset \mathbb{R}^4$, and let $w_1 = (1,0,0,0)^T$, $w_2 = (0,0,1,1)^T$ span $S_2 \subset \mathbb{R}^4$.
(a) Prove that $S_1 \cap S_2$ is a subspace of $\mathbb{R}^4$.
(b) Find a basis and the dimension of $S_1 \cap S_2$.

---

## Answer

## Part (a): $S_1 \cap S_2$ Is a Subspace of $\mathbb{R}^4$

### Step 1: Setup (Subset Property)

**Proof:** _Since we have_ $x \in S_1 \cap S_2 \implies x \in S_1 \subseteq \mathbb{R}^4$.
**Thus proved:** $S_1 \cap S_2 \subseteq \mathbb{R}^4$.

### Step 2: Non-Emptiness

**Proof:** _Since we have_ $S_1, S_2$ subspaces, $0 \in S_1$ and $0 \in S_2$ (all coefficients zero).
**Thus proved:** $0 \in S_1 \cap S_2 \implies S_1 \cap S_2 \neq \emptyset$.

### Step 3: Closure Under Vector Addition

**Assumptions:** $x, y \in S_1 \cap S_2$.

**Proof:**

- **In $S_1$:** $x = a_1v_1 + a_2v_2$, $y = b_1v_1 + b_2v_2 \implies x+y = d_1v_1 + d_2v_2 \in S_1$, $d_i = a_i+b_i \in \mathbb{R}$.
- **In $S_2$:** $x = a_3w_1 + a_4w_2$, $y = b_3w_1 + b_4w_2 \implies x+y = d_3w_1 + d_4w_2 \in S_2$.

**Thus proved:** $x + y \in S_1 \cap S_2$.

### Step 4: Closure Under Scalar Multiplication

**Proof:** $\lambda x = e_1v_1 + e_2v_2 \in S_1$ and $\lambda x = e_3w_1 + e_4w_2 \in S_2$, with $e_i = \lambda a_i \in \mathbb{R}$.

**Thus proved:** $\lambda x \in S_1 \cap S_2$.

### HENCE (Part a)

$$\therefore S_1 \cap S_2 \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

> Note this proof never used the actual numbers — the intersection of **any** two subspaces is a subspace, even when (as here) the intersection turns out to be only $\{0\}$. The zero subspace $\{0\}$ is a perfectly legitimate subspace.

<br/>

## Part (b): Basis and Dimension

### Step 5: Equate the Two Parametrisations

$$a \begin{pmatrix} 1 \\ 2 \\ 0 \\ 1 \end{pmatrix} + b \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \end{pmatrix} - c \begin{pmatrix} 1 \\ 0 \\ 0 \\ 0 \end{pmatrix} - d \begin{pmatrix} 0 \\ 0 \\ 1 \\ 1 \end{pmatrix} = \begin{pmatrix} 0 \\ 0 \\ 0 \\ 0 \end{pmatrix}$$

### Step 6: Form $M$ and Row-Reduce

$$M = \begin{pmatrix} 1 & 0 & -1 & 0 \\ 2 & 1 & 0 & 0 \\ 0 & 1 & 0 & -1 \\ 1 & 0 & 0 & -1 \end{pmatrix}$$

**1. Apply $R_2 \leftarrow R_2 - 2R_1$** ($2-2=0$, $1$, $0+2=2$, $0$) **and $R_4 \leftarrow R_4 - R_1$** ($1-1=0$, $0$, $0+1=1$, $-1$):

$$\begin{pmatrix} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 0 \\ 0 & 1 & 0 & -1 \\ 0 & 0 & 1 & -1 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 - R_2$** ($1-1=0$, $0-2=-2$, $-1-0=-1$):

$$\begin{pmatrix} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 0 \\ 0 & 0 & -2 & -1 \\ 0 & 0 & 1 & -1 \end{pmatrix}$$

**3. Apply $R_3 \leftrightarrow R_4$** (put the simpler pivot on top):

$$\begin{pmatrix} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 0 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & -2 & -1 \end{pmatrix}$$

**4. Apply $R_4 \leftarrow R_4 + 2R_3$** ($-2+2=0$, $-1-2=-3$):

$$\begin{pmatrix} 1 & 0 & -1 & 0 \\ 0 & 1 & 2 & 0 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & 0 & -3 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **all four columns** $\implies \text{rank}(M) = 4$.

- **Basic variables:** $a, b, c, d$ — **all of them**
- **Free variables:** none
- **Rank–Nullity:** $\text{nullity}(M) = 4 - 4 = 0$

### Step 7: Back-Substitution

$$\text{Row 4: } -3d = 0 \implies d = 0$$
$$\text{Row 3: } c - d = 0 \implies c = 0$$
$$\text{Row 2: } b + 2c = 0 \implies b = 0$$
$$\text{Row 1: } a - c = 0 \implies a = 0$$

The **only** solution is the trivial one $z = (0,0,0,0)^T$. Feeding it back:

$$x = 0v_1 + 0v_2 = (0,0,0,0)^T \qquad \text{and} \qquad x = 0w_1 + 0w_2 = (0,0,0,0)^T \;\checkmark$$

So no non-zero vector can be written both ways.

### Step 8: Basis and Dimension

**Thus proved:**
$$S_1 \cap S_2 = \{0\}, \qquad \text{Basis}(S_1 \cap S_2) = \emptyset \;(\text{the empty set}), \qquad \dim(S_1 \cap S_2) = 0 \quad \blacksquare$$

> **Careful:** the basis is the **empty set**, _not_ $\{(0,0,0,0)^T\}$. The zero vector is never allowed in a basis, because any set containing it is linearly dependent ($1 \cdot 0 = 0$ is a non-trivial relation). By convention $\text{span}(\emptyset) = \{0\}$ and $\dim\{0\} = 0$.

### Step 9: Dimension Formula Cross-Check

$$P = \begin{pmatrix} 1 & 0 & 1 & 0 \\ 2 & 1 & 0 & 0 \\ 0 & 1 & 0 & 1 \\ 1 & 0 & 0 & 1 \end{pmatrix}$$

The same elimination (only the signs of columns 3 and 4 differ, which never changes rank) gives $\text{rank}(P) = 4$, so

$$\dim(S_1 + S_2) = 4 = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 0 = 4 \quad \checkmark$$

Since $\dim(S_1+S_2) = 4 = \dim\mathbb{R}^4$ and the intersection is trivial, the four vectors $v_1, v_2, w_1, w_2$ form a basis of $\mathbb{R}^4$ and

$$S_1 \oplus S_2 = \mathbb{R}^4 \quad \text{(a DIRECT sum: every } x \in \mathbb{R}^4 \text{ splits into } S_1 \text{ and } S_2 \text{ pieces in exactly one way)}.$$

---

---

# TYPE E — Sum $S_1 + S_2$

---

# Q17

> **This is the real Assignment 1 question — Q5 (3 Marks, 10 min).** Everything after it in TYPE E is practice built around the same skill.

### Question

Let $v_1 = (1,1,0,0)^T$ and $v_2 = (0,1,1,0)^T$ span $S_1 = \text{span}\{v_1, v_2\} \subset \mathbb{R}^4$, and let $w_1 = (0,0,1,1)^T$ and $w_2 = (0,0,0,1)^T$ span $S_2 = \text{span}\{w_1, w_2\} \subset \mathbb{R}^4$, where
$$S_1 + S_2 = \{\, x + y \;:\; x \in S_1, \; y \in S_2 \,\}.$$
(a) Prove that $S_1 + S_2$ is a subspace of $\mathbb{R}^4$.
(b) Find the basis and dimension of $S_1 + S_2$.

---

## Answer

**AIM:** Prove the sum is a subspace using the **piece-split** argument, then pool all spanning vectors and count pivots.

> **Intersection vs Sum — the one-line difference:**
>
> - **Intersection:** one vector, **two recipes** $\implies$ solve $Mz = 0$, the answer is the **nullity**.
> - **Sum:** one vector, **two pieces** $\implies$ pool every spanning vector as a column, the answer is the **rank**.

<br/>

## Part (a): $S_1 + S_2$ Is a Subspace of $\mathbb{R}^4$

### Step 1: Setup (Subset Property)

**To prove:**
$$S_1 + S_2 \subseteq \mathbb{R}^4$$

**Assumptions:**
$S_1 + S_2 = \{ p \in \mathbb{R}^4 : p = x + y, \; x \in S_1, \; y \in S_2 \}$, ambient space $V = \mathbb{R}^4$; $S_1, S_2$ are subspaces of $\mathbb{R}^4$.

**Proof:**
_Since we have_ $x \in S_1 \subseteq \mathbb{R}^4$ and $y \in S_2 \subseteq \mathbb{R}^4$, and $\mathbb{R}^4$ is itself closed under vector addition, the sum $x + y$ cannot escape $\mathbb{R}^4$.

**Thus proved:**
$$S_1 + S_2 \subseteq \mathbb{R}^4 \quad \text{(Subset Property Established)}$$

<br/>

### Step 2: Non-Emptiness

**To prove:**
$$0 \in S_1 + S_2 \implies S_1 + S_2 \neq \emptyset$$

**Assumptions:**
$S_1, S_2$ are subspaces, so $0 \in S_1$ and $0 \in S_2$.

**Proof:**
_Since we have_ $0 \in S_1$ and $0 \in S_2$, split the zero vector as $0 = 0 + 0$ — a legitimate decomposition with the first piece drawn from $S_1$ and the second from $S_2$.

**Thus proved:**
$$0 \in S_1 + S_2 \implies S_1 + S_2 \neq \emptyset \quad \text{(Non-empty Set)}$$

<br/>

### Step 3: Closure Under Vector Addition (Piece Split)

**To prove:**
$$p, q \in S_1 + S_2 \implies p + q \in S_1 + S_2$$

**Assumptions:**
Let $p, q \in S_1 + S_2$ be arbitrary. By the set definition each unpacks into two pieces:
$$p = x + y \quad (x \in S_1, \; y \in S_2), \qquad q = u + v \quad (u \in S_1, \; v \in S_2)$$

**Proof:**
_Since we have_ $p = x + y$ and $q = u + v$, add them and **regroup by home subspace** (allowed by commutativity and associativity of $+$ in $\mathbb{R}^4$):

$$p + q = (x + y) + (u + v) = \underbrace{(x + u)}_{\in \, S_1} + \underbrace{(y + v)}_{\in \, S_2}$$

$x + u \in S_1$ because $S_1$ is a subspace and hence closed under addition; $y + v \in S_2$ for the same reason. So $p + q$ has been exhibited as (something in $S_1$) $+$ (something in $S_2$), which is exactly the membership requirement.

**Thus proved:**
$$p + q \in S_1 + S_2 \quad \text{(Closed under Vector Addition)}$$

<br/>

### Step 4: Closure Under Scalar Multiplication

**To prove:**
$$p \in S_1 + S_2, \; \lambda \in \mathbb{R} \implies \lambda p \in S_1 + S_2$$

**Assumptions:**
Let $p = x + y$ with $x \in S_1$, $y \in S_2$, and let $\lambda \in \mathbb{R}$ be arbitrary.

**Proof:**
_Since we have_ $p = x + y$, distribute the scalar across the two pieces:

$$\lambda p = \lambda (x + y) = \underbrace{\lambda x}_{\in \, S_1} + \underbrace{\lambda y}_{\in \, S_2}$$

$\lambda x \in S_1$ and $\lambda y \in S_2$ because each is a subspace and hence closed under scalar multiplication. The scaled vector again splits correctly into one piece from each.

**Thus proved:**
$$\lambda p \in S_1 + S_2 \quad \text{(Closed under Scalar Multiplication)}$$

<br/>

### HENCE (Part a)

_Since we have_ $S_1 + S_2 \subseteq \mathbb{R}^4$, $S_1 + S_2 \neq \emptyset$ because $0$ belongs to it, and closure under both operations, all remaining axioms are inherited from $\mathbb{R}^4$.

$$\therefore S_1 + S_2 \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

<br/>

## Part (b): Basis and Dimension of $S_1 + S_2$

### Step 5: Pool All Spanning Vectors into a Matrix

**To prove:**
Assemble $M$ whose columns are every spanning vector of $S_1$ and $S_2$.

**Assumptions:**
$S_1 + S_2 = \text{span}\{v_1, v_2, w_1, w_2\}$ — the sum of two spans is the span of the pooled list.

**Proof:**
_Since we have_ four spanning vectors in total, place them as columns:

$$M = \begin{pmatrix} v_1 & v_2 & w_1 & w_2 \end{pmatrix} = \begin{pmatrix} 1 & 0 & 0 & 0 \\ 1 & 1 & 0 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

**Thus proved:**
Matrix $M$ is established.

<br/>

### Step 6: Row-Reduce and Count Pivots

**To prove:**
Determine $\text{rank}(M)$, which equals $\dim(S_1 + S_2)$.

**Proof:**
_Since we have_ $M$ in near-triangular shape, one clearing operation per row suffices.

**1.** Apply $R_2 \leftarrow R_2 - R_1$:

$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

**2.** Apply $R_3 \leftarrow R_3 - R_2$:

$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

**3.** Apply $R_4 \leftarrow R_4 - R_3$:

$$\begin{pmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix} \quad (\text{REF} = I_4)$$

Pivots sit in **all four columns**, so $\text{rank}(M) = 4$ and no pooled vector is redundant.

**Thus proved:**
$\{v_1, v_2, w_1, w_2\}$ is linearly independent.

<br/>

### Step 7: Basis and Dimension

_Since we have_ 4 pivot columns, take the corresponding columns of the **original** $M$:

$$\text{Basis}(S_1 + S_2) = \left\{ \begin{pmatrix} 1 \\ 1 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 0 \\ 1 \end{pmatrix} \right\}, \qquad \dim(S_1 + S_2) = 4$$

**Space identity:** $\dim(S_1 + S_2) = 4 = \dim \mathbb{R}^4$, and a 4-dimensional subspace of a 4-dimensional space is the whole space, so

$$S_1 + S_2 = \mathbb{R}^4 \quad \blacksquare$$

<br/>

### Step 8: Dimension Formula Verification (and Directness)

$$\dim(S_1 + S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2)$$

Here $\dim S_1 = 2$ and $\dim S_2 = 2$ (each spanning pair is visibly independent — neither vector is a multiple of the other), and $\dim(S_1 + S_2) = 4$ from Step 7. Rearranging:

$$\dim(S_1 \cap S_2) = 2 + 2 - 4 = 0 \implies S_1 \cap S_2 = \{0\}$$

**Direct confirmation.** A general element of $S_1$ is $a v_1 + b v_2 = (a,\; a+b,\; b,\; 0)^T$ and of $S_2$ is $c w_1 + d w_2 = (0,\; 0,\; c,\; c+d)^T$. Equating componentwise:

$$a = 0 \implies a + b = 0 \implies b = 0 \implies c = b = 0 \implies c + d = 0 \implies d = 0$$

So the only shared vector is $0$, confirming $\dim(S_1 \cap S_2) = 0$, and

$$4 = 2 + 2 - 0 \quad \checkmark$$

**Because the intersection is trivial, the sum is a direct sum:**
$$S_1 \oplus S_2 = \mathbb{R}^4$$

> **Reading the answer:** every vector in $\mathbb{R}^4$ splits into an $S_1$-piece plus an $S_2$-piece in exactly **one** way. Uniqueness of that split is precisely what the $\oplus$ symbol asserts, and it holds if and only if the intersection is $\{0\}$.

---

---

# Q18

### Question

Let $v_1 = (1,2,0,1)^T$, $v_2 = (0,1,1,0)^T$ span $S_1 \subset \mathbb{R}^4$, and let $w_1 = (1,3,1,1)^T$, $w_2 = (2,1,0,1)^T$ span $S_2 \subset \mathbb{R}^4$, with
$$S_1 + S_2 = \{ x + y : x \in S_1, \; y \in S_2 \}.$$
(a) Prove that $S_1 + S_2$ is a subspace of $\mathbb{R}^4$.
(b) Find a basis and the dimension of $S_1 + S_2$.

---

## Answer

## Part (a): $S_1 + S_2$ Is a Subspace of $\mathbb{R}^4$

### Step 1: Setup (Subset Property)

**Given:** $S_1 + S_2 = \{ p \in \mathbb{R}^4 : p = x + y, \; x \in S_1, \; y \in S_2 \}$, ambient space $V = \mathbb{R}^4$.

**Proof:**
_Since we have_ $x \in S_1 \subseteq \mathbb{R}^4$ and $y \in S_2 \subseteq \mathbb{R}^4$, and $\mathbb{R}^4$ is closed under vector addition, the sum $x + y$ lands in $\mathbb{R}^4$.

**Thus proved:**
$$S_1 + S_2 \subseteq \mathbb{R}^4 \quad \text{(Subset Property Established)}$$

### Step 2: Non-Emptiness

**Proof:**
_Since we have_ $S_1, S_2$ subspaces, $0 \in S_1$ and $0 \in S_2$. Split the zero vector as $0 = 0 + 0$ with the first piece from $S_1$ and the second from $S_2$.

**Thus proved:**
$$0 \in S_1 + S_2 \implies S_1 + S_2 \neq \emptyset$$

### Step 3: Closure Under Vector Addition (Piece Split)

**Assumptions:** let $p, q \in S_1 + S_2$ be arbitrary. By definition each splits into pieces:

$$p = x + y \quad (x \in S_1, \; y \in S_2), \qquad q = u + v \quad (u \in S_1, \; v \in S_2)$$

**Proof:**
_Since we have_ those splittings, regroup the four pieces by which subspace they came from:

$$p + q = (x + y) + (u + v) = \underbrace{(x + u)}_{\in S_1} + \underbrace{(y + v)}_{\in S_2}$$

Regrouping is legal by commutativity and associativity of addition in $\mathbb{R}^4$. Now $x + u \in S_1$ because $S_1$ is a subspace (closed under $+$), and $y + v \in S_2$ because $S_2$ is a subspace. So $p+q$ has been written as (an $S_1$ piece) $+$ (an $S_2$ piece), which is exactly the membership requirement.

**Thus proved:**
$$p + q \in S_1 + S_2 \quad \text{(Closed under Vector Addition)}$$

### Step 4: Closure Under Scalar Multiplication

**Assumptions:** let $p = x + y$ with $x \in S_1$, $y \in S_2$, and let $\lambda \in \mathbb{R}$.

**Proof:**
$$\lambda p = \lambda(x + y) = \underbrace{\lambda x}_{\in S_1} + \underbrace{\lambda y}_{\in S_2}$$

using distributivity in $\mathbb{R}^4$, then scalar closure inside each subspace.

**Thus proved:**
$$\lambda p \in S_1 + S_2 \quad \text{(Closed under Scalar Multiplication)}$$

### HENCE (Part a)

$$\therefore S_1 + S_2 \text{ is a subspace of } \mathbb{R}^4. \quad \blacksquare$$

<br/>

## Part (b): Basis and Dimension

### Step 5: Pool All Spanning Vectors into a Matrix

**Proof:**
_Since we have_ $S_1 + S_2 = \text{span}\{v_1, v_2, w_1, w_2\}$ (every $x+y$ is a combination of the four, and every combination of the four splits into an $S_1$ part and an $S_2$ part), the sum is just the column space of the pooled matrix:

$$M = \begin{pmatrix} v_1 & v_2 & w_1 & w_2 \end{pmatrix} = \begin{pmatrix} 1 & 0 & 1 & 2 \\ 2 & 1 & 3 & 1 \\ 0 & 1 & 1 & 0 \\ 1 & 0 & 1 & 1 \end{pmatrix}$$

### Step 6: Row-Reduce and Count Pivots

**1. Apply $R_2 \leftarrow R_2 - 2R_1$** ($2-2=0$, $1-0=1$, $3-2=1$, $1-4=-3$) **and $R_4 \leftarrow R_4 - R_1$** ($1-1=0$, $0$, $1-1=0$, $1-2=-1$):

$$\begin{pmatrix} 1 & 0 & 1 & 2 \\ 0 & 1 & 1 & -3 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 0 & -1 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 - R_2$** ($1-1=0$, $1-1=0$, $0+3=3$):

$$\begin{pmatrix} 1 & 0 & 1 & 2 \\ 0 & 1 & 1 & -3 \\ 0 & 0 & 0 & 3 \\ 0 & 0 & 0 & -1 \end{pmatrix}$$

**3. Apply $R_3 \leftrightarrow R_4$, then $R_4 \leftarrow R_4 + 3R_3$:**

$$\begin{pmatrix} 1 & 0 & 1 & 2 \\ 0 & 1 & 1 & -3 \\ 0 & 0 & 0 & -1 \\ 0 & 0 & 0 & 0 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **columns 1, 2 and 4** $\implies \text{rank}(M) = 3$.

Column 3 has no pivot, so $w_1$ is redundant — and the reason is visible directly:

$$w_1 = v_1 + v_2 = (1,2,0,1)^T + (0,1,1,0)^T = (1,3,1,1)^T \;\checkmark$$

### Step 7: Basis and Dimension

**Basis Selection Rule — pivot columns of the ORIGINAL pooled matrix** (columns 1, 2, 4):

$$\text{Basis}(S_1 + S_2) = \left\{ \begin{pmatrix} 1 \\ 2 \\ 0 \\ 1 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 2 \\ 1 \\ 0 \\ 1 \end{pmatrix} \right\}, \qquad \dim(S_1 + S_2) = 3 \quad \blacksquare$$

Since $3 < 4$, $S_1 + S_2$ is a proper subspace of $\mathbb{R}^4$ — the hyperplane

$$S_1 + S_2 = \left\{ z \in \mathbb{R}^4 : z_1 + z_2 - z_3 - 3z_4 = 0 \right\}$$

**Check all four spanning vectors:**
$$v_1:\; 1 + 2 - 0 - 3 = 0 \;\checkmark \qquad v_2:\; 0 + 1 - 1 - 0 = 0 \;\checkmark$$
$$w_1:\; 1 + 3 - 1 - 3 = 0 \;\checkmark \qquad w_2:\; 2 + 1 - 0 - 3 = 0 \;\checkmark$$

### Step 8: Dimension Formula Verification

Find $\dim(S_1 \cap S_2)$ independently by solving $a v_1 + b v_2 - c w_1 - d w_2 = 0$:

$$M' = \begin{pmatrix} 1 & 0 & -1 & -2 \\ 2 & 1 & -3 & -1 \\ 0 & 1 & -1 & 0 \\ 1 & 0 & -1 & -1 \end{pmatrix} \xrightarrow{\substack{R_2 \leftarrow R_2 - 2R_1 \\ R_4 \leftarrow R_4 - R_1}} \begin{pmatrix} 1 & 0 & -1 & -2 \\ 0 & 1 & -1 & 3 \\ 0 & 1 & -1 & 0 \\ 0 & 0 & 0 & 1 \end{pmatrix} \xrightarrow{R_3 \leftarrow R_3 - R_2} \begin{pmatrix} 1 & 0 & -1 & -2 \\ 0 & 1 & -1 & 3 \\ 0 & 0 & 0 & -3 \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

A final $R_4 \leftarrow R_4 + \tfrac13 R_3$ clears row 4, leaving $\text{rank}(M') = 3$ with pivots in columns 1, 2, 4 and the free variable $c$.

$$\text{Row 3: } -3d = 0 \implies d = 0; \qquad \text{Row 2: } b - c + 3d = 0 \implies b = c; \qquad \text{Row 1: } a - c - 2d = 0 \implies a = c$$

Take $c = 1$: $(a,b,c,d) = (1,1,1,0)$.

- **Via $S_1$:** $x = v_1 + v_2 = (1,3,1,1)^T$
- **Via $S_2$:** $x = 1w_1 + 0w_2 = (1,3,1,1)^T \;\checkmark$

$$\text{Basis}(S_1 \cap S_2) = \left\{ (1,3,1,1)^T \right\}, \qquad \dim(S_1 \cap S_2) = 1$$

$$\dim(S_1+S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 1 = 3 \quad \checkmark \text{ Confirmed}$$

---

---

# Q19

### Question

Let $v_1 = (1,1,0)^T$, $v_2 = (0,1,1)^T$ span $S_1 \subset \mathbb{R}^3$, and let $w_1 = (1,0,1)^T$, $w_2 = (1,1,1)^T$ span $S_2 \subset \mathbb{R}^3$, with $S_1 + S_2 = \{x + y : x \in S_1, y \in S_2\}$.
(a) Prove that $S_1 + S_2$ is a subspace of $\mathbb{R}^3$.
(b) Find a basis and the dimension of $S_1 + S_2$.

---

## Answer

## Part (a): $S_1 + S_2$ Is a Subspace of $\mathbb{R}^3$

### Step 1: Setup (Subset Property)

**Proof:** _Since we have_ $x \in S_1 \subseteq \mathbb{R}^3$ and $y \in S_2 \subseteq \mathbb{R}^3$, and $\mathbb{R}^3$ is closed under $+$, the sum $x+y \in \mathbb{R}^3$.

**Thus proved:** $S_1 + S_2 \subseteq \mathbb{R}^3$.

### Step 2: Non-Emptiness

**Proof:** _Since we have_ $0 \in S_1$ and $0 \in S_2$, write $0 = 0 + 0$ with one piece from each.

**Thus proved:** $0 \in S_1 + S_2 \implies S_1 + S_2 \neq \emptyset$.

### Step 3: Closure Under Vector Addition (Piece Split)

**Assumptions:** $p = x + y$ and $q = u + v$, with $x, u \in S_1$ and $y, v \in S_2$.

**Proof:**
$$p + q = (x+y) + (u+v) = \underbrace{(x+u)}_{\in \,S_1 \text{ (subspace, closed under +)}} + \underbrace{(y+v)}_{\in \,S_2 \text{ (subspace, closed under +)}}$$

**Thus proved:** $p + q \in S_1 + S_2$.

### Step 4: Closure Under Scalar Multiplication

**Proof:** $\lambda p = \lambda(x+y) = \underbrace{\lambda x}_{\in S_1} + \underbrace{\lambda y}_{\in S_2}$.

**Thus proved:** $\lambda p \in S_1 + S_2$.

### HENCE (Part a)

$$\therefore S_1 + S_2 \text{ is a subspace of } \mathbb{R}^3. \quad \blacksquare$$

<br/>

## Part (b): Basis and Dimension

### Step 5: Pool the Spanning Vectors

$$M = \begin{pmatrix} v_1 & v_2 & w_1 & w_2 \end{pmatrix} = \begin{pmatrix} 1 & 0 & 1 & 1 \\ 1 & 1 & 0 & 1 \\ 0 & 1 & 1 & 1 \end{pmatrix}$$

### Step 6: Row-Reduce and Count Pivots

**1. Apply $R_2 \leftarrow R_2 - R_1$** ($1-1=0$, $1-0=1$, $0-1=-1$, $1-1=0$):

$$\begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & -1 & 0 \\ 0 & 1 & 1 & 1 \end{pmatrix}$$

**2. Apply $R_3 \leftarrow R_3 - R_2$** ($1-1=0$, $1+1=2$, $1-0=1$):

$$\begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & -1 & 0 \\ 0 & 0 & 2 & 1 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **columns 1, 2 and 3** $\implies \text{rank}(M) = 3$.

### Step 7: Basis and Dimension

**Pivot columns of the ORIGINAL pooled matrix** (columns 1, 2, 3):

$$\text{Basis}(S_1 + S_2) = \left\{ \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 0 \\ 1 \end{pmatrix} \right\}, \qquad \dim(S_1 + S_2) = 3$$

**Space identity:** $\dim(S_1+S_2) = 3 = \dim\mathbb{R}^3 \implies S_1 + S_2 = \mathbb{R}^3$ (the whole space). $\quad \blacksquare$

**The redundant vector.** Column 4 has no pivot, so $w_2$ is a combination of the first three. Back-substituting $w_2 = \alpha v_1 + \beta v_2 + \gamma w_1$ in the REF:

$$\text{Row 3: } 2\gamma = 1 \implies \gamma = \tfrac12; \qquad \text{Row 2: } \beta - \gamma = 0 \implies \beta = \tfrac12; \qquad \text{Row 1: } \alpha + \gamma = 1 \implies \alpha = \tfrac12$$

**Check:** $\tfrac12\left[(1,1,0) + (0,1,1) + (1,0,1)\right] = \tfrac12 (2,2,2) = (1,1,1) = w_2 \;\checkmark$

### Step 8: Dimension Formula Verification

Solve $a v_1 + b v_2 - c w_1 - d w_2 = 0$:

$$M' = \begin{pmatrix} 1 & 0 & -1 & -1 \\ 1 & 1 & 0 & -1 \\ 0 & 1 & -1 & -1 \end{pmatrix} \xrightarrow{R_2 \leftarrow R_2 - R_1} \begin{pmatrix} 1 & 0 & -1 & -1 \\ 0 & 1 & 1 & 0 \\ 0 & 1 & -1 & -1 \end{pmatrix} \xrightarrow{R_3 \leftarrow R_3 - R_2} \begin{pmatrix} 1 & 0 & -1 & -1 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & -2 & -1 \end{pmatrix}$$

$\text{rank}(M') = 3$, free variable $d$, so $\text{nullity} = 4 - 3 = 1$.

$$\text{Row 3: } -2c - d = 0 \implies c = -\tfrac{d}{2}$$
$$\text{Row 2: } b + c = 0 \implies b = \tfrac{d}{2}$$
$$\text{Row 1: } a - c - d = 0 \implies a = c + d = -\tfrac{d}{2} + d = \tfrac{d}{2}$$

Take $d = 2$: $a = 1, \; b = 1, \; c = -1, \; d = 2$.

**Dual Vector Verification:**

- **Via $S_1$:** $x = v_1 + v_2 = (1,1,0)^T + (0,1,1)^T = (1,2,1)^T$
- **Via $S_2$:** $x = -w_1 + 2w_2 = -(1,0,1)^T + (2,2,2)^T = (1,2,1)^T \;\checkmark$

$$\text{Basis}(S_1 \cap S_2) = \left\{ (1,2,1)^T \right\}, \qquad \dim(S_1 \cap S_2) = 1$$

$$\dim(S_1 + S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 1 = 3 \quad \checkmark \text{ Confirmed}$$

> Two distinct planes through the origin in $\mathbb{R}^3$ always meet in a line ($\dim = 1$) and always span the whole of $\mathbb{R}^3$ ($\dim = 3$) — the formula $2 + 2 - 1 = 3$ says exactly that.

---

---

# Q20

### Question

Let $v_1 = (1,0,1,0,0)^T$, $v_2 = (0,1,0,1,0)^T$ span $S_1 \subset \mathbb{R}^5$, and let $w_1 = (0,0,1,1,1)^T$, $w_2 = (1,1,0,0,1)^T$ span $S_2 \subset \mathbb{R}^5$, with $S_1 + S_2 = \{x + y : x \in S_1, y \in S_2\}$.
(a) Prove that $S_1 + S_2$ is a subspace of $\mathbb{R}^5$.
(b) Find a basis and the dimension of $S_1 + S_2$, and determine whether the sum is direct.

---

## Answer

## Part (a): $S_1 + S_2$ Is a Subspace of $\mathbb{R}^5$

### Step 1: Setup (Subset Property)

**Given:** $S_1 + S_2 = \{p \in \mathbb{R}^5 : p = x + y, \; x \in S_1, \; y \in S_2\}$.

**Proof:** _Since we have_ $x \in S_1 \subseteq \mathbb{R}^5$, $y \in S_2 \subseteq \mathbb{R}^5$, and $\mathbb{R}^5$ closed under $+$: $x + y \in \mathbb{R}^5$.

**Thus proved:** $S_1 + S_2 \subseteq \mathbb{R}^5$.

### Step 2: Non-Emptiness

**Proof:** _Since we have_ $0 \in S_1$ and $0 \in S_2$ (both are subspaces), the split $0 = 0 + 0$ is legal.

**Thus proved:** $0 \in S_1 + S_2 \implies S_1 + S_2 \neq \emptyset$.

### Step 3: Closure Under Vector Addition (Piece Split)

**Assumptions:** $p = x + y$, $q = u + v$ with $x, u \in S_1$ and $y, v \in S_2$.

**Proof:**
$$p + q = (x+y)+(u+v) = \underbrace{(x+u)}_{\in S_1} + \underbrace{(y+v)}_{\in S_2}$$

**Thus proved:** $p+q \in S_1 + S_2$.

### Step 4: Closure Under Scalar Multiplication

**Proof:** $\lambda p = \lambda(x+y) = \underbrace{\lambda x}_{\in S_1} + \underbrace{\lambda y}_{\in S_2}$ for any $\lambda \in \mathbb{R}$.

**Thus proved:** $\lambda p \in S_1 + S_2$.

### HENCE (Part a)

$$\therefore S_1 + S_2 \text{ is a subspace of } \mathbb{R}^5. \quad \blacksquare$$

<br/>

## Part (b): Basis, Dimension, and Directness

### Step 5: Pool the Spanning Vectors

$$M = \begin{pmatrix} v_1 & v_2 & w_1 & w_2 \end{pmatrix} = \begin{pmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 1 & 0 & 1 & 0 \\ 0 & 1 & 1 & 0 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

(5 rows because the vectors live in $\mathbb{R}^5$; 4 columns because there are 4 of them.)

### Step 6: Row-Reduce and Count Pivots

**1. Apply $R_3 \leftarrow R_3 - R_1$** ($1-1=0$, $0$, $1-0=1$, $0-1=-1$) **and $R_4 \leftarrow R_4 - R_2$** ($0$, $1-1=0$, $1-0=1$, $0-1=-1$):

$$\begin{pmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & 1 & 1 \end{pmatrix}$$

**2. Apply $R_4 \leftarrow R_4 - R_3$** (rows 3 and 4 are now identical, so row 4 vanishes) **and $R_5 \leftarrow R_5 - R_3$** ($1-1=0$, $1+1=2$):

$$\begin{pmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & 0 & 0 \\ 0 & 0 & 0 & 2 \end{pmatrix}$$

**3. Apply $R_4 \leftrightarrow R_5$** (move the zero row to the bottom):

$$\begin{pmatrix} 1 & 0 & 0 & 1 \\ 0 & 1 & 0 & 1 \\ 0 & 0 & 1 & -1 \\ 0 & 0 & 0 & 2 \\ 0 & 0 & 0 & 0 \end{pmatrix} \quad (\text{REF})$$

Pivots lie in **all four columns 1, 2, 3, 4** $\implies \text{rank}(M) = 4$.

**Thus proved:** all four pooled vectors $v_1, v_2, w_1, w_2$ are linearly independent.

### Step 7: Basis and Dimension

$$\text{Basis}(S_1 + S_2) = \left\{ \begin{pmatrix} 1 \\ 0 \\ 1 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 0 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 1 \\ 1 \\ 1 \end{pmatrix}, \begin{pmatrix} 1 \\ 1 \\ 0 \\ 0 \\ 1 \end{pmatrix} \right\}, \qquad \dim(S_1 + S_2) = 4 \quad \blacksquare$$

Since $4 < 5$, this is a proper subspace of $\mathbb{R}^5$ — the hyperplane

$$S_1 + S_2 = \left\{ z \in \mathbb{R}^5 : z_1 - z_2 - z_3 + z_4 = 0 \right\}$$

**Check all four basis vectors:**
$$v_1:\; 1 - 0 - 1 + 0 = 0 \;\checkmark \qquad v_2:\; 0 - 1 - 0 + 1 = 0 \;\checkmark$$
$$w_1:\; 0 - 0 - 1 + 1 = 0 \;\checkmark \qquad w_2:\; 1 - 1 - 0 + 0 = 0 \;\checkmark$$

### Step 8: The Intersection and Directness

**To prove:** $S_1 \cap S_2 = \{0\}$.

**Proof:**
_Since we have_ the equation $a v_1 + b v_2 - c w_1 - d w_2 = 0$ for intersection membership, note that its matrix

$$M' = \begin{pmatrix} v_1 & v_2 & -w_1 & -w_2 \end{pmatrix}$$

differs from $M$ only by multiplying columns 3 and 4 by $-1$. Scaling a column by a non-zero number never changes the rank, so $\text{rank}(M') = \text{rank}(M) = 4$ as well, and

$$\text{nullity}(M') = 4 - 4 = 0$$

Hence the only coefficient vector is $z = (a,b,c,d)^T = (0,0,0,0)^T$, giving $x = 0v_1 + 0v_2 = 0$.

**Thus proved:**
$$S_1 \cap S_2 = \{0\}, \qquad \text{Basis} = \emptyset, \qquad \dim(S_1 \cap S_2) = 0$$

### Step 9: Dimension Formula Verification

$$\dim(S_1 + S_2) = \dim S_1 + \dim S_2 - \dim(S_1 \cap S_2) = 2 + 2 - 0 = 4 \quad \checkmark \text{ Confirmed}$$

Because the intersection is trivial, the sum is a **direct sum**:

$$S_1 \oplus S_2 = \text{span}\{v_1,v_2,w_1,w_2\}, \qquad \dim = 4$$

**What "direct" means concretely.** Every $p \in S_1 + S_2$ has **exactly one** split $p = x + y$. Suppose $p = x + y = x' + y'$ with $x, x' \in S_1$ and $y, y' \in S_2$. Then $x - x' = y' - y$; the left side is in $S_1$ and the right side is in $S_2$, so this common vector lies in $S_1 \cap S_2 = \{0\}$, forcing $x = x'$ and $y = y'$.

**Numerical illustration.** Take $p = 3v_1 - v_2 + 2w_1 = 3(1,0,1,0,0)^T - (0,1,0,1,0)^T + 2(0,0,1,1,1)^T = (3,-1,5,1,2)^T$. Its unique split is
$$x = (3,-1,3,-1,0)^T \in S_1, \qquad y = (0,0,2,2,2)^T \in S_2, \qquad x + y = (3,-1,5,1,2)^T \;\checkmark$$
and the hyperplane test confirms membership: $3 - (-1) - 5 + 1 = 0 \;\checkmark$

---

---

# Answer Summary

> = the five questions that appeared on **Assignment 1** itself. The other fifteen are practice built around the same five skills.

|    #    | Topic                                                        | Final Answer                                                                                                                             |
| :-----: | :----------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| **Q1**  | **Assignment Q1** — $\sum_{i=1}^n x_i = 0$ in $\mathbb{R}^n$ | Subspace; $\dim U = n-1$, basis $\{(-1,1,0,\dots,0)^T, \dots, (-1,0,\dots,0,1)^T\}$                                                      |
| **Q2**  | Subspace of $\mathbb{R}^4$, one equation                     | Subspace; basis $\{(-2,1,0,0)^T,(1,0,1,0)^T,(-3,0,0,1)^T\}$, $\dim = 3$                                                                  |
| **Q3**  | Subspace of $\mathbb{R}^3$, two equations                    | Subspace; basis $\{(2,2,1)^T\}$, $\dim = 1$                                                                                              |
| **Q4**  | $x_1+x_2+x_3=6$; $x_1x_2=0$                                  | Neither is a subspace ($0 \notin W_1$; $W_2$ fails addition)                                                                             |
| **Q5**  | **Assignment Q2** — $3\times5$, rank 3                       | $x_p = \tfrac{1}{13}(1044,-96,-24,0,0)^T$; $h_1 = (-74,8,2,13,0)^T$, $h_2 = (-147,18,11,0,13)^T$                                         |
| **Q6**  | $3\times4$, rank 2                                           | $x_p = (4,0,-1,0)^T$; $h_1 = (-2,1,0,0)^T$, $h_2 = (-1,0,2,1)^T$                                                                         |
| **Q7**  | $3\times5$, rank 3                                           | $x_p = (4,2,0,1,0)^T$; $h_1 = (1,-2,1,0,0)^T$, $h_2 = (-2,1,0,0,1)^T$                                                                    |
| **Q8**  | Inconsistent system                                          | No solution ($2 = \text{rank}A \neq \text{rank}[A \mid b] = 3$); solvable iff $b_3 = b_1+b_2$; $\text{Null} = \text{span}\{(-2,1,0)^T\}$ |
| **Q9**  | **Assignment Q3** — $3\times5$, rank 3                       | $\dim\text{Col} = \dim\text{Row} = 3$, so $\text{Col}(C) = \mathbb{R}^3$; $\dim\text{Null} = 2$; $3+2 = 5$                               |
| **Q10** | $3\times4$, rank 2                                           | $\dim\text{Col} = \dim\text{Row} = 2$, $\dim\text{Null} = 2$; $2+2 = 4$                                                                  |
| **Q11** | $4\times3$, rank 3                                           | $\dim\text{Col} = 3$ (hyperplane in $\mathbb{R}^4$), $\text{Row} = \mathbb{R}^3$, $\text{Null} = \{0\}$; $3+0 = 3$                       |
| **Q12** | $4\times5$, rank 3                                           | $\dim\text{Col} = \dim\text{Row} = 3$, $\dim\text{Null} = 2$; $3+2 = 5$                                                                  |
| **Q13** | **Assignment Q4** — $S_1\cap S_2$ in $\mathbb{R}^3$          | Basis $\{(1,3,2)^T\}$, $\dim = 1$; $3 = 2+2-1$                                                                                           |
| **Q14** | $S_1\cap S_2$ in $\mathbb{R}^3$                              | Basis $\{(9,12,5)^T\}$, $\dim = 1$; $3 = 2+2-1$                                                                                          |
| **Q15** | $S_1\cap S_2$ in $\mathbb{R}^4$                              | Basis $\{(1,2,1,1)^T\}$, $\dim = 1$; $3 = 2+2-1$                                                                                         |
| **Q16** | $S_1\cap S_2$ in $\mathbb{R}^4$                              | $\{0\}$, basis $\emptyset$, $\dim = 0$; $4 = 2+2-0$, so $S_1\oplus S_2 = \mathbb{R}^4$                                                   |
| **Q17** | **Assignment Q5** — $S_1+S_2$ in $\mathbb{R}^4$              | Basis $\{v_1,v_2,w_1,w_2\}$, $\dim = 4 \implies S_1 \oplus S_2 = \mathbb{R}^4$; $S_1\cap S_2 = \{0\}$                                    |
| **Q18** | $S_1+S_2$ in $\mathbb{R}^4$                                  | Basis $\{v_1,v_2,w_2\}$, $\dim = 3$; $\dim(S_1\cap S_2) = 1$                                                                             |
| **Q19** | $S_1+S_2$ in $\mathbb{R}^3$                                  | Basis $\{v_1,v_2,w_1\}$, $\dim = 3 \implies S_1+S_2 = \mathbb{R}^3$; $\dim(S_1\cap S_2) = 1$                                             |
| **Q20** | $S_1+S_2$ in $\mathbb{R}^5$                                  | Basis $\{v_1,v_2,w_1,w_2\}$, $\dim = 4$; $S_1\cap S_2 = \{0\}$, direct sum                                                               |

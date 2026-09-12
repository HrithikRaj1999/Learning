# Assignment 1 — Complete Solutions
### DSEZC411 Essential Mathematics for Data Science

> 📄 **Writing the exam? Use [ASSIGNMENT_1_EXAM_SHEET.md](./ASSIGNMENT_1_EXAM_SHEET.md) instead.**
> That file is the copy-this-down version, timed for 40 minutes.
> This file is the *why* — read it while studying, not while writing.

**One pattern for every question.** Learn the skeleton once, reuse it everywhere.

### Notation used in this file

```
ℝⁿ        the space of all lists of n real numbers
xᵢ        the i-th entry of the vector x          (subscript = position)
c₁ c₂ c₃  the 1st, 2nd, 3rd column vectors        (subscript = which vector)
aᵢ        the i-th scalar coefficient
(1,1,1)ᵀ  a column vector written sideways (ᵀ = transpose)
λ         lambda, an arbitrary real number
φ         the empty set
∴         therefore
∎         end of proof

 n
 Σ  xᵢ    means    x₁ + x₂ + … + xₙ
i=1
```

---

# THE FIXED SKELETON

Every step, without exception, is written in this order:

```
To prove    :  the sub-goal of THIS step
Assumptions :  what is given, or what you "let"
Working     :  unpacking (translate "∈ U" using the definition) + algebra
Thus        :  the sub-goal has been reached
                        ⋮
Hence       :  the overall conclusion — written ONCE, at the end
```

**Thus** closes a step.  **Hence** closes the whole proof.

## Blank version

```
AIM:  state the goal of the WHOLE question ONCE, before Step 1.
      e.g. "U is a subspace of V; find its basis and dimension."

Step 1: Setting up          ← no "To prove" and no "Assumptions" line here
   Given       : write U = { … } in symbols, and name the ambient space V
   Working     : why every element of U lies in V
   Thus        : U ⊆ V   (SUBSET — not yet subspace)

Step 2: Non-emptiness
   To prove    : U ≠ φ
   Assumptions : the definition of U
   Working     : substitute zeros / the zero vector
   Thus        : 0 ∈ U,  ∴ U ≠ φ

Step 3: Closure under Addition [inner opⁿ]
   To prove    : x, y ∈ U  ⇒  x + y ∈ U
   Assumptions : Let x, y ∈ U, arbitrary
   Working     : unpack x and y (NEW letters for y), then add
   Thus        : x + y ∈ U

Step 4: Closure under Scalar multiplication [outer opⁿ]
   To prove    : x ∈ U, λ ∈ ℝ  ⇒  λx ∈ U
   Assumptions : Let x ∈ U arbitrary, λ ∈ ℝ
   Working     : unpack x, then multiply by λ
   Thus        : λx ∈ U

HENCE: U ≠ φ and U is closed under both operations. Remaining axioms are
       inherited from V since U ⊆ V.  ∴ U is a subspace of V.   ∎
```

### "AIM" vs "To prove" — keep the two scopes apart

`To prove` inside a step always means **the sub-goal of that one step**. The goal of
the whole question is written once at the top as `AIM`, never repeated as a step's
`To prove`. Using the same heading for both scopes is what makes an answer confusing
to read.

```
AIM      :  U is a subspace of V; find its basis and dimension     ← whole question
Step 2   :  To prove: U ≠ φ                                        ← this step only
Step 3   :  To prove: x, y ∈ U ⇒ x + y ∈ U                         ← this step only
Step 4   :  To prove: x ∈ U, λ ∈ ℝ ⇒ λx ∈ U                        ← this step only
```

Step 1 therefore has **no** `To prove` line — the aim is already stated above it, and
Step 1's only job is to establish `U ⊆ V`.

### Why Step 1 has no "Assumptions" line

"Assumptions" earns a separate line only where you genuinely **let** something be
arbitrary — that is, Steps 3 and 4:

```
Step 3   Assumptions : Let x, y ∈ U, arbitrary        ← a real assumption
         Working     : unpack them, then add          ← different content
```

In Step 1 nothing is assumed; you are only naming things. Writing the set in words
*and* in symbols is the same statement twice, so drop the words and keep the symbols.

### Why is U ⊆ V true?

Four shapes appear in this assignment. Each has a **one-line** exam answer — take
an arbitrary element and chase it into the ambient space.

| `U` written as | What to write in the exam | Seen in |
|---|---|---|
| `{ x ∈ ℝⁿ : condition }` | *Free from the notation.* `x ∈ ℝⁿ` sits **before** the colon, so nothing is in `U` without already being in `ℝⁿ`. | Q1 |
| `span{c₁,…,c₅}` | `cᵢ ∈ ℝ³`, and `ℝ³` closed under `+` and `λ·`  ⇒  `a₁c₁ + … + a₅c₅ ∈ ℝ³` | Q3 |
| `S₁ ∩ S₂` | `x ∈ S₁ ∩ S₂ ⇒ x ∈ S₁`, and `S₁ ⊆ ℝ³ ⇒ x ∈ ℝ³`<br>shorter: `S₁ ∩ S₂ ⊆ S₁ ⊆ ℝ³` | Q4 |
| `S₁ + S₂` | `x ∈ S₁ ⊆ ℝ⁴`, `y ∈ S₂ ⊆ ℝ⁴`, and `ℝ⁴` closed under `+`  ⇒  `x + y ∈ ℝ⁴` | Q5 |

**The one difference worth remembering:** `∩` **selects** an element that is
already there, so it is free. `+` **builds** a new element `x + y`, so you must
name the closure of the ambient space as the reason it stays inside.


### ⚠ TRAP — "U ⊆ ℝⁿ, therefore U is a subspace of ℝⁿ"

**This is WRONG.** Subset and subspace are different claims.

```
U ⊆ ℝⁿ           means:  every element of U is a vector of ℝⁿ      ← MEMBERSHIP
U is a subspace  means:  U ⊆ ℝⁿ  AND  U ≠ φ  AND  closed under + and ·   ← STRUCTURE
```

The set-builder gives you only the first line. If it gave the second, Steps 2, 3 and 4
would be pointless and every set `{ x ∈ ℝⁿ : anything }` would be a subspace.

**Counter-examples — both are subsets of the ambient space, neither is a subspace:**

| Set | `⊆` holds? | Subspace? | Why it fails |
|---|---|---|---|
| `{ (x,y) ∈ ℝ² : −1 ≤ x ≤ 1, −1 ≤ y ≤ 1 }` (the square, Lecture 2) | yes | **no** | `(1,1) ∈ U` but `5·(1,1) = (5,5) ∉ U` — not closed under scaling |
| `{ x ∈ ℝⁿ : Σ xᵢ = 1 }` | yes | **no** | `0 ∉ U`, since its entries sum to `0`, not `1` — fails Step 2 |

Same notation, same `⊆`, different answers. So `⊆` alone cannot decide it.

**Also never write "as we have assumed".** You did not assume `U` is a subspace —
that is the conclusion being proved. Assuming the goal and then concluding it is
circular reasoning and scores zero even when the last sentence looks correct.

```
Assumed  :  U = { x ∈ ℝⁿ : Σ xᵢ = 0 }      ← only a definition
To prove :  U is a subspace of ℝⁿ           ← the goal
```

**What `U ⊆ ℝⁿ` genuinely buys you:** the remaining axioms (associativity,
commutativity, distributivity, neutral element) are *inherited* from `ℝⁿ`, so you
need not check them. That is why the test is 3 items instead of 10. The inclusion
saves work; it does not finish the proof.

**The correct logic, in order:**

```
1.  U ⊆ ℝⁿ                  from the notation (or a one-line argument)   FREE
2.  U ≠ φ                   Step 2                                       MUST PROVE
3.  closed under +          Step 3                                       MUST PROVE
4.  closed under ·          Step 4                                       MUST PROVE
5.  remaining axioms        inherited, because of 1                      FREE
    ────────────────────────────────────────────────────────────────
    ∴  U is a subspace of ℝⁿ
```

Line 1 alone proves nothing. Lines 2–4 are the actual work.


### ⚠ Two different closures — Step 1 is not circular

Students often object: *"Step 1 says ℝ³ is closed under + and ·, but that is what
Steps 3 and 4 are supposed to prove!"*  These are **different statements about
different sets**:

```
Step 1 uses    :  ℝ³ is closed under + and ·     ← GIVEN, an axiom of ℝ³
Steps 3–4 prove:  U  is closed under + and ·     ← UNKNOWN, must be proved
```

Closure of `ℝ³` is not proved — it is part of what "`ℝ³` is a vector space" means.
Lecture 2 states the operations as `+ : 𝒱 × 𝒱 → 𝒱` and `· : ℝ × 𝒱 → 𝒱`; the arrow
`→ 𝒱` *is* the closure.

The claims are also logically different:

```
Step 1 :  u ∈ U          ⇒  u ∈ ℝ³         "U sits inside ℝ³"
Step 3 :  u, v ∈ U       ⇒  u + v ∈ U      "U does not leak out of itself"
```

**Proof that they are independent.** Take `U = { (1,0), (0,1) }` in `ℝ²`:

| Claim | Value |
|---|---|
| `U ⊆ ℝ²` (Step 1 style) | **TRUE** — both are `ℝ²` vectors |
| `U` closed under addition (Step 3 style) | **FALSE** — `(1,0)+(0,1) = (1,1) ∉ U` |

Step 1 can hold while Step 3 fails, so Step 1 cannot be assuming Step 3.

**Why Step 1 is needed at all** — two reasons, neither being "prove the subspace":
1. "Subspace **of ℝ³**" is meaningless unless `U` is inside `ℝ³`.
2. It licenses the inheritance sentence, letting you skip 7 axioms.

If basis and dimension are also asked, continue:

```
Step 5: Row Echelon Form
   To prove    : which vectors are linearly independent
   Assumptions : the relevant preservation property of row operations
   Working     : show EVERY row operation
   Thus        : identify the pivots / the independent vectors

Step 6: Basis and Dimension
   To prove    : the basis and dimension
   Assumptions : the pivot rule being used
   Working     : select the correct vectors
   Thus        : state the basis and the dimension
```

## The only thing that changes between questions

The skeleton never changes. Only the **unpacking** changes, because only the
definition of the set changes.

| Question | Unpacking gives | "Thus" is justified when |
|---|---|---|
| **Q1** entries sum to zero | `Σ xᵢ = 0` | the new sum equals `0` |
| **Q3** span of columns / rows | `u = Σ aᵢcᵢ` | you have `Σ (real number)·cᵢ` |
| **Q4** `S₁ ∩ S₂` | `x ∈ S₁` **and** `x ∈ S₂` | shown to be in `S₁` **and** in `S₂` |
| **Q5** `S₁ + S₂` | `p = x + y`, `x ∈ S₁`, `y ∈ S₂` | it splits in the same way |
| nullspace | `Ax = 0` | `A(new vector) = 0` |

## Two rules that prevent most lost marks

1. **Never assume the goal.** Step 3 does not begin with `x + y ∈ U` — that is what
   you are proving. Begin from `x` and `y` separately.
2. **New letters for the second vector.** `x = Σ aᵢcᵢ`, `y = Σ bᵢcᵢ`.
   Reusing `aᵢ` for both silently assumes `x = y`.

---
---
---

# Q1

> Consider the set of all vectors `x ∈ ℝⁿ` that satisfies
> ```
>  n
>  Σ  xᵢ = 0
> i=1
> ```
> Prove that the collection of all such vectors is a subspace of `ℝⁿ`.   **(1 mark)**

**AIM:** prove that `U` is a subspace of `ℝⁿ`.

## Step 1: Setting up

**Given:** Let

```
              ⎧             n          ⎫
        U  =  ⎨  x ∈ ℝⁿ  :  Σ  xᵢ = 0  ⎬                V = ℝⁿ
              ⎩            i=1         ⎭
```

**Working:** the clause `x ∈ ℝⁿ` stands *before* the colon, so it restricts candidates
to `ℝⁿ` before the condition `Σ xᵢ = 0` is even applied. Nothing can belong to `U`
without already belonging to `ℝⁿ`.

**Thus:**  `U ⊆ ℝⁿ`   (SUBSET — the subspace claim is proved only after Step 4)

---

## Step 2: Non-emptiness

**To prove:**  `U ≠ φ`

**Assumptions:** the definition of `U` from Step 1.

**Working:** Take the zero vector  `0 = (0, 0, …, 0) ∈ ℝⁿ`.

```
 n
 Σ  0  =  0 + 0 + … + 0  =  0
i=1
```

So `0` satisfies the defining condition of `U`.

**Thus:**  `0 ∈ U`,  ∴  `U ≠ φ`     [Non-empty vector set]

---

## Step 3: Closure under Addition [inner opⁿ]

**To prove:**  `x, y ∈ U  ⇒  x + y ∈ U`

**Assumptions:** Let `x, y ∈ U`, arbitrary.

**Working:**

*Unpacking* — by the definition of `U`:

```
                     n
   x ∈ U    ⇒        Σ  xᵢ  =  0
                    i=1

                     n
   y ∈ U    ⇒        Σ  yᵢ  =  0
                    i=1
```

*Algebra* — the `i`-th entry of `x + y` is `xᵢ + yᵢ`, so

```
 n                 n
 Σ  (x + y)ᵢ   =   Σ  (xᵢ + yᵢ)
i=1               i=1

                   n         n
               =   Σ  xᵢ  +  Σ  yᵢ
                  i=1       i=1

               =   0  +  0

               =   0
```

So `x + y` satisfies the defining condition of `U`.

**Thus:**  `x + y ∈ U`,  i.e. `U` is closed under addition.

---

## Step 4: Closure under Scalar multiplication [outer opⁿ]

**To prove:**  `x ∈ U,  λ ∈ ℝ  ⇒  λx ∈ U`

**Assumptions:** Let `x ∈ U` arbitrary and `λ ∈ ℝ`.

**Working:**

*Unpacking:*

```
                     n
   x ∈ U    ⇒        Σ  xᵢ  =  0
                    i=1
```

*Algebra* — the `i`-th entry of `λx` is `λxᵢ`, so

```
 n               n
 Σ  (λx)ᵢ    =   Σ  λ xᵢ
i=1             i=1

                       n
             =    λ ·  Σ  xᵢ
                      i=1

             =    λ · 0

             =    0
```

So `λx` satisfies the defining condition of `U`.

**Thus:**  `λx ∈ U`,  i.e. `U` is closed under scalar multiplication.

---

## HENCE:

`U ≠ φ` (Step 2), `U` is closed under addition (Step 3) and under scalar
multiplication (Step 4). All remaining vector-space axioms (associativity,
commutativity, distributivity, neutral element) are inherited from `ℝⁿ`
since `U ⊆ ℝⁿ`.

**Hence `U` is a subspace of `ℝⁿ`.**   ∎

---
---
---

# Q3

```
        ⎡  1    2    1    2   -1 ⎤
   C =  ⎢  1    1    0   -1    4 ⎥          C is 3 × 5
        ⎣  1   -2    4    1    0 ⎦
```

> i)  Prove that the space spanned by columns of `C` forms a subspace of `ℝ³`.
>     Find its basis and dimension.
> ii) Prove that the space spanned by rows of `C` forms a subspace of `ℝ⁵`.
>     Find its basis and dimension.   **(2 marks)**

---
---

# PART (i) — Space spanned by COLUMNS of C

## Step 1: Setting up

**AIM:** prove that `U = Col(C)` is a subspace of `ℝ³`, and find its basis and dimension.

**Given:** `C` is a `3 × 5` matrix with columns

```
        ⎡ 1⎤          ⎡ 2⎤          ⎡ 1⎤          ⎡ 2⎤          ⎡-1⎤
  c₁ =  ⎢ 1⎥    c₂ =  ⎢ 1⎥    c₃ =  ⎢ 0⎥    c₄ =  ⎢-1⎥    c₅ =  ⎢ 4⎥
        ⎣ 1⎦          ⎣-2⎦          ⎣ 4⎦          ⎣ 1⎦          ⎣ 0⎦
```

**Working:** Each `cᵢ` has 3 entries, so `cᵢ ∈ ℝ³`.

There are 5 columns, so a linear combination requires 5 scalars `a₁, a₂, a₃, a₄, a₅ ∈ ℝ`.
(These are arbitrary real numbers — they do **not** come from the matrix.)

Let

```
        ⎧                                                                 ⎫
   U =  ⎨ u ∈ ℝ³ :  u = a₁c₁ + a₂c₂ + a₃c₃ + a₄c₄ + a₅c₅ ,   aᵢ ∈ ℝ       ⎬
        ⎩                                                                 ⎭

     =  span{ c₁, c₂, c₃, c₄, c₅ }                     V = ℝ³
```

**Thus:** here the inclusion is *not* automatic from the notation — `span{…}` never
mentions `ℝ³`. The reason comes from the vector-space axioms of `ℝ³` itself, whose
operations are defined as

```
   + : ℝ³ × ℝ³ → ℝ³           adding two ℝ³ vectors gives an ℝ³ vector
   · : ℝ  × ℝ³ → ℝ³           scaling an ℝ³ vector gives an ℝ³ vector
```

Each `cᵢ ∈ ℝ³`, so each `aᵢcᵢ ∈ ℝ³`, and their sum `a₁c₁ + … + a₅c₅ ∈ ℝ³`.

**Thus:**  `U ⊆ ℝ³`   (SUBSET — subspace is proved only after Step 4)

> **Not circular.** This uses closure of **`ℝ³`** — an axiom, given free. Steps 3 and 4
> prove closure of **`U`** — a different set, and genuinely unknown until proved.
> See the note "Two different closures" in the skeleton section above.

---

## Step 2: Non-emptiness

**To prove:**  `U ≠ φ`

**Assumptions:** the definition of `U` from Step 1.

**Working:** Take `a₁ = a₂ = a₃ = a₄ = a₅ = 0`

```
                                                 ⎡0⎤
   0·c₁ + 0·c₂ + 0·c₃ + 0·c₄ + 0·c₅   =          ⎢0⎥
                                                 ⎣0⎦
```

This is a linear combination of `c₁,…,c₅`, so it satisfies the defining condition of `U`.

**Thus:**  `0 ∈ U`,  ∴  `U ≠ φ`     [Non-empty vector set]

---

## Step 3: Closure under Addition [inner opⁿ]

**To prove:**  `u, v ∈ U  ⇒  u + v ∈ U`

**Assumptions:** Let `u, v ∈ U`, arbitrary.

**Working:**

*Unpacking* — by the definition of `U`, each vector is a linear combination
with its **own** scalars:

```
                                                             5
   u ∈ U   ⇒   u = a₁c₁ + a₂c₂ + a₃c₃ + a₄c₄ + a₅c₅   =      Σ  aᵢcᵢ ,   aᵢ ∈ ℝ
                                                            i=1

                                                             5
   v ∈ U   ⇒   v = b₁c₁ + b₂c₂ + b₃c₃ + b₄c₄ + b₅c₅   =      Σ  bᵢcᵢ ,   bᵢ ∈ ℝ
                                                            i=1
```

(`u` uses `aᵢ`, `v` uses `bᵢ` — different vectors, different scalars.)

*Algebra:*

```
              5          5
   u + v  =   Σ  aᵢcᵢ +  Σ  bᵢcᵢ
             i=1        i=1

          =  (a₁+b₁)c₁ + (a₂+b₂)c₂ + (a₃+b₃)c₃ + (a₄+b₄)c₄ + (a₅+b₅)c₅

              5
          =   Σ  (aᵢ + bᵢ) cᵢ
             i=1
```

Let `dᵢ = aᵢ + bᵢ`. Since `aᵢ, bᵢ ∈ ℝ` and `ℝ` is closed under addition, `dᵢ ∈ ℝ`.

So `u + v = Σ dᵢcᵢ` with `dᵢ ∈ ℝ` — which satisfies the defining condition of `U`.

**Thus:**  `u + v ∈ U`,  i.e. `U` is closed under addition.

---

## Step 4: Closure under Scalar multiplication [outer opⁿ]

**To prove:**  `u ∈ U,  λ ∈ ℝ  ⇒  λu ∈ U`

**Assumptions:** Let `u ∈ U` arbitrary and `λ ∈ ℝ`.

**Working:**

*Unpacking:*

```
                        5
   u ∈ U    ⇒    u  =   Σ  aᵢcᵢ ,     aᵢ ∈ ℝ
                       i=1
```

*Algebra:*

```
   λu  =  λ(a₁c₁ + a₂c₂ + a₃c₃ + a₄c₄ + a₅c₅)

       =  (λa₁)c₁ + (λa₂)c₂ + (λa₃)c₃ + (λa₄)c₄ + (λa₅)c₅

           5
       =   Σ  (λaᵢ) cᵢ
          i=1
```

Let `eᵢ = λaᵢ`. Since `λ, aᵢ ∈ ℝ` and `ℝ` is closed under multiplication, `eᵢ ∈ ℝ`.

So `λu = Σ eᵢcᵢ` with `eᵢ ∈ ℝ` — which satisfies the defining condition of `U`.

**Thus:**  `λu ∈ U`,  i.e. `U` is closed under scalar multiplication.

---

## HENCE:

`U ≠ φ` (Step 2), `U` is closed under addition (Step 3) and under scalar
multiplication (Step 4). All remaining vector-space axioms are inherited
from `ℝ³` since `U ⊆ ℝ³`.

**Hence `U = Col(C)` is a subspace of `ℝ³`.**   ∎

---

## Step 5: Row Echelon Form

**To prove:** which columns of `C` are linearly independent.

**Assumptions:** elementary row operations preserve the linear dependence
relations among the columns.

**Working:**

```
             ⎡  1    2    1    2   -1 ⎤
      C  =   ⎢  1    1    0   -1    4 ⎥
             ⎣  1   -2    4    1    0 ⎦


   R₂ ← R₂ − R₁ ,   R₃ ← R₃ − R₁

             ⎡  1    2    1    2   -1 ⎤
             ⎢  0   -1   -1   -3    5 ⎥
             ⎣  0   -4    3   -1    1 ⎦


   R₃ ← R₃ − 4R₂

             ⎡  1    2    1    2   -1 ⎤
             ⎢  0   -1   -1   -3    5 ⎥      ← Row Echelon Form
             ⎣  0    0    7   11  -19 ⎦
```

Pivots are `1`, `−1`, `7`, lying in **columns 1, 2, 3**.

**Thus:** `c₁, c₂, c₃` are linearly independent; `c₄, c₅` are non-pivot, hence
linear combinations of `c₁, c₂, c₃`, and are excluded from the basis.

---

## Step 6: Basis and Dimension

**To prove:** the basis and dimension of `U`.

**Assumptions:** the pivot columns of the **ORIGINAL** matrix form a basis of the
column space.

**Working:** Pivots lie in columns 1, 2, 3, so the corresponding columns of `C` are taken.

**Thus:**

```
                     ⎧  ⎡ 1⎤     ⎡ 2⎤     ⎡ 1⎤  ⎫
     Basis of U  =   ⎨  ⎢ 1⎥  ,  ⎢ 1⎥  ,  ⎢ 0⎥  ⎬
                     ⎩  ⎣ 1⎦     ⎣-2⎦     ⎣ 4⎦  ⎭


     dim( U )  =  3
```

and since `dim U = 3 = dim ℝ³`,  ∴  `U = ℝ³`

---
---

# PART (ii) — Space spanned by ROWS of C

## Step 1: Setting up

**AIM:** prove that `W = Row(C)` is a subspace of `ℝ⁵`, and find its basis and dimension.

**Given:** `C` is a `3 × 5` matrix with rows

```
   r₁ = ( 1,   2,   1,   2,  -1 )
   r₂ = ( 1,   1,   0,  -1,   4 )
   r₃ = ( 1,  -2,   4,   1,   0 )
```

**Working:** Each `rᵢ` has 5 entries, so `rᵢ ∈ ℝ⁵`.

There are 3 rows, so a linear combination requires 3 scalars `a₁, a₂, a₃ ∈ ℝ`.

Let

```
        ⎧                                                  ⎫
   W =  ⎨ w ∈ ℝ⁵ :  w = a₁r₁ + a₂r₂ + a₃r₃ ,   aᵢ ∈ ℝ      ⎬
        ⎩                                                  ⎭

     =  span{ r₁, r₂, r₃ }                    V = ℝ⁵
```

**Thus:** each `rᵢ ∈ ℝ⁵`, and the operations of `ℝ⁵` are defined as `+ : ℝ⁵ × ℝ⁵ → ℝ⁵`
and `· : ℝ × ℝ⁵ → ℝ⁵`, so every combination `a₁r₁ + a₂r₂ + a₃r₃` lands back in `ℝ⁵`.

**Thus:**  `W ⊆ ℝ⁵`   (SUBSET — subspace is proved only after Step 4.
Note this uses closure of `ℝ⁵`, an axiom — not closure of `W`, which Steps 3–4 prove.)

---

## Step 2: Non-emptiness

**To prove:**  `W ≠ φ`

**Assumptions:** the definition of `W` from Step 1.

**Working:** Take `a₁ = a₂ = a₃ = 0`

```
   0·r₁ + 0·r₂ + 0·r₃   =   ( 0, 0, 0, 0, 0 )
```

**Thus:**  `0 ∈ W`,  ∴  `W ≠ φ`     [Non-empty vector set]

---

## Step 3: Closure under Addition [inner opⁿ]

**To prove:**  `w₁, w₂ ∈ W  ⇒  w₁ + w₂ ∈ W`

**Assumptions:** Let `w₁, w₂ ∈ W`, arbitrary.

**Working:**

*Unpacking:*

```
                                                    3
   w₁ ∈ W   ⇒   w₁ = a₁r₁ + a₂r₂ + a₃r₃    =        Σ  aᵢrᵢ ,   aᵢ ∈ ℝ
                                                   i=1

                                                    3
   w₂ ∈ W   ⇒   w₂ = b₁r₁ + b₂r₂ + b₃r₃    =        Σ  bᵢrᵢ ,   bᵢ ∈ ℝ
                                                   i=1
```

*Algebra:*

```
                  3          3
   w₁ + w₂   =    Σ  aᵢrᵢ +  Σ  bᵢrᵢ
                 i=1        i=1

             =  (a₁+b₁)r₁ + (a₂+b₂)r₂ + (a₃+b₃)r₃

                  3
             =    Σ  (aᵢ + bᵢ) rᵢ
                 i=1
```

Let `dᵢ = aᵢ + bᵢ ∈ ℝ`. So `w₁ + w₂ = Σ dᵢrᵢ` — satisfies the defining condition of `W`.

**Thus:**  `w₁ + w₂ ∈ W`,  i.e. `W` is closed under addition.

---

## Step 4: Closure under Scalar multiplication [outer opⁿ]

**To prove:**  `w ∈ W,  λ ∈ ℝ  ⇒  λw ∈ W`

**Assumptions:** Let `w ∈ W` arbitrary and `λ ∈ ℝ`.

**Working:**

*Unpacking:*

```
                        3
   w ∈ W    ⇒    w  =   Σ  aᵢrᵢ ,     aᵢ ∈ ℝ
                       i=1
```

*Algebra:*

```
   λw  =  λ(a₁r₁ + a₂r₂ + a₃r₃)

       =  (λa₁)r₁ + (λa₂)r₂ + (λa₃)r₃

           3
       =   Σ  (λaᵢ) rᵢ
          i=1
```

Let `eᵢ = λaᵢ ∈ ℝ`. So `λw = Σ eᵢrᵢ` — satisfies the defining condition of `W`.

**Thus:**  `λw ∈ W`,  i.e. `W` is closed under scalar multiplication.

---

## HENCE:

`W ≠ φ` (Step 2), `W` is closed under addition (Step 3) and under scalar
multiplication (Step 4). Remaining vector-space axioms are inherited from `ℝ⁵`
since `W ⊆ ℝ⁵`.

**Hence `W = Row(C)` is a subspace of `ℝ⁵`.**   ∎

---

## Step 5: Row Echelon Form

**To prove:** which rows of `C` are linearly independent.

**Assumptions:** elementary row operations do not change the row space, since each
new row is a linear combination of the original rows and every operation is reversible.

**Working:** Using the same Row Echelon Form obtained in Part (i):

```
             ⎡  1    2    1    2   -1 ⎤
             ⎢  0   -1   -1   -3    5 ⎥
             ⎣  0    0    7   11  -19 ⎦
```

All three rows are non-zero.

**Thus:** `r₁, r₂, r₃` are linearly independent, and the non-zero rows of the REF
span the same row space.

---

## Step 6: Basis and Dimension

**To prove:** the basis and dimension of `W`.

**Assumptions:** the non-zero rows of the Row Echelon Form form a basis of the row space.

**Working:** All three rows of the REF are non-zero.

**Thus:**

```
                     ⎧  ( 1,   2,   1,   2,   -1 ) ,  ⎫
     Basis of W  =   ⎨  ( 0,  -1,  -1,  -3,    5 ) ,  ⎬
                     ⎩  ( 0,   0,   7,  11,  -19 )    ⎭


     dim( W )  =  3
```

---

## Final Remark for Q3

```
   dim U   =   dim W   =   3   =   rank(C)          (row rank = column rank)

   By rank–nullity:      dim null(C)  =  n − rank(C)  =  5 − 3  =  2
```

---
---
---

# Q2

```
        ⎡ 1   2   3   4   6 ⎤            ⎡ 60 ⎤
   A =  ⎢ 1   1   7   4   4 ⎥      b  =  ⎢ 60 ⎥
        ⎣ 1   5   4   2   1 ⎦            ⎣ 36 ⎦
```

> i)   Find the particular solution of `Ax = b`.
> ii)  Find all solutions of the associated homogeneous system.
> iii) Find the expression for the general solution.   **(2 marks)**

## Step 1: Setting up

**Given:** `A ∈ ℝ³ˣ⁵` and `b ∈ ℝ³` as stated above.

**To prove:** find `xₚ`, `x_h`, and `x_g` for the system `Ax = b`.

**Working:** Form the augmented matrix

```
              ⎡ 1   2   3   4   6  │  60 ⎤
   [A │ b] =  ⎢ 1   1   7   4   4  │  60 ⎥
              ⎣ 1   5   4   2   1  │  36 ⎦
```

**Thus:** the system has 5 unknowns and 3 equations.

---

## Step 2: Reduce to Reduced Row Echelon Form

**To prove:** an equivalent system that can be solved by inspection.

**Assumptions:** elementary row operations do not change the solution set.

**Working:** Reducing `[A │ b]` gives

```
   ⎡ 1   0   0    74/13    147/13  │  1044/13 ⎤
   ⎢ 0   1   0    -8/13    -18/13  │   -96/13 ⎥
   ⎣ 0   0   1    -2/13    -11/13  │   -24/13 ⎦
```

**Thus:** pivots lie in columns 1, 2, 3, so `x₁, x₂, x₃` are **pivot variables**
and `x₄, x₅` are **free variables**.

Also `rank(A) = rank([A│b]) = 3`, so the system is consistent; and since
`rank = 3 < 5 = n`, there are infinitely many solutions.

---

## Step 3: Particular solution

**To prove:** find one solution `xₚ` of `Ax = b`.

**Assumptions:** the RREF from Step 2.

**Working:** Set every free variable to zero: `x₄ = 0`, `x₅ = 0`. Then

```
   x₁ = 1044/13 ,     x₂ = −96/13 ,     x₃ = −24/13
```

**Thus:**

```
   xₚ  =  ( 1044/13 ,  −96/13 ,  −24/13 ,  0 ,  0 )ᵀ
```

---

## Step 4: Homogeneous solutions

**To prove:** find all solutions of `Ax = 0`.

**Assumptions:** the same RREF, with the right-hand side replaced by `0`.

**Working:** One basis vector per free variable.

```
   Set  x₄ = 1, x₅ = 0 :     h₁ = ( −74/13 ,   8/13 ,   2/13 ,  1 ,  0 )ᵀ

   Set  x₄ = 0, x₅ = 1 :     h₂ = ( −147/13 , 18/13 ,  11/13 ,  0 ,  1 )ᵀ
```

**Thus:**

```
   null(A) = span{ h₁ , h₂ } ,        dim null(A) = 2
```

which agrees with rank–nullity:  `rank + nullity = 3 + 2 = 5 = n`

---

## Step 5: General solution

**To prove:** the expression for every solution of `Ax = b`.

**Assumptions:** `xₚ` from Step 3 and `h₁, h₂` from Step 4.

**Working:** Every solution is a particular solution plus a homogeneous solution.

**Thus:**

```
   x_g  =  xₚ  +  λ₁h₁  +  λ₂h₂ ,        λ₁, λ₂ ∈ ℝ
```

## HENCE:

The system is consistent with a two-parameter family of solutions given by `x_g` above.

---
---
---

# Q4

```
        ⎡1⎤        ⎡1⎤               ⎡1⎤        ⎡0⎤
   v₁ = ⎢0⎥   v₂ = ⎢2⎥          w₁ = ⎢1⎥   w₂ = ⎢1⎥
        ⎣2⎦        ⎣2⎦               ⎣0⎦        ⎣1⎦

   S₁ = span{ v₁ , v₂ }        S₂ = span{ w₁ , w₂ }
```

> a) Prove that `S₁ ∩ S₂` is a subspace of `ℝ³`.
> b) Find the basis and dimension of `S₁ ∩ S₂`.   **(2 marks)**

**AIM:** to prove that `S₁ ∩ S₂` is a subspace of `ℝ³`, and find its basis and dimension.

The AIM is the goal of the **whole question**. No single step below proves it —
each step proves one small piece, and the pieces are added up once at **HENCE**.

```
  PART (a)  subspace proof       Step 1  Subset ................  S₁ ∩ S₂ ⊆ ℝ³
                                 Step 2  Non-emptiness .........  0   ∈ S₁ ∩ S₂
                                 Step 3  Closure under  +  .....  x+y ∈ S₁ ∩ S₂
                                 Step 4  Closure under  λ· .....  λx  ∈ S₁ ∩ S₂
                                 HENCE   Steps 1–4 together  →  subspace

  PART (b)  basis & dimension    Step 5  Membership equation  →  Mz = 0
                                 Step 6  Row-reduce M, rank–nullity
                                 Step 7  Recover the vector, verify both ways
                                 Step 8  Basis and dimension
```

---

# PART (a) — Prove `S₁ ∩ S₂` is a subspace of `ℝ³`

## Step 1: Setting up — prove the SUBSET `S₁ ∩ S₂ ⊆ ℝ³`

> ⚠ This step proves **subset only**. Subset is *not* subspace — it is just the
> first of the four pieces. Do not write "∴ subspace" here.

**Given** (quote the question — do **not** re-derive any of this):

> *"Consider the two **subspaces of ℝ³** named `S₁` and `S₂`…"*

```
   S₁ , S₂  are subspaces of ℝ³           ← GIVEN, free to use
   ⇒  S₁ ⊆ ℝ³   and   S₂ ⊆ ℝ³            ← "subspace of ℝ³" contains "subset of ℝ³"
   ⇒  0 ∈ S₁ , 0 ∈ S₂ , both closed under + and λ·
```

⚠ **You do not prove that `S₁` and `S₂` are subspaces.** The question hands you
that. Only `S₁ ∩ S₂` has to be proved.

### The general element — compute this ONCE, reuse it in every step

> *Notation:* `( p , q , r )ᵀ` is the column vector with entries `p, q, r`.
> In the exam draw it as a real column; the row form is only to keep this page readable.

**General element of `S₁`** — compute `a₁v₁ + a₂v₂` component by component:

| component | `a₁·v₁ + a₂·v₂` | simplifies to |
|---|---|---|
| 1st | `a₁·1 + a₂·1` | `a₁ + a₂` |
| 2nd | `a₁·0 + a₂·2` | `2a₂` |
| 3rd | `a₁·2 + a₂·2` | `2a₁ + 2a₂` |

```
   ⇒   a₁v₁ + a₂v₂  =  ( a₁+a₂ ,  2a₂ ,  2a₁+2a₂ )ᵀ                 … BOX S₁
```

**General element of `S₂`** — compute `a₃w₁ + a₄w₂`:

| component | `a₃·w₁ + a₄·w₂` | simplifies to |
|---|---|---|
| 1st | `a₃·1 + a₄·0` | `a₃` |
| 2nd | `a₃·1 + a₄·1` | `a₃ + a₄` |
| 3rd | `a₃·0 + a₄·1` | `a₄` |

```
   ⇒   a₃w₁ + a₄w₂  =  ( a₃ ,  a₃+a₄ ,  a₄ )ᵀ                       … BOX S₂
```

Keep **BOX S₁** and **BOX S₂** in front of you — Steps 2, 3 and 4 are each one
substitution into them.

**Working:** By the definition of intersection,

```
   S₁ ∩ S₂  =  { x ∈ ℝ³ :   x ∈ S₁   and   x ∈ S₂ }              V = ℝ³
```

*The subset argument — element chase:*

```
   Let x ∈ S₁ ∩ S₂ , arbitrary.

   x ∈ S₁ ∩ S₂   ⇒   x ∈ S₁ ,   and   S₁ ⊆ ℝ³    ⇒   x ∈ ℝ³
```

*Why `S₁ ⊆ ℝ³` is true, in numbers:* by BOX S₁ every element of `S₁` equals
`( a₁+a₂ , 2a₂ , 2a₁+2a₂ )ᵀ` — **three real numbers**, because `a₁, a₂ ∈ ℝ` and
`ℝ` is closed under `+` and `×`. So it is a vector of `ℝ³`. Same for `S₂`.

**Thus:**  `S₁ ∩ S₂ ⊆ ℝ³`      (SUBSET — not yet subspace)

> **Even shorter, if pressed for time:**  `S₁ ∩ S₂ ⊆ S₁ ⊆ ℝ³`
>
> An intersection is always contained in *either* of its sets, so you only need one.

*Where each piece comes from — nothing here is guessed:*

| Piece | Status | Source |
|---|---|---|
| `x` arbitrary | ASSUMED | the standard method for proving any `⊆` |
| `x ∈ S₁ ∩ S₂ ⇒ x ∈ S₁` | DEFINITION | `A ∩ B = {x : x ∈ A **and** x ∈ B}` — drop one half of the "and" |
| `S₁ ⊆ ℝ³` | **GIVEN** | question says *"the two subspaces of ℝ³"* |
| `x ∈ S₁, S₁ ⊆ ℝ³ ⇒ x ∈ ℝ³` | DEFINITION | `A ⊆ B` *means* every element of `A` is in `B` |

---

## Step 2: Non-emptiness — prove `0 ∈ S₁ ∩ S₂`

**To prove:**  `S₁ ∩ S₂ ≠ φ`

**Assumptions:** `S₁` and `S₂` are subspaces (Step 1).

**Working:** substitute `a₁ = a₂ = 0` into **BOX S₁**:

| component | from BOX S₁ | with `a₁ = a₂ = 0` |
|---|---|---|
| 1st | `a₁ + a₂` | `0 + 0 = 0` |
| 2nd | `2a₂` | `2·0 = 0` |
| 3rd | `2a₁ + 2a₂` | `0 + 0 = 0` |

```
   0·v₁ + 0·v₂  =  ( 0 , 0 , 0 )ᵀ  =  0            ⇒   0 ∈ S₁     ✓
```

Substitute `a₃ = a₄ = 0` into **BOX S₂**:

| component | from BOX S₂ | with `a₃ = a₄ = 0` |
|---|---|---|
| 1st | `a₃` | `0` |
| 2nd | `a₃ + a₄` | `0 + 0 = 0` |
| 3rd | `a₄` | `0` |

```
   0·w₁ + 0·w₂  =  ( 0 , 0 , 0 )ᵀ  =  0            ⇒   0 ∈ S₂     ✓
```

So `0` lies in **both** sets.

**Thus:**  `0 ∈ S₁ ∩ S₂`,  ∴  `S₁ ∩ S₂ ≠ φ`     [Non-empty vector set]

> ⚠ **"All coefficients zero" is NOT "add up all the vectors."**
> `0·v₁ + 0·v₂ = (0,0,0)ᵀ` ✓   but   `v₁ + v₂ = (1,0,2)ᵀ+(1,2,2)ᵀ = (2,2,4)ᵀ ≠ 0` ✗
> Both are members of `S₁`; only the first one is the zero vector.
>
> **Shortcut:** `S₁, S₂` are given as subspaces and every subspace contains `0`,
> so `0 ∈ S₁`, `0 ∈ S₂` is free. Show the calculation anyway — the professor's
> method wants it visible.

---

## Step 3: Closure under Addition [inner opⁿ]

**To prove:**  `x, y ∈ S₁ ∩ S₂  ⇒  x + y ∈ S₁ ∩ S₂`

**Assumptions:** Let `x, y ∈ S₁ ∩ S₂`, arbitrary.

**Working:**

*Unpacking:*

```
   x ∈ S₁ ∩ S₂    ⇒    x ∈ S₁   and   x ∈ S₂
   y ∈ S₁ ∩ S₂    ⇒    y ∈ S₁   and   y ∈ S₂
```

*Write out each membership — full split, no shortcuts:*

```
   x ∈ S₁   ⇒   x = a₁v₁ + a₂v₂            a₁, a₂ ∈ ℝ
   y ∈ S₁   ⇒   y = b₁v₁ + b₂v₂            b₁, b₂ ∈ ℝ

   x ∈ S₂   ⇒   x = a₃w₁ + a₄w₂            a₃, a₄ ∈ ℝ
   y ∈ S₂   ⇒   y = b₃w₁ + b₄w₂            b₃, b₄ ∈ ℝ
```

### Addition inside `S₁` — every component computed

Put `x` and `y` in components using **BOX S₁**, add, then regroup:

| component | `x` | `y` | `x + y`  (add) | **regroup** |
|---|---|---|---|---|
| 1st | `a₁ + a₂` | `b₁ + b₂` | `a₁ + a₂ + b₁ + b₂` | `(a₁+b₁) + (a₂+b₂)` |
| 2nd | `2a₂` | `2b₂` | `2a₂ + 2b₂` | `2(a₂+b₂)` |
| 3rd | `2a₁ + 2a₂` | `2b₁ + 2b₂` | `2a₁ + 2a₂ + 2b₁ + 2b₂` | `2(a₁+b₁) + 2(a₂+b₂)` |

**The last column is the whole proof** — that regrouping *is* the addition. The
vectors `v₁, v₂` never changed; only their **coefficients** were added.

*Name the new coefficients:*

```
   let  d₁ = a₁ + b₁      d₂ = a₂ + b₂
```

Since `a₁,a₂,b₁,b₂ ∈ ℝ` and `ℝ` is closed under addition,  `d₁, d₂ ∈ ℝ`.

```
   x + y  =  ( d₁+d₂ ,  2d₂ ,  2d₁+2d₂ )ᵀ   =   d₁v₁ + d₂v₂
                     ↑
             identical to BOX S₁, with d in place of a

   ⇒   x + y ∈ S₁     ✓
```

### Addition inside `S₂` — every component computed

Same move with **BOX S₂**:

| component | `x` | `y` | `x + y`  (add) | **regroup** |
|---|---|---|---|---|
| 1st | `a₃` | `b₃` | `a₃ + b₃` | `(a₃+b₃)` |
| 2nd | `a₃ + a₄` | `b₃ + b₄` | `a₃ + a₄ + b₃ + b₄` | `(a₃+b₃) + (a₄+b₄)` |
| 3rd | `a₄` | `b₄` | `a₄ + b₄` | `(a₄+b₄)` |

```
   let  d₃ = a₃ + b₃      d₄ = a₄ + b₄            d₃, d₄ ∈ ℝ

   x + y  =  ( d₃ ,  d₃+d₄ ,  d₄ )ᵀ   =   d₃w₁ + d₄w₂
                     ↑
             identical to BOX S₂, with d in place of a

   ⇒   x + y ∈ S₂     ✓
```

So `x + y` lies in both sets.

**Thus:**  `x + y ∈ S₁ ∩ S₂`

### Where is the real addition?

In the **regroup** column of both tables. Nothing else in this step is arithmetic.

```
   the vectors  v₁ , v₂ , w₁ , w₂     never change
   the scalars  a₁+b₁ , a₂+b₂ , …     are what actually add
```

Two facts do all the work, and both are free:

| Fact used | Why it is free |
|---|---|
| `ℝ` is closed under `+`, so `d₁ = a₁+b₁ ∈ ℝ` | axiom of `ℝ` |
| a combination of `v₁, v₂` with real coefficients is in `S₁` | definition of `span` |

**You have written this exact move before:** it is Q3 Step 3, there with 5
coefficients (`Σaᵢcᵢ + Σbᵢcᵢ = Σ(aᵢ+bᵢ)cᵢ`), here with 2 per set.

*Numeric check — an illustration, NOT a proof (one example proves nothing):*

```
   x = (1,3,2)ᵀ = −½·v₁ + 3⁄2·v₂        y = (2,6,4)ᵀ = −1·v₁ + 3·v₂

   x + y  =  (−½ −1)v₁ + (3⁄2 + 3)v₂  =  −3⁄2·v₁ + 9⁄2·v₂

   check :  −3⁄2(1,0,2)ᵀ + 9⁄2(1,2,2)ᵀ  =  (−3⁄2+9⁄2 , 0+9 , −3+9)ᵀ  =  (3,9,6)ᵀ   ✓
```

---

## Step 4: Closure under Scalar multiplication [outer opⁿ]

**To prove:**  `x ∈ S₁ ∩ S₂,  λ ∈ ℝ  ⇒  λx ∈ S₁ ∩ S₂`

**Assumptions:** Let `x ∈ S₁ ∩ S₂` arbitrary and `λ ∈ ℝ`.

**Working:**

*Unpacking:*

```
   x ∈ S₁ ∩ S₂   ⇒   x ∈ S₁   and   x ∈ S₂

   x ∈ S₁   ⇒   x = a₁v₁ + a₂v₂            a₁, a₂ ∈ ℝ
   x ∈ S₂   ⇒   x = a₃w₁ + a₄w₂            a₃, a₄ ∈ ℝ
```

### Scalar multiple inside `S₁` — every component computed

| component | `x`  (BOX S₁) | `λx`  (multiply) | **regroup** |
|---|---|---|---|
| 1st | `a₁ + a₂` | `λ(a₁ + a₂)` | `λa₁ + λa₂` |
| 2nd | `2a₂` | `λ(2a₂)` | `2(λa₂)` |
| 3rd | `2a₁ + 2a₂` | `λ(2a₁ + 2a₂)` | `2(λa₁) + 2(λa₂)` |

**The last column is the whole proof** — `λ` is absorbed into each **coefficient**;
`v₁` and `v₂` never change.

```
   let  e₁ = λa₁      e₂ = λa₂
```

Since `λ, a₁, a₂ ∈ ℝ` and `ℝ` is closed under multiplication,  `e₁, e₂ ∈ ℝ`.

```
   λx  =  ( e₁+e₂ ,  2e₂ ,  2e₁+2e₂ )ᵀ   =   e₁v₁ + e₂v₂
                 ↑
         identical to BOX S₁, with e in place of a

   ⇒   λx ∈ S₁     ✓
```

### Scalar multiple inside `S₂` — every component computed

| component | `x`  (BOX S₂) | `λx`  (multiply) | **regroup** |
|---|---|---|---|
| 1st | `a₃` | `λa₃` | `(λa₃)` |
| 2nd | `a₃ + a₄` | `λ(a₃ + a₄)` | `(λa₃) + (λa₄)` |
| 3rd | `a₄` | `λa₄` | `(λa₄)` |

```
   let  e₃ = λa₃      e₄ = λa₄            e₃, e₄ ∈ ℝ

   λx  =  ( e₃ ,  e₃+e₄ ,  e₄ )ᵀ   =   e₃w₁ + e₄w₂          ⇒   λx ∈ S₂     ✓
```

**Thus:**  `λx ∈ S₁ ∩ S₂`

### Where is the real multiplication?

In the **regroup** column — `λ` distributing onto each coefficient. Same shape as
Step 3:

```
   Step 3 :   a₁ + b₁  =  d₁ ∈ ℝ        because ℝ is closed under  +
   Step 4 :   λ · a₁   =  e₁ ∈ ℝ        because ℝ is closed under  ×
```

That single difference — `+` versus `×` in `ℝ` — is the **only** thing separating
Step 3 from Step 4. Everything else is copied word for word.

**Same as Q3 Step 4**, which used `eᵢ = λaᵢ` with 5 coefficients.

*Numeric check (illustration only):*

```
   x = (1,3,2)ᵀ = −½·v₁ + 3⁄2·v₂ ,   λ = 4

   λx  =  4(1,3,2)ᵀ  =  (4,12,8)ᵀ  =  (4·−½)v₁ + (4·3⁄2)v₂  =  −2·v₁ + 6·v₂

   check :  −2(1,0,2)ᵀ + 6(1,2,2)ᵀ  =  (−2+6 , 0+12 , −4+12)ᵀ  =  (4,12,8)ᵀ   ✓
```

---
## HENCE:  (Steps 1–4 added up — this is where the AIM of part (a) is reached)

```
   Step 1  →   S₁ ∩ S₂ ⊆ ℝ³                     (subset)
   Step 2  →   S₁ ∩ S₂ ≠ φ                      (contains 0)
   Step 3  →   closed under addition
   Step 4  →   closed under scalar multiplication
```

Remaining vector-space axioms are inherited from `ℝ³`, because `S₁ ∩ S₂ ⊆ ℝ³`.

**Hence `S₁ ∩ S₂` is a subspace of `ℝ³`.**   ∎

---

# PART (b) — Basis and Dimension

**AIM:** find the basis and dimension of `S₁ ∩ S₂`.

**The whole idea in one line:** a vector of the intersection has **two names** —
`x = a·v₁ + b·v₂` (because it is in `S₁`) and `x = c·w₁ + d·w₂` (because it is in
`S₂`). Equating the two names gives the homogeneous system `Mz = 0`, where
`z = (a, b, c, d)ᵀ` and the columns of `M` are `v₁, v₂, −w₁, −w₂`.

### Reading the set-up line by line

Think of `S₁` as everything buildable from bricks `v₁, v₂`, and `S₂` as everything
buildable from bricks `w₁, w₂`. The intersection is what is buildable **both ways**.

```
   x ∈ S₁   ⇒   x = a·v₁ + b·v₂        ← the v-recipe
   x ∈ S₂   ⇒   x = c·w₁ + d·w₂        ← the w-recipe     SAME x, different recipe

   equate    :   a·v₁ + b·v₂  =  c·w₁ + d·w₂
   one side  :   a·v₁ + b·v₂ − c·w₁ − d·w₂ = 0     ← each term flips sign crossing =
```

**Why move it to one side?** Because it becomes a plain homogeneous system `Mz = 0`
— the thing you already know how to solve by row reduction. The set-up converts
*"find matching recipes"* into *"find the null space of a matrix"*.

*Two things to keep straight:*

| Point | Detail |
|---|---|
| The unknowns are `a, b, c, d` | **not** the components of `x`. Solve for the coefficients first, then substitute back to recover `x` (Step 7). |
| `= 0` is expected | Both sides were the same vector, so subtracting gives `0`. The trivial solution `a=b=c=d=0` just gives `x = 0`, which is in every intersection. The **non-trivial** solutions are the useful ones — rank–nullity counts them (`4 − 3 = 1`). |

*What the answer looks like once solved* (`a=−1, b=3, c=2, d=4`):

```
   v-recipe :   −1·(1,0,2)ᵀ + 3·(1,2,2)ᵀ  =  (2,6,4)ᵀ
   w-recipe :    2·(1,1,0)ᵀ + 4·(0,1,1)ᵀ  =  (2,6,4)ᵀ      same vector ✓
```

That agreement **is** the meaning of "in the intersection" — and it is why Step 7
verifies both ways. If the two recipes disagreed, you made an arithmetic error.

---

## Step 5: Set up the membership equation

**To prove:** find every vector lying in both `S₁` and `S₂`.

**Assumptions:** a vector in the intersection is expressible **both** ways.

**Working:** Let `x ∈ S₁ ∩ S₂`. Then for some `a, b, c, d ∈ ℝ`

```
   x = a·v₁ + b·v₂        (because x ∈ S₁)
   x = c·w₁ + d·w₂        (because x ∈ S₂)
```

Equating and bringing everything to one side:

```
   a·v₁ + b·v₂ − c·w₁ − d·w₂  =  0
```

*Column split — write all four columns out before naming the matrix:*

```
      ⎡1⎤       ⎡1⎤       ⎡1⎤       ⎡0⎤     ⎡0⎤
   a  ⎢0⎥  +  b ⎢2⎥  −  c ⎢1⎥  −  d ⎢1⎥  =  ⎢0⎥
      ⎣2⎦       ⎣2⎦       ⎣0⎦       ⎣1⎦     ⎣0⎦
```

Comparing components:

```
   (1st)     a  +   b  −   c        =  0
   (2nd)           2b  −   c  −  d  =  0
   (3rd)    2a  +  2b        −  d  =  0
```

**Thus:** the intersection is found by solving the homogeneous system `Mz = 0`,
where `z = (a, b, c, d)ᵀ` and the columns of `M` are `v₁, v₂, −w₁, −w₂`.

---

## Step 6: Solve the system by row reduction

**To prove:** the values of `a, b, c, d`.

**Assumptions:** the homogeneous system from Step 5.

**Working:**

```
          a   b   c   d
        ⎡ 1   1  −1   0 ⎤   R₁
   M =  ⎢ 0   2  −1  −1 ⎥   R₂
        ⎣ 2   2   0  −1 ⎦   R₃
```

`R₃ → R₃ − 2R₁`

```
        ⎡ 1   1  −1   0 ⎤
        ⎢ 0   2  −1  −1 ⎥        →  REF
        ⎣ 0   0   2  −1 ⎦
```

*Pivots:* `1, 2, 2` in columns `1, 2, 3`.

*Rank consistency:* a homogeneous system is always consistent, and
`rank(M) = rank([M | 0]) = 3`.

*Rank–Nullity:*

```
   rank  +  nullity  =  number of COLUMNS        ← never the number of rows

   nullity  =  4 − 3  =  1                       ⇒  exactly ONE free variable
```

**Where the 4 and the 3 come from — they are unrelated counts:**

```
        a   b   c   d          ← 4 unknowns ⇒ 4 COLUMNS ⇒ this is the "4"
      [ 1   1  -1   0 ]   ← 1st components
  M = [ 0   2  -1  -1 ]   ← 2nd components    3 ROWS, because v,w ∈ ℝ³ gives
      [ 2   2   0  -1 ]   ← 3rd components       3 component-equations
```

| Number | Counts | Value here |
|---|---|---|
| rows `= 3` | component equations | the vectors live in `ℝ³` |
| columns `= 4` | unknown coefficients | you solve for `a, b, c, d` |
| rank `= 3` | pivots after row reduction | from the REF above |

⚠ The `4` is **not** the dimension of the ambient space (`ℝ³` has dimension 3).

*Same rule in Q2 — check the pattern:*

```
   Q2 :  A is 3×5  →  5 unknowns x₁…x₅  →  nullity = 5 − 3 = 2  →  2 free vars ✓
   Q4 :  M is 3×4  →  4 unknowns a,b,c,d →  nullity = 4 − 3 = 1  →  1 free var  ✓
```

**Self-check:** nullity must equal the number of **free variables**. Here `d` is the
only free variable, so nullity must be `1`. If the two disagree, one is wrong.

*Why nullity 1 gives `dim(S₁ ∩ S₂) = 1`:* nullity counts directions in coefficient
space `(a,b,c,d) ∈ ℝ⁴`. Each direction feeds back through `x = a·v₁ + b·v₂` to give
one vector of `ℝ³` — here `(1,3,2)ᵀ`.

*Variable labels:*

```
   Basic variables :  a, b, c      (pivot columns 1, 2, 3)
   Free  variable  :  d            (non-pivot column 4)
```

*Back substitution:*

```
   R₃ :   2c − d = 0                    ⇒   c  =  d/2

   R₂ :   2b − c − d = 0                ⇒   2b = c + d = d/2 + d = 3d/2
                                        ⇒   b  =  3d/4

   R₁ :   a + b − c = 0                 ⇒   a  =  c − b = d/2 − 3d/4
                                        ⇒   a  =  −d/4
```

Take `d = 4` to clear denominators:

```
   a = −1 ,    b = 3 ,    c = 2 ,    d = 4
```

**Thus:** the solution set is a one-parameter family — exactly one independent
direction lies in the intersection.

---

## Step 7: Recover the vector and verify

**To prove:** the actual vector of the intersection.

**Assumptions:** `a = −1, b = 3, c = 2, d = 4` from Step 6.

**Working:**

```
   Using S₁ :   x = −1(1,0,2) + 3(1,2,2)  =  (−1+3, 0+6, −2+6)  =  (2, 6, 4)

   Using S₂ :   x =  2(1,1,0) + 4(0,1,1)  =  (2, 2+4, 0+4)      =  (2, 6, 4)   ✓
```

Both routes give the same vector. Scaling down by `2`:  `u = (1, 3, 2)ᵀ`.

*Verification table:*

| vector | coefficients in `S₁` | check | coefficients in `S₂` | check |
|---|---|---|---|---|
| `u = (1,3,2)ᵀ` | `−½·v₁ + 3⁄2·v₂` | `(−½+3⁄2, 0+3, −1+3) = (1,3,2)` ✓ | `1·w₁ + 2·w₂` | `(1, 1+2, 0+2) = (1,3,2)` ✓ |

**Thus:**  `u = (1, 3, 2)ᵀ ∈ S₁ ∩ S₂`

---

## Step 8: Basis and Dimension

**To prove:** the basis and dimension of `S₁ ∩ S₂`.

**Assumptions:** the solution family has exactly one free parameter (Step 6).

**Working:** With `d` free, every solution is a scalar multiple of the one found,
so every `x ∈ S₁ ∩ S₂` is a scalar multiple of `(1, 3, 2)ᵀ`. A single non-zero
vector is linearly independent, and it spans the intersection.

**Thus:**

```
                          ⎧  ⎡1⎤  ⎫
     Basis of S₁ ∩ S₂  =  ⎨  ⎢3⎥  ⎬
                          ⎩  ⎣2⎦  ⎭


     dim( S₁ ∩ S₂ )  =  1      ( = nullity from Step 6 )
```

---

## Cross-check (optional, one line in the exam)

```
   dim S₁ = 2          (v₁, v₂ not proportional)
   dim S₂ = 2          (w₁, w₂ not proportional)
   dim(S₁ + S₂) = rank[ v₁ v₂ w₁ w₂ ] = 3

   Dimension formula :  dim(S₁+S₂) = dim S₁ + dim S₂ − dim(S₁ ∩ S₂)
                                 3 =    2    +    2   −      1        ✓
```

---

## Index map for Q4

| Step | What it does | Rule used |
|---|---|---|
| 1 | `S₁ ∩ S₂ ⊆ ℝ³` | set-builder starts `x ∈ ℝ³` |
| 2 | `0 ∈ S₁ ∩ S₂` | `0` is in every subspace |
| 3 | closed under `+` | `S₁`, `S₂` each closed under `+` |
| 4 | closed under `λ·` | `S₁`, `S₂` each closed under `λ·` |
| 5 | equate the two parametrisations | `x ∈ both ⇒ x = a·v = c·w` |
| 6 | row-reduce `Mz = 0` | rank–nullity gives the count |
| 7 | substitute back, verify **both** ways | catches all arithmetic slips |
| 8 | basis = the independent direction(s) | `dim = nullity` |

**Memory hook:** *"Intersection = one vector, two names."* Write it once from
`S₁`, once from `S₂`, subtract, and solve the single homogeneous system.
Part (a) never touches `v₁, v₂, w₁, w₂` at all — it only uses *"`S₁` and `S₂`
are subspaces"*.

---
---
---

# Q5

```
        ⎡1⎤        ⎡0⎤               ⎡0⎤        ⎡0⎤
        ⎢1⎥        ⎢1⎥               ⎢0⎥        ⎢0⎥
   v₁ = ⎢0⎥   v₂ = ⎢1⎥          w₁ = ⎢1⎥   w₂ = ⎢0⎥
        ⎣0⎦        ⎣0⎦               ⎣1⎦        ⎣1⎦

   S₁ = span{ v₁ , v₂ }        S₂ = span{ w₁ , w₂ }

   S₁ + S₂  =  { x + y   :   x ∈ S₁ ,  y ∈ S₂ }
```

> a) Prove that `S₁ + S₂` is a subspace.
> b) Find the basis and dimension of `S₁ + S₂`.   **(3 marks)**

**AIM:** to prove that `S₁ + S₂` is a subspace of `ℝ⁴`, and find its basis and dimension.

```
  PART (a)   subspace proof        Step 1   Subset            S₁ + S₂ ⊆ ℝ⁴
                                   Step 2   Non-emptiness     0  ∈ S₁ + S₂
                                   Step 3   Closure under +
                                   Step 4   Closure under λ·
                                   HENCE    → subspace

  PART (b)   basis & dimension     pool v₁, v₂, w₁, w₂ as columns, reduce,
                                   count pivots
```

---

# PART (a) — Prove `S₁ + S₂` is a subspace of `ℝ⁴`

## Step 1: Setting up — prove the SUBSET `S₁ + S₂ ⊆ ℝ⁴`

> ⚠ This step proves **subset only**, not subspace.

**Given** (quote the question — do **not** re-derive it):

> *"Consider the two **subspaces of ℝ⁴** named `S₁` and `S₂`…"*

So `S₁ ⊆ ℝ⁴`, `S₂ ⊆ ℝ⁴`, `0 ∈ S₁`, `0 ∈ S₂`, and both are closed under `+` and
`λ·` — all free. Only `S₁ + S₂` has to be proved.

**Working:** By the definition of the sum of two subspaces,

```
   S₁ + S₂  =  { p ∈ ℝ⁴ :   p = x + y ,   x ∈ S₁ ,  y ∈ S₂ }          V = ℝ⁴
```

*Write exactly this in the exam — two lines, element chase:*

```
   x ∈ S₁ ⊆ ℝ⁴ ,   y ∈ S₂ ⊆ ℝ⁴ ,   and ℝ⁴ is closed under +   ⇒   x + y ∈ ℝ⁴
```

**Thus:**  `S₁ + S₂ ⊆ ℝ⁴`      (SUBSET — not yet subspace)

> ⚠ **`∩` and `+` are not the same here.** For `∩` you land in the ambient space
> for free (`S₁ ∩ S₂ ⊆ S₁ ⊆ ℝ³`). For `+` you build a **new** vector `x + y`, so
> you must say *why it stays inside* — that is closure of `ℝ⁴`, an axiom, free to
> use. Do not skip that clause.

---

## Step 2: Non-emptiness

**To prove:**  `S₁ + S₂ ≠ φ`

**Assumptions:** `S₁` and `S₂` are subspaces, so `0 ∈ S₁` and `0 ∈ S₂`.

**Working:**

```
   0  =  0 + 0 ,      where   0 ∈ S₁   and   0 ∈ S₂
```

So `0` has the required form.

**Thus:**  `0 ∈ S₁ + S₂`,  ∴  `S₁ + S₂ ≠ φ`     [Non-empty vector set]

---

## Step 3: Closure under Addition [inner opⁿ]

**To prove:**  `p, q ∈ S₁ + S₂  ⇒  p + q ∈ S₁ + S₂`

**Assumptions:** Let `p, q ∈ S₁ + S₂`, arbitrary.

**Working:**

*Unpacking* — each splits into an `S₁` part and an `S₂` part, with **its own** pieces:

```
   p ∈ S₁ + S₂    ⇒    p = x₁ + y₁ ,     x₁ ∈ S₁ ,   y₁ ∈ S₂
   q ∈ S₁ + S₂    ⇒    q = x₂ + y₂ ,     x₂ ∈ S₁ ,   y₂ ∈ S₂
```

*Algebra:*

```
   p + q  =  (x₁ + y₁) + (x₂ + y₂)

          =  (x₁ + x₂) + (y₁ + y₂)
```

Since `S₁` is a subspace, `x₁ + x₂ ∈ S₁`. Since `S₂` is a subspace, `y₁ + y₂ ∈ S₂`.
So `p + q` splits in the required form.

**Thus:**  `p + q ∈ S₁ + S₂`

---

## Step 4: Closure under Scalar multiplication [outer opⁿ]

**To prove:**  `p ∈ S₁ + S₂,  λ ∈ ℝ  ⇒  λp ∈ S₁ + S₂`

**Assumptions:** Let `p ∈ S₁ + S₂` arbitrary and `λ ∈ ℝ`.

**Working:**

*Unpacking:*  `p = x + y`  with  `x ∈ S₁`,  `y ∈ S₂`

*Algebra:*

```
   λp  =  λ(x + y)  =  λx + λy
```

Since `S₁` is a subspace, `λx ∈ S₁`. Since `S₂` is a subspace, `λy ∈ S₂`.
So `λp` splits in the required form.

**Thus:**  `λp ∈ S₁ + S₂`

---

## HENCE:

`S₁ + S₂ ≠ φ` and it is closed under both operations. Remaining axioms are
inherited from `ℝ⁴`.

**Hence `S₁ + S₂` is a subspace of `ℝ⁴`.**   ∎

---

# PART (b) — Basis and Dimension

## Step 5: Pool the spanning vectors

**To prove:** a spanning set for `S₁ + S₂`.

**Assumptions:**  `S₁ + S₂ = span( basis of S₁ ∪ basis of S₂ )`

**Working:** Pool all four vectors `v₁, v₂, w₁, w₂` and place them as columns:

```
             v₁  v₂  w₁  w₂
        ⎡ 1   0   0   0 ⎤
   M =  ⎢ 1   1   0   0 ⎥
        ⎢ 0   1   1   0 ⎥
        ⎣ 0   0   1   1 ⎦
```

**Thus:**  `S₁ + S₂ = span{ (1,1,0,0)ᵀ, (0,1,1,0)ᵀ, (0,0,1,1)ᵀ, (0,0,0,1)ᵀ }`

---

## Step 6: Row reduce and count pivots

**To prove:** which of the pooled vectors are linearly independent.

**Assumptions:** pivot columns give the independent vectors.

**Working:**

```
   ⎡ 1   0   0   0 ⎤                     ⎡ 1   0   0   0 ⎤
   ⎢ 1   1   0   0 ⎥    R₂ ← R₂ − R₁     ⎢ 0   1   0   0 ⎥
   ⎢ 0   1   1   0 ⎥   ─────────────→    ⎢ 0   0   1   0 ⎥
   ⎣ 0   0   1   1 ⎦        etc.         ⎣ 0   0   0   1 ⎦
```

Four pivots, in columns 1, 2, 3, 4.

**Thus:** all four pooled vectors are linearly independent.

---

## Step 7: Basis and Dimension

**To prove:** the basis and dimension of `S₁ + S₂`.

**Assumptions:** the four pivot columns of the original pooled matrix form a basis.

**Working:** All four columns are pivot columns.

**Thus:**

```
                          ⎡1⎤   ⎡0⎤   ⎡0⎤   ⎡0⎤
                          ⎢1⎥   ⎢1⎥   ⎢0⎥   ⎢0⎥
   Basis of S₁ + S₂  =  { ⎢0⎥ , ⎢1⎥ , ⎢1⎥ , ⎢0⎥ }   =  { v₁ , v₂ , w₁ , w₂ }
                          ⎣0⎦   ⎣0⎦   ⎣1⎦   ⎣1⎦


   dim( S₁ + S₂ )  =  4
```

Since `dim = 4 = dim ℝ⁴`,  ∴  `S₁ + S₂ = ℝ⁴`

---

## Step 8: Verification

**To prove:** the answer is consistent with the dimension formula.

**Assumptions:**  `dim(S₁ + S₂) = dim S₁ + dim S₂ − dim(S₁ ∩ S₂)`

**Working:** `dim S₁ = 2`, `dim S₂ = 2`, and since the sum is direct,
`S₁ ∩ S₂ = {0}` so `dim(S₁ ∩ S₂) = 0`.

```
   2 + 2 − 0  =  4    ✓
```

**Thus:** the computed dimension is confirmed.

---
---

# Presentation rules for the answer sheet

1. Label every step: `Step 1:`, `Step 2:` … Method marks are awarded even when
   arithmetic slips.
2. Inside each proof step (Steps 2–4), write the headings in order:
   **To prove / Assumptions / Working / Thus**.
   Step 1 is setup, not proof — it uses **Given / To prove / Working / Thus**, with
   no "Assumptions" line, since nothing is assumed there. Never write the same fact
   twice under two headings.
3. Write **Hence** only once, for the overall conclusion.
4. Show every row operation in the margin: `R₂ ← R₂ − R₁`. Never jump straight
   to the echelon form.
5. Box or underline the final basis and dimension.
6. State the ambient space explicitly: *"Each column has 3 entries, hence lies in ℝ³."*
7. Always include the inheritance sentence — it shows you know why only three
   checks are needed.
8. Keep fractions as fractions (`74/13`). Do not convert to decimals.
9. Verify when it is cheap (Q4 Step 7 especially) and write the check down.

---

# 60-second recall card

```
AIM (top, once): the goal of the WHOLE question
STEP 1  (setup):  Given → Working → Thus        (no "To prove", no "Assumptions")
STEPS 2–4 (proof): To prove → Assumptions → Working → Thus
END OF PROOF:      Hence

U ⊆ V because:   { x ∈ ℝⁿ : … }  → free, the clause before the colon says it
                 span{ c₁,…,c₅ } → needs a line: each cᵢ ∈ ℝⁿ and ℝⁿ is closed
                                   under + and ·, so combinations stay in ℝⁿ

⚠ U ⊆ V does NOT imply U is a subspace. Subset = membership, subspace = structure.
  The square {−1≤x≤1, −1≤y≤1} ⊆ ℝ² is a subset but NOT a subspace.
  Never write "as we have assumed" — the subspace claim is the GOAL, not a given.

⚠ Step 1 uses closure of ℝⁿ (an AXIOM, free). Steps 3–4 prove closure of U
  (UNKNOWN, must prove). Different sets — so Step 1 is not circular.

SUBSPACE = 3 checks:   0 ∈ U   |   x + y ∈ U   |   λx ∈ U
           + "remaining axioms inherited from V"

COLUMN basis  →  pivot columns of ORIGINAL
ROW    basis  →  nonzero rows of ECHELON

dim = #pivots = rank
rank + nullity = #columns
row rank = column rank    (always)

Ax = b :   x_g = xₚ + Σ λᵢhᵢ
           xₚ : all free vars = 0
           hᵢ : one free var = 1, the rest = 0

S₁ ∩ S₂ :  set  a·u = c·v ,  solve,  substitute back,  verify BOTH ways
S₁ + S₂ :  pool all vectors as columns,  reduce,  count pivots
           dim(S₁+S₂) = dim S₁ + dim S₂ − dim(S₁ ∩ S₂)
```

---

Theory reference: [knowledge.md](./knowledge.md)

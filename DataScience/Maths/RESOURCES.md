# Resources for Assignment 1 — Subspaces, Rank, Basis & Dimension
### DSEZC411 Essential Mathematics for Data Science

> Scope of this list is deliberately narrow: it covers **only** what Assignment 1 tests —
> the subspace test, solving `Ax = b`, column/row space, and intersection/sum of subspaces.
> Everything is tagged **FREE** or **PAID** so nobody buys what they can download.

---

## 🎯 If you only pick two

| Pick | Why |
|---|---|
| **Deisenroth, Faisal & Ong — _Mathematics for Machine Learning_, Ch. 2** — **FREE** at `mml-book.github.io` | Chapter 2 is almost a one-to-one match with this assignment, and it is written for data-science students rather than for maths majors. |
| **Lipschutz & Lipson — _Schaum's Outline of Linear Algebra_ (6th ed.)** — **PAID** (cheap) | Hundreds of *solved* problems in exactly the "prove W is a subspace / find a basis of U ∩ W" format. This is the drilling book, not the reading book. |

Read the first, grind the second.

---

## 📘 Books

### 1. Deisenroth, Faisal & Ong — *Mathematics for Machine Learning* (CUP, 2020) — **FREE**
`https://mml-book.github.io`

The closest single match to this assignment. Chapter 2 covers, in order:
systems of linear equations → Gaussian elimination / RREF → **particular + general
solution** (Q2) → vector spaces and subspaces (Q1) → linear independence → basis and
rank (Q3). Written by ML people, so every concept is motivated by where it shows up later.

- **Read:** §2.1–2.6
- **Weakness:** almost nothing on intersection/sum of subspaces — use Axler for Q4/Q5.

### 2. Lipschutz & Lipson — *Schaum's Outline of Linear Algebra* (6th ed., McGraw-Hill, 2017) — **PAID**

Full title: **_Schaum's Outline of Linear Algebra_**, Seymour Lipschutz & Marc Lars Lipson.
ISBN-13 `978-1260011449` (US 6th ed.). Indian McGraw Hill reprints are much cheaper and
carry different ISBNs. 4th (2009) and 5th (2013) editions are equally usable.

**The only book on this list that covers all five questions in its main text.**

| Chapter | Covers | Maps to |
|---|---|---|
| **3. Systems of Linear Equations** | echelon form, Gaussian elimination, particular vs. general solution, homogeneous systems | Q2 |
| **4. Vector Spaces** | subspaces, linear spans, row space, independence, basis & dimension, rank, **Sums and Direct Sums** | Q1, Q3, **Q4**, **Q5** |

That last section — *Sums and Direct Sums* — is exactly the material Strang, Lay and MML
omit, and it is why this is the single-source pick.

This is a **drilling book, not a reading book**: ~612 fully solved problems, thin on
motivation and *why*. Pair it with any of the others for explanation.

> ⚠️ **Two search traps.** Editions 3 and earlier are titled *Schaum's Outline of **Theory
> and Problems of** Linear Algebra* (Lipschutz alone) — that's the same book, fine to buy.
> But *Schaum's Outline of **Beginning** Linear Algebra* (Lipschutz, 1997) is a **different,
> more elementary book** that does not cover sums and intersections of subspaces. Avoid it.


**Is it the *best* book? Only in a narrow sense — be clear which.**

| "Best" in what sense? | Schaum's? |
|---|---|
| Best coverage of these 5 questions in one volume | **Yes** |
| Best for passing this exam under time pressure | **Yes**, paired with the solutions doc |
| Best linear algebra book | **No** — Strang or Axler, not close |
| Best for actually understanding the subject | **No** |
| Best for data-science relevance | **No** — that's MML |

**Strengths:** unmatched density of *fully worked* subspace proofs in the exact shape this
assignment asks for; the only source here covering Q4/Q5 properly; cheap; assumes nothing.

**Weaknesses:** theory sections are definitions and theorem statements with the motivation
stripped out — often no proofs at all. It trains pattern-matching, so an unfamiliar variant
leaves you with little to fall back on. Cramped, dated typesetting, and the usual scattering
of Schaum's typos. It is a *supplement* by design, meant to sit beside a course text.

> **Division of labour for this assignment:**
> `ASSIGNMENT_1_SOLUTIONS.md` gives you the **format** the marker wants ·
> Schaum's gives you the **reps** · MML/Strang/Axler give you the **understanding**.
> Schaum's proofs are *terser* than the required `To prove → Assumptions → Working →
> Thus → HENCE` template, so use it for the mathematics, not the write-up style.
>
> It's a gym, not a teacher.


### 3. Gilbert Strang — *Introduction to Linear Algebra* (Wellesley-Cambridge, 5th/6th ed.) — **PAID**

The standard reference for the computational half. Chapter 3 is the assignment:

| Section | Covers |
|---|---|
| 3.1 Spaces of vectors | Q1, Q3 — the subspace test |
| 3.2 The nullspace of A | Q2(ii) |
| 3.3 The complete solution to Ax = b | Q2 — literally `x = xₚ + x_h` |
| 3.4 Independence, basis and dimension | Q3 |
| 3.5 Dimensions of the four subspaces | Q3 — row rank = column rank |

Strang's "column space + nullspace" framing is the mental model worth stealing. Pairs with
his free MIT lectures (below) — same book, same order.

### 4. Sheldon Axler — *Linear Algebra Done Right* (4th ed., Springer, 2024) — **FREE**
`https://linear.axler.net`

The rigorous complement. Best book for the **proof** half of the assignment:

- Ch. 1 — vector spaces, subspaces, **sums of subspaces** (Q5), direct sums
- Ch. 2 — span, independence, bases, dimension, and the formula
  `dim(U + W) = dim U + dim W − dim(U ∩ W)` (Q4/Q5 cross-check)

**Caveat:** Axler deliberately avoids determinants and de-emphasises row reduction, so it
will not teach you the RREF mechanics in Q2. Use it for proof style, not for computation.

### 5. David C. Lay — *Linear Algebra and Its Applications* (5th/6th ed.) — **PAID**

Chapter 4 ("Vector Spaces") is the gentlest correct treatment of the subspace test —
4.1 subspaces, 4.2 null and column spaces, 4.3 bases, 4.5 dimension, 4.6 rank. Best
choice for someone who finds Strang too terse and Axler too abstract.

### 6. Jim Hefferon — *Linear Algebra* — **FREE**
`https://hefferon.net/linearalgebra`

Open textbook, and crucially it ships a **complete worked solutions manual**. Very heavy
on "prove this set is a subspace" exercises with full model answers — which is exactly
the marking style this assignment uses.

### 7. Robert Beezer — *A First Course in Linear Algebra* — **FREE**
`https://linear.ups.edu`

Every single proof is written out in full, with named theorems you can cite. If your
problem is "I know the answer but I can't write the proof", this is the book.

### 8. Howard Anton — *Elementary Linear Algebra* — **PAID**

Common in Indian university curricula, so it's the one most likely already on a friend's
shelf. Chapter 4 covers general vector spaces, subspaces, basis, dimension and row/column
space. Perfectly adequate; nothing special.

---

## 📄 Articles & papers

### Gilbert Strang, "The Fundamental Theorem of Linear Algebra"
*American Mathematical Monthly* **100** (1993), no. 9, pp. 848–855.

Eight pages that explain why `dim Col(C) = dim Row(C) = rank(C)` — the fact Q3 asks you
to observe but never explains. The single best short read on this assignment's content.
Findable via JSTOR or MIT's course pages.

### Strang, "The Four Fundamental Subspaces: 4 Lines"
A short MIT companion note/video summarising the same result on one diagram. Worth
sketching the diagram once from memory before the exam.

### Jonathon Shlens, "A Tutorial on Principal Component Analysis" (arXiv:1404.1100) — **FREE**

Optional, but answers "why am I doing this?". PCA is basis + rank + subspace projection
doing real work on data. Read after the exam, not before it.

### Petersen & Pedersen, *The Matrix Cookbook* — **FREE**

Pure lookup reference for identities. Not for learning — for checking.

---

## 🎥 Courses & video

### MIT OCW 18.06 — *Linear Algebra*, Gilbert Strang — **FREE**
`https://ocw.mit.edu` (also 18.06SC "Scholar", which adds recitation videos)

The relevant lectures are a tight block:

| Lecture | Topic | Maps to |
|---|---|---|
| 5 | Transposes, permutations, vector spaces | Q1 |
| 6 | Column space and nullspace | Q3 |
| 7 | Solving Ax = 0: pivot variables, special solutions | Q2(ii) |
| 8 | Solving Ax = b: complete solution | Q2(i), Q2(iii) |
| 9 | Independence, basis, dimension | Q3 |
| 10 | The four fundamental subspaces | Q3 |

Six lectures ≈ 5 hours, and it covers the whole assignment. Problem sets **with solutions**
are on the same page.

### 3Blue1Brown — *Essence of Linear Algebra* — **FREE** (YouTube)

For intuition only — no proofs, no computation. Watch chapters 2 (linear combinations,
span, basis) and 6–7 (column space, null space, non-square matrices). About 30 minutes,
and it makes "span" and "rank" stop being words.

### Interactive Linear Algebra — Margalit & Rabinoff (Georgia Tech) — **FREE**
`https://textbooks.math.gatech.edu/ila`

Browser textbook with interactive figures you can drag. The column-space and null-space
demos are genuinely clarifying if you're a visual learner.

### Immersive Linear Algebra — **FREE**
`https://immersivemath.com/ila`

Same idea, fully interactive figures. Lighter than the Georgia Tech book.

---

## ✅ Coverage matrix — who covers what

`✓✓` main text, thorough · `✓` covered adequately · `~` exercises only, no exposition · `✗` not covered

| Resource | Q1 subspace test | Q2 `Ax=b`, RREF | Q3 Col/Row, rank | Q4 `S₁ ∩ S₂` | Q5 `S₁ + S₂` |
|---|:---:|:---:|:---:|:---:|:---:|
| **Schaum's Outline** (PAID) | ✓✓ | ✓✓ | ✓✓ | ✓✓ | ✓✓ |
| **Hefferon** (FREE) | ✓✓ | ✓✓ | ✓✓ | ~ | ~ |
| **Lay** Ch. 1.5 + Ch. 4 (PAID) | ✓✓ | ✓✓ | ✓✓ | ~ | ~ |
| **Strang** Ch. 3 (PAID) | ✓ | ✓✓ | ✓✓ | ~ | ~ |
| **MIT 18.06** L5–10 (FREE) | ✓ | ✓✓ | ✓✓ | ✗ | ✗ |
| **MML** Ch. 2 (FREE) | ✓ | ✓✓ | ✓✓ | ✗ | ✗ |
| **Beezer FCLA** (FREE) | ✓✓ | ✓✓ | ✓✓ | ~ | ~ |
| **Axler** Ch. 1–2 (FREE) | ✓✓ | ✗ | ✓ | ✓✓ | ✓✓ |
| **3Blue1Brown** (FREE) | ~ | ✗ | ✓ | ✗ | ✗ |

**Read the matrix like this:**

- **Only Schaum's covers all five in the main text.** Everything else needs a partner.
- The standard books (Strang, Lay, MML, MIT) are strong on **Q1–Q3** and go quiet on
  **Q4–Q5**. Intersections and sums of subspaces are treated as an abstract-algebra
  topic, so computational texts push them into the exercises.
- **Axler is the exact mirror image**: he owns Q4–Q5 and skips Q2 entirely.

### The two-resource combinations that actually cover everything

| Combination | Cost | Notes |
|---|---|---|
| **Hefferon + Axler** | FREE | Full coverage, and both ship worked solutions. Best free option. |
| **MML Ch. 2 + Axler Ch. 1–2** | FREE | Most data-science-relevant framing. |
| **MIT 18.06 L5–10 + Axler Ch. 1–2** | FREE | If you prefer video for the computation. |
| **Strang Ch. 3 + Schaum's Ch. 4** | PAID | The classic exam-prep pairing. |
| **Schaum's alone** | PAID | Only single-source option. Thin on *why*, heavy on *how*. |

> **Why Q4/Q5 keep falling through the cracks:** `S₁ ∩ S₂` and `S₁ + S₂` need the
> dimension formula `dim(S₁+S₂) = dim S₁ + dim S₂ − dim(S₁∩S₂)`, which most
> applied texts state without proof or omit. Axler proves it properly. If your friends
> read one thing for Q4/Q5, make it Axler Ch. 2.

---

## 🗺 Which resource for which question

| Question | Topic | Best source |
|---|---|---|
| **Q1** | Subspace test on `{x : Σxᵢ = 0}` | Lay §4.1 · Hefferon (exercises) |
| **Q2** | `Ax = b`, RREF, `xₚ + x_h`, rank–nullity | Strang §3.3 · MIT 18.06 L7–8 · MML §2.3 |
| **Q3** | Col(C), Row(C), basis, dimension, rank | Strang §3.4–3.5 · MIT 18.06 L6, L9–10 · Strang's 1993 *Monthly* article |
| **Q4** | `S₁ ∩ S₂`, basis via `Mz = 0` | Axler Ch. 1–2 · Schaum's (solved problems) |
| **Q5** | `S₁ + S₂`, dimension formula | Axler Ch. 1–2 (sums of subspaces) · Beezer |

---

## ⚠️ A note on study order

The trap this assignment sets — documented at length in `ASSIGNMENT_1_SOLUTIONS.md` — is
writing *"U ⊆ ℝⁿ, therefore U is a subspace"*. **No book will save you from that; only
writing proofs will.** So:

1. Watch 3Blue1Brown Ch. 2 + 6 (30 min) — build intuition
2. Read MML Ch. 2 **or** watch MIT 18.06 L5–10 — build the machinery
3. Grind Schaum's / Hefferon subspace exercises — build the writing habit
4. Skim Axler Ch. 1–2 for the sum/intersection results — close the Q4/Q5 gap

Steps 1–2 are optional if you're short on time. **Step 3 is not.**

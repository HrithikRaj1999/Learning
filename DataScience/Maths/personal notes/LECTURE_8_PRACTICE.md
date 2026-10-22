# Lecture 8 - Exam Practice

**Topics:** Optimization, Gradient Descent, Decay, Momentum, Convexity, Linear Programmes

**Course:** DSEZC411 Essential Mathematics for Data Science

**Source:** `Maths/Class material/Lecture_8.pdf`

**Status:** practice for the midterm. These are predictions, not guaranteed exam questions.

### Fixed Notation
| Write | Meaning |
| :--- | :--- |
| $x_i$ | Current point at iteration i |
| $\alpha_i$ | Learning rate at iteration i |
| $\kappa,\beta$ | Decay rate; momentum factor |
| $\theta\in[0,1]$ | Weight in the convexity test |
| $f,g_i,h_j$ | Objective, inequality constraints, equality constraints |

> **Exam layout:** Given → AIM → numbered working → check → conclusion.
> Keep the same letters within each question type; standard topic symbols stay unchanged.

**Sections:** Formula sheet | Fixed routines | Solved examples | Practice questions.

---

## 1. Formula Sheet

### 1.1 Unconstrained optimization

We seek the minimum of a differentiable **objective function** $f$:

$$
\min_{x} f(x)
$$

- Moving in the direction of the **negative gradient** decreases $f$ fastest.
- We stop where the gradient is zero (a **stationary** or **critical** point).

### 1.2 One-variable critical points

$$
f'(x^*) = 0,
\qquad
f''(x^*) > 0 \Rightarrow \text{local minimum},
\qquad
f''(x^*) < 0 \Rightarrow \text{local maximum},
\qquad
f''(x^*) = 0 \Rightarrow \text{test fails}
$$

When the test fails, look at the sign of $f'$ just left and right of $x^*$.

### 1.3 Gradient descent

$$
x_{i+1} = x_i - \alpha_i\,\big(\nabla f(x_i)\big)^{\top}
$$

- $\alpha > 0$ is the **step size**, also called the **learning rate**.
- For a suitable $\alpha$: $f(x_0) \ge f(x_1) \ge f(x_2) \ge \cdots$, converging to a **local** minimum.
- The gradient is always evaluated at the **current** point $x_i$.

For $f(x) = cx^2$ the update is $x_{i+1} = (1 - 2c\alpha)\,x_i$: one multiplication per step.

### 1.4 Learning rate behaviour

| Choice | Behaviour |
| :--- | :--- |
| Large and constant | gets close fast, then oscillates around the optimum (or diverges if too large) |
| Small and constant | converges reliably but very slowly |
| Decaying | large strides first, then careful convergence |

### 1.5 Learning rate decay

$$
\text{exponential decay:}\quad \alpha_i = \alpha_0\,e^{-\kappa i}
\qquad\qquad
\text{inverse decay:}\quad \alpha_i = \frac{\alpha_0}{1 + \kappa i}
$$

$\alpha_0$ is the starting rate and $\kappa$ controls how fast it decays. **Step decay** divides $\alpha$ by a constant every few steps.

### 1.6 Gradient descent with momentum

$$
x_{i+1} = x_i - \alpha_i\,\big(\nabla f(x_i)\big)^{\top} + \Delta x_i,
\qquad
\Delta x_i = \beta\,(x_i - x_{i-1}),
\qquad
\Delta x_0 = 0,\;\; 0 < \beta < 1
$$

Momentum re-uses part of the previous move, which speeds up progress in poorly scaled regions.

### 1.7 Convex set

$C$ is **convex** if for all $x,y \in C$ and $\theta \in [0,1]$:

$$
\theta x + (1 - \theta) y \in C
$$

The straight segment between any two points of $C$ stays inside $C$.

### 1.8 Convex function

$f : \mathbb{R}^d \to \mathbb{R}$ with convex domain $C$ is **convex** if, for all $x,y \in C$ and $\theta \in [0,1]$:

$$
f\big(\theta x + (1-\theta)y\big) \;\le\; \theta f(x) + (1-\theta) f(y)
\qquad\text{(chord above the curve)}
$$

Equivalent tests for differentiable $f$:

$$
f(y) \;\ge\; f(x) + \nabla_x f(x)\,(y - x)
\quad\text{(tangent below the curve)},
\qquad
f''(x) \ge 0 \;\text{ for all } x \;\;(\text{one variable})
$$

### 1.9 Constrained optimization

$$
\min_x f(x)
\quad\text{subject to}\quad
g_i(x) \le 0,\; i = 1,\dots,m,
\qquad
h_j(x) = 0,\; j = 1,\dots,p
$$

If $f$ and every $g_i$ are convex and every $h_j$ is affine (linear plus a constant), the problem is **convex** and any local minimum is **global**. A linear programme (linear objective, linear constraints) is convex; its optimum lies at a corner of the feasible region.

---

## 2. Fixed Exam Routines

> Use the same headings for the same question type. Keep each named row operation.

### Routine A - Critical points in one variable
Step | Write
--- | ---
1 | **First Derivative**
2 | **Critical Points**
3 | **Second Derivative And Values**
4 | **Sign Check**
5 | **Conclusion**

### Routine B - Gradient descent iterations
Step | Write
--- | ---
1 | **Gradient**
2 | **Update Rule**
3 | **Iterations**
4 | **Value Check**
5 | **Conclusion**

### Routine C - Learning-rate decay
Step | Write
--- | ---
1 | **Schedule**
2 | **Learning Rates**
3 | **Iterations**
4 | **Table And Comparison**
5 | **Conclusion**

### Routine D - Momentum
Step | Write
--- | ---
1 | **Update Rule**
2 | **Momentum Iterations**
3 | **Without Momentum**
4 | **Comparison**
5 | **Conclusion**

### Routine E - Convexity check
Step | Write
--- | ---
1 | **Test**
2 | **Points And Weight**
3 | **Evaluate And Compare**
4 | **Check**
5 | **Conclusion**

### Routine F - Linear programme by corners
Step | Write
--- | ---
1 | **Objective And Constraints**
2 | **Boundary Lines And Corners**
3 | **Feasibility**
4 | **Objective Values**
5 | **Conclusion**

> **Stop rule:** If a required test fails, state the failure and conclusion.
---

## 3. Solved Examples — Critical Points in One Variable

> Follow the matching fixed routine above.

### Example A1 — a cubic with a maximum and a minimum

**Given** $f(x) = x^3 - 6x^2 + 9x + 1$.

**AIM:** Find the critical points and classify them.

#### 1. First Derivative

$$
f'(x) = 3x^2 - 12x + 9
$$

#### 2. Critical Points

$$
3x^2 - 12x + 9 = 0
\;\Longrightarrow\;
x^2 - 4x + 3 = 0
\;\Longrightarrow\;
(x - 1)(x - 3) = 0
\;\Longrightarrow\;
x = 1 \text{ or } x = 3
$$

#### 3. Second Derivative And Values

$$
f''(x) = 6x - 12
$$

$$
f''(1) = -6 < 0 \;\Rightarrow\; \textbf{local maximum},
\qquad
f''(3) = 6 > 0 \;\Rightarrow\; \textbf{local minimum}
$$

$$
f(1) = 1 - 6 + 9 + 1 = 5,
\qquad
f(3) = 27 - 54 + 27 + 1 = 1
$$

#### 4. Sign Check

| Interval | Test point | $f'$ | $f$ is |
| :--- | :--- | :--- | :--- |
| $x < 1$ | $0$ | $9 > 0$ | rising |
| $1 < x < 3$ | $2$ | $12 - 24 + 9 = -3 < 0$ | falling |
| $x > 3$ | $4$ | $48 - 48 + 9 = 9 > 0$ | rising |

Rising then falling at $x = 1$ (maximum); falling then rising at $x = 3$ (minimum) ✓

#### 5. Conclusion

**Hence** local maximum at $x = 1$ ($f = 5$) and local minimum at $x = 3$ ($f = 1$).

---

### Example A2 — the second-derivative test fails

**Given** $f(x) = x^4 - 4x^3$.

**AIM:** Find and classify the critical points.

#### 1. First Derivative

$$
f'(x) = 4x^3 - 12x^2
$$

#### 2. Critical Points

$$
4x^2(x - 3) = 0
\;\Longrightarrow\;
x = 0 \;(\text{double root}) \text{ or } x = 3
$$

#### 3. Second Derivative And Values

$$
f''(x) = 12x^2 - 24x
$$

**At $x = 3$:** $f''(3) = 108 - 72 = 36 > 0$, **local minimum**.

**At $x = 0$:** $f''(0) = 0$, so the test **fails**. Go to Step 4.

$$
f(0) = 0,
\qquad
f(3) = 81 - 108 = -27
$$

#### 4. Sign Check

$$
f'(-1) = 4(1)(-4) = -16 < 0,
\qquad
f'(1) = 4(1)(-2) = -8 < 0
$$

$f$ is falling on both sides of $0$, so $x = 0$ is **neither** a maximum nor a minimum (a flat point where the curve keeps falling).

#### 5. Conclusion

**Hence** $x = 3$ is a local (in fact global) minimum with $f = -27$; $x = 0$ is a stationary point that is not an extremum.

---

### Example A3 — the lecture's quartic: why we need gradient descent

**Given** $f(x) = x^4 + 7x^3 + 5x^2 - 17x + 3$.

**AIM:** Locate and classify the stationary points.

#### 1. First Derivative

$$
f'(x) = 4x^3 + 21x^2 + 10x - 17
$$

#### 2. Critical Points

**The cubic has no neat factorization.** Locate the roots by sign changes:

| $x$ | $-5$ | $-4$ | $-2$ | $-1$ | $0$ | $1$ |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $f'(x)$ | $-42$ | $23$ | $15$ | $-10$ | $-17$ | $18$ |
**Three sign changes,** so three roots, in $(-5,-4)$, $(-2,-1)$ and $(0,1)$. Numerically:

$$
x_1 \approx -4.48,
\qquad
x_2 \approx -1.43,
\qquad
x_3 \approx 0.66
$$

#### 3. Second Derivative And Values

$$
f''(x) = 12x^2 + 42x + 10
$$

| Point | $f''$ | Type |
| :--- | :--- | :--- |
| $x_1 \approx -4.48$ | $\approx 62.7 > 0$ | local minimum |
| $x_2 \approx -1.43$ | $\approx -25.5 < 0$ | local maximum |
| $x_3 \approx 0.66$ | $\approx 43.1 > 0$ | local minimum |

$$
f(-4.48) \approx -47.1,
\qquad
f(-1.43) \approx 21.25,
\qquad
f(0.66) \approx -3.8
$$

#### 4. Sign Check

**The sign table in Step 2 reads $-,+,+,-,-,+$:** falling → rising at $x_1$ (min), rising → falling at $x_2$ (max), falling → rising at $x_3$ (min) ✓

#### 5. Conclusion

**Hence** two local minima and one local maximum; the **global** minimum is at $x \approx -4.48$.

**Lesson (lecture):** when $f' = 0$ cannot be solved by hand, we use gradient descent. Started at $x_0 = 0$ with $\alpha = 0.02$ it gives $0.34,\ 0.56,\ 0.64,\dots \to 0.66$: the **local** minimum on its side, not the global one. The start point matters.

---

## 4. Practice Questions — Critical Points

> Marks shown are my estimate of exam weight, not official.

**Q1. (4 marks)** Find and classify the critical points of $f(x) = 2x^3 - 9x^2 + 12x$.

**Pattern:** A1. Use the five headings in Routine A.

**Q2. (3 marks)** For $x > 0$, find and classify the critical point of $f(x) = x + \dfrac{9}{x}$.
*Hint: write $\tfrac9x = 9x^{-1}$ before differentiating.*

**Q3. (4 marks)** Find and classify the critical points of $f(x) = x^4 - 2x^2$.
*Hint: factor $4x(x^2 - 1)$ completely; expect three points.*

---

## 5. Solved Examples — Gradient Descent

> Follow the matching fixed routine above.

### Example B1 — one variable

**Given** $f(x) = x^2 - 4x + 5$, start $x_0 = 0$, learning rate $\alpha = 0.1$.

**AIM:** Perform three gradient-descent iterations and check that $f$ decreases.

#### 1. Gradient

$$
f'(x) = 2x - 4
$$

#### 2. Update Rule

$$
x_{i+1} = x_i - 0.1\,(2x_i - 4)
$$

#### 3. Iterations

**Gradient at $x_0 = 0$:** $f'(0) = -4$.

**Update:** $x_1 = 0 - 0.1(-4) = 0.4$.

**Gradient at $x_1 = 0.4$:** $f'(0.4) = 0.8 - 4 = -3.2$.

**Update:** $x_2 = 0.4 - 0.1(-3.2) = 0.4 + 0.32 = 0.72$.

**Gradient at $x_2 = 0.72$:** $f'(0.72) = 1.44 - 4 = -2.56$.

**Update:** $x_3 = 0.72 + 0.256 = 0.976$.

#### 4. Value Check

| $i$ | $x_i$ | $f'(x_i)$ | $-\alpha f'(x_i)$ | $f(x_i) = x_i^2 - 4x_i + 5$ |
| :--- | :--- | :--- | :--- | :--- |
| 0 | $0$ | $-4$ | $+0.4$ | $5$ |
| 1 | $0.4$ | $-3.2$ | $+0.32$ | $3.56$ |
| 2 | $0.72$ | $-2.56$ | $+0.256$ | $2.6384$ |
| 3 | $0.976$ | | | $2.0486$ |

$5 > 3.56 > 2.6384 > 2.0486$ ✓

#### 5. Conclusion

$f'(x) = 0 \Rightarrow x^* = 2$, $f(2) = 1$.
**Hence** the iterates move steadily right towards $x^* = 2$: the gradient is negative, so $-\alpha f'$ is positive.

---

### Example B2 — two variables

**Given** $f(x,y) = x^2 + 2y^2$, start $(x_0,y_0) = (2,\,1)$, $\alpha = 0.1$.

**AIM:** Perform three iterations.

#### 1. Gradient

$$
\nabla f(x,y) = \begin{bmatrix} 2x\\ 4y\end{bmatrix}
$$

#### 2. Update Rule

$$
\begin{bmatrix} x_{i+1}\\ y_{i+1}\end{bmatrix}
= \begin{bmatrix} x_i\\ y_i\end{bmatrix} - 0.1\begin{bmatrix} 2x_i\\ 4y_i\end{bmatrix}
= \begin{bmatrix} 0.8\,x_i\\ 0.6\,y_i\end{bmatrix}
$$

#### 3. Iterations

$$
\nabla f(2,1) = (4,\,4),
\qquad
(2,\,1) - 0.1(4,\,4) = (1.6,\; 0.6)
$$

$$
\nabla f(1.6,\,0.6) = (3.2,\,2.4),
\qquad
(1.6,\,0.6) - (0.32,\,0.24) = (1.28,\; 0.36)
$$

$$
\nabla f(1.28,\,0.36) = (2.56,\,1.44),
\qquad
(1.28,\,0.36) - (0.256,\,0.144) = (1.024,\; 0.216)
$$

#### 4. Value Check

| $i$ | $(x_i, y_i)$ | $f = x^2 + 2y^2$ |
| :--- | :--- | :--- |
| 0 | $(2,\,1)$ | $6$ |
| 1 | $(1.6,\,0.6)$ | $3.28$ |
| 2 | $(1.28,\,0.36)$ | $1.8976$ |
| 3 | $(1.024,\,0.216)$ | $1.1419$ |

#### 5. Conclusion

$\nabla f = \mathbf 0$ at $(0,0)$ with $f = 0$.
**Hence** the iterates approach $(0,0)$. $y$ shrinks faster (factor $0.6$) than $x$ (factor $0.8$) because the surface is steeper in $y$. This uneven scaling is what momentum helps with.

---

### Example B3 — a shifted bowl

**Given** $f(x,y) = (x - 1)^2 + 2(y + 2)^2$, start $(0,\,0)$, $\alpha = 0.25$.

**AIM:** Perform three iterations and compare with the minimizer.

#### 1. Gradient

(chain rule on each bracket)

$$
\nabla f(x,y) = \begin{bmatrix} 2(x - 1)\\ 4(y + 2)\end{bmatrix}
$$

#### 2. Update Rule

$$
x_{i+1} = x_i - 0.5(x_i - 1),
\qquad
y_{i+1} = y_i - (y_i + 2) = -2
$$

#### 3. Iterations

$$
\nabla f(0,0) = (-2,\; 8),
\qquad
(0,\,0) - 0.25(-2,\,8) = (0.5,\; -2)
$$

$$
\nabla f(0.5,\,-2) = (-1,\; 0),
\qquad
(0.5,\,-2) - 0.25(-1,\,0) = (0.75,\; -2)
$$

$$
\nabla f(0.75,\,-2) = (-0.5,\; 0),
\qquad
(0.75,\,-2) + (0.125,\,0) = (0.875,\; -2)
$$

#### 4. Value Check

| $i$ | $(x_i,y_i)$ | $f$ |
| :--- | :--- | :--- |
| 0 | $(0,\,0)$ | $1 + 8 = 9$ |
| 1 | $(0.5,\,-2)$ | $0.25$ |
| 2 | $(0.75,\,-2)$ | $0.0625$ |
| 3 | $(0.875,\,-2)$ | $0.015625$ |

#### 5. Conclusion

$\nabla f = \mathbf 0$ at $(1,\,-2)$ with $f = 0$.
**Hence** $y$ lands on $-2$ in one step (its factor is $1 - 0.25\cdot 4 = 0$), while $x$ halves its distance to $1$ each step.

---

### Example B4 — the effect of the learning rate

**Given** $f(x) = x^2$, $f'(x) = 2x$, start $x_0 = 1$.

**AIM:** Compare three iterations for $\alpha = 0.1$, $0.9$ and $1.1$.

#### 1. Gradient

$f'(x) = 2x$.

#### 2. Update Rule

$$
x_{i+1} = x_i - \alpha(2x_i) = (1 - 2\alpha)\,x_i
$$

Each step multiplies $x$ by the factor $1 - 2\alpha$.

#### 3. Iterations

$$
1 \;\to\; 0.8 \;\to\; 0.64 \;\to\; 0.512
$$

$$
1 \;\to\; -0.8 \;\to\; 0.64 \;\to\; -0.512
$$

The sign flips every step: it jumps over the minimum and **oscillates**.

$$
1 \;\to\; -1.2 \;\to\; 1.44 \;\to\; -1.728
$$

The size grows every step: the method **diverges**.

#### 4. Value Check

| $\alpha$ | $f(x_0)$ | $f(x_1)$ | $f(x_2)$ | $f(x_3)$ | behaviour |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $0.1$ | $1$ | $0.64$ | $0.4096$ | $0.2621$ | slow, steady |
| $0.9$ | $1$ | $0.64$ | $0.4096$ | $0.2621$ | same $f$, but oscillating $x$ |
| $1.1$ | $1$ | $1.44$ | $2.0736$ | $2.9860$ | $f$ **increases**: diverges |

#### 5. Conclusion

**Hence** for $f = x^2$: $0 < \alpha < 0.5$ converges without oscillation, $0.5 < \alpha < 1$ converges while oscillating, $\alpha > 1$ diverges. (The rule is $|1 - 2\alpha| < 1$.)

---

## 6. Practice Questions — Gradient Descent

**Q4. (4 marks)** For $f(x) = (x - 3)^2$ with $x_0 = 0$ and $\alpha = 0.25$, perform three iterations. Tabulate $x_i$, $f'(x_i)$ and $f(x_i)$.
*Hint: as in Example B1; the factor here is $0.5$.*

**Q5. (5 marks)** For $f(x,y) = x^2 + y^2 - 2x + 4y$ with $(x_0,y_0) = (0,0)$ and $\alpha = 0.1$, perform two iterations and find the true minimizer.
*Hint: as in Example B3.*

**Q6. (3 marks)** For $f(x) = x^2$ from $x_0 = 3$, describe what happens with $\alpha = 0.5$ and with $\alpha = 1$. Explain using the factor $1 - 2\alpha$.
*Hint: Example B4.*

---

## 7. Solved Examples — Learning-Rate Decay

Two questions: computing the schedules, then using a decaying rate inside the iterations.

### Example C1 — computing the schedules

**Given** $\alpha_0 = 0.5$, $\kappa = 0.1$.

**AIM:** Compute $\alpha_0,\dots,\alpha_3$ for exponential, inverse and step decay (halve every 2 steps).

#### 1. Schedule

$$
\alpha_i^{\exp} = 0.5\,e^{-0.1 i},
\qquad
\alpha_i^{\text{inv}} = \frac{0.5}{1 + 0.1 i},
\qquad
\alpha_i^{\text{step}} = 0.5 \times \left(\tfrac12\right)^{\lfloor i/2\rfloor}
$$

#### 2. Learning Rates

| $i$ | exponential | inverse | step |
| :--- | :--- | :--- | :--- |
| 0 | $0.5$ | $0.5$ | $0.5$ |
| 1 | $0.5e^{-0.1} \approx 0.4524$ | $0.5/1.1 \approx 0.4545$ | $0.5$ |
| 2 | $0.5e^{-0.2} \approx 0.4094$ | $0.5/1.2 \approx 0.4167$ | $0.25$ |
| 3 | $0.5e^{-0.3} \approx 0.3704$ | $0.5/1.3 \approx 0.3846$ | $0.25$ |

#### 3. Iterations

not asked here (see Example C2).

#### 4. Table And Comparison

done in Step 2.

**For the same $\kappa$,** exponential decay shrinks slightly faster than inverse decay; step decay stays flat, then drops sharply.

#### 5. Conclusion

**Hence** all three start at $\alpha_0 = 0.5$ and shrink; a larger $\kappa$ would shrink them faster.

---

### Example C2 — decay removes oscillation

**Given** $f(x) = x^2$, $x_0 = 1$, and $\alpha_i = 0.9\,e^{-0.5 i}$.

**AIM:** Perform three iterations and compare with the constant rate $\alpha = 0.9$.

#### 1. Schedule

$$
\alpha_i = 0.9\,e^{-0.5 i},
\qquad
x_{i+1} = (1 - 2\alpha_i)\,x_i
$$

#### 2. Learning Rates

$$
\alpha_0 = 0.9,
\qquad
\alpha_1 = 0.9e^{-0.5} \approx 0.5459,
\qquad
\alpha_2 = 0.9e^{-1} \approx 0.3311
$$

#### 3. Iterations

$$
\begin{aligned}
x_1 &= (1 - 1.8)(1) = -0.8\\
x_2 &= (1 - 1.0918)(-0.8) = (-0.0918)(-0.8) \approx 0.0734\\
x_3 &= (1 - 0.6622)(0.0734) = (0.3378)(0.0734) \approx 0.0248
\end{aligned}
$$

#### 4. Table And Comparison

| $i$ | decaying $\alpha_i$ | decaying $x_i$ | constant $\alpha = 0.9$: $x_i$ |
| :--- | :--- | :--- | :--- |
| 0 | $0.9$ | $1$ | $1$ |
| 1 | $0.5459$ | $-0.8$ | $-0.8$ |
| 2 | $0.3311$ | $0.0734$ | $0.64$ |
| 3 | | $0.0248$ | $-0.512$ |

**Constant $0.9$ keeps jumping across $0$** with slowly shrinking size. The decaying rate makes one big jump, then settles close to $0$.

#### 5. Conclusion

**Hence** decay gives "large strides first, careful finish": after three steps $|x_3| \approx 0.025$ against $0.512$.

---

## 8. Practice Questions — Decay

**Q7. (3 marks)** For $\alpha_0 = 1$ and $\kappa = 0.5$, compute $\alpha_0,\dots,\alpha_3$ under exponential and under inverse decay. Which decays faster?
*Hint: as in Example C1.*

**Q8. (4 marks)** For $f(x) = x^2$ from $x_0 = 1$ with inverse decay $\alpha_i = \dfrac{0.9}{1 + i}$, perform three iterations and compare with the constant rate $0.9$.
*Hint: as in Example C2.*

---

## 9. Solved Examples — Momentum

> Follow the matching fixed routine above.

### Example D1 — momentum speeds things up

**Given** $f(x) = x^2$, $x_0 = 1$, $\alpha = 0.1$, $\beta = 0.5$.

**AIM:** Perform three momentum iterations and compare with plain gradient descent.

#### 1. Update Rule

$$
x_{i+1} = x_i - 0.1\,(2x_i) + \Delta x_i,
\qquad
\Delta x_i = 0.5\,(x_i - x_{i-1}),
\qquad
\Delta x_0 = 0
$$

#### 2. Momentum Iterations

(no history)

$$
x_1 = 1 - 0.2 + 0 = 0.8
$$

$$
\Delta x_1 = 0.5\,(0.8 - 1) = -0.1,
\qquad
x_2 = 0.8 - 0.16 - 0.1 = 0.54
$$

$$
\Delta x_2 = 0.5\,(0.54 - 0.8) = -0.13,
\qquad
x_3 = 0.54 - 0.108 - 0.13 = 0.302
$$

#### 3. Without Momentum

(factor $0.8$)

$$
1 \;\to\; 0.8 \;\to\; 0.64 \;\to\; 0.512
$$

#### 4. Comparison

| $i$ | plain $x_i$ | momentum $x_i$ | $\Delta x_i$ |
| :--- | :--- | :--- | :--- |
| 0 | $1$ | $1$ | $0$ |
| 1 | $0.8$ | $0.8$ | $-0.1$ |
| 2 | $0.64$ | $0.54$ | $-0.13$ |
| 3 | $0.512$ | $0.302$ | |

#### 5. Conclusion

**Hence** momentum reaches $0.302$ against $0.512$: consistent downhill moves build up speed.

---

### Example D2 — momentum can overshoot

**Given** $f(x) = x^2$, $x_0 = 2$, $\alpha = 0.25$, $\beta = 0.5$.

**AIM:** Perform three momentum iterations and compare with plain gradient descent.

#### 1. Update Rule

$$
x_{i+1} = x_i - 0.25\,(2x_i) + \Delta x_i = 0.5\,x_i + \Delta x_i
$$

#### 2. Momentum Iterations

$$
x_1 = 0.5(2) + 0 = 1
$$

$$
\Delta x_1 = 0.5\,(1 - 2) = -0.5,
\qquad
x_2 = 0.5(1) - 0.5 = 0
$$

$$
\Delta x_2 = 0.5\,(0 - 1) = -0.5,
\qquad
x_3 = 0.5(0) - 0.5 = -0.5
$$

#### 3. Without Momentum

(factor $0.5$)

$$
2 \;\to\; 1 \;\to\; 0.5 \;\to\; 0.25
$$

#### 4. Comparison

| $i$ | plain $x_i$ | momentum $x_i$ | $\Delta x_i$ |
| :--- | :--- | :--- | :--- |
| 0 | $2$ | $2$ | $0$ |
| 1 | $1$ | $1$ | $-0.5$ |
| 2 | $0.5$ | $0$ | $-0.5$ |
| 3 | $0.25$ | $-0.5$ | |

#### 5. Conclusion

**Hence** momentum hits the minimum at step 2 but keeps moving and passes it: the carried velocity $-0.5$ pushes $x$ to $-0.5$. Momentum speeds up progress but can overshoot; $\beta$ controls how much history is kept.

---

## 10. Practice Questions — Momentum

**Q9. (5 marks)** For $f(x) = 2x^2$ with $x_0 = 2$, $\alpha = 0.1$, $\beta = 0.3$, perform three iterations of gradient descent with momentum. Compare with plain gradient descent.
*Hint: as in Example D1; $f'(x) = 4x$.*

**Q10. (4 marks)** For $f(x) = x^2$ with $x_0 = 1$, $\alpha = 0.2$, $\beta = 0.5$, perform three momentum iterations. Does it overshoot $0$?
*Hint: as in Example D2.*

---

## 11. Solved Examples — Convex Functions and Sets

> Follow the matching fixed routine above.

### Example E1 — the lecture's function, both tests

**Given** $f(x) = x\log_2 x$ for $x > 0$, points $x = 2$, $y = 4$, $\theta = 0.5$.

**AIM:** Check the convexity definition and the gradient criterion at these points.

#### 1. Test

$$
f\big(\theta x + (1-\theta)y\big) \le \theta f(x) + (1-\theta)f(y)
\qquad\text{and}\qquad
f(y) \ge f(x) + f'(x)(y - x)
$$

#### 2. Points And Weight

**Mixed point:** $\theta x + (1-\theta)y = 0.5(2) + 0.5(4) = 3$.

#### 3. Evaluate And Compare

$$
f(3) = 3\log_2 3 \approx 3 \times 1.585 = 4.755
$$

$$
0.5\,(2\log_2 2) + 0.5\,(4\log_2 4) = 0.5(2) + 0.5(8) = 5
$$

$$
4.755 \le 5 \;✓
\qquad\text{(the chord lies above the curve here)}
$$

#### 4. Check

**Derivative** (product rule, with $\tfrac{d}{dx}\log_2 x = \tfrac{1}{x\ln 2}$):

$$
f'(x) = \log_2 x + x\cdot\frac{1}{x\ln 2} = \log_2 x + \frac{1}{\ln 2},
\qquad
f'(2) = 1 + 1.4427 = 2.4427
$$

**Tangent value at $y = 4$:**

$$
f(2) + f'(2)(4 - 2) = 2 + 4.885 = 6.885 \;\le\; f(4) = 8 \;✓
$$

**For all $x$:** $f''(x) = \dfrac{1}{x\ln 2} > 0$ for every $x > 0$, which proves convexity on the whole domain.

#### 5. Conclusion

**Hence** both tests hold at these points (matching slides 15–16), and $f'' > 0$ proves $f$ is convex for all $x > 0$.

---

### Example E2 — proving $x^2$ is convex for all points

**Given** $f(x) = x^2$ on $\mathbb{R}$.

**AIM:** Prove convexity from the definition.

#### 1. Test

$f(\theta x + (1-\theta)y) \le \theta f(x) + (1-\theta)f(y)$ for all $x, y \in \mathbb{R}$, $\theta \in [0,1]$.

#### 2. Points And Weight

general $x, y$ and $\theta$ (letters, because this is a proof).

#### 3. Evaluate And Compare

$$
\big(\theta x + (1-\theta)y\big)^2 = \theta^2x^2 + 2\theta(1-\theta)xy + (1-\theta)^2y^2
$$

$$
\theta x^2 + (1-\theta)y^2
$$

$$
\begin{aligned}
&\theta x^2 - \theta^2x^2 + (1-\theta)y^2 - (1-\theta)^2y^2 - 2\theta(1-\theta)xy\\
&= \theta(1-\theta)x^2 + \theta(1-\theta)y^2 - 2\theta(1-\theta)xy &&(\theta - \theta^2 = \theta(1-\theta),\; (1-\theta) - (1-\theta)^2 = \theta(1-\theta))\\
&= \theta(1-\theta)(x - y)^2 \;\ge\; 0 &&(\theta \ge 0,\; 1 - \theta \ge 0,\; \text{a square} \ge 0)
\end{aligned}
$$

So right $\ge$ left for every choice ✓

#### 4. Check

$f''(x) = 2 > 0$ ✓
**Gradient criterion:** $y^2 \ge x^2 + 2x(y - x) \iff y^2 - 2xy + x^2 \ge 0 \iff (y - x)^2 \ge 0$ ✓

#### 5. Conclusion

**Hence** $f(x) = x^2$ is convex on $\mathbb{R}$, **proven**.

---

### Example E3 — $x^3$ is not convex on $\mathbb{R}$

**Given** $f(x) = x^3$ on $\mathbb{R}$.

**AIM:** Show that $f$ is not convex.

#### 1. Test

the definition must hold for **all** points; one failure disproves it.

#### 2. Points And Weight

$x = -2$, $y = 0$, $\theta = 0.5$; mixed point $-1$.

#### 3. Evaluate And Compare

$f(-1) = -1$.

$0.5(-8) + 0.5(0) = -4$.

is $-1 \le -4$? **No** ✗. The chord lies **below** the curve here.

#### 4. Check

$f''(x) = 6x < 0$ for $x < 0$, so the curve bends downward on the negative side ✓. (On $[0,\infty)$, $f'' \ge 0$ and $f$ is convex there: the domain matters.)

#### 5. Conclusion

**Hence** $x^3$ is **not** convex on $\mathbb{R}$.

---

### Example E4 — a convex set and a non-convex set

**Given** $C = \left\{\, x \in \mathbb{R}^2 \;\middle|\; x_1 + 2x_2 \le 4 \,\right\}$ and $S = \left\{\, t \in \mathbb{R} \;\middle|\; t \le -1 \text{ or } t \ge 1 \,\right\}$.

**AIM:** Decide which set is convex.

#### 1. Test

$x, y \in C$, $\theta \in [0,1]$ $\Rightarrow$ $z = \theta x + (1-\theta)y \in C$.

#### 2. Points And Weight

general $x, y \in C$, so $x_1 + 2x_2 \le 4$ and $y_1 + 2y_2 \le 4$.

#### 3. Evaluate And Compare

$$
z_1 + 2z_2 = \theta(x_1 + 2x_2) + (1-\theta)(y_1 + 2y_2)
$$

$$
\le \theta\cdot 4 + (1-\theta)\cdot 4 = 4
\qquad(\theta \ge 0 \text{ and } 1 - \theta \ge 0 \text{ keep each inequality's direction})
$$

$z_1 + 2z_2 \le 4$, so $z \in C$ ✓. $C$ is convex (every half-plane is).

#### 4. Check

$-1 \in S$ and $1 \in S$. With $\theta = 0.5$ the midpoint is $0$.
Is $0 \le -1$? No. Is $0 \ge 1$? No. So $0 \notin S$ ✗. The segment from $-1$ to $1$ crosses the gap.

#### 5. Conclusion

**Hence** $C$ is convex and $S$ is **not** convex.

---

## 12. Practice Questions — Convexity

**Q11. (4 marks)** For $f(x) = x^2$, verify the convexity definition with $x = 1$, $y = 3$, $\theta = 0.25$, and the gradient criterion at $x = 1$, $y = 3$.
*Hint: numbers as in Example E1; the general proof is Example E2.*

**Q12. (3 marks)** Decide whether each set is convex, with a reason or a counterexample:
(a) $\left\{\, (x,y) \;\middle|\; y \ge x^2 \,\right\}$, (b) $\left\{\, (x,y) \;\middle|\; x^2 + y^2 = 1 \,\right\}$.
*Hint: for (a) use Example E2's inequality; for (b) find a midpoint that leaves the circle, as in Example E4.*

**Q13. (3 marks)** For $f(x) = e^x$, check the definition at $x = 0$, $y = 2$, $\theta = 0.5$, then prove convexity with $f''$.
*Hint: as in Example E1.*

---

## 13. Solved Examples — Linear Programmes

> Follow the matching fixed routine above.

### Example F1 — the lecture's example (minimize)

**Given**

$$
\min_{x,y}\; 2x + 2y
\quad\text{subject to}\quad
x + y \le 10,
\quad
2x + y \ge 10,
\quad
x \ge 0,
\quad
y \ge 0
$$

**AIM:** Find the minimum and where it occurs.

#### 1. Objective And Constraints

**Linear objective and linear constraints:** a linear programme, so a convex problem; any local minimum is global and it sits at a corner.

**Standard form:**

$$
x + y - 10 \le 0,
\qquad
10 - 2x - y \le 0,
\qquad
-x \le 0,
\qquad
-y \le 0
$$

#### 2. Boundary Lines And Corners

$$
L_1:\; x + y = 10,
\qquad
L_2:\; 2x + y = 10,
\qquad
x = 0,
\qquad
y = 0
$$

| Lines | Solve | Corner |
| :--- | :--- | :--- |
| $L_2$, $y = 0$ | $2x = 10$ | $(5,\,0)$ |
| $L_1$, $y = 0$ | $x = 10$ | $(10,\,0)$ |
| $L_1$, $L_2$ | subtract: $x = 0$, then $y = 10$ | $(0,\,10)$ |
| $x = 0$, $y = 0$ | — | $(0,\,0)$ |

#### 3. Feasibility

| Corner | $x + y \le 10$ | $2x + y \ge 10$ | $x,y \ge 0$ | Feasible? |
| :--- | :--- | :--- | :--- | :--- |
| $(5,0)$ | $5$ ✓ | $10$ ✓ | ✓ | yes |
| $(10,0)$ | $10$ ✓ | $20$ ✓ | ✓ | yes |
| $(0,10)$ | $10$ ✓ | $10$ ✓ | ✓ | yes |
| $(0,0)$ | $0$ ✓ | $0$ ✗ | ✓ | **no** |

#### 4. Objective Values

| Corner | $2x + 2y$ |
| :--- | :--- |
| $(5,0)$ | $10$ |
| $(10,0)$ | $20$ |
| $(0,10)$ | $20$ |

$10$ at $(5,\,0)$.

#### 5. Conclusion

**Hence** the minimum of $2x + 2y$ is $10$ at $(x,y) = (5,0)$, and it is global because the problem is convex.

---

### Example F2 — a maximization

**Given**

$$
\max_{x,y}\; 3x + 2y
\quad\text{subject to}\quad
x + y \le 4,
\quad
x + 3y \le 6,
\quad
x, y \ge 0
$$

**AIM:** Find the maximum and where it occurs.

#### 1. Objective And Constraints

**Maximizing $3x + 2y$ is the same as minimizing $-(3x + 2y)$,** still a linear programme.
$x + y - 4 \le 0$, $\;x + 3y - 6 \le 0$, $\;-x \le 0$, $\;-y \le 0$.

#### 2. Boundary Lines And Corners

$$
L_1:\; x + y = 4,
\qquad
L_2:\; x + 3y = 6,
\qquad
x = 0,
\qquad
y = 0
$$

| Lines | Corner |
| :--- | :--- |
| $x = 0$, $y = 0$ | $(0,0)$ |
| $L_1$, $y = 0$ | $(4,0)$ |
| $L_2$, $y = 0$ | $(6,0)$ |
| $L_1$, $x = 0$ | $(0,4)$ |
| $L_2$, $x = 0$ | $(0,2)$ |
| $L_1$, $L_2$: subtract, $2y = 2$ | $(3,1)$ |

#### 3. Feasibility

| Corner | $x + y \le 4$ | $x + 3y \le 6$ | Feasible? |
| :--- | :--- | :--- | :--- |
| $(0,0)$ | $0$ ✓ | $0$ ✓ | yes |
| $(4,0)$ | $4$ ✓ | $4$ ✓ | yes |
| $(6,0)$ | $6$ ✗ | $6$ ✓ | no |
| $(0,4)$ | $4$ ✓ | $12$ ✗ | no |
| $(0,2)$ | $2$ ✓ | $6$ ✓ | yes |
| $(3,1)$ | $4$ ✓ | $6$ ✓ | yes |

#### 4. Objective Values

| Corner | $3x + 2y$ |
| :--- | :--- |
| $(0,0)$ | $0$ |
| $(4,0)$ | $12$ |
| $(0,2)$ | $4$ |
| $(3,1)$ | $11$ |

$12$ at $(4,\,0)$.

#### 5. Conclusion

**Hence** the maximum of $3x + 2y$ is $12$ at $(4,0)$.

---

### Example F3 — a minimization with upper bounds

**Given**

$$
\min_{x,y}\; x + 3y
\quad\text{subject to}\quad
x + y \ge 3,
\quad
x \le 4,
\quad
y \le 2,
\quad
x, y \ge 0
$$

**AIM:** Find the minimum and where it occurs.

#### 1. Objective And Constraints

$$
3 - x - y \le 0,
\qquad
x - 4 \le 0,
\qquad
y - 2 \le 0,
\qquad
-x \le 0,
\qquad
-y \le 0
$$

#### 2. Boundary Lines And Corners

$x + y = 3$, $\;x = 4$, $\;y = 2$, $\;x = 0$, $\;y = 0$.

$$
(3,0),\;\; (1,2),\;\; (0,3),\;\; (4,0),\;\; (4,2),\;\; (0,2),\;\; (0,0),\;\; (4,-1)
$$

#### 3. Feasibility

| Corner | $x + y \ge 3$ | $x \le 4$ | $y \le 2$ | $x,y \ge 0$ | Feasible? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $(3,0)$ | $3$ ✓ | ✓ | ✓ | ✓ | yes |
| $(1,2)$ | $3$ ✓ | ✓ | ✓ | ✓ | yes |
| $(0,3)$ | ✓ | ✓ | $3$ ✗ | ✓ | no |
| $(4,0)$ | $4$ ✓ | ✓ | ✓ | ✓ | yes |
| $(4,2)$ | $6$ ✓ | ✓ | ✓ | ✓ | yes |
| $(0,2)$ | $2$ ✗ | ✓ | ✓ | ✓ | no |
| $(0,0)$ | $0$ ✗ | ✓ | ✓ | ✓ | no |
| $(4,-1)$ | ✓ | ✓ | ✓ | $y < 0$ ✗ | no |

#### 4. Objective Values

| Corner | $x + 3y$ |
| :--- | :--- |
| $(3,0)$ | $3$ |
| $(4,0)$ | $4$ |
| $(4,2)$ | $10$ |
| $(1,2)$ | $7$ |

$3$ at $(3,\,0)$.

#### 5. Conclusion

**Hence** the minimum of $x + 3y$ is $3$ at $(3,0)$. Since $y$ costs three times as much as $x$, the optimum uses no $y$ at all.

---

## 14. Practice Questions — Linear Programmes

**Q14. (5 marks)** Solve by listing and checking the corner points:

$$
\min_{x,y}\; 3x + 2y
\quad\text{subject to}\quad
x + y \ge 4,
\quad
x + 3y \ge 6,
\quad
x,y \ge 0
$$

*Hint: as in Example F3. The region is unbounded upwards, but the minimum still sits at a corner.*

**Q15. (5 marks)** Solve:

$$
\max_{x,y}\; 5x + 4y
\quad\text{subject to}\quad
6x + 4y \le 24,
\quad
x + 2y \le 6,
\quad
x,y \ge 0
$$

*Hint: as in Example F2. The two lines meet at a point with a half-integer coordinate.*

---

## 15. Practice Questions — Short Theory (2 marks each)

**Q16.** Why does gradient descent move in the direction of the **negative** gradient?

**Q17.** Explain what happens with a constant learning rate that is (a) too large, (b) too small.

**Q18.** Write the exponential and inverse decay formulas. What does $\kappa$ control?

**Q19.** Write the momentum update and explain the role of $\beta$. Why is $\Delta x_0 = 0$?

**Q20.** Define a convex set and a convex function, and give the gradient criterion.

**Q21.** What makes an optimization problem convex, and why is that useful?

---

## 16. Exam Traps

1. Adding the gradient instead of subtracting it: the update is $x_{i+1} = x_i - \alpha\nabla f$.
2. Using the new $x$ to compute the gradient in the same step. The gradient is always evaluated at the current $x_i$.
3. Forgetting $\Delta x_0 = 0$ in momentum, or computing $\Delta x_i$ in the wrong order ($x_i - x_{i-1}$, not the reverse).
4. Mixing up $e^{-\kappa i}$ (exponential) and $\dfrac{1}{1+\kappa i}$ (inverse), or using $\alpha_0$ in every step of a decaying schedule.
5. Claiming convexity from one numerical example. Numbers illustrate; a proof needs general letters or $f'' \ge 0$.
6. Stopping at $f''(x^*) = 0$ with "no extremum". The test failed; check the sign of $f'$ (Example A2).
7. In an LP, evaluating the objective at a corner that violates a constraint. Build the feasibility table first.
8. Writing "$f$ decreases" without computing $f(x_i)$ at each iterate.

---

**Recall chain:** gradient → update $x - \alpha\nabla f$ at the current point → table of iterates → check $f$ falls; decay: new $\alpha_i$ each step; momentum: add $\beta(x_i - x_{i-1})$; convexity: chord above curve → tangent below curve → $f'' \ge 0$; LP: lines → corners → feasibility → objective → best

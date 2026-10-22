# Lecture 7 - Exam Practice

**Topics:** Gradients, Hessians, Critical Points, Taylor

**Course:** DSEZC411 Essential Mathematics for Data Science

**Source:** `Maths/Class material/Lecture_7.pdf`, slides 9–14

**Status:** practice for the midterm. These are predictions, not guaranteed exam questions.

### Fixed Notation
| Write | Meaning |
| :--- | :--- |
| $f_x,f_y$ | First partial derivatives |
| $f_{xx},f_{xy},f_{yy}$ | Second partial derivatives |
| $H,D$ | Hessian; its determinant |
| $(x_0,y_0)$ | Point used in the Taylor formula |

> **Exam layout:** Given → AIM → numbered working → check → conclusion.
> Keep the same letters within each question type; standard topic symbols stay unchanged.

**Sections:** Formula sheet | Fixed routines | Solved examples | Practice questions.

---

## 1. Formula Sheet

### 1.1 Gradient

The gradient collects the first partial derivatives. For $f:\mathbb{R}^2 \to \mathbb{R}$:

$$
\nabla f(x,y) \;=\;
\begin{bmatrix}
\dfrac{\partial f}{\partial x} \\
\dfrac{\partial f}{\partial y}
\end{bmatrix}
\;=\;
\begin{bmatrix} f_x \\ f_y \end{bmatrix}
$$

### 1.2 Critical point

$(x_0,y_0)$ is a **critical point** of $f$ when the gradient is the zero vector:

$$
\nabla f(x_0,y_0) = \mathbf{0}
\qquad\Longleftrightarrow\qquad
f_x(x_0,y_0) = 0 \;\; \text{and} \;\; f_y(x_0,y_0) = 0
$$

Both equations must hold **at the same point**.

### 1.3 Hessian

The **Hessian** is the matrix of all second partial derivatives. It is symmetric, and for $f:\mathbb{R}^n \to \mathbb{R}$ it has order $n \times n$.

$$
H \;=\; \nabla^2_{x,y} f(x,y) \;=\;
\begin{bmatrix}
\dfrac{\partial^2 f}{\partial x^2} & \dfrac{\partial^2 f}{\partial x \, \partial y} \\
\dfrac{\partial^2 f}{\partial y \, \partial x} & \dfrac{\partial^2 f}{\partial y^2}
\end{bmatrix}
\;=\;
\begin{bmatrix}
f_{xx} & f_{xy} \\
f_{xy} & f_{yy}
\end{bmatrix}
$$

### 1.4 Second-derivative test (the $D$ test)

$$
D \;=\; \det H \;=\; f_{xx}\,f_{yy} \;-\; \left(f_{xy}\right)^2
$$

| Condition | Conclusion |
| :--- | :--- |
| $D > 0$ and $f_{xx} > 0$ | local minimum |
| $D > 0$ and $f_{xx} < 0$ | local maximum |
| $D < 0$ | saddle point |
| $D = 0$ | test is inconclusive |

### 1.5 First-order Taylor series (linear approximation)

$$
f(x,y) \;\approx\; f(x_0,y_0) \;+\; f_x(x_0,y_0)\,(x - x_0) \;+\; f_y(x_0,y_0)\,(y - y_0)
$$

### 1.6 Derivative rules you will need

$$
\frac{d}{dx}\left(x^n\right) = n\,x^{\,n-1}
\qquad
\frac{d}{dx}(c) = 0
\qquad
\frac{d}{dy}\left(e^{y}\right) = e^{y}
\qquad
\frac{d}{dx}\big(\ln x\big) = \frac{1}{x}
$$

Chain rule, for a function inside a function:

$$
\frac{\partial}{\partial x}\, g\big(u(x,y)\big) \;=\; g'(u)\cdot \frac{\partial u}{\partial x}
\qquad\text{example}\qquad
\frac{\partial}{\partial x}\sqrt{u} \;=\; \frac{1}{2\sqrt{u}}\cdot\frac{\partial u}{\partial x}
$$

---

## 2. Fixed Exam Routines

> Use the same headings for the same question type. Keep each named row operation.

### Routine A - Find and classify critical points
Step | Write
--- | ---
1 | **Gradient**
2 | **Critical Points**
3 | **Hessian**
4 | **Classification**
5 | **Values And Conclusion**

### Routine B - First-order Taylor series
Step | Write
--- | ---
1 | **Function And Value**
2 | **Derivatives At The Point**
3 | **Taylor Formula**
4 | **Estimate**
5 | **Check And Conclusion**

> **Stop rule:** If a required test fails, state the failure and conclusion.
---

## 3. Solved Examples — Critical Points

> Follow the matching fixed routine above.

### Example A1 — the factoring route

**Given** $f(x,y) = 2x^3 + xy^2 + 5x^2 + y^2$.

**AIM:** Find every critical point and classify each as a local maximum, a local minimum or a saddle point.

#### 1. Gradient

$$
\begin{aligned}
f_x&=6x^2+y^2+10x,\\
f_y&=2xy+2y=2y(x+1).
\end{aligned}
$$

#### 2. Critical Points

**Both partial derivatives must be zero at the same point:**

$$
\begin{aligned}
6x^2 + y^2 + 10x &= 0 &&\text{(1)}\\
2xy + 2y &= 0 &&\text{(2)}
\end{aligned}
$$

**Factor (2):**

$$
2xy + 2y = 2y(x+1)
$$

**Apply the zero-product rule** (a product is zero when one factor is zero):

$$
2y(x+1) = 0
\quad\Longrightarrow\quad
y = 0 \;\;\text{ (Case A)}\quad\text{or}\quad x = -1 \;\;\text{ (Case B)}
$$

**Case A: put $y = 0$ into (1).** Every $y$ in (1) becomes $0$:

$$
\begin{aligned}
6x^2 + \underbrace{(0)^2}_{y^2} + 10x &= 0\\
6x^2 + 10x &= 0\\
2x(3x + 5) &= 0\\
x = 0 \quad&\text{or}\quad x = -\tfrac{5}{3}
\end{aligned}
$$

Points from Case A: $(0,0)$ and $\left(-\tfrac{5}{3},\,0\right)$.
**Case B: put $x = -1$ into (1).** Every $x$ in (1) becomes $-1$:

$$
\begin{aligned}
6\underbrace{(-1)^2}_{x^2} + y^2 + 10\underbrace{(-1)}_{x} &= 0\\
6 + y^2 - 10 &= 0\\
y^2 &= 4\\
y = 2 \quad&\text{or}\quad y = -2
\end{aligned}
$$

Points from Case B: $(-1,2)$ and $(-1,-2)$.
**Check every point in both equations.** Both columns must give $0$:

| Point | (1): $6x^2 + y^2 + 10x$ | (2): $2y(x+1)$ |
| :--- | :--- | :--- |
| $(0,0)$ | $0 + 0 + 0 = 0$ ✓ | $0$ ✓ |
| $\left(-\tfrac53,0\right)$ | $\tfrac{150}{9} + 0 - \tfrac{50}{3} = 0$ ✓ | $0$ ✓ |
| $(-1,2)$ | $6 + 4 - 10 = 0$ ✓ | $2(2)(0) = 0$ ✓ |
| $(-1,-2)$ | $6 + 4 - 10 = 0$ ✓ | $2(-2)(0) = 0$ ✓ |

**Critical points:** $(0,0),\; \left(-\tfrac{5}{3},0\right),\; (-1,2),\; (-1,-2)$

#### 3. Hessian

$$
f_{xx} = \frac{\partial}{\partial x}\left(6x^2 + y^2 + 10x\right) = 12x + 0 + 10 = 12x + 10
$$

$$
f_{yy} = \frac{\partial}{\partial y}\left(2xy + 2y\right) = 2x + 2
$$

$$
f_{xy} = \frac{\partial}{\partial y}\left(6x^2 + y^2 + 10x\right) = 0 + 2y + 0 = 2y
$$

$$
H(x,y) = \begin{bmatrix} 12x+10 & 2y \\ 2y & 2x+2 \end{bmatrix},
\qquad
D = f_{xx}f_{yy} - (f_{xy})^2 = (12x+10)(2x+2) - (2y)^2
$$

#### 4. Classification

**At $(0,0)$:**

$$
f_{xx} = 10,\quad f_{yy} = 2,\quad f_{xy} = 0
\qquad\Longrightarrow\qquad
D = (10)(2) - 0^2 = 20 > 0
$$

$D > 0$ and $f_{xx} > 0$, so this is a **local minimum**.
**At $\left(-\tfrac53,0\right)$:**

$$
f_{xx} = 12\left(-\tfrac53\right) + 10 = -10,
\quad
f_{yy} = 2\left(-\tfrac53\right) + 2 = -\tfrac43,
\quad
f_{xy} = 0
$$

$$
D = (-10)\left(-\tfrac43\right) - 0^2 = \tfrac{40}{3} > 0
$$

$D > 0$ and $f_{xx} < 0$, so this is a **local maximum**.
**At $(-1,2)$:**

$$
f_{xx} = -2,\quad f_{yy} = 0,\quad f_{xy} = 4
\qquad\Longrightarrow\qquad
D = (-2)(0) - 4^2 = -16 < 0
$$

$D < 0$, so this is a **saddle point**.
**At $(-1,-2)$:**

$$
f_{xx} = -2,\quad f_{yy} = 0,\quad f_{xy} = -4
\qquad\Longrightarrow\qquad
D = (-2)(0) - (-4)^2 = -16 < 0
$$

$D < 0$, so this is a **saddle point**.

| Point | $f_{xx}$ | $f_{yy}$ | $f_{xy}$ | $D$ | Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $(0,0)$ | $10$ | $2$ | $0$ | $20 > 0$ | local minimum |
| $\left(-\tfrac53,0\right)$ | $-10$ | $-\tfrac43$ | $0$ | $\tfrac{40}{3} > 0$ | local maximum |
| $(-1,2)$ | $-2$ | $0$ | $4$ | $-16 < 0$ | saddle point |
| $(-1,-2)$ | $-2$ | $0$ | $-4$ | $-16 < 0$ | saddle point |

#### 5. Values And Conclusion

**Values of $f$ at the extreme points:**

$$
f(0,0) = 0,
\qquad
f\left(-\tfrac53,0\right) = 2\left(-\tfrac{125}{27}\right) + 5\left(\tfrac{25}{9}\right)
= -\tfrac{250}{27} + \tfrac{375}{27} = \tfrac{125}{27}
$$

**Hence:** $f$ has a local minimum at $(0,0)$ with $f = 0$, a local maximum at $\left(-\tfrac53,0\right)$ with $f = \tfrac{125}{27}$, and saddle points at $(-1,2)$ and $(-1,-2)$.

---

### Example A2 — the substitution route

**Given** $f(x,y) = x^4 + y^4 - 4xy + 1$.

**AIM:** Find every critical point and classify each one.

#### 1. Gradient

$$
\begin{aligned}
f_x&=4x^3-4y,\\
f_y&=4y^3-4x.
\end{aligned}
$$

#### 2. Critical Points

$$
\begin{aligned}
4x^3 - 4y &= 0 &&\text{(1)}\\
4y^3 - 4x &= 0 &&\text{(2)}
\end{aligned}
$$

**Divide each equation by $4$** to make the algebra lighter:

$$
\begin{aligned}
x^3 - y &= 0 &&\text{(1)}\\
y^3 - x &= 0 &&\text{(2)}
\end{aligned}
$$

**Equation (1) already contains a lone $y$,** so make $y$ the subject:

$$
x^3 - y = 0 \quad\Longrightarrow\quad y = x^3 \qquad\text{(3)}
$$

**Replace every $y$ in (2) by $x^3$:**

$$
\underbrace{\left(x^3\right)^3}_{y^3 \text{ with } y = x^3} - x = 0
$$

**Simplify the power,** using $\left(x^a\right)^b = x^{ab}$ and $3 \times 3 = 9$:

$$
x^9 - x = 0
$$

**Take out the common factor $x$** (do not divide by $x$, or the solution $x=0$ is lost):

$$
x\left(x^8 - 1\right) = 0
$$

**Apply the zero-product rule:**

$$
x = 0
\qquad\text{or}\qquad
x^8 - 1 = 0 \;\Longrightarrow\; x^8 = 1 \;\Longrightarrow\; x = 1 \text{ or } x = -1
$$

The power $8$ is even, so both signs work. There are no other real solutions, because

$$
x^8 - 1 = (x-1)(x+1)\underbrace{\left(x^2+1\right)}_{\text{never } 0}\underbrace{\left(x^4+1\right)}_{\text{never } 0}
$$

**Back-substitute into (3), $y = x^3$:**

$$
x = 0 \Rightarrow y = 0^3 = 0,
\qquad
x = 1 \Rightarrow y = 1^3 = 1,
\qquad
x = -1 \Rightarrow y = (-1)^3 = -1
$$

**Check every point in both equations:**

| Point | (1): $x^3 - y$ | (2): $y^3 - x$ |
| :--- | :--- | :--- |
| $(0,0)$ | $0 - 0 = 0$ ✓ | $0 - 0 = 0$ ✓ |
| $(1,1)$ | $1 - 1 = 0$ ✓ | $1 - 1 = 0$ ✓ |
| $(-1,-1)$ | $-1 - (-1) = 0$ ✓ | $-1 - (-1) = 0$ ✓ |

**Critical points:** $(0,0),\;(1,1),\;(-1,-1)$

#### 3. Hessian

$$
f_{xx} = 12x^2 - 0 = 12x^2
$$

$$
f_{yy} = 12y^2 - 0 = 12y^2
$$

$$
f_{xy} = 0 - 4 = -4
$$

$$
H(x,y) = \begin{bmatrix} 12x^2 & -4 \\ -4 & 12y^2 \end{bmatrix},
\qquad
D = \left(12x^2\right)\left(12y^2\right) - (-4)^2 = 144x^2y^2 - 16
$$

#### 4. Classification

**At $(0,0)$:**

$$
D = 144(0)^2(0)^2 - 16 = -16 < 0 \quad\Longrightarrow\quad \textbf{saddle point}
$$

Note that $f_{xx} = 0$ here, but its sign does not matter when $D < 0$.
**At $(1,1)$:**

$$
D = 144(1)(1) - 16 = 128 > 0,
\qquad
f_{xx} = 12(1)^2 = 12 > 0
\quad\Longrightarrow\quad \textbf{local minimum}
$$

**At $(-1,-1)$:**

$$
D = 144(1)(1) - 16 = 128 > 0,
\qquad
f_{xx} = 12(-1)^2 = 12 > 0
\quad\Longrightarrow\quad \textbf{local minimum}
$$

Both squares remove the minus signs, so this point behaves exactly like $(1,1)$.

| Point | $f_{xx}$ | $f_{yy}$ | $f_{xy}$ | $D$ | Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $(0,0)$ | $0$ | $0$ | $-4$ | $-16 < 0$ | saddle point |
| $(1,1)$ | $12$ | $12$ | $-4$ | $128 > 0$ | local minimum |
| $(-1,-1)$ | $12$ | $12$ | $-4$ | $128 > 0$ | local minimum |

#### 5. Values And Conclusion

**Values:**

$$
f(1,1) = 1 + 1 - 4(1)(1) + 1 = -1,
\qquad
f(-1,-1) = 1 + 1 - 4(-1)(-1) + 1 = -1
$$

**Hence:** $f$ has a saddle point at $(0,0)$ and local minima at $(1,1)$ and $(-1,-1)$, both with $f = -1$.

---

### Example A3 — one critical point, constant Hessian

**Given** $f(x,y) = x^2 + xy + y^2 - 6x + 2$.

**AIM:** Find every critical point and classify it.

#### 1. Gradient

$$
\begin{aligned}
f_x&=2x+y-6,\\
f_y&=x+2y.
\end{aligned}
$$

#### 2. Critical Points

**The system is two straight-line equations:**

$$
\begin{aligned}
2x + y - 6 &= 0 &&\text{(1)}\\
x + 2y &= 0 &&\text{(2)}
\end{aligned}
$$

**Equation (2) has no constant term,** so make $x$ the subject:

$$
x + 2y = 0 \quad\Longrightarrow\quad x = -2y \qquad\text{(3)}
$$

**Replace every $x$ in (1) by $-2y$:**

$$
2\underbrace{(-2y)}_{x} + y - 6 = 0
$$

**Simplify and solve for $y$:**

$$
\begin{aligned}
-4y + y - 6 &= 0\\
-3y &= 6\\
y &= -2
\end{aligned}
$$

**Equation (3):**

$$
x = -2(-2) = 4
$$

**Check the point $(4,-2)$ in both equations:**

$$
\text{(1)}: \; 2(4) + (-2) - 6 = 8 - 2 - 6 = 0 \; ✓
\qquad
\text{(2)}: \; 4 + 2(-2) = 0 \; ✓
$$

**Critical point:** $(4,-2)$

#### 3. Hessian

$$
f_{xx} = 2
$$

$$
f_{yy} = 2
$$

$$
f_{xy} = 1
$$

$$
H = \begin{bmatrix} 2 & 1 \\ 1 & 2 \end{bmatrix},
\qquad
D = (2)(2) - (1)^2 = 4 - 1 = 3
$$

#### 4. Classification

**At $(4,-2)$:**

$$
D = 3 > 0
\qquad\text{and}\qquad
f_{xx} = 2 > 0
\quad\Longrightarrow\quad \textbf{local minimum}
$$

| Point | $f_{xx}$ | $f_{yy}$ | $f_{xy}$ | $D$ | Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $(4,-2)$ | $2$ | $2$ | $1$ | $3 > 0$ | local minimum |

#### 5. Values And Conclusion

**Value:**

$$
f(4,-2) = (4)^2 + (4)(-2) + (-2)^2 - 6(4) + 2 = 16 - 8 + 4 - 24 + 2 = -10
$$

**Hence:** $f$ has exactly one critical point, a local minimum at $(4,-2)$ with $f = -10$.

---

### Example A4 — the lecture's own example (slide 12)

**Given** $f(x,y) = 3x^2y + y^3 - 3x^2 - 3y^2 + 2$.

**AIM:** Find every critical point and classify each one.

#### 1. Gradient

$$
\begin{aligned}
f_x&=6xy-6x=6x(y-1),\\
f_y&=3x^2+3y^2-6y.
\end{aligned}
$$

#### 2. Critical Points

$$
\begin{aligned}
6xy - 6x &= 0 &&\text{(1)}\\
3x^2 + 3y^2 - 6y &= 0 &&\text{(2)}
\end{aligned}
$$

**Equation (1) has $6x$ in both terms,** so it factors:

$$
6xy - 6x = 6x(y - 1)
$$

**Zero-product rule:**

$$
6x(y-1) = 0
\quad\Longrightarrow\quad
x = 0 \;\;\text{(Case A)}\quad\text{or}\quad y = 1 \;\;\text{(Case B)}
$$

**Case A: put $x = 0$ into (2):**

$$
\begin{aligned}
3\underbrace{(0)^2}_{x^2} + 3y^2 - 6y &= 0\\
3y^2 - 6y &= 0\\
3y(y - 2) &= 0\\
y = 0 \quad&\text{or}\quad y = 2
\end{aligned}
$$

Points from Case A: $(0,0)$ and $(0,2)$.
**Case B: put $y = 1$ into (2):**

$$
\begin{aligned}
3x^2 + 3\underbrace{(1)^2}_{y^2} - 6\underbrace{(1)}_{y} &= 0\\
3x^2 + 3 - 6 &= 0\\
3x^2 &= 3\\
x^2 &= 1\\
x = 1 \quad&\text{or}\quad x = -1
\end{aligned}
$$

Points from Case B: $(1,1)$ and $(-1,1)$.
**Check every point in both equations:**

| Point | (1): $6x(y-1)$ | (2): $3x^2 + 3y^2 - 6y$ |
| :--- | :--- | :--- |
| $(0,0)$ | $0$ ✓ | $0 + 0 - 0 = 0$ ✓ |
| $(0,2)$ | $0$ ✓ | $0 + 12 - 12 = 0$ ✓ |
| $(1,1)$ | $6(1)(0) = 0$ ✓ | $3 + 3 - 6 = 0$ ✓ |
| $(-1,1)$ | $-6(0) = 0$ ✓ | $3 + 3 - 6 = 0$ ✓ |

**Critical points:** $(0,0),\;(0,2),\;(1,1),\;(-1,1)$

#### 3. Hessian

$$
f_{xx} = 6y - 6
$$

Do **not** write $6y$; the $-6x$ term contributes $-6$.

$$
f_{yy} = 0 + 6y - 6 = 6y - 6
$$

$$
f_{xy} = 6x - 0 = 6x
$$

$$
H(x,y) = \begin{bmatrix} 6y-6 & 6x \\ 6x & 6y-6 \end{bmatrix},
\qquad
D = (6y-6)^2 - (6x)^2
$$

#### 4. Classification

**At $(0,0)$:**

$$
f_{xx} = 6(0) - 6 = -6,
\quad
f_{yy} = -6,
\quad
f_{xy} = 6(0) = 0
$$

$$
D = (-6)(-6) - 0^2 = 36 > 0,
\qquad f_{xx} < 0
\quad\Longrightarrow\quad \textbf{local maximum}
$$

**At $(0,2)$:**

$$
f_{xx} = 6(2) - 6 = 6,
\quad
f_{yy} = 6,
\quad
f_{xy} = 0
$$

$$
D = (6)(6) - 0^2 = 36 > 0,
\qquad f_{xx} > 0
\quad\Longrightarrow\quad \textbf{local minimum}
$$

**At $(1,1)$:**

$$
f_{xx} = 6(1) - 6 = 0,
\quad
f_{yy} = 0,
\quad
f_{xy} = 6(1) = 6
$$

$$
D = (0)(0) - 6^2 = -36 < 0
\quad\Longrightarrow\quad \textbf{saddle point}
$$

**At $(-1,1)$:**

$$
f_{xx} = 0,
\quad
f_{yy} = 0,
\quad
f_{xy} = 6(-1) = -6
$$

$$
D = (0)(0) - (-6)^2 = -36 < 0
\quad\Longrightarrow\quad \textbf{saddle point}
$$

| Point | $f_{xx}$ | $f_{yy}$ | $f_{xy}$ | $D$ | Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $(0,0)$ | $-6$ | $-6$ | $0$ | $36 > 0$ | local maximum |
| $(0,2)$ | $6$ | $6$ | $0$ | $36 > 0$ | local minimum |
| $(1,1)$ | $0$ | $0$ | $6$ | $-36 < 0$ | saddle point |
| $(-1,1)$ | $0$ | $0$ | $-6$ | $-36 < 0$ | saddle point |

#### 5. Values And Conclusion

**Values:**

$$
f(0,0) = 2,
\qquad
f(0,2) = 0 + 8 - 0 - 12 + 2 = -2
$$

**Hence:** local maximum at $(0,0)$ with $f = 2$; local minimum at $(0,2)$ with $f = -2$; saddle points at $(1,1)$ and $(-1,1)$. This matches the answers on slide 12.

---

### Example A5 — the inconclusive case, $D = 0$

**Given** $f(x,y) = x^4 + y^4$.

**AIM:** Find every critical point and classify it.

#### 1. Gradient

$$
\begin{aligned}
f_x&=4x^3,\\
f_y&=4y^3.
\end{aligned}
$$

#### 2. Critical Points

$$
\begin{aligned}
4x^3 &= 0 &&\text{(1)}\\
4y^3 &= 0 &&\text{(2)}
\end{aligned}
$$

**Equation (1):**

$$
4x^3 = 0 \;\Longrightarrow\; x^3 = 0 \;\Longrightarrow\; x = 0
$$

**Equation (2):**

$$
4y^3 = 0 \;\Longrightarrow\; y^3 = 0 \;\Longrightarrow\; y = 0
$$

**Check:** at $(0,0)$ both (1) and (2) give $0$ ✓

**Critical point:** $(0,0)$

#### 3. Hessian

$$
f_{xx} = \frac{\partial}{\partial x}\left(4x^3\right) = 12x^2
$$

$$
f_{yy} = \frac{\partial}{\partial y}\left(4y^3\right) = 12y^2
$$

$$
f_{xy} = 0
$$

$$
H(x,y) = \begin{bmatrix} 12x^2 & 0 \\ 0 & 12y^2 \end{bmatrix},
\qquad
D = \left(12x^2\right)\left(12y^2\right) - 0^2 = 144x^2y^2
$$

#### 4. Classification

**At $(0,0)$:**

$$
f_{xx} = 0,\quad f_{yy} = 0,\quad f_{xy} = 0
\qquad\Longrightarrow\qquad
D = 0
$$

$D = 0$, so the second-derivative test is **inconclusive**. It does not say "no extremum"; it says the test cannot decide.
**Argue directly from the function instead.** Any real number raised to the power $4$ is zero or positive:

$$
x^4 \ge 0
\quad\text{and}\quad
y^4 \ge 0
\qquad\Longrightarrow\qquad
f(x,y) = x^4 + y^4 \;\ge\; 0 \;=\; f(0,0)
\quad\text{for every } (x,y)
$$

So no point anywhere has a smaller value than $(0,0)$.

| Point | $f_{xx}$ | $f_{yy}$ | $f_{xy}$ | $D$ | Type |
| :--- | :--- | :--- | :--- | :--- | :--- |
| $(0,0)$ | $0$ | $0$ | $0$ | $0$ | test inconclusive; minimum by direct argument |

#### 5. Values And Conclusion

**Hence:** the $D$ test gives no conclusion at $(0,0)$, but since $f(x,y) \ge 0 = f(0,0)$ everywhere, $(0,0)$ is a local minimum (in fact a global minimum) with $f = 0$.

---

## 4. Practice Questions — Critical Points

> Marks shown are my estimate of exam weight, not official.

**Q1. (5 marks)**
$$
f(x,y) = x^3 + y^3 - 3x - 12y + 20
$$
Find all critical points and classify each one.
*Hint: each equation contains only one variable, as in Example A5.*

**Q2. (6 marks)**
$$
f(x,y) = 3xy - x^2 y - x y^2
$$
Find all critical points and classify each one.
*Hint: both equations factor, as in Example A1. Expect four points.*

**Q3. (6 marks)**
$$
f(x,y) = x^3 + 3xy^2 - 15x - 12y
$$
Find all critical points and classify each one.
*Hint: the two equations give $x^2 + y^2 = 5$ and $xy = 2$. Use $(x+y)^2$ and $(x-y)^2$.*

**Q4. (5 marks)**
$$
f(x,y) = x^3 + y^3 - 3xy
$$
Find all critical points and classify each one.
*Hint: substitution route, as in Example A2.*

**Q5. (5 marks)**
$$
f(x,y) = 4xy - x^4 - y^4
$$
Find all critical points and classify each one.
*Hint: same shape as Example A2 with the signs flipped, so expect the opposite classifications.*

---

## 5. Solved Examples — First-Order Taylor Series

> Follow the matching fixed routine above.

### Example B1 — polynomial

**Given** $f(x,y) = x^3 + xy - y^2$ at $(x_0,y_0) = (1,2)$.

**AIM:** (a) Write the first-order Taylor series at $(1,2)$. (b) Estimate $f(1.1,\,1.9)$.

#### 1. Function And Value

**Put $x = 1$ and $y = 2$ into $f$ itself:**

$$
f(1,2) = (1)^3 + (1)(2) - (2)^2 = 1 + 2 - 4 = -1
$$

#### 2. Derivatives At The Point

**$f_x$: differentiate term by term with $y$ frozen** (so $y$ and $y^2$ behave like numbers):

$$
\begin{aligned}
f_x &= \frac{\partial}{\partial x}\left(x^3\right)
     + \frac{\partial}{\partial x}\left(xy\right)
     - \frac{\partial}{\partial x}\left(y^2\right)\\
    &= 3x^2 + y - 0\\
    &= 3x^2 + y
\end{aligned}
$$

In the middle term, $xy$ is (frozen number $y$) times $x$, so its derivative is $y$.
**$f_y$: differentiate term by term with $x$ frozen:**

$$
\begin{aligned}
f_y &= \frac{\partial}{\partial y}\left(x^3\right)
     + \frac{\partial}{\partial y}\left(xy\right)
     - \frac{\partial}{\partial y}\left(y^2\right)\\
    &= 0 + x - 2y\\
    &= x - 2y
\end{aligned}
$$

**Put $x=1,\,y=2$ into $f_x$:**

$$
f_x(1,2) = 3(1)^2 + 2 = 3 + 2 = 5
$$

**Put $x=1,\,y=2$ into $f_y$:**

$$
f_y(1,2) = (1) - 2(2) = 1 - 4 = -3
$$

#### 3. Taylor Formula

**Start from the general formula, then insert the three numbers:**

$$
\begin{aligned}
f(x,y) &\approx f(x_0,y_0) + f_x(x_0,y_0)(x - x_0) + f_y(x_0,y_0)(y - y_0) &&\text{(formula 1.5)}\\
       &\approx \underbrace{(-1)}_{\text{Step 1}} + \underbrace{5}_{\text{Step 2}}(x-1) + \underbrace{(-3)}_{\text{Step 2}}(y-2)\\
       &\approx -1 + 5(x-1) - 3(y-2)
\end{aligned}
$$

#### 4. Estimate

**How far is the new point from $(1,2)$?**

$$
x - x_0 = 1.1 - 1 = 0.1,
\qquad
y - y_0 = 1.9 - 2 = -0.1
$$

**Put those two numbers into the series from Step 3:**

$$
\begin{aligned}
f(1.1,\,1.9) &\approx -1 + 5(0.1) - 3(-0.1)\\
             &\approx -1 + 0.5 + 0.3\\
             &\approx -0.2
\end{aligned}
$$

Watch the double minus: $-3 \times (-0.1) = +0.3$.

#### 5. Check And Conclusion

**Compute $f$ exactly at $(1.1,1.9)$:**

$$
f(1.1,1.9) = (1.1)^3 + (1.1)(1.9) - (1.9)^2 = 1.331 + 2.09 - 3.61 = -0.189
$$

**Compare:** the estimate $-0.2$ differs by $0.011$. ✓

---

### Example B2 — square root, chain rule

**Given** $f(x,y) = \sqrt{x^2 + y^2}$ at $(x_0,y_0) = (3,4)$.

**AIM:** (a) Write the first-order Taylor series at $(3,4)$. (b) Estimate $f(3.02,\,3.97)$.

#### 1. Function And Value

**Put $x = 3$ and $y = 4$ into $f$:**

$$
f(3,4) = \sqrt{3^2 + 4^2} = \sqrt{9 + 16} = \sqrt{25} = 5
$$

#### 2. Derivatives At The Point

**Name the inside part and the outside part.** The function is a square root with an expression inside it:

$$
u = x^2 + y^2 \quad (\text{inside part}),
\qquad
f = \sqrt{u} \quad (\text{outside part})
$$

**Write the square root as a power,** so the power rule can be used:

$$
\sqrt{u} = u^{1/2}
$$

**Differentiate the outside part with respect to $u$:**

$$
\frac{d}{du}\left(u^{1/2}\right)
= \tfrac{1}{2}\,u^{\frac12 - 1}
= \tfrac{1}{2}\,u^{-\frac12}
= \frac{1}{2\sqrt{u}}
$$

**Differentiate the inside part with respect to $x$** (here $y$ is frozen, so $y^2$ is a constant):

$$
\frac{\partial u}{\partial x}
= \frac{\partial}{\partial x}\left(x^2\right) + \frac{\partial}{\partial x}\left(y^2\right)
= 2x + 0
= 2x
$$

**Chain rule: multiply the result of 2c by the result of 2d:**

$$
f_x
= \underbrace{\frac{1}{2\sqrt{u}}}_{\text{from 2c}} \cdot \underbrace{2x}_{\text{from 2d}}
= \frac{2x}{2\sqrt{x^2+y^2}}
= \frac{x}{\sqrt{x^2+y^2}}
\qquad \text{(the 2s cancel)}
$$

**Repeat for $y$.** Only the inside derivative changes, because now $x$ is frozen:

$$
\frac{\partial u}{\partial y} = 0 + 2y = 2y
\qquad\Longrightarrow\qquad
f_y = \frac{1}{2\sqrt{u}} \cdot 2y = \frac{y}{\sqrt{x^2+y^2}}
$$

**Put $x=3,\,y=4$ into $f_x$.** The denominator is the square root already computed in Step 1:

$$
f_x(3,4) = \frac{3}{\sqrt{3^2 + 4^2}} = \frac{3}{\sqrt{25}} = \frac{3}{5} = 0.6
$$

**Put $x=3,\,y=4$ into $f_y$:**

$$
f_y(3,4) = \frac{4}{\sqrt{3^2 + 4^2}} = \frac{4}{\sqrt{25}} = \frac{4}{5} = 0.8
$$

#### 3. Taylor Formula

**Start from the general formula, then insert the three numbers:**

$$
\begin{aligned}
f(x,y) &\approx f(x_0,y_0) + f_x(x_0,y_0)(x - x_0) + f_y(x_0,y_0)(y - y_0) &&\text{(formula 1.5)}\\
       &\approx \underbrace{5}_{\text{Step 1}} + \underbrace{0.6}_{\text{Step 2}}(x - 3) + \underbrace{0.8}_{\text{Step 2}}(y - 4)
\end{aligned}
$$

#### 4. Estimate

**How far is the new point from $(3,4)$?**

$$
x - x_0 = 3.02 - 3 = 0.02,
\qquad
y - y_0 = 3.97 - 4 = -0.03 \quad (\text{negative: } y \text{ went down})
$$

**Put those two numbers into the series:**

$$
\begin{aligned}
f(3.02,\,3.97)
&\approx 5 + 0.6\,(0.02) + 0.8\,(-0.03)\\
&\approx 5 + 0.012 - 0.024\\
&\approx 4.988
\end{aligned}
$$

#### 5. Check And Conclusion

**Square each coordinate and add:**

$$
3.02^2 = 9.1204,
\qquad
3.97^2 = 15.7609,
\qquad
9.1204 + 15.7609 = 24.8813
$$

**Take the square root and compare:**

$$
\sqrt{24.8813} \approx 4.98812
\qquad\Longrightarrow\qquad
\text{error} \approx 0.00012 \;\; ✓
$$

---

### Example B3 — exponential

**Given** $f(x,y) = x\,e^{y}$ at $(x_0,y_0) = (2,0)$.

**AIM:** (a) Write the first-order Taylor series at $(2,0)$. (b) Estimate $f(2.1,\,-0.1)$.

#### 1. Function And Value

**Put $x = 2$ and $y = 0$ into $f$, using $e^{0} = 1$:**

$$
f(2,0) = 2 \cdot e^{0} = 2 \cdot 1 = 2
$$

#### 2. Derivatives At The Point

**$f_x$ with $y$ frozen.** Then $e^{y}$ is a fixed number multiplying $x$:

$$
f_x = \frac{\partial}{\partial x}\Big(\underbrace{e^{y}}_{\text{constant}} \cdot x\Big)
    = e^{y} \cdot \frac{\partial}{\partial x}(x)
    = e^{y} \cdot 1
    = e^{y}
$$

**$f_y$ with $x$ frozen.** Now $x$ is the fixed number and $e^{y}$ is the moving part, and $\dfrac{d}{dy}\left(e^{y}\right) = e^{y}$:

$$
f_y = \frac{\partial}{\partial y}\Big(\underbrace{x}_{\text{constant}} \cdot e^{y}\Big)
    = x \cdot \frac{\partial}{\partial y}\left(e^{y}\right)
    = x\,e^{y}
$$

**Into $f_x$, using $e^{0} = 1$:**

$$
f_x(2,0) = e^{0} = 1
$$

**Into $f_y$:**

$$
f_y(2,0) = 2 \cdot e^{0} = 2 \cdot 1 = 2
$$

#### 3. Taylor Formula

**General formula, then the three numbers:**

$$
\begin{aligned}
f(x,y) &\approx f(x_0,y_0) + f_x(x_0,y_0)(x - x_0) + f_y(x_0,y_0)(y - y_0) &&\text{(formula 1.5)}\\
       &\approx 2 + 1\,(x - 2) + 2\,(y - 0)\\
       &\approx 2 + (x - 2) + 2y
\end{aligned}
$$

#### 4. Estimate

**Distances from the point $(2,0)$:**

$$
x - x_0 = 2.1 - 2 = 0.1,
\qquad
y - y_0 = -0.1 - 0 = -0.1
$$

**Put them into the series:**

$$
\begin{aligned}
f(2.1,\,-0.1) &\approx 2 + 1(0.1) + 2(-0.1)\\
              &\approx 2 + 0.1 - 0.2\\
              &\approx 1.9
\end{aligned}
$$

#### 5. Check And Conclusion

**Exact value:**

$$
f(2.1,\,-0.1) = 2.1\,e^{-0.1} = 2.1 \times 0.90484 \approx 1.90016
$$

**Compare:** the estimate $1.9$ is correct to three decimal places. ✓

---

### Example B4 — logarithm, chain rule

**Given** $f(x,y) = \ln(x + 2y)$ at $(x_0,y_0) = (3,-1)$.

**AIM:** (a) Write the first-order Taylor series at $(3,-1)$. (b) Estimate $f(3.05,\,-0.98)$.

#### 1. Function And Value

**Name the inside part and evaluate it at the point:**

$$
u = x + 2y
\qquad\Longrightarrow\qquad
u(3,-1) = 3 + 2(-1) = 3 - 2 = 1
$$

**Then the constant term is:**

$$
f(3,-1) = \ln(1) = 0
$$

#### 2. Derivatives At The Point

**Differentiate the outside part.** For $f = \ln u$:

$$
\frac{d}{du}\left(\ln u\right) = \frac{1}{u}
$$

**Differentiate the inside part with respect to $x$** ($y$ frozen, so $2y$ is a constant):

$$
\frac{\partial u}{\partial x} = \frac{\partial}{\partial x}(x) + \frac{\partial}{\partial x}(2y) = 1 + 0 = 1
$$

**Chain rule for $f_x$:**

$$
f_x = \frac{1}{u} \cdot 1 = \frac{1}{x + 2y}
$$

**Differentiate the inside part with respect to $y$** ($x$ frozen):

$$
\frac{\partial u}{\partial y} = 0 + 2 = 2
$$

**Chain rule for $f_y$:**

$$
f_y = \frac{1}{u} \cdot 2 = \frac{2}{x + 2y}
$$

**Into $f_x$,** where $u = 1$ from Step 1:

$$
f_x(3,-1) = \frac{1}{3 + 2(-1)} = \frac{1}{1} = 1
$$

**Into $f_y$:**

$$
f_y(3,-1) = \frac{2}{3 + 2(-1)} = \frac{2}{1} = 2
$$

#### 3. Taylor Formula

**General formula, then the three numbers.** Note that $y_0 = -1$, so $y - y_0 = y - (-1) = y + 1$:

$$
\begin{aligned}
f(x,y) &\approx f(x_0,y_0) + f_x(x_0,y_0)(x - x_0) + f_y(x_0,y_0)(y - y_0) &&\text{(formula 1.5)}\\
       &\approx 0 + 1\,(x - 3) + 2\,\big(y - (-1)\big)\\
       &\approx (x - 3) + 2(y + 1)
\end{aligned}
$$

#### 4. Estimate

**Distances from the point $(3,-1)$:**

$$
x - x_0 = 3.05 - 3 = 0.05,
\qquad
y - y_0 = -0.98 - (-1) = -0.98 + 1 = 0.02
$$

The second one is positive: $-0.98$ is above $-1$.
**Put them into the series:**

$$
\begin{aligned}
f(3.05,\,-0.98) &\approx 0.05 + 2(0.02)\\
                &\approx 0.05 + 0.04\\
                &\approx 0.09
\end{aligned}
$$

#### 5. Check And Conclusion

**Evaluate the inside part, then the logarithm:**

$$
u = 3.05 + 2(-0.98) = 3.05 - 1.96 = 1.09
\qquad\Longrightarrow\qquad
\ln(1.09) \approx 0.0862
$$

**Compare:** the estimate $0.09$ differs by about $0.004$. ✓

---

### Example B5 — estimating a number

**Given:** estimate $(1.02)^3 \times (1.97)^2$ using a first-order Taylor series.

#### 1. Function And Value

**Turn the number into a function.** The two bases change, so treat them as variables:

$$
f(x,y) = x^3 y^2
$$

**Choose a nearby point with easy arithmetic.** Since $1.02 \approx 1$ and $1.97 \approx 2$:

$$
(x_0,y_0) = (1,2)
$$

**Put $x = 1$ and $y = 2$ into $f$:**

$$
f(1,2) = (1)^3 (2)^2 = 1 \times 4 = 4
$$

#### 2. Derivatives At The Point

**$f_x$ with $y$ frozen,** so $y^2$ is a constant multiplier:

$$
f_x = \frac{\partial}{\partial x}\left(x^3 \cdot \underbrace{y^2}_{\text{constant}}\right)
    = y^2 \cdot 3x^2
    = 3x^2y^2
$$

**$f_y$ with $x$ frozen,** so $x^3$ is a constant multiplier:

$$
f_y = \frac{\partial}{\partial y}\left(\underbrace{x^3}_{\text{constant}} \cdot y^2\right)
    = x^3 \cdot 2y
    = 2x^3y
$$

**Into $f_x$:**

$$
f_x(1,2) = 3(1)^2(2)^2 = 3 \times 1 \times 4 = 12
$$

**Into $f_y$:**

$$
f_y(1,2) = 2(1)^3(2) = 2 \times 1 \times 2 = 4
$$

#### 3. Taylor Formula

**General formula, then the three numbers:**

$$
\begin{aligned}
f(x,y) &\approx f(x_0,y_0) + f_x(x_0,y_0)(x - x_0) + f_y(x_0,y_0)(y - y_0) &&\text{(formula 1.5)}\\
       &\approx 4 + 12\,(x - 1) + 4\,(y - 2)
\end{aligned}
$$

#### 4. Estimate

**Distances from $(1,2)$:**

$$
x - x_0 = 1.02 - 1 = 0.02,
\qquad
y - y_0 = 1.97 - 2 = -0.03
$$

**Put them into the series:**

$$
\begin{aligned}
(1.02)^3 (1.97)^2 &\approx 4 + 12(0.02) + 4(-0.03)\\
                  &\approx 4 + 0.24 - 0.12\\
                  &\approx 4.12
\end{aligned}
$$

#### 5. Check And Conclusion

**Exact arithmetic:**

$$
(1.02)^3 = 1.061208,
\qquad
(1.97)^2 = 3.8809,
\qquad
1.061208 \times 3.8809 \approx 4.1184
$$

**Compare:** the estimate $4.12$ is accurate to two decimal places. ✓

---

## 6. Practice Questions — First-Order Taylor Series

**Q6. (3 marks)**
$$
f(x,y) = x^2 + 2xy + y^3 \qquad \text{at} \qquad (x_0,y_0) = (1,\,2)
$$
Write the first-order Taylor series.
*This is the lecture's own example on slide 14, so do the full working and then match the slide.*

**Q7. (4 marks)**
$$
f(x,y) = y\,e^{x} \qquad \text{at} \qquad (x_0,y_0) = (0,\,3)
$$
(a) Write the first-order Taylor series. (b) Estimate $f(0.1,\,2.9)$.
*Hint: same shape as Example B3, with the roles of $x$ and $y$ swapped.*

**Q8. (4 marks)**
$$
f(x,y) = \ln\!\left(x^2 + y\right) \qquad \text{at} \qquad (x_0,y_0) = (1,\,0)
$$
(a) Write the first-order Taylor series. (b) Estimate $f(1.05,\,0.02)$.
*Hint: chain rule with $u = x^2 + y$, as in Example B4.*

**Q9. (5 marks)**
Use a first-order Taylor series to estimate
$$
(1.01)^4 \times (2.02)^3
$$
*Hint: follow Example B5 with $f(x,y) = x^4y^3$ about $(1,2)$.*

**Q10. (4 marks)**
$$
f(x,y) = \frac{x}{y} \qquad \text{at} \qquad (x_0,y_0) = (2,\,1)
$$
(a) Write the first-order Taylor series. (b) Estimate $f(2.1,\,0.98)$.
*Hint: write $\dfrac{x}{y} = x\,y^{-1}$, then use the power rule for $f_y$.*

---

## 7. Practice Questions — Short Theory (2 marks each)

**Q11.** Define a critical point of $f:\mathbb{R}^n \to \mathbb{R}$. Must it be a maximum or a minimum?

**Q12.** What is a saddle point? Describe it in one sentence using the shape of the surface.

**Q13.** Why is the Hessian symmetric, and what is its order for $f:\mathbb{R}^n \to \mathbb{R}$?

**Q14.** State the condition under which the second-derivative test gives no conclusion.

**Q15.** In the $D$ test, why do we check the sign of $f_{xx}$ only when $D > 0$?

**Q16.** Explain in plain words what the first-order Taylor series does to the surface $z = f(x,y)$ near $(x_0,y_0)$.

---

## 8. Exam Traps

1. Stopping at one solution when factoring. $x^9 - x = 0$ gives $x = 0, 1, -1$, not just $x = 0$.
2. Dropping a constant in a second derivative, for example writing $f_{xx} = 6y$ instead of $6y - 6$.
3. Deciding maximum or minimum from $D$ alone. $D > 0$ must be paired with the sign of $f_{xx}$.
4. Treating $D = 0$ as "no extremum". It means the test failed, so argue from the function itself, as in Example A5.
5. Leaving $x$ and $y$ inside $f_x$ and $f_y$ in the Taylor formula; substitute the point first.
6. Sign slips in $y - y_0$ when the second coordinate goes down, and in $y - (-1) = y + 1$.
7. Writing a table whose own numbers do not satisfy $D = f_{xx}f_{yy} - (f_{xy})^2$.

---

**Recall chain:** $\nabla f = 0$ → list points → Hessian → $D$ and $f_{xx}$ at each point → Hence

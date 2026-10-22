# Lecture 6 - Exam Practice

**Topics:** Derivatives, Taylor Series, Partial Derivatives, Chain Rule, Jacobian

**Course:** DSEZC411 Essential Mathematics for Data Science

**Source:** `Maths/Class material/Lecture_6.pdf`, Webinar 2

**Status:** practice for the midterm. These are predictions, not guaranteed exam questions.

### Fixed Notation
| Write | Meaning |
| :--- | :--- |
| $h$ | Small increment in the limit definition |
| $x_0,T_n$ | Expansion centre; degree-n Taylor polynomial |
| $f_x,f_y$ | Partial derivatives |
| $\nabla f,J$ | Gradient; Jacobian |
| $t$ or $(s,t)$ | Parameters in the chain rule |

**Same notation throughout:** $f'(x)=df/dx$; $f_x=\partial f/\partial x$.

**Angles:** use radians. $f^{(k)}$ means the $k$-th derivative, not the $k$-th power.

> **Exam layout:** Given → AIM → numbered working → check → conclusion.
> Keep the same letters within each question type; standard topic symbols stay unchanged.

**Sections:** Formula sheet | Fixed routines | Solved examples | Practice questions.

---

## 1. Formula Sheet

### 1.1 Derivative from first principles

A derivative measures slope. First principles compares $f(x+h)$ with $f(x)$.

$$
\frac{df}{dx} \;=\; \lim_{h\to 0} \frac{f(x + h) - f(x)}{h}
$$

$h$ is the input change. Keep $h\ne0$ while simplifying; take the limit afterward.

### 1.2 Differentiation rules

Use the rule matching the expression. A constant stays fixed while differentiating.

| Expression | Derivative with respect to $x$ |
| :--- | :--- |
| Constant $c$ | $0$ |
| $x$ | $1$ |
| $x^n$ | $nx^{n-1}$ |
| $e^x$ | $e^x$ |
| $\ln x$, $x>0$ | $1/x$ |
| $\sin x$ | $\cos x$ |
| $\cos x$ | $-\sin x$ |

$$
\begin{aligned}
\text{Sum:}\quad & \big(f + g\big)' = f' + g'\\
\text{Product:}\quad & \big(f g\big)' = f'g + f g'\\
\text{Quotient:}\quad & \left(\frac{f}{g}\right)' = \frac{f'g - f g'}{g^2}\\
\text{Chain:}\quad & \big(g(f(x))\big)' = g'\big(f(x)\big)\cdot f'(x)
\end{aligned}
$$

**Chain rule:** differentiate the outside, then multiply by the inside derivative.

### 1.3 Taylor polynomial and Taylor series (one variable)

Taylor uses derivatives at a known point $x_0$ to approximate nearby values.

The first terms are:

$$
\begin{aligned}
T_n(x)
&=f(x_0)+\frac{f'(x_0)}{1!}(x-x_0)\\
&\quad+\frac{f''(x_0)}{2!}(x-x_0)^2
 +\frac{f'''(x_0)}{3!}(x-x_0)^3+\cdots.
\end{aligned}
$$

Stop at power $n$ for $T_n$. The compact formulas are:

$$
\begin{aligned}
T_n(x)&=\sum_{k=0}^{n}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k,\\
T_\infty(x)&=\sum_{k=0}^{\infty}\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k.
\end{aligned}
$$

Here $\sum$ means add the terms; $f^{(0)}=f$.

**Factorial:** $k!=k(k-1)\cdots1$ for $k\ge1$, and $0!=1$.

$$
0!=1,\quad1!=1,\quad2!=2,\quad3!=6,\quad4!=24,\quad5!=120,\quad6!=720.
$$

All factorials are positive. A negative coefficient comes from a negative derivative value.

Standard series at $x_0 = 0$:

$$
\begin{aligned}
e^x&=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots,\\
\sin x&=x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots,\\
\cos x&=1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots.
\end{aligned}
$$

### 1.4 Partial derivatives and the gradient

For $f : \mathbb{R}^n \to \mathbb{R}$, vary one variable and **freeze** the rest:

**Freeze** means treat the other variables as constants, not as zero.

For example, $\partial(xy)/\partial x=y$, but $\partial(xy)/\partial y=x$.

$$
\frac{\partial f}{\partial x_1} = \lim_{h\to0}\frac{f(x_1 + h, x_2,\dots,x_n) - f(x_1,\dots,x_n)}{h}
$$

The gradient (lecture convention) is the **row vector** of all partial derivatives:

$$
\nabla_x f = \frac{df}{dx} = \left[\; \frac{\partial f}{\partial x_1} \;\; \frac{\partial f}{\partial x_2} \;\; \cdots \;\; \frac{\partial f}{\partial x_n} \;\right] \in \mathbb{R}^{1\times n}
$$

### 1.5 Multivariate chain rule

If $f(x_1,x_2)$ with $x_1(t)$ and $x_2(t)$:

$$
\frac{df}{dt} = \frac{\partial f}{\partial x_1}\frac{dx_1}{dt} + \frac{\partial f}{\partial x_2}\frac{dx_2}{dt}
$$

If $x_1(s,t)$ and $x_2(s,t)$, in matrix form:

$$
\def\arraystretch{2.2}
\frac{df}{d(s,t)} =
\underbrace{\begin{bmatrix} \dfrac{\partial f}{\partial x_1} & \dfrac{\partial f}{\partial x_2}\end{bmatrix}}_{1\times 2}
\underbrace{\begin{bmatrix}
\dfrac{\partial x_1}{\partial s} & \dfrac{\partial x_1}{\partial t}\\
\dfrac{\partial x_2}{\partial s} & \dfrac{\partial x_2}{\partial t}
\end{bmatrix}}_{2\times 2}
$$

### 1.6 Jacobian of a vector-valued function

For $f : \mathbb{R}^n \to \mathbb{R}^m$ with components $f_1,\dots,f_m$:

$$
\def\arraystretch{2.2}
J = \frac{df}{dx} =
\begin{bmatrix}
\dfrac{\partial f_1}{\partial x_1} & \cdots & \dfrac{\partial f_1}{\partial x_n}\\
\vdots & & \vdots\\
\dfrac{\partial f_m}{\partial x_1} & \cdots & \dfrac{\partial f_m}{\partial x_n}
\end{bmatrix}
\in \mathbb{R}^{m\times n}
$$

Row $i$ is the gradient of $f_i$; column $j$ belongs to input $x_j$. Special case: if $f(x) = Ax$ then $\dfrac{df}{dx} = A$.

---

## 2. Fixed Exam Routines

> Use the same headings for the same question type. Show substitutions before simplifying.

### Routine A - Derivative from first principles
Step | Write
--- | ---
1 | **Definition**
2 | **Difference Quotient**
3 | **Limit**
4 | **Check**
5 | **Conclusion**

### Routine B - Taylor polynomial of degree $n$ at $x_0$
Step | Write
--- | ---
1 | **Derivatives At The Centre**
2 | **Coefficients**
3 | **Taylor Polynomial**
4 | **Check And Approximate**
5 | **Conclusion**

### Routine C - Partial derivatives and gradient
Step | Write
--- | ---
1 | **Setting Up**
2 | **Partial Derivatives**
3 | **Gradient And Evaluation**
4 | **Check**
5 | **Conclusion**

### Routine D - Multivariate chain rule
Step | Write
--- | ---
1 | **Chain Rule**
2 | **Outer And Inner Derivatives**
3 | **Multiply And Substitute**
4 | **Check**
5 | **Conclusion**

### Routine E - Jacobian
Step | Write
--- | ---
1 | **Size**
2 | **Partial Derivatives**
3 | **Jacobian**
4 | **Evaluate Or Check**
5 | **Conclusion**

> **Order:** Differentiate first, substitute second, simplify third. For limits, cancel valid factors before $h\to0$.
---

## 3. Solved Examples — Derivative from First Principles

> Follow the matching fixed routine above.

### Example A1 — a cube

**Given** $f(x) = x^3$.

**AIM:** Find $\dfrac{df}{dx}$ from the limit definition.

#### 1. Definition

$$
\frac{df}{dx} = \lim_{h\to0}\frac{(x+h)^3 - x^3}{h}
$$

#### 2. Difference Quotient

Replace every $x$ by $x+h$, then expand:

$$
\begin{aligned}
f(x+h)&=(x+h)^3\\
	&=(x^2+2xh+h^2)(x+h)\\
	&=x^3+x^2h+2x^2h+2xh^2+xh^2+h^3\\
	&=x^3+3x^2h+3xh^2+h^3.
\end{aligned}
$$

Subtract $f(x)=x^3$:

$$
\begin{aligned}
f(x+h)-f(x)
&=x^3+3x^2h+3xh^2+h^3-x^3\\
&=3x^2h+3xh^2+h^3\\
&=h(3x^2+3xh+h^2).
\end{aligned}
$$

Cancel the common factor $h$, since $h\ne0$:

$$
\frac{f(x+h)-f(x)}h
=\frac{h(3x^2+3xh+h^2)}h
=3x^2+3xh+h^2.
$$

#### 3. Limit

$$
\begin{aligned}
f'(x)&=\lim_{h\to0}(3x^2+3xh+h^2)\\
	&=3x^2+3x(0)+0^2\\
	&=3x^2.
\end{aligned}
$$

#### 4. Check

**Power rule** with $n = 3$: $3x^{2}$ ✓

#### 5. Conclusion

**Hence** $\dfrac{d}{dx}x^3 = 3x^2$. The lecture proves $\dfrac{d}{dx}x^n = nx^{n-1}$ the same way with the binomial theorem.

---

### Example A2 — a reciprocal (common denominator)

**Given** $f(x) = \dfrac1x$, $x \ne 0$.

**AIM:** Find $\dfrac{df}{dx}$ from the limit definition.

#### 1. Definition

$$
\frac{df}{dx} = \lim_{h\to0}\frac{\frac{1}{x+h} - \frac1x}{h}
$$

#### 2. Difference Quotient

$$
f(x + h) = \frac{1}{x + h}
$$

Use the common denominator $x(x+h)$; keep $x+h\ne0$.

$$
\begin{aligned}
f(x+h)-f(x)
&=\frac1{x+h}-\frac1x\\
&=\frac{x}{x(x+h)}-\frac{x+h}{x(x+h)}\\
&=\frac{x-(x+h)}{x(x+h)}\\
&=\frac{x-x-h}{x(x+h)}\\
&=\frac{-h}{x(x+h)}.
\end{aligned}
$$

The minus sign applies to both terms inside $(x+h)$.

$$
\begin{aligned}
\frac{f(x+h)-f(x)}h
&=\frac{-h}{x(x+h)}\cdot\frac1h\\
&=\frac{-h}{h\,x(x+h)}\\
&=-\frac1{x(x+h)}\qquad(h\ne0).
\end{aligned}
$$

#### 3. Limit

$$
\lim_{h\to0}\frac{-1}{x(x+h)} = \frac{-1}{x\cdot x} = -\frac{1}{x^2}
$$

#### 4. Check

**Power rule** on $x^{-1}$: $-1\cdot x^{-2} = -\dfrac{1}{x^2}$ ✓

#### 5. Conclusion

**Hence** $\dfrac{d}{dx}\dfrac1x = -\dfrac{1}{x^2}$.

---

### Example A3 — a square root (conjugate)

**Given** $f(x) = \sqrt x$, $x > 0$.

**AIM:** Find $\dfrac{df}{dx}$ from the limit definition.

#### 1. Definition

$$
\frac{df}{dx} = \lim_{h\to0}\frac{\sqrt{x+h} - \sqrt x}{h}
$$

#### 2. Difference Quotient

$$
f(x + h) = \sqrt{x + h}
$$

The **conjugate** changes subtraction to addition: $\sqrt{x+h}+\sqrt x$.

Multiply top and bottom by it; this multiplies the fraction by $1$.

Use $(a-b)(a+b)=a^2-b^2$:

$$
\begin{aligned}
\frac{f(x+h)-f(x)}h
&=\frac{\sqrt{x+h}-\sqrt x}{h}
	\frac{\sqrt{x+h}+\sqrt x}{\sqrt{x+h}+\sqrt x}\\
&=\frac{(\sqrt{x+h})^2-(\sqrt x)^2}
				{h(\sqrt{x+h}+\sqrt x)}\\
&=\frac{x+h-x}{h(\sqrt{x+h}+\sqrt x)}\\
&=\frac{h}{h(\sqrt{x+h}+\sqrt x)}\\
&=\frac1{\sqrt{x+h}+\sqrt x}\qquad(h\ne0).
\end{aligned}
$$

#### 3. Limit

$$
\begin{aligned}
f'(x)&=\lim_{h\to0}\frac1{\sqrt{x+h}+\sqrt x}\\
	&=\frac1{\sqrt{x+0}+\sqrt x}\\
	&=\frac1{2\sqrt x}.
\end{aligned}
$$

#### 4. Check

**Power rule** on $x^{1/2}$: $\tfrac12 x^{-1/2} = \dfrac{1}{2\sqrt x}$ ✓

#### 5. Conclusion

**Hence** $\dfrac{d}{dx}\sqrt x = \dfrac{1}{2\sqrt x}$.

---

## 4. Practice Questions — First Principles

> Marks shown are my estimate of exam weight, not official.

**Q1. (3 marks)** Using the limit definition, find the derivative of $f(x) = x^2 + 5x$.
*Hint: as in Example A1; the $x^2$ and $5x$ terms both cancel in Step 2.*

**Q2. (4 marks)** Using the limit definition, find the derivative of $f(x) = \dfrac{1}{x^2}$.
*Hint: common denominator, as in Example A2. Expand $(x+h)^2$ in the top.*

---

## 5. Solved Examples — Taylor Polynomial and Series

> Follow the matching fixed routine above.

### Example B1 — the lecture's example, corrected

**Given** $f(x) = x^4$, $x_0 = 1$.

**AIM:** Find $T_6(x)$.

#### 1. Derivatives At The Centre

$$
\begin{aligned}
f(x)&=x^4,\\
f'(x)&=4x^3,\\
f''(x)&=4(3x^2)=12x^2,\\
f'''(x)&=12(2x)=24x,\\
f^{(4)}(x)&=24(1)=24,\\
f^{(5)}(x)&=0,\qquad f^{(6)}(x)=0.
\end{aligned}
$$

Substitute $x_0=1$ into each derivative. The derivative of constant $24$ is zero.

| $k$ | $f^{(k)}(x)$ | $f^{(k)}(1)$ | $k!$ | $\dfrac{f^{(k)}(1)}{k!}$ |
| :--- | :--- | :--- | :--- | :--- |
| 0 | $x^4$ | $1$ | $1$ | $1$ |
| 1 | $4x^3$ | $4$ | $1$ | $4$ |
| 2 | $12x^2$ | $12$ | $2$ | $6$ |
| 3 | $24x$ | $24$ | $6$ | $4$ |
| 4 | $24$ | $24$ | $24$ | $1$ |
| 5, 6 | $0$ | $0$ | — | $0$ |

#### 2. Coefficients

Divide each derivative value by its factorial:

$$
\begin{aligned}
\frac{f(1)}{0!}&=\frac11=1,\qquad
\frac{f'(1)}{1!}=\frac41=4,\\
\frac{f''(1)}{2!}&=\frac{12}{2}=6,\qquad
\frac{f'''(1)}{3!}=\frac{24}{6}=4,\\
\frac{f^{(4)}(1)}{4!}&=\frac{24}{24}=1,\qquad
\frac{f^{(5)}(1)}{5!}=\frac0{120}=0,\qquad
\frac{f^{(6)}(1)}{6!}=\frac0{720}=0.
\end{aligned}
$$

#### 3. Taylor Polynomial

$$
\begin{aligned}
T_6(x)
&=\frac1{0!}+\frac4{1!}(x-1)+\frac{12}{2!}(x-1)^2\\
&\quad+\frac{24}{3!}(x-1)^3+\frac{24}{4!}(x-1)^4
 +\frac0{5!}(x-1)^5+\frac0{6!}(x-1)^6\\
&=1+4(x-1)+6(x-1)^2+4(x-1)^3+(x-1)^4.
\end{aligned}
$$

#### 4. Check And Approximate

at $x = 1$ every bracket is $0$, so $T_6(1) = 1 = f(1)$ ✓

**At $x = 2$ every bracket is $1$:**

$$
T_6(2) = 1 + 4 + 6 + 4 + 1 = 16 = 2^4 \;✓
$$

**Why exact:** $f$ is a degree-4 polynomial, so all higher derivatives vanish and the Taylor polynomial reproduces $f$.

#### 5. Conclusion

**Hence** $T_6(x) = 1 + 4(x-1) + 6(x-1)^2 + 4(x-1)^3 + (x-1)^4$.

**Warning:** slide 6 prints $12(x-1)^2 + 24(x-1)^3 + 24(x-1)^4$, which skips the division by $k!$. At $x = 2$ that gives $65 \ne 16$.

---

### Example B2 — a Taylor series (the lecture's example)

**Given** $f(x) = \sin x + \cos x$, $x_0 = 0$.

**AIM:** Find the Taylor series and identify it.

#### 1. Derivatives At The Centre

Use $(\sin x)'=\cos x$ and $(\cos x)'=-\sin x$.

$$
\begin{aligned}
f(x)&=\sin x+\cos x,\\
f'(x)&=\cos x+(-\sin x)=\cos x-\sin x,\\
f''(x)&=-\sin x-\cos x,\\
f'''(x)&=-\cos x-(-\sin x)=-\cos x+\sin x,\\
f^{(4)}(x)&=\sin x+\cos x,\\
f^{(5)}(x)&=\cos x-\sin x.
\end{aligned}
$$

The fourth derivative returns to $f(x)$, so the pattern repeats every four derivatives.

Now substitute $x_0=0$. Use $\sin0=0$ and $\cos0=1$.

| Derivative | Substitute zero | Value |
| :--- | :--- | :--- |
| $f(0)$ | $0+1$ | $1$ |
| $f'(0)$ | $1-0$ | $1$ |
| $f''(0)$ | $-0-1$ | $-1$ |
| $f'''(0)$ | $-1+0$ | $-1$ |
| $f^{(4)}(0)$ | $0+1$ | $1$ |
| $f^{(5)}(0)$ | $1-0$ | $1$ |

#### 2. Coefficients

Each coefficient is the derivative's value divided by its factorial.

| Term | Calculation | Coefficient |
| :--- | :--- | :--- |
| Constant | $f(0)/0!=1/1$ | $1$ |
| $x$ | $f'(0)/1!=1/1$ | $1$ |
| $x^2$ | $f''(0)/2!=-1/2$ | $-1/2$ |
| $x^3$ | $f'''(0)/3!=-1/6$ | $-1/6$ |
| $x^4$ | $f^{(4)}(0)/4!=1/24$ | $1/24$ |
| $x^5$ | $f^{(5)}(0)/5!=1/120$ | $1/120$ |

The minus signs come from $f''(0)=f'''(0)=-1$, not from the factorials.

#### 3. Taylor Polynomial

Since $x_0=0$, every $(x-x_0)^k$ becomes $x^k$.

$$
\begin{aligned}
T_\infty(x)
&=f(0)+f'(0)x+\frac{f''(0)}{2!}x^2+\frac{f'''(0)}{3!}x^3+\cdots\\
&=1+(1)x+\frac{-1}{2!}x^2+\frac{-1}{3!}x^3
	+\frac{1}{4!}x^4+\frac{1}{5!}x^5-\cdots\\
&=1+x-\frac{x^2}{2!}-\frac{x^3}{3!}
	+\frac{x^4}{4!}+\frac{x^5}{5!}-\cdots.
\end{aligned}
$$

Here $T_\infty$ is the infinite series; stopping at a finite power gives a Taylor polynomial.

**Split even and odd powers:**

$$
\underbrace{1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \cdots}_{\cos x}
\;+\;
\underbrace{x - \frac{x^3}{3!} + \frac{x^5}{5!} - \cdots}_{\sin x}
$$

#### 4. Check And Approximate

$T_\infty(0) = 1 = \sin 0 + \cos 0$ ✓

For an approximation at $x=0.1$, keep terms through $x^3$:

$$
\begin{aligned}
T_3(0.1)
&=1+0.1-\frac{(0.1)^2}{2}-\frac{(0.1)^3}{6}\\
&=1+0.1-\frac{0.01}{2}-\frac{0.001}{6}\\
&\approx1+0.1-0.005-0.000166667\\
&\approx1.094833333.
\end{aligned}
$$

$$
f(0.1)=\sin0.1+\cos0.1\approx1.094837582.
$$

#### 5. Conclusion

**Hence** the Taylor series of $\sin x + \cos x$ at $0$ is the $\cos$ series plus the $\sin$ series, as expected.

---

### Example B3 — approximating a square root

**Given** $f(x) = \sqrt x$, $x_0 = 4$.

**AIM:** Find $T_2(x)$ and use it to approximate $\sqrt{4.1}$.

#### 1. Derivatives At The Centre

$$
\begin{aligned}
f(x)&=x^{1/2},\\
f'(x)&=\tfrac12x^{1/2-1}=\tfrac12x^{-1/2},\\
f''(x)&=\tfrac12(-\tfrac12)x^{-1/2-1}
	=-\tfrac14x^{-3/2}.
\end{aligned}
$$

Negative powers mean reciprocals: $4^{-1/2}=1/2$, and $4^{-3/2}=1/(\sqrt4)^3=1/8$.

| $k$ | $f^{(k)}(x)$ | $f^{(k)}(4)$ | $k!$ | coefficient |
| :--- | :--- | :--- | :--- | :--- |
| 0 | $x^{1/2}$ | $2$ | $1$ | $2$ |
| 1 | $\tfrac12 x^{-1/2}$ | $\tfrac12\cdot\tfrac12 = \tfrac14$ | $1$ | $\tfrac14$ |
| 2 | $-\tfrac14 x^{-3/2}$ | $-\tfrac14\cdot\tfrac18 = -\tfrac{1}{32}$ | $2$ | $-\tfrac{1}{64}$ |

#### 2. Coefficients

$$
\begin{aligned}
\frac{f(4)}{0!}&=\frac21=2,\\
\frac{f'(4)}{1!}&=\frac{1/4}{1}=\frac14,\\
\frac{f''(4)}{2!}&=\frac{-1/32}{2}
 =-\frac1{32}\cdot\frac12=-\frac1{64}.
\end{aligned}
$$

#### 3. Taylor Polynomial

$$
\begin{aligned}
T_2(x)&=f(4)+f'(4)(x-4)+\frac{f''(4)}{2!}(x-4)^2\\
	&=2+\frac14(x-4)+\frac{-1/32}{2}(x-4)^2\\
	&=2+\frac14(x-4)-\frac1{64}(x-4)^2.
\end{aligned}
$$

#### 4. Check And Approximate

$T_2(4) = 2 = \sqrt4$ ✓

For $x=4.1$, the change from the centre is $x-4=0.1$.

$$
\begin{aligned}
T_2(4.1)&=2+\frac14(4.1-4)-\frac1{64}(4.1-4)^2\\
	&=2+\frac14(0.1)-\frac1{64}(0.1)^2\\
	&=2+0.025-\frac{0.01}{64}\\
	&=2+0.025-0.00015625\\
	&=2.02484375.
\end{aligned}
$$

True value $\sqrt{4.1}\approx2.0248457$; error about $0.000002$.

#### 5. Conclusion

**Hence** $T_2(x) = 2 + \tfrac14(x-4) - \tfrac{1}{64}(x-4)^2$ and $\sqrt{4.1} \approx 2.02484$.

---

### Example B4 — a logarithm at $0$

**Given** $f(x) = \ln(1 + x)$, $x_0 = 0$.

**AIM:** Find $T_3(x)$ and approximate $\ln 1.1$.

#### 1. Derivatives At The Centre

The inside is $1+x$; its derivative is $1$ at every stage.

$$
\begin{aligned}
f(x)&=\ln(1+x),\\
f'(x)&=\frac1{1+x}\cdot1=(1+x)^{-1},\\
f''(x)&=-1(1+x)^{-2}\cdot1=-(1+x)^{-2},\\
f'''(x)&=(-1)(-2)(1+x)^{-3}\cdot1
	=2(1+x)^{-3}.
\end{aligned}
$$

$$
\begin{aligned}
f(0)&=\ln(1+0)=0,\\
f'(0)&=(1+0)^{-1}=1,\\
f''(0)&=-(1+0)^{-2}=-1,\\
f'''(0)&=2(1+0)^{-3}=2.
\end{aligned}
$$

| $k$ | $f^{(k)}(0)$ | $k!$ | coefficient |
| :--- | :--- | :--- | :--- |
| 0 | $\ln 1 = 0$ | $1$ | $0$ |
| 1 | $1$ | $1$ | $1$ |
| 2 | $-1$ | $2$ | $-\tfrac12$ |
| 3 | $2$ | $6$ | $\tfrac13$ |

#### 2. Coefficients

$$
\frac0{0!}=0,\qquad
\frac1{1!}=1,\qquad
\frac{-1}{2!}=-\frac12,\qquad
\frac2{3!}=\frac26=\frac13.
$$

#### 3. Taylor Polynomial

$$
\begin{aligned}
T_3(x)&=f(0)+f'(0)x+\frac{f''(0)}{2!}x^2+\frac{f'''(0)}{3!}x^3\\
	&=0+(1)x+\frac{-1}{2}x^2+\frac26x^3\\
	&=x-\frac{x^2}{2}+\frac{x^3}{3}.
\end{aligned}
$$

#### 4. Check And Approximate

$T_3(0) = 0 = \ln 1$ ✓

For $\ln1.1$, solve $1+x=1.1$: use $x=0.1$, not $x=1.1$.

$$
\begin{aligned}
T_3(0.1)&=0.1-\frac{(0.1)^2}{2}+\frac{(0.1)^3}{3}\\
	&=0.1-\frac{0.01}{2}+\frac{0.001}{3}\\
	&\approx0.1-0.005+0.000333333\\
	&\approx0.095333333.
\end{aligned}
$$

$$
\ln1.1\approx0.095310180
\qquad\text{(error about }0.000023\text{)}.
$$

#### 5. Conclusion

**Hence** $T_3(x) = x - \tfrac{x^2}{2} + \tfrac{x^3}{3}$ and $\ln 1.1 \approx 0.0953$.

---

## 6. Practice Questions — Taylor

**Q3. (4 marks)** Find $T_3(x)$ of $f(x) = e^{x}$ at $x_0 = 0$ and use it to approximate $e^{0.1}$.
*Hint: every derivative of $e^x$ is $e^x$; as in Example B4.*

**Q4. (4 marks)** Find $T_3(x)$ of $f(x) = x^3$ at $x_0 = 2$. Check that $T_3(2.1) = (2.1)^3$ exactly, and explain why.
*Hint: as in Example B1.*

**Q5. (4 marks)** Find $T_4(x)$ of $f(x) = \cos x$ at $x_0 = 0$ and approximate $\cos 0.2$.
*Hint: odd derivatives vanish at $0$, as in Example B2.*

**Q6. (4 marks)** Find $T_2(x)$ of $f(x) = \sqrt x$ at $x_0 = 9$ and approximate $\sqrt{9.2}$.
*Hint: as in Example B3, with $9^{1/2} = 3$ and $9^{3/2} = 27$.*

---

## 7. Solved Examples — Partial Derivatives and Gradient

> Keep the other variable constant → differentiate → form $[f_x\ f_y]$ → substitute the point.

### Example C1 — function inside a power (the lecture's example)

**Given** $f(x,y) = \left(x + 2y^3\right)^2$.

**AIM:** Find $\dfrac{\partial f}{\partial x}$, $\dfrac{\partial f}{\partial y}$ and the gradient at $(1,1)$.

#### 1. Setting Up

$$
u = x + 2y^3 \;(\text{inside}),
\qquad
f = u^2 \;(\text{outside}),
\qquad
\frac{df}{du} = 2u
$$

#### 2. Partial Derivatives

**For $f_x$, keep $y$ constant:**

$$
\begin{aligned}
\frac{\partial u}{\partial x}&=\frac{\partial}{\partial x}(x+2y^3)=1+0=1,\\
f_x&=\frac{df}{du}\frac{\partial u}{\partial x}\\
	&=2u\cdot1\\
	&=2(x+2y^3).
\end{aligned}
$$

**For $f_y$, keep $x$ constant:**

$$
\begin{aligned}
\frac{\partial u}{\partial y}&=\frac{\partial}{\partial y}(x+2y^3)
 =0+2(3y^2)=6y^2,\\
f_y&=\frac{df}{du}\frac{\partial u}{\partial y}\\
	&=2u\cdot6y^2\\
	&=12y^2(x+2y^3).
\end{aligned}
$$

#### 3. Gradient And Evaluation

$$
\nabla f(x,y) = \left[\; 2\left(x + 2y^3\right) \;\;\; 12y^2\left(x + 2y^3\right) \;\right] \in \mathbb{R}^{1\times2}
$$

Substitute $x=1$ and $y=1$ into the formulas:

$$
\begin{aligned}
u(1,1)&=1+2(1)^3=3,\\
f_x(1,1)&=2(3)=6,\\
f_y(1,1)&=12(1)^2(3)=36,\\
\nabla f(1,1)&=[6\quad36].
\end{aligned}
$$

#### 4. Check

$$
\begin{aligned}
f&=(x+2y^3)^2=x^2+4xy^3+4y^6,\\
f_x&=2x+4y^3+0=2(x+2y^3),\\
f_y&=0+4x(3y^2)+4(6y^5)\\
	&=12xy^2+24y^5=12y^2(x+2y^3).
\end{aligned}
$$

#### 5. Conclusion

**Hence** $\nabla f = \left[\,2(x + 2y^3),\; 12y^2(x + 2y^3)\,\right]$ and $\nabla f(1,1) = [\,6,\; 36\,]$.

---

### Example C2 — a polynomial in two variables

**Given** $f(x,y) = x^2y + 3xy^3 - y$.

**AIM:** Find the gradient and evaluate it at $(1,2)$.

#### 1. Setting Up

**A sum of three terms,** no inside function. Differentiate term by term.

#### 2. Partial Derivatives

**For $f_x$, keep $y$ constant:**

| Term | Derivative with respect to $x$ |
| :--- | :--- |
| $x^2y$ | $(2x)y$ |
| $3xy^3$ | $3(1)y^3$ |
| $-y$ | $0$ |

$$
f_x=2xy+3y^3+0=2xy+3y^3.
$$

**For $f_y$, keep $x$ constant:**

| Term | Derivative with respect to $y$ |
| :--- | :--- |
| $x^2y$ | $x^2(1)$ |
| $3xy^3$ | $3x(3y^2)$ |
| $-y$ | $-1$ |

$$
f_y=x^2+3x(3y^2)-1=x^2+9xy^2-1.
$$

#### 3. Gradient And Evaluation

$$
\nabla f = \left[\; 2xy + 3y^3 \;\;\; x^2 + 9xy^2 - 1 \;\right]
$$

$$
\begin{aligned}
f_x(1,2)&=2(1)(2)+3(2)^3=4+24=28,\\
f_y(1,2)&=(1)^2+9(1)(2)^2-1=1+36-1=36,\\
\nabla f(1,2)&=[28\quad36].
\end{aligned}
$$

#### 4. Check

**Mixed partials:** differentiate $f_x$ with respect to $y$, and $f_y$ with respect to $x$.

They agree here because this polynomial has continuous second derivatives.

$$
\begin{aligned}
\frac{\partial f_x}{\partial y}&=2x(1)+3(3y^2)=2x+9y^2,\\
\frac{\partial f_y}{\partial x}&=2x+9(1)y^2-0=2x+9y^2.
\end{aligned}
$$

#### 5. Conclusion

**Hence** $\nabla f(1,2) = [\,28,\; 36\,]$.

---

### Example C3 — function inside a logarithm

**Given** $f(x,y) = \ln\left(x^2 + y^2\right)$.

**AIM:** Find the gradient and evaluate it at $(1,2)$.

#### 1. Setting Up

The logarithm requires $x^2+y^2>0$, so $(x,y)\ne(0,0)$.

$$
u = x^2 + y^2,
\qquad
f = \ln u,
\qquad
\frac{df}{du} = \frac1u
$$

#### 2. Partial Derivatives

**For $f_x$, keep $y$ constant:**

$$
\begin{aligned}
\frac{\partial u}{\partial x}&=2x+0=2x,\\
f_x&=\frac{df}{du}\frac{\partial u}{\partial x}\\
	&=\frac1u\cdot2x=\frac{2x}{x^2+y^2}.
\end{aligned}
$$

**For $f_y$, keep $x$ constant:**

$$
\begin{aligned}
\frac{\partial u}{\partial y}&=0+2y=2y,\\
f_y&=\frac{df}{du}\frac{\partial u}{\partial y}\\
	&=\frac1u\cdot2y=\frac{2y}{x^2+y^2}.
\end{aligned}
$$

#### 3. Gradient And Evaluation

$$
\nabla f = \left[\; \frac{2x}{x^2 + y^2} \;\;\; \frac{2y}{x^2 + y^2} \;\right]
$$

$$
\begin{aligned}
u(1,2)&=1^2+2^2=5,\\
f_x(1,2)&=\frac{2(1)}5=\frac25,\\
f_y(1,2)&=\frac{2(2)}5=\frac45,\\
\nabla f(1,2)&=\left[\frac25\quad\frac45\right]=[0.4\quad0.8].
\end{aligned}
$$

#### 4. Check

Keep $y=2$ fixed. Compare nearby values on either side of $x=1$:

$$
\begin{aligned}
\frac{f(1.001,2)-f(0.999,2)}{1.001-0.999}
&=\frac{\ln((1.001)^2+2^2)-\ln((0.999)^2+2^2)}{0.002}\\
&=\frac{\ln5.002001-\ln4.998001}{0.002}\\
&\approx0.4000=f_x(1,2).
\end{aligned}
$$

#### 5. Conclusion

**Hence** $\nabla f(1,2) = [\,0.4,\; 0.8\,]$.

---

### Example C4 — a product with an exponential

**Given** $f(x,y) = x\,e^{xy}$.

**AIM:** Find the gradient and evaluate it at $(1,0)$.

#### 1. Setting Up

**For $\partial/\partial x$:** both factors contain $x$, so use the **product rule**.

**For $\partial/\partial y$:** $x$ is a frozen constant, so only $e^{xy}$ changes, by the chain rule.

#### 2. Partial Derivatives

**For $f_x$, keep $y$ constant.** First differentiate the exponent:

$$
\frac{\partial(xy)}{\partial x}=y,
\qquad
\frac{\partial e^{xy}}{\partial x}=e^{xy}\cdot y.
$$

Apply the product rule to $x\cdot e^{xy}$:

$$
\begin{aligned}
f_x&=\frac{\partial x}{\partial x}e^{xy}
		 +x\frac{\partial e^{xy}}{\partial x}\\
	 &=1\cdot e^{xy}+x(y e^{xy})\\
	 &=e^{xy}+xy e^{xy}\\
	 &=e^{xy}(1+xy).
\end{aligned}
$$

**For $f_y$, keep $x$ constant:**

$$
\frac{\partial(xy)}{\partial y}=x,
\qquad
\frac{\partial e^{xy}}{\partial y}=e^{xy}\cdot x.
$$

$$
\begin{aligned}
f_y&=\frac{\partial x}{\partial y}e^{xy}
		 +x\frac{\partial e^{xy}}{\partial y}\\
	 &=0\cdot e^{xy}+x(x e^{xy})\\
	 &=x^2e^{xy}.
\end{aligned}
$$

#### 3. Gradient And Evaluation

$$
\nabla f = \left[\; e^{xy}(1 + xy) \;\;\; x^2 e^{xy} \;\right]
$$

Substitute $x=1$, $y=0$. Then $xy=0$ and $e^{xy}=e^0=1$.

$$
\begin{aligned}
f_x(1,0)&=e^{1\cdot0}(1+1\cdot0)=1,\\
f_y(1,0)&=1^2e^{1\cdot0}=1,\\
\nabla f(1,0)&=[1\quad1].
\end{aligned}
$$

#### 4. Check

**Put $x = 1$ first:** $f(1,y) = e^{y}$, whose derivative is $e^{y}$; at $y = 0$ that is $1$ ✓

**Put $y = 0$ first:** $f(x,0) = x$, whose derivative is $1$ ✓

#### 5. Conclusion

**Hence** $\nabla f(1,0) = [\,1,\; 1\,]$.

---

## 8. Practice Questions — Partial Derivatives

**Q7. (4 marks)** Find both partial derivatives and the gradient of $f(x,y) = \left(3x - y^2\right)^3$, then evaluate at $(1,1)$.
*Hint: as in Example C1; check by the mixed partials.*

**Q8. (3 marks)** Find the gradient of $f(x,y) = x^2e^{3y}$ at $(1,0)$.
*Hint: freeze, then use $\frac{d}{dy}e^{3y} = 3e^{3y}$; as in Example C4.*

**Q9. (4 marks)** Find the gradient of $f(x,y) = \ln\left(1 + x^2y\right)$ at $(1,1)$ and check one entry with a difference quotient.
*Hint: as in Example C3; inside part first.*

---

## 9. Solved Examples — Multivariate Chain Rule

> Differentiate $f$ with respect to each input; multiply by that input's derivative; add.

### Example D1 — through a parameter $t$ (the lecture's example)

**Given** $f(x_1,x_2) = x_1^2 + 2x_2$, with $x_1 = \sin t$ and $x_2 = \cos t$.

**AIM:** Find $\dfrac{df}{dt}$.

#### 1. Chain Rule

Both $x_1$ and $x_2$ change with $t$, so both contribute to $df/dt$.

$$
\frac{df}{dt} = \frac{\partial f}{\partial x_1}\frac{dx_1}{dt} + \frac{\partial f}{\partial x_2}\frac{dx_2}{dt}
$$

#### 2. Outer And Inner Derivatives

Differentiate $f=x_1^2+2x_2$, holding the other input constant:

$$
\begin{aligned}
\frac{\partial f}{\partial x_1}&=2x_1+0=2x_1,\\
\frac{\partial f}{\partial x_2}&=0+2(1)=2.
\end{aligned}
$$

Then differentiate the given inputs with respect to $t$:

$$
\begin{aligned}
x_1=\sin t&\quad\Rightarrow\quad\frac{dx_1}{dt}=\cos t,\\
x_2=\cos t&\quad\Rightarrow\quad\frac{dx_2}{dt}=-\sin t.
\end{aligned}
$$

#### 3. Multiply And Substitute

$$
\begin{aligned}
\frac{df}{dt}
&=(2x_1)(\cos t)+(2)(-\sin t)\\
&=2(\sin t)(\cos t)-2\sin t\\
&=2\sin t(\cos t-1).
\end{aligned}
$$

Replace $x_1$ by $\sin t$ before giving the final answer; only $t$ remains.

#### 4. Check

$$
\begin{aligned}
f(t)&=(\sin t)^2+2\cos t,\\
\frac{df}{dt}&=2\sin t\cdot\cos t+2(-\sin t)\\
			 &=2\sin t\cos t-2\sin t.
\end{aligned}
$$

#### 5. Conclusion

**Hence** $\dfrac{df}{dt} = 2\sin t\,(\cos t - 1)$, matching slide 18.

---

### Example D2 — polynomial inner functions

**Given** $f(x_1,x_2) = x_1^2x_2$, with $x_1 = t^2$ and $x_2 = 3t$.

**AIM:** Find $\dfrac{df}{dt}$.

#### 1. Chain Rule

$$
\frac{df}{dt} = \frac{\partial f}{\partial x_1}\frac{dx_1}{dt} + \frac{\partial f}{\partial x_2}\frac{dx_2}{dt}
$$

#### 2. Outer And Inner Derivatives

Keep the other input constant when differentiating $f=x_1^2x_2$:

$$
\begin{aligned}
\frac{\partial f}{\partial x_1}&=(2x_1)x_2,\\
\frac{\partial f}{\partial x_2}&=x_1^2(1)=x_1^2.
\end{aligned}
$$

$$
\begin{aligned}
x_1=t^2&\quad\Rightarrow\quad\frac{dx_1}{dt}=2t,\\
x_2=3t&\quad\Rightarrow\quad\frac{dx_2}{dt}=3.
\end{aligned}
$$

#### 3. Multiply And Substitute

$$
\begin{aligned}
\frac{df}{dt}
&=(2x_1x_2)(2t)+(x_1^2)(3)\\
&=2(t^2)(3t)(2t)+(t^2)^2(3)\\
&=(2\cdot3\cdot2)t^{2+1+1}+3t^{2\cdot2}\\
&=12t^4+3t^4\\
&=15t^4.
\end{aligned}
$$

#### 4. Check

$$
\begin{aligned}
f(t)&=(t^2)^2(3t)=t^4(3t)=3t^5,\\
\frac{df}{dt}&=3(5t^4)=15t^4.
\end{aligned}
$$

#### 5. Conclusion

**Hence** $\dfrac{df}{dt} = 15t^4$.

---

### Example D3 — two parameters, matrix form

**Given** $f(x_1,x_2) = x_1x_2$, with $x_1 = s + t$ and $x_2 = st$.

**AIM:** Find $\dfrac{\partial f}{\partial s}$ and $\dfrac{\partial f}{\partial t}$ using the matrix form.

#### 1. Chain Rule

$$
\def\arraystretch{2.2}
\begin{bmatrix} \dfrac{\partial f}{\partial s} & \dfrac{\partial f}{\partial t}\end{bmatrix}
=
\begin{bmatrix} \dfrac{\partial f}{\partial x_1} & \dfrac{\partial f}{\partial x_2}\end{bmatrix}
\begin{bmatrix}
\dfrac{\partial x_1}{\partial s} & \dfrac{\partial x_1}{\partial t}\\
\dfrac{\partial x_2}{\partial s} & \dfrac{\partial x_2}{\partial t}
\end{bmatrix}
$$

#### 2. Outer And Inner Derivatives

$$
\begin{aligned}
\frac{\partial f}{\partial x_1}&=1\cdot x_2=x_2,\\
\frac{\partial f}{\partial x_2}&=x_1\cdot1=x_1.
\end{aligned}
$$

For the inside matrix, rows belong to $x_1,x_2$; columns belong to $s,t$.

| Input | Differentiate with respect to $s$ | Differentiate with respect to $t$ |
| :--- | :--- | :--- |
| $x_1=s+t$ | $1+0=1$ | $0+1=1$ |
| $x_2=st$ | $1\cdot t=t$ | $s\cdot1=s$ |

$$
\def\arraystretch{2.2}
\begin{bmatrix}
\dfrac{\partial x_1}{\partial s} & \dfrac{\partial x_1}{\partial t}\\
\dfrac{\partial x_2}{\partial s} & \dfrac{\partial x_2}{\partial t}
\end{bmatrix}
= \begin{bmatrix} 1 & 1\\ t & s\end{bmatrix}
$$

#### 3. Multiply And Substitute

Multiply the row by each column separately:

$$
\begin{aligned}
\begin{bmatrix}x_2&x_1\end{bmatrix}
\begin{bmatrix}1&1\\t&s\end{bmatrix}
&=\begin{bmatrix}x_2(1)+x_1(t)&x_2(1)+x_1(s)\end{bmatrix}\\
&=\begin{bmatrix}x_2+x_1t&x_2+x_1s\end{bmatrix}.
\end{aligned}
$$

Now substitute $x_1=s+t$ and $x_2=st$:

$$
\begin{aligned}
\frac{\partial f}{\partial s}
&=st+(s+t)t\\
&=st+st+t^2=2st+t^2,\\
\frac{\partial f}{\partial t}
&=st+(s+t)s\\
&=st+s^2+st=s^2+2st.
\end{aligned}
$$

#### 4. Check

$$
\begin{aligned}
f&=(s+t)st=s^2t+st^2,\\
\frac{\partial f}{\partial s}&=(2s)t+1\cdot t^2=2st+t^2,\\
\frac{\partial f}{\partial t}&=s^2\cdot1+s(2t)=s^2+2st.
\end{aligned}
$$

#### 5. Conclusion

**Hence** $\dfrac{\partial f}{\partial s} = 2st + t^2$ and $\dfrac{\partial f}{\partial t} = s^2 + 2st$.

---

## 10. Practice Questions — Chain Rule

**Q10. (4 marks)** Let $f(x_1,x_2) = x_1x_2^2$ with $x_1 = \cos t$, $x_2 = \sin t$. Find $\dfrac{df}{dt}$ by the chain rule and check by substituting first.
*Hint: as in Example D1.*

**Q11. (5 marks)** Let $f(x_1,x_2) = x_1^2 + x_2^2$ with $x_1 = s + t$ and $x_2 = s - t$. Compute $\dfrac{\partial f}{\partial s}$ and $\dfrac{\partial f}{\partial t}$ using the matrix form.
*Hint: as in Example D3; the answers are very short.*

---

## 11. Solved Examples — Jacobian

> Each output gets one row. Each input gets one column. Differentiate before substituting values.

### Example E1 — from $\mathbb{R}^2$ to $\mathbb{R}^3$

**Given**

$$
f(x_1,x_2) = \begin{bmatrix} f_1\\ f_2\\ f_3\end{bmatrix} = \begin{bmatrix} x_1^2 x_2\\ x_1 + x_2^2\\ 3x_1 - x_2\end{bmatrix}
$$

**AIM:** Find the Jacobian $J$ and evaluate it at $(1,2)$.

#### 1. Size

$m = 3$ outputs, $n = 2$ inputs, so $J \in \mathbb{R}^{3\times 2}$.

#### 2. Partial Derivatives

**Row 1:** $f_1=x_1^2x_2$.

$$
\begin{aligned}
\frac{\partial f_1}{\partial x_1}&=(2x_1)x_2,\\
\frac{\partial f_1}{\partial x_2}&=x_1^2(1)=x_1^2.
\end{aligned}
$$

**Row 2:** $f_2=x_1+x_2^2$.

$$
\begin{aligned}
\frac{\partial f_2}{\partial x_1}&=1+0=1,\\
\frac{\partial f_2}{\partial x_2}&=0+2x_2=2x_2.
\end{aligned}
$$

**Row 3:** $f_3=3x_1-x_2$.

$$
\begin{aligned}
\frac{\partial f_3}{\partial x_1}&=3-0=3,\\
\frac{\partial f_3}{\partial x_2}&=0-1=-1.
\end{aligned}
$$

#### 3. Jacobian

Keep inputs in the order $x_1,x_2$ across every row:

$$
\def\arraystretch{2.2}
J(x_1,x_2)=
\begin{bmatrix}
\dfrac{\partial f_1}{\partial x_1}&\dfrac{\partial f_1}{\partial x_2}\\
\dfrac{\partial f_2}{\partial x_1}&\dfrac{\partial f_2}{\partial x_2}\\
\dfrac{\partial f_3}{\partial x_1}&\dfrac{\partial f_3}{\partial x_2}
\end{bmatrix}
=\begin{bmatrix}2x_1x_2&x_1^2\\1&2x_2\\3&-1\end{bmatrix}.
$$

#### 4. Evaluate Or Check

$$
J(1,2)=\begin{bmatrix}2(1)(2)&1^2\\1&2(2)\\3&-1\end{bmatrix}
=\begin{bmatrix}4&1\\1&4\\3&-1\end{bmatrix}.
$$

#### 5. Conclusion

**Hence** $J$ is the $3\times 2$ matrix above. Row 3 is constant because $f_3$ is linear.

---

### Example E2 — polar coordinates

**Given**

$$
f(r,\theta) = \begin{bmatrix} r\cos\theta\\ r\sin\theta\end{bmatrix}
$$

**AIM:** Find the Jacobian, its determinant, and $J$ at $(r,\theta) = (2, \tfrac{\pi}{2})$.

#### 1. Size

$2$ outputs, $2$ inputs: $J \in \mathbb{R}^{2\times 2}$.

#### 2. Partial Derivatives

**Row 1:** $f_1=r\cos\theta$. Treat the other input as constant.

$$
\begin{aligned}
\frac{\partial f_1}{\partial r}&=1\cdot\cos\theta=\cos\theta,\\
\frac{\partial f_1}{\partial\theta}&=r(-\sin\theta)=-r\sin\theta.
\end{aligned}
$$

**Row 2:** $f_2=r\sin\theta$.

$$
\begin{aligned}
\frac{\partial f_2}{\partial r}&=1\cdot\sin\theta=\sin\theta,\\
\frac{\partial f_2}{\partial\theta}&=r\cos\theta.
\end{aligned}
$$

#### 3. Jacobian

Column 1 differentiates with respect to $r$; column 2, with respect to $\theta$.

$$
J = \begin{bmatrix} \cos\theta & -r\sin\theta\\ \sin\theta & r\cos\theta\end{bmatrix}
$$

#### 4. Evaluate Or Check

**Determinant:** top-left times bottom-right, minus top-right times bottom-left.

$$
\begin{aligned}
\det J
&=(\cos\theta)(r\cos\theta)-(-r\sin\theta)(\sin\theta)\\
&=r\cos^2\theta+r\sin^2\theta\\
&=r(\cos^2\theta+\sin^2\theta)\\
&=r\cdot1=r.
\end{aligned}
$$

**At $(2, \tfrac{\pi}{2})$,** with $\cos\tfrac{\pi}{2} = 0$ and $\sin\tfrac{\pi}{2} = 1$:

$$
\begin{aligned}
J(2,\tfrac\pi2)
&=\begin{bmatrix}0&-2(1)\\1&2(0)\end{bmatrix}
 =\begin{bmatrix}0&-2\\1&0\end{bmatrix},\\
\det J(2,\tfrac\pi2)&=0(0)-(-2)(1)=2.
\end{aligned}
$$

#### 5. Conclusion

**Hence** $J$ is as above with $\det J = r$ (the familiar area factor $r\,dr\,d\theta$).

---

### Example E3 — a linear map: $\dfrac{d(Ax)}{dx} = A$

**Given**

$$
A = \begin{bmatrix} 1 & 2 & 0\\ 3 & -1 & 4\end{bmatrix},
\qquad
f(x) = Ax = \begin{bmatrix} x_1 + 2x_2\\ 3x_1 - x_2 + 4x_3\end{bmatrix}
$$

**AIM:** Find the Jacobian and compare it with $A$.

#### 1. Size

$2$ outputs, $3$ inputs: $J \in \mathbb{R}^{2\times 3}$.

#### 2. Partial Derivatives

**Row 1:** $f_1=x_1+2x_2+0x_3$.

$$
\begin{aligned}
\frac{\partial f_1}{\partial x_1}&=1+0+0=1,\\
\frac{\partial f_1}{\partial x_2}&=0+2+0=2,\\
\frac{\partial f_1}{\partial x_3}&=0+0+0=0.
\end{aligned}
$$

**Row 2:** $f_2=3x_1-x_2+4x_3$.

$$
\begin{aligned}
\frac{\partial f_2}{\partial x_1}&=3-0+0=3,\\
\frac{\partial f_2}{\partial x_2}&=0-1+0=-1,\\
\frac{\partial f_2}{\partial x_3}&=0-0+4=4.
\end{aligned}
$$

#### 3. Jacobian

Put each output's derivatives in one row, ordered $x_1,x_2,x_3$:

$$
\def\arraystretch{2.2}
J=
\begin{bmatrix}
\dfrac{\partial f_1}{\partial x_1}&\dfrac{\partial f_1}{\partial x_2}&\dfrac{\partial f_1}{\partial x_3}\\
\dfrac{\partial f_2}{\partial x_1}&\dfrac{\partial f_2}{\partial x_2}&\dfrac{\partial f_2}{\partial x_3}
\end{bmatrix}
=\begin{bmatrix}1&2&0\\3&-1&4\end{bmatrix}.
$$

#### 4. Evaluate Or Check

$J = A$ entry for entry ✓. The derivative of $f_i$ with respect to $x_j$ is exactly the coefficient $a_{ij}$.

#### 5. Conclusion

**Hence** $\dfrac{d(Ax)}{dx} = A$, the lecture's result.

---

## 12. Practice Questions — Jacobian

**Q12. (4 marks)** Find the Jacobian of

$$
f(x_1,x_2,x_3) = \begin{bmatrix} x_1 + x_2x_3\\ x_1^2x_3\end{bmatrix}
$$

State its size, then evaluate it at $(1,1,2)$.
*Hint: as in Example E1.*

**Q13. (4 marks)** For $f(x,y) = \begin{bmatrix} x^2 - y^2\\ 2xy\end{bmatrix}$, find $J$, evaluate it at $(1,2)$, and compute $\det J$.
*Hint: as in Example E2.*

---

## 13. Practice Questions — Short Theory (2 marks each)

**Q14.** Write the limit definition of the derivative and state what the derivative represents geometrically.

**Q15.** State the product, quotient and chain rules.

**Q16.** What is the difference between a Taylor polynomial and a Taylor series? Why is $T_n$ of a degree-$n$ polynomial exact?

**Q17.** Why is the gradient of $f : \mathbb{R}^n \to \mathbb{R}$ written as a $1\times n$ row vector in this course?

**Q18.** What is the size of the Jacobian of $f : \mathbb{R}^n \to \mathbb{R}^m$, and what does row $i$ contain?

**Q19.** Show that for $f(x) = Ax$ with $A \in \mathbb{R}^{M\times N}$, $\dfrac{df}{dx} = A$.

---

## 14. Exam Traps

1. Forgetting the $k!$ in the Taylor coefficients (slide 6 has this slip).
2. Evaluating derivatives at $x$ instead of at $x_0$ before building the Taylor polynomial.
3. In a partial derivative, differentiating a frozen variable as if it moved.
4. Dropping the inside derivative in the chain rule, e.g. writing $2(x + 2y^3)$ for $\partial f/\partial y$.
5. Using the chain rule where the product rule is needed: in $x\,e^{xy}$, both factors contain $x$ (Example C4).
6. Mixing up Jacobian orientation: rows are outputs $f_i$, columns are inputs $x_j$.
7. In the $t$-chain rule, leaving $x_1, x_2$ in the final answer instead of substituting their $t$-expressions.
8. In first principles, cancelling $h$ before expanding, or taking the limit before dividing by $h$.

---

## 15. Recall Checklist

| Question type | Fixed routine |
| :--- | :--- |
| First principles | Substitute $x+h$ → subtract → factor and cancel $h$ → limit |
| Taylor | Differentiate → evaluate at $x_0$ → divide by factorial → multiply by powers |
| Partial derivatives | Hold other inputs constant → apply the rule → form the gradient → evaluate |
| Chain rule | Outer derivatives → inner derivatives → multiply and add → substitute |
| Jacobian | Count outputs and inputs → differentiate each row → assemble → evaluate |

**Quick check:** In a Taylor coefficient, does the sign come from the derivative value or factorial?

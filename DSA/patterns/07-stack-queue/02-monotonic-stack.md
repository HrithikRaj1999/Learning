# Stack — Monotonic

Stack kept sorted (inc/dec) to find next-greater/smaller in O(n).

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 739 | Medium | Daily Temperatures | Decreasing stack of indices | Amazon, Google, Facebook |
| 496 | Easy | Next Greater Element I | Monotonic stack + map | Amazon, Bloomberg |
| 503 | Medium | Next Greater Element II | Circular via 2n iteration | Amazon, Google |
| 901 | Medium | Online Stock Span | Monotonic stack of spans | Amazon, Bloomberg |
| 456 | Medium | 132 Pattern | Stack + tracked "third" | Amazon, Google |
| 84 | Hard | Largest Rectangle in Histogram | Increasing stack, pop to compute area | Amazon, Google, Microsoft |

**Key skill**: LC 84 — when you pop a taller bar, its rectangle width spans to the current index; a sentinel `0` at the end flushes the stack.

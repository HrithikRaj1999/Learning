# 07. Stack & Queue

LIFO for nesting/undo/next-greater; FIFO for order-preserving streams.

## Ladder

1. [Stack basics](01-stack-basics.md) — matching, evaluation, O(1) min
2. [Monotonic stack](02-monotonic-stack.md) — next greater / span / histogram
3. [Stack simulation](03-stack-simulation.md) — decode, collisions, fleets
4. [Queue design](04-queue-design.md) — implement/queue structures

## Core idea

"Next greater/smaller element" or "nearest unmatched" → monotonic stack in O(n). Nesting/undo → plain stack.

# Queue — Design

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 232 | Easy | Implement Queue using Stacks | Two stacks, lazy transfer | Amazon, Microsoft, Bloomberg |
| 225 | Easy | Implement Stack using Queues | Rotate queue on push | Amazon, Microsoft |
| 622 | Medium | Design Circular Queue | Ring buffer with head/tail | Amazon, Google |
| 346 | Easy | Moving Average from Data Stream | Fixed-size queue window | Google, Amazon |
| 1429 | Medium | First Unique Number (stream) | Queue + count map | Amazon, Bloomberg |

**Key skill**: two-stack queue amortizes to O(1) — only transfer from `in` to `out` when `out` is empty (LC 232).

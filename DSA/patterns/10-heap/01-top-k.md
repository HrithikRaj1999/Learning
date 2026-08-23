# Heap — Top-K & Kth

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 215 | Medium | Kth Largest Element in an Array | Min-heap size K / quickselect | Google, Amazon, Meta, Apple |
| 1046 | Easy | Last Stone Weight | Max-heap smash top two | Amazon, Google |
| 703 | Easy | Kth Largest Element in a Stream | Min-heap size K | Amazon, Bloomberg |
| 973 | Medium | K Closest Points to Origin | Max-heap size K by distance | Amazon, Google, Meta |
| 347 | Medium | Top K Frequent Elements | Heap / bucket sort | Google, Amazon, Meta, Apple |
| 373 | Medium | Find K Pairs with Smallest Sums | Min-heap of frontier pairs | Amazon, Google |

**Key skill**: for "K largest" keep a **min**-heap of size K — the root is the Kth largest, pop when size exceeds K.

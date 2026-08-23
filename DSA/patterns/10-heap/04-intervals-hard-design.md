# Heap — Intervals, Hard & Design

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 253 | Medium | Meeting Rooms II | Min-heap of end times | Amazon, Bloomberg, Microsoft, Google |
| 23 | Hard | Merge K Sorted Lists | Min-heap of list heads | Amazon, Google, Bloomberg |
| 632 | Hard | Smallest Range Covering Elements from K Lists | Min-heap + track max | Amazon, Google |
| 218 | Hard | The Skyline Problem | Heap / sweep line | Amazon, Google, Microsoft |
| 355 | Medium | Design Twitter | Heap merge of user feeds | Amazon, Twitter |

**Key skill**: LC 253 — sort by start, push end times; if new start ≥ heap-min end, reuse a room (pop) else add one.

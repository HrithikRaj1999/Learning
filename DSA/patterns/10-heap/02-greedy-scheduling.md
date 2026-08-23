# Heap — Greedy Scheduling

Repeatedly pop the best-next option.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 621 | Medium | Task Scheduler | Max-heap + cooldown math | Amazon, Google, Facebook |
| 767 | Medium | Reorganize String | Max-heap most-frequent first | Amazon, Google |
| 1167 | Medium | Minimum Cost to Connect Sticks | Min-heap merge cheapest | Amazon, Google |
| 1834 | Medium | Single-Threaded CPU | Sort + min-heap by duration | Amazon, Google |
| 1845 | Medium | Seat Reservation Manager | Min-heap of freed seats | Amazon |
| 1882 | Medium | Process Tasks Using Servers | Two heaps (free/busy) | Amazon, Google |

**Key skill**: LC 621 — answer is `max(len, (maxFreq−1)*(n+1) + countOfMaxFreq)`; heap simulation also works.

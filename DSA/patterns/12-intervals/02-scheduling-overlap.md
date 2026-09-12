# Intervals — Scheduling & Overlap

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 252 | Easy | Meeting Rooms | Sort, check adjacent overlap | Amazon, Google, Facebook |
| 253 | Medium | Meeting Rooms II | Min-heap of end times / sweep | Amazon, Bloomberg, Microsoft, Google |
| 435 | Medium | Non-overlapping Intervals | Greedy keep earliest end | Amazon, Google |
| 452 | Medium | Minimum Arrows to Burst Balloons | Greedy by end point | Amazon, Google |
| 759 | Hard | Employee Free Time | Merge all, find gaps | Amazon, Google, Facebook |

**Key skill**: to keep the most non-overlapping intervals, greedily sort by **end** and drop anything that overlaps the last kept (LC 435, 452).

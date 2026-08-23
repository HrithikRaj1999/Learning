# Greedy — Interval & Sort

Sort by the right key, then take/skip in one pass.

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 435 | Medium | Non-overlapping Intervals | Sort by end, keep earliest end | Amazon, Google |
| 452 | Medium | Minimum Arrows to Burst Balloons | Sort by end, greedy shots | Amazon, Google |
| 763 | Medium | Partition Labels | Greedy last-index | Amazon, Google, Meta |
| 406 | Medium | Queue Reconstruction by Height | Sort tall-first, insert by k | Amazon, Google |
| 455 | Easy | Assign Cookies | Sort both, greedy match | Amazon, Google |
| 881 | Medium | Boats to Save People | Sort, pair light+heavy | Amazon, Google |
| 846 | Medium | Hand of Straights | Sort + greedy consecutive runs | Google, Amazon |

**Key skill**: the sort key is the whole trick — "keep the most" sorts by end; "arrange by rank" sorts by height/weight.

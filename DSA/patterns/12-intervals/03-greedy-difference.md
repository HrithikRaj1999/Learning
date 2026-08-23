# Intervals — Greedy & Difference Array

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 1288 | Medium | Remove Covered Intervals | Sort + track max end | Amazon, Facebook |
| 763 | Medium | Partition Labels | Greedy last-index expansion | Amazon, Google, Meta |
| 406 | Medium | Queue Reconstruction by Height | Sort desc, insert by index | Amazon, Google |
| 1094 | Medium | Car Pooling | Difference array on stops | Amazon |
| 1109 | Medium | Corporate Flight Bookings | Difference array | Amazon, Google |
| 1353 | Medium | Maximum Events That Can Be Attended | Sort + min-heap of end days | Amazon, Google |

**Key skill**: difference array turns each interval into `+1` at start, `−1` at end+1; prefix sum gives concurrency (LC 1094, 1109).

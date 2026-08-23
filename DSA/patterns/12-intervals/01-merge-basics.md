# Intervals — Merge Basics

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 56 | Medium | Merge Intervals | Sort by start, merge overlaps | Google, Amazon, Bloomberg, Microsoft |
| 57 | Medium | Insert Interval | Linear merge into sorted set | Google, Amazon, LinkedIn |
| 228 | Easy | Summary Ranges | Scan consecutive runs | Amazon, Google |
| 986 | Medium | Interval List Intersections | Two-pointer overlap | Amazon, Google, Facebook |

**Key skill**: after sorting by start, merge when `cur.start <= last.end`, extending `last.end = max(...)`.

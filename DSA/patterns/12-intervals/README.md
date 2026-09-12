# 12. Intervals

Almost always: **sort by start** (sometimes by end), then sweep once.

## Ladder

1. [Merge basics](01-merge-basics.md) — merge, insert, intersect
2. [Scheduling & overlap](02-scheduling-overlap.md) — meeting rooms, min removals
3. [Greedy & difference array](03-greedy-difference.md) — arrows, events, timelines
4. [Sweep line & design](04-sweep-design-hard.md) — calendars, range module

## Core idea

Two intervals overlap iff `a.start <= b.end && b.start <= a.end`. Sort first, then a single pass merges or counts. For "max concurrent", sweep start/end events.

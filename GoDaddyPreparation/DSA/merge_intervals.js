/*
Merge Intervals (LC 56) + Insert Interval (LC 57)   [Q2.2.1]

A) Merge every overlapping interval.
   [[1,3],[2,6],[8,10],[15,18]] -> [[1,6],[8,10],[15,18]]

B) Then they add: the list is ALREADY merged and sorted, now insert
   one new interval and keep it merged.
   list [[1,3],[6,9]], new [2,5] -> [[1,5],[6,9]]

Prepare both - the second one is the follow-up they always ask.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
PART A - merge
- SORT by start time. After sorting, anything that overlaps my
  current interval must come immediately next. That is the whole
  reason we sort.
- Keep ONE "current" interval open. For each next interval:
      next.start <= current.end  -> they touch/overlap
                                    current.end = max(end, next.end)
      else                       -> gap, push current, open a new one
- Use max() for the end. [1,10] then [2,3] must stay [1,10].
- Push the last open interval after the loop. Easy to forget.

PART B - insert into an already merged list
- Three simple phases, no sorting needed:
      1. copy all intervals that END before the new one starts
      2. merge every interval that overlaps: start = min, end = max
      3. copy the rest
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
PART A: [[1,3],[2,6],[8,10],[15,18]]  (already sorted by start)

  1   3
    2      6
                8   10
                          15   18
  |---|--|---|---|---|----|----|---|
  1 2 3 4 5 6 7 8 9 10 ... 15  18

  current = [1,3]
  next [2,6] : 2 <= 3 -> overlap, end = max(3,6) = 6  -> [1,6]
  next [8,10]: 8 >  6 -> gap, push [1,6], current = [8,10]
  next [15,18]: 15 > 10 -> gap, push [8,10], current = [15,18]
  loop ends -> push [15,18]

  answer [[1,6],[8,10],[15,18]]

THE SWALLOW CASE (why max matters): [[1,10],[2,3]]
  current [1,10], next [2,3]: 2 <= 10 -> end = max(10,3) = 10
  wrong code would write end = 3 and produce [1,3].

THE TOUCHING CASE: [[1,4],[4,5]]
  4 <= 4 -> merged into [1,5]. If the interviewer says touching
  does NOT count as overlap, change <= to <. ASK THEM.

PART B: list [[1,3],[6,9]], new [2,5]

  phase 1: [1,3] ends at 3, and 3 >= 2, so it does NOT go here
  phase 2: [1,3] overlaps -> new = [min(1,2), max(3,5)] = [1,5]
           [6,9] starts at 6 > 5 -> stop merging
  push [1,5]
  phase 3: copy [6,9]
  answer [[1,5],[6,9]]
*/

// ============================================================
// 3) BRUTE FORCE - REPEAT UNTIL NOTHING MERGES
// ============================================================
/*
- Compare every pair, merge any overlap, restart. Repeat until a
  full pass changes nothing.
    Time  : O(n^3) worst case   Space : O(n)
- Only worth saying out loud as the starting point.
*/
function mergeBrute(intervals) {
  let current = intervals.map((pair) => [...pair]);
  let changed = true;

  while (changed) {
    changed = false;

    outer: for (let i = 0; i < current.length; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const a = current[i];
        const b = current[j];

        // do a and b touch anywhere?
        if (a[0] <= b[1] && b[0] <= a[1]) {
          const merged = [Math.min(a[0], b[0]), Math.max(a[1], b[1])];
          // drop both, add the merged one, then start over
          current = current.filter((_, index) => index !== i && index !== j);
          current.push(merged);
          changed = true;
          break outer;
        }
      }
    }
  }

  return current.sort((x, y) => x[0] - y[0]);
}

// ============================================================
// 4) OPTIMAL - SORT BY START, ONE PASS
// ============================================================
/*
- STEP 1: sort by start.
- STEP 2: hold one open interval, extend or close it.
- STEP 3: push the last open one after the loop.
    Time  : O(n log n) - the sort dominates, the pass is O(n).
    Space : O(n) for the output (O(log n) if the sort is in place
            and we do not count the answer).
*/
function merge(intervals) {
  if (intervals.length === 0) return [];

  // copy first so the caller's array is untouched, then sort by start
  const sorted = intervals.map((pair) => [...pair]).sort((a, b) => a[0] - b[0]);

  const merged = [];
  // the interval that is currently open and can still grow
  let currentStart = sorted[0][0];
  let currentEnd = sorted[0][1];

  for (let i = 1; i < sorted.length; i++) {
    const [nextStart, nextEnd] = sorted[i];

    if (nextStart <= currentEnd) {
      // they overlap or touch - stretch the open interval.
      // max is required: [1,10] then [2,3] must stay [1,10]
      currentEnd = Math.max(currentEnd, nextEnd);
    } else {
      // a real gap - close the open interval and start a new one
      merged.push([currentStart, currentEnd]);
      currentStart = nextStart;
      currentEnd = nextEnd;
    }
  }

  // the last open interval never hits the else branch
  merged.push([currentStart, currentEnd]);

  return merged;
}

// ============================================================
// 5) FOLLOW-UP - INSERT INTO AN ALREADY MERGED LIST (LC 57)
// ============================================================
/*
- The list is sorted and non-overlapping, so no sort is needed.
- Three phases: before, overlapping, after.
    Time  : O(n) single pass   Space : O(n) output.
*/
function insert(intervals, newInterval) {
  const result = [];
  let newStart = newInterval[0];
  let newEnd = newInterval[1];
  let i = 0;

  // PHASE 1 - intervals that finish before the new one begins
  while (i < intervals.length && intervals[i][1] < newStart) {
    result.push(intervals[i]);
    i++;
  }

  // PHASE 2 - every interval that starts before the new one ends
  // overlaps, so swallow it into the new interval
  while (i < intervals.length && intervals[i][0] <= newEnd) {
    newStart = Math.min(newStart, intervals[i][0]);
    newEnd = Math.max(newEnd, intervals[i][1]);
    i++;
  }
  result.push([newStart, newEnd]);

  // PHASE 3 - everything that starts after the new one ends
  while (i < intervals.length) {
    result.push(intervals[i]);
    i++;
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(merge([[1, 3], [2, 6], [8, 10], [15, 18]]));
// [ [1,6], [8,10], [15,18] ]
console.log(merge([[1, 4], [4, 5]])); // [ [1,5] ]  (touching merges)
console.log(merge([[1, 10], [2, 3]])); // [ [1,10] ] (swallowed)
console.log(merge([[5, 6], [1, 2]])); // [ [1,2], [5,6] ] (unsorted input)
console.log(merge([[1, 4]])); // [ [1,4] ]
console.log(merge([])); // []
console.log(mergeBrute([[1, 3], [2, 6], [8, 10], [15, 18]]));
// [ [1,6], [8,10], [15,18] ]

console.log(insert([[1, 3], [6, 9]], [2, 5])); // [ [1,5], [6,9] ]
console.log(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]));
// [ [1,2], [3,10], [12,16] ]
console.log(insert([], [4, 8])); // [ [4,8] ]
console.log(insert([[1, 5]], [6, 8])); // [ [1,5], [6,8] ]

/*
============================================================
6) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Merge  : O(n log n) time from the sort, O(n) output.
             The scan itself is only O(n) - say that clearly.
    Insert : O(n), no sort needed because the list is already
             sorted and merged.
- WHY SORTING BY START IS ENOUGH:
    After sorting, if interval i does not overlap the open one,
    no LATER interval can either, because their starts are even
    bigger. That is what makes one pass correct.
- THE THREE BUGS THEY CHECK:
    1. end = next.end instead of max(...) -> [1,10] swallows wrong
    2. forgetting the final push after the loop
    3. `<` vs `<=` on touching intervals - ASK if [1,4] and [4,5]
       should merge. In a calendar, an event ending at 4 and one
       starting at 4 do NOT conflict, so there `<` is right.
- SORTING BY END INSTEAD:
    That is the greedy for "erase overlap intervals" (LC 435) and
    for meeting rooms 1. Different question, different sort key.
- FOLLOW-UPS:
    Meeting rooms 1 (LC 252, any overlap at all),
    Meeting rooms 2 (LC 253, min rooms = min-heap of end times,
    or a +1/-1 sweep line), non-overlapping intervals (LC 435),
    interval list intersections (LC 986).
*/

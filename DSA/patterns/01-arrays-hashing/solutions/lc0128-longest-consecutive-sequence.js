/*
Longest Consecutive Sequence (LC 128)

Return the length of the longest run of consecutive integers, in any
order, that appears in nums. Must run in O(n).

  [100,4,200,1,3,2]     -> 4   (1,2,3,4)
  [0,3,7,2,5,8,4,6,0,1] -> 9   (0..8)
  [1,2,0,1]             -> 3   (0,1,2; the duplicate 1 does not extend it)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Sorting is the obvious idea, but it costs O(n log n) and the problem
  explicitly asks for O(n). So sorting is the "better", not the answer.
- Put everything in a Set. Now "is x+1 present?" is O(1), so I can walk a
  run forward from any number.
- The trick that keeps it linear: only start walking from a number that
  STARTS a run, i.e. a number x where x-1 is NOT in the set. Every other
  number is skipped instantly.
- That guard means each value is visited at most twice overall: once by
  the outer loop, once by the single inner walk of its own run.

- The ladder:
    1. for each x, keep asking "is x+1 there?" by scanning   O(n^3)-ish
    2. sort, then count adjacent runs                        O(n log n)
    3. Set + only expand from run starts                     O(n)

- Traps:
    - without the "x-1 not present" guard the inner walk reruns for every
      member of a run and it degrades to O(n^2).
    - duplicates must not extend a run. A Set removes them for free.
    - in the sorted version, skip equal neighbours explicitly.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SET + RUN START view, nums = [100,4,200,1,3,2]

  set = { 100, 4, 200, 1, 3, 2 }
  best = 0

  x = 100   is 99 in the set? no  -> 100 STARTS a run
            walk: 101 in set? no
            length = 1,  best = max(0, 1) = 1

  x = 4     is 3 in the set? YES -> 4 is in the middle, SKIP immediately
                    ^
                    this skip is what keeps the whole thing O(n)

  x = 200   is 199 in the set? no -> starts a run
            walk: 201? no
            length = 1,  best = max(1, 1) = 1

  x = 1     is 0 in the set? no -> STARTS a run
            walk: 2 in set? yes, length = 2
                  3 in set? yes, length = 3
                  4 in set? yes, length = 4
                  5 in set? no, stop
            best = max(1, 4) = 4

  x = 3     is 2 in the set? YES -> skip
  x = 2     is 1 in the set? YES -> skip

  answer 4

  INVARIANT: the inner while loop only ever runs from the smallest member
  of a run, so across the whole algorithm it walks each value exactly once.
  Outer pass n + inner walks n = O(n) total, even though it looks nested.

DUPLICATE case, nums = [1,2,0,1]
  set = { 1, 2, 0 }        the second 1 vanishes here, for free
  x=1  is 0 present? YES -> skip
  x=2  is 1 present? YES -> skip
  x=0  is -1 present? no -> walk 1 yes, 2 yes, 3 no -> length 3
  answer 3

SORT view, nums = [100,4,200,1,3,2] -> [1,2,3,4,100,200]

  1 -> 2  diff 1  run = 2
  2 -> 3  diff 1  run = 3
  3 -> 4  diff 1  run = 4      best = 4
  4 -> 100 diff 96 -> reset run = 1
  100 -> 200 diff 100 -> reset run = 1
  answer 4
*/

// ============================================================
// 3) BRUTE FORCE - EXPAND EVERY NUMBER BY SCANNING
// ============================================================
/*
- For each x, keep looking for x+1 by scanning the whole array each time.
    Time  : O(n^3) worst case   Space : O(1)
- Say it, then immediately replace the scan with a Set lookup.
*/
function longestConsecutiveBrute(nums) {
  if (nums.length === 0) return 0;

  let best = 0;

  for (let i = 0; i < nums.length; i++) {
    let current = nums[i];
    let length = 1;

    // keep asking "is the next number anywhere in the array?"
    while (contains(nums, current + 1)) {
      current = current + 1;
      length++;
    }

    if (length > best) best = length;
  }

  return best;
}

function contains(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return true;
  }
  return false;
}

// ============================================================
// 4) BETTER - SORT AND COUNT RUNS
// ============================================================
/*
- After sorting, a run is just a stretch of neighbours differing by 1.
    Time  : O(n log n)   Space : O(n) for the copy
- Perfectly correct, but it fails the O(n) requirement the problem states.
*/
function longestConsecutiveSorted(nums) {
  if (nums.length === 0) return 0;

  const sorted = nums.slice().sort((a, b) => a - b);

  let best = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    // equal neighbours are duplicates - they neither extend nor break a run
    if (sorted[i] === sorted[i - 1]) continue;

    if (sorted[i] === sorted[i - 1] + 1) {
      run = run + 1;
      if (run > best) best = run;
    } else {
      // the chain broke, start counting again from this value
      run = 1;
    }
  }

  return best;
}

// ============================================================
// 5) OPTIMAL - SET, EXPAND ONLY FROM RUN STARTS (THE ONE TO WRITE)
// ============================================================
/*
- Set gives O(1) "is the next number present?".
- The x-1 guard means only the head of each run does any walking.
    Time  : O(n)   Space : O(n)
*/
function longestConsecutive(nums) {
  if (nums.length === 0) return 0;

  // the Set also removes duplicates, which must not extend a run
  const values = new Set(nums);
  let best = 0;

  for (const start of values) {
    // someone smaller exists, so this value is mid-run - skip it entirely
    if (values.has(start - 1)) continue;

    let current = start;
    let length = 1;

    // walk the run forward as far as it goes
    while (values.has(current + 1)) {
      current = current + 1;
      length++;
    }

    if (length > best) best = length;
  }

  return best;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(longestConsecutive([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutive([1, 2, 0, 1])); // 3   duplicate
console.log(longestConsecutive([])); // 0   empty
console.log(longestConsecutive([5])); // 1   single
console.log(longestConsecutive([-1, 0, 1])); // 3   negatives

console.log(longestConsecutiveBrute([100, 4, 200, 1, 3, 2])); // 4
console.log(longestConsecutiveSorted([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])); // 9
console.log(longestConsecutiveSorted([1, 2, 0, 1])); // 3

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    scan to expand   O(n^3) time, O(1) space
    sort and count   O(n log n) time, O(n) space
    set + run heads  O(n) time, O(n) space
- WHY THE NESTED LOOP IS STILL O(n):
    the inner while only runs when x-1 is absent, i.e. once per run. Across
    all runs that walks each value exactly once, so it is n + n, not n*n.
    This is the single thing the interviewer is checking.
- WHY A SET AND NOT SORTING:
    sorting produces a total order I do not need. I only need the successor
    test, which is one hash lookup.
- THE REAL TRAP:
    dropping the x-1 guard. The code still returns the right answer but
    silently becomes O(n^2), and that is the whole point of the question.
- FOLLOW-UPS:
    Longest Consecutive Sequence in a binary tree (LC 298),
    Missing Ranges (LC 163), Union-Find phrasing of the same problem
    (union x with x+1, answer is the largest component).
*/

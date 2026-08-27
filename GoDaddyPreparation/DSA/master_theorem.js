/*
Solve a Recurrence Relation + give the Time Complexity  [Q2.8, DAA]

Asked in the Pune Sept 2025 OA. They give you something like
  T(n) = 2T(n/2) + O(n)
and want the complexity plus the reasoning.

This file is mostly a comment sheet with runnable examples of each
case, so the recurrence and the real code sit side by side.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- A divide-and-conquer recurrence has one shape:
      T(n) = a * T(n / b) + f(n)
        a    = how many subproblems
        n/b  = how big each subproblem is
        f(n) = the work done OUTSIDE the recursion (split + merge)

- The whole question is a race between two things:
      the LEAVES of the recursion tree, n^(log_b a)
      the WORK PER LEVEL, f(n)
  Whichever grows faster wins.

- MASTER THEOREM, in plain words. Let c = log_b(a):
      case 1  f(n) is SMALLER than n^c   -> T(n) = O(n^c)
              (the leaves dominate)
      case 2  f(n) is ABOUT n^c          -> T(n) = O(n^c log n)
              (every level costs the same, and there are log n)
      case 3  f(n) is BIGGER than n^c    -> T(n) = O(f(n))
              (the top level dominates)

- If the theorem does not apply (uneven splits, subtracting
  instead of dividing), draw the RECURSION TREE and add up the
  levels. That always works.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
MERGE SORT, T(n) = 2T(n/2) + O(n)

  level 0                n            work n
  level 1        n/2         n/2      work n/2 + n/2 = n
  level 2     n/4  n/4    n/4  n/4    work n
  ...
  level log n  1 1 1 1 ... 1 1 1 1    work n

  every level costs n, and there are log n levels
  -> n log n

  by the theorem: a=2, b=2, c = log_2 2 = 1, f(n) = n = n^1
  f matches n^c  -> CASE 2 -> O(n log n)  ✓

BINARY SEARCH, T(n) = T(n/2) + O(1)

  a=1, b=2, c = log_2 1 = 0, so n^c = n^0 = 1
  f(n) = 1 matches -> CASE 2 -> O(1 * log n) = O(log n)  ✓

  tree view: one node per level, log n levels, O(1) each.

CASE 1 EXAMPLE, T(n) = 4T(n/2) + O(n)

  a=4, b=2, c = log_2 4 = 2, n^c = n^2
  f(n) = n is SMALLER -> CASE 1 -> O(n^2)
  the leaves (n^2 of them) dominate the cheap merging.

CASE 3 EXAMPLE, T(n) = 2T(n/2) + O(n^2)

  c = 1, n^c = n. f(n) = n^2 is BIGGER -> CASE 3 -> O(n^2)
  the very first split already costs more than everything below.

NOT DIVIDE AND CONQUER, T(n) = T(n-1) + O(1)
  the theorem does NOT apply (n-1, not n/b).
  Unroll it: T(n) = T(n-1) + 1 = T(n-2) + 2 = ... = O(n).
  Same for T(n) = T(n-1) + O(n) -> O(n^2)  (that is bubble sort).

FIBONACCI, T(n) = T(n-1) + T(n-2) + O(1) -> O(2^n) roughly
  (memoise it and the same code becomes O(n)).
*/

// ============================================================
// 3) CASE 2 - MERGE SORT   T(n) = 2T(n/2) + O(n) = O(n log n)
// ============================================================
function mergeSort(arr) {
  // one element (or none) is already sorted - the base case
  if (arr.length <= 1) return arr;

  const middle = Math.floor(arr.length / 2);

  // two subproblems, each of half the size  -> the "2T(n/2)"
  const left = mergeSort(arr.slice(0, middle));
  const right = mergeSort(arr.slice(middle));

  // merging is one linear pass  -> the "+ O(n)"
  return mergeTwo(left, right);
}

function mergeTwo(a, b) {
  const merged = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      merged.push(a[i]);
      i++;
    } else {
      merged.push(b[j]);
      j++;
    }
  }

  while (i < a.length) {
    merged.push(a[i]);
    i++;
  }
  while (j < b.length) {
    merged.push(b[j]);
    j++;
  }

  return merged;
}

// ============================================================
// 4) CASE 2 (a = 1) - BINARY SEARCH   T(n) = T(n/2) + O(1)
// ============================================================
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  // each round halves the window -> log n rounds
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return -1;
}

// ============================================================
// 5) NOT MASTER-FRIENDLY - T(n) = T(n-1) + O(1) = O(n)
// ============================================================
/*
- Subtracting instead of dividing, so unroll instead:
      T(n) = T(n-1) + 1 -> n steps -> O(n), with O(n) stack.
*/
function sumTo(n) {
  // base case ends the chain
  if (n <= 0) return 0;
  // one smaller subproblem plus constant work
  return n + sumTo(n - 1);
}

// ============================================================
// 6) EXPONENTIAL - T(n) = T(n-1) + T(n-2) + O(1)
// ============================================================
/*
- Two branches per call and depth n -> about O(1.618^n), usually
  quoted as O(2^n). Memoising collapses it to O(n).
*/
function fibSlow(n) {
  if (n <= 1) return n;
  return fibSlow(n - 1) + fibSlow(n - 2);
}

function fibFast(n) {
  // same recurrence, but each value is computed once
  const memo = new Array(n + 1).fill(-1);

  function recurse(x) {
    if (x <= 1) return x;
    if (memo[x] !== -1) return memo[x];
    memo[x] = recurse(x - 1) + recurse(x - 2);
    return memo[x];
  }

  return recurse(n);
}

// ============================================================
// 7) THE CHEAT SHEET (memorise this block)
// ============================================================
/*
  T(n) = a T(n/b) + f(n),   c = log_b a

  recurrence                 c        answer        example
  -----------------------------------------------------------------
  T(n) = T(n/2) + O(1)       0        O(log n)      binary search
  T(n) = T(n/2) + O(n)       0        O(n)          quickselect avg
  T(n) = 2T(n/2) + O(1)      1        O(n)          tree traversal
  T(n) = 2T(n/2) + O(n)      1        O(n log n)    merge sort
  T(n) = 2T(n/2) + O(n^2)    1        O(n^2)        case 3
  T(n) = 3T(n/2) + O(n)      1.58     O(n^1.58)     Karatsuba
  T(n) = 4T(n/2) + O(n)      2        O(n^2)        naive matrix
  T(n) = 7T(n/2) + O(n^2)    2.81     O(n^2.81)     Strassen
  T(n) = T(n-1) + O(1)       -        O(n)          linear recursion
  T(n) = T(n-1) + O(n)       -        O(n^2)        bubble/insertion
  T(n) = 2T(n-1) + O(1)      -        O(2^n)        subsets, hanoi
  T(n) = T(n-1)+T(n-2)+O(1)  -        O(2^n)        naive fibonacci

  Quicksort is the one to be careful with:
      average T(n) = 2T(n/2) + O(n)   -> O(n log n)
      worst   T(n) = T(n-1)  + O(n)   -> O(n^2)
*/

// ============================================================
// QUICK CHECK
// ============================================================
console.log(mergeSort([5, 2, 9, 1, 5, 6])); // [1,2,5,5,6,9]
console.log(mergeSort([])); // []
console.log(mergeSort([1])); // [1]
console.log(binarySearch([1, 3, 5, 7, 9], 7)); // 3
console.log(binarySearch([1, 3, 5, 7, 9], 4)); // -1
console.log(sumTo(5)); // 15
console.log(fibSlow(10)); // 55
console.log(fibFast(50)); // 12586269025

/*
============================================================
8) SAY OUT LOUD
============================================================
- HOW I ANSWER A RECURRENCE QUESTION IN 30 SECONDS:
    "T(n) = a T(n/b) + f(n). Compute c = log_b a, then compare
     f(n) with n^c: smaller means the leaves win and it is O(n^c),
     equal means every level costs the same so it is
     O(n^c log n), bigger means the top level wins and it is
     O(f(n))."
- THEN GIVE THE TREE PICTURE:
    Merge sort: every level costs n, there are log n levels,
    so n log n. That sentence usually satisfies them faster than
    quoting the theorem.
- WHEN THE THEOREM DOES NOT APPLY:
    uneven splits like T(n) = T(n/3) + T(2n/3) + O(n) (still
    O(n log n), by the tree), subtraction like T(n-1), or an
    f(n) that sits in the gap between the cases. Draw the tree
    or use substitution and induction.
- SPACE MATTERS TOO:
    Merge sort is O(n) auxiliary space, quicksort is O(log n)
    stack. Recursion depth is a real cost - they often ask this
    right after the time complexity.
- ITERATIVE VS RECURSIVE:
    Same complexity, different stack usage. Deep recursion on
    100k elements overflows; the iterative version does not.
*/

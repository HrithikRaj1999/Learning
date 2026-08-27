/*
Zig-Zag Merge of Two Sorted Arrays   [Q2.3.3]

Merge two sorted arrays, then output them as
  max, min, 2nd max, 2nd min, 3rd max, 3rd min, ...

  a = [1,4,7], b = [2,3,9]
  merged  = [1,2,3,4,7,9]
  zig-zag = [9,1,7,2,4,3]
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Two jobs, do them one after the other. Do not mix.

  JOB 1 - MERGE
    Both arrays are already sorted, so use the merge step of merge
    sort: two pointers, always take the smaller front element.
    O(n+m). Concat + sort would be O((n+m) log(n+m)) - worse, and
    it throws away the fact that they are sorted.

  JOB 2 - ZIG-ZAG
    The merged array is sorted, so the max is at the END and the
    min is at the FRONT. Two pointers again:
        take right (max), take left (min), right--, left++
    Stop when they cross. If the length is odd the middle element
    is taken once by whichever pointer arrives - guard with a
    length counter so it is not printed twice.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
a = [1,4,7]   b = [2,3,9]

MERGE (i on a, j on b)
  a:1 vs b:2 -> take 1     merged [1]
  a:4 vs b:2 -> take 2     merged [1,2]
  a:4 vs b:3 -> take 3     merged [1,2,3]
  a:4 vs b:9 -> take 4     merged [1,2,3,4]
  a:7 vs b:9 -> take 7     merged [1,2,3,4,7]
  a is empty -> drain b    merged [1,2,3,4,7,9]

ZIG-ZAG on [1,2,3,4,7,9]

  L                    R
  1   2   3   4   7   9

  take R=9   -> [9]          R->4
  take L=1   -> [9,1]        L->1
  take R=7   -> [9,1,7]      R->3
  take L=2   -> [9,1,7,2]    L->2
  take R=4   -> [9,1,7,2,4]  R->2
  take L=3   -> [9,1,7,2,4,3]  L->3, crossed, stop

ODD LENGTH, merged = [1,2,3]
  take R=3 -> [3]     R->1
  take L=1 -> [3,1]   L->1
  L === R now, both point at 2. Take it ONCE -> [3,1,2]
  (the length guard is what stops the double take)
*/

// ============================================================
// 3) BRUTE FORCE - CONCAT AND SORT, THEN PICK
// ============================================================
/*
- Ignores that the inputs are sorted.
    Time  : O((n+m) log(n+m))   Space : O(n+m)
- Say it, then say why the merge step is better.
*/
function zigzagMergeBrute(a, b) {
  const merged = [...a, ...b].sort((x, y) => x - y);
  const result = [];

  let left = 0;
  let right = merged.length - 1;

  while (result.length < merged.length) {
    result.push(merged[right]);
    right--;
    if (result.length < merged.length) {
      result.push(merged[left]);
      left++;
    }
  }

  return result;
}

// ============================================================
// 4) OPTIMAL - MERGE STEP, THEN TWO-POINTER ZIG-ZAG
// ============================================================
/*
- STEP 1: classic merge, always take the smaller head.
- STEP 2: drain whatever is left in the other array.
- STEP 3: walk from both ends, big first, small second.
- STEP 4: the length counter is what protects the middle element
    of an odd-length array from being taken twice.
    Time  : O(n + m) - each element is touched twice, still linear.
    Space : O(n + m) for the merged array + output.
*/
function mergeSorted(a, b) {
  const merged = [];
  let i = 0;
  let j = 0;

  // take the smaller of the two current heads
  while (i < a.length && j < b.length) {
    if (a[i] <= b[j]) {
      merged.push(a[i]);
      i++;
    } else {
      merged.push(b[j]);
      j++;
    }
  }

  // one array is finished, the other is already sorted - just copy
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

function zigzagMerge(a, b) {
  const merged = mergeSorted(a, b);
  const total = merged.length;
  const result = [];

  let left = 0;
  let right = total - 1;

  while (result.length < total) {
    // biggest remaining
    result.push(merged[right]);
    right--;

    // smallest remaining - but only if the array is not full yet,
    // otherwise an odd-length middle element gets taken twice
    if (result.length < total) {
      result.push(merged[left]);
      left++;
    }
  }

  return result;
}

// ============================================================
// 5) VARIANT THEY SOMETIMES WANT - MIN FIRST
// ============================================================
/*
- Same code, start with left instead of right. Ask which order
  they mean before writing anything.
*/
function zigzagMergeMinFirst(a, b) {
  const merged = mergeSorted(a, b);
  const total = merged.length;
  const result = [];

  let left = 0;
  let right = total - 1;

  while (result.length < total) {
    result.push(merged[left]);
    left++;
    if (result.length < total) {
      result.push(merged[right]);
      right--;
    }
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(mergeSorted([1, 4, 7], [2, 3, 9])); // [1,2,3,4,7,9]
console.log(zigzagMerge([1, 4, 7], [2, 3, 9])); // [9,1,7,2,4,3]
console.log(zigzagMerge([1, 2], [3])); // [3,1,2]   odd length
console.log(zigzagMerge([], [5, 6])); // [6,5]
console.log(zigzagMerge([], [])); // []
console.log(zigzagMerge([2], [])); // [2]
console.log(zigzagMergeMinFirst([1, 4, 7], [2, 3, 9])); // [1,9,2,7,3,4]
console.log(zigzagMergeBrute([1, 4, 7], [2, 3, 9])); // [9,1,7,2,4,3]

/*
============================================================
6) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Merge   : O(n + m) time, O(n + m) space for the output.
    Zig-zag : O(n + m) time, O(1) extra on top of the output.
    Total O(n + m). Concat+sort would be O(N log N) - strictly
    worse, and it wastes the sortedness that was handed to me.
- THE TWO EDGE CASES THEY POKE AT:
    Odd total length - the middle element must appear once.
    One array empty - the drain loops handle it with no special
    case needed.
- DUPLICATES: `a[i] <= b[j]` keeps equal elements in a-then-b
  order, which makes the merge stable. Mention it, it is free.
- IN-PLACE FOLLOW-UP (LC 88 style):
    If they say "merge b into a, which has extra space at the
    end", fill from the BACK with three pointers. Filling from
    the front would overwrite unread values of a.
- O(1) SPACE ZIG-ZAG FOLLOW-UP:
    A sorted array can be rearranged into max/min order in place
    by encoding two numbers in one slot:
        arr[i] = arr[i] + (arr[chosen] % maxValue) * maxValue
    then divide everything by maxValue at the end. Only mention
    this if they push for O(1) - it needs a value cap.
- FOLLOW-UPS:
    Merge k sorted arrays (min-heap, O(N log k)), wiggle sort
    (LC 280/324 - similar shape, different rule), merge two
    sorted linked lists (LC 21).
*/

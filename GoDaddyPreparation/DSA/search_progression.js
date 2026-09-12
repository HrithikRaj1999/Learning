/*
Search a Target: linear -> hashing -> binary search   [Q2.6.3]

They do NOT want the optimal answer straight away. They want the
PROGRESSION, each step with its complexity, out loud:

  1. linear scan   O(n) time, O(1) space, works on anything
  2. hash set      O(n) build + O(1) per query, O(n) space
  3. binary search O(log n) per query, O(1) space, needs SORTED data

Then the usual twist: the array is sorted but ROTATED (LC 33).
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- LINEAR: look at every element. No assumptions at all. This is the
  baseline you must state before improving anything.

- HASH SET: pay O(n) once to build the set, then every later query
  is O(1). Best when there are MANY queries on the same data.
  Costs O(n) memory, and it cannot answer "where is it" unless I
  store index -> value in a Map.

- BINARY SEARCH: needs SORTED data. Look at the middle. The target
  is either the middle, or in the left half, or in the right half.
  Each step throws away half the array -> log n steps.
      low, high, mid = low + (high - low) / 2
      the +(high-low)/2 form avoids integer overflow in Java/C++.

- ROTATED SORTED ARRAY: one half is ALWAYS still sorted. Find which
  half is sorted, check if the target lies inside it, then throw
  the other half away. Still O(log n).

- Choosing: one query on unsorted data -> linear. Many queries ->
  hash. Sorted data, or you need neighbours/ranges -> binary.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
BINARY SEARCH, arr = [1,3,5,7,9,11], target = 9

  index  0  1  2  3  4  5
  value  1  3  5  7  9 11

  low=0 high=5  mid=2 -> 5  < 9 -> go right, low = 3
  low=3 high=5  mid=4 -> 9  = 9 -> FOUND at index 4

  3 comparisons instead of 5. On a million elements it is 20
  instead of 1,000,000.

TARGET NOT PRESENT, target = 6
  low=0 high=5 mid=2 -> 5 < 6 -> low=3
  low=3 high=5 mid=4 -> 9 > 6 -> high=3
  low=3 high=3 mid=3 -> 7 > 6 -> high=2
  low=3 > high=2 -> loop ends -> return -1

ROTATED, arr = [4,5,6,7,0,1,2], target = 0

  index  0 1 2 3 4 5 6
  value  4 5 6 7 0 1 2
                 ^ the rotation point

  low=0 high=6 mid=3 -> 7
     left half [4..7] is sorted (4 <= 7)
     is 0 between 4 and 7? no -> throw the left away, low = 4
  low=4 high=6 mid=5 -> 1
     left half [0,1] is sorted (0 <= 1)
     is 0 between 0 and 1? yes -> throw the right away, high = 4
  low=4 high=4 mid=4 -> 0 = target -> FOUND at index 4
*/

// ============================================================
// 3) STEP 1 - LINEAR SCAN
// ============================================================
/*
    Time  : O(n) per query   Space : O(1)
- Works on unsorted data, linked lists, streams. Never needs setup.
*/
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// ============================================================
// 4) STEP 2 - HASH SET / MAP (MANY QUERIES)
// ============================================================
/*
- Build once, query many times.
    Build : O(n) time, O(n) space
    Query : O(1) average, O(n) worst if every key collides.
- A Map value -> index also gives back the position.
*/
function buildIndex(arr) {
  const positions = new Map();
  for (let i = 0; i < arr.length; i++) {
    // keep the FIRST index if the value repeats
    if (!positions.has(arr[i])) positions.set(arr[i], i);
  }
  return positions;
}

function hashSearch(positions, target) {
  return positions.has(target) ? positions.get(target) : -1;
}

// ============================================================
// 5) STEP 3 - BINARY SEARCH (SORTED DATA)
// ============================================================
/*
- STEP 1: low = 0, high = n-1. The answer always lives inside
    [low, high], so the loop condition is low <= high.
- STEP 2: mid = low + (high - low) / 2, floored.
- STEP 3: equal -> done. Smaller -> search right. Bigger -> left.
- STEP 4: low > high means the value is absent.
    Time  : O(log n)   Space : O(1)
*/
function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  // <= because low === high is still one unchecked element
  while (low <= high) {
    // written this way so it cannot overflow in Java/C++
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === target) return mid;

    if (arr[mid] < target) {
      // everything up to mid is too small - drop it
      low = mid + 1;
    } else {
      // everything from mid on is too big - drop it
      high = mid - 1;
    }
  }

  return -1;
}

// ============================================================
// 6) BINARY SEARCH, RECURSIVE (SAME THING)
// ============================================================
/*
    Time : O(log n)   Space : O(log n) stack.
*/
function binarySearchRecursive(arr, target, low = 0, high = arr.length - 1) {
  // the window is empty, so the target is not here
  if (low > high) return -1;

  const mid = low + Math.floor((high - low) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, high);
  return binarySearchRecursive(arr, target, low, mid - 1);
}

// ============================================================
// 7) TWIST - SEARCH IN A ROTATED SORTED ARRAY (LC 33)
// ============================================================
/*
- KEY FACT: after one rotation, at least one half around mid is
  still perfectly sorted. Identify it, then decide.
    Time  : O(log n)   Space : O(1)
*/
function searchRotated(arr, target) {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === target) return mid;

    // is the LEFT half sorted?
    if (arr[low] <= arr[mid]) {
      // target inside the sorted left half -> keep it
      if (arr[low] <= target && target < arr[mid]) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    } else {
      // then the RIGHT half must be the sorted one
      if (arr[mid] < target && target <= arr[high]) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
  }

  return -1;
}

// ============================================================
// 8) BONUS - FIRST AND LAST POSITION (DUPLICATES, LC 34)
// ============================================================
/*
- Same loop, but on a match do NOT stop: record it and keep
  shrinking towards the side you want.
    Time  : O(log n) per side.
*/
function firstOccurrence(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  let answer = -1;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);

    if (arr[mid] === target) {
      // found one, but an earlier one may exist on the left
      answer = mid;
      high = mid - 1;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return answer;
}

// ============================================================
// QUICK CHECK
// ============================================================
const sorted = [1, 3, 5, 7, 9, 11];

console.log(linearSearch([4, 2, 9], 9)); // 2
console.log(linearSearch([4, 2, 9], 5)); // -1

const index = buildIndex([4, 2, 9, 2]);
console.log(hashSearch(index, 2)); // 1  (first occurrence)
console.log(hashSearch(index, 7)); // -1

console.log(binarySearch(sorted, 9)); // 4
console.log(binarySearch(sorted, 1)); // 0
console.log(binarySearch(sorted, 11)); // 5
console.log(binarySearch(sorted, 6)); // -1
console.log(binarySearch([], 1)); // -1
console.log(binarySearchRecursive(sorted, 7)); // 3

console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 0)); // 4
console.log(searchRotated([4, 5, 6, 7, 0, 1, 2], 3)); // -1
console.log(searchRotated([1], 1)); // 0

console.log(firstOccurrence([1, 2, 2, 2, 3], 2)); // 1

/*
============================================================
9) SAY OUT LOUD  (this IS the question)
============================================================
- THE SCRIPT THEY WANT:
    "Simplest correct answer is a linear scan, O(n) time, O(1)
     space, and it needs no assumptions.
     If I get many queries on the same data, I build a hash set
     once for O(n) and then each query is O(1) average, at the
     cost of O(n) memory.
     If the data is sorted, binary search gives O(log n) per query
     with O(1) space and no preprocessing at all."
    Do not skip to binary search silently - the progression IS
    what is being graded.
- WHEN EACH ONE WINS:
    one-off query, unsorted     -> linear
    many queries, unsorted      -> hash (build once)
    sorted, or need range/neighbour queries -> binary
    data changes constantly     -> balanced BST / skip list
- THE CLASSIC BINARY SEARCH BUGS:
    `low < high` instead of `<=` misses the last element.
    `(low + high) / 2` overflows in Java/C++ - use
    `low + (high - low) / 2`.
    Forgetting mid +/- 1 gives an infinite loop.
- SORTING FIRST IS NOT FREE:
    O(n log n) to sort just to run one O(log n) search is worse
    than a single O(n) scan. Sorting pays off only across many
    queries.
- FOLLOW-UPS THEY ADD:
    Rotated sorted array (LC 33), find minimum in rotated array
    (LC 153), first/last position (LC 34), search a 2D matrix
    (LC 74 - treat it as one long sorted array), and
    "binary search the ANSWER" problems like Koko eating bananas
    (LC 875) - that is the pattern worth naming.
*/

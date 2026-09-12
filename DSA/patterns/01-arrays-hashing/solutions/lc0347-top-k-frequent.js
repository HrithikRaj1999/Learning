/*
Top K Frequent Elements (LC 347)

Return the k values that appear most often, any order.

  nums = [1,1,1,2,2,3], k = 2  -> [1,2]   (1 x3, 2 x2, 3 x1)
  nums = [1],           k = 1  -> [1]
  nums = [4,4,5,5,6],   k = 2  -> [4,5]   (both x2, 6 x1)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Step one is never in doubt: count everything with a Map. O(n).
- Step two is the real question: how do I pull the top k counts out?
- The unlock: a count can never exceed n. So there are only n+1 possible
  counts, and I can use the COUNT ITSELF as an array index. That is bucket
  sort, and it removes all sorting and all heap work.

- The ladder:
    1. count, sort all entries by count, take k     O(n log n)
    2. count, push into a size-k min heap           O(n log k)
    3. count, bucket by frequency, walk buckets     O(n)
       from high to low

- Traps:
    - buckets array needs length n+1, because a count can be exactly n.
    - stop as soon as the result has k values, otherwise ties overfill it.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
BUCKET view, nums = [1,1,1,2,2,3], k = 2,  n = 6

  count map:   1 -> 3,   2 -> 2,   3 -> 1

  buckets, index = frequency, length n+1 = 7

    index    0    1    2    3    4    5    6
    holds   []   [3]  [2]  [1]  []   []   []
                  ^    ^    ^
                  |    |    value 1 appeared 3 times
                  |    value 2 appeared 2 times
                  value 3 appeared 1 time

  walk from index 6 down to 0, collecting until I have k = 2:

    index 6..4  empty
    index 3     take 1        result = [1]        size 1 < 2, keep going
    index 2     take 2        result = [1,2]      size 2 == 2, STOP

  answer [1,2]

  INVARIANT: a higher index means a strictly higher frequency, so walking
  right-to-left visits values in exact decreasing-frequency order.

TIE case, nums = [4,4,5,5,6], k = 2,  n = 5

    index    0    1    2    3    4    5
    holds   []   [6]  [4,5] []  []   []

  index 5..3 empty
  index 2   take 4 -> [4]      size 1
            take 5 -> [4,5]    size 2 -> STOP
  answer [4,5]   (the k-cut inside a tie is arbitrary, which is allowed)
*/

// ============================================================
// 3) BRUTE FORCE - COUNT THEN SORT EVERYTHING
// ============================================================
/*
- Build the count map, sort the entries by count descending, slice k.
    Time  : O(n log n)   Space : O(n)
- Two lines of logic, always accepted, and the honest first answer.
*/
function topKFrequentSort(nums, k) {
  if (nums.length === 0 || k <= 0) return [];

  const counts = new Map();
  for (let i = 0; i < nums.length; i++) {
    counts.set(nums[i], (counts.get(nums[i]) || 0) + 1);
  }

  const entries = Array.from(counts.entries());
  // highest count first
  entries.sort((a, b) => b[1] - a[1]);

  const result = [];
  for (let i = 0; i < k && i < entries.length; i++) result.push(entries[i][0]);

  return result;
}

// ============================================================
// 4) BETTER - SIZE K MIN HEAP
// ============================================================
/*
- Keep only k entries. If a new count beats the smallest kept count, evict.
    Time  : O(n log k)   Space : O(n + k)
- This is the answer when the data is a STREAM and n does not fit in memory.
- Written as a tiny explicit heap so the file runs with plain node.
*/
function topKFrequentHeap(nums, k) {
  if (nums.length === 0 || k <= 0) return [];

  const counts = new Map();
  for (let i = 0; i < nums.length; i++) {
    counts.set(nums[i], (counts.get(nums[i]) || 0) + 1);
  }

  // heap holds [value, count], smallest count sits at index 0
  const heap = [];

  for (const [value, count] of counts) {
    heapPush(heap, [value, count]);
    // over budget - drop the weakest of the k+1 entries
    if (heap.length > k) heapPop(heap);
  }

  const result = [];
  for (let i = 0; i < heap.length; i++) result.push(heap[i][0]);
  return result;
}

function heapPush(heap, item) {
  heap.push(item);
  let child = heap.length - 1;

  while (child > 0) {
    const parent = Math.floor((child - 1) / 2);
    if (heap[parent][1] <= heap[child][1]) break;
    const swap = heap[parent];
    heap[parent] = heap[child];
    heap[child] = swap;
    child = parent;
  }
}

function heapPop(heap) {
  const top = heap[0];
  const last = heap.pop();

  if (heap.length > 0) {
    heap[0] = last;
    let parent = 0;

    while (true) {
      const left = 2 * parent + 1;
      const right = 2 * parent + 2;
      let smallest = parent;

      if (left < heap.length && heap[left][1] < heap[smallest][1]) smallest = left;
      if (right < heap.length && heap[right][1] < heap[smallest][1]) smallest = right;
      if (smallest === parent) break;

      const swap = heap[parent];
      heap[parent] = heap[smallest];
      heap[smallest] = swap;
      parent = smallest;
    }
  }

  return top;
}

// ============================================================
// 5) OPTIMAL - BUCKET SORT BY FREQUENCY (THE ONE TO WRITE)
// ============================================================
/*
- A frequency is between 1 and n, so I can index by it directly.
  No sorting, no heap, no comparisons at all.
    Time  : O(n)   Space : O(n)
*/
function topKFrequent(nums, k) {
  if (nums.length === 0 || k <= 0) return [];

  const counts = new Map();
  for (let i = 0; i < nums.length; i++) {
    counts.set(nums[i], (counts.get(nums[i]) || 0) + 1);
  }

  // buckets[f] = every value that appeared exactly f times
  const buckets = new Array(nums.length + 1);
  for (let i = 0; i < buckets.length; i++) buckets[i] = [];

  for (const [value, count] of counts) buckets[count].push(value);

  const result = [];

  // highest frequency first
  for (let f = buckets.length - 1; f >= 1; f--) {
    for (let j = 0; j < buckets[f].length; j++) {
      result.push(buckets[f][j]);
      // exactly k collected - anything further is strictly less frequent
      if (result.length === k) return result;
    }
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2)); // [1,2]
console.log(topKFrequent([1], 1)); // [1]
console.log(topKFrequent([4, 4, 5, 5, 6], 2)); // [4,5]
console.log(topKFrequent([], 3)); // []   empty
console.log(topKFrequent([1, 2, 3], 0)); // []   k = 0

console.log(topKFrequentSort([1, 1, 1, 2, 2, 3], 2)); // [1,2]
console.log(topKFrequentHeap([1, 1, 1, 2, 2, 3], 2).sort()); // [1,2]
console.log(topKFrequentHeap([4, 4, 5, 5, 6], 2).sort()); // [4,5]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    count + sort    O(n log n) time, O(n) space
    count + heap    O(n log k) time, O(n) space
    count + buckets O(n) time, O(n) space
- WHY BUCKET SORT IS ALLOWED:
    frequencies are bounded by n, so they are small integers and can be
    array indices. Bounded keys is exactly when counting sort beats
    comparison sort's n log n floor.
- WHEN I WOULD STILL PICK THE HEAP:
    a stream, or n too large to hold. The heap needs only O(k) live state.
- THE REAL TRAP:
    buckets must be length n+1 (a value can appear all n times), and I must
    return the moment result.length hits k or ties will overshoot.
- FOLLOW-UPS:
    Sort Characters By Frequency (LC 451, same buckets),
    Kth Largest Element (LC 215, heap or quickselect),
    Top K Frequent Words (LC 692, adds a tie-break on the word itself).
*/

/*
Top-K with a Heap (LC 215 kth largest, LC 347 top k frequent) [Q2.4.1]

A) Kth LARGEST element in an array.
   [3,2,1,5,6,4], k = 2 -> 5
B) Top k most FREQUENT elements.
   [1,1,1,2,2,3], k = 2 -> [1,2]

JS has no built-in heap, so I write a small one. That is part of
the answer here - they want to see you know how a heap works.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Sorting gives the answer in O(n log n), but I only need k items,
  not a full order. A heap gives me exactly that.

- KEY IDEA for "k largest": keep a MIN heap of size k.
      the smallest of my k best sits on top
      new number bigger than the top -> pop the top, push the new one
      heap size never passes k
  At the end the top IS the kth largest.
  (For "k smallest" it is the mirror: a MAX heap of size k.)

- Why min-heap for largest? Because I need cheap access to the
  WEAKEST of my current champions, to kick it out.

- Heap in one line: a binary tree stored in an array.
      parent of i = (i-1)/2 , children of i = 2i+1 and 2i+2
      push -> put at the end, bubble UP
      pop  -> take root, move the last item to the root, sink DOWN
  Both are O(log n) because the tree height is log n.

- Frequencies (LC 347): count with a Map first, then the exact same
  size-k heap, comparing counts instead of values.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
[3,2,1,5,6,4], k = 2, MIN heap of size 2

  push 3     heap [3]
  push 2     heap [2,3]          size = k now
  see 1      1 < top(2) -> ignore, it can never be top-2
  see 5      5 > 2 -> pop 2, push 5 -> heap [3,5]
  see 6      6 > 3 -> pop 3, push 6 -> heap [5,6]
  see 4      4 < 5 -> ignore
  top = 5 = 2nd largest  ✓

HEAP AS AN ARRAY, heap = [5,6,9] (min at index 0)

      index: 0   1   2
      value: 5   6   9

           5            <- index 0
          / \
         6   9          <- index 1, 2
      children of 0 are 1 and 2, parent of 2 is (2-1)/2 = 0

  push 4:  array [5,6,9,4], 4 sits at index 3
           parent of 3 is (3-1)/2 = 1 -> value 6
           4 < 6 -> swap  -> [5,4,9,6]
           parent of 1 is 0 -> value 5
           4 < 5 -> swap  -> [4,5,9,6]   done, 4 is the new min

  pop:     root 4 leaves, last item 6 moves to the root
           [6,5,9]
           children 5 and 9, smallest is 5, 6 > 5 -> swap
           [5,6,9]   heap property restored

LC 347, [1,1,1,2,2,3], k = 2
  counts: 1->3, 2->2, 3->1
  min heap by count, size 2:
     push (1,3)          [ (1,3) ]
     push (2,2)          [ (2,2), (1,3) ]   top is the weakest
     see (3,1): 1 < 2 -> ignore
  answer = the heap contents = [1,2]
*/

// ============================================================
// 3) THE MIN HEAP (WRITTEN BY HAND)
// ============================================================
/*
- One array + one compare function, so the same class works for
  plain numbers and for [value, count] pairs.
    push : O(log n)   pop : O(log n)   peek : O(1)
*/
class MinHeap {
  constructor(compare) {
    this.items = [];
    // negative means a is "smaller" and belongs closer to the root
    this.compare = compare;
  }

  size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(value) {
    // put it at the end, then walk it up to its place
    this.items.push(value);
    this.bubbleUp(this.items.length - 1);
  }

  pop() {
    if (this.items.length === 0) return undefined;

    const root = this.items[0];
    const last = this.items.pop();

    // move the last item to the root and sink it down
    if (this.items.length > 0) {
      this.items[0] = last;
      this.sinkDown(0);
    }

    return root;
  }

  bubbleUp(startIndex) {
    let index = startIndex;

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);

      // parent is already smaller, the heap rule holds
      if (this.compare(this.items[index], this.items[parent]) >= 0) break;

      this.swap(index, parent);
      index = parent;
    }
  }

  sinkDown(startIndex) {
    let index = startIndex;
    const length = this.items.length;

    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;

      // find the smallest among the node and its two children
      if (left < length && this.compare(this.items[left], this.items[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.compare(this.items[right], this.items[smallest]) < 0) {
        smallest = right;
      }

      // already in the right place
      if (smallest === index) break;

      this.swap(index, smallest);
      index = smallest;
    }
  }

  swap(i, j) {
    const temp = this.items[i];
    this.items[i] = this.items[j];
    this.items[j] = temp;
  }
}

// ============================================================
// 4) A) KTH LARGEST - BRUTE FORCE (SORT)
// ============================================================
/*
- Sort descending, answer is index k-1.
    Time  : O(n log n)   Space : O(n) for the copy.
- Always say this first, then improve.
*/
function findKthLargestSort(nums, k) {
  const sorted = [...nums].sort((a, b) => b - a);
  return sorted[k - 1];
}

// ============================================================
// 5) A) KTH LARGEST - OPTIMAL FOR STREAMS (MIN HEAP OF SIZE K)
// ============================================================
/*
- Keep only the k biggest seen so far. Heap never grows past k.
    Time  : O(n log k) - better than sorting when k << n.
    Space : O(k) - and this is the version that works on a STREAM
            where n does not fit in memory.
*/
function findKthLargest(nums, k) {
  const heap = new MinHeap((a, b) => a - b);

  for (const num of nums) {
    if (heap.size() < k) {
      // still filling up the first k candidates
      heap.push(num);
      continue;
    }

    // heap is full: only numbers bigger than the weakest matter
    if (num > heap.peek()) {
      heap.pop();
      heap.push(num);
    }
  }

  // the weakest of the k best IS the kth largest
  return heap.peek();
}

// ============================================================
// 6) A) FASTEST AVERAGE - QUICKSELECT (MENTION, THEN CODE IF ASKED)
// ============================================================
/*
- Partition like quicksort, but recurse into ONE side only.
    Time  : O(n) average, O(n^2) worst (random pivot fixes it).
    Space : O(1) with the iterative version.
- Not for streams, and it reorders the input.
*/
function findKthLargestQuickselect(nums, k) {
  const arr = [...nums];
  // kth largest = index (n - k) in ascending order
  const targetIndex = arr.length - k;

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const pivotIndex = partition(arr, left, right);

    if (pivotIndex === targetIndex) return arr[pivotIndex];
    if (pivotIndex < targetIndex) {
      left = pivotIndex + 1; // answer is on the right
    } else {
      right = pivotIndex - 1; // answer is on the left
    }
  }

  return -1;
}

function partition(arr, left, right) {
  // random pivot keeps the worst case away from sorted inputs
  const randomIndex = left + Math.floor(Math.random() * (right - left + 1));
  swapInArray(arr, randomIndex, right);

  const pivot = arr[right];
  let boundary = left;

  for (let i = left; i < right; i++) {
    // everything smaller than the pivot moves to the left side
    if (arr[i] < pivot) {
      swapInArray(arr, i, boundary);
      boundary++;
    }
  }

  swapInArray(arr, boundary, right);
  return boundary;
}

function swapInArray(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// ============================================================
// 7) B) TOP K FREQUENT - MAP + MIN HEAP BY COUNT (LC 347)
// ============================================================
/*
- STEP 1: count with a Map.       O(n)
- STEP 2: min heap of size k over [value, count], comparing counts.
    Time  : O(n log k)   Space : O(n) for the map.
*/
function topKFrequent(nums, k) {
  const counts = new Map();
  for (const num of nums) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  // compare on the count, which is index 1 of the pair
  const heap = new MinHeap((a, b) => a[1] - b[1]);

  for (const [value, count] of counts) {
    if (heap.size() < k) {
      heap.push([value, count]);
      continue;
    }

    // kick out the least frequent of the current champions
    if (count > heap.peek()[1]) {
      heap.pop();
      heap.push([value, count]);
    }
  }

  return heap.items.map((pair) => pair[0]);
}

// ============================================================
// 8) B) TOP K FREQUENT IN O(n) - BUCKET SORT
// ============================================================
/*
- A count can never exceed n, so make n+1 buckets indexed BY count
  and drop each value into its bucket. Then read buckets from the
  back until k values are collected.
    Time  : O(n)   Space : O(n)
- This beats the heap. Say it when they ask "can you do better
  than n log k".
*/
function topKFrequentBuckets(nums, k) {
  const counts = new Map();
  for (const num of nums) {
    counts.set(num, (counts.get(num) || 0) + 1);
  }

  // buckets[c] = every value that appeared exactly c times
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [value, count] of counts) {
    buckets[count].push(value);
  }

  const result = [];
  // walk from the highest possible count downwards
  for (let count = buckets.length - 1; count >= 1 && result.length < k; count--) {
    for (const value of buckets[count]) {
      result.push(value);
      if (result.length === k) break;
    }
  }

  return result;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(findKthLargest([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4
console.log(findKthLargest([1], 1)); // 1
console.log(findKthLargestSort([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargestQuickselect([3, 2, 1, 5, 6, 4], 2)); // 5
console.log(findKthLargestQuickselect([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)); // 4

console.log(topKFrequent([1, 1, 1, 2, 2, 3], 2).sort()); // [1,2]
console.log(topKFrequent([1], 1)); // [1]
console.log(topKFrequentBuckets([1, 1, 1, 2, 2, 3], 2)); // [1,2]
console.log(topKFrequentBuckets([4, 4, 4, 5, 5, 6], 1)); // [4]

/*
============================================================
9) SAY OUT LOUD
============================================================
- WHEN A HEAP BEATS SORTING (the sentence they want):
    Sorting is O(n log n) and gives me a full order I do not need.
    A size-k heap is O(n log k) and only ever holds k items, so
    when k is much smaller than n it wins on both time and space -
    and it is the only one that works on a stream I cannot store.
- WHY A MIN HEAP FOR THE K LARGEST:
    The top of a min heap is the WEAKEST champion, which is exactly
    the one I want to evict. A max heap would give me the strongest,
    which I never need to remove.
- COMPLEXITY LADDER FOR KTH LARGEST:
    Sort        O(n log n) time, O(n) space
    Min heap    O(n log k) time, O(k) space, streaming friendly
    Quickselect O(n) average, O(n^2) worst, in place, not streaming
- COMPLEXITY LADDER FOR TOP K FREQUENT:
    Sort by count O(n log n) -> heap O(n log k) -> buckets O(n).
    The bucket trick works only because a count is bounded by n.
- HEAP INTERNALS THEY MAY PROBE:
    Array-backed binary tree, parent (i-1)/2, children 2i+1 / 2i+2.
    push bubbles up, pop moves the last leaf to the root and sinks.
    Building a heap from an array in one go is O(n), not O(n log n).
- TIES: with equal counts the order is unspecified - confirm that
  with the interviewer instead of guessing.
- FOLLOW-UPS:
    K closest points to origin (LC 973), merge k sorted lists
    (LC 23), median from a data stream (LC 295 - two heaps),
    sliding window maximum (LC 239 - deque, not heap).
*/

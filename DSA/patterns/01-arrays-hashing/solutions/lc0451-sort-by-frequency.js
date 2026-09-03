/*
Sort Characters By Frequency (LC 451)

Rebuild the string so the most frequent characters come first.
Ties may be in any order.

  "tree"   -> "eert" or "eetr"   (e x2, r x1, t x1)
  "cccaaa" -> "cccaaa" or "aaaccc"
  "Aabb"   -> "bbAa" or "bbaA"   (case matters, A != a)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Count each character, then print each character count-many times, in
  order of decreasing count.
- The only interesting part is the ordering step. A frequency is at most
  the string length, so once again the count can be an array index -
  bucket sort, no comparisons.

- The ladder:
    1. count, sort the entries by count      O(n log n)
    2. count, max heap pop k times           O(n log n) but streams well
    3. count, bucket by frequency, walk      O(n)
       buckets from high to low

- Traps:
    - characters are NOT just a-z here (upper case, digits), so use a Map,
      not a 26-slot array.
    - build the answer with an array of pieces and join once; repeated
      string += in a loop is quadratic in some engines.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
BUCKET view, s = "tree",  n = 4

  count map:   t -> 1,  r -> 1,  e -> 2

  buckets, index = frequency, length n+1 = 5

    index    0     1       2     3    4
    holds   []   [t,r]    [e]   []   []
                   ^       ^
                   |       e appeared 2 times
                   t and r each appeared 1 time

  walk index 4 down to 1:
    index 4  empty
    index 3  empty
    index 2  "e" repeated 2 times -> "ee"     out = ["ee"]
    index 1  "t" repeated 1 time  -> "t"      out = ["ee","t"]
             "r" repeated 1 time  -> "r"      out = ["ee","t","r"]

  join -> "eetr"

  INVARIANT: index = exact frequency, so right-to-left is exactly
  decreasing frequency order. No comparison ever happens.

CASE SENSITIVITY, s = "Aabb",  n = 4

  count map:  A -> 1,  a -> 1,  b -> 2      A and a are different keys

    index    0     1       2     3    4
    holds   []   [A,a]   [b]    []   []

  index 2 -> "bb",  index 1 -> "A", "a"   ->  "bbAa"
*/

// ============================================================
// 3) BRUTE FORCE - COUNT THEN SORT THE ENTRIES
// ============================================================
/*
- Count with a Map, sort the (char, count) pairs by count descending,
  then expand each pair.
    Time  : O(n log n)   Space : O(n)
- Short, safe, and accepted. Good first answer.
*/
function frequencySortByCompare(s) {
  if (s.length === 0) return "";

  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);

  const entries = Array.from(counts.entries());
  // most frequent first
  entries.sort((a, b) => b[1] - a[1]);

  const pieces = [];
  for (let i = 0; i < entries.length; i++) {
    pieces.push(entries[i][0].repeat(entries[i][1]));
  }

  return pieces.join("");
}

// ============================================================
// 4) BETTER - MAX HEAP, POP THE BIGGEST COUNT EACH TIME
// ============================================================
/*
- Same idea, but the ordering comes from a heap instead of a full sort.
    Time  : O(n + d log d), d = distinct characters   Space : O(n)
- Worth knowing because it is the shape that survives on a stream, and it
  is the same skeleton as Task Scheduler and Reorganize String.
*/
function frequencySortHeap(s) {
  if (s.length === 0) return "";

  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);

  // max heap of [char, count], biggest count at index 0
  const heap = [];
  for (const entry of counts) maxHeapPush(heap, entry);

  const pieces = [];
  while (heap.length > 0) {
    const [ch, count] = maxHeapPop(heap);
    pieces.push(ch.repeat(count));
  }

  return pieces.join("");
}

function maxHeapPush(heap, item) {
  heap.push(item);
  let child = heap.length - 1;

  while (child > 0) {
    const parent = Math.floor((child - 1) / 2);
    if (heap[parent][1] >= heap[child][1]) break;
    const swap = heap[parent];
    heap[parent] = heap[child];
    heap[child] = swap;
    child = parent;
  }
}

function maxHeapPop(heap) {
  const top = heap[0];
  const last = heap.pop();

  if (heap.length > 0) {
    heap[0] = last;
    let parent = 0;

    while (true) {
      const left = 2 * parent + 1;
      const right = 2 * parent + 2;
      let largest = parent;

      if (left < heap.length && heap[left][1] > heap[largest][1]) largest = left;
      if (right < heap.length && heap[right][1] > heap[largest][1]) largest = right;
      if (largest === parent) break;

      const swap = heap[parent];
      heap[parent] = heap[largest];
      heap[largest] = swap;
      parent = largest;
    }
  }

  return top;
}

// ============================================================
// 5) OPTIMAL - BUCKET SORT BY FREQUENCY (THE ONE TO WRITE)
// ============================================================
/*
- Frequencies live in [1, n], so index by them and walk downward.
    Time  : O(n)   Space : O(n)
*/
function frequencySort(s) {
  if (s.length === 0) return "";

  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);

  // buckets[f] = every character that appeared exactly f times
  const buckets = new Array(s.length + 1);
  for (let i = 0; i < buckets.length; i++) buckets[i] = [];

  for (const [ch, count] of counts) buckets[count].push(ch);

  const pieces = [];

  // highest frequency first
  for (let f = buckets.length - 1; f >= 1; f--) {
    for (let j = 0; j < buckets[f].length; j++) {
      // a character in bucket f must be printed exactly f times
      pieces.push(buckets[f][j].repeat(f));
    }
  }

  return pieces.join("");
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(frequencySort("tree")); // "eetr"
console.log(frequencySort("cccaaa")); // "cccaaa"
console.log(frequencySort("Aabb")); // "bbAa"
console.log(frequencySort("")); // ""      empty
console.log(frequencySort("z")); // "z"     single

console.log(frequencySortByCompare("tree")); // "eetr"
console.log(frequencySortHeap("tree")); // "eetr"
console.log(frequencySortHeap("Aabb")); // "bbAa"
console.log(frequencySort("aaaaaaaaaa").length); // 10   all same char

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    count + sort     O(n log n) time, O(n) space
    count + max heap O(n + d log d) time, O(n) space
    count + buckets  O(n) time, O(n) space
- WHY BUCKET SORT BEATS COMPARISON SORT HERE:
    the sort keys are frequencies, bounded by n. Bounded integer keys can
    be array indices, so I skip the n log n comparison lower bound entirely.
- THE REAL TRAP:
    the alphabet. This problem includes upper case and digits, so a 26-slot
    array silently breaks - use a Map keyed by the character.
- WHY I JOIN INSTEAD OF +=:
    strings are immutable; repeated concatenation can be O(n^2). Collect
    pieces, join once.
- FOLLOW-UPS:
    Top K Frequent Elements (LC 347, identical buckets),
    Reorganize String (LC 767, heap so no two neighbours match),
    Task Scheduler (LC 621, greedy on the largest count).
*/

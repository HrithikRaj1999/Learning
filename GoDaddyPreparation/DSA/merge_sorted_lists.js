/*
Merge Sorted Lists (LC 21 two lists, LC 23 k lists)   [Q2.4.2]

A) Merge two sorted linked lists into one sorted list.
   1->2->4  and  1->3->4   ->   1->1->2->3->4->4
B) Merge k sorted linked lists.
   [1->4->5, 1->3->4, 2->6] -> 1->1->2->3->4->4->5->6
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
A) TWO LISTS
- Both are sorted, so the next smallest node is always one of the
  two heads. Compare the heads, take the smaller, move that pointer.
- Use a DUMMY node in front. Then "attach the first node" and
  "attach the tenth node" are the same line of code - no special
  case for the head. Return dummy.next at the end.
- When one list runs out, attach the WHOLE other list at once.
  It is already sorted, no need to walk it.

B) K LISTS
- Same idea, but now there are k heads to compare.
      brute  : compare all k heads each time -> O(N*k)
      heap   : a min heap of the k heads -> O(N log k)   <- the answer
      divide : merge pairs of lists, halving each round -> O(N log k)
                also, and it needs no heap at all.
- Heap holds at most k nodes: pop the smallest, attach it, then
  push that node's next.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
A) a = 1->2->4, b = 1->3->4

  dummy -> _
  a:1 vs b:1   1 <= 1, take a   dummy->1(a)      a = 2->4
  a:2 vs b:1   take b           dummy->1->1(b)   b = 3->4
  a:2 vs b:3   take a           ...->2           a = 4
  a:4 vs b:3   take b           ...->3           b = 4
  a:4 vs b:4   take a           ...->4           a = null
  a is empty -> attach all of b (4)  ->  ...->4

  result 1->1->2->3->4->4
  (taking a on a tie keeps the merge STABLE)

WHY THE DUMMY:
  without it you need "if result is null, result = node else
  tail.next = node" on every single step. The dummy removes that
  branch. tail always exists.

B) k = 3 lists with a min heap of heads

  lists: [1->4->5], [1->3->4], [2->6]
  heap  : 1a 1b 2
  pop 1a -> out: 1        push 4a       heap 1b 2 4a
  pop 1b -> out: 1 1      push 3b       heap 2 3b 4a
  pop 2  -> out: 1 1 2    push 6        heap 3b 4a 6
  pop 3b -> out: ... 3    push 4b       heap 4a 4b 6
  pop 4a -> push 5a ... and so on
  each pop is O(log k) and there are N nodes -> O(N log k)
*/

// ============================================================
// 3) THE NODE (no built-in list, so define one)
// ============================================================
class ListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

// small helpers so the tests read like the problem statement
function buildList(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
}

function listToArray(head) {
  const values = [];
  let current = head;
  while (current !== null) {
    values.push(current.value);
    current = current.next;
  }
  return values;
}

// ============================================================
// 4) A) MERGE TWO LISTS - ITERATIVE WITH A DUMMY (THE ANSWER)
// ============================================================
/*
    Time  : O(n + m) - each node is attached exactly once.
    Space : O(1) - no new nodes, only pointer rewiring.
*/
function mergeTwoLists(a, b) {
  // dummy removes the "is this the first node?" special case
  const dummy = new ListNode(0);
  let tail = dummy;

  while (a !== null && b !== null) {
    // <= keeps equal values in a-before-b order (stable)
    if (a.value <= b.value) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }

  // one list is finished - the rest of the other is already sorted
  tail.next = a !== null ? a : b;

  return dummy.next;
}

// ============================================================
// 5) A) RECURSIVE VERSION (IF THEY ASK)
// ============================================================
/*
- Shorter to write, but O(n+m) stack depth, which can blow up on
  a long list. Say that trade-off out loud.
*/
function mergeTwoListsRecursive(a, b) {
  // an empty list means the answer is simply the other list
  if (a === null) return b;
  if (b === null) return a;

  if (a.value <= b.value) {
    // a's head is the smallest, the rest is the same problem
    a.next = mergeTwoListsRecursive(a.next, b);
    return a;
  }

  b.next = mergeTwoListsRecursive(a, b.next);
  return b;
}

// ============================================================
// 6) B) MERGE K LISTS - BRUTE FORCE (ONE BY ONE)
// ============================================================
/*
- Merge list 1 into the result, then list 2, then list 3...
- The growing result is re-walked every time.
    Time  : O(N * k)   Space : O(1)
*/
function mergeKListsBrute(lists) {
  let result = null;
  for (const list of lists) {
    result = mergeTwoLists(result, list);
  }
  return result;
}

// ============================================================
// 7) B) OPTIMAL - DIVIDE AND CONQUER (PAIRWISE MERGE)
// ============================================================
/*
- Round 1: merge lists in pairs -> k/2 lists.
  Round 2: pairs again -> k/4. After log k rounds, one list.
- Every round touches all N nodes once, so O(N log k) with NO heap.
    Time  : O(N log k)   Space : O(1) iterative, O(log k) if recursive.
*/
function mergeKLists(lists) {
  if (lists.length === 0) return null;

  let current = lists;

  while (current.length > 1) {
    const merged = [];

    // pair up: 0 with 1, 2 with 3, ...
    for (let i = 0; i < current.length; i += 2) {
      const first = current[i];
      // a lonely last list just moves to the next round untouched
      const second = i + 1 < current.length ? current[i + 1] : null;
      merged.push(mergeTwoLists(first, second));
    }

    current = merged;
  }

  return current[0];
}

// ============================================================
// 8) B) HEAP VERSION - SAME COMPLEXITY, WORKS ON STREAMS
// ============================================================
/*
- Keep the k current heads in a min heap, pop the smallest, attach
  it, push its next.
    Time  : O(N log k)   Space : O(k) for the heap.
- Preferred when the lists arrive as streams and cannot be paired
  up in advance.
*/
function mergeKListsHeap(lists) {
  // tiny min heap over nodes, compared by value
  const heap = [];

  function heapPush(node) {
    heap.push(node);
    let index = heap.length - 1;
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (heap[index].value >= heap[parent].value) break;
      [heap[index], heap[parent]] = [heap[parent], heap[index]];
      index = parent;
    }
  }

  function heapPop() {
    const root = heap[0];
    const last = heap.pop();
    if (heap.length > 0) {
      heap[0] = last;
      let index = 0;
      while (true) {
        const left = 2 * index + 1;
        const right = 2 * index + 2;
        let smallest = index;
        if (left < heap.length && heap[left].value < heap[smallest].value) smallest = left;
        if (right < heap.length && heap[right].value < heap[smallest].value) smallest = right;
        if (smallest === index) break;
        [heap[index], heap[smallest]] = [heap[smallest], heap[index]];
        index = smallest;
      }
    }
    return root;
  }

  // seed the heap with every non-empty head
  for (const list of lists) {
    if (list !== null) heapPush(list);
  }

  const dummy = new ListNode(0);
  let tail = dummy;

  while (heap.length > 0) {
    const smallest = heapPop();
    tail.next = smallest;
    tail = tail.next;

    // the list that node came from offers its next node
    if (smallest.next !== null) heapPush(smallest.next);
  }

  // cut the tail loose from whatever it still points at
  tail.next = null;
  return dummy.next;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(listToArray(mergeTwoLists(buildList([1, 2, 4]), buildList([1, 3, 4]))));
// [1,1,2,3,4,4]
console.log(listToArray(mergeTwoLists(null, buildList([0])))); // [0]
console.log(listToArray(mergeTwoLists(null, null))); // []
console.log(listToArray(mergeTwoListsRecursive(buildList([1, 5]), buildList([2, 3]))));
// [1,2,3,5]

console.log(listToArray(mergeKLists([buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])])));
// [1,1,2,3,4,4,5,6]
console.log(listToArray(mergeKLists([]))); // []
console.log(listToArray(mergeKLists([null]))); // []
console.log(listToArray(mergeKListsHeap([buildList([1, 4, 5]), buildList([1, 3, 4]), buildList([2, 6])])));
// [1,1,2,3,4,4,5,6]
console.log(listToArray(mergeKListsBrute([buildList([2]), buildList([1])]))); // [1,2]

/*
============================================================
9) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Two lists : O(n + m) time, O(1) space. Optimal - every node
                must be visited.
    k lists   : brute O(N*k), heap O(N log k) with O(k) space,
                divide and conquer O(N log k) with O(1) space.
                N = total nodes across all lists.
- WHY DIVIDE AND CONQUER IS O(N log k):
    Each round merges every node exactly once - O(N) - and the
    number of lists halves each round, so there are log k rounds.
- THE DUMMY NODE:
    It kills the "first node" special case. I would mention that
    it also makes deletion problems easier (LC 203, LC 19).
- STABILITY: `<=` instead of `<` keeps equal values from the first
  list ahead. Free to say, shows care.
- NO NEW NODES: I rewire the existing nodes, so nothing is copied.
  If the interviewer wants the inputs untouched, that has to be
  stated - it changes the space to O(N).
- RECURSION WARNING: the recursive two-list merge is O(n+m) stack
  frames. On a 100k-node list that is a stack overflow. Iterative
  is the safe answer.
- FOLLOW-UPS:
    Sort a linked list (LC 148 - merge sort using this merge),
    merge k sorted arrays, add two numbers (LC 2), and "merge two
    sorted arrays in place" (LC 88 - fill from the back).
*/

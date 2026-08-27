/*
Reverse a Linked List (LC 206)   [Q2.6.1]

  1->2->3->4->5  ->  5->4->3->2->1

They ask iterative FIRST, then "now do it recursively".
Follow-up they like: reverse only a sub-list (LC 92) or in groups
of k (LC 25).
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- A node only knows its NEXT. To reverse, every node must point
  BACKWARDS instead. So I walk once and flip each arrow.

- Three pointers, that is the whole algorithm:
      previous = the part already reversed (starts as null)
      current  = the node I am flipping now
      nextNode = saved copy of current.next

- Order inside the loop is fixed and cannot be shuffled:
      1. save next      (otherwise it is lost forever)
      2. flip           current.next = previous
      3. previous = current
      4. current  = nextNode

- previous starts at null because the old head becomes the new
  TAIL, and a tail points to null.

- At the end current is null and previous is the new head.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
list 1->2->3->null

  start   prev=null  cur=1        null   1->2->3
  ------------------------------------------------------
  round 1 save next=2
          flip 1.next = null      null<-1   2->3
          prev=1, cur=2
  round 2 save next=3
          flip 2.next = 1         null<-1<-2   3
          prev=2, cur=3
  round 3 save next=null
          flip 3.next = 2         null<-1<-2<-3
          prev=3, cur=null
  loop ends (cur === null) -> return prev = 3

  new list 3->2->1->null

IF YOU FORGET TO SAVE next:
  cur.next = prev  destroys the only link to the rest of the list.
  The remaining nodes are unreachable - the list is cut in half.
*/

class ListNode {
  constructor(value, next) {
    this.value = value;
    this.next = next === undefined ? null : next;
  }
}

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
// 3) BRUTE FORCE - COPY VALUES INTO AN ARRAY
// ============================================================
/*
- Read all values, reverse the array, write them back.
- Works, but it is not really "reversing the list" - the nodes
  never move, only their payload. Some interviewers reject it.
    Time  : O(n)   Space : O(n)
*/
function reverseListBrute(head) {
  const values = listToArray(head);
  values.reverse();

  let current = head;
  let i = 0;
  while (current !== null) {
    current.value = values[i];
    current = current.next;
    i++;
  }

  return head;
}

// ============================================================
// 4) OPTIMAL - ITERATIVE, THREE POINTERS
// ============================================================
/*
    Time  : O(n) - one pass.
    Space : O(1) - three pointers, no new nodes.
*/
function reverseList(head) {
  // everything already reversed sits behind previous
  let previous = null;
  let current = head;

  while (current !== null) {
    // 1. save the rest of the list BEFORE breaking the link
    const nextNode = current.next;

    // 2. flip this node's arrow backwards
    current.next = previous;

    // 3-4. shift both pointers one step forward
    previous = current;
    current = nextNode;
  }

  // current is null, so previous is the last node = new head
  return previous;
}

// ============================================================
// 5) RECURSIVE VERSION (THE USUAL FOLLOW-UP)
// ============================================================
/*
- Recurse to the END first, get the new head back untouched, then
  flip the arrow on the way out.
      head.next.next = head   means "make my next point at me"
      head.next = null        cuts the old forward link
    Time  : O(n)   Space : O(n) call stack  <- the trade-off
*/
function reverseListRecursive(head) {
  // empty list, or already at the last node
  if (head === null || head.next === null) return head;

  // reverse everything after me; newHead never changes after this
  const newHead = reverseListRecursive(head.next);

  // my next node must now point back at me
  head.next.next = head;
  // and I become the tail of that part
  head.next = null;

  return newHead;
}

// ============================================================
// 6) FOLLOW-UP - REVERSE A SUB-LIST, POSITIONS left..right (LC 92)
// ============================================================
/*
- Same flip loop, but only between two positions, and the pieces
  before and after must be stitched back on.
- The dummy node handles left === 1, where the head itself moves.
    Time  : O(n)   Space : O(1)
*/
function reverseBetween(head, left, right) {
  const dummy = new ListNode(0, head);

  // walk to the node just BEFORE the reversed section
  let beforeLeft = dummy;
  for (let i = 1; i < left; i++) {
    beforeLeft = beforeLeft.next;
  }

  // this node will end up as the TAIL of the reversed section
  const sectionTail = beforeLeft.next;

  let previous = null;
  let current = sectionTail;

  // flip exactly (right - left + 1) nodes
  for (let i = 0; i <= right - left; i++) {
    const nextNode = current.next;
    current.next = previous;
    previous = current;
    current = nextNode;
  }

  // stitch: front part -> new section head, section tail -> rest
  beforeLeft.next = previous;
  sectionTail.next = current;

  return dummy.next;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(listToArray(reverseList(buildList([1, 2, 3, 4, 5])))); // [5,4,3,2,1]
console.log(listToArray(reverseList(buildList([1])))); // [1]
console.log(listToArray(reverseList(null))); // []
console.log(listToArray(reverseListRecursive(buildList([1, 2, 3])))); // [3,2,1]
console.log(listToArray(reverseListBrute(buildList([1, 2, 3])))); // [3,2,1]
console.log(listToArray(reverseBetween(buildList([1, 2, 3, 4, 5]), 2, 4))); // [1,4,3,2,5]
console.log(listToArray(reverseBetween(buildList([1, 2, 3]), 1, 3))); // [3,2,1]
console.log(listToArray(reverseBetween(buildList([5]), 1, 1))); // [5]

/*
============================================================
7) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Iterative : O(n) time, O(1) space  <- ship this one.
    Recursive : O(n) time, O(n) stack. On a million-node list
                that is a stack overflow, so iterative wins in
                production.
- THE ONE LINE THAT MATTERS:
    Save current.next before overwriting it. That single line is
    what the whole question tests.
- WHY previous STARTS AT null:
    The original head becomes the new tail, and a tail's next
    must be null. Starting with anything else creates a cycle.
- IN PLACE VS COPY:
    The value-copy version does not reverse the structure. If the
    nodes carry other data or are shared, copying values is wrong.
    Mention it, then write the pointer version.
- HOW I WOULD TEST IT:
    empty list, one node, two nodes, and check that the new tail
    really points to null (otherwise you built an infinite loop).
- FOLLOW-UPS:
    Reverse in groups of k (LC 25), palindrome linked list
    (LC 234 - find the middle with slow/fast, reverse the second
    half, compare), reorder list (LC 143), detect a cycle
    (LC 141, Floyd's tortoise and hare).
*/

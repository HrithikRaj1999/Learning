/*
Q3.4  Circular Queue / Ring Buffer (Linked Ring)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: Linked Ring of Nodes (Closed Loop Linked List).
- WHY: A standard Queue on an array wastes space or causes expensive O(N) element shifts on dequeue.
  A Ring Buffer reuses fixed pre-allocated nodes without shifting or dynamic memory allocation.

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "Pre-allocate N nodes upfront in constructor and form a closed ring: `last.next = first`."
- "Track two pointers: `write` (where next item goes) and `read` (where oldest item sits)."
- "Track `count`: CRITICAL because when full and when empty, `read === write`! The `count` variable breaks this tie."
- "Enqueue writes at `write` pointer and moves `write = write.next`."
- "Dequeue reads at `read` pointer, clears node value, and moves `read = read.next`."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- constructor(capacity):
    1. Allocate `capacity` nodes.
    2. Link `last.next = first`.
    3. Initialize `read = write = first`, `count = 0`.
- enqueue(value):
    1. If `isFull()`, throw "Queue is full".
    2. `write.value = value`.
    3. `write = write.next`.
    4. count++.
- dequeue():
    1. If `isEmpty()`, throw "Queue is empty".
    2. Read `value = read.value`.
    3. Clear `read.value = null` (prevent object retention/leaks).
    4. `read = read.next`.
    5. count--. Return value.
- peek(): If `isEmpty()`, throw. Return `read.value`.
- isEmpty(): `count === 0`.
- isFull(): `count === capacity`.

SHORT SYNTAX TRICKS:
  last = last.next = { value: null } as RingNode<T> // Chain and move in 1 step
  read = write = first                              // Initialize pointers together

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - enqueue(x) : O(1) always (zero array shifts, zero runtime GC allocation).
    - dequeue()  : O(1) always.
    - peek()     : O(1).
- SPACE COMPLEXITY: O(Capacity) fixed memory (allocated once during initialization).

================================================================
5. VISUAL DIAGRAM
================================================================
Capacity = 3. Ring: n0 -> n1 -> n2 -> back to n0:
R = read pointer, W = write pointer

  n0      n1      n2
[  _  ] [  _  ] [  _  ]  count = 0  (R = n0, W = n0)  <-- EMPTY
[  a  ] [  _  ] [  _  ]  count = 1  (R = n0, W = n1)  enqueue("a")
[  a  ] [  b  ] [  _  ]  count = 2  (R = n0, W = n2)  enqueue("b")
[  a  ] [  b  ] [  c  ]  count = 3  (R = n0, W = n0)  enqueue("c") <-- FULL! (R === W!)

  dequeue() returns "a":
[  _  ] [  b  ] [  c  ]  count = 2  (R = n1, W = n0)

  enqueue("d") REUSES slot n0 (Zero allocation!):
[  d  ] [  b  ] [  c  ]  count = 3  (R = n1, W = n1)

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- `count` IS MANDATORY: Full and Empty both produce `read === write`. Counter or 1-slot gap is required to distinguish.
- CLOSE THE LOOP IN CONSTRUCTOR: Make sure `last.next = first`.
- CLEAR NODE VALUE ON DEQUEUE: `read.value = null` prevents stale reference memory leaks.
- HIGH PERFORMANCE APPLICATIONS: Ring buffers are used in audio streaming, logging systems, and network buffers because memory is fixed with zero GC churn.
*/


type RingNode<T> = { value: T | null; next: RingNode<T> };

export class CircularQueue<T> {
  private read: RingNode<T>;  // oldest item, next one out
  private write: RingNode<T>; // next free slot to fill
  private count = 0;
  private capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("capacity must be > 0");
    this.capacity = capacity;
    // chain the nodes, then close the loop
    const first = { value: null } as RingNode<T>;
    let last = first;
    for (let i = 1; i < capacity; i++) {
      last = last.next = { value: null } as RingNode<T>;
    }
    last.next = first;
    this.read = this.write = first;
  }

  enqueue(value: T): void {
    // full means write has come all the way round onto read
    if (this.isFull()) throw new Error("Queue is full");
    this.write.value = value;
    this.write = this.write.next;
    this.count++;
  }

  dequeue(): T {
    if (this.isEmpty()) throw new Error("Queue is empty");
    const value = this.read.value!;
    // clear it, or the ring keeps holding what I gave away
    this.read.value = null;
    this.read = this.read.next;
    this.count--;
    return value;
  }

  peek(): T {
    if (this.isEmpty()) throw new Error("Queue is empty");
    return this.read.value!;
  }

  isEmpty(): boolean { return this.count === 0; }

  isFull(): boolean { return this.count === this.capacity; }

  size(): number { return this.count; }
}

// quick check
const queue = new CircularQueue<string>(3);
queue.enqueue("a");
queue.enqueue("b");
queue.enqueue("c");
console.log(queue.dequeue(), queue.isFull()); // a false
queue.enqueue("d"); // reuses the slot "a" left. no new node.
console.log(queue.dequeue()); // b
console.log(queue.dequeue()); // c
console.log(queue.dequeue(), queue.isEmpty()); // d true

/*
================================================================
5. SAY OUT LOUD
================================================================
- "enqueue, dequeue and peek are O(1). Memory is fixed and
   allocated once, so there is no GC churn."
- "The count is what separates full from empty."
- "The other trick is to always leave one slot empty. Then
   write.next === read means full. Costs a slot, saves the
   counter."
- "A useful variant: instead of throwing when full,
   overwrite the oldest and move read on. That is how you
   keep the last N log lines."
- "The same idea on an array with (i + 1) % capacity is
   usually faster, because the memory is contiguous."
- "With one producer and one consumer this needs no lock.
   That is why ring buffers live in hot paths."
*/

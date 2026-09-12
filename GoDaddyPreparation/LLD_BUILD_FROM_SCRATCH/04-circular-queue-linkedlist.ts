/*
Q3.4  Circular Queue / Ring Buffer (Linked Ring)

============================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
============================================================
- DATA STRUCTURE:
    Linked Ring of Nodes (Closed Loop Linked List).
- WHY WE NEED IT:
    Queue on array causes expensive O(N) element shifts.
    Ring Buffer reuses pre-allocated nodes without shifting
    or runtime memory allocations.

============================================================
2. INTUITION (What I am thinking to tell interviewer)
============================================================
- "Pre-allocate N nodes in constructor and close loop:
   `last.next = first`."
- "Track two pointers: `write` (free slot) and `read`
   (oldest item)."
- "Track `count`: CRITICAL! When full and empty, `read === write`.
   `count` breaks the tie."
- "Enqueue writes at `write`, `write = write.next`."
- "Dequeue reads at `read`, clears value, `read = read.next`."

============================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
============================================================
- constructor(capacity):
    1. Allocate `capacity` nodes. `last.next = first`.
    2. `read = write = first`, `count = 0`.
- enqueue(value):
    1. If `isFull()`, throw error.
    2. `write.value = value; write = write.next; count++`.
- dequeue():
    1. If `isEmpty()`, throw error.
    2. `val = read.value; read.value = null; read = read.next`.
    3. `count--`. Return val.
- peek(): If `isEmpty()`, throw. Return `read.value`.
- isEmpty(): `count === 0`.
- isFull(): `count === capacity`.

SHORT SYNTAX TRICKS:
  last = last.next = { value: null } as RingNode<T> // Chain
  read = write = first                              // Pointers

============================================================
4. TIME & SPACE COMPLEXITY
============================================================
- TIME COMPLEXITY:
    - enqueue(x) : O(1) always (zero shifting/allocations).
    - dequeue()  : O(1) always.
    - peek()     : O(1).
- SPACE COMPLEXITY:
    - O(Capacity) fixed memory (allocated once).

============================================================
5. VISUAL DIAGRAM
============================================================
Capacity = 3. Ring: n0 -> n1 -> n2 -> n0. (R=read, W=write)

  n0      n1      n2
[  _  ] [  _  ] [  _  ]  count = 0 (R=n0, W=n0) EMPTY
[  a  ] [  _  ] [  _  ]  count = 1 (R=n0, W=n1) enqueue("a")
[  a  ] [  b  ] [  _  ]  count = 2 (R=n0, W=n2) enqueue("b")
[  a  ] [  b  ] [  c  ]  count = 3 (R=n0, W=n0) FULL (R===W!)

  dequeue() returns "a":
[  _  ] [  b  ] [  c  ]  count = 2 (R=n1, W=n0)

  enqueue("d") REUSES slot n0 (Zero allocation!):
[  d  ] [  b  ] [  c  ]  count = 3 (R=n1, W=n1)

============================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
============================================================
- `count` IS MANDATORY: Full and Empty both produce
  `read === write`. Counter breaks the ambiguity.
- CLOSE THE LOOP: Ensure `last.next = first`.
- CLEAR VALUE ON DEQUEUE: `read.value = null` prevents
  stale reference memory leaks.
- HIGH PERFORMANCE USES: Audio streaming, logging, and
  network buffers use ring buffers due to 0 GC churn.
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


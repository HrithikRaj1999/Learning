/*
Q3.4  Circular Queue / Ring Buffer (linked ring)

================================================================
1. INTUITION
================================================================
WHAT
  A queue built on a closed ring of nodes. The last node
  points back to the first one.

WHY THIS DESIGN
  A normal queue wastes the front. Every dequeue leaves a
  dead slot there. Shifting items back costs O(n).
  A ring never shifts. And I build all the nodes once in
  the constructor, so it never allocates again either.
  That is why audio, logging and network code use it.

HOW IT WORKS
  1. Build N nodes and close the ring: last.next = first.
  2. writeNode = where the next item goes in.
     readNode  = where the oldest item sits.
  3. enqueue -> write, move writeNode on, count++
  4. dequeue -> read, clear, move readNode on, count--

THE ONE TRAP
  When the ring is full and when it is empty, readNode and
  writeNode sit on the SAME node. Pointers cannot tell the
  two apart. So I keep a count.

COST
  enqueue / dequeue / peek : O(1) always
  memory : O(capacity), allocated once

================================================================
2. VISUAL EXAMPLE
================================================================
capacity 3. Ring: n0 -> n1 -> n2 -> back to n0
R = readNode, W = writeNode

                n0      n1      n2
  start       [  _  ] [  _  ] [  _  ]  count 0  R n0  W n0
  enqueue(a)  [  a  ] [  _  ] [  _  ]  count 1  R n0  W n1
  enqueue(b)  [  a  ] [  b  ] [  _  ]  count 2  R n0  W n2
  enqueue(c)  [  a  ] [  b  ] [  c  ]  count 3  R n0  W n0
                                                     FULL
  dequeue()   [  _  ] [  b  ] [  c  ]  count 2  R n1  W n0
              returns "a"
  enqueue(d)  [  d  ] [  b  ] [  c  ]  count 3  R n1  W n1
              slot n0 is REUSED. No new node.

TRAP - THE POINTERS LOOK THE SAME
  Row "start"      : R n0, W n0, and the queue is EMPTY.
  Row "enqueue(c)" : R n0, W n0, and the queue is FULL.
  Same pointers, opposite meaning. The count breaks the tie.

================================================================
3. SKELETON
================================================================
  constructor(cap)  build N nodes, then last.next = first
  enqueue(value)    write, move write on, count++
  dequeue()         read, clear, move read on, count--
  peek()            read without moving
  isEmpty()         count === 0
  isFull()          count === capacity
  size()            count

  SHORT SYNTAX
    last = last.next = { ... }
        chain a node and walk on, in one line
    this.read = this.write = first
        both pointers start on the same node
    { value: null } as RingNode<T>
        skips the null-next dance while building

================================================================
4. GOTCHAS
================================================================
- THE COUNT IS NOT OPTIONAL. Full and empty both put read
  and write on the same node.
- CLOSE THE RING in the constructor. If the last node does
  not point back to the first, it is not circular at all.
- CLEAR THE SLOT ON DEQUEUE, or the ring still holds the
  object you just handed to the caller.
- MOVE THE POINTER AFTER you use it, not before, or you
  skip the first slot.
- Reject a capacity of 0 or less up front.
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

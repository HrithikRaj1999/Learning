/*
Q3.6  Queue using Two Stacks (LC 232)

============================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
============================================================
- DATA STRUCTURE:
    Two Stacks (`inStack` and `outStack`).
- WHY WE NEED IT:
    A stack reverses order (LIFO). Popping all items from
    `inStack` and pushing into `outStack` reverses order TWICE.
    Double reversal yields original FIFO queue order!

============================================================
2. INTUITION (What I am thinking to tell interviewer)
============================================================
- "`inStack` receives all incoming `enqueue` calls (O(1))."
- "`outStack` serves all `dequeue` and `peek` calls."
- "LAZY POURING: Only pour `inStack` into `outStack` when
   `outStack` is COMPLETELY EMPTY."
- "Amortized O(1): Each element is pushed to `inStack` once
   and moved to `outStack` once (2 * N ops for N items)."

============================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
============================================================
- enqueue(value): Push value into `inStack`.
- pour(): Helper method.
    1. If `outStack` is NOT empty, return immediately!
    2. While `inStack` has items: `outStack.push(inStack.pop())`.
- dequeue():
    1. Call `pour()`.
    2. If `outStack` empty, throw error.
    3. Return `outStack.pop()!`.
- peek():
    1. Call `pour()`.
    2. If `outStack` empty, throw error.
    3. Return `outStack.at(-1)!`.
- size(): Return `inStack.length + outStack.length`.
- isEmpty(): Return `size() === 0`.

SHORT SYNTAX TRICKS:
  while (inStack.length) outStack.push(inStack.pop()!)
  outStack.at(-1)! // Safe peek top element

============================================================
4. TIME & SPACE COMPLEXITY
============================================================
- TIME COMPLEXITY:
    - enqueue(x) : O(1)
    - dequeue()  : Amortized O(1) [Worst O(N) on pour]
    - peek()     : Amortized O(1)
- SPACE COMPLEXITY:
    - O(N) total across both stacks.

============================================================
5. VISUAL DIAGRAM
============================================================
Top of stack shown on right:

  enqueue(1), enqueue(2):
    inStack: [1, 2]     outStack: []

  dequeue(): outStack EMPTY -> Call pour()!
    Pop 2 -> Push 2, Pop 1 -> Push 1
    inStack: []         outStack: [2, 1] (Top is 1!)
    Pop outStack -> Returns 1.
    inStack: []         outStack: [2]

  enqueue(3):
    inStack: [3]        outStack: [2]

  dequeue(): outStack NOT empty -> DO NOT POUR!
    Pop outStack -> Returns 2.
    inStack: [3]        outStack: []

============================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
============================================================
- DO NOT POUR EARLY: Pouring when `outStack` has items puts
  new items on top of old items and breaks FIFO!
- DRAIN ENTIRE INSTACK: Move all items until `inStack` empty.
- REAL WORLD USE: Double-buffering pattern (Kafka producers,
  graphics pipelines) where writes hit a hot buffer while
  reads drain a cold buffer.
*/

export class QueueFromTwoStacks<T> {
  // plain arrays used as stacks, push and pop only.
  // Swap in the Stack from Q3.1 if they ban built-ins.
  private inStack: T[] = [];
  private outStack: T[] = [];

  enqueue(value: T): void { this.inStack.push(value); }

  dequeue(): T {
    this.pour();
    if (!this.outStack.length) throw new Error("Queue is empty");
    return this.outStack.pop()!;
  }

  peek(): T {
    this.pour();
    if (!this.outStack.length) throw new Error("Queue is empty");
    return this.outStack.at(-1)!;
  }

  size(): number {
    return this.inStack.length + this.outStack.length;
  }

  isEmpty(): boolean { return this.size() === 0; }

  // tip inStack into outStack, but only once out has run dry
  private pour(): void {
    if (this.outStack.length) return;
    while (this.inStack.length) {
      this.outStack.push(this.inStack.pop()!);
    }
  }
}

// quick check
const queue = new QueueFromTwoStacks<number>();
queue.enqueue(1);
queue.enqueue(2);
console.log(queue.dequeue()); // 1
queue.enqueue(3);             // must still come out after 2
console.log(queue.dequeue()); // 2
console.log(queue.dequeue(), queue.isEmpty()); // 3 true


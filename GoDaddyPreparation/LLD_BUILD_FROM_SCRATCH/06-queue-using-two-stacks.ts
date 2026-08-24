/*
Q3.6  Queue using Two Stacks (LC 232)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: Two Stacks (`inStack` and `outStack`).
- WHY: A stack reverses order (LIFO). Popping all elements from `inStack` and pushing them into `outStack` reverses the order TWICE.
  Double reversal yields original FIFO queue order!

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "`inStack` receives all incoming `enqueue` calls (fast O(1))."
- "`outStack` serves all `dequeue` and `peek` calls."
- "LAZY POURING: Only pour `inStack` into `outStack` when `outStack` is COMPLETELY EMPTY."
- "Amortized Analysis: Every item is pushed to `inStack` once and moved to `outStack` once. $2 \times N$ operations for $N$ pushes/pops = Amortized O(1)."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- enqueue(value): Push value into `inStack`.
- pour(): Helper method.
    1. If `outStack` is NOT empty, return immediately (do nothing!).
    2. While `inStack` has elements: `outStack.push(inStack.pop()!)`.
- dequeue():
    1. Call `pour()`.
    2. If `outStack` is still empty, throw "Queue is empty".
    3. Return `outStack.pop()!`.
- peek():
    1. Call `pour()`.
    2. If `outStack` is still empty, throw "Queue is empty".
    3. Return `outStack.at(-1)!`.
- size(): Return `inStack.length + outStack.length`.
- isEmpty(): Return `size() === 0`.

SHORT SYNTAX TRICKS:
  while (inStack.length) outStack.push(inStack.pop()!) // Drain & flip stack in 1 line
  outStack.at(-1)!                                    // Safe peek top element

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - enqueue(x) : O(1) always.
    - dequeue()  : Amortized O(1) [Worst-case O(N) only when `outStack` is empty].
    - peek()     : Amortized O(1).
- SPACE COMPLEXITY: O(N) across both stacks.

================================================================
5. VISUAL DIAGRAM
================================================================
Top of stack shown on right:

  enqueue(1), enqueue(2):
    inStack: [1, 2]     outStack: []

  dequeue(): outStack is EMPTY -> Call pour()!
    Pop 2 -> Push 2, Pop 1 -> Push 1
    inStack: []         outStack: [2, 1]  <-- Top of outStack is 1 (Oldest item!)
    Pop outStack -> Returns 1.
    inStack: []         outStack: [2]

  enqueue(3):
    inStack: [3]        outStack: [2]

  dequeue(): outStack is NOT empty -> DO NOT POUR!
    Pop outStack -> Returns 2.
    inStack: [3]        outStack: []

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- DO NOT POUR EARLY: If you pour when `outStack` still has items, newer elements land on top of older elements and break FIFO!
- DRAIN ENTIRE INSTACK: When pouring, move all elements until `inStack` is empty.
- REAL WORLD APPLICATION: Double-buffering pattern (e.g. Kafka producers, graphics rendering pipelines) where writes go to a hot buffer while reads drain a flipped cold buffer.
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

/*
================================================================
5. SAY OUT LOUD
================================================================
- "enqueue is O(1). dequeue is O(1) amortised, O(n) in one
   bad call, because each item is moved at most twice."
- "The whole trick is: only pour when outStack is empty.
   That is both the correctness rule and the speed rule."
- "Where this shows up for real: it is the same shape as a
   double buffered writer. Take writes into a hot buffer,
   flip buffers, drain the cold one, so the fast path never
   blocks. Kafka producer batching works like this."
- "It is also how you build a queue in a language that only
   gives you stacks, and how an immutable queue works: a
   front list plus a reversed back list."
- "The mirror question is a stack from two queues, where the
   cost moves to the push side."
*/

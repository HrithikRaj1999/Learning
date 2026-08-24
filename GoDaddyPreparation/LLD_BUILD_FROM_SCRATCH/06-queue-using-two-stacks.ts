/*
Q3.6  Queue using two Stacks (LC 232)

================================================================
1. INTUITION
================================================================
WHAT
  A first in first out queue, built only from two last in
  first out stacks.

WHY THIS WORKS
  A stack reverses order. So if I pop everything out of one
  stack and push it into the other, the order flips. What
  was at the bottom is now on top.
  A flipped LIFO is exactly FIFO. That pour is the trick.

HOW IT WORKS
  1. inStack takes every enqueue. Always cheap.
  2. outStack serves every dequeue.
  3. outStack empty? Pour the whole inStack into it.
  4. Never pour while outStack still has items.

WHY IT IS STILL FAST
  Each item moves at most twice in its life: in, then across.
  So n operations cost O(n) in total. That is O(1) amortised.
  One unlucky dequeue is O(n), but the average is O(1).

COST
  enqueue : O(1)
  dequeue : O(1) amortised, O(n) worst single call

================================================================
2. VISUAL EXAMPLE
================================================================
Stacks are drawn with the TOP on the right.

  enqueue(1)  in [1]     out []
  enqueue(2)  in [1,2]   out []
  dequeue()   out is empty -> POUR
              pop 2 push 2, pop 1 push 1
              in []      out [2,1]   flipped, 1 on top
              pop out -> 1, the OLDEST item. Correct.
              in []      out [2]
  enqueue(3)  in [3]     out [2]
              3 must still come out AFTER 2
  dequeue()   out is NOT empty, so DO NOT pour
              pop out -> 2
              in [3]     out []
  dequeue()   out is empty -> pour -> out [3] -> pop -> 3

WHAT BREAKS IF YOU POUR EARLY
  At the enqueue(3) step:
      in [3]  out [2]   -> pour anyway -> out [2,3]
  Now the top of out is 3, so dequeue gives 3 before 2.
  The newer item jumped the queue. FIFO is broken.

================================================================
3. SKELETON
================================================================
  enqueue(value)  push into inStack
  dequeue()       pour if needed, then pop outStack
  peek()          pour if needed, then read top of outStack
  size()          both stacks added together
  isEmpty()       size() === 0
  pour()          private. Only runs when outStack is empty.

  SHORT SYNTAX
    if (!stack.length)      empty check, no compare to 0
    while (inStack.length)  drain a stack
    stack.at(-1)            top, without length - 1
    stack.pop()!            already checked it is not empty

================================================================
4. GOTCHAS
================================================================
- POUR ONLY WHEN outStack IS EMPTY. Pouring on top of what
  is left puts newer items above older ones. See above.
- POUR THE WHOLE STACK when you do pour, not one item.
- CHECK EMPTY AFTER POURING, not before. The queue is empty
  only when BOTH stacks are empty.
- size() IS BOTH STACKS, not just one.
- Say amortised, not worst case. One dequeue can be O(n).
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

/*
Q3.7  Min Stack (O(1) getMin - LC 155)

================================================================
1. INTUITION
================================================================
WHAT
  A stack where push, pop, top and getMin are all O(1).

WHY ONE VARIABLE IS NOT ENOUGH
  Scanning for the smallest value is O(n).
  Keeping one `min` variable breaks the moment that minimum
  is popped, because I do not know the second smallest.
  So I need history, not one value.

THE TRICK
  The minimum is a property of everything from the bottom up
  to a point. And a stack only ever changes at the top.
  So next to every item I store the smallest value seen from
  the bottom up to that item.
  Push writes both. Pop drops both. getMin is a peek.
  Nothing is ever recomputed.

COST
  push / pop / top / getMin : O(1)
  memory : O(n), one extra number per item

================================================================
2. VISUAL EXAMPLE
================================================================
push(5), push(2), push(7), then pop twice

  push(5)    values [5]      minimums [5]           min 5
  push(2)    values [5,2]    minimums [5,2]         min 2
                             because min(2,5) = 2
  push(7)    values [5,2,7]  minimums [5,2,2]       min 2
                             7 is not smaller, so CARRY 2
  pop() -> 7 values [5,2]    minimums [5,2]         min 2
  pop() -> 2 values [5]      minimums [5]           min 5
                             the old min came back on its
                             own, the history was under it

The two stacks are ALWAYS the same height. That is what
makes getMin a plain peek instead of a search.

================================================================
3. SKELETON
================================================================
  push(value)  push to values
               push min(value, current min) to minimums
  pop()        pop BOTH, return the value
  top()        top of values
  getMin()     top of minimums
  isEmpty()

  SHORT SYNTAX
    minimums.at(-1) ?? value
        the current best, and the first push, in one go
    Math.min(value, best)
        replaces the whole if / else carry forward
    values.pop()!    emptiness is checked just above

================================================================
4. GOTCHAS
================================================================
- BOTH STACKS MOVE TOGETHER. Same height, always. Pop one,
  pop the other.
- CARRY THE OLD MIN FORWARD when the new value is not
  smaller. Do not push the new value. minimums holds "best
  so far", it is not a copy of values.
- FIRST PUSH is the special case. minimums is empty, so the
  value itself is the minimum.
- SPACE SAVING VERSION: push to minimums only when
  value <= currentMin, and pop it only when the popped value
  equals the top of minimums. It must be <= and not <, or
  duplicate minimums pop one too early.
- EVERY METHOD CHECKS EMPTY. getMin on empty has no answer.
*/

export class MinStack {
  private values: number[] = [];
  // minimums[i] = smallest value in values[0..i]
  // so both stacks always have the same height
  private minimums: number[] = [];

  push(value: number): void {
    this.values.push(value);
    // at(-1) is the best so far, ?? value covers the first
    // push, and Math.min carries the old best forward
    const best = this.minimums.at(-1) ?? value;
    this.minimums.push(Math.min(value, best));
  }

  pop(): number {
    if (this.isEmpty()) throw new Error("Stack is empty");
    // both stacks always move together
    this.minimums.pop();
    return this.values.pop()!;
  }

  top(): number {
    if (this.isEmpty()) throw new Error("Stack is empty");
    return this.values.at(-1)!;
  }

  getMin(): number {
    if (this.isEmpty()) throw new Error("Stack is empty");
    return this.minimums.at(-1)!;
  }

  isEmpty(): boolean { return this.values.length === 0; }
}

// quick check
const stack = new MinStack();
stack.push(5);
stack.push(2);
stack.push(7);
console.log(stack.getMin()); // 2
stack.pop();                 // remove 7
console.log(stack.getMin()); // 2
stack.pop();                 // remove 2, min falls back to 5
console.log(stack.getMin()); // 5

/*
================================================================
5. SAY OUT LOUD
================================================================
- "push, pop, top and getMin are all O(1). Memory is O(n)."
- "Why a second stack and not one variable: popping the
   current minimum has to reveal the previous one, and only
   a stack remembers that history."
- "I am trading O(n) memory for O(1) time. The space saving
   variant gives some back when there are few distinct
   minimums."
- "The same pattern gives a Max Stack, or a running sum."
- "The follow up they like is the minimum in a QUEUE. That
   needs a monotonic deque, which is the sliding window
   maximum problem."
*/

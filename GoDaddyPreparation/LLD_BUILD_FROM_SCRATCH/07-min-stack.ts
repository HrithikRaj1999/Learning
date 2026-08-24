/*
Q3.7  Min Stack (O(1) getMin - LC 155)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: Two Parallel Stacks (`values` stack + `minimums` stack).
- WHY: Single `min` variable fails when the minimum item is popped because we lose history of the previous minimum!
  Storing a parallel history stack of minimums guarantees `getMin()` is a simple O(1) peek.

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "A single variable cannot remember past minimums when the current minimum is popped."
- "Maintain a parallel `minimums` stack that is ALWAYS the exact same height as `values` stack."
- "For every `push(x)`: write `x` to `values`, and write `min(x, currentMin)` to `minimums`."
- "For every `pop()`: pop from BOTH stacks in sync."
- "`getMin()` simply returns the top of `minimums` stack in O(1) time."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- push(value):
    1. `values.push(value)`.
    2. `best = minimums.at(-1) ?? value` (gets current minimum or `value` if first push).
    3. `minimums.push(Math.min(value, best))`.
- pop():
    1. If `isEmpty()`, throw "Stack is empty".
    2. `minimums.pop()`.
    3. Return `values.pop()!`.
- top(): If `isEmpty()`, throw. Return `values.at(-1)!`.
- getMin(): If `isEmpty()`, throw. Return `minimums.at(-1)!`.
- isEmpty(): Return `values.length === 0`.

SHORT SYNTAX TRICKS:
  const best = minimums.at(-1) ?? value // Handles empty stack on 1st push cleanly
  Math.min(value, best)                 // Calculates running minimum in 1 line

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - push(x)  : O(1)
    - pop()    : O(1)
    - top()    : O(1)
    - getMin() : O(1)
- SPACE COMPLEXITY: O(N) auxiliary space for `minimums` stack.

================================================================
5. VISUAL DIAGRAM
================================================================
Push 5, Push 2, Push 7, then Pop twice:

  Operation      values Stack      minimums Stack      getMin()
  push(5)        [5]               [5]                 5
  push(2)        [5, 2]            [5, 2]              2  (min of 2, 5 is 2)
  push(7)        [5, 2, 7]         [5, 2, 2]           2  (7 >= 2, carry 2 forward!)

  pop() -> 7     [5, 2]            [5, 2]              2
  pop() -> 2     [5]               [5]                 5  (5 automatically restored!)

Both stacks move together in exact lockstep!

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- BOTH STACKS MUST STAY SAME HEIGHT: Pop from both `values` and `minimums` together on every `pop()`.
- CARRY OLD MIN FORWARD: If new value > current min, push current min AGAIN to `minimums` stack!
- SPACE OPTIMIZATION VARIANT: Only push to `minimums` when `val <= currentMin`. Requires `val === minStack.top()` check on pop. (Be careful with duplicates: MUST use `<=`, not `<`).
- QUEUE VARIANT: Monotonic Deque (Sliding Window Maximum / Minimum problem).
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

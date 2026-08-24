/*
Q3.1  Stack from Scratch (Dynamic Array)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: Dynamic Array (a contiguous block of slots) + a `top` pointer index.
- WHY: Stack is LIFO (Last-In, First-Out). We only ever add or remove from the TOP.
  An array lets us index directly into the top position without moving any other items.

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "A stack only operates at the top. I track an array of fixed capacity and a `top` index."
- "`top` starts at -1 (empty state)."
- "Push increases `top` by 1 and writes the value."
- "Pop reads value at `top`, clears the slot to prevent memory leaks, and decreases `top` by 1."
- "When full (`top + 1 === capacity`), I double array capacity and copy items over. Doubling keeps insertion amortized O(1)."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- push(value):
    1. If `top + 1 === slots.length`, call grow() (create new array of 2x size, copy items).
    2. Write value at ++top.
- pop():
    1. If empty (`top === -1`), throw error.
    2. Read value at `slots[top]`.
    3. Clear `slots[top--] = undefined`.
    4. Return saved value.
- peek():
    1. If empty, throw error. Return `slots[top]`.
- size(): Return `top + 1`.
- isEmpty(): Return `top === -1`.

SHORT SYNTAX TRICKS:
  slots[++top] = value        // Move up and write in 1 step
  slots[top--] = undefined    // Clear and move down in 1 step

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - push(x) : Amortized O(1) [O(N) only during double resize]
    - pop()   : O(1)
    - peek()  : O(1)
- SPACE COMPLEXITY: O(N) where N is the total items stored.

================================================================
5. VISUAL DIAGRAM
================================================================
Capacity 4. push 10, 20, 30, 40, then push 50 (triggers grow):

  push(10)  [10,  _,  _,  _]   top = 0
  push(20)  [10, 20,  _,  _]   top = 1
  push(30)  [10, 20, 30,  _]   top = 2
  push(40)  [10, 20, 30, 40]   top = 3  <-- FULL!

  push(50)  Full! Grow to 8 slots:
            [10, 20, 30, 40,  _,  _,  _,  _]
            Write 50 at index 4:
            [10, 20, 30, 40, 50,  _,  _,  _]   top = 4

  pop()     Read 50, clear slot 4, top back to 3:
            [10, 20, 30, 40,  _,  _,  _,  _]   top = 3

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- `top` starts at -1, NOT 0. Size is always `top + 1`.
- ALWAYS CLEAR SLOT ON POP (`slots[top] = undefined`) to avoid memory leak in garbage-collected languages.
- Doubling capacity is crucial. Growing by +1 slot each time turns push into O(N).
- Linked list alternative gives true O(1) with no copying, but array gives far better CPU cache locality.
*/


export class Stack<T> {
  // my own block of slots. I only index into it.
  private slots: (T | undefined)[] = new Array(4);
  // index of the last item. -1 means empty.
  private top = -1;

  push(value: T): void {
    // no free slot, so double the block first
    if (this.top + 1 === this.slots.length) this.grow();
    // ++top moves the top and gives the new index in one step
    this.slots[++this.top] = value;
  }

  pop(): T {
    if (this.isEmpty()) throw new Error("Stack is empty");
    const value = this.slots[this.top]!;
    // clear the slot and step down, in one line
    this.slots[this.top--] = undefined;
    return value;
  }

  peek(): T {
    if (this.isEmpty()) throw new Error("Stack is empty");
    return this.slots[this.top]!;
  }

  size(): number { return this.top + 1; }

  isEmpty(): boolean { return this.top === -1; }

  private grow(): void {
    const bigger = new Array<T | undefined>(this.slots.length * 2);
    for (let i = 0; i <= this.top; i++) bigger[i] = this.slots[i];
    this.slots = bigger;
  }
}

// quick check
const stack = new Stack<number>();
stack.push(10);
stack.push(20);
stack.push(30);
console.log(stack.pop());   // 30
console.log(stack.peek());  // 20
console.log(stack.size());  // 2

/*
================================================================
5. SAY OUT LOUD
================================================================
- "push, pop and peek are O(1). push is amortised O(1),
   because resize is O(n) but happens once every n pushes."
- "Doubling is what makes it amortised."
- "To shrink, halve only when size drops below capacity / 4.
   At / 2 it thrashes: grow, shrink, grow, shrink."
- "Linked nodes also work. True O(1) and no copying, but one
   object per item and worse cache use. The array wins."
- "Not thread safe. In Java I would use ArrayDeque, not the
   old Stack class, which locks on every call."
*/

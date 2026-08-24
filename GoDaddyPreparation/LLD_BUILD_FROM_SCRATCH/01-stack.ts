/*
Q3.1  Stack from scratch (no built-in collections)

================================================================
1. INTUITION
================================================================
WHAT
  A stack is last in, first out. I only ever touch the top.

WHY THIS DESIGN
  Because I only touch the top, nothing ever shifts.
  So I need two things: one block of slots, and one number
  that says where the top is right now.

HOW IT WORKS
  1. top starts at -1. That means empty.
  2. push -> move top up, write there.
  3. pop  -> read at top, clear it, move top down.
  4. Block full? Make a block twice as big and copy over.

WHY DOUBLE THE SIZE
  The copy costs O(n). But I only copy after n cheap pushes.
  Spread over all those pushes it works out as O(1) each.
  That is what "amortised O(1)" means.
  If I grew by 1 slot each time I would copy on every push,
  and push would be O(n). Much worse.

COST
  push / pop / peek : O(1)  (push is amortised)
  memory            : O(n)

================================================================
2. VISUAL EXAMPLE
================================================================
capacity 4. push 10, 20, 30, 40, then 50.

  push(10)  [10,  _,  _,  _]   top 0
  push(20)  [10, 20,  _,  _]   top 1
  push(30)  [10, 20, 30,  _]   top 2
  push(40)  [10, 20, 30, 40]   top 3   <- FULL

  push(50)  full, so grow first.
            copy into a block of 8:
            [10, 20, 30, 40,  _,  _,  _,  _]
            now write:
            [10, 20, 30, 40, 50,  _,  _,  _]   top 4

  pop()     read 50, clear the slot, top back to 3
            [10, 20, 30, 40,  _,  _,  _,  _]

Count the work: 5 writes + 4 copies = 9 steps for 5 pushes.
Not 5 x O(n). That is what amortised means.

================================================================
3. SKELETON
================================================================
  push(value)  grow if full, then write at ++top
  pop()        read at top, clear it, top--
  peek()       read at top
  size()       top + 1
  isEmpty()    top === -1
  grow()       copy into a block twice as big

  SHORT SYNTAX
    slots[++top] = value      write and move up in one step
    slots[top--] = undefined  clear and move down in one step
    slots.length              is the capacity. No extra field.

================================================================
4. GOTCHAS
================================================================
- TOP STARTS AT -1, not 0. Size is top + 1.
  This off-by-one is how people fail this question.
- GROW BEFORE YOU WRITE. Check full first, then write.
- DOUBLE the size. Do not add a fixed amount.
- CLEAR THE SLOT ON POP. If you skip this, the block still
  holds the object and it is never freed. A real leak.
- POP ON EMPTY THROWS. Returning null hides a caller bug.
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

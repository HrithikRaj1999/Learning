type Next<T> = StackNode<T> | null

class StackNode<T> {
    constructor(
        public value: T,
        public next: Next<T>
    ) { }

}

class Stack<T> {
    private top: Next<T> = null;
    private length: number = 0;
    constructor(value: T) {
        this.push(value)
    }
    push(value: T): void {
        const newNode = new StackNode<T>(value, this.top)
        this.top = newNode
        this.length++
    }
    pop(): Next<T> {
        if (!this.top || this.length === 0) throw new Error("Stack is empty");
        const temp = this.top;
        this.top = temp.next;
        temp.next = null;
        this.length--;
        return this.top;
    }
    peek(): T | undefined {
        return this?.top?.value
    }
    get size(): number {
        return this.length
    }
    isEmpty() {
        return this.length === 0 || !this.top
    }
    get keys(): Array<T> {
        let node = this.top
        const ans = []
        while (node) {
            ans.push(node.value)
            node = node.next
        }
        return ans
    }
}

const stack = new Stack<number>(1)
stack.push(2)
stack.push(3)
stack.push(4)
stack.pop()
stack.size
console.log(stack.keys, stack.peek())
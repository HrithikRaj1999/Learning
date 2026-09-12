"use strict";
class StackNode {
    constructor(value, next) {
        this.value = value;
        this.next = next;
    }
}
class Stack {
    constructor(value) {
        this.top = null;
        this.length = 0;
        this.push(value);
    }
    push(value) {
        const newNode = new StackNode(value, this.top);
        this.top = newNode;
        this.length++;
    }
    pop() {
        if (!this.top || this.length === 0)
            throw new Error("Stack is empty");
        const temp = this.top;
        this.top = temp.next;
        temp.next = null;
        this.length--;
        return this.top;
    }
    peek() {
        return this.top;
    }
    get size() {
        return this.length;
    }
    isEmpty() {
        return this.length === 0 || !this.top;
    }
    get keys() {
        let node = this.top;
        const ans = [];
        while (node) {
            ans.push(node.value);
            node = node.next;
        }
        return ans;
    }
}
const stack = new Stack(1);
stack.push(2);
stack.push(3);
stack.push(4);
stack.pop();
stack.size;
console.log(stack.keys);

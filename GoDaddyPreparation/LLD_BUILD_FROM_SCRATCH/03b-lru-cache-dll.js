/*
Q3.3b  LRU Cache — Map + Doubly Linked List (exam-writing version, plain JS)

WHY THIS SHAPE:  Map = O(1) find node.  Doubly linked list = O(1) unlink (needs prev).
                 Newest sits behind head, oldest sits in front of tail.
                 head/tail are dummy guards, so no null checks and no empty-list case.
                 Node keeps its own key, so evicting tail.prev can delete from the Map in O(1).

WRITE IT IN THIS ORDER (muscle memory):
  1. constructor : cap, map, head, tail, then link head <-> tail
  2. removeNode  : 2 lines, no ifs
  3. addToFront  : 4 lines, set node.prev/next first, then patch the neighbours
  4. get         : miss -> undefined | hit -> moveToFront -> return value
  5. put         : hit -> update + moveToFront | miss -> map.set + addToFront + maybe evict

TRAPS:  size > cap (not >=)  |  evict AFTER inserting  |  node must store key  |  put on existing key must also move it
O(1) get, O(1) put, O(capacity) space.
*/

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.map = new Map(); // key -> node
    this.head = {}; // guard on the newest side
    this.tail = {}; // guard on the oldest side
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  addToFront(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  moveToFront(node) {
    this.removeNode(node);
    this.addToFront(node);
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToFront(node);
    return node.value;
  }

  put(key, value) {
    const node = this.map.get(key);
    if (node) {
      node.value = value;
      this.moveToFront(node);
      return;
    }
    const fresh = { key, value };
    this.map.set(key, fresh);
    this.addToFront(fresh);
    if (this.map.size > this.cap) {
      const oldest = this.tail.prev;
      this.removeNode(oldest);
      this.map.delete(oldest.key);
    }
  }
}

// quick check
const cache = new LRUCache(2);
cache.put(1, "one");
cache.put(2, "two");
cache.get(1); // 1 becomes newest
cache.put(3, "three"); // evicts 2
console.log(cache.get(1)); // one
console.log(cache.get(2)); // undefined
console.log(cache.get(3)); // three

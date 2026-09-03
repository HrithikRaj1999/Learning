/*
LRU CACHE (Map + Doubly Linked List)

INTUITION
1. Cache must do get/put in O(1) AND know which key is least recently used.
2. A Map alone gives O(1) lookup but no order; a list alone gives order but O(N) search.
3. So use both: Map<K, Node> for lookup + Doubly Linked List for order.
4. List order = newest at the front (head.next), oldest at the back (tail.prev).
5. Doubly linked (not singly) because deleting a middle node needs `prev` -> O(1) unlink.
6. head and tail are dummy guard nodes that kill every null check: list is never truly empty.
7. Each Node stores its own key, so evicting the oldest node can do map.delete(key) in O(1).
8. get(key): 
    miss -> undefined; 
    hit -> moveToFront(node) and return its value.
9. put(key,v): 
     exists -> update value + moveToFront;
     new -> add to map + addToFront;
     then if size > cap, 
            evict oldest.
10. One insert overflows by at most one, so one eviction per put is enough.

SKELETON
  moveToFront(n)     = removeNode(n); addToFront(n)
  removeNode(n)      = n.prev.next = n.next; n.next.prev = n.prev
  addToFront(n)      = link n between head and head.next
  get(k)             = map.get -> moveToFront -> value
  put(k,v)           = update+moveToFront | insert+addToFront -> evict if size > cap

COMPLEXITY:  get O(1), put O(1), space O(capacity)
*/

type Node<K, V> = {
  key: K;
  value: V;
  prev: Node<K, V>;
  next: Node<K, V>;
};

export class LRUCache<K, V> {
  private cap: number;
  private map = new Map<K, Node<K, V>>();
  // two guards that never hold data.

  private head = {} as Node<K, V>; //head.next is the newest node,
  private tail = {} as Node<K, V>;  //  tail.prev is the oldest.

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("capacity must be > 0");
    this.cap = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  private removeNode(node: Node<K, V>): void {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  private addToFront(node: Node<K, V>): void {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  private moveToFront(node: Node<K, V>): void {
    this.removeNode(node);
    this.addToFront(node);
  }

  get(key: K): V | undefined {
    const node = this.map.get(key);
    if (!node) return undefined;
    this.moveToFront(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const node = this.map.get(key);
    if (node) {
      node.value = value;
      this.moveToFront(node);
      return;
    }
    const fresh = { key, value } as Node<K, V>;
    this.map.set(key, fresh);
    this.addToFront(fresh);
    if (this.map.size > this.cap) {
      const oldest = this.tail.prev;
      this.removeNode(oldest);
      this.map.delete(oldest.key);
    }
  }

  has(key: K): boolean { return this.map.has(key); }

  size(): number { return this.map.size; }
}

// // quick check
// const cache = new LRUCache<number, string>(2);
// cache.put(1, "one");
// cache.put(2, "two");
// cache.get(1);          // 1 becomes newest
// cache.put(3, "three"); // evicts 2
// console.log(cache.get(1)); // one
// console.log(cache.get(2)); // undefined
// console.log(cache.get(3)); // three

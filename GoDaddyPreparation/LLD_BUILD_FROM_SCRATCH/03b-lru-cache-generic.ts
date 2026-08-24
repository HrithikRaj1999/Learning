/*
Q3.3b  LRU Cache with generics (pair programming)

================================================================
1. INTUITION
================================================================
WHAT
  Same cache, but I keep the order myself, and the types
  stay open as <K, V>. Nothing is fixed to string or int.

WHY A DOUBLY LINKED LIST
  I need two moves in O(1):
    find by key    -> the hash map does this
    move to front  -> the list does this
  To pull a node out of the middle I need the node before
  it. Only a doubly linked node knows its own prev.

WHY GUARD NODES
  I put one dummy node at each end. They never hold data.
  Then every real node always has a prev and a next.
  So the pointer code needs zero null checks.
  This is the biggest line saver in the question.

WHY THE NODE STORES ITS KEY
  When I evict the tail I must also remove it from the map.
  The node carries its key, so that lookup is O(1).
  Without it I would scan the whole map. O(n).

COST
  get / put : O(1)        memory : O(capacity)

================================================================
2. VISUAL EXAMPLE
================================================================
capacity 2

  put(1,"one")    head <-> [1] <-> tail        map {1}
  put(2,"two")    head <-> [2] <-> [1] <-> tail
  get(1)          found node 1. remove it, add to front:
                  head <-> [1] <-> [2] <-> tail
                  so node 2 is now next to tail = oldest
  put(3,"three")  head <-> [3] <-> [1] <-> [2] <-> tail
                  size 3 > 2, so evict tail.prev = node 2
                  it carries key 2, so map.delete(2)
                  head <-> [3] <-> [1] <-> tail   map {1,3}

THE GUARDS
  head and tail never hold data. They only exist so that
  no real node ever has a null neighbour.

remove(node) is then 2 lines and has NO special cases:

    A <-> node <-> B     becomes     A <-> B

    node.prev.next = node.next
    node.next.prev = node.prev

================================================================
3. SKELETON
================================================================
  get(key)    find node, touch it, return value
  put(k, v)   update or create, touch it, evict if too big
  touch(n)    remove + addToFront  ("just used")
  remove(n)   two pointer writes, no branches
  addToFront(n)
  has(key), size()

  SHORT SYNTAX
    {} as Node<K, V>    a guard node with no fake key/value
    head.next           the newest real node
    tail.prev           the oldest real node
    touch = remove + addToFront, reused by get and put

================================================================
4. GOTCHAS
================================================================
- USE THE GUARD NODES. Without them remove and addToFront
  each need two null checks for head and tail. That is 10
  extra lines and four more chances to slip.
- {} as Node<K, V> builds a guard without inventing a fake
  key and value. It never holds data, so the lie stays in.
- ORDER MATTERS in addToFront. Read head.next into the new
  node BEFORE you overwrite head.next, or you lose the list.
- THE NODE MUST CARRY ITS KEY. This is the detail they look
  for.
- UPDATING AN EXISTING KEY still counts as a use. Move it.
*/

type Node<K, V> = {
  key: K;
  value: V;
  prev: Node<K, V>;
  next: Node<K, V>;
};

export class LRUCache<K, V> {
  private nodes = new Map<K, Node<K, V>>();
  // two guards that never hold data.
  // head.next is the newest node, tail.prev is the oldest.
  private head = {} as Node<K, V>;
  private tail = {} as Node<K, V>;
  private capacity: number;

  constructor(capacity: number) {
    if (capacity <= 0) throw new Error("capacity must be > 0");
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: K): V | undefined {
    const node = this.nodes.get(key);
    if (!node) return undefined;
    this.touch(node);
    return node.value;
  }

  put(key: K, value: V): void {
    const existing = this.nodes.get(key);
    // updating a key still counts as using it
    if (existing) {
      existing.value = value;
      this.touch(existing);
      return;
    }
    const node = { key, value } as Node<K, V>;
    this.nodes.set(key, node);
    this.addToFront(node);
    // one insert can overflow by one, so one eviction is enough
    if (this.nodes.size > this.capacity) {
      const oldest = this.tail.prev;
      this.remove(oldest);
      // the node carries its key, so this stays O(1)
      this.nodes.delete(oldest.key);
    }
  }

  has(key: K): boolean { return this.nodes.has(key); }

  size(): number { return this.nodes.size; }

  // just used, so move it to the front
  private touch(node: Node<K, V>): void {
    this.remove(node);
    this.addToFront(node);
  }

  // the guards mean no head or tail special case here
  private remove(node: Node<K, V>): void {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  private addToFront(node: Node<K, V>): void {
    node.prev = this.head;
    // read the old first node before overwriting head.next
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }
}

// quick check
const cache = new LRUCache<number, string>(2);
cache.put(1, "one");
cache.put(2, "two");
cache.get(1);          // 1 becomes newest
cache.put(3, "three"); // evicts 2
console.log(cache.get(1)); // one
console.log(cache.get(2)); // undefined
console.log(cache.get(3)); // three

/*
================================================================
5. SAY OUT LOUD
================================================================
- "get and put are O(1). Memory is O(capacity)."
- "Doubly linked, not singly, because removing a node needs
   the previous pointer."
- "The guards are pure line saving. They turn four null
   checks into zero. With generics I build them as
   {} as Node<K, V>, so I never invent a fake key or value."
- "The node stores the key so eviction can clean the map
   without scanning it."
- "On API design: keys are <K>, and objects compare by
   reference, so I would keep keys primitive or take a
   keySelector."
- "Next I would add onEvict, a TTL, a peek that does not
   reorder, and hit / miss counters."
*/

/*
Q3.3b  LRU Cache with Generics (Map + Doubly Linked List with Guard Nodes)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: HashMap (`Map<K, Node<K,V>>`) + Doubly Linked List (`Node` with `prev` & `next`).
- WHY WE NEED BOTH:
    1. HashMap gives O(1) node lookup by key.
    2. Doubly Linked List allows O(1) removal and moving any node to front.
  (Singly linked list CANNOT remove middle nodes in O(1) because it lacks `prev` pointer).

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "HashMap maps key -> Node pointer for O(1) lookup."
- "Doubly Linked List orders nodes from Newest (at head) to Oldest (at tail)."
- "DUMMY GUARD NODES (`head` & `tail`): Prevents all edge-case null checks during insertion/removal!"
- "NODE STORES ITS KEY: Critical! When evicting `tail.prev` (oldest node), the node must know its key so we can `map.delete(oldest.key)` in O(1)."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- Helper touch(node): call `remove(node)`, then `addToFront(node)`.
- Helper remove(node): `node.prev.next = node.next; node.next.prev = node.prev;` (2 lines, zero branches!).
- Helper addToFront(node): Link node between `head` and `head.next`.
- get(key):
    1. Lookup node in map. If missing, return `undefined`.
    2. Call `touch(node)` (move to front of list).
    3. Return `node.value`.
- put(key, value):
    1. If key exists: update `node.value`, call `touch(node)`. Return.
    2. Create new node `{ key, value }`. Save in map, call `addToFront(node)`.
    3. If `map.size > capacity`: evict oldest (`oldest = tail.prev`), `remove(oldest)`, `map.delete(oldest.key)`.

SHORT SYNTAX TRICKS:
  {} as Node<K, V>    // Dummy guard node (no fake key/value needed)
  head.next           // Newest real node
  tail.prev           // Oldest real node

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - get(key) : O(1)
    - put(key, value) : O(1)
- SPACE COMPLEXITY: O(Capacity) for storing map entries and linked list nodes.

================================================================
5. VISUAL DIAGRAM
================================================================
LRU Structure with Head/Tail Guard Nodes:

  HEAD (dummy) <---> [ Node A (Newest) ] <---> [ Node B (Oldest) ] <---> TAIL (dummy)
   |                                                                       |
  head.next = Node A                                              tail.prev = Node B

  1. get("B") / touch("B"):
     Unlink Node B from middle -> Insert Node B right after HEAD:
     HEAD <---> [ Node B ] <---> [ Node A ] <---> TAIL

  2. put("C") when capacity = 2:
     Insert Node C after HEAD -> HEAD <---> [ C ] <---> [ B ] <---> [ A ] <---> TAIL
     Capacity exceeded (3 > 2) -> Evict `tail.prev` (Node A):
     Unlink Node A and execute `map.delete(A.key)`.

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- USE DUMMY GUARD NODES (`head`, `tail`): Eliminates 10+ lines of null checks for empty list, single element list, head/tail removal.
- ALWAYS STORE KEY INSIDE THE NODE: Without `node.key`, evicting the tail node requires scanning the whole Map (turns O(1) into O(N)).
- DOUBLY LINKED IS MANDATORY: Singly linked list requires iterating from head to find `prev` node during deletion.
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

/*
PROBLEM:  Breadth First Search of a Graph  (GfG "BFS of graph", LC 133 uses the same walk)
ASKED AS: "print the nodes in BFS order from a start node"

INTUITION
- BFS spreads out in circles, like a drop of water in a pond.
  First everything 1 step away, then everything 2 steps away.
- It uses a QUEUE = a line. First one to join is the first one to leave.
- DFS is the other one: it walks down one long path first.
  DFS answers "can I get there". BFS answers "how far is it".
- The Set of seen nodes is what stops us going round a circle forever.

STEPS IN WORDS
1. Put the start node in the line and mark it seen.
2. Take the front node out of the line and write it down.
3. Look at its neighbours. Any neighbour not seen yet:
   mark it seen and put it in the line.
4. Repeat until the line is empty.

TRAP: mark a node seen when you PUT IT IN the line, not when you take it out.
      If you wait, the same node joins the line many times.

  1 - 2 - 4     line [1] -> take 1, add 2,3 -> take 2, add 4
  |   |         -> take 3 (nothing new) -> take 4
  3 --+         order = 1, 2, 3, 4
*/

function bfsOrder(graph, start) {
  const seen = new Set([start]);
  const queue = [start];
  const order = [];
  let head = 0; // walking index, because shift() is slow

  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);

    for (const neighbour of graph.get(node) || []) {
      if (seen.has(neighbour)) continue;
      seen.add(neighbour); // mark it the moment it joins the line
      queue.push(neighbour);
    }
  }
  return order;
}

// QUICK CHECK
const graph = new Map([[1, [2, 3]], [2, [1, 4, 3]], [3, [1, 2]], [4, [2]]]);
console.log(bfsOrder(graph, 1)); // [1, 2, 3, 4]
console.log(bfsOrder(new Map([[7, []]]), 7)); // [7]

/*
SAY OUT LOUD
- Time O(V + E): every node leaves the line once, every edge is looked at once.
- Space O(V) for the line and the seen set.
- Never use queue.shift() in JS. It moves the whole array, so the walk
  silently becomes O(n^2). A head index is O(1).
- Same walk with a stack instead of a line = DFS.
*/

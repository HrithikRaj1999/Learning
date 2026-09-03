/*
PROBLEM:  Shortest path in an UNWEIGHTED graph
ASKED AS: "fewest number of hops from start to target"
          (LC 1971 path exists, LC 127 word ladder is this with word neighbours)

INTUITION
- BFS finishes one whole circle before moving further out.
  So the first time we ever meet a node, we came by the shortest way.
- That means: no need to compare paths. First sight = best answer.
- This is only true when every step costs the same.
  If steps cost different amounts, use Dijkstra instead.

STEPS IN WORDS
1. Distance of the start is 0. Put the start in the line.
2. Take the front node out.
3. For each neighbour we have never met:
   its distance = this node's distance + 1, then put it in the line.
4. If that neighbour is the target, return its distance right away.
5. Line goes empty and we never met the target -> return -1.

NOTE: the distance map does the job of the "seen" set.
      Already has a distance = already met = skip it.
*/

function shortestHops(graph, start, target) {
  if (start === target) return 0;

  const distance = new Map([[start, 0]]);
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];

    for (const neighbour of graph.get(node) || []) {
      if (distance.has(neighbour)) continue; // already met by a shorter way

      distance.set(neighbour, distance.get(node) + 1);
      if (neighbour === target) return distance.get(neighbour);
      queue.push(neighbour);
    }
  }
  return -1; // never reached
}

// QUICK CHECK
const graph = new Map([[1, [2, 3]], [2, [1, 4, 3]], [3, [1, 2]], [4, [2]]]);
console.log(shortestHops(graph, 1, 4)); // 2
console.log(shortestHops(graph, 1, 1)); // 0
console.log(shortestHops(new Map([[1, []], [9, []]]), 1, 9)); // -1

/*
SAY OUT LOUD
- Time O(V + E), space O(V). Same walk as plain BFS, one extra map.
- Why not DFS? DFS may reach the target by a long ugly path first and
  you would have to try every path and keep the best. BFS stops at the best.
- Equal cost is the whole reason this works. Weights -> Dijkstra
  (priority queue). Only 0 and 1 weights -> 0-1 BFS with a deque.
- To return the PATH, not just the number: store a parent map
  (child -> the node that discovered it) and walk backwards from the target.
*/

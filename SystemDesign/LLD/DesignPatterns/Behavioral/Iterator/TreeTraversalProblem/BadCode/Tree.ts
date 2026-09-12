// =============================================================================
// WHAT IS WRONG — missing Iterator pattern (tree traversal)
// =============================================================================
// PATTERN IDEA: the collection provides traversal; clients consume elements
// without knowing the node shape or recursion strategy.
//
// WHAT'S WRONG HERE: clients must know TreeNode has a `children` array and
// hand-roll DFS themselves. The traversal algorithm lives in every consumer.
//
// REAL SCENARIO: you need BFS instead of DFS, or you change `children` from an
// array to a left/right binary structure, or you add lazy/streaming traversal.
// Every hand-written recursion breaks or must be duplicated. Multiple consumers
// re-implement (and subtly disagree on) traversal order.
//
// WHY BAD: traversal logic and node structure are leaked into clients; order
// can't be centralized or swapped; structure changes break everyone.
//
// HOW TO FIX (no code): give the tree iterator(s) — e.g. a DepthFirstIterator and
// BreadthFirstIterator — that yield values. Clients pick a traversal and iterate;
// they never see `children`. Structure and order changes stay inside the tree.
// =============================================================================
// ❌ NO ITERATOR — clients must know the tree's internal node shape and write the
// traversal themselves; changing the structure breaks all of them.
export class TreeNode {
  constructor(public value: number, public children: TreeNode[] = []) {}
}
const root = new TreeNode(1, [new TreeNode(2), new TreeNode(3, [new TreeNode(4)])]);

// client hand-rolls DFS, coupled to `children` being an array
function printAll(node: TreeNode) {
  console.log(node.value);
  for (const c of node.children) printAll(c);
}
printAll(root);

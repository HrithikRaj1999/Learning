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

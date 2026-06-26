// ❌ NO VISITOR — every operation over the AST is its own instanceof ladder.
// eval, print, optimize each re-branch over node types.
export class NumberNode { constructor(public value: number) {} }
export class AddNode { constructor(public left: any, public right: any) {} }
export class MulNode { constructor(public left: any, public right: any) {} }

export function evaluate(node: any): number {
  if (node instanceof NumberNode) return node.value;
  if (node instanceof AddNode) return evaluate(node.left) + evaluate(node.right);
  if (node instanceof MulNode) return evaluate(node.left) * evaluate(node.right);
  throw new Error("unknown node"); // print()/optimize() duplicate this ladder
}
console.log(evaluate(new AddNode(new NumberNode(2), new MulNode(new NumberNode(3), new NumberNode(4)))));

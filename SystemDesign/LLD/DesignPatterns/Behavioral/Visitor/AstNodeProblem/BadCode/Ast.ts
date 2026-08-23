// =============================================================================
// WHAT IS WRONG — missing Visitor pattern
// =============================================================================
// PATTERN IDEA: a Visitor bundles one operation across all node types in a single
// class. Nodes accept a visitor and dispatch to the right visit method, so a new
// operation = one new visitor, no edits to the nodes.
//
// WHAT'S WRONG HERE: evaluate() is an instanceof ladder over node types, and
// print()/optimize() each re-implement the SAME ladder. The type-dispatch is
// duplicated per operation.
//
// REAL SCENARIO: add a "toSExpression" or "typeCheck" operation — you write yet
// another instanceof ladder. Add a new node type (e.g. SubNode) — you must edit
// EVERY ladder (eval, print, optimize) and a forgotten one throws "unknown node"
// at runtime. Operations are scattered and node coverage is unenforced.
//
// WHY BAD: each operation duplicates type dispatch; adding a node edits every
// operation; missing a case fails at runtime instead of compile time.
//
// HOW TO FIX (no code): define a Visitor interface with visitNumber/visitAdd/
// visitMul; each node has accept(visitor) that calls the matching method.
// EvalVisitor, PrintVisitor, OptimizeVisitor each implement the interface. New
// operation = a new visitor; the type system flags any node a visitor forgot.
// (Trade-off: adding a node type now touches all visitors — choose Visitor when
// operations change more often than node types.)
// =============================================================================
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

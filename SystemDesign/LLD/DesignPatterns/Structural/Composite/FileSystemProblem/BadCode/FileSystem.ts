// =============================================================================
// WHAT IS WRONG — missing Composite pattern
// =============================================================================
// PATTERN IDEA: Composite lets clients treat individual objects (leaves) and
// groups (composites) uniformly through ONE interface. Each node knows how to
// handle itself, so the client never type-checks or recurses.
//
// WHAT'S WRONG HERE: totalSize() does instanceof File vs Folder and owns the
// recursion. The traversal logic lives in the client, not the nodes.
//
// REAL SCENARIO: every operation over the tree (size, count, search, render) re-
// implements the same File/Folder branching and recursion. Add a new node type
// (Symlink) and you edit every such function; miss one and it throws "unknown
// node". The structure's shape leaks into all clients.
//
// WHY BAD: leaf vs group distinction and recursion are duplicated across every
// operation; new node types break everything; clients are coupled to the tree.
//
// HOW TO FIX (no code): define a FileSystemNode interface with size(); File returns
// its own size, Folder sums its children's size() (recursing internally). Clients
// just call node.size() — no instanceof, no client-side recursion. New node type =
// a new class implementing the interface.
// =============================================================================
// ❌ NO COMPOSITE — client must constantly distinguish leaf (File) from group
// (Folder) with type checks. Recursion logic leaks into the client.

export class File { constructor(public name: string, public size: number) {} }
export class Folder { constructor(public name: string, public children: any[] = []) {} }

// Computing size: client branches on type everywhere, manually recurses.
export function totalSize(node: any): number {
  if (node instanceof File) {
    return node.size;
  } else if (node instanceof Folder) {
    let sum = 0;
    for (const c of node.children) {
      sum += totalSize(c); // client owns the recursion + the type check
    }
    return sum;
  }
  throw new Error("unknown node");
}
const root = new Folder("root", [new File("a", 10), new Folder("sub", [new File("b", 5)])]);
console.log(totalSize(root)); // 15

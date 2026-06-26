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

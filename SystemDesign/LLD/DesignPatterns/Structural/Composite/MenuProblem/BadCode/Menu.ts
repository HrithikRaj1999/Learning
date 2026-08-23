// =============================================================================
// WHAT IS WRONG — missing Composite pattern
// =============================================================================
// PATTERN IDEA: Composite lets clients treat leaves (MenuItem) and groups
// (Submenu) uniformly through one interface; each node handles itself recursively.
//
// WHAT'S WRONG HERE: render() does instanceof MenuItem vs Submenu and owns the
// recursion/indentation. The client carries the tree-walking logic.
//
// REAL SCENARIO: every menu operation (render, total price, count items, find)
// re-implements the same item-vs-submenu branching. Add a "separator" or
// "disabled section" node and you edit every operation; a missed case throws. The
// nesting structure leaks into all callers.
//
// WHY BAD: leaf/group type checks and recursion duplicated per operation; new node
// types break callers; clients coupled to the structure.
//
// HOW TO FIX (no code): a MenuComponent interface with render(indent) (and/or
// price()); MenuItem renders itself, Submenu renders its children by calling their
// render() (recursing internally). Clients call component.render() with no
// instanceof. New node type = a new class.
// =============================================================================
// ❌ NO COMPOSITE — nested menus need type checks everywhere to render/price.
export class MenuItem { constructor(public name: string, public price: number) {} }
export class Submenu { constructor(public name: string, public items: any[] = []) {} }

export function render(node: any, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (node instanceof MenuItem) return pad + node.name + " $" + node.price;
  if (node instanceof Submenu) {
    return pad + node.name + "\n" + node.items.map((i) => render(i, indent + 1)).join("\n");
  }
  throw new Error("unknown");
}
const menu = new Submenu("Main", [new MenuItem("Soup", 5), new Submenu("Drinks", [new MenuItem("Cola", 2)])]);
console.log(render(menu));

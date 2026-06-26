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

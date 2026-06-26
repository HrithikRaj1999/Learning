// ❌ NO COMPOSITE — UI tree (panels containing widgets/panels) drawn with type
// checks. Real-life: nested layout components.
export class Widget { constructor(public label: string) {} }
export class Panel { constructor(public children: any[] = []) {} }

export function draw(node: any): string {
  if (node instanceof Widget) return "[" + node.label + "]";
  if (node instanceof Panel) return "(" + node.children.map(draw).join(" ") + ")";
  throw new Error("unknown");
}
const ui = new Panel([new Widget("OK"), new Panel([new Widget("Cancel")])]);
console.log(draw(ui));

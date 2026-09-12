// =============================================================================
// WHAT IS WRONG — missing Composite pattern
// =============================================================================
// PATTERN IDEA: Composite treats leaves (Widget) and containers (Panel) uniformly
// through one interface; each node renders itself, recursing into children.
//
// WHAT'S WRONG HERE: draw() does instanceof Widget vs Panel and owns the recursion.
// The client holds the tree-walking logic for the UI.
//
// REAL SCENARIO: every UI operation (draw, measure/layout, hit-test, serialize)
// re-implements the same widget-vs-panel branching. Add a new container type
// (Tabs, Grid) and you edit every operation; a missed case throws. The component
// tree's shape leaks into all of them.
//
// WHY BAD: leaf/container type checks and recursion duplicated per operation; new
// component types break callers; clients coupled to the UI structure.
//
// HOW TO FIX (no code): a UiComponent interface with draw() (and measure(), etc.);
// Widget draws itself, Panel draws its children by calling their draw() (recursing
// internally). Clients call component.draw() with no instanceof. New component =
// a new class implementing the interface.
// =============================================================================
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

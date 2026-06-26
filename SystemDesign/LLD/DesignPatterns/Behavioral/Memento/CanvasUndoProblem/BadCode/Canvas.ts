// ❌ NO MEMENTO — drawing app exposes its shape list so undo can splice it.
// Internals leak; undo logic is brittle and tied to the array representation.
export class Canvas {
  public shapes: string[] = []; // public so external undo can manipulate it
  draw(shape: string) { this.shapes.push(shape); }
}
const c = new Canvas();
c.draw("circle"); c.draw("square");
// external undo reaches in and mutates internals:
c.shapes.pop(); // works only because shapes is public + an array
console.log(c.shapes);

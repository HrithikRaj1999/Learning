// =============================================================================
// WHAT IS WRONG — missing Memento pattern
// =============================================================================
// PATTERN IDEA: an object captures its own state into an opaque "memento" and can
// restore from it later. Outsiders save/restore without seeing or touching the
// internals.
//
// WHAT'S WRONG HERE: Canvas.shapes is public so external undo code can pop it.
// Undo only works because it depends on shapes being a public array.
//
// REAL SCENARIO: you change storage to a layered structure or add metadata (z-
// order, colors). The external pop() undo breaks, and any code can corrupt the
// canvas by mutating shapes directly. Encapsulation is gone, so invariants can't
// be protected.
//
// WHY BAD: internals are exposed for undo to function; undo is tied to the exact
// representation; nothing guards the canvas state.
//
// HOW TO FIX (no code): Canvas creates a memento (snapshot) of its state and can
// restore from one; a caretaker (history) holds the stack of mementos. Undo =
// restore the previous memento. shapes stays private; the snapshot is opaque to
// outsiders.
// =============================================================================
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

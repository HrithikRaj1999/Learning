// =============================================================================
// WHAT IS WRONG — Open/Closed Principle (OCP) violation
// =============================================================================
// OCP rule: extend by adding code, not editing tested code. area() switches on
// a shape "type" tag. Each new shape forces an edit to this method.
//
// REAL SCENARIO: add "hexagon". You edit area(), and you will ALSO have to edit
// perimeter(), bounds(), draw() — every method that switches on the same tag.
// The shape's behavior is scattered across many switches instead of living with
// the shape. Miss one switch and hexagon silently misbehaves (TS may not even
// warn if the union isn't exhaustively checked).
//
// WHY BAD: behavior for one concept (a shape) is smeared across the calculator;
// every new shape is a multi-spot edit and a regression risk to circle/rect.
//
// HOW TO FIX (no code): give each shape its own type that knows how to compute
// its own area (a Shape interface with area()/perimeter(), or polymorphic
// classes Circle/Rectangle/Triangle). The calculator just calls shape.area().
// New shape = new class; calculator never changes.
// =============================================================================
// ❌ OCP — area() switches on a shape "type" string. Every new shape edits this
// method and risks breaking circle/rectangle that already work.
export type Shape =
  | { type: "circle"; r: number }
  | { type: "rectangle"; w: number; h: number }
  | { type: "triangle"; base: number; height: number };

export class AreaCalculator {
  area(s: Shape): number {
    switch (s.type) {
      case "circle": return Math.PI * s.r ** 2;
      case "rectangle": return s.w * s.h;
      case "triangle": return 0.5 * s.base * s.height;
      // add "hexagon" => edit here, recompile, re-test everything
    }
  }
  // duplicate smell: perimeter() will need the SAME switch
}
console.log(new AreaCalculator().area({ type: "circle", r: 2 }));

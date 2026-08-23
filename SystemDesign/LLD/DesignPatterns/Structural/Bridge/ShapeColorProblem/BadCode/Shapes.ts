// =============================================================================
// WHAT IS WRONG — missing Bridge pattern
// =============================================================================
// PATTERN IDEA: Bridge separates two independent dimensions (here shape and color/
// renderer) into an abstraction and an implementation that combine by composition.
//
// WHAT'S WRONG HERE: shape (Circle/Square) is fused with color (Red/Blue) by
// inheritance — RedCircle, BlueCircle, RedSquare, BlueSquare. Both dimensions are
// baked into one class per combination.
//
// REAL SCENARIO: add Green and you need GreenCircle + GreenSquare; add Triangle and
// you need it in every color. Shapes(M) × Colors(N) = M*N classes — unmaintainable
// as either axis grows. Color logic is duplicated across shapes.
//
// WHY BAD: combinatorial class explosion; adding one option on either axis
// multiplies classes; shared color/shape logic duplicated.
//
// HOW TO FIX (no code): Color (or Renderer) is an interface (Red/Blue/Green); Shape
// is the abstraction (Circle/Square/Triangle) holding a Color and delegating the
// color part of draw(). Shapes and colors grow independently: M + N classes, any
// combination by composition.
// =============================================================================
// ❌ NO BRIDGE — two dimensions (shape x rendering API) combined via inheritance
// → combinatorial class explosion. Add one renderer => double the classes.

export class RedCircle { draw() { return "Red circle"; } }
export class BlueCircle { draw() { return "Blue circle"; } }
export class RedSquare { draw() { return "Red square"; } }
export class BlueSquare { draw() { return "Blue square"; } }
// Add "Green" => GreenCircle, GreenSquare. Add "Triangle" => x every color.
// Shapes(M) x Colors(N) = M*N classes. Unmaintainable.
console.log(new RedCircle().draw());

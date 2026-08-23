// =============================================================================
// WHAT IS WRONG — missing Visitor pattern
// =============================================================================
// PATTERN IDEA: a Visitor groups one operation across all shape types in a single
// class; shapes accept a visitor and dispatch. New operation = new visitor.
//
// WHAT'S WRONG HERE: area() is an instanceof ladder over Circle/Square/Triangle,
// and a new operation like perimeter() needs ANOTHER identical ladder. Operations
// over the shapes are scattered into separate type-switching functions.
//
// REAL SCENARIO: add perimeter(), then draw(), then boundingBox() — each is a new
// instanceof ladder. Add a new shape (Pentagon) — you must edit every ladder and a
// forgotten one silently throws "unknown shape" at runtime. The per-shape logic
// for one operation isn't grouped or compiler-checked.
//
// WHY BAD: each operation duplicates shape dispatch; adding a shape edits every
// operation; missed cases are runtime gaps.
//
// HOW TO FIX (no code): define a Visitor with visitCircle/visitSquare/visitTriangle;
// each shape has accept(visitor). AreaVisitor, PerimeterVisitor implement it. New
// operation = a new visitor; the type system enforces full shape coverage.
// (Choose Visitor when you add operations more often than shape types.)
// =============================================================================
// ❌ NO VISITOR — adding a new operation forces editing EVERY element class, or
// writing an instanceof ladder. Operations are scattered across the hierarchy.

export class Circle { constructor(public r: number) {} }
export class Square { constructor(public side: number) {} }
export class Triangle { constructor(public base: number, public h: number) {} }

// New op "area" => instanceof ladder. New op "perimeter" => ANOTHER ladder.
export function area(shape: any): number {
  if (shape instanceof Circle) return Math.PI * shape.r ** 2;
  if (shape instanceof Square) return shape.side ** 2;
  if (shape instanceof Triangle) return 0.5 * shape.base * shape.h;
  throw new Error("unknown shape"); // forget a shape => silent gap
}
console.log(area(new Square(4)));

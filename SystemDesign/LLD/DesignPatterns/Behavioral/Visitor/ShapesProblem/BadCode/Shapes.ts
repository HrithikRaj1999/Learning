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

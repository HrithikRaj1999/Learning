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

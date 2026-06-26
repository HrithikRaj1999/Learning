// ❌ NO BRIDGE — two dimensions (shape x rendering API) combined via inheritance
// → combinatorial class explosion. Add one renderer => double the classes.

export class RedCircle { draw() { return "Red circle"; } }
export class BlueCircle { draw() { return "Blue circle"; } }
export class RedSquare { draw() { return "Red square"; } }
export class BlueSquare { draw() { return "Blue square"; } }
// Add "Green" => GreenCircle, GreenSquare. Add "Triangle" => x every color.
// Shapes(M) x Colors(N) = M*N classes. Unmaintainable.
console.log(new RedCircle().draw());

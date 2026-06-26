// ❌ BROKEN PROTOTYPE — manual field-by-field copy that forgets a field when the
// class grows; nested points shared by reference.
export class Shape {
  constructor(
    public position: { x: number; y: number },
    public color: string,
    public rotation: number = 0, // added later; copy() below forgot it
  ) {}
  copy(): Shape {
    // 🐛 forgot rotation; 🐛 shares the same position object
    const c = new Shape(this.position, this.color);
    return c;
  }
}
const original = new Shape({ x: 1, y: 1 }, "red", 90);
const dup = original.copy();
dup.position.x = 999;        // mutates original.position too
console.log(original.position, dup.rotation); // {x:999...}, 0 (lost rotation)

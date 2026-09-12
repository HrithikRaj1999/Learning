// =============================================================================
// WHAT IS WRONG — broken Prototype pattern (incomplete + shallow clone)
// =============================================================================
// PATTERN IDEA: a clone() must produce a fully independent, COMPLETE copy — every
// field, with nested objects deep-copied.
//
// WHAT'S WRONG HERE: copy() hand-builds a new Shape but (1) forgets `rotation`
// (added to the class later) and (2) passes the SAME position object, so the copy
// shares the original's nested point.
//
// REAL SCENARIO: `rotation` was added after copy() was written, so every clone
// silently loses its rotation — a bug nobody flagged because clone() still
// compiles. And mutating dup.position.x also moves the original, because they
// share one position object. Both are classic "looks fine, corrupts data" bugs.
//
// WHY BAD: manual field-by-field clones drift from the real field set (miss new
// fields) and shallow-share nested mutable state.
//
// HOW TO FIX (no code): implement clone() to deep-copy ALL state (new position
// object, all fields including rotation), or use a clone helper that can't forget
// fields. Better: make Shape immutable so sharing nested objects is harmless.
// =============================================================================
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

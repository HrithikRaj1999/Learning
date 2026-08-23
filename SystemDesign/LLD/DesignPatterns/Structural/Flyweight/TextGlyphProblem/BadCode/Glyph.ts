// =============================================================================
// WHAT IS WRONG — missing Flyweight pattern
// =============================================================================
// PATTERN IDEA: Flyweight stores INTRINSIC shared state (font, metrics) once and
// references it from many objects, keeping EXTRINSIC state (position) per instance.
//
// WHAT'S WRONG HERE: every Character stores its own font, size, and heavy metrics
// array, which are identical across most characters. The font metadata is
// duplicated per character.
//
// REAL SCENARIO: a 100k-character document holds 100k copies of the same Arial
// metrics — huge wasted memory in an editor that should stay snappy. Only the glyph
// and x/y differ per character; the font/metrics are shared.
//
// WHY BAD: identical font metadata is duplicated per character; memory scales with
// character count instead of font count.
//
// HOW TO FIX (no code): a Glyph/FontStyle flyweight holds the shared font + size +
// metrics, created once via a factory keyed by (font, size). Each Character stores
// only its letter and x/y plus a reference to the shared style. 100k chars, a few
// styles.
// =============================================================================
// ❌ NO FLYWEIGHT — every character object stores its own font/size/family copy.
// A 100k-char document duplicates the same font metadata 100k times.
export class Character {
  constructor(
    public char: string,
    public x: number,
    public y: number,
    public font: string,     // intrinsic, identical across most chars
    public size: number,     // intrinsic
    public metrics: number[],// intrinsic, heavy
  ) {}
}
const heavyMetrics = new Array(256).fill(0);
const doc: Character[] = [];
for (let i = 0; i < 5; i++) doc.push(new Character("a", i, 0, "Arial", 12, [...heavyMetrics]));
console.log("chars:", doc.length, "(each duplicates font metrics)");

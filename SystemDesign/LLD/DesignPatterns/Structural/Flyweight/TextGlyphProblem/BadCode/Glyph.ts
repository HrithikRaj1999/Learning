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

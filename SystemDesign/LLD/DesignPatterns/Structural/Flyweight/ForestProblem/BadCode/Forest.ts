// ❌ NO FLYWEIGHT — each tree stores its own copy of heavy shared data
// (mesh, texture, bark color). 1,000,000 trees => 1,000,000 duplicate meshes.

export class Tree {
  constructor(
    public x: number,
    public y: number,
    public mesh: number[],      // heavy, identical for same species
    public texture: string,     // heavy, identical for same species
    public species: string,
  ) {}
}

const forest: Tree[] = [];
const heavyMesh = new Array(1000).fill(0); // pretend this is huge
for (let i = 0; i < 5; i++) {
  // Every tree duplicates the SAME mesh + texture in memory:
  forest.push(new Tree(i, i, [...heavyMesh], "oak.png", "oak"));
}
console.log("trees:", forest.length, "(each holds its own mesh copy 😱)");

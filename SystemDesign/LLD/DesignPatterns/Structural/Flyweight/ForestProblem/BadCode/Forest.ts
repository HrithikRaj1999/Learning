// =============================================================================
// WHAT IS WRONG — missing Flyweight pattern
// =============================================================================
// PATTERN IDEA: Flyweight stores INTRINSIC shared state once and references it from
// many objects, keeping only EXTRINSIC per-instance state on each object.
//
// WHAT'S WRONG HERE: every Tree carries its own copy of the mesh and texture, which
// are identical for a given species. The heavy shared data is duplicated per tree.
//
// REAL SCENARIO: a forest of 1,000,000 trees holds a million copies of the same oak
// mesh/texture — gigabytes wasted, likely an out-of-memory crash. Only x/y differ
// per tree; species mesh/texture are shared.
//
// WHY BAD: heavy per-species data is duplicated across every instance; memory scales
// with tree count instead of species count.
//
// HOW TO FIX (no code): a TreeType flyweight holds the shared mesh + texture per
// species, created once via a factory keyed by species. Each Tree stores only x, y
// and a reference to its TreeType. A million trees share a handful of TreeTypes.
// =============================================================================
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

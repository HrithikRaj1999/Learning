// =============================================================================
// WHAT IS WRONG — missing Flyweight pattern
// =============================================================================
// PATTERN IDEA: Flyweight separates INTRINSIC state (shared, identical across many
// objects) from EXTRINSIC state (per-instance). The shared heavy data is stored
// once and referenced by all instances.
//
// WHAT'S WRONG HERE: every Bullet stores its own copy of the sprite (1024-element
// array) and sound. These are intrinsic — identical for all bullets of a kind — yet
// duplicated per bullet.
//
// REAL SCENARIO: a bullet-hell game with 10k bullets holds 10k copies of the same
// sprite buffer — massive wasted memory and GC pressure that can stutter or crash
// the game. The position/velocity differ per bullet, but the sprite/sound never do.
//
// WHY BAD: heavy shared data is duplicated thousands of times; memory blows up
// linearly with object count for no reason.
//
// HOW TO FIX (no code): a BulletType flyweight holds the shared sprite + sound,
// created once per kind (via a factory that caches by kind). Each Bullet stores only
// extrinsic state (x, y, vx, vy) plus a reference to its shared BulletType. 10k
// bullets, one sprite.
// =============================================================================
// ❌ NO FLYWEIGHT — every bullet stores its own sprite + sound buffer. A bullet-
// hell game with 10k bullets duplicates the same sprite 10k times.
export class Bullet {
  constructor(
    public x: number, public y: number, public vx: number, public vy: number,
    public sprite: number[], // intrinsic heavy
    public sound: string,    // intrinsic
  ) {}
}
const sprite = new Array(1024).fill(1);
const bullets: Bullet[] = [];
for (let i = 0; i < 5; i++) bullets.push(new Bullet(i, 0, 1, 1, [...sprite], "pew.wav"));
console.log("bullets:", bullets.length);

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

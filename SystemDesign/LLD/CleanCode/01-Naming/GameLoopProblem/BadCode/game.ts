// ❌ BAD NAMING — game loop with single-letter everything + magic numbers.
export function upd(e: any[], dt: number): void {
  for (const o of e) {
    o.x += o.vx * dt;
    o.y += o.vy * dt;
    if (o.h <= 0) o.d = true;    // h? d?
    if (o.t > 3) o.t = 0;        // 3 = ? magic
  }
}

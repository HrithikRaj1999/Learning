// ❌ BAD NAMING — cryptic banking code; intent hidden, magic codes.
export function proc(acc: any, amt: number, t: number): boolean {
  if (t === 1) {                 // 1 = deposit? withdraw? unknown
    acc.b += amt;
    return true;
  } else if (t === 2) {
    if (acc.b >= amt) { acc.b -= amt; return true; } // b = balance
    return false;
  }
  return false;
}
const a1 = { b: 100, st: 0 };    // st = status?
proc(a1, 50, 2);

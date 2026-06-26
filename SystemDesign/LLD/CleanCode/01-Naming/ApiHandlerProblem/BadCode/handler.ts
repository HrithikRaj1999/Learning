// ❌ BAD NAMING — HTTP handler with opaque names; can't tell what it does.
export function h(req: any, res: any): void {
  const d = req.body;            // d?
  const u = d.u;                 // u?
  const p = d.p;                 // p?
  if (u && p) {
    const r = check(u, p);       // r? check what?
    res.send(r ? "ok" : "no");
  }
}
function check(_u: string, _p: string): boolean { return true; }

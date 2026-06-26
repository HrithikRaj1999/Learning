// ❌ NO COMMAND — order actions executed immediately + inline. Can't queue,
// retry, schedule, or log them uniformly.
class Warehouse { ship(id: string) { return "shipped " + id; } }
class Billing { invoice(id: string) { return "invoiced " + id; } }

export function process(id: string): string[] {
  // direct calls; no way to defer, batch, persist, or replay on crash
  return [new Warehouse().ship(id), new Billing().invoice(id)];
}
console.log(process("ORD-9"));

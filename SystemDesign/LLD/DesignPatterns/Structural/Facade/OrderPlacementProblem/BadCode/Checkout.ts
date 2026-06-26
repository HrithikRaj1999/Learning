// ❌ NO FACADE — the client orchestrates inventory + payment + shipping +
// notification in exact order. This sequence is duplicated across the app.
class Inventory { reserve(sku: string) { return "reserved " + sku; } }
class Payment { charge(amt: number) { return "charged " + amt; } }
class Shipping { schedule(sku: string) { return "shipping " + sku; } }
class Notify { email(to: string) { return "emailed " + to; } }

export function placeOrder(sku: string, amt: number, email: string): string[] {
  // every caller must remember this order + every step (and rollback on failure!)
  const inv = new Inventory(), pay = new Payment(), ship = new Shipping(), note = new Notify();
  return [inv.reserve(sku), pay.charge(amt), ship.schedule(sku), note.email(email)];
}
console.log(placeOrder("BOOK-1", 20, "a@b.io"));

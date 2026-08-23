// =============================================================================
// WHAT IS WRONG — missing Facade pattern
// =============================================================================
// PATTERN IDEA: a Facade hides a complex multi-subsystem workflow behind one
// simple call, owning the ordering and error handling.
//
// WHAT'S WRONG HERE: placeOrder() makes the client orchestrate Inventory, Payment,
// Shipping, and Notify in a precise order. The whole checkout choreography is
// exposed and must be repeated wherever an order is placed.
//
// REAL SCENARIO: this is a money flow needing correct ordering AND rollback —
// reserve, charge, ship, notify, and undo earlier steps if a later one fails. With
// the sequence inline in callers, the critical rollback logic is missing/duplicated
// and easy to get wrong (charge succeeds, shipping fails, no refund). Adding a
// fraud-check step means editing every caller.
//
// WHY BAD: critical ordered workflow (and rollback) is duplicated across callers;
// inconsistent error handling; subsystem changes ripple everywhere.
//
// HOW TO FIX (no code): an OrderFacade/CheckoutService with placeOrder() that runs
// the subsystems in order, handles failures/rollback in ONE place, and exposes a
// single method. Callers just place the order; the workflow is encapsulated.
// =============================================================================
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

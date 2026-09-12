// =============================================================================
// WHAT IS WRONG — missing Factory Method pattern
// =============================================================================
// PATTERN IDEA: a base class declares a createX() factory method that subclasses
// override to choose the concrete product; shared logic uses the product
// abstractly.
//
// WHAT'S WRONG HERE: Logistics.planDelivery() hardcodes an if/else ladder to new
// up Truck or Ship. Object creation is tangled with the delivery-planning logic.
//
// REAL SCENARIO: add air or rail transport — you edit this method, and the ladder
// grows forever; any other method needing transport repeats it. The class can't be
// extended for a new transport without modifying it (OCP break).
//
// WHY BAD: creation is fused into business logic and duplicated; every new
// transport edits the client.
//
// HOW TO FIX (no code): give Logistics an abstract createTransport() factory
// method; RoadLogistics/SeaLogistics subclasses override it. planDelivery() calls
// createTransport() and uses deliver(). New transport = a new subclass; the
// planning logic stays put.
// =============================================================================
// ❌ NO FACTORY METHOD — client hard-codes object creation with an if/else
// ladder. Every new transport type edits this method (also breaks OCP).

class Truck { deliver() { return "by road"; } }
class Ship { deliver() { return "by sea"; } }

export class Logistics {
  planDelivery(type: string): string {
    let transport: Truck | Ship;
    if (type === "road") {
      transport = new Truck();      // creation logic tangled with business logic
    } else if (type === "sea") {
      transport = new Ship();
    } else {
      throw new Error("unknown transport"); // grows forever
    }
    return "Delivering " + transport.deliver();
  }
}
console.log(new Logistics().planDelivery("road"));

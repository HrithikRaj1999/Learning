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

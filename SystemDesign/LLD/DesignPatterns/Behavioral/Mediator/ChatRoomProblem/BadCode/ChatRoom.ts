// =============================================================================
// WHAT IS WRONG — missing Mediator pattern
// =============================================================================
// PATTERN IDEA: participants communicate through a central mediator instead of
// holding direct references to each other. N links to a hub, not N*N links.
//
// WHAT'S WRONG HERE: each User keeps a peers[] list of every other User and loops
// over them to send. The demo even shows the manual connect() spaghetti where
// everyone wires to everyone.
//
// REAL SCENARIO: add user D and you must connect it to A, B, and C — and connect
// each of them back. Want features like history, muting, or private rooms? They
// have nowhere to live; each User would need them. The web grows quadratically
// and one missed connect() silently drops messages.
//
// WHY BAD: N*N coupling, manual wiring, no place for room-level behavior, fragile
// as membership changes.
//
// HOW TO FIX (no code): introduce a ChatRoom mediator. Users send to the room;
// the room broadcasts to members and owns cross-cutting concerns (history,
// filtering, membership). Users know only the room; joining = registering once.
// =============================================================================
// ❌ NO MEDIATOR — every participant references every other directly.
// N participants => N*N coupling. Adding a user touches everyone.

export class User {
  private peers: User[] = [];
  constructor(public name: string) {}
  connect(u: User) { this.peers.push(u); } // each user wires to each other
  send(msg: string) {
    // must loop over direct references to every peer
    for (const p of this.peers) p.receive(this.name, msg);
  }
  receive(from: string, msg: string) { console.log(`${this.name} got from ${from}: ${msg}`); }
}
const a = new User("A"), b = new User("B"), c = new User("C");
a.connect(b); a.connect(c); b.connect(a); b.connect(c); c.connect(a); c.connect(b); // spaghetti
a.send("hi");

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

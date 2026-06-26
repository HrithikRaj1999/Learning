// ❌ NO PROXY — heavy resource loaded eagerly and unconditionally. No lazy load,
// no caching, no access control. You pay full cost even if never displayed.

export class HighResImage {
  constructor(public filename: string) {
    console.log("Loading " + filename + " from disk (SLOW, MBs)...");
  }
  display() { return "showing " + this.filename; }
}

// All images load immediately at startup, even ones never shown:
const gallery = [
  new HighResImage("a.raw"),
  new HighResImage("b.raw"),
  new HighResImage("c.raw"),
];
console.log(gallery[0].display()); // only this one was ever needed

// ❌ LSP VIOLATION — "Liskov Substitution Principle"
// Subtypes must be substitutable for their base type WITHOUT surprises.
// Here a Penguin IS-A Bird, but it breaks fly() — substitution explodes.

export class Bird {
  fly(): string {
    return "flap flap, airborne";
  }
}

export class Sparrow extends Bird {}

export class Penguin extends Bird {
  // Breaks the contract: callers of Bird.fly() now blow up at runtime
  fly(): string {
    throw new Error("Penguins can't fly!");
  }
}

// Client written against the base type — it should never need to know subtypes
function makeAllFly(birds: Bird[]): void {
  for (const b of birds) {
    console.log(b.fly()); // throws when a Penguin sneaks in
  }
}

makeAllFly([new Sparrow(), new Penguin()]); // 💥 runtime crash

// Classic second offender: Square extends Rectangle
export class Rectangle {
  constructor(protected w: number, protected h: number) {}
  setWidth(w: number) { this.w = w; }
  setHeight(h: number) { this.h = h; }
  area(): number { return this.w * this.h; }
}
export class Square extends Rectangle {
  // mutating width secretly mutates height -> violates Rectangle's invariants
  setWidth(w: number) { this.w = w; this.h = w; }
  setHeight(h: number) { this.w = h; this.h = h; }
}

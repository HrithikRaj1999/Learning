// =============================================================================
// WHAT IS WRONG — Liskov Substitution Principle (LSP) violation (two classics)
// =============================================================================
// LSP rule: anywhere the base type is expected, ANY subtype must work without
// surprises. A subtype may do more, never break a promise the base made.
//
// OFFENDER 1 — Penguin extends Bird but fly() throws.
//   REAL SCENARIO: makeAllFly() is written against Bird and trusts fly() works.
//   The day a Penguin is in the list, the loop crashes at runtime. The bug is
//   not in makeAllFly() — it is correct. The bug is that Penguin claimed to be a
//   Bird-that-flies when it isn't. "Flying" doesn't belong on the Bird base.
//
// OFFENDER 2 — Square extends Rectangle.
//   REAL SCENARIO: Rectangle promises width and height move independently
//   (setWidth doesn't touch height). Square breaks that invariant: setWidth also
//   sets height. Any code that does "set width=5, height=4, expect area 20"
//   silently gets 16 with a Square. No crash — worse, a wrong answer. The is-a
//   relationship is false: a Square is not a substitutable Rectangle.
//
// WHY BAD: clients written against the base get runtime crashes or silently
// wrong results when a "subtype" violates the base's guarantees. Forces ugly
// `instanceof` checks everywhere, defeating polymorphism.
//
// HOW TO FIX (no code):
//   - Birds: don't put fly() on the base. Model a Flyable capability that only
//     flying birds implement; makeAllFly() accepts Flyable[], so a Penguin can't
//     be passed — error becomes impossible, not deferred to runtime.
//   - Shapes: don't inherit Square from Rectangle. Make Shape immutable (no
//     setters), or give Square its own type with a single side. Remove the
//     mutating setters that break the rectangle invariant.
// RULE OF THUMB: overriding a method only to throw/disable it = wrong hierarchy.
// =============================================================================
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

// =============================================================================
// WHAT IS WRONG — missing Mediator pattern
// =============================================================================
// PATTERN IDEA: route all coordination through one central mediator. Objects talk
// to the mediator, not to each other, collapsing N*N direct links into N links to
// a hub.
//
// WHAT'S WRONG HERE: each Plane holds references to every other Plane and asks
// them directly whether it can land. Coordination logic is smeared across the
// planes themselves.
//
// REAL SCENARIO: with N planes everyone must know everyone (N*N awareness). Two
// planes can both check "is anyone landing?" and both clear themselves — a race
// and a collision. Adding a plane means wiring it to all existing planes; the
// landing rules live in no single place you can audit or change.
//
// WHY BAD: tight all-to-all coupling, race conditions, no single authority over
// the rules; impossible to scale or reason about.
//
// HOW TO FIX (no code): introduce a ControlTower mediator. Planes send
// requestLanding() to the tower; the tower holds the single source of truth
// about runway state and grants/denies clearances. Planes know only the tower;
// adding a plane = registering it with the tower.
// =============================================================================
// ❌ NO MEDIATOR — planes coordinate landing by talking to each other directly.
// N planes => N*N awareness; chaos and collision risk.
export class Plane {
  constructor(public id: string, public others: Plane[] = []) {}
  requestLanding() {
    // must ask every other plane directly -> tight coupling, race conditions
    const busy = this.others.some((p) => p.id !== this.id && (p as any).landing);
    return busy ? this.id + " wait" : this.id + " cleared";
  }
}

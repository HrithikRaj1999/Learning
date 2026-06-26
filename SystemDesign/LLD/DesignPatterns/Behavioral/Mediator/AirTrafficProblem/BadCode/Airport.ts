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

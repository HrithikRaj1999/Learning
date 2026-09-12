// =============================================================================
// WHAT IS WRONG — missing State pattern
// =============================================================================
// PATTERN IDEA: each status is a state object that defines which actions are
// legal and where they lead. The order delegates to its current state.
//
// WHAT'S WRONG HERE: Order keeps a status string and every method (pay, ship,
// cancel) re-checks it. The allowed-transition rules are scattered across these
// conditionals.
//
// REAL SCENARIO: this is a money/fulfillment flow — illegal transitions are
// dangerous (shipping a cancelled order, paying a shipped one). With rules spread
// across methods, a refactor easily lets a bad transition slip through (the file
// even flags shipping a cancelled order). Adding a "refunded" status means
// editing every method's guard.
//
// WHY BAD: transition rules are implicit and duplicated; illegal transitions are
// easy to introduce; high-risk business logic has no single guardrail.
//
// HOW TO FIX (no code): define an OrderState interface (pay/ship/cancel) with
// PendingState, PaidState, ShippedState, CancelledState. Each implements only the
// legal actions and returns the next state; illegal actions are rejected in one
// obvious place. Order delegates to currentState; transitions become explicit.
// =============================================================================
// ❌ NO STATE — order behavior depends on a status string switched in EVERY
// method. Invalid transitions (ship a cancelled order) slip through.
export class Order {
  private status = "pending"; // pending|paid|shipped|cancelled
  pay() { if (this.status === "pending") { this.status = "paid"; return "paid"; } return "can't pay"; }
  ship() {
    // 🐛 allows shipping a cancelled order in some refactors; logic scattered
    if (this.status === "paid") { this.status = "shipped"; return "shipped"; }
    return "can't ship";
  }
  cancel() { if (this.status !== "shipped") { this.status = "cancelled"; return "cancelled"; } return "can't cancel"; }
}
console.log(new Order().pay());

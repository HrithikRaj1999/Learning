// =============================================================================
// WHAT IS WRONG — missing Observer pattern
// =============================================================================
// PATTERN IDEA: a subject keeps a list of observers and notifies them on change.
// The subject doesn't know who the observers are concretely — just that they
// implement an update() contract.
//
// WHAT'S WRONG HERE: Cart owns concrete TotalLabel + Badge and re-renders each by
// hand inside add(). The data model is welded to specific UI widgets.
//
// REAL SCENARIO: add a "free shipping" banner or a discount widget that should
// also react to cart changes. You must edit Cart and remember to refresh the new
// view in EVERY mutating method (add, remove, clear). Forget one and that view
// shows a stale total — a classic UI desync bug.
//
// WHY BAD: subject is coupled to concrete views; every new dependent edits the
// subject and every mutation site; easy to miss a refresh.
//
// HOW TO FIX (no code): Cart becomes a subject with subscribe()/notify(). Widgets
// are observers implementing update(cartState). On any change Cart calls notify()
// once; all observers refresh. Adding a widget = subscribe it; Cart never changes.
// =============================================================================
// ❌ NO OBSERVER — when the cart changes, it manually re-calls every dependent
// UI piece. Coupling between data and views.
class TotalLabel { render(t: number) { return "Total: " + t; } }
class Badge { render(n: number) { return "Items: " + n; } }

export class Cart {
  private items: number[] = [];
  private label = new TotalLabel();
  private badge = new Badge();
  add(price: number) {
    this.items.push(price);
    // must remember to refresh each view by hand:
    console.log(this.label.render(this.items.reduce((a, b) => a + b, 0)));
    console.log(this.badge.render(this.items.length));
  }
}
new Cart().add(10);

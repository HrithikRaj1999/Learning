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

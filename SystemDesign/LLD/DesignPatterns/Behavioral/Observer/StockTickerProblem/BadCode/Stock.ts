// =============================================================================
// WHAT IS WRONG — missing Observer pattern
// =============================================================================
// PATTERN IDEA: the subject (Stock) maintains a subscriber list and notifies all
// on price change, without naming concrete consumers.
//
// WHAT'S WRONG HERE: Stock hardcodes a Dashboard and a MobileApp and calls each
// by hand in setPrice(). The price source is coupled to every display.
//
// REAL SCENARIO: add a price-alert service or a trading bot that must react to
// ticks. You edit Stock and add another manual call in setPrice — and any other
// mutation path. Miss one and a consumer shows a stale price; in trading that's a
// real money bug.
//
// WHY BAD: subject knows every concrete observer; new consumers edit the subject
// (OCP break); manual notification is easy to forget.
//
// HOW TO FIX (no code): Stock becomes a subject with subscribe()/notify().
// Displays/bots are observers implementing update(price). setPrice() notifies all
// once. Adding a consumer = subscribe; Stock stays closed.
// =============================================================================
// ❌ NO OBSERVER — the stock hardcodes each dashboard it must update. New
// consumer => edit the stock; forget one => stale price.
class Dashboard { show(p: number) { return "dashboard: " + p; } }
class MobileApp { push(p: number) { return "mobile: " + p; } }

export class Stock {
  private dashboard = new Dashboard();
  private mobile = new MobileApp();
  private price = 0;
  setPrice(p: number) {
    this.price = p;
    console.log(this.dashboard.show(p)); // manual, per-consumer
    console.log(this.mobile.push(p));    // add an alerting service => edit here
  }
}
new Stock().setPrice(150);

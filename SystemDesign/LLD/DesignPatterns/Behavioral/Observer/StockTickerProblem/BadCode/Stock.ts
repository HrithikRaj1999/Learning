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

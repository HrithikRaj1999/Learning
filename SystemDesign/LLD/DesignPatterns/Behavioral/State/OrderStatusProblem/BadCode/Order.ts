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

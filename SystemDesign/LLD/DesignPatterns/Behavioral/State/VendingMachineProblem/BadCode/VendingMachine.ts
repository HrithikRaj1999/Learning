// ❌ NO STATE PATTERN — behavior depends on a state string checked via big
// switches duplicated across every method. Invalid transitions easy to miss.

export class VendingMachine {
  private state = "idle"; // "idle" | "hasMoney" | "dispensing"
  insertCoin() {
    switch (this.state) {
      case "idle": this.state = "hasMoney"; return "coin accepted";
      case "hasMoney": return "already have money";
      case "dispensing": return "wait, dispensing";
    }
  }
  pressButton() {
    switch (this.state) { // same switch shape repeated
      case "idle": return "insert coin first";
      case "hasMoney": this.state = "dispensing"; return "dispensing...";
      case "dispensing": return "already dispensing";
    }
  }
  // every new state => edit EVERY method's switch. Transitions scattered.
}
console.log(new VendingMachine().insertCoin());

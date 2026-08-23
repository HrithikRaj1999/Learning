// =============================================================================
// WHAT IS WRONG — missing State pattern
// =============================================================================
// PATTERN IDEA: each state is an object defining behavior for every action in
// that state and the transition out. The machine delegates to its current state.
//
// WHAT'S WRONG HERE: VendingMachine keeps a state string and EVERY method
// (insertCoin, pressButton) repeats the same switch over states. The same shape
// is copy-pasted across methods.
//
// REAL SCENARIO: add a "soldOut" or "refunding" state. You must edit the switch
// in every method and keep them consistent. Miss a case and an action does the
// wrong thing in that state (dispense with no money, accept a coin while
// dispensing). Transitions are scattered, not auditable in one place.
//
// WHY BAD: duplicated per-method switches; transitions spread out; adding a state
// edits all methods; illegal action/state combos slip in.
//
// HOW TO FIX (no code): define a State interface (insertCoin(), pressButton())
// with IdleState, HasMoneyState, DispensingState classes; each implements both
// actions for itself and returns the next state. The machine holds currentState
// and delegates. New state = one new class; methods stop switching.
// =============================================================================
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

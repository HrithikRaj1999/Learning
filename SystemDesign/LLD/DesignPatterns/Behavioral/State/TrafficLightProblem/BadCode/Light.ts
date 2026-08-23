// =============================================================================
// WHAT IS WRONG — missing State pattern
// =============================================================================
// PATTERN IDEA: each state is an object that knows its own behavior and its next
// state. The context just asks the current state to advance.
//
// WHAT'S WRONG HERE: TrafficLight switches on a color string in next() to decide
// the transition. The state machine is encoded as a switch.
//
// REAL SCENARIO: add a flashing-red or pedestrian state, or per-state timing
// (green lasts longer than yellow). You edit the switch and there's nowhere clean
// to attach per-state data/behavior. The transition graph is implicit in the
// switch, hard to visualize or validate.
//
// WHY BAD: the machine and its transitions are buried in a conditional; adding a
// state edits shared code; per-state behavior has no home.
//
// HOW TO FIX (no code): define a State interface (next()) with RedState,
// GreenState, YellowState; each returns the next state object (and can carry its
// own duration/behavior). TrafficLight holds currentState and delegates. New
// state = a new class slotted into the graph.
// =============================================================================
// ❌ NO STATE — light transitions via a switch on a color string. Adding a state
// (e.g. blinking) edits the switch; transition rules are implicit.
export class TrafficLight {
  private color = "red";
  next(): string {
    switch (this.color) {
      case "red": this.color = "green"; break;
      case "green": this.color = "yellow"; break;
      case "yellow": this.color = "red"; break;
    }
    return this.color;
  }
}
const t = new TrafficLight();
console.log(t.next(), t.next(), t.next());

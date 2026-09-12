// =============================================================================
// WHAT IS WRONG — missing State pattern
// =============================================================================
// PATTERN IDEA: model each state as its own object that defines behavior for that
// state and the transitions out of it. The context delegates to its current state
// object instead of branching on a string.
//
// WHAT'S WRONG HERE: Player tracks a state string and every method (playPause,
// stop) re-checks it with if/switch. Behavior is scattered across conditionals.
//
// REAL SCENARIO: add a "buffering" or "ended" state. You must hunt down and edit
// the if-chains in EVERY method, and it's easy to allow an invalid action (resume
// while stopped). The transition rules live nowhere explicit — they're implied by
// scattered conditions that drift out of sync.
//
// WHY BAD: state logic is duplicated across methods; transitions are implicit;
// adding a state touches everything and risks illegal transitions.
//
// HOW TO FIX (no code): define a State interface (playPause(), stop()) with
// StoppedState, PlayingState, PausedState classes; each knows its own behavior and
// what state to move to. Player holds a currentState and delegates. New state = a
// new class; methods stop branching.
// =============================================================================
// ❌ NO STATE — play/pause/stop behavior decided by flags + switches. Button
// behavior depends on combinations of booleans -> bug-prone.
export class Player {
  private state = "stopped"; // stopped|playing|paused
  playPause(): string {
    if (this.state === "stopped") { this.state = "playing"; return "start"; }
    if (this.state === "playing") { this.state = "paused"; return "pause"; }
    if (this.state === "paused") { this.state = "playing"; return "resume"; }
    return "?";
  }
  stop(): string { this.state = "stopped"; return "stop"; }
}
const p = new Player();
console.log(p.playPause(), p.playPause(), p.stop());

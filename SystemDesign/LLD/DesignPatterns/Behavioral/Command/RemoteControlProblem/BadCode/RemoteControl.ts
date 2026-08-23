// =============================================================================
// WHAT IS WRONG — missing Command pattern
// =============================================================================
// PATTERN IDEA: decouple the invoker (button) from the receiver (device) by a
// Command object. The button holds a command and calls execute(); it doesn't
// know what device or method runs.
//
// WHAT'S WRONG HERE: press() is an if/else mapping button strings straight to
// device methods. The remote is hardwired to Light and Fan and their exact
// methods.
//
// REAL SCENARIO: add a new device, or make buttons reassignable by the user, or
// add an UNDO button. All impossible without rewriting press() — there's no
// command object to undo, queue, or log, and no way to bind a button to an
// arbitrary action at runtime.
//
// WHY BAD: invoker and receivers are tightly coupled; no undo/redo/logging;
// every new button or device edits the remote.
//
// HOW TO FIX (no code): define a Command interface (execute(), optionally undo()).
// Make LightOnCommand, FanStartCommand, etc., each holding its receiver. The
// remote stores a command per slot and just calls execute(). Buttons become
// reassignable; undo/history come for free by keeping executed commands.
// =============================================================================
// ❌ NO COMMAND — the invoker (button) calls receivers directly. No undo,
// no queueing, no logging, no reuse. Wiring is hardcoded per button.

class Light { on() { return "light on"; } off() { return "light off"; } }
class Fan { start() { return "fan spinning"; } }

export class RemoteControl {
  private light = new Light();
  private fan = new Fan();
  // Each button hardwired to a receiver + method. Want undo? Rewrite everything.
  press(button: string): string {
    if (button === "light-on") return this.light.on();
    if (button === "light-off") return this.light.off();
    if (button === "fan") return this.fan.start();
    return "no-op";
  }
}
console.log(new RemoteControl().press("light-on"));

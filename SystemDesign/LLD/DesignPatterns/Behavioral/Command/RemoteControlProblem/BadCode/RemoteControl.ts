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

// ❌ NO COMMAND — "good night" routine is a hardcoded function. Can't build
// user-defined macros or schedule them without code changes.
class Lights { off() { return "lights off"; } }
class Thermostat { set(t: number) { return "temp " + t; } }
class Door { lock() { return "locked"; } }

export function goodNight(): string[] {
  // a fixed sequence; users can't compose their own scenes
  return [new Lights().off(), new Thermostat().set(18), new Door().lock()];
}
console.log(goodNight());

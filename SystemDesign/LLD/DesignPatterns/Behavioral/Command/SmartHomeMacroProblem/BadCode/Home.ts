// =============================================================================
// WHAT IS WRONG — missing Command pattern (macro commands)
// =============================================================================
// PATTERN IDEA: wrap each device action as a Command. A "macro" is just a list
// of commands run in sequence — composable at runtime, not hardcoded.
//
// WHAT'S WRONG HERE: goodNight() is a fixed function calling specific device
// methods in a fixed order. The scene is frozen in code.
//
// REAL SCENARIO: a user wants their own "Movie Night" scene, or to reorder the
// good-night steps, or to schedule a scene at 11pm. None is possible — scenes
// can only be created by a developer editing/adding functions, not by composing
// actions data-style at runtime.
//
// WHY BAD: actions aren't objects, so users can't build/save/schedule macros;
// every new scene is a code change.
//
// HOW TO FIX (no code): each device action becomes a Command with execute(). A
// MacroCommand holds an ordered list of commands and runs them. Users compose a
// macro by picking commands; the system can store, schedule, or undo it. New
// scene = a new list of existing commands, no code edit.
// =============================================================================
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

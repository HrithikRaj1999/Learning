// =============================================================================
// WHAT IS WRONG — broken Prototype pattern (shallow clone)
// =============================================================================
// PATTERN IDEA: Prototype creates new objects by cloning an existing one. The
// clone must be DEEP — fully independent of the original, including nested objects.
//
// WHAT'S WRONG HERE: makeUserSettings() "clones" with a spread `{...defaultSettings}`.
// Spread is SHALLOW: nested `features` and `limits` are copied by reference, so the
// copy and the default share the same inner objects.
//
// REAL SCENARIO: mutating the copy (push a feature, change a limit) silently
// mutates the shared default. The next user who reads defaultSettings gets the
// previous user's changes — a corruption bug that's brutal to trace because the
// mutation site looks innocent and far from the symptom.
//
// WHY BAD: shallow copy shares mutable nested state; "independent" copies aren't;
// global defaults get corrupted by per-instance edits.
//
// HOW TO FIX (no code): implement a proper deep clone (structuredClone, a clone()
// method that recursively copies nested objects/arrays, or rebuild nested values).
// Each clone owns its own nested data, so edits never leak back to the prototype.
// =============================================================================
// ❌ NO/ BROKEN PROTOTYPE — "cloning" config by copying the reference. Mutating
// the copy silently mutates the shared default. Classic shallow-copy bug.
export interface Settings { features: string[]; limits: { api: number } }

const defaultSettings: Settings = { features: ["a"], limits: { api: 100 } };

export function makeUserSettings(): Settings {
  const copy = { ...defaultSettings };      // 🐛 shallow: nested objects shared
  copy.features.push("b");                  // mutates defaultSettings.features too!
  copy.limits.api = 500;                    // mutates shared nested object too!
  return copy;
}
makeUserSettings();
console.log(defaultSettings); // features ["a","b"], limits.api 500 -> corrupted

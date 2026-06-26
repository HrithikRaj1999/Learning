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

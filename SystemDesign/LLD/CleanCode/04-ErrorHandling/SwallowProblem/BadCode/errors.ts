// ❌ BAD ERROR HANDLING — swallowed errors, empty catch, returning null,
// catching everything, using errors for control flow.

export function getConfig(path: string): any {
  try {
    return JSON.parse(readFileFake(path));
  } catch (e) {
    // swallowed: caller has no idea anything failed
    return null; // null leaks downstream -> "cannot read property of null" later
  }
}

export function parseAge(s: string): number {
  try {
    const n = Number(s);
    if (isNaN(n)) throw "bad"; // throwing a string, not an Error
    return n;
  } catch {
    return -1; // magic error value mixed with valid data
  }
}

function readFileFake(_p: string): string { return "{bad json"; }
console.log(getConfig("x")); // null, silently

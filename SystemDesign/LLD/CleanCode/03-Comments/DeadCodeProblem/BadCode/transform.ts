// ❌ DEAD CODE in comments — rotting commented-out blocks nobody dares delete.
export function transform(data: number[]): number[] {
  // const old = data.map(x => x * 2 + 1);   // v1 - kept "just in case"
  // if (old.length > 100) return old.slice(0, 100);
  // return old;
  // -- new approach below --
  return data.map((x) => x * 3);
  // TODO: maybe revert to v1? (no idea why) 
}

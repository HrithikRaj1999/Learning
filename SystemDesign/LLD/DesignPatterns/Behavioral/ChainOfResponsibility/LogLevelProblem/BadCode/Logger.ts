// ❌ NO CHAIN — a logger routes by level via if/else, deciding sinks inline.
export function logMessage(level: string, msg: string): string[] {
  const out: string[] = [];
  // each block duplicates the "should this sink fire?" decision
  if (level === "debug" || level === "info" || level === "error") out.push("console: " + msg);
  if (level === "info" || level === "error") out.push("file: " + msg);
  if (level === "error") out.push("email on-call: " + msg);
  return out;
}
console.log(logMessage("error", "disk full"));

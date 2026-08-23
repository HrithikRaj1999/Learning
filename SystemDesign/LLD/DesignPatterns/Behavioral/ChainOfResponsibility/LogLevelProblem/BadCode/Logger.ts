// =============================================================================
// WHAT IS WRONG — missing Chain of Responsibility pattern
// =============================================================================
// PATTERN IDEA: each handler (sink) decides independently whether to act and
// then passes the message along. Console, File, Email become separate links.
//
// WHAT'S WRONG HERE: logMessage() duplicates the "should this sink fire?"
// decision in every if-block, all in one function. The level->sink routing is
// hardcoded and repeated.
//
// REAL SCENARIO: add a Slack sink for "warn", or change file logging to fire on
// "debug" too. You edit this function and touch the conditions that console and
// email already depend on. The membership tests ("info" || "error") are
// copy-pasted, so they drift — change one, forget another.
//
// WHY BAD: each sink's activation rule isn't owned by that sink; conditions are
// duplicated and order is fixed; adding a sink edits shared code.
//
// HOW TO FIX (no code): make each sink a handler holding a minimum level; on
// receiving a message it logs if the level qualifies, then forwards to the next
// handler regardless. Chain them console->file->email. Adding a sink = a new
// handler in the chain; each owns its own threshold.
// =============================================================================
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

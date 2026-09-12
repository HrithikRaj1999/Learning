// =============================================================================
// WHAT IS WRONG — missing Singleton pattern
// =============================================================================
// PATTERN IDEA: one shared instance for a global resource. A logger should be a
// single instance so all logs go through one buffer/file handle.
//
// WHAT'S WRONG HERE: each `new Logger()` opens its own file handle, re-reads log
// config, and has its own buffer. Three modules = three separate buffers.
//
// REAL SCENARIO: logs are scattered across independent buffers — authLogger.flush()
// only shows its own lines; dbLogger's line is stranded in another buffer. You also
// get duplicated file handles (potential write contention/corruption) and the
// config re-parsed N times. Debugging is painful because no log is complete.
//
// WHY BAD: a resource that must be unified is duplicated; logs fragment; file
// handles and config work are wasted/repeated.
//
// HOW TO FIX (no code): one shared Logger (getInstance() or a module-level
// singleton) with a single buffer and file handle. All modules log to the same
// place. (Inject the shared logger so tests can capture output.)
// =============================================================================
// ❌ NO SINGLETON — every caller builds its own Logger.
// Multiple instances => duplicated file handles, inconsistent buffers,
// config re-parsed N times, no single source of truth.

export class Logger {
  private buffer: string[] = [];
  constructor() {
    console.log("Opening app.log file handle..."); // happens once per instance
    console.log("Re-reading log config from disk..."); // wasteful, repeated
  }
  log(msg: string) { this.buffer.push(msg); }
  flush() { console.log(this.buffer.join("\n")); }
}

// Three modules each make their own -> three separate buffers, logs scattered
const authLogger = new Logger();
const dbLogger = new Logger();
const apiLogger = new Logger();
authLogger.log("login ok");
dbLogger.log("query ran");
authLogger.flush(); // only sees "login ok"; dbLogger's line is in another buffer

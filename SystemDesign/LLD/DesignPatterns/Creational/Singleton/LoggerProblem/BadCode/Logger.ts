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

// =============================================================================
// WHAT IS WRONG — missing Singleton pattern
// =============================================================================
// PATTERN IDEA: one shared instance for global state. Config should be loaded
// once and shared, so the whole app sees one consistent view.
//
// WHAT'S WRONG HERE: each `new AppConfig()` re-reads and re-parses the .env from
// disk. Module A and Module B build separate config objects.
//
// REAL SCENARIO: two costs — (1) the expensive disk read/parse runs once per
// instance, and (2) if one module mutates its config, others don't see it (the
// demo shows B still reading "3" after A set "5"). Different parts of the app act
// on divergent config — a confusing, environment-dependent bug.
//
// WHY BAD: expensive load repeats; config state diverges across instances; no
// single source of truth.
//
// HOW TO FIX (no code): load config once into a single shared instance
// (getInstance() or a module-level singleton) that all modules read. One parse,
// one consistent view. (Inject it where possible to keep tests able to swap it.)
// =============================================================================
// ❌ NO SINGLETON — config re-read + re-parsed by every module that needs it.
// Different parts of the app can end up with divergent config snapshots.
export class AppConfig {
  public settings: Record<string, string>;
  constructor() {
    console.log("Reading .env from disk + parsing (expensive)..."); // every time
    this.settings = { env: "prod", retries: "3" };
  }
  get(key: string) { return this.settings[key]; }
}
// module A and module B each build their own; if one mutates, the other won't see it
const a = new AppConfig();
const b = new AppConfig();
a.settings["retries"] = "5";
console.log(b.get("retries")); // "3" -> inconsistent view of config

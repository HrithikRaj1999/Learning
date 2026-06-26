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

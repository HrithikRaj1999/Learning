// =============================================================================
// WHAT IS WRONG — missing Singleton pattern
// =============================================================================
// PATTERN IDEA: Singleton ensures ONE shared instance for a resource that must be
// global (a cache, config, pool). All callers get the same object.
//
// WHAT'S WRONG HERE: each `new MemoryCache()` makes its own Map. writer and reader
// are different instances with separate stores.
//
// REAL SCENARIO: a write through one cache instance is invisible to another, so
// reads miss and fall through to the DB anyway — the cache provides no benefit and
// wastes memory holding duplicate, divergent data. Different parts of the app see
// different cache contents.
//
// WHY BAD: a resource that must be shared is duplicated; state diverges across
// instances; the cache fails its purpose.
//
// HOW TO FIX (no code): expose a single shared instance — a getInstance() that
// returns the same MemoryCache, or a module-level singleton injected where needed.
// All callers read/write the same store. (Prefer injecting the shared instance
// over a hard global so it stays testable.)
// =============================================================================
// ❌ NO SINGLETON — multiple in-memory caches. Writes to one are invisible to
// the others -> stale reads + wasted memory.
export class MemoryCache {
  private store = new Map<string, unknown>();
  set(k: string, v: unknown) { this.store.set(k, v); }
  get(k: string) { return this.store.get(k); }
}
const writer = new MemoryCache();
const reader = new MemoryCache(); // different Map!
writer.set("user:1", { name: "Ada" });
console.log(reader.get("user:1")); // undefined -> cache miss, hits DB anyway

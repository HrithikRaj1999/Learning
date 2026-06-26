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

// =============================================================================
// WHAT IS WRONG — Interface Segregation Principle (ISP) violation
// =============================================================================
// ISP rule: no client should depend on methods it doesn't use. ICrudRepository
// bundles reads (findById/findAll) with writes (create/update/delete). A
// read-only reporting view needs only reads but is forced to implement all
// three write methods.
//
// REAL SCENARIO: ReportingView stubs create/update/delete to throw. These stubs
// are DANGEROUS — the reporting object now exposes delete()/update() on its
// public surface. Any code holding it as an ICrudRepository could call delete()
// and, if a stub were ever wired to real storage by mistake, erase prod data.
// At best it throws at runtime; at worst it's a footgun on a read-only object.
//
// WHY BAD: write capability is forced onto a read-only consumer; the type
// system says "this can delete" about something that must never delete.
//
// HOW TO FIX (no code): split into ReadRepository (findById/findAll) and
// WriteRepository (create/update/delete). Reporting depends on ReadRepository
// only — it literally cannot call a write method. Full repos implement both.
// =============================================================================
// ❌ ISP — fat ICrudRepository forces a read-only reporting view to implement
// create/update/delete it must not allow.
export interface ICrudRepository<T> {
  findById(id: string): T | null;
  findAll(): T[];
  create(item: T): void;
  update(id: string, item: T): void;
  delete(id: string): void;
}
// Reporting needs ONLY reads, but is dragged into write methods:
export class ReportingView implements ICrudRepository<{ id: string }> {
  findById(_id: string) { return null; }
  findAll() { return []; }
  // 🐛 dangerous stubs: a bug could call these and corrupt/erase prod data
  create(_i: { id: string }) { throw new Error("read-only"); }
  update(_id: string, _i: { id: string }) { throw new Error("read-only"); }
  delete(_id: string) { throw new Error("read-only"); }
}

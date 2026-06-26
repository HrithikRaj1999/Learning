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

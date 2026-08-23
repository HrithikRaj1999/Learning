// =============================================================================
// WHAT IS WRONG — missing Iterator pattern (over paged data)
// =============================================================================
// PATTERN IDEA: an iterator hides traversal bookkeeping. The caller asks for the
// next element/batch; advancing, bounds, and "are we done?" live inside the
// iterator, not the client.
//
// WHAT'S WRONG HERE: the client manually tracks offset, adds limit each loop,
// and decides when to stop. The pagination mechanics leak into every caller.
//
// REAL SCENARIO: every place that consumes pages re-implements the same offset
// loop — and one forgets to advance offset (infinite loop) or mismanages the
// final partial page (off-by-one, dropped/duplicated rows). Switch to
// cursor-based pagination and all those hand-written loops break.
//
// WHY BAD: error-prone index bookkeeping is duplicated in clients; the data's
// paging strategy is exposed and hard to change.
//
// HOW TO FIX (no code): provide an iterator (or async iterable) that yields users
// one batch/item at a time and owns offset/limit/termination internally. Callers
// just `for ... of` it. Swapping offset paging for cursors changes only the
// iterator, not the consumers.
// =============================================================================
// ❌ NO ITERATOR — the caller manually tracks offsets/limits and knows the data
// is paged. Off-by-one and "forgot to advance" bugs are common.
export class UserRepo {
  private users = ["a", "b", "c", "d", "e"];
  page(offset: number, limit: number): string[] {
    return this.users.slice(offset, offset + limit); // caller manages indices
  }
}
const repo = new UserRepo();
// client manually loops pages -> 🐛 easy to mismanage offset / infinite loop
let offset = 0; const limit = 2; let batch: string[];
do { batch = repo.page(offset, limit); console.log(batch); offset += limit; } while (batch.length);

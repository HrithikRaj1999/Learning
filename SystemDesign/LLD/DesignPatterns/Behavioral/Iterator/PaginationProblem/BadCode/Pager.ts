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

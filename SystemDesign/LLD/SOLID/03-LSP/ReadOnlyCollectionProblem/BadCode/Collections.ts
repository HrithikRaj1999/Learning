// ❌ LSP — ImmutableList extends MutableList but no-ops/throws on mutators.
// Clients relying on add() changing the list get silent corruption.
export class MutableList<T> {
  protected items: T[] = [];
  add(item: T) { this.items.push(item); }
  get(i: number) { return this.items[i]; }
  size() { return this.items.length; }
}
export class ImmutableList<T> extends MutableList<T> {
  // 🐛 silent no-op (worse than throwing): callers think add worked
  add(_item: T) { /* do nothing */ }
}
function fillWithDefaults<T>(list: MutableList<T>, defaults: T[]) {
  for (const d of defaults) list.add(d); // silently does nothing for Immutable
  return list.size();
}
console.log(fillWithDefaults(new ImmutableList<number>(), [1, 2, 3])); // 0, surprise

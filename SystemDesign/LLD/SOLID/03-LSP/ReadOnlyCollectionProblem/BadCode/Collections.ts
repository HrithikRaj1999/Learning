// =============================================================================
// WHAT IS WRONG — Liskov Substitution Principle (LSP) violation
// =============================================================================
// LSP rule: a subtype must keep every promise the base made. MutableList.add()
// promises "the list grows." ImmutableList extends it but add() does NOTHING.
// It broke the promise, so it is not substitutable.
//
// REAL SCENARIO: fillWithDefaults() takes a MutableList and calls add() in a
// loop, trusting size() to grow. Hand it an ImmutableList and add() silently
// no-ops — size stays 0, no error, no warning. This is the WORST failure: not a
// loud crash but silent wrong behavior that ships to production and corrupts
// downstream logic that assumed the defaults were inserted.
//
// WHY BAD: a silent no-op override is even worse than throwing — the caller has
// no signal anything failed. The "is-a" is false: an immutable list is not a
// substitutable mutable list.
//
// HOW TO FIX (no code): invert the hierarchy. A ReadableList base (get, size)
// is the common type; a MutableList interface (add) extends it. Immutable lists
// implement only the readable side, so code needing mutation asks for a
// MutableList and an immutable one can't be passed. Don't model "immutable" as
// a subtype that disables a parent's mutators.
// =============================================================================
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

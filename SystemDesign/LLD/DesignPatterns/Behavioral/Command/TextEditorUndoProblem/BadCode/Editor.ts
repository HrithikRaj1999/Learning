// =============================================================================
// WHAT IS WRONG — missing Command pattern (undo)
// =============================================================================
// PATTERN IDEA: reify each edit as a Command with execute() AND undo(). Keep a
// history stack of executed commands; undo = pop and call undo().
//
// WHAT'S WRONG HERE: type() and delete() mutate content directly. Nothing
// records WHAT happened or how to reverse it, so undo is impossible.
//
// REAL SCENARIO: the classic editor requirement — Ctrl+Z. With direct mutation
// there's no record of the previous state or the operation, so you cannot step
// back. Bolting undo on later means rewriting every operation to capture history,
// touching all editing code at once.
//
// WHY BAD: state changes leave no reversible trace; undo/redo, macro recording,
// and audit are all impossible; retrofitting them is a large rewrite.
//
// HOW TO FIX (no code): model TypeCommand / DeleteCommand each with execute() and
// undo() (a DeleteCommand remembers the removed text). The editor runs commands
// and pushes them on a history stack; undo pops and reverses; redo re-executes.
// =============================================================================
// ❌ NO COMMAND — editor mutates state directly; there is no undo because actions
// aren't reified. Adding undo later means rewriting every operation.
export class Editor {
  content = "";
  type(text: string) { this.content += text; }         // no record of what happened
  delete(n: number) { this.content = this.content.slice(0, -n); }
}
const e = new Editor();
e.type("hello"); e.type(" world"); e.delete(6);
console.log(e.content); // "hello" — but no way to undo back to "hello world"

// =============================================================================
// WHAT IS WRONG — missing Memento pattern
// =============================================================================
// PATTERN IDEA: the object snapshots its full state into a memento and restores
// from it. The object owns what "state" means, so snapshots stay complete.
//
// WHAT'S WRONG HERE: undo copies content and cursor by hand from outside. The
// editor's fields are public so external code can grab and restore them.
//
// REAL SCENARIO: you add a `selection` field to TextEditor. The hand-written
// snapshot/restore doesn't know about it, so undo SILENTLY loses the selection —
// a bug nobody flags because nothing errors. Every new field is one more thing
// the external undo must remember to copy, and it won't.
//
// WHY BAD: snapshot logic lives outside the object and must be kept in sync with
// its fields by hand; new fields silently fall out of undo; encapsulation broken.
//
// HOW TO FIX (no code): TextEditor exposes save() returning a memento of ALL its
// state and restore(memento). Because the editor builds the snapshot, adding a
// field updates one place and undo stays correct. A history caretaker stacks the
// mementos.
// =============================================================================
// ❌ NO MEMENTO — undo done by reaching into the object's internals and manually
// snapshotting fields. Breaks encapsulation; new fields silently miss undo.

export class TextEditor {
  public content = "";   // exposed for the hacky undo below
  public cursor = 0;
}

const editor = new TextEditor();
editor.content = "Hello"; editor.cursor = 5;

// External undo logic pokes at internals and copies fields by hand:
const savedContent = editor.content;
const savedCursor = editor.cursor;
// ...later, add a `selection` field to TextEditor and THIS undo silently loses it.
editor.content = "Hello World"; editor.cursor = 11;
editor.content = savedContent; editor.cursor = savedCursor; // manual restore
console.log(editor.content); // "Hello"

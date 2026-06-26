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

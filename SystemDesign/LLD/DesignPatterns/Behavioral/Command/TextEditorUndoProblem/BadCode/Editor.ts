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

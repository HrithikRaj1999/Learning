// ❌ NO MEDIATOR — dialog widgets manipulate each other directly (list selection
// toggles a button, which clears a textbox...). Spaghetti of cross-references.
export class Button { enabled = false; }
export class ListBox {
  constructor(public okButton: Button) {}
  select(item: string) {
    this.okButton.enabled = item.length > 0; // list reaches into the button
  }
}
const ok = new Button();
const list = new ListBox(ok);
list.select("file.txt");
console.log(ok.enabled);

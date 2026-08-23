// =============================================================================
// WHAT IS WRONG — missing Mediator pattern
// =============================================================================
// PATTERN IDEA: dialog widgets notify a central mediator of events; the mediator
// coordinates the others. Widgets don't reach into each other.
//
// WHAT'S WRONG HERE: ListBox holds a Button and flips its enabled state on
// select(). The list widget directly manipulates the button.
//
// REAL SCENARIO: a real dialog's rules multiply — selecting a list item enables
// OK, typing in a textbox enables Apply, clicking OK validates everything. If
// every widget pokes the others, you get a dense mesh of cross-references that's
// impossible to follow or change, and widgets can't be reused outside this dialog.
//
// WHY BAD: widgets are coupled to specific siblings; coordination logic is
// scattered; the dialog becomes an unmaintainable web.
//
// HOW TO FIX (no code): a DialogMediator listens to widget events (selection,
// text change, click) and updates the others (enable OK, clear textbox). Each
// widget knows only the mediator; all dialog rules live centrally.
// =============================================================================
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

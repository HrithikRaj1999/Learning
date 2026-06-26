// ❌ NO MEDIATOR — form fields reference each other directly to enforce rules.
// Tangled web: each field knows about specific other fields.
export class Checkbox {
  constructor(public checked: boolean, public linkedInput?: TextInput) {}
  toggle() {
    this.checked = !this.checked;
    if (this.linkedInput) this.linkedInput.enabled = this.checked; // direct coupling
  }
}
export class TextInput {
  enabled = false;
  constructor(public value = "") {}
}
const input = new TextInput();
const agree = new Checkbox(false, input);
agree.toggle();
console.log(input.enabled); // fields wired to each other -> brittle as form grows

// =============================================================================
// WHAT IS WRONG — missing Mediator pattern
// =============================================================================
// PATTERN IDEA: form fields report changes to a mediator (the form/dialog), which
// owns the inter-field rules. Fields stay dumb and independent.
//
// WHAT'S WRONG HERE: Checkbox holds a direct reference to a specific TextInput and
// enables/disables it on toggle. The field knows about another field.
//
// REAL SCENARIO: the form grows — the checkbox should also reveal a second field,
// or a dropdown should affect the checkbox. Each field accumulates references to
// the others, and the cross-field logic is scattered across widgets. Reusing
// Checkbox elsewhere drags its linkedInput assumption along.
//
// WHY BAD: fields are coupled to each other; interaction rules are spread out and
// duplicated; widgets aren't reusable; the web of references gets brittle.
//
// HOW TO FIX (no code): a FormMediator subscribes to field events. When the
// checkbox toggles, it notifies the mediator, which decides to enable the input.
// Fields know only the mediator; all inter-field rules live in one place.
// =============================================================================
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

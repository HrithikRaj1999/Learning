// =============================================================================
// WHAT IS WRONG — missing Memento pattern
// =============================================================================
// PATTERN IDEA: capture a full checkpoint of state as a memento and restore it
// wholesale. No manual field-by-field copying.
//
// WHAT'S WRONG HERE: the wizard's "back" makes a checkpoint by hand-listing
// fields ({ step, name, email }) — and the demo literally FORGETS `plan`. Restore
// via Object.assign then behaves inconsistently.
//
// REAL SCENARIO: a multi-step signup. Going Back should restore exactly the prior
// step's data. Hand-copying fields means every new field (plan, address, coupon)
// must be added to the checkpoint too — miss one and Back loses or keeps stale
// data, a confusing, hard-to-trace UX bug.
//
// WHY BAD: checkpoints are built manually and drift from the real field set;
// forgetting a field silently corrupts the back/restore flow.
//
// HOW TO FIX (no code): Wizard produces a memento of its complete state and
// restores from it; a caretaker keeps a stack of per-step mementos. Back = pop +
// restore. New fields are captured automatically because the wizard owns the
// snapshot.
// =============================================================================
// ❌ NO MEMENTO — multi-step wizard "back" button manually copies each step's
// fields. Easy to miss a field; no clean checkpoint.
export class Wizard {
  step = 1;
  name = "";
  email = "";
  plan = "";
}
const w = new Wizard();
w.step = 2; w.name = "Ada"; w.email = "a@b.io";
// manual checkpoint before step 3:
const back = { step: w.step, name: w.name, email: w.email }; // forgot `plan`
w.step = 3; w.plan = "pro";
Object.assign(w, back); // restore -> but plan handling is inconsistent
console.log(w);

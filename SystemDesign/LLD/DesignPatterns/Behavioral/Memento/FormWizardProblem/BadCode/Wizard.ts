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

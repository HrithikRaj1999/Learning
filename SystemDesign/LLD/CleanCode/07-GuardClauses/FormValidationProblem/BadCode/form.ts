// ❌ DEEP NESTING — nested validation; success only reachable at the bottom.
export function submit(form: any): string {
  if (form.name) {
    if (form.email && form.email.includes("@")) {
      if (form.age && form.age >= 18) {
        if (form.terms === true) {
          return "submitted";
        } else { return "must accept terms"; }
      } else { return "must be 18+"; }
    } else { return "invalid email"; }
  } else { return "name required"; }
}

// ❌ NO OBSERVER — signup directly calls every side-effect service inline.
// Tight coupling; the signup flow knows about email, analytics, CRM, etc.
class Email { welcome(u: string) { return "welcome email to " + u; } }
class Analytics { track(e: string) { return "tracked " + e; } }
class Crm { addLead(u: string) { return "CRM lead " + u; } }

export function signup(user: string): string[] {
  // every new side effect on signup edits this function
  return [new Email().welcome(user), new Analytics().track("signup"), new Crm().addLead(user)];
}
console.log(signup("ada"));

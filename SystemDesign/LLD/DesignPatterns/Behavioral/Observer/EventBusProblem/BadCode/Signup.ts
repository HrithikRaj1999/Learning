// =============================================================================
// WHAT IS WRONG — missing Observer / event-bus pattern
// =============================================================================
// PATTERN IDEA: publishers emit an event; subscribers react. The publisher
// doesn't know who listens — it just announces "signup happened."
//
// WHAT'S WRONG HERE: signup() directly calls Email, Analytics, and Crm inline.
// The core signup flow knows about every side-effect service.
//
// REAL SCENARIO: product wants signup to also create a Slack notification, start
// a trial, and enqueue a referral check. Each new reaction edits signup(), which
// becomes a dumping ground coupling user-creation to a dozen unrelated systems.
// One slow/throwing service (CRM down) can also break the whole signup.
//
// WHY BAD: the publisher is coupled to all consumers; every new side effect edits
// core code; failures and concerns are entangled.
//
// HOW TO FIX (no code): emit a "UserSignedUp" event to an event bus. Email,
// Analytics, CRM each subscribe independently. signup() just publishes; adding a
// reaction = a new subscriber, no edit to signup. Subscribers can fail/retry in
// isolation.
// =============================================================================
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

// =============================================================================
// WHAT IS WRONG — missing Factory Method / factory pattern
// =============================================================================
// PATTERN IDEA: move object creation into a factory so callers request "a
// notifier of this type" without if/else-newing concretes everywhere.
//
// WHAT'S WRONG HERE: AlertManager.alert() if/else-news up EmailNotification or
// SmsNotification inline. The same creation branching reappears wherever a
// notification is needed.
//
// REAL SCENARIO: add Push or Slack notifications — you edit this branching and
// every other site that builds a notifier, and a forgotten site can't send the
// new type. Creation logic is smeared across the codebase.
//
// WHY BAD: creation is duplicated and tangled with business logic; new types edit
// many sites; OCP violated.
//
// HOW TO FIX (no code): a NotificationFactory (or registry mapping type ->
// notifier) creates the right notifier. AlertManager asks the factory and calls
// send(). New type = register it once; callers stay closed.
// =============================================================================
// ❌ NO FACTORY METHOD — caller if/else-news up each notification concrete.
// Creation logic spreads across the codebase; new type edits every site.
class EmailNotification { send(m: string) { return "email: " + m; } }
class SmsNotification { send(m: string) { return "sms: " + m; } }

export class AlertManager {
  alert(type: string, msg: string): string {
    let n: EmailNotification | SmsNotification;
    if (type === "email") n = new EmailNotification();   // new tangled with logic
    else if (type === "sms") n = new SmsNotification();
    else throw new Error("unknown");
    return n.send(msg);
  }
}
console.log(new AlertManager().alert("email", "down"));

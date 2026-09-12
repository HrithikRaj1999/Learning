// =============================================================================
// WHAT IS WRONG — missing Decorator pattern
// =============================================================================
// PATTERN IDEA: wrap a base notifier with decorators that each add a channel,
// sharing the notifier interface; stack them to send on any subset of channels.
//
// WHAT'S WRONG HERE: every channel combination is its own class (EmailSlackNotifier,
// EmailSlackSmsNotifier...). The send() logic for each channel is duplicated across
// these combo classes.
//
// REAL SCENARIO: users pick an arbitrary subset of channels in their preferences
// (email+sms, slack only, all three). That's 2^N possible subsets — you can't have
// a class for each. Adding a "Teams" channel multiplies the classes again, and the
// per-channel send logic drifts between copies.
//
// WHY BAD: combinatorial class explosion; channel logic duplicated; user-chosen
// subsets can't map to fixed classes.
//
// HOW TO FIX (no code): a Notifier interface (send()); a base notifier plus
// SlackDecorator/SmsDecorator/EmailDecorator that wrap a notifier and also send on
// their channel before delegating. Build the stack from the user's selected
// channels at runtime. New channel = one decorator.
// =============================================================================
// ❌ NO DECORATOR — every multi-channel combo is its own class. Real product
// need: "send via email + slack + sms" => one class per subset.
export class EmailNotifier { send(m: string) { return "email: " + m; } }
export class EmailSlackNotifier { send(m: string) { return "email: " + m + " | slack: " + m; } }
export class EmailSlackSmsNotifier { send(m: string) { return "email: " + m + " | slack: " + m + " | sms: " + m; } }
// user preferences = arbitrary subset of channels => 2^N classes
console.log(new EmailSlackNotifier().send("deployed"));

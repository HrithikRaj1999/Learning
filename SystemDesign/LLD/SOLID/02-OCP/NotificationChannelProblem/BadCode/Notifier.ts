// =============================================================================
// WHAT IS WRONG — Open/Closed Principle (OCP) violation
// =============================================================================
// OCP rule: extend by adding code, not by editing working code. send() is an
// if/else ladder over channel. Adding "slack" or "whatsapp" means editing this
// core method that email/sms/push already depend on.
//
// REAL SCENARIO: add Slack. You reopen send(), risk breaking the SMS branch,
// and re-test every channel because they share one method. The SMS branch also
// hides a real bug — no 160-char cap, so long messages get silently truncated
// by the carrier. Each channel's quirks (length caps, formatting) pile into one
// growing function nobody can safely touch.
//
// WHY BAD: one method owns N unrelated channels; every addition is a regression
// risk to the others; formatting + transport are tangled together.
//
// HOW TO FIX (no code): define a Channel interface (send(to, msg)); one class
// per channel (EmailChannel, SmsChannel with its length rule, etc.). Notifier
// just looks up the channel and delegates. New channel = new class, registered;
// existing channels untouched.
// =============================================================================
// ❌ OCP — send() if/else-ladders over channel. Adding Slack/WhatsApp edits the
// core notifier and the formatting logic tangled inside it.
export class Notifier {
  send(channel: string, to: string, msg: string): string {
    if (channel === "email") {
      return "EMAIL to " + to + ": " + msg;
    } else if (channel === "sms") {
      // 🐛 real bug: no length cap -> SMS > 160 chars silently truncated by carrier
      return "SMS to " + to + ": " + msg;
    } else if (channel === "push") {
      return "PUSH to " + to + ": " + msg;
    }
    throw new Error("unknown channel"); // grows forever
  }
}
console.log(new Notifier().send("sms", "+1555", "hi"));

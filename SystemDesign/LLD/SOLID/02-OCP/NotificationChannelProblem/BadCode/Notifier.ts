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

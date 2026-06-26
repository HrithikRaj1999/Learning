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

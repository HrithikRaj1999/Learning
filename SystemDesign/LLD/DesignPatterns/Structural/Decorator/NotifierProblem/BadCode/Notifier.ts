// ❌ NO DECORATOR — every multi-channel combo is its own class. Real product
// need: "send via email + slack + sms" => one class per subset.
export class EmailNotifier { send(m: string) { return "email: " + m; } }
export class EmailSlackNotifier { send(m: string) { return "email: " + m + " | slack: " + m; } }
export class EmailSlackSmsNotifier { send(m: string) { return "email: " + m + " | slack: " + m + " | sms: " + m; } }
// user preferences = arbitrary subset of channels => 2^N classes
console.log(new EmailSlackNotifier().send("deployed"));

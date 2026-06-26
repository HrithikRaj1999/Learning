// ❌ NO BRIDGE — message TYPE x delivery CHANNEL fused. {Text,Image} x {Email,Sms}
// = 4 classes and growing.
export class TextEmail { send() { return "email text"; } }
export class TextSms { send() { return "sms text"; } }
export class ImageEmail { send() { return "email image"; } }
export class ImageSms { send() { return "sms image"; } }
// add Slack channel => TextSlack + ImageSlack ... and a Video type doubles again
console.log(new ImageEmail().send());

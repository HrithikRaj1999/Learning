// =============================================================================
// WHAT IS WRONG — missing Bridge pattern
// =============================================================================
// PATTERN IDEA: Bridge separates two independent dimensions (an abstraction and an
// implementation) so they vary independently and combine by composition, not by a
// class per pair.
//
// WHAT'S WRONG HERE: message TYPE (Text/Image) is fused with delivery CHANNEL
// (Email/Sms) by inheritance — TextEmail, TextSms, ImageEmail, ImageSms. Two
// dimensions multiplied into one class each.
//
// REAL SCENARIO: add a Slack channel and you need TextSlack + ImageSlack; add a
// Video type and every channel doubles again. M types × N channels = M*N classes,
// growing multiplicatively. Shared channel logic is duplicated across the type
// classes.
//
// WHY BAD: combinatorial class explosion; each new option on one axis multiplies
// classes; logic duplicated across pairs.
//
// HOW TO FIX (no code): make Channel an interface (Email/Sms/Slack implementations)
// and Message an abstraction (Text/Image) that HOLDS a Channel and delegates
// delivery to it. Now types and channels grow independently: M + N classes, any
// combination by composition.
// =============================================================================
// ❌ NO BRIDGE — message TYPE x delivery CHANNEL fused. {Text,Image} x {Email,Sms}
// = 4 classes and growing.
export class TextEmail { send() { return "email text"; } }
export class TextSms { send() { return "sms text"; } }
export class ImageEmail { send() { return "email image"; } }
export class ImageSms { send() { return "sms image"; } }
// add Slack channel => TextSlack + ImageSlack ... and a Video type doubles again
console.log(new ImageEmail().send());

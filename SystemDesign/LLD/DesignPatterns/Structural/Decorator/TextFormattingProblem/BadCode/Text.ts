// =============================================================================
// WHAT IS WRONG — missing Decorator pattern
// =============================================================================
// PATTERN IDEA: wrap text with decorators that each add one formatting style,
// sharing a render interface; stack them for any combination.
//
// WHAT'S WRONG HERE: each formatting combination is a class (BoldText,
// BoldItalicText, BoldItalicUnderlineText...). The markup wrapping is duplicated
// across these combo classes.
//
// REAL SCENARIO: add "strikethrough" or "color" and the combinations explode
// (2^N classes). A user wanting italic+underline (without bold) needs a class that
// may not exist. The tag-wrapping logic drifts between the combo classes, and tag
// nesting order is hardcoded per class.
//
// WHY BAD: combinatorial subclass explosion; markup logic duplicated; styles can't
// be combined freely at runtime.
//
// HOW TO FIX (no code): a Text interface (render(s)); a base PlainText plus
// BoldDecorator/ItalicDecorator/UnderlineDecorator that wrap a Text and add their
// tags around the delegated render. Compose at runtime: Underline(Italic(Bold(
// Plain))). New style = one decorator; any mix works.
// =============================================================================
// ❌ NO DECORATOR — one subclass per formatting combination. 3 styles => up to
// 2^3 classes; price/markup logic duplicated.
export class PlainText { render(s: string) { return s; } }
export class BoldText { render(s: string) { return "<b>" + s + "</b>"; } }
export class BoldItalicText { render(s: string) { return "<b><i>" + s + "</i></b>"; } }
export class BoldItalicUnderlineText { render(s: string) { return "<u><b><i>" + s + "</i></b></u>"; } }
// add "strikethrough" => combinatorial explosion of new classes
console.log(new BoldItalicText().render("hi"));

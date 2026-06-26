// ❌ NO DECORATOR — one subclass per formatting combination. 3 styles => up to
// 2^3 classes; price/markup logic duplicated.
export class PlainText { render(s: string) { return s; } }
export class BoldText { render(s: string) { return "<b>" + s + "</b>"; } }
export class BoldItalicText { render(s: string) { return "<b><i>" + s + "</i></b>"; } }
export class BoldItalicUnderlineText { render(s: string) { return "<u><b><i>" + s + "</i></b></u>"; } }
// add "strikethrough" => combinatorial explosion of new classes
console.log(new BoldItalicText().render("hi"));

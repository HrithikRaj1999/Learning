# Decorator — Text Formatting Problem — Fix Hints
> Wrap text with styles at runtime instead of subclassing combinations.
## Wrong now
A class per style combo → 2^N explosion; markup logic duplicated.
## Hints
- [ ] `Text` interface: `render(): string`. `PlainText` is the base component.
- [ ] Abstract `TextDecorator implements Text`, holding an inner `Text`.
- [ ] `Bold`, `Italic`, `Underline` each wrap inner.render() with their tags.
- [ ] Compose: `new Bold(new Italic(new PlainText("hi")))`. Any combo, no new class.
## Done-when
- [ ] Adding Strikethrough = one decorator; all combos still possible.

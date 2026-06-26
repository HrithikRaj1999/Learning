# Factory Method — Document Parser Problem — Fix Hints
> Centralize parser creation behind one factory.
## Wrong now
`parseFile` switches on extension to `new` a parser; the same selection logic
gets copy-pasted wherever parsing happens.
## Hints
- [ ] `Parser` interface with `parse(content)`.
- [ ] A `ParserFactory` maps extension → parser (registry/`Map`), one place.
- [ ] Callers ask the factory for a `Parser`; they never `new` concretes.
- [ ] New format = register one entry. No switch edits.
## Done-when
- [ ] Extension→parser mapping exists in exactly one place.

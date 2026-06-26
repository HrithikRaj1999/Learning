# Visitor — File Export — Fix Hints
> One visitor per export format; elements stay closed.
## Wrong now
`toHtml` (and a future `toMarkdown`) each `instanceof`-branch over element types.
## Hints
- [ ] `ElementVisitor` interface: `visitParagraph`, `visitImage`, `visitTable`.
- [ ] Each element implements `accept(visitor)`.
- [ ] `HtmlExportVisitor`, `MarkdownExportVisitor` are new ops, no element edits.
## Done-when
- [ ] Adding an export format = one visitor class.

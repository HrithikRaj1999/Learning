// =============================================================================
// WHAT IS WRONG — missing Visitor pattern
// =============================================================================
// PATTERN IDEA: a Visitor packages one operation (one export format) across all
// element types; elements accept a visitor and dispatch.
//
// WHAT'S WRONG HERE: toHtml() is an instanceof ladder over Paragraph/Image/Table,
// and toMarkdown() duplicates the same ladder. Each export format re-branches
// over the element types.
//
// REAL SCENARIO: add a PDF or LaTeX exporter — another full ladder. Add a new
// element (CodeBlock) — you must edit EVERY format's ladder, and a forgotten one
// throws "unknown element" at runtime. The rendering rules per element are
// scattered across formats.
//
// WHY BAD: each format duplicates element dispatch; adding an element edits every
// format; missing a case fails at runtime.
//
// HOW TO FIX (no code): define a Visitor with visitParagraph/visitImage/visitTable;
// each element has accept(visitor). HtmlExportVisitor, MarkdownExportVisitor
// implement it. New format = a new visitor; the type system flags any element a
// visitor missed. (Choose Visitor when formats/operations change more than the
// element set.)
// =============================================================================
// ❌ NO VISITOR — exporting different document elements forces a type switch per
// export format; each new op re-branches.
export class Paragraph { constructor(public text: string) {} }
export class Image { constructor(public url: string) {} }
export class Table { constructor(public rows: number) {} }

export function toHtml(el: any): string {
  if (el instanceof Paragraph) return "<p>" + el.text + "</p>";
  if (el instanceof Image) return "<img src='" + el.url + "'>";
  if (el instanceof Table) return "<table rows='" + el.rows + "'>";
  throw new Error("unknown element"); // toMarkdown() duplicates the ladder
}
console.log(toHtml(new Image("a.png")));

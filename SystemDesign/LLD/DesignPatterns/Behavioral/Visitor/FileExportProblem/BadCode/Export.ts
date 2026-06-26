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

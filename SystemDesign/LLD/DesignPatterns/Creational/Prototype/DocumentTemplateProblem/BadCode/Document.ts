// ❌ NO PROTOTYPE — each new doc rebuilt from an expensive template load instead
// of cloning a prepared one.
export class Document {
  sections: string[];
  styles: Record<string, string>;
  constructor() {
    console.log("Loading corporate template + fonts from disk (slow)...");
    this.sections = ["header", "footer"];
    this.styles = { font: "Arial", size: "12" };
  }
}
// 100 invoices => 100 template loads
const docs: Document[] = [];
for (let i = 0; i < 3; i++) docs.push(new Document()); // expensive each time

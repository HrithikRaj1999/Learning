// =============================================================================
// WHAT IS WRONG — missing Prototype pattern
// =============================================================================
// PATTERN IDEA: when constructing an object is expensive, build ONE prepared
// prototype and CLONE it for each new instance, instead of re-running the costly
// setup every time.
//
// WHAT'S WRONG HERE: Document's constructor loads the corporate template + fonts
// from disk every time. Creating 100 documents re-loads the template 100 times.
//
// REAL SCENARIO: a service generating 100 invoices pays the slow disk/template
// load on every single one — a real performance problem under load. The expensive
// initialization (which is identical each time) is repeated needlessly.
//
// WHY BAD: costly identical setup runs per instance; throughput tanks as volume
// grows.
//
// HOW TO FIX (no code): load the template once into a prototype Document, then
// clone() it (deep copy) for each new doc. The expensive load happens once; each
// document is a cheap copy you can then customize. New doc types = new prototypes.
// =============================================================================
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

// ❌ NO TEMPLATE METHOD — PDF and Excel report builders duplicate fetch+validate+
// finalize; only the body build differs.
export class PdfReport {
  build(): string[] {
    return ["fetch data", "validate", "render PDF body", "add footer", "save"]; // step 3 varies
  }
}
export class ExcelReport {
  build(): string[] {
    return ["fetch data", "validate", "render Excel sheets", "add footer", "save"]; // step 3 varies
  }
}
console.log(new PdfReport().build());

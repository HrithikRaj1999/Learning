// =============================================================================
// WHAT IS WRONG — missing Template Method pattern
// =============================================================================
// PATTERN IDEA: the base class owns the fixed algorithm skeleton; subclasses
// override only the varying step.
//
// WHAT'S WRONG HERE: PdfReport and ExcelReport both repeat fetch -> validate ->
// (render body) -> add footer -> save, differing only in the render step. The
// build skeleton is duplicated.
//
// REAL SCENARIO: you add a "watermark" step or change how data is fetched/cached.
// You must edit every report type identically; a CsvReport added later copies the
// skeleton again. Forget one and that report skips the watermark — silent
// inconsistency.
//
// WHY BAD: the shared report-building flow is copy-pasted around the one varying
// step; changes touch N classes and drift.
//
// HOW TO FIX (no code): a Report base defines build() with the fixed steps
// (fetch/validate/footer/save), calling an abstract renderBody() hook. PdfReport/
// ExcelReport override only renderBody(). Skeleton changes once.
// =============================================================================
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

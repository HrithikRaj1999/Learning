// =============================================================================
// WHAT IS WRONG — Open/Closed Principle (OCP) violation
// =============================================================================
// OCP rule: extend by adding code, not editing tested code. Tax is a switch
// over region that grows forever; every new jurisdiction edits this class that
// checkout, invoicing, and reporting all depend on.
//
// REAL SCENARIO: launch in France. You reopen TaxCalculator, add a case, and
// risk every existing region's path. Worse, the `default: return 0` silently
// charges ZERO tax for any region not yet added — a compliance/legal bug that
// fails quietly. Tax rules also change often (rate changes, new rules); each
// change is a code edit + redeploy of a critical shared class.
//
// WHY BAD: high-churn compliance logic is hardcoded into one fragile switch;
// unknown regions fail silently with no tax instead of erroring.
//
// HOW TO FIX (no code): model each region as a TaxRule/strategy resolved from a
// registry or config/data table (rates change without code edits). Unknown
// region should throw or be rejected, never silently return 0. Adding a region
// = add a rule/row; the calculator stays closed.
// =============================================================================
// ❌ OCP — production-style: tax computed via a growing switch over region.
// Compliance changes force edits to a class many features depend on.
export class TaxCalculator {
  calculate(region: string, amount: number): number {
    switch (region) {
      case "US-CA": return amount * 0.0725;
      case "US-NY": return amount * 0.08875;
      case "UK": return amount * 0.20;
      case "DE": return amount * 0.19;
      // 🐛 default returns 0 -> silently under-charges tax in new regions
      default: return 0;
    }
  }
}
console.log(new TaxCalculator().calculate("UK", 100));

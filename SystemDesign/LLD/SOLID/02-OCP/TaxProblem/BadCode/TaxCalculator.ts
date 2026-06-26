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

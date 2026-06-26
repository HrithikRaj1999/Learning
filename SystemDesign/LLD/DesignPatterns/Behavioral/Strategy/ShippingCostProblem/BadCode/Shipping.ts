// ❌ NO STRATEGY — shipping cost computed by a switch on carrier; rate formulas
// duplicated and tangled.
export class ShippingCalculator {
  cost(carrier: string, weightKg: number): number {
    switch (carrier) {
      case "fedex": return 5 + weightKg * 2;
      case "ups": return 4 + weightKg * 2.5;
      case "dhl": return 6 + weightKg * 1.8;
      default: return 999; // 🐛 silent bad default instead of failing
    }
  }
}
console.log(new ShippingCalculator().cost("ups", 3));

// ❌ OCP VIOLATION — "Open/Closed Principle"
// Software entities should be OPEN for extension, CLOSED for modification.
// Every new customer tier forces you to crack open and edit this class.

export type CustomerType = "regular" | "premium" | "vip";

export class DiscountCalculator {
  calculate(type: CustomerType, amount: number): number {
    // Adding "student" or "enterprise" => edit this switch => risk breaking
    // already-tested regular/premium/vip paths. Closed-for-modification: violated.
    switch (type) {
      case "regular":
        return amount;
      case "premium":
        return amount * 0.9;
      case "vip":
        return amount * 0.8;
      default:
        // bug: silently returns full price for unknown types
        return amount;
    }
  }
}

export class ShippingCalculator {
  // Same anti-pattern duplicated: another switch that must be edited in lockstep
  cost(type: CustomerType): number {
    switch (type) {
      case "regular": return 10;
      case "premium": return 5;
      case "vip": return 0;
      default: return 10;
    }
  }
}

const calc = new DiscountCalculator();
console.log(calc.calculate("vip", 100)); // 80

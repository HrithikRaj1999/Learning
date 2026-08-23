// =============================================================================
// WHAT IS WRONG — Open/Closed Principle (OCP) violation
// =============================================================================
// OCP rule: open for EXTENSION, closed for MODIFICATION. You should add new
// behavior by adding new code, not by editing tested existing code. Here every
// new customer tier ("student", "enterprise") forces you to crack open the
// switch in calculate() — and the parallel switch in cost() — and re-edit them.
//
// REAL SCENARIO: add "student". You touch DiscountCalculator AND
// ShippingCalculator. Both switches must stay in lockstep; forget one and
// students get a discount but full shipping. The `default` branch silently
// returns full price / base cost for unknown types, so a typo or new tier
// fails quietly instead of loudly — a real revenue bug.
//
// WHY BAD: editing working code to extend it risks regressions in the paths
// that already shipped; the logic is duplicated across two switches that drift.
//
// HOW TO FIX (no code): make tiers polymorphic. Define a DiscountPolicy
// interface (apply(amount)) with one implementation per tier; resolve the right
// policy from a map/registry. Adding "student" = add ONE new class, register
// it, touch nothing existing. Closed for modification, open for extension.
// =============================================================================
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

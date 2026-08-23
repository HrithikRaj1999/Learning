// =============================================================================
// WHAT IS WRONG — missing Strategy pattern
// =============================================================================
// PATTERN IDEA: each rate formula is its own strategy object behind a common
// interface; the context delegates to the chosen one.
//
// WHAT'S WRONG HERE: ShippingCalculator.cost() switches on carrier and inlines
// each carrier's rate formula. The default silently returns 999 instead of
// failing — a quiet bad-data bug.
//
// REAL SCENARIO: add a new carrier or a region-based surcharge. You edit this
// switch, risk the existing formulas, and the per-carrier math can't be reused or
// tested in isolation. The silent 999 default means an unknown carrier ships at a
// nonsense price instead of erroring loudly.
//
// WHY BAD: rate logic tangled in one switch; adding a carrier edits tested code;
// silent bad default hides errors; no reuse.
//
// HOW TO FIX (no code): define a ShippingStrategy interface (cost(weight)) with
// FedexStrategy, UpsStrategy, DhlStrategy. The calculator holds/looks up a
// strategy and delegates; unknown carrier throws. New carrier = a new strategy.
// =============================================================================
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

// =============================================================================
// WHAT IS WRONG — missing Strategy pattern
// =============================================================================
// PATTERN IDEA: each algorithm (payment method) is an object behind a common
// interface; the context holds one and delegates, swappable at runtime.
//
// WHAT'S WRONG HERE: PaymentProcessor.pay() switches on method and inlines each
// provider's logic. All payment methods live in one growing switch.
//
// REAL SCENARIO: add Apple Pay or bank transfer. You edit PaymentProcessor and
// risk the card/PayPal paths that already handle real money. Each method's real
// logic (tokens, fees, retries) can't be isolated, reused, or tested alone, and
// the default-throw is the only safety net.
//
// WHY BAD: high-risk payment logic is fused into one switch; every method edits
// shared code; no isolation or runtime selection.
//
// HOW TO FIX (no code): define a PaymentStrategy interface (pay(amount)) with
// CardStrategy, PayPalStrategy, CryptoStrategy. The processor receives a strategy
// (chosen from the user's selection) and delegates. New method = a new strategy;
// the processor stays closed.
// =============================================================================
// ❌ NO STRATEGY — algorithm selected by a switch baked into the context.
// Adding a payment method edits this class (OCP break); logic not reusable.

export class PaymentProcessor {
  pay(method: string, amount: number): string {
    switch (method) {
      case "card":
        return "Card charged " + amount; // card-specific logic inline
      case "paypal":
        return "PayPal charged " + amount;
      case "crypto":
        return "Crypto charged " + amount;
      default:
        throw new Error("unknown method"); // grows forever
    }
  }
}
console.log(new PaymentProcessor().pay("paypal", 50));

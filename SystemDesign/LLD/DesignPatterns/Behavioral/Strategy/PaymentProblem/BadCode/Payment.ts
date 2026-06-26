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

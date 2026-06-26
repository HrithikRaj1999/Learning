// ❌ NO ADAPTER — our code is welded to a 3rd-party API with an incompatible
// shape. Reshaping calls inline everywhere; swapping vendors means editing all
// call sites.

// Third-party lib we cannot change:
class StripeApi {
  makeCharge(cents: number, currency: string, token: string) {
    return `Stripe charged ${cents} ${currency} via ${token}`;
  }
}

// Our checkout calls Stripe's odd signature directly, scattered across the app:
export class Checkout {
  pay(amountDollars: number) {
    const stripe = new StripeApi();
    const cents = Math.round(amountDollars * 100); // conversion duplicated everywhere
    return stripe.makeCharge(cents, "usd", "tok_visa");
  }
}
// Switching to PayPal (different method names/args) => rewrite every call site.
console.log(new Checkout().pay(20));

// =============================================================================
// WHAT IS WRONG — missing Adapter pattern
// =============================================================================
// PATTERN IDEA: an Adapter wraps a vendor's incompatible API behind your own
// stable interface, isolating vendor-specific shaping in one spot.
//
// WHAT'S WRONG HERE: Checkout calls StripeApi.makeCharge(cents, currency, token)
// directly and converts dollars->cents inline. That conversion and Stripe's
// signature are scattered wherever you charge.
//
// REAL SCENARIO: switch to PayPal (different method names/arg order). You rewrite
// every call site, and the dollars->cents conversion (duplicated everywhere) is a
// money bug waiting to happen if one site rounds differently or forgets.
//
// WHY BAD: business code is welded to one vendor; swapping providers edits all call
// sites; conversion logic is duplicated and risky.
//
// HOW TO FIX (no code): define a PaymentGateway interface (charge(amountDollars)).
// A StripeAdapter implements it, doing the cents conversion and calling makeCharge
// once. Checkout depends on PaymentGateway; switching to PayPal = a PayPalAdapter,
// no call-site changes.
// =============================================================================
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

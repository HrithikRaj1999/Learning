# Adapter — Fix Hints
> Intent: wrap an incompatible interface so our code talks to one stable contract.
## Wrong now
`Checkout` knows Stripe's exact signature + does cents conversion inline. Vendor
swap = edit every call site.
## Hints
- [ ] Define OUR interface: `PaymentGateway { pay(amountDollars): string }`.
- [ ] Write `StripeAdapter implements PaymentGateway` that wraps `StripeApi`,
      doing the dollars→cents + arg reshaping in ONE place.
- [ ] `Checkout` depends on `PaymentGateway`, never on `StripeApi`.
- [ ] New vendor = new adapter (`PaypalAdapter`); call sites untouched.
## Note
- Adapter = make existing incompatible things work together (after the fact).
  Don't confuse with Facade (simplify a subsystem) or Bridge (designed-in split).

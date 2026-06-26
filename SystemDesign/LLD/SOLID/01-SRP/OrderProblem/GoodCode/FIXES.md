# SRP — Order Problem — Fix Hints
> One class, one reason to change. This `Order` has six.
## Wrong now
`Order` mixes: cart math, tax rules, DB persistence, payment, email, audit log.
Change Stripe → you edit the same file as tax math.
## Hints
- [ ] `Order` = data only (items, email, country). No I/O, no tax.
- [ ] `OrderCalculator` owns subtotal. `TaxPolicy` (per country) owns tax —
      injected, so a new country is a new policy, not an edit (foreshadows OCP).
- [ ] `OrderRepository` owns persistence behind an interface (foreshadows DIP).
- [ ] `PaymentService` owns charging; `OrderNotifier` owns email; `AuditLog` owns logging.
- [ ] An `OrderService` (use-case) wires them: calc → charge → save → notify → audit.
## Done-when
- [ ] Tax math is unit-testable with no DB/SMTP/Stripe.
- [ ] Swapping email provider touches zero tax/payment code.

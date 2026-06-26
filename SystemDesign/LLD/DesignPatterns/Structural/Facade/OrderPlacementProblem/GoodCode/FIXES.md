# Facade — Order Placement Problem — Fix Hints
> One entry point hides the multi-subsystem checkout dance.
## Wrong now
Callers wire inventory→payment→shipping→notify by hand. Order duplicated;
rollback-on-failure easy to forget.
## Hints
- [ ] `CheckoutFacade` holds the four subsystems.
- [ ] Expose `placeOrder(sku, amount, email)` that runs the steps in order and
      handles failures/rollback internally (e.g. release reservation if payment fails).
- [ ] Clients call only the facade.
- [ ] Subsystems remain independently usable.
## Done-when
- [ ] Checkout sequence + error handling live in one place.

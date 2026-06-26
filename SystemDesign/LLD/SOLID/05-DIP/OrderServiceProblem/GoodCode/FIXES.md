# DIP — Order Service Problem — Fix Hints
> Policy depends on abstractions; details implement them.
## Wrong now
`OrderService` `new`s Stripe + Postgres + a logger. Welded to all three; not
testable without real infra; can't switch to PayPal.
## Hints
- [ ] Define abstractions owned by the service: `PaymentGateway { charge }`,
      `OrderRepository { save }`, `Logger { log }`.
- [ ] Concretes (`StripeGateway`, `PostgresOrderRepo`) implement them.
- [ ] Inject all three via the constructor; never `new` a concrete inside.
- [ ] Wire concretes at the composition root; inject fakes in tests.
## Done-when
- [ ] Swapping Stripe→PayPal = a wiring change, zero service edits.
- [ ] Unit test runs with no DB/network.

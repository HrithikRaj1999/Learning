// =============================================================================
// WHAT IS WRONG — Dependency Inversion Principle (DIP) violation
// =============================================================================
// DIP rule: high-level policy depends on abstractions, not concretes.
// OrderService (the policy "place an order") news up StripeGateway,
// PostgresOrderRepo, and ConsoleLogger directly — bolted to three specific
// vendors/details.
//
// REAL SCENARIO: switch Stripe -> Adyen, or test placeOrder() in CI without a
// real Postgres. Both force editing OrderService, even though "charge, save,
// log" is unchanged. You can't write a unit test that asserts "card was charged"
// because the gateway is hard-constructed inside — no seam to inject a fake.
//
// WHY BAD: business policy is coupled to payment vendor + DB + logger; any of
// them changing edits this class; nothing is mockable.
//
// HOW TO FIX (no code): define PaymentGateway, OrderRepository, Logger
// interfaces. OrderService takes them through its constructor. The concrete
// Stripe/Postgres/Console choices are made once at app startup. Tests pass
// in-memory fakes; swapping a vendor is a wiring change, not a code edit.
// =============================================================================
// ❌ DIP — high-level OrderService news up concrete Stripe + Postgres + console
// logger. Can't swap payment provider, can't test without a real DB.
class StripeGateway { charge(amt: number) { console.log("Stripe " + amt); } }
class PostgresOrderRepo { save(o: object) { console.log("pg INSERT " + JSON.stringify(o)); } }
class ConsoleLogger { log(m: string) { console.log("[log] " + m); } }

export class OrderService {
  private gateway = new StripeGateway();    // ❌ concrete
  private repo = new PostgresOrderRepo();   // ❌ concrete
  private logger = new ConsoleLogger();     // ❌ concrete
  placeOrder(amount: number): void {
    this.gateway.charge(amount);
    this.repo.save({ amount });
    this.logger.log("order placed");
  }
}
new OrderService().placeOrder(99);

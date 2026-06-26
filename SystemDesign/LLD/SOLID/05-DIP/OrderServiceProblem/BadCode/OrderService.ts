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

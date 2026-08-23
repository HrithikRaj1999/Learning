// =============================================================================
// WHAT IS WRONG — Single Responsibility Principle (SRP) violation (god object)
// =============================================================================
// SRP rule: ONE reason to change. Order has SIX: cart math, tax rules,
// persistence, payment, email, audit logging. A "god object" that owns the
// whole checkout flow.
//
// REAL SCENARIO: finance changes a tax rate -> edit Order. Payments switch from
// Stripe to Adyen -> edit Order. Email provider changes -> edit Order. Every
// team touches the SAME file, so deploys collide, code review is impossible
// (reviewer must understand tax + payments + email at once), and a payment bug
// can be introduced while "just" changing an email template.
//
// WHY BAD: zero isolation. Untestable (charging a card to test total()),
// unreusable, and a magnet for merge conflicts and accidental breakage.
//
// HOW TO FIX (no code): one collaborator per responsibility —
//   - Order = items + customer data.
//   - PriceCalculator / TaxService = totals and tax (tax as a strategy, not
//     baked-in if/else — see OCP).
//   - OrderRepository = persistence.
//   - PaymentGateway = charging.
//   - ConfirmationMailer = email.
//   - AuditLogger = logging.
// An OrderService orchestrates them; each part changes for one reason.
// =============================================================================
// ❌ SRP — Order is a god object: cart math + tax rules + persistence + payment
// + email + audit logging. SIX reasons to change in one class.
export class Order {
  constructor(public items: { name: string; price: number; qty: number }[],
              public customerEmail: string, public country: string) {}

  total(): number {
    let sum = 0;
    for (const i of this.items) sum += i.price * i.qty;
    // tax rules baked in -> changes when finance changes rates
    if (this.country === "US") sum *= 1.07;
    else if (this.country === "DE") sum *= 1.19;
    return sum;
  }
  saveToDb(): void {
    console.log("INSERT INTO orders ... " + JSON.stringify(this.items)); // persistence
  }
  charge(cardToken: string): void {
    console.log("Stripe charge " + this.total() + " with " + cardToken); // payment
  }
  sendConfirmation(): void {
    console.log("SMTP -> " + this.customerEmail + " total " + this.total()); // email
  }
  audit(action: string): void {
    console.log(new Date().toISOString() + " " + action); // logging
  }
}
const o = new Order([{ name: "book", price: 10, qty: 2 }], "a@b.io", "US");
o.saveToDb(); o.charge("tok"); o.sendConfirmation(); o.audit("placed");

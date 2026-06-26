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

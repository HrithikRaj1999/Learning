// ❌ SRP — Invoice computes money, formats PDF/HTML, AND talks to the printer +
// filesystem. A formatting change risks breaking the money math.
export class Invoice {
  constructor(public lineItems: { desc: string; amount: number }[]) {}

  subtotal(): number {
    // 🐛 real bug: floating point money math, no rounding -> 0.1+0.2 drift
    return this.lineItems.reduce((s, l) => s + l.amount, 0);
  }
  toHtml(): string {
    return "<table>" + this.lineItems.map(l => `<tr><td>${l.desc}</td><td>$${l.amount}</td></tr>`).join("") + "</table>";
  }
  toPlainText(): string {
    return this.lineItems.map(l => l.desc + " $" + l.amount).join("\n");
  }
  saveToDisk(path: string): void {
    console.log("fs.writeFileSync(" + path + ", ...)"); // I/O glued in
  }
  print(): void {
    console.log("sending to /dev/printer"); // hardware glued in
  }
}
console.log(new Invoice([{ desc: "x", amount: 0.1 }, { desc: "y", amount: 0.2 }]).subtotal());

// =============================================================================
// WHAT IS WRONG — Single Responsibility Principle (SRP) violation
// =============================================================================
// SRP rule: ONE reason to change. Invoice mixes THREE: money calculation,
// presentation (HTML/text), and I/O (disk + printer hardware).
//
// REAL SCENARIO: someone tweaks toHtml() styling and, working in the same
// class, accidentally touches subtotal(). subtotal() already has a real money
// bug — it sums floats with no rounding, so 0.1 + 0.2 = 0.30000000000000004.
// Money math should be isolated and guarded; instead it sits next to cosmetic
// formatting and hardware calls, so it gets edited casually and breaks.
//
// WHY BAD: cannot unit-test the math without a printer/filesystem; a printer
// driver change forces a rebuild of the billing class; formatting changes risk
// the numbers customers are charged.
//
// HOW TO FIX (no code): split —
//   - Invoice / a MoneyCalculator = totals only (use integer cents or a decimal
//     library to kill float drift).
//   - InvoiceFormatter = toHtml / toPlainText.
//   - An output port (FileWriter, Printer) = I/O, behind an interface.
// =============================================================================
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

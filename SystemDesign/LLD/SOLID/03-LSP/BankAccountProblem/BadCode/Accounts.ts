// ❌ LSP — FixedDeposit IS-A Account but breaks withdraw(). Code written against
// Account crashes when handed a FixedDeposit. Subtype removed a guarantee.
export class Account {
  constructor(protected balance: number) {}
  deposit(amount: number) { this.balance += amount; }
  withdraw(amount: number): number {
    if (amount > this.balance) throw new Error("insufficient funds");
    this.balance -= amount;
    return amount;
  }
  getBalance() { return this.balance; }
}
export class FixedDeposit extends Account {
  // Strengthened precondition: callers of Account.withdraw() don't expect this
  withdraw(_amount: number): number {
    throw new Error("Cannot withdraw from a fixed deposit before maturity!");
  }
}
// Generic teller works for Account... explodes on FixedDeposit
function payOut(acc: Account, amt: number) { return acc.withdraw(amt); }
payOut(new FixedDeposit(1000), 100); // 💥

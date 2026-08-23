// =============================================================================
// WHAT IS WRONG HERE — Liskov Substitution Principle (LSP) violation
// =============================================================================
//
// LSP rule (plain words):
//   Anywhere code expects a base type (Account), you must be able to hand it
//   ANY subtype (FixedDeposit) and nothing should break. The subtype must
//   honour every promise the base type made. A subtype is allowed to do MORE,
//   never LESS.
//
// THE PROBLEM IN THIS FILE:
//   Account.withdraw() makes a promise: "give me a valid amount, I take it out
//   and return it." Callers everywhere trust that promise.
//   FixedDeposit "is-a" Account by inheritance, but its withdraw() BREAKS the
//   promise — it always throws, no matter what. So FixedDeposit is NOT really
//   substitutable for Account. Inheritance lied.
//
// REAL-WORLD SCENARIO (why this bites you):
//   payOut() is a generic teller. It is written against Account and has no idea
//   FixedDeposit exists. The day someone passes a FixedDeposit (a customer list
//   mixing account types, a batch payout, an ATM service loop) the whole flow
//   crashes at runtime with "Cannot withdraw...". The bug is NOT in payOut() —
//   payOut() is correct. The bug is that FixedDeposit pretended to be an Account
//   it cannot fulfil. Every caller now needs ugly `if (acc instanceof
//   FixedDeposit)` checks scattered around — that is the smell LSP warns about.
//
// WHY IT IS "STRENGTHENED PRECONDITION" / "WEAKENED POSTCONDITION":
//   - Base withdraw works when amount <= balance.
//   - Subtype withdraw works NEVER (precondition tightened to impossible).
//   - Subtype also fails to return the amount (postcondition weakened/dropped).
//   Both moves shrink what the subtype guarantees → LSP broken.
//
// HOW TO FIX (no code, design choices):
//   1. Fix the model: "can withdraw" is NOT universal to all accounts, so it
//      should NOT live on the common Account base. Split the hierarchy:
//        - A base type with only what ALL accounts truly share (deposit,
//          getBalance).
//        - A separate Withdrawable capability/interface that only accounts that
//          CAN withdraw implement. payOut() then accepts Withdrawable, so a
//          FixedDeposit is simply not accepted at compile time — error becomes
//          impossible instead of exploding at runtime.
//   2. Or model the real rule: a fixed deposit CAN withdraw, just only after
//      maturity. Then withdraw() should respect the SAME contract (succeed when
//      allowed, throw the SAME documented error type when not) — same as the
//      base would for "insufficient funds". The subtype must not invent a brand
//      new failure mode callers were never told about.
//   3. Prefer composition over forcing an is-a relationship that is not true.
//
// RULE OF THUMB: if you must override a method only to throw/disable it, the
// inheritance is wrong. The capability does not belong on that base.
// =============================================================================
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
  // ❌ LSP BREAK: overriding only to disable. Base said "withdraw works";
  // this says "withdraw never works" → not substitutable. The very need to
  // throw here is the signal FixedDeposit should not inherit withdraw at all.
  withdraw(_amount: number): number {
    throw new Error("Cannot withdraw from a fixed deposit before maturity!");
  }
}
// ❌ payOut is CORRECT code. It trusts the Account contract. It has no defense
// against a subtype that secretly removed withdraw — and it should not need one.
// Passing FixedDeposit here is the runtime explosion LSP exists to prevent.
function payOut(acc: Account, amt: number) { return acc.withdraw(amt); }
payOut(new FixedDeposit(1000), 100); // 💥 throws — caller did nothing wrong

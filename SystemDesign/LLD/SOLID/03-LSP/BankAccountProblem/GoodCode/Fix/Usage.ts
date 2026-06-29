import { Account } from "./Account.ts";
import { FixedDeposit } from "./Accounts/FixedDeposit.ts";
import { Savings } from "./Accounts/Savings.ts";
import { Current } from "./Accounts/Current.ts";
import { Widthdrawable } from "./Interface/Withdrawable.ts";

// ---------------------------------------------------------------------------
// BAD (BadCode/Accounts.ts):  withdraw() lived on Account.
//   payOut(new FixedDeposit(1000), 100)  -> 💥 runtime throw. LSP violated:
//   a FixedDeposit IS-A Account but breaks Account's withdraw() promise.
//
// GOOD (here): base Account = deposit + balance only. withdraw() moved to the
//   Widthdrawable interface. Now the compiler stops misuse — no runtime crash.
// ---------------------------------------------------------------------------

// High-level teller depends on the ABSTRACTION, not concrete account types (DIP).
function payOut(acc: Widthdrawable, amount: number): number {
    return acc.withdraw(amount);
}
// Works for ANY Account — base contract every subtype honors (LSP).
function topUp(acc: Account, amount: number): void {
    acc.deposit(amount);
    acc.getBalance();
}

console.log("=== Savings (Account + Withdrawable) ===");
const savings = new Savings(1000);
topUp(savings, 1000);
payOut(savings, 200);          // ✅ Savings is Widthdrawable

console.log("\n=== Current (Account + Withdrawable, has charge) ===");
const current = new Current();
topUp(current, 1000);
payOut(current, 200);          // ✅ Current is Widthdrawable

console.log("\n=== FixedDeposit (Account only, NOT Withdrawable) ===");
const fd = new FixedDeposit(2000);
topUp(fd, 1000);               // ✅ deposit works — it IS an Account
// payOut(fd, 200);            // ❌ compile error: FixedDeposit is not Widthdrawable
                               //    (BadCode crashed here at RUNTIME; now it can't even build)
fd.getBalance();
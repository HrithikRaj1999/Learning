import { Transaction } from "./Transaction";

export class CashWithdrawalTransaction extends Transaction {
  private requestedAmount = 0;
  private dispensedAmount = 0;

  setRequestedAmount(amount: number): void {
    this.requestedAmount = amount;
  }

  getRequestedAmount(): number {
    return this.requestedAmount;
  }

  markDispensed(amount: number): void {
    this.dispensedAmount = amount;
  }

  getDispensedAmount(): number {
    return this.dispensedAmount;
  }
}

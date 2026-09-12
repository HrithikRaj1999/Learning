import { ATM } from "../ATM";
import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";
import { CashDispensedState } from "./CashDispensedState";
import { State } from "./State";

export class AmountCapturedState implements State {
  constructor(private readonly atm: ATM) {}

  initTransaction(_atmId: number): number {
    throw new Error("Transaction already started.");
  }

  readCardDetailsAndPin(_card: Card): boolean {
    throw new Error("Card is already validated.");
  }

  readCashWithdrawDetails(_transactionId: number, _amount: number): boolean {
    throw new Error("Withdrawal details already captured.");
  }

  dispenseCash(transactionId: number): number {
    const currentTransaction = this.atm.getCurrentTransaction();

    if (!currentTransaction || currentTransaction.getId() !== transactionId) {
      throw new Error("Transaction id mismatch.");
    }

    const amount = currentTransaction.getRequestedAmount();
    this.atm.deductCash(amount);
    currentTransaction.markDispensed(amount);
    this.atm.setState(new CashDispensedState(this.atm));
    return amount;
  }

  ejectCard(): void {
    throw new Error("Dispense cash before ejecting card.");
  }

  cancelTransaction(_transactionId: number): boolean {
    this.atm.markCancelled();
    return true;
  }

  getState(): ATMState {
    return ATMState.AMOUNT_CAPTURED;
  }
}

import { ATM } from "../ATM";
import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";
import { AmountCapturedState } from "./AmountCapturedState";
import { State } from "./State";

export class CardVerifiedState implements State {
  constructor(private readonly atm: ATM) {}

  initTransaction(_atmId: number): number {
    throw new Error("Transaction already started.");
  }

  readCardDetailsAndPin(_card: Card): boolean {
    throw new Error("Card already validated for this transaction.");
  }

  readCashWithdrawDetails(transactionId: number, amount: number): boolean {
    const currentTransaction = this.atm.getCurrentTransaction();

    if (!currentTransaction || currentTransaction.getId() !== transactionId) {
      throw new Error("Transaction id mismatch.");
    }

    if (!this.atm.canDispenseAmount(amount)) {
      return false;
    }

    currentTransaction.setRequestedAmount(amount);
    this.atm.setState(new AmountCapturedState(this.atm));
    return true;
  }

  dispenseCash(_transactionId: number): number {
    throw new Error("Enter withdrawal details before dispensing cash.");
  }

  ejectCard(): void {
    throw new Error("Cannot eject card before amount selection.");
  }

  cancelTransaction(_transactionId: number): boolean {
    this.atm.markCancelled();
    return true;
  }

  getState(): ATMState {
    return ATMState.CARD_VERIFIED;
  }
}

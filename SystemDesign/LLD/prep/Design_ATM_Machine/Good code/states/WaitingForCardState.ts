import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";
import { CardVerifiedState } from "./CardVerifiedState";
import { State } from "./State";
import { ATM } from "../ATM";

export class WaitingForCardState implements State {
  constructor(private readonly atm: ATM) {}

  initTransaction(_atmId: number): number {
    throw new Error("Transaction already started.");
  }

  readCardDetailsAndPin(card: Card): boolean {
    const isValid = card.getCardNumber() > 1000 && card.getPin() >= 1000 && card.getPin() <= 9999;

    if (isValid) {
      this.atm.setCurrentCard(card);
      this.atm.setState(new CardVerifiedState(this.atm));
    }

    return isValid;
  }

  readCashWithdrawDetails(transactionId: number, amount: number): boolean {
    void transactionId;
    void amount;
    throw new Error("Cannot read withdrawal details before validating card.");
  }

  dispenseCash(transactionId: number): number {
    void transactionId;
    throw new Error("Cannot dispense cash before validating card.");
  }

  ejectCard(): void {
    throw new Error("Cannot eject card without reading card details and pin.");
  }

  cancelTransaction(transactionId: number): boolean {
    void transactionId;
    this.atm.markCancelled();
    return true;
  }

  getState(): ATMState {
    return ATMState.WAITING_FOR_CARD;
  }
}

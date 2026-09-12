import { ATM } from "../ATM";
import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";
import { State } from "./State";

export class EjectingCardState implements State {
  constructor(private readonly atm: ATM) {}

  initTransaction(_atmId: number): number {
    throw new Error("Card ejection in progress.");
  }

  readCardDetailsAndPin(_card: Card): boolean {
    throw new Error("Card ejection in progress.");
  }

  readCashWithdrawDetails(_transactionId: number, _amount: number): boolean {
    throw new Error("Card ejection in progress.");
  }

  dispenseCash(_transactionId: number): number {
    throw new Error("Card ejection in progress.");
  }

  ejectCard(): void {
    this.atm.finishTransactionAndReset();
  }

  cancelTransaction(_transactionId: number): boolean {
    return false;
  }

  getState(): ATMState {
    return ATMState.EJECTING_CARD;
  }
}

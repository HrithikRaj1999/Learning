import { ATM } from "../ATM";
import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";
import { EjectingCardState } from "./EjectingCardState";
import { State } from "./State";

export class CashDispensedState implements State {
  constructor(private readonly atm: ATM) {}

  initTransaction(_atmId: number): number {
    throw new Error("Finish current transaction before starting new one.");
  }

  readCardDetailsAndPin(_card: Card): boolean {
    throw new Error("Cash already dispensed for this transaction.");
  }

  readCashWithdrawDetails(_transactionId: number, _amount: number): boolean {
    throw new Error("Cash already dispensed for this transaction.");
  }

  dispenseCash(_transactionId: number): number {
    throw new Error("Cash already dispensed.");
  }

  ejectCard(): void {
    this.atm.setState(new EjectingCardState(this.atm));
    this.atm.ejectCard();
  }

  cancelTransaction(_transactionId: number): boolean {
    return false;
  }

  getState(): ATMState {
    return ATMState.CASH_DISPENSED;
  }
}

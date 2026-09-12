import { ATM } from "../ATM";
import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";
import { WaitingForCardState } from "./WaitingForCardState";
import { State } from "./State";

export class CancelledState implements State {
  constructor(private readonly atm: ATM) {}

  initTransaction(atmId: number): number {
    if (atmId !== this.atm.getAtmId()) {
      throw new Error("Invalid ATM id.");
    }

    const transactionId = this.atm.createNewTransactionId();
    this.atm.startTransaction(transactionId);
    this.atm.setState(new WaitingForCardState(this.atm));
    return transactionId;
  }

  readCardDetailsAndPin(_card: Card): boolean {
    throw new Error("Current transaction is cancelled. Start a new one.");
  }

  readCashWithdrawDetails(_transactionId: number, _amount: number): boolean {
    throw new Error("Current transaction is cancelled. Start a new one.");
  }

  dispenseCash(_transactionId: number): number {
    throw new Error("Current transaction is cancelled. Start a new one.");
  }

  ejectCard(): void {
    this.atm.finishTransactionAndReset();
  }

  cancelTransaction(_transactionId: number): boolean {
    return true;
  }

  getState(): ATMState {
    return ATMState.CANCELLED;
  }
}

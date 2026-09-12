import { ATM } from "../ATM";
import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";
import { WaitingForCardState } from "./WaitingForCardState";
import { State } from "./State";

export class IdleState implements State {
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
    throw new Error("Start transaction before reading card details.");
  }

  readCashWithdrawDetails(_transactionId: number, _amount: number): boolean {
    throw new Error("Start transaction before entering withdrawal details.");
  }

  dispenseCash(_transactionId: number): number {
    throw new Error("Start transaction before dispensing cash.");
  }

  ejectCard(): void {
    throw new Error("No active transaction to eject card.");
  }

  cancelTransaction(_transactionId: number): boolean {
    return false;
  }

  getState(): ATMState {
    return ATMState.IDLE;
  }
}

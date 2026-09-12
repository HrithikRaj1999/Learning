import { IATMBackendApi } from "./apis/ATMBackendApi";
import { ATMState } from "./enums/ATMState";
import { Card } from "./models/Card";
import { CashWithdrawalTransaction } from "./models/CashWithdrawalTransaction";
import { CancelledState } from "./states/CancelledState";
import { IdleState } from "./states/IdleState";
import { State } from "./states/State";

export class ATM {
  private state: State;
  private currentCard: Card | null = null;
  private currentTransaction: CashWithdrawalTransaction | null = null;
  private cashInMachine = 10000;

  constructor(
    private readonly atmId: number,
    private readonly atmBackendApi: IATMBackendApi
  ) {
    this.state = new IdleState(this);
  }

  initTransaction(atmId: number): number {
    return this.state.initTransaction(atmId);
  }

  readCardDetailsAndPin(card: Card): boolean {
    return this.state.readCardDetailsAndPin(card);
  }

  readCashWithdrawDetails(transactionId: number, amount: number): boolean {
    return this.state.readCashWithdrawDetails(transactionId, amount);
  }

  dispenseCash(transactionId: number): number {
    return this.state.dispenseCash(transactionId);
  }

  ejectCard(): void {
    this.state.ejectCard();
  }

  cancelTransaction(transactionId: number): boolean {
    return this.state.cancelTransaction(transactionId);
  }

  getState(): ATMState {
    return this.state.getState();
  }

  getAtmId(): number {
    return this.atmId;
  }

  setState(newState: State): void {
    this.state = newState;
  }

  createNewTransactionId(): number {
    return this.atmBackendApi.generateTransactionId(this.atmId);
  }

  startTransaction(transactionId: number): void {
    this.currentTransaction = new CashWithdrawalTransaction(transactionId, this.atmId);
  }

  getCurrentTransactionId(): number | null {
    return this.currentTransaction?.getId() ?? null;
  }

  getCurrentTransaction(): CashWithdrawalTransaction | null {
    return this.currentTransaction;
  }

  setCurrentCard(card: Card | null): void {
    this.currentCard = card;
  }

  getCurrentCard(): Card | null {
    return this.currentCard;
  }

  canDispenseAmount(amount: number): boolean {
    return amount > 0 && amount % 100 === 0 && amount <= this.cashInMachine;
  }

  deductCash(amount: number): void {
    this.cashInMachine -= amount;
  }

  markCancelled(): void {
    this.currentTransaction?.cancel();
    this.setState(new CancelledState(this));
  }

  finishTransactionAndReset(): void {
    this.currentTransaction?.complete();
    this.currentTransaction = null;
    this.currentCard = null;
    this.setState(new IdleState(this));
  }
}

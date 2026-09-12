import { ATMState } from "../enums/ATMState";
import { Card } from "../models/Card";

export interface State {
    initTransaction(atmId: number): number;
    readCardDetailsAndPin(card: Card): boolean;        // validate card
    readCashWithdrawDetails(transactionId: number, amount: number): boolean; // amount dispensable?
    dispenseCash(transactionId: number): number;       // dispense & return amount
    ejectCard(): void;                                 // reset state
    cancelTransaction(transactionId: number): boolean; // cancel at any valid point
    getState(): ATMState;
}
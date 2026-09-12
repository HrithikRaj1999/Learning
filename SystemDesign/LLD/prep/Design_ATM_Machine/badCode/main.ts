
class ATM {
  private cashInMachine: number = 10000;
  private transactionStarted: boolean = false;
  private cardInserted: boolean = false;
  private cardType: string = "";
  private cardNumber: number = 0;
  private pin: number = 0;
  private currentTransactionId: number = 0;

  // SRP violation: ATM handles transaction tracking, validation, dispensing, logging all in one
  private transactionLog: string[] = [];

  // Start transaction - no real state machine, just flipping a boolean
  public startTransaction(): number {
    // No check if a transaction is already running properly
    if (this.transactionStarted) {
      console.log("Transaction already started");
      return -1;
    }
    this.transactionStarted = true;
    this.currentTransactionId = Math.floor(Math.random() * 10000);
    console.log("Transaction started with ID: " + this.currentTransactionId);
    // Directly logging inside business logic - SRP violation
    this.transactionLog.push("Transaction started: " + this.currentTransactionId);
    return this.currentTransactionId;
  }

  // Cancel transaction - manually resetting all booleans, no state machine
  public cancelTransaction(transactionId: number): boolean {
    // No validation that transactionId matches current transaction
    this.transactionStarted = false;
    this.cardInserted = false;
    this.cardType = "";
    this.cardNumber = 0;
    this.pin = 0;
    console.log("Transaction with ID: " + transactionId + " cancelled.");
    this.transactionLog.push("Transaction cancelled: " + transactionId);
    return true;
  }

  // Read card details and validate - SRP violation: reading + validation in same method
  // DIP violation: hardcoded validation logic, no abstraction
  public readCard(cardType: string, cardNumber: number, pin: number): boolean {
    console.log("Validating card: " + cardType + ", Card Number: " + cardNumber);

    // No proper state check - should only run after startTransaction
    if (!this.transactionStarted) {
      console.log("Card is null.");
      return false;
    }

    // Hardcoded "validation" - magic numbers, no abstraction
    const isValid: boolean = this.validateCardDetails(cardType, cardNumber, pin);

    if (isValid) {
      this.cardInserted = true;
      this.cardType = cardType;
      this.cardNumber = cardNumber;
      this.pin = pin;
      console.log("Card is valid.");
    } else {
      console.log("Invalid card details.");
    }

    return isValid;
  }

  // Withdraw amount - SRP violation: withdrawal + dispensing + logging all mixed together
  // OCP violation: adding a new withdrawal type requires editing this method
  public withdrawAmount(transactionId: number, amount: number): boolean {
    console.log(
      "Processing withdrawal of amount: " +
        amount +
        " for transaction ID: " +
        transactionId
    );

    // No state check - should verify card is inserted first
    // No check that transactionId actually matches
    const canWithdraw = this.checkWithdrawLimit(transactionId, amount);

    if (canWithdraw) {
      console.log("Withdrawal approved.");
    } else {
      console.log("Withdrawal denied.");
    }

    return canWithdraw;
  }

  // Dispense cash - should be separate concern entirely
  public dispenseCash(amount: number): void {
    // No check if withdrawal was approved first
    // No state transition
    console.log("Dispensing cash: " + amount);
    this.deductCashFromATM(amount);
  }

  // Eject card - no state update, card flags not reset
  public ejectCard(): void {
    console.log("Ejecting card...");
    // Bug: cardInserted flag never reset to false
    // cardType, cardNumber, pin still in memory - security issue
  }

  // Close transaction - should finalize state machine, but just logs
  public closeTransaction(transactionId: number): void {
    // No proper state reset
    // transactionStarted never set to false
    console.log("Closing transaction: " + transactionId);
    this.transactionLog.push("Transaction closed: " + transactionId);
  }

  // --- Private "helper" methods doing too much ---

  // Hardcoded validation - DIP violation, OCP violation
  private validateCardDetails(
    cardType: string,
    cardNumber: number,
    pin: number
  ): boolean {
    // Magic number validation logic
    return cardNumber > 1000 && pin >= 1000 && pin <= 9999;
  }

  // Withdraw limit check mixed with business logic
  private checkWithdrawLimit(transactionId: number, amount: number): boolean {
    // Directly accessing machine state - no abstraction
    return amount <= this.cashInMachine && amount > 0 && amount % 100 === 0;
  }

  // Cash deduction tightly coupled inside the ATM class
  private deductCashFromATM(amount: number): void {
    this.cashInMachine -= amount;
  }
}

// Main - everything wired together manually, no DI, no interfaces
function main() {
  const atm = new ATM();

  const txnId = atm.startTransaction();

  const cardOk = atm.readCard("DEBIT", 123456789, 1234);

  if (cardOk) {
    const withdrawn = atm.withdrawAmount(txnId, 500);
    if (withdrawn) {
      atm.dispenseCash(500);
      atm.closeTransaction(txnId);
      atm.ejectCard();
    } else {
      atm.cancelTransaction(txnId);
    }
  } else {
    atm.cancelTransaction(txnId);
  }
}

main();

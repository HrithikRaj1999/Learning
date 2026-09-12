import { ATM } from "./ATM";
import { ATMBackendApi } from "./apis/ATMBackendApi";
import { Card } from "./models/Card";

// ============= USE CASE: Complete ATM Transaction Flow =============

function main() {
  console.log("========== ATM System with State Pattern ==========\n");

  // Step 1: Initialize dependencies (Dependency Injection)
  const atmBackendApi = new ATMBackendApi();

  // Step 2: Create ATM machine with ID and injected dependencies
  const atmId = 101; // ATM machine #101 at location
  const atm = new ATM(atmId, atmBackendApi);

  console.log(`[INFO] ATM Machine #${atmId} initialized`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  // ============= SCENARIO 1: Successful Transaction =============
  console.log(">>> SCENARIO 1: Successful Transaction\n");

  // User presses Start button
  console.log("User presses START button...");
  const transactionId = atm.initTransaction(atmId); // Pass atmId for backend correlation
  console.log(`[RESULT] Transaction ID: ${transactionId}`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  // User inserts card
  console.log("User inserts card...");
  const card = new Card(123456789, 1234, "John Doe", "DEBIT", "XYZ Bank");
  const cardValid = atm.readCardDetailsAndPin(card);
  console.log(`[RESULT] Card Valid: ${cardValid}`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  if (cardValid) {
    // User enters withdrawal amount
    console.log("User enters withdrawal amount...");
    const amountValid = atm.readCashWithdrawDetails(transactionId, 500);
    console.log(`[RESULT] Amount Valid: ${amountValid}`);
    console.log(`[STATE] Current State: ${atm.getState()}\n`);

    if (amountValid) {
      // Dispense cash
      console.log("Dispensing cash...");
      const dispensedAmount = atm.dispenseCash(transactionId);
      console.log(`[RESULT] Dispensed: $${dispensedAmount}`);
      console.log(`[STATE] Current State: ${atm.getState()}\n`);

      // Eject card
      console.log("Ejecting card...");
      atm.ejectCard();
      console.log(`[RESULT] Card ejected`);
      console.log(`[STATE] Current State: ${atm.getState()}\n`);
    }
  }

  // ============= SCENARIO 2: Invalid Card =============
  console.log("\n>>> SCENARIO 2: Invalid Card Attempt\n");

  const transactionId2 = atm.initTransaction(atmId);
  console.log(`[RESULT] Transaction ID: ${transactionId2}`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  console.log("User inserts invalid card...");
  const invalidCard = new Card(999, 0, "Hacker", "FAKE", "No Bank"); // Invalid PIN
  const cardValid2 = atm.readCardDetailsAndPin(invalidCard);
  console.log(`[RESULT] Card Valid: ${cardValid2}`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  // User cancels
  console.log("User cancels transaction...");
  const cancelled = atm.cancelTransaction(transactionId2);
  console.log(`[RESULT] Cancelled: ${cancelled}`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  // ============= SCENARIO 3: Invalid Operation at Wrong State =============
  console.log("\n>>> SCENARIO 3: Attempting Invalid Operation (Guard by State)\n");

  const transactionId3 = atm.initTransaction(atmId);
  console.log(`[RESULT] Transaction ID: ${transactionId3}`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  console.log("User tries to dispense cash WITHOUT inserting card...");
  try {
    atm.dispenseCash(transactionId3); // This should throw!
  } catch (error: any) {
    console.log(`[ERROR] ${error.message}`);
    console.log("[INFO] State pattern prevents invalid operation!\n");
  }

  atm.cancelTransaction(transactionId3);

  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  // ============= SCENARIO 4: Invalid Operation - Eject Before Pin =============
  console.log("\n>>> SCENARIO 4: Attempting to Eject Card Without PIN Entry\n");

  const transactionId4 = atm.initTransaction(atmId);
  console.log(`[RESULT] Transaction ID: ${transactionId4}`);
  console.log(`[STATE] Current State: ${atm.getState()}\n`);

  console.log("User tries to eject card before reading PIN...");
  try {
    atm.ejectCard(); // This should throw!
  } catch (error: any) {
    console.log(`[ERROR] ${error.message}`);
    console.log("[INFO] Only valid operation in this state: readCardDetailsAndPin()\n");
  }

  console.log(`[STATE] Current State: ${atm.getState()}\n`);
}

// ============= KEY BENEFITS DEMONSTRATED =============
/*
1. DEPENDENCY INJECTION (DIP):
   - ATMBackendApi injected as interface IATMBackendApi
   - Can swap to GraphQL implementation without changing ATM or states
   
2. STATE PATTERN (OCP):
   - No if/else chains in main code
   - Each state handles its own valid operations
   - Adding new state = new class, zero changes to existing code
   
3. GUARD CLAUSES:
   - Invalid operations throw errors immediately
   - State prevents invalid flow before it happens
   - Example: can't dispense before validating card

4. SINGLE RESPONSIBILITY:
   - ATM class: orchestration
   - State classes: behavior for specific state
   - BackendApi: transaction ID generation
   - Card model: data only

5. TESTABILITY:
   - Mock IATMBackendApi for unit tests
   - Each state class can be tested independently
   - No hidden dependencies
*/

main();

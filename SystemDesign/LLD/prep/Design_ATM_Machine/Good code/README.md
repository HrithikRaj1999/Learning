# ATM Machine - Good Code (Interview Friendly)

Minimal State Pattern implementation for a cash-withdrawal ATM flow.

## Folder Structure

- ATM.ts: ATM context, delegates behavior to current state.
- apis/: backend API abstraction for transaction id generation.
- enums/: ATM state enum.
- models/: Card and transaction models.
- states/: one class per state, each class allows only valid operations.
- main.ts: simple scenarios to run and understand flow.

## Happy Path

1. initTransaction
2. readCardDetailsAndPin
3. readCashWithdrawDetails
4. dispenseCash
5. ejectCard

## State Names

- IDLE
- WAITING_FOR_CARD
- CARD_VERIFIED
- AMOUNT_CAPTURED
- CASH_DISPENSED
- EJECTING_CARD
- CANCELLED

## Why this is good for 1-hour interview prep

- Small classes with single responsibility.
- No complex framework or infrastructure.
- Clear state transitions and guard clauses.
- Easy to extend with balance inquiry or mini statement.

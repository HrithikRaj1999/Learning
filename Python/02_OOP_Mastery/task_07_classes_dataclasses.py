"""
==============================================================================
  TASK 07: Classes & Dataclasses
==============================================================================

REAL-WORLD CONTEXT:
Every Python app models THINGS: Users, Orders, Products, Transactions.
Dataclasses remove boilerplate (__init__, __repr__, __eq__ for free).

SCENARIO: You're building a banking app. You need:
  1. Money class — represents currency amounts (never use floats for money!)
     Uses Decimal for precision. Supports addition, comparison.
  2. BankAccount — has owner, balance (Money), can deposit/withdraw.
     Must REJECT negative amounts and overdrafts.

WHAT'S WRONG (without this):
  - Using float for money → $0.1 + $0.2 = $0.30000000000000004 (real bug)
  - No validation → BankAccount(balance=-500) is possible
  - No immutability → Money can be mutated, causing accounting errors

YOUR FIX:
  - @dataclass for Money with Decimal, frozen=True (immutable)
  - BankAccount with __post_init__ validation
  - Methods that return NEW Money objects (functional style)

EXPECTED BEHAVIOR:
  m1 = Money(amount=Decimal("10.50"), currency="USD")
  m2 = Money(amount=Decimal("5.25"), currency="USD")
  m1 + m2 → Money(amount=Decimal("15.75"), currency="USD")
  BankAccount("Alice", Money(Decimal("-1"), "USD")) → raises ValueError
  account.withdraw(Money(Decimal("9999"), "USD")) → raises InsufficientFunds
"""

from dataclasses import dataclass, field
from decimal import Decimal

# BUILD: Money dataclass (frozen) and BankAccount with validation
# Then add pytest tests that verify invalid states are rejected.

if __name__ == "__main__":
    print("Build Money and BankAccount, then add pytest tests for invalid states.")

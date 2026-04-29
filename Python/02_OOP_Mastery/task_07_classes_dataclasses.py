"""
================================================================
   TASK 7: Classes, Dataclasses, and Invariants       ***
================================================================

Interview focus:
- Design a small domain model.
- Protect invalid state with invariants.
- Choose between a normal class and a dataclass.

Rules:
- Use type hints.
- Do not expose mutable internal state directly.
- Raise ValueError for invalid input.
"""

from dataclasses import dataclass, field
from decimal import Decimal


# ----- Challenge 7.1 -----
# Create a Money dataclass:
# - amount: Decimal
# - currency: str
# - amount must be >= 0
# - currency must be 3 uppercase letters
# - add(other) returns new Money only when currencies match


# YOUR CODE HERE


# ----- Challenge 7.2 -----
# Create a BankAccount class:
# - account_id
# - owner
# - balance as Money
# - deposit(amount)
# - withdraw(amount)
# - transaction_history property returns a copy, not the internal list


# YOUR CODE HERE


if __name__ == "__main__":
    print("Build Money and BankAccount, then add pytest tests for invalid states.")


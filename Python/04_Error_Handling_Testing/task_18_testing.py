"""
==============================================================================
  TASK 18: Unit Testing with pytest
==============================================================================

REAL-WORLD CONTEXT:
Tests are NOT optional in professional code. They:
  - Prevent regressions (change code → tests catch breakage immediately)
  - Document behavior (tests show HOW code should be used)
  - Enable refactoring (confident changes because tests verify correctness)

SCENARIO: You have a Calculator and ShoppingCart. Write tests that:
  1. Verify normal behavior (add, subtract, multiply, divide)
  2. Verify edge cases (divide by zero raises ValueError)
  3. Verify state management (add item, remove item, totals update)
  4. Use parametrize for testing multiple inputs efficiently

WHAT TO BUILD:
  - At least 5 tests for Calculator (including edge cases)
  - At least 4 tests for ShoppingCart (add, remove, total, item_count)
  - At least 1 parametrized test (multiple inputs, same test logic)
  - Test that divide(x, 0) raises ValueError with correct message
"""

import pytest


class Calculator:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b

    def multiply(self, a, b):
        return a * b

    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b


class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, name, price, quantity=1):
        self.items.append({"name": name, "price": price, "quantity": quantity})

    def remove_item(self, name):
        self.items = [i for i in self.items if i["name"] != name]

    def total(self):
        return sum(i["price"] * i["quantity"] for i in self.items)

    def item_count(self):
        return sum(i["quantity"] for i in self.items)


# YOUR FIX: Write test functions below (pytest discovers functions starting with test_)
# Example:
#   def test_calculator_add():
#       calc = Calculator()
#       assert calc.add(2, 3) == 5
#
#   @pytest.mark.parametrize("a,b,expected", [(1,2,3), (0,0,0), (-1,1,0)])
#   def test_calculator_add_parametrized(a, b, expected):
#       assert Calculator().add(a, b) == expected

if __name__ == "__main__":
    print("Run tests with: python -m pytest task_18_testing.py -v")
    print("Write your test functions above!")
    print("Minimum: 5 Calculator tests + 4 ShoppingCart tests + parametrize tests")

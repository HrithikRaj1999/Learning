"""
================================================================
   TASK 18: Unit Testing with pytest              ***      
================================================================

INSTRUCTIONS:
No code goes to production without tests. Learn pytest -- the industry standard.
Run with: python -m pytest task_18_testing.py -v

CONCEPTS: test functions, assertions, fixtures, parametrize
SETUP: pip install pytest
"""

import pytest


# ======= CODE TO TEST =======
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


# ======= YOUR TESTS BELOW =======

# ----- Challenge 18.1 -----
# Write at least 5 test functions for Calculator:
# - test_add, test_subtract, test_multiply, test_divide, test_divide_by_zero

# YOUR TESTS HERE


# ----- Challenge 18.2 -----
# Write a pytest fixture for ShoppingCart and at least 4 tests:
# - test_add_item, test_remove_item, test_total, test_empty_cart

# YOUR TESTS HERE


# ----- Challenge 18.3 -----
# Use @pytest.mark.parametrize to test Calculator.add with multiple inputs:
# (1,2,3), (0,0,0), (-1,1,0), (100,200,300)

# YOUR TESTS HERE


# =========== VALIDATION ===========
if __name__ == "__main__":
    print("Run tests with: python -m pytest task_18_testing.py -v")
    print("Write your test functions above!")
    print("Minimum: 5 Calculator tests + 4 ShoppingCart tests + parametrize tests")

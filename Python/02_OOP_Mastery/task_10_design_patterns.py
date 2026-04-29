"""
================================================================
   TASK 10: Design Patterns in Python                 ****
================================================================

Interview focus:
- Recognize common patterns without overengineering.
- Implement patterns using Pythonic tools.
"""


# ----- Challenge 10.1: Strategy -----
# Build a ShippingCalculator that accepts a pricing strategy.
# Strategies:
# - StandardShipping
# - ExpressShipping
# - FreeOverThresholdShipping


# YOUR CODE HERE


# ----- Challenge 10.2: Factory -----
# create_payment_processor(name) should return one of:
# - StripeProcessor
# - RazorpayProcessor
# - PaypalProcessor
#
# Unknown names should raise ValueError.


# YOUR CODE HERE


# ----- Challenge 10.3: Unit of Work -----
# Sketch a UnitOfWork context manager that commits on success
# and rolls back on exception.


# YOUR CODE HERE


if __name__ == "__main__":
    print("Implement each pattern and write one test per behavior.")


"""
================================================================
   TASK 20: Decorators Deep Dive                  ***      
================================================================

INSTRUCTIONS:
Decorators are EVERYWHERE -- @app.route (Flask), @login_required (Django),
@property, @staticmethod. Master them!

CONCEPTS: function decorators, decorator with arguments, wraps, stacking
"""

import time
from functools import wraps


# ----- Challenge 20.1 -----
# Create a @timer decorator that prints how long a function took to execute.
# Output format: "function_name took X.XXXXs"
def timer(func):
    pass  # YOUR CODE HERE


# ----- Challenge 20.2 -----
# Create a @retry(max_attempts=3) decorator with arguments.
# If the function raises an exception, retry up to max_attempts times.
# If all attempts fail, raise the last exception.
def retry(max_attempts=3):
    pass  # YOUR CODE HERE


# ----- Challenge 20.3 -----
# Create a @cache decorator (simple memoization).
# Store results in a dictionary. If same args are called again, return cached result.
def cache(func):
    pass  # YOUR CODE HERE


# ----- Challenge 20.4 -----
# Create a @validate_types(**type_hints) decorator that validates argument types.
# Example: @validate_types(name=str, age=int)
# If wrong type passed, raise TypeError with a clear message.
def validate_types(**type_hints):
    pass  # YOUR CODE HERE


# ----- Challenge 20.5 -----
# Create a @rate_limit(max_calls, period) decorator.
# Raises RuntimeError if function is called more than max_calls times within period seconds.
def rate_limit(max_calls, period):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 20.1
    @timer
    def slow_function():
        total = sum(range(1000000))
        return total
    result = slow_function()
    assert result == 499999500000
    print("[PASS] Test 20.1 Passed: timer decorator")

    # Test 20.2
    attempt_count = {"value": 0}
    @retry(max_attempts=3)
    def flaky():
        attempt_count["value"] += 1
        if attempt_count["value"] < 3:
            raise ValueError("Not yet")
        return "Done"
    assert flaky() == "Done"
    print("[PASS] Test 20.2 Passed: retry decorator")

    # Test 20.3
    call_count = {"value": 0}
    @cache
    def expensive(n):
        call_count["value"] += 1
        return n * n
    assert expensive(5) == 25
    assert expensive(5) == 25  # Should use cache
    assert call_count["value"] == 1  # Only called once!
    print("[PASS] Test 20.3 Passed: cache decorator")

    # Test 20.4
    @validate_types(name=str, age=int)
    def create_user(name, age):
        return {"name": name, "age": age}
    assert create_user("Alice", 25) == {"name": "Alice", "age": 25}
    try:
        create_user("Alice", "twenty")
        assert False, "Should raise TypeError"
    except TypeError:
        pass
    print("[PASS] Test 20.4 Passed: validate_types decorator")

    print("\n*** ALL TASK 20 TESTS PASSED! ***")

"""
==============================================================================
  TASK 20: Decorators
==============================================================================

REAL-WORLD CONTEXT:
Decorators add behavior to functions WITHOUT modifying them. Used everywhere:
  - @timer — measure how long functions take (performance monitoring)
  - @retry — automatically retry failed network calls
  - @cache — avoid recomputing expensive results (memoization)
  - @validate_types — enforce function argument types at runtime
  - @rate_limit — prevent abuse (API rate limiting)

These are the #1 asked Python interview topic after basic data structures.
"""

import time
from functools import wraps


# SCENARIO: Production API has slow endpoints. You need to LOG how long each
# function takes without adding timing code to every function manually.
# YOUR FIX: @timer decorator that measures and prints execution time.
# EXPECTED: @timer on slow_function() → prints "slow_function took 0.05s" + returns result
def timer(func):
    pass


# SCENARIO: Payment API is unreliable (30% failure rate). Instead of failing
# immediately, retry up to 3 times before giving up. Decorator with argument.
# YOUR FIX: @retry(max_attempts=3) → catches exceptions, retries, fails after max.
# EXPECTED: @retry(3) on flaky_fn() → tries up to 3 times → returns on success
def retry(max_attempts=3):
    pass


# SCENARIO: Machine learning feature engineering function takes 30 seconds.
# Same input = same output. Cache results so repeated calls are instant.
# YOUR FIX: @cache memoizes results based on arguments. Same args = cached result.
# EXPECTED: expensive(5) called twice → function body runs only ONCE
def cache(func):
    pass


# SCENARIO: A REST framework needs to validate that request handler arguments
# match expected types BEFORE executing the handler (like Pydantic but simpler).
# YOUR FIX: @validate_types(name=str, age=int) → raises TypeError if wrong type passed.
# EXPECTED: create_user("Alice", "twenty") → TypeError ("twenty" is not int)
def validate_types(**type_hints):
    pass


# SCENARIO: Public API allows max 5 calls per 60 seconds per user.
# If exceeded: reject call instead of hitting backend (protect infrastructure).
# YOUR FIX: @rate_limit(max_calls=5, period=60) → raises after exceeding limit.
# EXPECTED: Call 6th time within period → raises RateLimitError
def rate_limit(max_calls, period):
    pass

if __name__ == "__main__":
    @timer
    def slow_function():
        total = sum(range(1000000))
        return total
    result = slow_function()
    assert result == 499999500000
    print("[PASS] Test 20.1 Passed: timer decorator")

    attempt_count = {"value": 0}
    @retry(max_attempts=3)
    def flaky():
        attempt_count["value"] += 1
        if attempt_count["value"] < 3:
            raise ValueError("Not yet")
        return "Done"
    assert flaky() == "Done"
    print("[PASS] Test 20.2 Passed: retry decorator")

    call_count = {"value": 0}
    @cache
    def expensive(n):
        call_count["value"] += 1
        return n * n
    assert expensive(5) == 25
    assert expensive(5) == 25  # Should use cache
    assert call_count["value"] == 1  # Only called once!
    print("[PASS] Test 20.3 Passed: cache decorator")

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

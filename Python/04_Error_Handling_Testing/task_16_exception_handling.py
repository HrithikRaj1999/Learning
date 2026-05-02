"""
==============================================================================
  TASK 16: Exception Handling
==============================================================================

REAL-WORLD CONTEXT:
Exceptions are how Python handles runtime errors. Without proper handling:
  - Division by zero crashes your API (500 error for all users)
  - Network failures kill background jobs permanently
  - Invalid user input crashes the entire form submission

SCENARIOS COVERED:
  - Safe division (calculator that never crashes, returns error messages)
  - Batch processing (some items fail, rest continue - don't stop everything)
  - Retry logic (network calls fail temporarily - try again before giving up)
"""


# SCENARIO: A calculator API endpoint receives user input. User sends divide(10, 0).
# Without handling: ZeroDivisionError → 500 Internal Server Error → bad UX.
# YOUR FIX: Catch specific exceptions, return friendly error messages instead of crashing.
# EXPECTED: safe_divide(10, 2) → 5.0; safe_divide(10, 0) → "Error: zero..."
def safe_divide(a, b):
    pass


# SCENARIO: Batch job processes 100 operations. Operation #37 has invalid data.
# Without handling: entire batch stops at #37 and operations 38-100 are lost.
# YOUR FIX: Process each operation, catch errors per item, continue with the rest.
# EXPECTED: process_operations([valid, invalid, valid]) → [result, "error: ...", result]
def process_operations(operations):
    pass


# SCENARIO: Payment API is flaky — fails 2 out of 3 times due to network issues.
# Without retry: user sees "Payment failed" even though retrying would succeed.
# YOUR FIX: Retry a function up to max_attempts times. Only fail if ALL attempts fail.
# EXPECTED: retry(flaky_fn, max_attempts=3) → succeeds on 3rd try → returns "Success"
def retry(func, max_attempts=3):
    pass

if __name__ == "__main__":
    assert safe_divide(10, 2) == 5.0
    assert "zero" in safe_divide(10, 0).lower()
    assert "type" in safe_divide(10, "a").lower() or "invalid" in safe_divide(10, "a").lower()
    print("[PASS] Test 16.1 Passed: safe_divide")

    ops = [
        {"type": "add", "a": 5, "b": 3},
        {"type": "divide", "a": 10, "b": 0},
        {"type": "multiply", "a": 4, "b": 5},
    ]
    results = process_operations(ops)
    assert results[0] == 8
    assert "error" in results[1]
    assert results[2] == 20
    print("[PASS] Test 16.2 Passed: process_operations")

    call_count = {"value": 0}
    def flaky_function():
        call_count["value"] += 1
        if call_count["value"] < 3:
            raise ConnectionError("Failed")
        return "Success"

    result = retry(flaky_function, max_attempts=3)
    assert result == "Success"
    print("[PASS] Test 16.3 Passed: retry")

    print("\n*** ALL TASK 16 TESTS PASSED! ***")

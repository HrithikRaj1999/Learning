"""
================================================================
   TASK 16: Exception Handling Mastery            **        
================================================================

INSTRUCTIONS:
In production, unhandled exceptions = crashed servers. Handle them properly.

CONCEPTS: try/except/else/finally, multiple exceptions, exception chaining
"""


# ----- Challenge 16.1 -----
# Write a safe_divide function that handles division by zero and type errors.
# Returns the result or a descriptive error message string.
# Example: safe_divide(10, 0) -> "Error: Division by zero"
#          safe_divide(10, "a") -> "Error: Invalid types"
#          safe_divide(10, 2) -> 5.0
def safe_divide(a, b):
    pass  # YOUR CODE HERE


# ----- Challenge 16.2 -----
# Write a function that processes a list of operations.
# Each operation is a dict: {"type": "add"|"subtract"|"multiply"|"divide", "a": X, "b": Y}
# Return list of results. If an operation fails, include {"error": "description"} instead.
def process_operations(operations):
    pass  # YOUR CODE HERE


# ----- Challenge 16.3 -----
# Write a retry decorator-like function.
# retry(func, max_attempts=3) -> calls func, if it raises, retries up to max_attempts.
# Returns the result if successful, raises the last exception if all attempts fail.
def retry(func, max_attempts=3):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
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

    # Test 16.3
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

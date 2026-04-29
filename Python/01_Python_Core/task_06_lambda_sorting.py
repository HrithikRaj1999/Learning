"""
================================================================
   TASK 6: Lambda & Sorting Challenge             ***      
================================================================

INSTRUCTIONS:
Lambda functions are used everywhere -- sorting, callbacks, quick transforms.

CONCEPTS: lambda, sorted with lambda key, map/filter with lambda
"""


# ----- Challenge 6.1 -----
# Sort a list of tuples by the second element using lambda.
# Example: [(1,3),(4,1),(2,2)] -> [(4,1),(2,2),(1,3)]
def sort_by_second(tuples_list):
    pass  # YOUR CODE HERE


# ----- Challenge 6.2 -----
# Create a function that returns a multiplier function.
# Example: double = make_multiplier(2); double(5) -> 10
def make_multiplier(n):
    pass  # YOUR CODE HERE


# ----- Challenge 6.3 -----
# Sort strings by their last character.
# Example: ["hello", "world", "banana", "apple"] -> ["banana", "apple", "world", "hello"]
def sort_by_last_char(words):
    pass  # YOUR CODE HERE


# ----- Challenge 6.4 -----
# Using map with lambda, convert a list of temperatures from Celsius to Fahrenheit.
# Formula: F = C * 9/5 + 32
# Example: [0, 100, 37] -> [32.0, 212.0, 98.6]
def celsius_to_fahrenheit(temps):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    assert sort_by_second([(1, 3), (4, 1), (2, 2)]) == [(4, 1), (2, 2), (1, 3)]
    print("[PASS] Test 6.1 Passed: sort_by_second")

    double = make_multiplier(2)
    assert double(5) == 10
    triple = make_multiplier(3)
    assert triple(4) == 12
    print("[PASS] Test 6.2 Passed: make_multiplier")

    assert sort_by_last_char(["hello", "world", "banana", "apple"]) == ["banana", "apple", "world", "hello"]
    print("[PASS] Test 6.3 Passed: sort_by_last_char")

    assert celsius_to_fahrenheit([0, 100, 37]) == [32.0, 212.0, 98.6]
    print("[PASS] Test 6.4 Passed: celsius_to_fahrenheit")

    print("\n*** ALL TASK 6 TESTS PASSED! ***")

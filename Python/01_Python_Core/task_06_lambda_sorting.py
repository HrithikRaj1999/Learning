"""
==============================================================================
  TASK 06: Lambda Functions & Advanced Sorting
==============================================================================

REAL-WORLD CONTEXT:
Lambda functions are ONE-LINE throwaway functions. You use them when:
  - Sorting by a custom rule (sort products by price, users by last login)
  - Quick transformations in map/filter (no need for a named function)
  - Closures that "remember" a value (factory pattern)

These patterns appear in EVERY Python codebase and interview.
"""


# SCENARIO: A spreadsheet has rows as tuples: (id, score). User clicks "sort by score"
# column header. You need to sort by the second element of each tuple.
# YOUR FIX: Sort a list of tuples by their second element using a lambda.
# EXPECTED: sort_by_second([(1,3), (4,1), (2,2)]) → [(4,1), (2,2), (1,3)]
def sort_by_second(tuples_list):
    pass


# SCENARIO: A tax calculator app needs functions: multiply_by_1.1 (10% tax),
# multiply_by_1.2 (20% tax). Instead of writing each, create a FACTORY
# that generates multiplier functions on the fly.
# YOUR FIX: Return a function that multiplies its argument by n (closure).
# EXPECTED: double = make_multiplier(2); double(5) → 10
def make_multiplier(n):
    pass


# SCENARIO: A rhyming dictionary groups words by ending. First step: sort words
# by their LAST character so rhyming words cluster together.
# YOUR FIX: Sort words alphabetically by their last character.
# EXPECTED: sort_by_last_char(["hello","world","banana","apple"]) → ["banana","apple","world","hello"]
def sort_by_last_char(words):
    pass


# SCENARIO: Weather API returns temperatures in Celsius. US users need Fahrenheit.
# Convert a whole list: [0, 100, 37] → [32.0, 212.0, 98.6]. Use map + lambda.
# YOUR FIX: Convert each Celsius temperature to Fahrenheit using map().
# EXPECTED: celsius_to_fahrenheit([0, 100, 37]) → [32.0, 212.0, 98.6]
def celsius_to_fahrenheit(temps):
    pass

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

"""
==============================================================================
  TASK 05: Built-in Functions Mastery
==============================================================================

REAL-WORLD CONTEXT:
Python's built-in functions (zip, map, filter, enumerate, any, all, sorted) are
interview GOLD. They show you think "Pythonically" — using the language's strengths
instead of writing verbose C-style loops for everything.

SCENARIOS COVERED:
  - Combining parallel lists (zip: headers + values → dict)
  - Filtering with conditions (any/all: validation checks)
  - Finding positions (enumerate: locating items in sequences)
  - Flexible sorting (sorted with key: custom ordering)
"""


# SCENARIO: CSV parser gives you headers=["name","age","city"] and row=["Alice","30","NYC"].
# You need a dict: {"name": "Alice", "age": "30", "city": "NYC"}. Use zip.
# YOUR FIX: Combine two parallel lists into a dictionary using zip().
# EXPECTED: lists_to_dict(["a", "b", "c"], [1, 2, 3]) → {"a": 1, "b": 2, "c": 3}
def lists_to_dict(keys, values):
    pass


# SCENARIO: A readability analyzer needs word lengths, but only for words longer
# than 4 characters (short words like "the", "is" aren't interesting).
# YOUR FIX: Return lengths of words that have more than 4 characters.
# EXPECTED: long_word_lengths(["hi", "hello", "hey", "python", "go"]) → [5, 6]
def long_word_lengths(words):
    pass


# SCENARIO: A log file parser found a suspicious IP. You need ALL line numbers
# where it appears (for reporting to security team). Enumerate + filter.
# YOUR FIX: Find all indices where target appears in the list.
# EXPECTED: find_all_indices([1, 3, 5, 3, 7, 3], 3) → [1, 3, 5]
def find_all_indices(lst, target):
    pass


# SCENARIO: Payment validation: "Has at least one positive amount?" (any) vs
# "Are ALL amounts positive?" (all). Different business rules.
# YOUR FIX: any_positive → True if at least one number > 0. all_positive → True if every number > 0.
# EXPECTED: any_positive([-1, -2, 3]) → True; all_positive([1, -2, 3]) → False
def any_positive(nums):
    pass

def all_positive(nums):
    pass


# SCENARIO: Admin dashboard lists users. Manager wants them sorted by age (or name,
# or signup date). Need a generic sort-by-key function for any dict field.
# YOUR FIX: Sort a list of dicts by a specified key name.
# EXPECTED: sort_by_key([{"name":"Bob","age":25}, {"name":"Alice","age":22}], "age")
#           → [{"name":"Alice","age":22}, {"name":"Bob","age":25}]
def sort_by_key(lst, key):
    pass

if __name__ == "__main__":
    assert lists_to_dict(["a", "b", "c"], [1, 2, 3]) == {"a": 1, "b": 2, "c": 3}
    print("[PASS] Test 5.1 Passed: lists_to_dict")

    assert long_word_lengths(["hi", "hello", "hey", "python", "go"]) == [5, 6]
    print("[PASS] Test 5.2 Passed: long_word_lengths")

    assert find_all_indices([1, 3, 5, 3, 7, 3], 3) == [1, 3, 5]
    print("[PASS] Test 5.3 Passed: find_all_indices")

    assert any_positive([-1, -2, 3]) == True
    assert all_positive([1, 2, 3]) == True
    assert all_positive([1, -2, 3]) == False
    print("[PASS] Test 5.4 Passed: any_positive & all_positive")

    data = [{"name": "Bob", "age": 25}, {"name": "Alice", "age": 22}]
    assert sort_by_key(data, "age") == [{"name": "Alice", "age": 22}, {"name": "Bob", "age": 25}]
    print("[PASS] Test 5.5 Passed: sort_by_key")

    print("\n*** ALL TASK 5 TESTS PASSED! ***")

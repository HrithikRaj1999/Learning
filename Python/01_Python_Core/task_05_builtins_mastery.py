"""
================================================================
   TASK 5: Built-in Functions Mastery             ***      
================================================================

INSTRUCTIONS:
Python's built-ins are superpowers. Master map, filter, zip, enumerate, any, all.

CONCEPTS: map, filter, zip, enumerate, any, all, sorted with key
"""


# ----- Challenge 5.1 -----
# Using zip, combine two lists into a dict.
# Example: ["a","b","c"], [1,2,3] -> {"a": 1, "b": 2, "c": 3}
def lists_to_dict(keys, values):
    pass  # YOUR CODE HERE


# ----- Challenge 5.2 -----
# Using map and filter, get lengths of words that have more than 3 letters.
# Example: ["hi", "hello", "hey", "python", "go"] -> [5, 6]
def long_word_lengths(words):
    pass  # YOUR CODE HERE


# ----- Challenge 5.3 -----
# Using enumerate, find all indices where value equals target.
# Example: [1,3,5,3,7,3], target=3 -> [1, 3, 5]
def find_all_indices(lst, target):
    pass  # YOUR CODE HERE


# ----- Challenge 5.4 -----
# Using any() and all(), check:
# - any_positive: True if any number is positive
# - all_positive: True if all numbers are positive
def any_positive(nums):
    pass  # YOUR CODE HERE

def all_positive(nums):
    pass  # YOUR CODE HERE


# ----- Challenge 5.5 -----
# Sort a list of dicts by a specific key.
# Example: [{"name":"Bob","age":25},{"name":"Alice","age":22}]
# sorted by "age" -> [{"name":"Alice","age":22},{"name":"Bob","age":25}]
def sort_by_key(lst, key):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
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

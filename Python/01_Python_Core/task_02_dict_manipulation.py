"""
================================================================
   TASK 2: Dictionary Manipulation                **        
================================================================

INSTRUCTIONS:
Master Python dictionaries -- the most used data structure in web dev.

CONCEPTS: Dict comprehension, merging, defaultdict, Counter
"""


# ----- Challenge 2.1 -----
# Invert a dictionary (swap keys and values).
# Example: {"a": 1, "b": 2} -> {1: "a", 2: "b"}
def invert_dict(d):
    # return Object.entries(d).reduce((acc, [key, value]) => {},{[value]: key})
    return {value: key for key, value in d.items()}


# ----- Challenge 2.2 -----
# Count the frequency of each character in a string (use dict, not Counter).
# Example: "hello" -> {'h': 1, 'e': 1, 'l': 2, 'o': 1}
def char_frequency(s):
   return {}


# ----- Challenge 2.3 -----
# Merge two dicts. If key exists in both, sum the values.
# Example: {"a": 1, "b": 2}, {"b": 3, "c": 4} -> {"a": 1, "b": 5, "c": 4}
def merge_dicts_sum(d1, d2):
    pass  # YOUR CODE HERE


# ----- Challenge 2.4 -----
# Group a list of words by their first letter.
# Example: ["apple","ant","bat","ball","cat"] ->
#          {"a": ["apple","ant"], "b": ["bat","ball"], "c": ["cat"]}
def group_by_first_letter(words):
    pass  # YOUR CODE HERE


# ----- Challenge 2.5 -----
# Given a list of (student, score) tuples, return a dict with student
# as key and their HIGHEST score as value.
# Example: [("Alice",85),("Bob",90),("Alice",92),("Bob",88)] ->
#          {"Alice": 92, "Bob": 90}
def highest_scores(records):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    assert invert_dict({"a": 1, "b": 2}) == {1: "a", 2: "b"}
    print("[PASS] Test 2.1 Passed: invert_dict")

    assert char_frequency("hello") == {'h': 1, 'e': 1, 'l': 2, 'o': 1}
    print("[PASS] Test 2.2 Passed: char_frequency")

    assert merge_dicts_sum({"a": 1, "b": 2}, {"b": 3, "c": 4}) == {"a": 1, "b": 5, "c": 4}
    print("[PASS] Test 2.3 Passed: merge_dicts_sum")

    result = group_by_first_letter(["apple", "ant", "bat", "ball", "cat"])
    assert result == {"a": ["apple", "ant"], "b": ["bat", "ball"], "c": ["cat"]}
    print("[PASS] Test 2.4 Passed: group_by_first_letter")

    assert highest_scores([("Alice", 85), ("Bob", 90), ("Alice", 92), ("Bob", 88)]) == {"Alice": 92, "Bob": 90}
    print("[PASS] Test 2.5 Passed: highest_scores")

    print("\n*** ALL TASK 2 TESTS PASSED! ***")

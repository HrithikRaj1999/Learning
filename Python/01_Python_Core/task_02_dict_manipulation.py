"""
==============================================================================
  TASK 02: Dictionary Manipulation
==============================================================================

REAL-WORLD CONTEXT:
Dictionaries are how you handle REAL DATA in Python — user profiles, config files,
API responses, database rows, caches. Every Python job interview has dict questions.

SCENARIOS COVERED:
  - Reversing lookup tables (code→name becomes name→code)
  - Counting characters (spam detection, password strength)
  - Combining data from multiple sources (merging API responses)
  - Categorizing items (grouping products by department)
  - Finding best scores (leaderboards, performance tracking)
"""


# SCENARIO: You have a translation lookup: {"en": "English", "es": "Spanish"}.
# Now you need REVERSE lookup: given "English", find "en".
# YOUR FIX: Swap keys and values to create a reverse mapping.
# EXPECTED: invert_dict({"a": 1, "b": 2}) → {1: "a", 2: "b"}
def invert_dict(d):
    return {value: key for key, value in d.items()}


# SCENARIO: Spam filter needs to know letter distribution in a message.
# "aaaaaaa buy now!!!!" has suspicious patterns. Count each character.
# YOUR FIX: Count occurrences of each character in the string.
# EXPECTED: char_frequency("hello") → {'h': 1, 'e': 1, 'l': 2, 'o': 1}
def char_frequency(s):
   return {}


# SCENARIO: Two departments report sales: {"widgets": 10} and {"widgets": 5, "gadgets": 3}.
# You need a COMBINED total — not overwrite, but ADD values for shared keys.
# YOUR FIX: Merge two dicts, summing values where keys overlap.
# EXPECTED: merge_dicts_sum({"a": 1, "b": 2}, {"b": 3, "c": 4}) → {"a": 1, "b": 5, "c": 4}
def merge_dicts_sum(d1, d2):
    pass


# SCENARIO: A contacts app lets you search by first letter. Given a list of names,
# group them so "A" shows ["Alice", "Adam"], "B" shows ["Bob", "Beth"].
# YOUR FIX: Group words by their first character into a dict of lists.
# EXPECTED: group_by_first_letter(["apple", "ant", "bat"]) → {"a": ["apple", "ant"], "b": ["bat"]}
def group_by_first_letter(words):
    pass


# SCENARIO: A gaming leaderboard has multiple scores per player across matches.
# You only want each player's HIGHEST score for the final ranking.
# YOUR FIX: From a list of (name, score) tuples, keep only the max score per name.
# EXPECTED: highest_scores([("Alice", 85), ("Bob", 90), ("Alice", 92)]) → {"Alice": 92, "Bob": 90}
def highest_scores(records):
    pass

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

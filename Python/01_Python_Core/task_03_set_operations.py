"""
==============================================================================
  TASK 03: Set Operations
==============================================================================

REAL-WORLD CONTEXT:
Sets are FAST for membership testing and finding differences. Real uses:
  - "Which users are in group A but NOT group B?" (targeting/segmentation)
  - "Are these two words anagrams?" (games, puzzles)
  - "What's common across ALL datasets?" (finding overlap)
  - "Remove duplicates but keep original order" (data cleaning)
"""


# SCENARIO: Marketing team has List A (all subscribers) and List B (already contacted).
# They need: "Who HASN'T been contacted yet?" — items in first but NOT in second.
# YOUR FIX: Return elements that exist in list1 but not in list2.
# EXPECTED: unique_to_first([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]) → {1, 2}
def unique_to_first(list1, list2):
    pass


# SCENARIO: A word game needs to check if two words use the exact same letters.
# "listen" and "silent" → True (same letters rearranged). Classic interview question.
# YOUR FIX: Check if two strings are anagrams (same character counts, ignore case).
# EXPECTED: are_anagrams("listen", "silent") → True; are_anagrams("hello", "world") → False
def are_anagrams(s1, s2):
    pass


# SCENARIO: Three survey groups answered different questions. Find questions
# that ALL groups answered — the universal overlap for cross-group analysis.
# YOUR FIX: Find elements common to ALL sub-lists (intersection of all).
# EXPECTED: common_in_all([[1,2,3], [2,3,4], [3,4,5]]) → {3}
def common_in_all(lists):
    pass


# SCENARIO: CSV import has duplicate rows. Remove duplicates but keep the FIRST
# occurrence order (for audit trail: "first seen" matters).
# YOUR FIX: Remove duplicates while preserving original order of first appearance.
# EXPECTED: remove_duplicates_ordered([1, 3, 2, 3, 1, 4, 2]) → [1, 3, 2, 4]
def remove_duplicates_ordered(lst):
    pass

if __name__ == "__main__":
    assert unique_to_first([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]) == {1, 2}
    print("[PASS] Test 3.1 Passed: unique_to_first")

    assert are_anagrams("listen", "silent") == True
    assert are_anagrams("hello", "world") == False
    print("[PASS] Test 3.2 Passed: are_anagrams")

    assert common_in_all([[1, 2, 3], [2, 3, 4], [3, 4, 5]]) == {3}
    print("[PASS] Test 3.3 Passed: common_in_all")

    assert remove_duplicates_ordered([1, 3, 2, 3, 1, 4, 2]) == [1, 3, 2, 4]
    print("[PASS] Test 3.4 Passed: remove_duplicates_ordered")

    print("\n*** ALL TASK 3 TESTS PASSED! ***")

"""
================================================================
   TASK 3: Set Operations Challenge               **        
================================================================

INSTRUCTIONS:
Sets are perfect for fast lookups, deduplication, and math operations.

CONCEPTS: set operations, frozenset, set comprehension
"""


# ----- Challenge 3.1 -----
# Given two lists, find elements present in first but not in second.
# Example: [1,2,3,4,5], [3,4,5,6,7] -> {1, 2}
def unique_to_first(list1, list2):
    pass  # YOUR CODE HERE


# ----- Challenge 3.2 -----
# Check if two strings are anagrams using sets and counting.
# Example: "listen", "silent" -> True
def are_anagrams(s1, s2):
    pass  # YOUR CODE HERE


# ----- Challenge 3.3 -----
# Given a list of lists, find elements that appear in ALL sublists.
# Example: [[1,2,3],[2,3,4],[3,4,5]] -> {3}
def common_in_all(lists):
    pass  # YOUR CODE HERE


# ----- Challenge 3.4 -----
# Remove all duplicates from a list while preserving order.
# Example: [1, 3, 2, 3, 1, 4, 2] -> [1, 3, 2, 4]
def remove_duplicates_ordered(lst):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
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

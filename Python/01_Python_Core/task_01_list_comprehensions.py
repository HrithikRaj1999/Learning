"""
======================================================================
  TASK 1: List Comprehension Challenges          [**]              
======================================================================

INSTRUCTIONS:
Complete each function using ONLY list comprehensions (no loops).

CONCEPTS: List comprehension, nested comprehension, conditional filtering
"""


# ----- Challenge 1.1 -----
# Given a list of numbers, return only the even numbers squared.
# Example: [1,2,3,4,5] → [4, 16]
def even_squares(nums):
    return [x**2 for x in nums if x%2==0]


# ----- Challenge 1.2 -----
# Flatten a 2D matrix into a 1D list.
# Example: [[1,2],[3,4],[5,6]] → [1,2,3,4,5,6]
def flatten_matrix(matrix):
    return [item for row in matrix for item in row]


# ----- Challenge 1.3 -----
# Given a string, return a list of (index, char) for vowels only.
# Example: "hello" → [(1, 'e'), (4, 'o')]
def vowel_positions(s):
    return [(i,char) for i, char in enumerate(s) if char.lower() in 'aeiou']


# ----- Challenge 1.4 -----
# Generate a multiplication table (list of lists) for n x n.
# Example: n=3 → [[1,2,3],[2,4,6],[3,6,9]]
def multiplication_table(n):
    return [[row * col for col in range(1, n + 1)] for row in range(1, n + 1)]

# ----- Challenge 1.5 -----
# Given two lists, return common elements (intersection) using comprehension.
# Example: [1,2,3,4], [3,4,5,6] → [3, 4]
def common_elements(list1, list2):
    return [item for item in list1 if item in list2]


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 1.1
    assert even_squares([1, 2, 3, 4, 5]) == [4, 16], "Test 1.1 Failed"
    print("[PASS] Test 1.1 Passed: even_squares")

    # Test 1.2
    assert flatten_matrix([[1, 2], [3, 4], [5, 6]]) == [1, 2, 3, 4, 5, 6], "Test 1.2 Failed"
    print("[PASS] Test 1.2 Passed: flatten_matrix")

    # Test 1.3
    assert vowel_positions("hello") == [(1, 'e'), (4, 'o')], "Test 1.3 Failed"
    print("[PASS] Test 1.3 Passed: vowel_positions")

    # Test 1.4
    assert multiplication_table(3) == [[1, 2, 3], [2, 4, 6], [3, 6, 9]], "Test 1.4 Failed"
    print("[PASS] Test 1.4 Passed: multiplication_table")

    # Test 1.5
    assert common_elements([1, 2, 3, 4], [3, 4, 5, 6]) == [3, 4], "Test 1.5 Failed"
    print("[PASS] Test 1.5 Passed: common_elements")

    print("\n*** ALL TASK 1 TESTS PASSED! ***")

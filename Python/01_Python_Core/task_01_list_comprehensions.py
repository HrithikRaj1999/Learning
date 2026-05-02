"""
======================================================================
  TASK 1: List Comprehension Challenges
======================================================================

REAL-WORLD CONTEXT:
In production Python code, you process data ALL the time:
  - Filter a list of 10,000 transactions to find suspicious ones
  - Transform user records into a different format for an API
  - Flatten nested JSON responses into flat rows for a CSV export

List comprehensions are Python's power tool for this. They're:
  - Faster than for loops (Python optimizes them internally)
  - More readable (once you know the pattern)
  - Used in EVERY Python codebase you'll encounter

RULE: Complete each function using ONLY list comprehensions (no for loops).
"""


# ---------------------------------------------------------------------------
# Challenge 1.1 — Filter & Transform: Find Expensive Items
# ---------------------------------------------------------------------------
# SCENARIO: You have a list of product prices. Marketing wants only the 
# even-priced items (on-sale items), displayed as their squared values
# (some weird pricing algorithm).
#
# REAL-LIFE EXAMPLE: E-commerce site filtering products by criteria
# and transforming the results for display.
#
# WHAT TO DO: Return only even numbers, squared.
# Input: [1, 2, 3, 4, 5] → Output: [4, 16] (2²=4, 4²=16)
# ---------------------------------------------------------------------------
def even_squares(nums):
    return [x**2 for x in nums if x%2==0]


# ---------------------------------------------------------------------------
# Challenge 1.2 — Flatten Nested Data (API Response → Flat List)
# ---------------------------------------------------------------------------
# SCENARIO: An API returns paginated results as nested arrays:
#   [[page1_items], [page2_items], [page3_items]]
# Your database bulk insert needs ONE flat list of all items.
#
# REAL-LIFE EXAMPLE: Combining results from multiple API pages into
# a single list for batch processing.
#
# WHAT TO DO: Flatten a 2D list into 1D.
# Input: [[1,2],[3,4],[5,6]] → Output: [1,2,3,4,5,6]
# ---------------------------------------------------------------------------
def flatten_matrix(matrix):
    return [item for row in matrix for item in row]


# ---------------------------------------------------------------------------
# Challenge 1.3 — Find Specific Characters with Positions
# ---------------------------------------------------------------------------
# SCENARIO: A text analysis tool needs to find all vowels in a sentence
# along with their positions (for pronunciation scoring in a language app).
#
# REAL-LIFE EXAMPLE: Text processing for search indexing, finding specific
# characters or patterns with their locations.
#
# WHAT TO DO: Return (index, char) tuples for vowels only.
# Input: "hello" → Output: [(1, 'e'), (4, 'o')]
# ---------------------------------------------------------------------------
def vowel_positions(s):
    return [(i,char) for i, char in enumerate(s) if char.lower() in 'aeiou']


# ---------------------------------------------------------------------------
# Challenge 1.4 — Generate a Grid (Game Board / Multiplication Table)
# ---------------------------------------------------------------------------
# SCENARIO: A math tutoring app needs to generate multiplication tables
# dynamically for any size. Also useful for game boards, seating charts, etc.
#
# REAL-LIFE EXAMPLE: Generating grid data for dashboards, calendars,
# or any 2D structure from parameters.
#
# WHAT TO DO: Generate an n×n multiplication table as nested lists.
# Input: n=3 → Output: [[1,2,3],[2,4,6],[3,6,9]]
# ---------------------------------------------------------------------------
def multiplication_table(n):
    return [[row * col for col in range(1, n + 1)] for row in range(1, n + 1)]

# ---------------------------------------------------------------------------
# Challenge 1.5 — Find Common Items Between Two Lists (Set Intersection)
# ---------------------------------------------------------------------------
# SCENARIO: Two teams submit their preferred meeting times. You need to
# find times that work for BOTH teams (the intersection).
#
# REAL-LIFE EXAMPLE: Finding shared tags, mutual friends, common products
# between two collections.
#
# WHAT TO DO: Return elements present in BOTH lists.
# Input: [1,2,3,4], [3,4,5,6] → Output: [3, 4]
# ---------------------------------------------------------------------------
def common_elements(list1, list2):
    return [item for item in list1 if item in list2]

if __name__ == "__main__":
    assert even_squares([1, 2, 3, 4, 5]) == [4, 16], "Test 1.1 Failed"
    print("[PASS] Test 1.1 Passed: even_squares")

    assert flatten_matrix([[1, 2], [3, 4], [5, 6]]) == [1, 2, 3, 4, 5, 6], "Test 1.2 Failed"
    print("[PASS] Test 1.2 Passed: flatten_matrix")

    assert vowel_positions("hello") == [(1, 'e'), (4, 'o')], "Test 1.3 Failed"
    print("[PASS] Test 1.3 Passed: vowel_positions")

    assert multiplication_table(3) == [[1, 2, 3], [2, 4, 6], [3, 6, 9]], "Test 1.4 Failed"
    print("[PASS] Test 1.4 Passed: multiplication_table")

    assert common_elements([1, 2, 3, 4], [3, 4, 5, 6]) == [3, 4], "Test 1.5 Failed"
    print("[PASS] Test 1.5 Passed: common_elements")

    print("\n*** ALL TASK 1 TESTS PASSED! ***")

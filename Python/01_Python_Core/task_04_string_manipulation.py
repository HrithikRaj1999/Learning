"""
==============================================================================
  TASK 04: String Manipulation
==============================================================================

REAL-WORLD CONTEXT:
String manipulation is EVERYWHERE in real code:
  - Formatting user input for display (title case for names)
  - Validating input (palindrome checks, email extraction)
  - Data compression (run-length encoding for simple cases)
  - Converting between naming conventions (APIs use snake_case, JS uses camelCase)
"""


# SCENARIO: User enters their name as "jOHN sMITH" (caps lock issues).
# Display needs "John Smith" — first letter uppercase, rest lowercase per word.
# YOUR FIX: Convert string to title case (each word capitalized).
# EXPECTED: custom_title_case("hello world") → "Hello World"
def custom_title_case(s):
    pass


# SCENARIO: A content validation system checks if a phrase reads the same backward
# (for detecting patterns in codes, IDs, or fun user-submitted palindromes).
# Ignore spaces, punctuation, and case.
# YOUR FIX: Check if a string is a palindrome (ignoring non-alphanumeric, case-insensitive).
# EXPECTED: is_palindrome("A man, a plan, a canal: Panama") → True
def is_palindrome(s):
    pass


# SCENARIO: A simple compression algorithm for transmitting text over a slow connection.
# "aaabbbcc" → "a3b3c2" is smaller. Used in image formats (BMP) and old modems.
# YOUR FIX: Compress consecutive repeated characters into char+count format.
# EXPECTED: run_length_encode("aaabbbccddddee") → "a3b3c2d4e2"
def run_length_encode(s):
    pass


# SCENARIO: A support ticket system needs to extract all email addresses from
# free-text customer messages so agents can follow up. Simple pattern matching.
# YOUR FIX: Find all email-like patterns in a text string.
# EXPECTED: extract_emails_simple("Contact info@test.com or help@dev.org") → ["info@test.com", "help@dev.org"]
def extract_emails_simple(text):
    pass


# SCENARIO: Python backend uses snake_case ("user_name"). JavaScript frontend uses
# camelCase ("userName"). Converting between them when building API responses.
# YOUR FIX: Convert snake_case string to camelCase.
# EXPECTED: snake_to_camel("hello_world_python") → "helloWorldPython"
def snake_to_camel(s):
    pass

if __name__ == "__main__":
    assert custom_title_case("hello world") == "Hello World"
    print("[PASS] Test 4.1 Passed: custom_title_case")

    assert is_palindrome("A man, a plan, a canal: Panama") == True
    assert is_palindrome("hello") == False
    print("[PASS] Test 4.2 Passed: is_palindrome")

    assert run_length_encode("aaabbbccddddee") == "a3b3c2d4e2"
    print("[PASS] Test 4.3 Passed: run_length_encode")

    assert extract_emails_simple("Contact us at info@test.com or help@dev.org") == ["info@test.com", "help@dev.org"]
    print("[PASS] Test 4.4 Passed: extract_emails_simple")

    assert snake_to_camel("hello_world_python") == "helloWorldPython"
    print("[PASS] Test 4.5 Passed: snake_to_camel")

    print("\n*** ALL TASK 4 TESTS PASSED! ***")

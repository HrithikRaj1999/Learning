"""
================================================================
   TASK 4: String Manipulation Pro                **        
================================================================

INSTRUCTIONS:
Strings are everywhere in web dev -- URLs, HTML, JSON, user input.

CONCEPTS: string methods, slicing, formatting, f-strings
"""


# ----- Challenge 4.1 -----
# Convert a string to title case WITHOUT using .title()
# Handle edge cases: multiple spaces, tabs, etc.
# Example: "hello world  python" -> "Hello World  Python"
def custom_title_case(s):
    pass  # YOUR CODE HERE


# ----- Challenge 4.2 -----
# Check if a string is a valid palindrome (ignore spaces, punctuation, case).
# Example: "A man, a plan, a canal: Panama" -> True
def is_palindrome(s):
    pass  # YOUR CODE HERE


# ----- Challenge 4.3 -----
# Compress a string using run-length encoding.
# Example: "aaabbbccddddee" -> "a3b3c2d4e2"
def run_length_encode(s):
    pass  # YOUR CODE HERE


# ----- Challenge 4.4 -----
# Extract all email-like patterns from a text (simple version).
# An email: word@word.word (use string methods, no regex yet).
# Example: "Contact us at info@test.com or help@dev.org" -> ["info@test.com", "help@dev.org"]
def extract_emails_simple(text):
    pass  # YOUR CODE HERE


# ----- Challenge 4.5 -----
# Convert snake_case to camelCase.
# Example: "hello_world_python" -> "helloWorldPython"
def snake_to_camel(s):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
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

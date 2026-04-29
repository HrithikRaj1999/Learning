"""
================================================================
   TASK 14: Regex Pattern Matching                ***      
================================================================

INSTRUCTIONS:
Regex is used for validation (emails, passwords, URLs), parsing, and searching.

CONCEPTS: re module, match, search, findall, sub, compile, groups
"""

import re


# ----- Challenge 14.1 -----
# Validate an email address.
# Rules: letters/numbers/dots/underscores @ letters/numbers . 2-4 letter domain
# Example: "user@example.com" -> True, "bad@.com" -> False
def is_valid_email(email):
    pass  # YOUR CODE HERE


# ----- Challenge 14.2 -----
# Extract all phone numbers from text in format: (XXX) XXX-XXXX or XXX-XXX-XXXX
# Example: "Call (123) 456-7890 or 987-654-3210" -> ["(123) 456-7890", "987-654-3210"]
def extract_phone_numbers(text):
    pass  # YOUR CODE HERE


# ----- Challenge 14.3 -----
# Validate a password:
# - At least 8 characters
# - At least one uppercase letter
# - At least one lowercase letter
# - At least one digit
# - At least one special character (!@#$%^&*)
def is_strong_password(password):
    pass  # YOUR CODE HERE


# ----- Challenge 14.4 -----
# Replace all URLs in text with "[LINK]"
# URL pattern: http(s)://anything-until-whitespace
def mask_urls(text):
    pass  # YOUR CODE HERE


# ----- Challenge 14.5 -----
# Parse a log line and extract components.
# Format: "2024-01-15 10:30:45 [ERROR] Database connection failed"
# Return: {"date": "2024-01-15", "time": "10:30:45", "level": "ERROR", "message": "Database connection failed"}
def parse_log_line(line):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    assert is_valid_email("user@example.com") == True
    assert is_valid_email("bad@.com") == False
    assert is_valid_email("test.user@domain.org") == True
    print("[PASS] Test 14.1 Passed: is_valid_email")

    phones = extract_phone_numbers("Call (123) 456-7890 or 987-654-3210 today")
    assert len(phones) == 2
    print("[PASS] Test 14.2 Passed: extract_phone_numbers")

    assert is_strong_password("MyP@ssw0rd") == True
    assert is_strong_password("weakpass") == False
    assert is_strong_password("NoSpecial1") == False
    print("[PASS] Test 14.3 Passed: is_strong_password")

    text = "Visit https://google.com and http://example.org for info"
    assert mask_urls(text) == "Visit [LINK] and [LINK] for info"
    print("[PASS] Test 14.4 Passed: mask_urls")

    log = "2024-01-15 10:30:45 [ERROR] Database connection failed"
    parsed = parse_log_line(log)
    assert parsed["level"] == "ERROR"
    assert parsed["message"] == "Database connection failed"
    print("[PASS] Test 14.5 Passed: parse_log_line")

    print("\n*** ALL TASK 14 TESTS PASSED! ***")

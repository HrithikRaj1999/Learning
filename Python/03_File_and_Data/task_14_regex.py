"""
==============================================================================
  TASK 14: Regular Expressions
==============================================================================

REAL-WORLD CONTEXT:
Regex is ESSENTIAL for: input validation, log parsing, data extraction,
search-and-replace. It's ugly but powerful. Every language has it.

SCENARIOS COVERED:
  - Email validation (signup forms, contact forms)
  - Phone number extraction (from unstructured text, OCR results)
  - Password strength checking (security requirements)
  - URL masking (privacy compliance, content moderation)
  - Log file parsing (structured extraction from messy text)
"""

import re


# SCENARIO: Signup form needs email validation BEFORE hitting the server.
# Reject obviously invalid emails ("bad@.com") but accept standard formats.
# YOUR FIX: Regex pattern that matches valid email formats.
# EXPECTED: is_valid_email("user@example.com") → True; is_valid_email("bad@.com") → False
def is_valid_email(email):
    pass


# SCENARIO: A CRM system scans customer messages to auto-detect phone numbers
# for callback. Messages have mixed text with phones in different formats.
# YOUR FIX: Extract all phone numbers from text (handle (123) 456-7890 and 987-654-3210).
# EXPECTED: extract_phone_numbers("Call (123) 456-7890 or 987-654-3210") → 2 numbers
def extract_phone_numbers(text):
    pass


# SCENARIO: Security policy requires passwords with: 8+ chars, uppercase, lowercase,
# digit, and special character. Check ALL rules with regex.
# YOUR FIX: Validate password meets ALL strength requirements.
# EXPECTED: is_strong_password("MyP@ssw0rd") → True; is_strong_password("weakpass") → False
def is_strong_password(password):
    pass


# SCENARIO: Privacy compliance: before showing user-generated content publicly,
# replace all URLs with "[LINK]" to prevent phishing/spam links.
# YOUR FIX: Find all http/https URLs and replace with [LINK].
# EXPECTED: mask_urls("Visit https://google.com") → "Visit [LINK]"
def mask_urls(text):
    pass


# SCENARIO: Monitoring system needs to parse log lines like:
# "2024-01-15 10:30:45 [ERROR] Database connection failed"
# Extract: date, time, level, and message as structured data.
# YOUR FIX: Parse a log line into a dict with timestamp, level, and message.
# EXPECTED: parse_log_line("2024-01-15 10:30:45 [ERROR] DB failed") → {"level": "ERROR", ...}
def parse_log_line(line):
    pass

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

"""
==============================================================================
  TASK 54: Capstone Project — URL Shortener (like bit.ly)
==============================================================================

REAL-WORLD CONTEXT:
URL shorteners seem simple but test important concepts:
  - Unique ID generation (short codes that don't collide)
  - Database design (efficient lookups, click tracking)
  - Redirect handling (301 vs 302, performance)
  - Analytics (click counts, geographic data, referrer tracking)

SCENARIO: Build a URL shortener service:
  - User submits long URL → gets short code (e.g., abc123)
  - Visiting /abc123 redirects to original URL
  - Track clicks per URL
  - Dashboard shows analytics

THIS PROVES YOU CAN:
  - Design efficient database schemas
  - Handle high-throughput reads (redirects must be FAST)
  - Generate unique short codes (avoid collisions)
  - Build a complete service with API + frontend

EXPECTED BEHAVIOR:
  POST /shorten {"url": "https://very-long-url.com/path"} → {"short": "abc123"}
  GET /abc123 → 302 Redirect to original URL + increment click count
  GET /stats/abc123 → {"clicks": 42, "created": "2024-01-15"}
"""

import string
import random
import sqlite3

CHARS = string.ascii_letters + string.digits


# SCENARIO: Generate a unique 6-character code for each shortened URL.
# Must be URL-safe (letters + digits only). Collisions handled by checking DB.
# YOUR FIX: Random selection from alphanumeric characters.
def generate_short_code(length=6):
    pass


# SCENARIO: Create the database table for storing URL mappings.
# Schema: short_code (unique), original_url, click_count, created_at.
def setup_database(db_path="urls.db"):
    pass


# SCENARIO: User submits a long URL. Store it with a generated short code.
# Return the short code for constructing the redirect URL.
def shorten_url(db_path, original_url):
    pass


# SCENARIO: User visits /abc123. Look up the original URL for redirect.
# Return None if short code doesn't exist (for 404 handling).
def get_original_url(db_path, short_code):
    pass


# SCENARIO: Every time someone visits a short URL, count it for analytics.
def increment_clicks(db_path, short_code):
    pass

if __name__ == "__main__":
    code = generate_short_code()
    assert len(code) == 6
    assert all(c in CHARS for c in code)
    print(f"[PASS] Generated short code: {code}")

    print("\n[Target] Build the Flask app and test the full flow!")

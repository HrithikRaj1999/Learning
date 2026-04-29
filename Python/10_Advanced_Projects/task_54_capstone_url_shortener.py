"""
========================================================================
   TASK 54: CAPSTONE -- URL Shortener Service       ****         
========================================================================

[Trophy] CAPSTONE PROJECT 5 (Smaller, great for interviews)

Build a URL shortener like bit.ly. Simple but covers many concepts.

TECH STACK: Flask + SQLite/PostgreSQL + Redis
"""

import string
import random
import sqlite3


# ----- Challenge 54.1 -----
# Create the URL shortening algorithm:
# - Generate a unique short code (6 chars: a-z, A-Z, 0-9)
# - Store mapping: short_code -> original_url
# - Handle collisions

CHARS = string.ascii_letters + string.digits

def generate_short_code(length=6):
    pass  # YOUR CODE HERE


# ----- Challenge 54.2 -----
# Create the database layer:
# - urls table: id, short_code (unique), original_url, created_at, clicks (default 0)
# - Create, read, increment clicks

def setup_database(db_path="urls.db"):
    pass  # YOUR CODE HERE

def shorten_url(db_path, original_url):
    pass  # YOUR CODE HERE

def get_original_url(db_path, short_code):
    pass  # YOUR CODE HERE

def increment_clicks(db_path, short_code):
    pass  # YOUR CODE HERE


# ----- Challenge 54.3 -----
# Create Flask routes:
# POST /api/shorten {"url": "https://example.com"} -> {"short_url": "http://localhost:5000/abc123"}
# GET /<short_code> -> redirect to original URL
# GET /api/stats/<short_code> -> {"original_url": "...", "clicks": 42, "created_at": "..."}

# YOUR FLASK APP HERE


# ----- Challenge 54.4 -----
# Add features:
# - Custom short codes: POST /api/shorten {"url": "...", "custom_code": "mylink"}
# - Expiration: URLs expire after N days
# - Rate limiting: max 10 URLs per hour per IP
# - Analytics: clicks over time, referrer tracking

# YOUR CODE HERE


# =========== TEST CASES ===========
if __name__ == "__main__":
    code = generate_short_code()
    assert len(code) == 6
    assert all(c in CHARS for c in code)
    print(f"[PASS] Generated short code: {code}")

    print("\n[Target] Build the Flask app and test the full flow!")

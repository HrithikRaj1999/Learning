"""
================================================================
   TASK 15: Data Processing Pipeline              ***      
================================================================

INSTRUCTIONS:
Real-world task: process, transform, and analyze data like a backend dev.

CONCEPTS: chaining operations, data transformation, aggregation
"""

from collections import Counter
from datetime import datetime


# ----- Challenge 15.1 -----
# Given a list of order dicts, calculate total revenue per category.
# Input: [{"product": "A", "category": "Electronics", "price": 100, "qty": 2}, ...]
# Output: {"Electronics": 200, "Books": 50, ...}
def revenue_by_category(orders):
    pass  # YOUR CODE HERE


# ----- Challenge 15.2 -----
# Given a list of log entries (dicts with "timestamp", "level", "message"),
# return a summary: count per level and the most recent error message.
# Input: [{"timestamp": "2024-01-01 10:00", "level": "INFO", "message": "Started"}, ...]
# Output: {"counts": {"INFO": 5, "ERROR": 2}, "last_error": "DB timeout"}
def analyze_logs(logs):
    pass  # YOUR CODE HERE


# ----- Challenge 15.3 -----
# Build a simple data pipeline: given raw user data (list of dicts),
# 1. Remove entries with missing "email" field
# 2. Normalize email to lowercase
# 3. Remove duplicate emails (keep first occurrence)
# 4. Sort by "name"
# Return the cleaned list.
def clean_user_data(users):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 15.1
    orders = [
        {"product": "Laptop", "category": "Electronics", "price": 1000, "qty": 1},
        {"product": "Book", "category": "Books", "price": 25, "qty": 2},
        {"product": "Phone", "category": "Electronics", "price": 500, "qty": 1},
    ]
    rev = revenue_by_category(orders)
    assert rev["Electronics"] == 1500
    assert rev["Books"] == 50
    print("[PASS] Test 15.1 Passed: revenue_by_category")

    # Test 15.2
    logs = [
        {"timestamp": "2024-01-01 10:00", "level": "INFO", "message": "Started"},
        {"timestamp": "2024-01-01 10:05", "level": "ERROR", "message": "DB failed"},
        {"timestamp": "2024-01-01 10:10", "level": "INFO", "message": "Retrying"},
        {"timestamp": "2024-01-01 10:15", "level": "ERROR", "message": "DB timeout"},
    ]
    summary = analyze_logs(logs)
    assert summary["counts"]["ERROR"] == 2
    assert summary["last_error"] == "DB timeout"
    print("[PASS] Test 15.2 Passed: analyze_logs")

    # Test 15.3
    users = [
        {"name": "Bob", "email": "BOB@test.com"},
        {"name": "Alice", "email": "alice@test.com"},
        {"name": "Charlie"},  # missing email
        {"name": "Bob Dup", "email": "bob@test.com"},  # duplicate email
    ]
    cleaned = clean_user_data(users)
    assert len(cleaned) == 2
    assert cleaned[0]["name"] == "Alice"
    print("[PASS] Test 15.3 Passed: clean_user_data")

    print("\n*** ALL TASK 15 TESTS PASSED! ***")

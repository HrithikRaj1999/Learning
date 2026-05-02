"""
==============================================================================
  TASK 15: Data Pipeline (Transform, Aggregate, Clean)
==============================================================================

REAL-WORLD CONTEXT:
Data pipelines are the BACKBONE of analytics. Every company needs:
  - Revenue reports (aggregated by category, time period)
  - Log analysis (error rates, patterns, alerting)
  - Data cleaning (deduplicate, normalize, fill missing values)

These are the problems data engineers and backend developers solve DAILY.
"""

from collections import Counter
from datetime import datetime


# SCENARIO: Finance dashboard shows revenue per product category.
# Raw data: individual order items. Need: total revenue grouped by category.
# Revenue = price × quantity for each item, summed per category.
# YOUR FIX: Group orders by category and sum revenue (price * qty).
# EXPECTED: revenue_by_category([{"category": "Electronics", "price": 1000, "qty": 1},...]) → {"Electronics": 1500}
def revenue_by_category(orders):
    pass


# SCENARIO: On-call engineer needs a quick summary of the last hour's logs:
# How many INFO vs ERROR? What was the last error? Time range covered?
# YOUR FIX: Count log levels, find last error message, compute time range.
# EXPECTED: analyze_logs(logs) → {"counts": {"ERROR": 2, "INFO": 2}, "last_error": "DB timeout"}
def analyze_logs(logs):
    pass


# SCENARIO: User import from external system has problems:
# - Missing emails (can't create account without email)
# - Duplicate emails (same person registered twice)
# - Inconsistent case ("BOB@test.com" and "bob@test.com" are the same person)
# YOUR FIX: Remove users with missing/duplicate emails, normalize email case, sort by name.
# EXPECTED: clean_user_data(dirty_users) → deduplicated, normalized, sorted list
def clean_user_data(users):
    pass

if __name__ == "__main__":
    orders = [
        {"product": "Laptop", "category": "Electronics", "price": 1000, "qty": 1},
        {"product": "Book", "category": "Books", "price": 25, "qty": 2},
        {"product": "Phone", "category": "Electronics", "price": 500, "qty": 1},
    ]
    rev = revenue_by_category(orders)
    assert rev["Electronics"] == 1500
    assert rev["Books"] == 50
    print("[PASS] Test 15.1 Passed: revenue_by_category")

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

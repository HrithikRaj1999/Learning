"""
==============================================================================
  TASK 27: Migrations & Query Optimization
==============================================================================

REAL-WORLD CONTEXT:
In production, you CAN'T just drop and recreate tables. You need MIGRATIONS:
  - Add a column to an existing table with 10 million rows
  - Rename a column without breaking the app
  - Roll back a bad change

Also: without INDEXES, queries on large tables scan EVERY row (slow).
With indexes: instant lookup (like a book's index vs reading every page).

SCENARIO 1 — Migrations:
  Your app goes from v1 (users: name, email) to v2 (users: name, email, phone).
  Alembic generates: "ALTER TABLE users ADD COLUMN phone VARCHAR(20)".
  If something breaks: alembic downgrade -1 (rollback).

SCENARIO 2 — Indexes:
  Table has 1,000,000 rows. SELECT WHERE email = 'alice@test.com':
  - Without index: scans all 1M rows (2 seconds)
  - With index: finds it instantly (0.001 seconds)

BUILD:
  1. demonstrate_index_performance() — create table with/without index,
     measure query time difference on 100K+ rows
  2. Document: What is Alembic? What commands do you use?
     - alembic init migrations
     - alembic revision --autogenerate -m "add phone column"
     - alembic upgrade head
     - alembic downgrade -1
"""

import sqlite3
import time


# SCENARIO: Prove that indexes make queries faster.
# Create a table with 100K rows. Query WITHOUT index (slow). Add index. Query again (fast).
# Print the time difference to demonstrate the improvement.
# YOUR FIX: INSERT 100K rows, time a WHERE query, add index, time again, compare.
# EXPECTED: "Without index: 0.5s | With index: 0.001s | 500x faster"
def demonstrate_index_performance():
    pass

if __name__ == "__main__":
    print("This task is research + coding. Focus on understanding:")
    print("1. Why migrations matter in production")
    print("2. How N+1 queries kill performance")
    print("3. How indexes speed up queries")
    print()
    print("Run: demonstrate_index_performance() to see the difference!")

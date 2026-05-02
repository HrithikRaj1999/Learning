"""
==============================================================================
  TASK 24: SQLite CRUD Operations
==============================================================================

REAL-WORLD CONTEXT:
CRUD = Create, Read, Update, Delete. EVERY app with data needs these.
SQLite is perfect for: local apps, prototypes, testing, mobile apps.
These are the EXACT operations you'll build for any database-backed feature.

SCENARIOS COVERED:
  - Create table (setting up a new feature's data storage)
  - Insert user (user registration/signup)
  - Get user by ID (profile page, authentication)
  - Get all users (admin panel listing)
  - Update user (edit profile, change settings)
  - Delete user (account deletion, GDPR compliance)
  - Search with filters (find users by age range, name search)
"""

import sqlite3
import os


# SCENARIO: New feature needs a users table. Create it with proper schema:
# id (auto-increment), name, email (unique), age. Table shouldn't crash if already exists.
# YOUR FIX: CREATE TABLE IF NOT EXISTS with proper column types and constraints.
# EXPECTED: create_users_table("app.db") → table exists, no error on repeat calls
def create_users_table(db_path):
    pass


# SCENARIO: User clicks "Sign Up" → insert their data into the database.
# Return the new user's ID so you can redirect to their profile page.
# YOUR FIX: INSERT row, return the auto-generated ID.
# EXPECTED: insert_user(db, "Alice", "alice@test.com", 25) → 1 (the new row ID)
def insert_user(db_path, name, email, age):
    pass


# SCENARIO: User visits /profile/5 → fetch user with id=5 from database.
# Return None if user doesn't exist (for 404 page handling).
# YOUR FIX: SELECT by ID, return dict or None.
# EXPECTED: get_user(db, 1) → {"id": 1, "name": "Alice", ...} or None
def get_user(db_path, user_id):
    pass


# SCENARIO: Admin panel shows all users. Fetch the complete list.
# YOUR FIX: SELECT all rows, return list of dicts.
# EXPECTED: get_all_users(db) → [{"id": 1, ...}, {"id": 2, ...}]
def get_all_users(db_path):
    pass


# SCENARIO: User clicks "Edit Profile" and changes their age. Update ONLY
# the fields they changed (not overwrite everything).
# YOUR FIX: UPDATE with dynamic fields from **kwargs.
# EXPECTED: update_user(db, 1, age=26) → only age changes, name stays the same
def update_user(db_path, user_id, **kwargs):
    pass


# SCENARIO: User requests account deletion (GDPR "right to be forgotten").
# Remove their record completely from the database.
# YOUR FIX: DELETE by ID.
# EXPECTED: delete_user(db, 3) → user 3 gone; get_user(db, 3) → None
def delete_user(db_path, user_id):
    pass


# SCENARIO: Admin needs to find users matching criteria: age 25-35, name contains "Al".
# Filters are optional (any combination should work).
# YOUR FIX: Build dynamic WHERE clause based on provided filters.
# EXPECTED: search_users(db, min_age=26) → all users age >= 26
def search_users(db_path, min_age=None, max_age=None, name_contains=None):
    pass

if __name__ == "__main__":
    db = "_test_users.db"

    if os.path.exists(db):
        os.remove(db)

    create_users_table(db)
    print("[PASS] Test 24.1 Passed: create_users_table")

    id1 = insert_user(db, "Alice", "alice@test.com", 25)
    id2 = insert_user(db, "Bob", "bob@test.com", 30)
    id3 = insert_user(db, "Charlie", "charlie@test.com", 22)

    user = get_user(db, id1)
    assert user["name"] == "Alice"
    assert user["email"] == "alice@test.com"

    all_users = get_all_users(db)
    assert len(all_users) == 3

    update_user(db, id1, age=26)
    updated = get_user(db, id1)
    assert updated["age"] == 26

    delete_user(db, id3)
    assert get_user(db, id3) is None
    print("[PASS] Test 24.2 Passed: CRUD operations")

    results = search_users(db, min_age=26)
    assert len(results) == 2  # Alice(26) and Bob(30)
    print("[PASS] Test 24.3 Passed: search_users")

    os.remove(db)
    print("\n*** ALL TASK 24 TESTS PASSED! ***")

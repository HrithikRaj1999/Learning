"""
================================================================
   TASK 24: SQLite CRUD Operations                ***      
================================================================

INSTRUCTIONS:
SQLite comes built-in with Python. Perfect for learning SQL basics.
Every web framework talks to databases this way underneath.

CONCEPTS: sqlite3, CREATE TABLE, INSERT, SELECT, UPDATE, DELETE, parameterized queries
IMPORTANT: Always use parameterized queries (?) to prevent SQL injection!
"""

import sqlite3
import os


# ----- Challenge 24.1 -----
# Create a function that sets up a "users" table with columns:
# id (INTEGER PRIMARY KEY AUTOINCREMENT), name (TEXT NOT NULL),
# email (TEXT UNIQUE NOT NULL), age (INTEGER)
def create_users_table(db_path):
    pass  # YOUR CODE HERE


# ----- Challenge 24.2 -----
# Create CRUD functions:
# - insert_user(db_path, name, email, age) -> returns the new user's id
# - get_user(db_path, user_id) -> returns dict or None
# - get_all_users(db_path) -> returns list of dicts
# - update_user(db_path, user_id, **kwargs) -> updates given fields
# - delete_user(db_path, user_id) -> returns True if deleted

def insert_user(db_path, name, email, age):
    pass  # YOUR CODE HERE

def get_user(db_path, user_id):
    pass  # YOUR CODE HERE

def get_all_users(db_path):
    pass  # YOUR CODE HERE

def update_user(db_path, user_id, **kwargs):
    pass  # YOUR CODE HERE

def delete_user(db_path, user_id):
    pass  # YOUR CODE HERE


# ----- Challenge 24.3 -----
# Create a search function that supports filtering:
# search_users(db_path, min_age=None, max_age=None, name_contains=None)
def search_users(db_path, min_age=None, max_age=None, name_contains=None):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    db = "_test_users.db"

    # Cleanup
    if os.path.exists(db):
        os.remove(db)

    # Test 24.1
    create_users_table(db)
    print("[PASS] Test 24.1 Passed: create_users_table")

    # Test 24.2
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

    # Test 24.3
    results = search_users(db, min_age=26)
    assert len(results) == 2  # Alice(26) and Bob(30)
    print("[PASS] Test 24.3 Passed: search_users")

    # Cleanup
    os.remove(db)
    print("\n*** ALL TASK 24 TESTS PASSED! ***")

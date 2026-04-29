"""
================================================================
   TASK 25: SQLAlchemy ORM Basics                 ***      
================================================================

INSTRUCTIONS:
ORMs let you work with databases using Python classes instead of raw SQL.
Django ORM and SQLAlchemy are the two most popular. Learn SQLAlchemy.

SETUP: pip install sqlalchemy
CONCEPTS: Engine, Session, Model, Column types, query, filter
"""

# ----- Challenge 25.1 -----
# Define a User model with SQLAlchemy:
# - id: Integer, primary key, autoincrement
# - username: String(50), unique, not null
# - email: String(100), unique, not null
# - created_at: DateTime, default=now
# - is_active: Boolean, default=True

# YOUR CODE HERE -- define the model using SQLAlchemy declarative base


# ----- Challenge 25.2 -----
# Write functions using SQLAlchemy session:
# - create_user(session, username, email) -> returns User object
# - get_user_by_username(session, username) -> returns User or None
# - get_active_users(session) -> returns list of active Users
# - deactivate_user(session, username) -> sets is_active=False

# YOUR CODE HERE


# ----- Challenge 25.3 -----
# Write a function that demonstrates transactions:
# - bulk_create_users(session, users_data) -> creates multiple users
#   If any user fails (e.g., duplicate email), roll back ALL inserts.
#   users_data = [{"username": "alice", "email": "a@test.com"}, ...]

# YOUR CODE HERE


# =========== INSTRUCTIONS TO RUN ===========
if __name__ == "__main__":
    print("SETUP: pip install sqlalchemy")
    print()
    print("Steps:")
    print("1. Import and set up SQLAlchemy (Engine, Base, Session)")
    print("2. Define the User model")
    print("3. Create the table: Base.metadata.create_all(engine)")
    print("4. Test your CRUD functions")
    print("5. Test transaction rollback")
    print()
    print("Hint: Use 'sqlite:///test.db' as your database URL for testing")
    print()
    print("=== Once your code works, the tests below should pass ===")

    # Uncomment and complete after writing your code:
    # from sqlalchemy import create_engine
    # from sqlalchemy.orm import sessionmaker
    #
    # engine = create_engine('sqlite:///:memory:')
    # Base.metadata.create_all(engine)
    # Session = sessionmaker(bind=engine)
    # session = Session()
    #
    # user = create_user(session, "alice", "alice@test.com")
    # assert user.username == "alice"
    # print("[PASS] Test 25.1 Passed: User model")
    #
    # found = get_user_by_username(session, "alice")
    # assert found is not None
    # print("[PASS] Test 25.2 Passed: CRUD operations")
    #
    # print("\n*** ALL TASK 25 TESTS PASSED! ***")

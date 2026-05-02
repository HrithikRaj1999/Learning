"""
==============================================================================
  TASK 25: SQLAlchemy Basics (ORM)
==============================================================================

REAL-WORLD CONTEXT:
Raw SQL is fine for simple queries, but becomes unmanageable for complex apps.
SQLAlchemy ORM lets you work with Python objects instead of SQL strings:
  - User(name="Alice") instead of "INSERT INTO users (name) VALUES ('Alice')"
  - user.posts instead of JOIN queries
  - Automatic SQL injection protection
  - Database-agnostic (switch from SQLite to PostgreSQL without rewriting)

SCENARIO: Convert the raw SQLite CRUD from Task 24 into SQLAlchemy ORM.
Same operations, but using Python classes and sessions instead of raw SQL.

STEPS TO BUILD:
  1. Create Engine and Base (connection setup)
  2. Define User model class (maps to users table)
  3. Create all tables from models
  4. CRUD operations using Session (add, query, update, delete)
  5. Transaction handling (commit on success, rollback on error)

EXPECTED BEHAVIOR:
  session.add(User(name="Alice", email="alice@test.com"))
  session.commit()  → saved to database
  user = session.query(User).filter_by(name="Alice").first()  → User object
  user.age = 26; session.commit()  → updated in database
"""

# SETUP: pip install sqlalchemy
# Use 'sqlite:///test.db' as your database URL for testing

# BUILD:
# 1. Import and set up SQLAlchemy (Engine, Base, Session)
# 2. Define the User model (id, name, email, age)
# 3. Create the table: Base.metadata.create_all(engine)
# 4. Implement CRUD functions using Session
# 5. Test transaction rollback (what happens when commit fails?)

"""
================================================================
   TASK 27: Migrations & Query Optimization       ****    
================================================================

INSTRUCTIONS:
In production, you can't just drop and recreate tables.
Learn Alembic for migrations and optimize slow queries.

SETUP: pip install sqlalchemy alembic
CONCEPTS: Alembic, indexes, N+1 problem, eager loading, raw SQL
"""


# ----- Challenge 27.1 -----
# Research and document (in comments below):
# 1. What is a database migration?
# 2. How does Alembic work with SQLAlchemy?
# 3. What are the basic Alembic commands?

"""
YOUR NOTES HERE:
1. Database migration: ...
2. Alembic: ...
3. Commands: ...
"""


# ----- Challenge 27.2 -----
# Write a function that demonstrates the N+1 query problem
# and then fix it with eager loading (joinedload).
#
# BAD (N+1):
#   authors = session.query(Author).all()
#   for author in authors:
#       print(author.posts)  # This triggers a new query for EACH author!
#
# GOOD (Eager loading):
#   from sqlalchemy.orm import joinedload
#   authors = session.query(Author).options(joinedload(Author.posts)).all()

# Write both versions and explain the difference in comments.

# YOUR CODE HERE


# ----- Challenge 27.3 -----
# Create an index on frequently queried columns.
# Write a function that:
# 1. Creates a table with an index on the "email" column
# 2. Inserts 10000 rows
# 3. Times a query WITH index vs WITHOUT index
# Hint: Use sqlite3 for simplicity

import sqlite3
import time

def demonstrate_index_performance():
    pass  # YOUR CODE HERE


# =========== INSTRUCTIONS TO RUN ===========
if __name__ == "__main__":
    print("This task is research + coding. Focus on understanding:")
    print("1. Why migrations matter in production")
    print("2. How N+1 queries kill performance")
    print("3. How indexes speed up queries")
    print()
    print("Run: demonstrate_index_performance() to see the difference!")

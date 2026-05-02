"""
==============================================================================
  TASK 26: SQLAlchemy Relationships (One-to-Many, Many-to-Many)
==============================================================================

REAL-WORLD CONTEXT:
Real databases have RELATIONSHIPS between tables:
  - One Author has Many Posts (one-to-many)
  - One Post has Many Comments (one-to-many)
  - Many Students take Many Courses (many-to-many, needs join table)

SCENARIO: Build a blog system:
  - Author → has many Posts
  - Post → has many Comments
  - Student ←→ Course (many-to-many via enrollment table)

WHAT'S WRONG (without relationships):
  - Manual JOIN queries everywhere
  - No referential integrity (orphaned posts when author deleted)
  - Can't do author.posts (have to write separate query each time)

YOUR FIX: SQLAlchemy relationship() with proper foreign keys.

EXPECTED BEHAVIOR:
  author = Author(name="Alice")
  author.posts.append(Post(title="First Post"))
  session.commit()
  author.posts  → [Post(title="First Post")]  # navigable!
  post.author   → Author(name="Alice")         # reverse navigation!

BUILD:
  1. Author model with posts relationship
  2. Post model with comments relationship + author_id FK
  3. Comment model with post_id FK
  4. Student and Course models with many-to-many via enrollment table
  5. Test: create data, navigate relationships both directions
"""

# SETUP: pip install sqlalchemy
# This task is more open-ended -- focus on understanding relationships!

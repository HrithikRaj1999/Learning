"""
================================================================
   TASK 26: Database Relationships                ****    
================================================================

INSTRUCTIONS:
Real databases have relationships. Users have Posts. Posts have Comments.
Orders have Products. Master One-to-Many and Many-to-Many.

SETUP: pip install sqlalchemy
CONCEPTS: ForeignKey, relationship, backref, one-to-many, many-to-many
"""


# ----- Challenge 26.1 -----
# Create models for a blog system:
# Author (id, name, email)
#   |-- Post (id, title, content, author_id -> FK to Author, created_at)
#       |-- Comment (id, text, post_id -> FK to Post, commenter_name)
#
# Set up relationships so you can do:
#   author.posts -> list of posts
#   post.author -> the author
#   post.comments -> list of comments

# YOUR MODELS HERE


# ----- Challenge 26.2 -----
# Create models for a school system with Many-to-Many:
# Student (id, name)
# Course (id, title, credits)
# enrollment table (student_id, course_id, grade)
#
# student.courses -> list of courses
# course.students -> list of students

# YOUR MODELS HERE


# ----- Challenge 26.3 -----
# Write query functions:
# - get_author_with_posts(session, author_id) -> author with eager-loaded posts
# - get_posts_with_comments(session) -> all posts with their comments
# - get_student_courses(session, student_id) -> all courses for a student

# YOUR CODE HERE


# =========== INSTRUCTIONS TO RUN ===========
if __name__ == "__main__":
    print("SETUP: pip install sqlalchemy")
    print()
    print("Build the models above, then test:")
    print("1. Create an Author with multiple Posts")
    print("2. Add Comments to Posts")
    print("3. Create Students and Courses with enrollments")
    print("4. Query relationships and verify navigation works")
    print()
    print("This task is more open-ended -- focus on understanding relationships!")

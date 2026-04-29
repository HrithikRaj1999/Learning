"""
================================================================
   TASK 32: Flask + SQLAlchemy CRUD App           ****    
================================================================

SETUP: pip install flask flask-sqlalchemy
RUN:   python task_32_flask_sqlalchemy.py

INSTRUCTIONS:
Combine everything! Build a complete web app with a real database.
This is a mini fullstack project.

PROJECT: Book Library API
- CRUD for books (title, author, isbn, published_year, genre)
- Search and filter
- Pagination
"""

from flask import Flask, jsonify, request
# from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db = SQLAlchemy(app)


# ----- Challenge 32.1 -----
# Define a Book model with fields:
# id, title, author, isbn (unique), published_year, genre, created_at

# class Book(db.Model):
#     pass  # YOUR CODE HERE


# ----- Challenge 32.2 -----
# Implement these endpoints:
# GET    /api/books              -> List all books (with pagination: ?page=1&per_page=10)
# POST   /api/books              -> Create a book
# GET    /api/books/<id>         -> Get one book
# PUT    /api/books/<id>         -> Update a book
# DELETE /api/books/<id>         -> Delete a book
# GET    /api/books/search?q=    -> Search by title or author

# YOUR CODE HERE


# ----- Challenge 32.3 -----
# Add input validation:
# - title is required and max 200 chars
# - isbn must be unique
# - published_year must be a valid year
# Return proper error messages with 400 status

# YOUR CODE HERE


# ----- Challenge 32.4 -----
# Add a /api/stats endpoint that returns:
# - Total books count
# - Books per genre (dict)
# - Most recent book added

# YOUR CODE HERE


# =========== RUN ===========
if __name__ == "__main__":
    # Uncomment after setting up:
    # with app.app_context():
    #     db.create_all()
    print(">> Library API at http://localhost:5000")
    print("Uncomment the SQLAlchemy code and implement the endpoints!")
    # app.run(debug=True)

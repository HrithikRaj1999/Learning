"""
==============================================================================
  TASK 32: Flask + SQLAlchemy (Database-Backed API)
==============================================================================

REAL-WORLD CONTEXT:
Combining Flask + SQLAlchemy = a real production API backend. Instead of
storing data in a Python list (lost on restart), persist it in a database.

SCENARIO: Build a Library API:
  - Books table (id, title, author, isbn, published_year)
  - CRUD endpoints for books
  - Search by author or title
  - Proper error handling (404, 400)

This combines: Flask routing + SQLAlchemy ORM + proper REST conventions.

EXPECTED BEHAVIOR:
  POST /api/books {"title": "Python Crash Course", "author": "Eric Matthes"}
  → 201 {"id": 1, "title": "Python Crash Course", ...}
  GET /api/books?author=Matthes → 200 [books by that author]
  GET /api/books/1 → 200 {full book object}
  Data persists across server restarts (stored in SQLite file)
"""

from flask import Flask, jsonify, request

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# BUILD: Set up SQLAlchemy, define Book model, implement CRUD endpoints

if __name__ == "__main__":
    print(">> Library API at http://localhost:5000")
    print("Uncomment the SQLAlchemy code and implement the endpoints!")

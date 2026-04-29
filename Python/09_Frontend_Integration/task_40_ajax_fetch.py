"""
================================================================
   TASK 40: AJAX & Fetch API with Flask/Django    ***      
================================================================

INSTRUCTIONS:
Connect your frontend to your backend using AJAX calls.

SETUP: pip install flask flask-cors
CONCEPTS: fetch API, CORS, async/await, JSON endpoints
"""

from flask import Flask, jsonify, request, render_template_string
# from flask_cors import CORS  # Uncomment after installing

app = Flask(__name__)
# CORS(app)  # Enable Cross-Origin requests

# Sample data
books = [
    {"id": 1, "title": "Python Crash Course", "author": "Eric Matthes", "rating": 4.5},
    {"id": 2, "title": "Fluent Python", "author": "Luciano Ramalho", "rating": 4.8},
    {"id": 3, "title": "Django for Beginners", "author": "William Vincent", "rating": 4.3},
]

# ----- Challenge 40.1 -----
# Create a /api/books endpoint and a frontend page that:
# - Fetches books via AJAX on page load
# - Displays them in a styled table
# - Has a search input that filters in real-time (client-side)

# Backend endpoint:
@app.route('/api/books')
def get_books():
    query = request.args.get('q', '').lower()
    if query:
        filtered = [b for b in books if query in b['title'].lower() or query in b['author'].lower()]
        return jsonify(filtered)
    return jsonify(books)

# Frontend page (you can also create a separate HTML file):
@app.route('/')
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head><title>Book Search</title></head>
    <body>
        <h1>[Books] Book Search</h1>
        <input type="text" id="search" placeholder="Search books..." oninput="searchBooks()">
        <div id="results"></div>

        <script>
        // CHALLENGE: Complete this JavaScript
        // 1. Fetch books from /api/books on page load
        // 2. Implement searchBooks() to filter via API
        // 3. Display results as cards/table

        async function loadBooks() {
            // YOUR CODE HERE
        }

        async function searchBooks() {
            // YOUR CODE HERE
        }

        // Load books on page load
        loadBooks();
        </script>
    </body>
    </html>
    """)


# ----- Challenge 40.2 -----
# Add a form to create new books via AJAX POST:
# - Form with title, author, rating fields
# - Submit via fetch() POST request
# - Add new book to the list without page reload
# - Show success/error message

@app.route('/api/books', methods=['POST'])
def create_book():
    pass  # YOUR CODE HERE


# ----- Challenge 40.3 -----
# Add inline editing -- click a book to edit it:
# - PUT /api/books/<id> to update
# - DELETE /api/books/<id> to delete
# - Update the UI without page reload

# YOUR CODE HERE


if __name__ == "__main__":
    app.run(debug=True)

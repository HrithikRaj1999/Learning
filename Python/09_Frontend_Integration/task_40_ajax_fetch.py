"""
==============================================================================
  TASK 40: AJAX & Fetch API (Frontend → Backend Communication)
==============================================================================

REAL-WORLD CONTEXT:
Modern web apps don't reload the full page. They use AJAX/Fetch to:
  - Search books as you type (no page reload)
  - Submit forms without navigation
  - Load more content on scroll
  - Real-time updates (polling)

SCENARIO: Flask backend serves a book API + a search page.
  - User types in search box → JavaScript calls /api/books?q=python
  - Results appear INSTANTLY below (no page reload)
  - This is how Google search suggestions work.

WHAT'S HAPPENING:
  1. Flask serves HTML page with JavaScript
  2. JavaScript listens to input events
  3. On each keystroke: fetch('/api/books?q=...')
  4. Response JSON rendered into HTML dynamically
"""

from flask import Flask, jsonify, request, render_template_string

app = Flask(__name__)

books = [
    {"id": 1, "title": "Python Crash Course", "author": "Eric Matthes", "rating": 4.5},
    {"id": 2, "title": "Fluent Python", "author": "Luciano Ramalho", "rating": 4.8},
    {"id": 3, "title": "Django for Beginners", "author": "William Vincent", "rating": 4.3},
]

@app.route('/api/books')
def get_books():
    query = request.args.get('q', '').lower()
    if query:
        filtered = [b for b in books if query in b['title'].lower() or query in b['author'].lower()]
        return jsonify(filtered)
    return jsonify(books)

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

        async function loadBooks() {
        }

        async function searchBooks() {
        }
        loadBooks();
        </script>
    </body>
    </html>
    """)

@app.route('/api/books', methods=['POST'])
def create_book():
    pass

if __name__ == "__main__":
    app.run(debug=True)

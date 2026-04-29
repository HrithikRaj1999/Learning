"""
================================================================
   TASK 41: HTMX -- Modern Frontend without JS     ****   
================================================================

INSTRUCTIONS:
HTMX lets you build dynamic UIs by returning HTML from server instead of JSON.
No JavaScript frameworks needed! Perfect for Python fullstack devs.

SETUP: pip install flask
CDN: <script src="https://unpkg.com/htmx.org@1.9.10"></script>
CONCEPTS: hx-get, hx-post, hx-swap, hx-trigger, hx-target
"""

# =========== CHALLENGES ===========

"""
CHALLENGE 41.1 -- Live Search with HTMX
Create a search input that:
- Sends a request on every keystroke (hx-trigger="keyup changed delay:300ms")
- Returns HTML fragment of matching results
- Swaps into a results div (hx-target="#results" hx-swap="innerHTML")

  <input type="text" name="q"
         hx-get="/search"
         hx-trigger="keyup changed delay:300ms"
         hx-target="#results">
  <div id="results"></div>

Server returns HTML, not JSON!


CHALLENGE 41.2 -- Infinite Scroll
Create a page that:
- Loads 10 items initially
- When user scrolls to bottom, loads 10 more (hx-trigger="revealed")
- Server returns HTML fragments for new items


CHALLENGE 41.3 -- Inline Edit
Create a table where:
- Clicking "Edit" on a row replaces it with a form (hx-get returns form HTML)
- Submitting the form saves and returns the updated row HTML
- No page reload at all!


CHALLENGE 41.4 -- Delete with Confirmation
Create delete buttons that:
- First click shows "Are you sure?" (hx-confirm)
- Confirms -> sends DELETE request
- Removes the element with a fade animation (hx-swap="outerHTML swap:1s")
"""

# =========== FLASK BACKEND EXAMPLE ===========

from flask import Flask, request, render_template_string

app = Flask(__name__)

contacts = [
    {"id": 1, "name": "Alice", "email": "alice@test.com"},
    {"id": 2, "name": "Bob", "email": "bob@test.com"},
    {"id": 3, "name": "Charlie", "email": "charlie@test.com"},
]

@app.route('/')
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>HTMX Contacts</title>
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
    </head>
    <body>
        <h1>Contacts</h1>
        <input type="text" name="q"
               hx-get="/search"
               hx-trigger="keyup changed delay:300ms"
               hx-target="#contact-list"
               placeholder="Search contacts...">
        <div id="contact-list">
            <!-- CHALLENGE: Render contacts here -->
            <!-- CHALLENGE: Add edit/delete with HTMX -->
        </div>
    </body>
    </html>
    """)

@app.route('/search')
def search():
    q = request.args.get('q', '').lower()
    filtered = [c for c in contacts if q in c['name'].lower() or q in c['email'].lower()]
    # CHALLENGE: Return HTML fragment, not JSON!
    html = ""
    for c in filtered:
        html += f"<div><strong>{c['name']}</strong> -- {c['email']}</div>"
    return html


if __name__ == "__main__":
    app.run(debug=True)

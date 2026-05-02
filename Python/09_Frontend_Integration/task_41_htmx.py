"""
==============================================================================
  TASK 41: HTMX (Modern Server-Side Interactivity)
==============================================================================

REAL-WORLD CONTEXT:
HTMX lets you build interactive UIs WITHOUT writing JavaScript.
Server returns HTML fragments, HTMX swaps them into the page.
  - No React/Vue needed for simple interactivity
  - No JSON serialization/deserialization
  - Server renders HTML (Python templates) → sent to browser

SCENARIO: Add interactivity to the blog WITHOUT a JavaScript framework:

  41.1 — Live Search:
    User types → server returns matching posts as HTML → swapped in.
    (Like Google instant search, but server-rendered)

  41.2 — Infinite Scroll:
    User scrolls to bottom → next 10 items load automatically.
    (Like Twitter/Instagram feed)

  41.3 — Inline Edit:
    Click "Edit" on table row → row becomes a form → submit → row updates.
    (No page navigation, no modal, just in-place editing)

  41.4 — Delete with Confirmation:
    Click "Delete" → browser confirm dialog → item removed from DOM.

WHY HTMX MATTERS:
  Perfect for Python developers who don't want to learn React.
  Used by: many Django/Flask apps, startups shipping fast.
"""

# CHALLENGE 41.1 -- Live Search with HTMX
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
    html = ""
    for c in filtered:
        html += f"<div><strong>{c['name']}</strong> -- {c['email']}</div>"
    return html

if __name__ == "__main__":
    app.run(debug=True)

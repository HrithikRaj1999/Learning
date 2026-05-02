"""
==============================================================================
  TASK 29: Flask Templates (Jinja2)
==============================================================================

REAL-WORLD CONTEXT:
APIs return JSON. But WEBSITES return HTML pages. Flask uses Jinja2 templates:
  - Separate HTML structure from Python logic
  - Dynamic content: show user's name, loop over products, conditionally show buttons
  - Template inheritance: all pages share a header/footer (base.html)

SCENARIO: Build a simple website:
  1. Base template with header/footer (all pages inherit from it)
  2. Home page with a welcome message
  3. Products page listing items from a Python list
  4. User profile page showing dynamic user data

WHAT TO BUILD:
  templates/
    base.html       → {% block content %}{% endblock %}
    home.html       → {% extends 'base.html' %} + welcome text
    products.html   → {% for product in products %} loop
    profile.html    → {{ user.name }} dynamic data

EXPECTED BEHAVIOR:
  GET / → renders home.html with "Welcome to our store!"
  GET /products → renders list of products from Python data
  GET /profile/alice → renders alice's profile page
"""

from flask import Flask, render_template, request

app = Flask(__name__)

# BUILD: Add routes that render templates with dynamic data

if __name__ == "__main__":
    print(">> Create the templates/ folder and HTML files first!")
    print("Then run this app and test in your browser.")
    app.run(debug=True)

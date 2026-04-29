"""
================================================================
   TASK 29: Templates & Static Files (Jinja2)     ***      
================================================================

SETUP: pip install flask
RUN:   python task_29_templates.py

INSTRUCTIONS:
Fullstack means serving HTML too! Learn Jinja2 templating.
Create the template files in a "templates/" folder next to this file.

CONCEPTS: render_template, Jinja2 syntax, template inheritance, loops, conditions
"""

from flask import Flask, render_template, request

app = Flask(__name__)


# ----- Challenge 29.1 -----
# Create a template "templates/base.html" with:
# - HTML boilerplate
# - A {% block title %} and {% block content %}
# - A simple navigation bar

# Create a template "templates/index.html" that extends base.html
# and shows a welcome message

# Create a route "/" that renders index.html
# YOUR CODE HERE


# ----- Challenge 29.2 -----
# Create a template "templates/users.html" that:
# - Extends base.html
# - Displays a list of users in a table
# - Uses {% for %} loop and {% if %} conditions
# - Highlights users with age > 30 in a different color

# Create a route "/users" that passes a list of user dicts to the template
# YOUR CODE HERE


# ----- Challenge 29.3 -----
# Create a template "templates/profile.html" with:
# - Uses Jinja2 filters: |capitalize, |length, |default
# - Shows a user profile card

# Create a route "/profile/<username>" that renders profile.html
# YOUR CODE HERE


# =========== TEMPLATE EXAMPLES ===========
"""
Create these files manually:

--- templates/base.html ---
<!DOCTYPE html>
<html>
<head><title>{% block title %}My App{% endblock %}</title></head>
<body>
  <nav><a href="/">Home</a> | <a href="/users">Users</a></nav>
  <hr>
  {% block content %}{% endblock %}
</body>
</html>

--- templates/index.html ---
{% extends "base.html" %}
{% block title %}Home{% endblock %}
{% block content %}
  <h1>Welcome to my Flask App!</h1>
{% endblock %}

Now create users.html and profile.html yourself!
"""

if __name__ == "__main__":
    print(">> Create the templates/ folder and HTML files first!")
    print("Then run this app and test in your browser.")
    app.run(debug=True)

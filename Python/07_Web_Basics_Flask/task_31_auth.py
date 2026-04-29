"""
================================================================
   TASK 31: Authentication & Sessions             ****    
================================================================

SETUP: pip install flask flask-login
RUN:   python task_31_auth.py

INSTRUCTIONS:
Every app needs authentication. Build a login system with Flask.

CONCEPTS: sessions, cookies, password hashing, login/logout, protected routes
"""

from flask import Flask, request, jsonify, session, redirect, url_for
from functools import wraps
import hashlib
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# Simulated user database
users_db = {}


# ----- Challenge 31.1 -----
# Implement user registration:
# POST /register {"username": "alice", "password": "secret123"}
# - Hash the password (use hashlib.sha256 for learning; use bcrypt in production!)
# - Store user in users_db
# - Return 201 on success, 400 if user exists

# YOUR CODE HERE


# ----- Challenge 31.2 -----
# Implement login:
# POST /login {"username": "alice", "password": "secret123"}
# - Verify credentials
# - Set session["user"] = username
# - Return 200 on success, 401 on failure

# YOUR CODE HERE


# ----- Challenge 31.3 -----
# Create a @login_required decorator:
# - Check if session["user"] exists
# - If not, return 401 {"error": "Login required"}
# - If yes, proceed to the route

def login_required(f):
    pass  # YOUR CODE HERE


# ----- Challenge 31.4 -----
# Create protected routes:
# GET /profile -> returns current user's info (protected)
# POST /logout -> clears session (protected)

# YOUR CODE HERE


# =========== RUN & TEST ===========
if __name__ == "__main__":
    print(">> Auth system running at http://localhost:5000")
    print()
    print("Test flow:")
    print('1. Register: curl -X POST -H "Content-Type: application/json" '
          '-d \'{"username":"alice","password":"secret"}\' http://localhost:5000/register')
    print('2. Login:    curl -X POST -c cookies.txt -H "Content-Type: application/json" '
          '-d \'{"username":"alice","password":"secret"}\' http://localhost:5000/login')
    print('3. Profile:  curl -b cookies.txt http://localhost:5000/profile')
    app.run(debug=True)

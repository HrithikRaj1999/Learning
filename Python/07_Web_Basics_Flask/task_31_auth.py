"""
==============================================================================
  TASK 31: Authentication (Register, Login, Sessions)
==============================================================================

REAL-WORLD CONTEXT:
Almost every app needs authentication. The flow:
  1. User registers (password hashed and stored)
  2. User logs in (password verified, session created)
  3. Protected routes check session (redirect to login if not authenticated)
  4. User logs out (session destroyed)

SCENARIO: Build a complete auth system:
  - POST /register → create user with hashed password
  - POST /login    → verify credentials, create session
  - GET  /profile  → protected route (login_required decorator)
  - POST /logout   → destroy session

SECURITY RULES:
  - NEVER store plain text passwords (use hashlib or bcrypt)
  - Sessions use secret_key for signing (tamper-proof cookies)
  - login_required decorator rejects unauthenticated requests

EXPECTED BEHAVIOR:
  POST /register {"username":"alice","password":"secret"} → 201 "Registered"
  POST /login {"username":"alice","password":"secret"} → 200 + session cookie
  GET /profile (with cookie) → 200 {"username": "alice"}
  GET /profile (no cookie) → 401 "Login required"
"""

from flask import Flask, request, jsonify, session, redirect, url_for
from functools import wraps
import hashlib
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

users_db = {}


# SCENARIO: Protect routes that require authentication.
# If user is not logged in (no session), return 401.
# YOUR FIX: Decorator that checks session before executing route handler.
def login_required(f):
    pass

# BUILD: Add /register, /login, /profile, /logout routes

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

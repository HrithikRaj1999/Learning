"""
==============================================================================
  TASK 28: Flask Basics (Routes, Request, Response)
==============================================================================

REAL-WORLD CONTEXT:
Flask is a micro web framework. It's where you learn HOW the web works:
  - Routes map URLs to Python functions
  - GET requests fetch data (browser visits a page)
  - POST requests send data (form submission, API calls)
  - Query params (?q=python) and path params (/user/5) pass data in URLs

SCENARIO: Build a tiny API with 5 routes:
  1. GET /            → Welcome message (health check)
  2. GET /greet/Alice → "Hello, Alice!" (path parameter)
  3. GET /add/3/5     → {"result": 8} (path params as numbers)
  4. GET /search?q=py → {"query": "py"} (query parameter)
  5. POST /echo       → return whatever JSON body was sent (echo server)

EXPECTED BEHAVIOR:
  GET /greet/Bob → 200 {"message": "Hello, Bob!"}
  GET /add/3/5   → 200 {"result": 8}
  POST /echo with {"data": "hi"} → 200 {"data": "hi"}
"""

from flask import Flask, jsonify, request

app = Flask(__name__)

# BUILD: Add 5 route handlers below (@app.route(...))

if __name__ == "__main__":
    print(">> Starting Flask app at http://localhost:5000")
    print("Test these URLs:")
    print("  GET  http://localhost:5000/")
    print("  GET  http://localhost:5000/greet/YourName")
    print("  GET  http://localhost:5000/add/3/5")
    print("  GET  http://localhost:5000/search?q=python")
    print("  POST http://localhost:5000/echo")
    app.run(debug=True)

"""
==============================================================================
  TASK 30: REST API (Full CRUD with Flask)
==============================================================================

REAL-WORLD CONTEXT:
REST APIs are how frontends talk to backends. The TODO API is the "Hello World"
of backend development. Every job interview asks you to build one.

SCENARIO: Build a complete TODO API:
  - GET    /api/todos     → list all todos
  - POST   /api/todos     → create a new todo
  - GET    /api/todos/1   → get single todo by ID
  - PUT    /api/todos/1   → update a todo (mark complete, change title)
  - DELETE /api/todos/1   → delete a todo

HTTP STATUS CODES (important for APIs):
  - 200: Success
  - 201: Created (after POST)
  - 404: Not Found (bad ID)
  - 400: Bad Request (missing required fields)

EXPECTED BEHAVIOR:
  POST /api/todos {"title": "Buy milk"} → 201 {"id": 1, "title": "Buy milk", "completed": false}
  GET /api/todos → 200 [{"id": 1, ...}]
  PUT /api/todos/1 {"completed": true} → 200 {"id": 1, "completed": true}
  DELETE /api/todos/1 → 200 {"deleted": true}
  GET /api/todos/999 → 404 {"error": "Not found"}
"""

from flask import Flask, jsonify, request, abort

app = Flask(__name__)

todos = []
next_id = 1

# BUILD: Add 5 CRUD route handlers for /api/todos

if __name__ == "__main__":
    print(">> REST API running at http://localhost:5000")
    print()
    print("Test with curl:")
    print('  curl http://localhost:5000/api/todos')
    print('  curl -X POST -H "Content-Type: application/json" -d \'{"title":"Buy milk"}\' http://localhost:5000/api/todos')
    print('  curl http://localhost:5000/api/todos/1')
    print('  curl -X PUT -H "Content-Type: application/json" -d \'{"completed":true}\' http://localhost:5000/api/todos/1')
    print('  curl -X DELETE http://localhost:5000/api/todos/1')
    app.run(debug=True)

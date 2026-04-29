"""
================================================================
   TASK 30: REST API with Flask                   ***      
================================================================

SETUP: pip install flask
RUN:   python task_30_rest_api.py

INSTRUCTIONS:
Build a complete REST API for a Todo app. This is the #1 interview project.

CONCEPTS: REST principles, CRUD endpoints, JSON, status codes, error handling

API Design:
  GET    /api/todos          -> List all todos
  POST   /api/todos          -> Create a todo
  GET    /api/todos/<id>     -> Get one todo
  PUT    /api/todos/<id>     -> Update a todo
  DELETE /api/todos/<id>     -> Delete a todo
"""

from flask import Flask, jsonify, request, abort

app = Flask(__name__)

# In-memory storage (replace with database later)
todos = []
next_id = 1


# ----- Challenge 30.1 -----
# Implement GET /api/todos -- return all todos
# YOUR CODE HERE


# ----- Challenge 30.2 -----
# Implement POST /api/todos -- create a new todo
# Request body: {"title": "Buy groceries", "completed": false}
# Response: the created todo with id, status 201
# YOUR CODE HERE


# ----- Challenge 30.3 -----
# Implement GET /api/todos/<id> -- get a single todo
# Return 404 if not found
# YOUR CODE HERE


# ----- Challenge 30.4 -----
# Implement PUT /api/todos/<id> -- update a todo
# Return 404 if not found
# YOUR CODE HERE


# ----- Challenge 30.5 -----
# Implement DELETE /api/todos/<id> -- delete a todo
# Return 204 No Content on success
# YOUR CODE HERE


# ----- Challenge 30.6 -----
# Add error handlers:
# - 404 -> {"error": "Not found"}
# - 400 -> {"error": "Bad request"}
# - 500 -> {"error": "Internal server error"}
# YOUR CODE HERE


# =========== RUN & TEST ===========
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

"""
================================================================
   TASK 28: Flask Hello World & Routing           ***      
================================================================

SETUP: pip install flask
RUN:   python task_28_flask_basics.py

INSTRUCTIONS:
Build a Flask app with the following routes. Test in your browser
or with: curl http://localhost:5000/

CONCEPTS: Flask app, routes, URL parameters, HTTP methods, request/response
"""

from flask import Flask, jsonify, request

app = Flask(__name__)


# ----- Challenge 28.1 -----
# Create a route "/" that returns "Hello, World!"
# YOUR CODE HERE


# ----- Challenge 28.2 -----
# Create a route "/greet/<name>" that returns "Hello, {name}!"
# YOUR CODE HERE


# ----- Challenge 28.3 -----
# Create a route "/add/<int:a>/<int:b>" that returns the sum as JSON
# Example: /add/3/5 -> {"result": 8}
# YOUR CODE HERE


# ----- Challenge 28.4 -----
# Create a route "/search" that accepts query parameters
# Example: /search?q=python&limit=10 -> {"query": "python", "limit": 10}
# If no limit provided, default to 10
# YOUR CODE HERE


# ----- Challenge 28.5 -----
# Create a route "/echo" that accepts POST requests
# It should return the JSON body it received, plus a "received": True field
# Example: POST {"message": "hi"} -> {"message": "hi", "received": true}
# YOUR CODE HERE


# =========== RUN THE APP ===========
if __name__ == "__main__":
    print(">> Starting Flask app at http://localhost:5000")
    print("Test these URLs:")
    print("  GET  http://localhost:5000/")
    print("  GET  http://localhost:5000/greet/YourName")
    print("  GET  http://localhost:5000/add/3/5")
    print("  GET  http://localhost:5000/search?q=python")
    print("  POST http://localhost:5000/echo")
    app.run(debug=True)

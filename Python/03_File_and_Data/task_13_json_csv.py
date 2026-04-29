"""
================================================================
   TASK 13: JSON & CSV Processing                 ***      
================================================================

INSTRUCTIONS:
APIs return JSON. Reports use CSV. You'll work with both daily.

CONCEPTS: json module, csv module, DictReader, DictWriter
"""

import json
import csv
from pathlib import Path


# ----- Challenge 13.1 -----
# Load a JSON string, filter items by a condition, return JSON string.
# Input: JSON string of products like [{"name":"A","price":10},{"name":"B","price":25}]
# Return: JSON string of products with price > max_price
def filter_json_products(json_string, max_price):
    pass  # YOUR CODE HERE


# ----- Challenge 13.2 -----
# Read a CSV string (not file) and convert to a list of dicts.
# Input: "name,age,city\nAlice,25,NYC\nBob,30,LA"
# Output: [{"name":"Alice","age":"25","city":"NYC"}, ...]
def csv_to_dicts(csv_string):
    pass  # YOUR CODE HERE


# ----- Challenge 13.3 -----
# Convert a list of dicts to CSV string.
# Input: [{"name":"Alice","age":25},{"name":"Bob","age":30}]
# Output: "name,age\nAlice,25\nBob,30\n"
def dicts_to_csv(data):
    pass  # YOUR CODE HERE


# ----- Challenge 13.4 -----
# Deep merge two JSON objects (nested dicts).
# If both values are dicts, merge recursively.
# Otherwise, second dict's value wins.
# Example: {"a": {"x": 1, "y": 2}}, {"a": {"y": 3, "z": 4}}
# Result:  {"a": {"x": 1, "y": 3, "z": 4}}
def deep_merge(dict1, dict2):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 13.1
    products = '[{"name":"A","price":10},{"name":"B","price":25},{"name":"C","price":5}]'
    result = json.loads(filter_json_products(products, 8))
    assert len(result) == 2
    print("[PASS] Test 13.1 Passed: filter_json_products")

    # Test 13.2
    csv_data = "name,age,city\nAlice,25,NYC\nBob,30,LA"
    result = csv_to_dicts(csv_data)
    assert len(result) == 2
    assert result[0]["name"] == "Alice"
    print("[PASS] Test 13.2 Passed: csv_to_dicts")

    # Test 13.3
    data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]
    csv_result = dicts_to_csv(data)
    assert "name,age" in csv_result
    assert "Alice,25" in csv_result
    print("[PASS] Test 13.3 Passed: dicts_to_csv")

    # Test 13.4
    d1 = {"a": {"x": 1, "y": 2}, "b": 10}
    d2 = {"a": {"y": 3, "z": 4}, "c": 20}
    result = deep_merge(d1, d2)
    assert result == {"a": {"x": 1, "y": 3, "z": 4}, "b": 10, "c": 20}
    print("[PASS] Test 13.4 Passed: deep_merge")

    print("\n*** ALL TASK 13 TESTS PASSED! ***")

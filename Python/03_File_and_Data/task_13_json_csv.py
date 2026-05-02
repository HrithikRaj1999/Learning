"""
==============================================================================
  TASK 13: JSON & CSV Processing
==============================================================================

REAL-WORLD CONTEXT:
JSON = API responses, config files, NoSQL databases.
CSV = spreadsheets, data exports, reporting, bulk imports.
Every backend developer handles these formats DAILY.

SCENARIOS COVERED:
  - Filtering API response data (products under a price threshold)
  - Parsing CSV uploads from users (spreadsheet imports)
  - Generating CSV exports (downloadable reports)
  - Merging nested config files (deep merge without overwriting)
"""

import json
import csv
from pathlib import Path


# SCENARIO: E-commerce API returns all products as JSON. Frontend only wants
# products UNDER a certain price (for a "budget" filter page).
# YOUR FIX: Parse JSON, filter by price, return filtered JSON string.
# EXPECTED: filter_json_products('[{"name":"A","price":10}...]', 8) → only items ≤ price
def filter_json_products(json_string, max_price):
    pass


# SCENARIO: HR uploads a CSV of new employees. Your backend needs to parse it
# into a list of dicts so you can process each row (validate, save to DB).
# YOUR FIX: Parse CSV string into list of dictionaries (header row = keys).
# EXPECTED: csv_to_dicts("name,age\nAlice,25") → [{"name": "Alice", "age": "25"}]
def csv_to_dicts(csv_string):
    pass


# SCENARIO: Admin clicks "Export Users" button. Backend needs to generate a CSV
# file from database records (list of dicts) for download.
# YOUR FIX: Convert list of dicts to CSV string (with header row).
# EXPECTED: dicts_to_csv([{"name":"Alice","age":25}]) → "name,age\nAlice,25\n"
def dicts_to_csv(data):
    pass


# SCENARIO: App has default config + user overrides (both nested dicts).
# Shallow merge loses nested defaults. Need DEEP merge: override only what's specified.
# YOUR FIX: Recursively merge dict2 into dict1 (dict2 values win on conflict).
# EXPECTED: deep_merge({"a":{"x":1,"y":2}}, {"a":{"y":3}}) → {"a":{"x":1,"y":3}}
def deep_merge(dict1, dict2):
    pass

if __name__ == "__main__":
    products = '[{"name":"A","price":10},{"name":"B","price":25},{"name":"C","price":5}]'
    result = json.loads(filter_json_products(products, 8))
    assert len(result) == 2
    print("[PASS] Test 13.1 Passed: filter_json_products")

    csv_data = "name,age,city\nAlice,25,NYC\nBob,30,LA"
    result = csv_to_dicts(csv_data)
    assert len(result) == 2
    assert result[0]["name"] == "Alice"
    print("[PASS] Test 13.2 Passed: csv_to_dicts")

    data = [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 30}]
    csv_result = dicts_to_csv(data)
    assert "name,age" in csv_result
    assert "Alice,25" in csv_result
    print("[PASS] Test 13.3 Passed: dicts_to_csv")

    d1 = {"a": {"x": 1, "y": 2}, "b": 10}
    d2 = {"a": {"y": 3, "z": 4}, "c": 20}
    result = deep_merge(d1, d2)
    assert result == {"a": {"x": 1, "y": 3, "z": 4}, "b": 10, "c": 20}
    print("[PASS] Test 13.4 Passed: deep_merge")

    print("\n*** ALL TASK 13 TESTS PASSED! ***")

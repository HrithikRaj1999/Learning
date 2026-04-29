"""
================================================================
   TASK 12: File I/O & Context Managers           **        
================================================================

INSTRUCTIONS:
Web apps read configs, write logs, process uploads. File I/O is essential.

CONCEPTS: open, read, write, with statement, pathlib
"""

import os
from pathlib import Path


# ----- Challenge 12.1 -----
# Write a function that reads a file and returns the number of lines, words, and characters.
# Return as a dict: {"lines": X, "words": Y, "chars": Z}
def file_stats(filepath):
    pass  # YOUR CODE HERE


# ----- Challenge 12.2 -----
# Write a function that takes a log file path and a search term,
# returns all lines containing that term (case-insensitive).
def search_in_file(filepath, term):
    pass  # YOUR CODE HERE


# ----- Challenge 12.3 -----
# Create a context manager class LogWriter that:
# - Opens a file in append mode on __enter__
# - Provides a write(message) method that writes with timestamp
# - Closes the file on __exit__
# Usage:
#   with LogWriter("app.log") as log:
#       log.write("Server started")

from datetime import datetime

class LogWriter:
    pass  # YOUR CODE HERE


# ----- Challenge 12.4 -----
# Write a function that recursively finds all files with a given extension
# in a directory and its subdirectories using pathlib.
# Return a list of Path objects.
def find_files_by_extension(directory, extension):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Setup: create a test file
    test_file = Path("_test_file.txt")
    test_file.write_text("Hello World\nPython is great\nHello Python\n")

    # Test 12.1
    stats = file_stats(str(test_file))
    assert stats["lines"] == 3
    assert stats["words"] == 6
    print("[PASS] Test 12.1 Passed: file_stats")

    # Test 12.2
    results = search_in_file(str(test_file), "hello")
    assert len(results) == 2
    print("[PASS] Test 12.2 Passed: search_in_file")

    # Test 12.3
    log_file = "_test_log.txt"
    with LogWriter(log_file) as log:
        log.write("Test message")
    assert Path(log_file).exists()
    content = Path(log_file).read_text()
    assert "Test message" in content
    print("[PASS] Test 12.3 Passed: LogWriter")

    # Cleanup
    test_file.unlink(missing_ok=True)
    Path(log_file).unlink(missing_ok=True)

    print("\n*** ALL TASK 12 TESTS PASSED! ***")

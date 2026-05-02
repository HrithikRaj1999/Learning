"""
==============================================================================
  TASK 12: File I/O Operations
==============================================================================

REAL-WORLD CONTEXT:
Every app reads/writes files: logs, configs, uploads, exports, cache files.
Doing it WRONG: forgetting to close files, not handling missing files,
no proper encoding handling. Python's pathlib and context managers fix this.

SCENARIOS COVERED:
  - Analyzing file contents (word count, line count for reporting)
  - Searching through files (grep-like functionality for log analysis)
  - Writing logs with timestamps (audit trail, debugging)
  - Finding files by extension (batch processing, cleanup scripts)
"""

import os
from pathlib import Path


# SCENARIO: DevOps script needs quick stats about log files: how many lines,
# how many words, how many characters. Used for monitoring log growth.
# YOUR FIX: Read file, count lines/words/characters, return stats dict.
# EXPECTED: file_stats("data.txt") → {"lines": 3, "words": 6, "chars": 42}
def file_stats(filepath):
    pass


# SCENARIO: Support team needs to search ALL log files for a customer's email
# (case-insensitive). Return matching lines with their line numbers.
# YOUR FIX: Read file line by line, find lines containing the search term.
# EXPECTED: search_in_file("app.log", "error") → [(1, "Error occurred"), (5, "Another error")]
def search_in_file(filepath, term):
    pass


from datetime import datetime


# SCENARIO: Background job needs to log what it does with timestamps.
# Must use context manager (with statement) so file is always properly closed,
# even if the job crashes mid-write.
# YOUR FIX: LogWriter context manager that opens file, writes with timestamp, closes properly.
# EXPECTED: with LogWriter("job.log") as log: log.write("Started") → "2024-01-15 10:30:00 Started"
class LogWriter:
    pass


# SCENARIO: A cleanup script finds all .tmp files in a directory tree to delete them.
# Or: a photo app finds all .jpg files to generate thumbnails.
# YOUR FIX: Walk directory recursively, find all files with given extension.
# EXPECTED: find_files_by_extension("./uploads", ".jpg") → ["uploads/photo1.jpg", ...]
def find_files_by_extension(directory, extension):
    pass

if __name__ == "__main__":
    test_file = Path("_test_file.txt")
    test_file.write_text("Hello World\nPython is great\nHello Python\n")

    stats = file_stats(str(test_file))
    assert stats["lines"] == 3
    assert stats["words"] == 6
    print("[PASS] Test 12.1 Passed: file_stats")

    results = search_in_file(str(test_file), "hello")
    assert len(results) == 2
    print("[PASS] Test 12.2 Passed: search_in_file")

    log_file = "_test_log.txt"
    with LogWriter(log_file) as log:
        log.write("Test message")
    assert Path(log_file).exists()
    content = Path(log_file).read_text()
    assert "Test message" in content
    print("[PASS] Test 12.3 Passed: LogWriter")

    test_file.unlink(missing_ok=True)
    Path(log_file).unlink(missing_ok=True)

    print("\n*** ALL TASK 12 TESTS PASSED! ***")

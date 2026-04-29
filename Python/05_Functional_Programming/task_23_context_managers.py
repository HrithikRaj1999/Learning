"""
================================================================
   TASK 23: Context Managers Advanced             ****    
================================================================

INSTRUCTIONS:
Context managers manage resources: DB connections, file locks, transactions.
Django uses them for atomic DB transactions!

CONCEPTS: __enter__/__exit__, contextlib, generator-based context managers
"""

from contextlib import contextmanager
import time


# ----- Challenge 23.1 -----
# Create a Timer context manager that measures execution time.
# Usage:
#   with Timer() as t:
#       ... do work ...
#   print(t.elapsed)  # seconds as float

class Timer:
    pass  # YOUR CODE HERE


# ----- Challenge 23.2 -----
# Create a context manager using @contextmanager that temporarily
# changes a dict's value and restores it after the block.
# Usage:
#   config = {"debug": False}
#   with temporary_setting(config, "debug", True):
#       assert config["debug"] == True
#   assert config["debug"] == False

@contextmanager
def temporary_setting(config_dict, key, temp_value):
    pass  # YOUR CODE HERE


# ----- Challenge 23.3 -----
# Create a DatabaseTransaction context manager that:
# - Prints "BEGIN TRANSACTION" on enter
# - Prints "COMMIT" on successful exit
# - Prints "ROLLBACK" if an exception occurred
# - Re-raises the exception after rollback

class DatabaseTransaction:
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 23.1
    with Timer() as t:
        total = sum(range(1000000))
    assert hasattr(t, 'elapsed')
    assert t.elapsed > 0
    print(f"[PASS] Test 23.1 Passed: Timer ({t.elapsed:.4f}s)")

    # Test 23.2
    config = {"debug": False, "verbose": True}
    with temporary_setting(config, "debug", True):
        assert config["debug"] == True
    assert config["debug"] == False
    print("[PASS] Test 23.2 Passed: temporary_setting")

    # Test 23.3
    tx = DatabaseTransaction()
    # Successful transaction
    with tx:
        pass  # no error -> should COMMIT

    # Failed transaction
    try:
        with DatabaseTransaction():
            raise ValueError("Something went wrong")
    except ValueError:
        pass  # should have printed ROLLBACK
    print("[PASS] Test 23.3 Passed: DatabaseTransaction")

    print("\n*** ALL TASK 23 TESTS PASSED! ***")

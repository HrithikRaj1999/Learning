"""
==============================================================================
  TASK 23: Context Managers
==============================================================================

REAL-WORLD CONTEXT:
Context managers handle setup/teardown automatically. The `with` statement ensures
cleanup ALWAYS happens, even if exceptions occur. Used for:
  - File handling (always close the file)
  - Database transactions (commit on success, rollback on error)
  - Timing code blocks (measure performance)
  - Temporary state (change config, restore after)
  - Locks (acquire on enter, release on exit)
"""

from contextlib import contextmanager
import time


# SCENARIO: Performance monitoring: wrap any code block to measure execution time.
# `with Timer() as t: do_work()` → t.elapsed has the duration after the block.
# YOUR FIX: Timer class with __enter__ (start clock) and __exit__ (stop clock).
# EXPECTED: with Timer() as t: ... → t.elapsed = 0.05 (seconds)
class Timer:
    pass


# SCENARIO: Testing needs temporary config changes. Set debug=True for ONE test,
# then restore original value afterward (even if test crashes).
# YOUR FIX: Context manager that sets a config key temporarily, restores on exit.
# EXPECTED: config={"debug": False}; with temporary_setting(config, "debug", True): assert config["debug"] == True
#           After with block: config["debug"] == False (restored)
@contextmanager
def temporary_setting(config_dict, key, temp_value):
    pass


# SCENARIO: Database operations: if ALL queries succeed → COMMIT (save changes).
# If ANY query fails → ROLLBACK (undo everything). Context manager handles this.
# YOUR FIX: __enter__ starts transaction, __exit__ commits or rolls back based on exception.
# EXPECTED: with DatabaseTransaction(): queries... → COMMIT; with DB(): raise Error → ROLLBACK
class DatabaseTransaction:
    pass

if __name__ == "__main__":
    with Timer() as t:
        total = sum(range(1000000))
    assert hasattr(t, 'elapsed')
    assert t.elapsed > 0
    print(f"[PASS] Test 23.1 Passed: Timer ({t.elapsed:.4f}s)")

    config = {"debug": False, "verbose": True}
    with temporary_setting(config, "debug", True):
        assert config["debug"] == True
    assert config["debug"] == False
    print("[PASS] Test 23.2 Passed: temporary_setting")

    tx = DatabaseTransaction()
    with tx:
        pass  # no error -> should COMMIT

    try:
        with DatabaseTransaction():
            raise ValueError("Something went wrong")
    except ValueError:
        pass  # should have printed ROLLBACK
    print("[PASS] Test 23.3 Passed: DatabaseTransaction")

    print("\n*** ALL TASK 23 TESTS PASSED! ***")

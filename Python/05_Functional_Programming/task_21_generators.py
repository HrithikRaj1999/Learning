"""
==============================================================================
  TASK 21: Generators & Lazy Evaluation
==============================================================================

REAL-WORLD CONTEXT:
Generators produce values ONE AT A TIME (lazy). Why this matters:
  - Processing a 10GB log file: load ALL into memory = crash. Generator = fine.
  - Infinite sequences (Fibonacci, sensor data): can't store infinite list.
  - Pipeline processing: transform data in stages without intermediate lists.

SCENARIOS COVERED:
  - Infinite Fibonacci (algorithmic interviews)
  - Reading huge files line by line (log processing)
  - Batch processing (send emails in groups of 100, not all at once)
  - Pipeline chaining: numbers → squares → filter even → take first N
"""

import itertools


# SCENARIO: Algorithm interview: "Generate Fibonacci numbers." An infinite sequence
# you can pull values from one at a time. No list = no memory limit.
# YOUR FIX: Generator that yields 0, 1, 1, 2, 3, 5, 8, 13, ... forever.
# EXPECTED: fib = fibonacci(); [next(fib) for _ in range(5)] → [0, 1, 1, 2, 3]
def fibonacci():
    pass


# SCENARIO: DevOps script reads a 50GB server log. Loading it all = OOM crash.
# Generator reads line by line: constant memory regardless of file size.
# YOUR FIX: Yield each line from file without loading entire file.
# EXPECTED: for line in read_large_file("big.log"): process(line) → uses ~0 MB extra
def read_large_file(filepath):
    pass


# SCENARIO: Email campaign to 10,000 users. Sending all at once overwhelms the
# email server. Process in batches of 100. Generator yields each batch.
# YOUR FIX: Yield sublists of given size from input data.
# EXPECTED: list(batch_generator([1,2,3,4,5], 2)) → [[1,2], [3,4], [5]]
def batch_generator(data, batch_size):
    pass


# SCENARIO: Data pipeline — chain generators like Unix pipes:
# Generate numbers → square them → keep only even → take first 5.
# Each step is lazy: only computes what's needed.
# YOUR FIX: Build 4 generators that compose into a pipeline.
# EXPECTED: list(take(filter_even(squares(numbers())), 5)) → [4, 16, 36, 64, 100]
def numbers():
    pass

def squares(gen):
    pass

def filter_even(gen):
    pass

def take(gen, n):
    pass

if __name__ == "__main__":
    fib = fibonacci()
    first_10 = [next(fib) for _ in range(10)]
    assert first_10 == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    print("[PASS] Test 21.1 Passed: fibonacci generator")

    batches = list(batch_generator([1, 2, 3, 4, 5], 2))
    assert batches == [[1, 2], [3, 4], [5]]
    print("[PASS] Test 21.3 Passed: batch_generator")

    result = list(take(filter_even(squares(numbers())), 5))
    assert result == [4, 16, 36, 64, 100]
    print("[PASS] Test 21.4 Passed: generator pipeline")

    print("\n*** ALL TASK 21 TESTS PASSED! ***")

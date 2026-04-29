"""
================================================================
   TASK 21: Generators & Iterators                ***      
================================================================

INSTRUCTIONS:
Generators handle large datasets memory-efficiently.
Django QuerySets are lazy iterators -- same concept!

CONCEPTS: yield, generator expressions, itertools, lazy evaluation
"""

import itertools


# ----- Challenge 21.1 -----
# Create a generator that yields Fibonacci numbers infinitely.
# Usage: fib = fibonacci(); next(fib) -> 0, next(fib) -> 1, next(fib) -> 1, ...
def fibonacci():
    pass  # YOUR CODE HERE


# ----- Challenge 21.2 -----
# Create a generator that reads a large file line by line (memory efficient).
# Yield each line stripped of whitespace.
def read_large_file(filepath):
    pass  # YOUR CODE HERE


# ----- Challenge 21.3 -----
# Create a generator that yields batches from a list.
# Example: list(batch_generator([1,2,3,4,5], 2)) -> [[1,2], [3,4], [5]]
def batch_generator(data, batch_size):
    pass  # YOUR CODE HERE


# ----- Challenge 21.4 -----
# Create a pipeline of generators:
# 1. numbers() -> yields 1 to infinity
# 2. squares(gen) -> yields squares of input generator
# 3. filter_even(gen) -> yields only even numbers from input
# 4. take(gen, n) -> yields first n items from input
# Chain them: take(filter_even(squares(numbers())), 5) -> [4, 16, 36, 64, 100]
def numbers():
    pass  # YOUR CODE HERE

def squares(gen):
    pass  # YOUR CODE HERE

def filter_even(gen):
    pass  # YOUR CODE HERE

def take(gen, n):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 21.1
    fib = fibonacci()
    first_10 = [next(fib) for _ in range(10)]
    assert first_10 == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
    print("[PASS] Test 21.1 Passed: fibonacci generator")

    # Test 21.3
    batches = list(batch_generator([1, 2, 3, 4, 5], 2))
    assert batches == [[1, 2], [3, 4], [5]]
    print("[PASS] Test 21.3 Passed: batch_generator")

    # Test 21.4
    result = list(take(filter_even(squares(numbers())), 5))
    assert result == [4, 16, 36, 64, 100]
    print("[PASS] Test 21.4 Passed: generator pipeline")

    print("\n*** ALL TASK 21 TESTS PASSED! ***")

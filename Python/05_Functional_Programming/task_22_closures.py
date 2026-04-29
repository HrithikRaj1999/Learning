"""
================================================================
   TASK 22: Closures & Higher-Order Functions     ****    
================================================================

INSTRUCTIONS:
Closures capture state. Flask's route handlers and Django signals use this pattern.

CONCEPTS: closures, nonlocal, higher-order functions, partial application
"""

from functools import partial, reduce


# ----- Challenge 22.1 -----
# Create a counter factory using closures.
# counter = make_counter(start=0)
# counter() -> 0, counter() -> 1, counter() -> 2, counter.reset() won't work (just increment)
def make_counter(start=0):
    pass  # YOUR CODE HERE


# ----- Challenge 22.2 -----
# Create a function compose that takes multiple functions and returns their composition.
# compose(f, g, h)(x) = f(g(h(x)))
# Example: compose(str, lambda x: x*2, int)("5") -> "10"
def compose(*functions):
    pass  # YOUR CODE HERE


# ----- Challenge 22.3 -----
# Implement a simple event system using closures:
# emitter = create_event_emitter()
# emitter.on("click", handler_func)  -> register handler
# emitter.emit("click", data)        -> call all handlers with data
# emitter.off("click", handler_func) -> remove handler
def create_event_emitter():
    pass  # YOUR CODE HERE


# ----- Challenge 22.4 -----
# Implement pipe() that works left-to-right (opposite of compose).
# pipe(h, g, f)(x) = f(g(h(x)))
# Example: pipe(int, lambda x: x*2, str)("5") -> "10"
def pipe(*functions):
    pass  # YOUR CODE HERE


# =========== TEST CASES (DO NOT MODIFY) ===========
if __name__ == "__main__":
    # Test 22.1
    counter = make_counter(10)
    assert counter() == 10
    assert counter() == 11
    assert counter() == 12
    print("[PASS] Test 22.1 Passed: make_counter")

    # Test 22.2
    double_then_str = compose(str, lambda x: x * 2, int)
    assert double_then_str("5") == "10"
    print("[PASS] Test 22.2 Passed: compose")

    # Test 22.3
    emitter = create_event_emitter()
    results = []
    handler = lambda data: results.append(data)
    emitter.on("click", handler)
    emitter.emit("click", "button1")
    emitter.emit("click", "button2")
    assert results == ["button1", "button2"]
    emitter.off("click", handler)
    emitter.emit("click", "button3")
    assert len(results) == 2  # handler was removed
    print("[PASS] Test 22.3 Passed: event_emitter")

    # Test 22.4
    pipeline = pipe(int, lambda x: x * 2, str)
    assert pipeline("5") == "10"
    print("[PASS] Test 22.4 Passed: pipe")

    print("\n*** ALL TASK 22 TESTS PASSED! ***")

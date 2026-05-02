"""
==============================================================================
  TASK 22: Closures & Function Composition
==============================================================================

REAL-WORLD CONTEXT:
Closures are functions that "remember" their creation environment. Used for:
  - Counters and accumulators (stateful functions without classes)
  - Function composition (combine small functions into complex pipelines)
  - Event systems (subscribe/emit pattern for decoupled communication)
  - Pipe/compose (functional programming staple for data transformation)
"""

from functools import partial, reduce


# SCENARIO: A rate limiter needs a counter that remembers how many calls happened.
# No class needed — just a function that "remembers" its count between calls.
# YOUR FIX: Return a function that increments and returns a counter each call.
# EXPECTED: counter = make_counter(10); counter() → 10; counter() → 11; counter() → 12
def make_counter(start=0):
    pass


# SCENARIO: Data transformation pipeline: parse string to int → double it → back to string.
# compose(f, g, h)(x) = f(g(h(x))) — applies functions right to left.
# YOUR FIX: compose(str, lambda x: x*2, int)("5") → str(int("5") * 2) → "10"
# EXPECTED: compose(str, lambda x: x*2, int)("5") → "10"
def compose(*functions):
    pass


# SCENARIO: A UI framework needs an event system: components emit events,
# other components listen. Click "Save" button → form submits + toast shows.
# YOUR FIX: Event emitter with .on(event, handler), .emit(event, data), .off(event, handler).
# EXPECTED: emitter.on("click", handler); emitter.emit("click", "btn") → handler called with "btn"
def create_event_emitter():
    pass


# SCENARIO: Same as compose but LEFT to RIGHT (more readable for data pipelines).
# pipe(int, double, str)("5") = str(double(int("5"))) — reads like a pipeline.
# YOUR FIX: Apply functions left to right.
# EXPECTED: pipe(int, lambda x: x*2, str)("5") → "10"
def pipe(*functions):
    pass

if __name__ == "__main__":
    counter = make_counter(10)
    assert counter() == 10
    assert counter() == 11
    assert counter() == 12
    print("[PASS] Test 22.1 Passed: make_counter")

    double_then_str = compose(str, lambda x: x * 2, int)
    assert double_then_str("5") == "10"
    print("[PASS] Test 22.2 Passed: compose")

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

    pipeline = pipe(int, lambda x: x * 2, str)
    assert pipeline("5") == "10"
    print("[PASS] Test 22.4 Passed: pipe")

    print("\n*** ALL TASK 22 TESTS PASSED! ***")

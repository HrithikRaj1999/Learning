/**
==============================================================================
  TASK 10: Testing, Mocking & Testability
==============================================================================

REAL-WORLD CONTEXT:
Tests are how you KNOW your code works. Without tests:
  - Every deploy is a gamble ("did I break something?")
  - Refactoring is terrifying (no safety net)
  - Bugs come back (no regression protection)
  - Code reviews are guesswork ("looks correct" isn't the same as "IS correct")

But GOOD testing is hard. Bad tests are worse than no tests:
  - Brittle tests break when you rename a variable (test the behavior, not implementation)
  - Slow tests (hitting real databases) → developers skip running them
  - Flaky tests (pass sometimes, fail sometimes) → everyone ignores test failures
  - Tests coupled to implementation → refactoring is impossible

This section teaches you to write tests that are:
  - Fast (milliseconds, not seconds)
  - Reliable (deterministic, no flakiness)
  - Meaningful (catch real bugs, not cosmetic changes)
  - Maintainable (easy to update when requirements change)

HOW TO WORK:
- Implement each testing utility/pattern
- Think about: "What would make ME want to write more tests?"
*/

import { todo, type ChallengeInput } from "../src/shared/challenge";

// ---------------------------------------------------------------------------
// Challenge 10.01 — Test Data Builder (Stop Writing 50-Line Test Setup)
// ---------------------------------------------------------------------------
// SCENARIO: Every test needs a Customer object. Creating one requires 12 fields.
// Tests that only care about "name" still need to set email, address, phone...
// Result: 50 lines of setup for a 5-line test. Nobody writes tests because setup is painful.
//
// WHAT'S WRONG: `const customer = { name: "test", email: "t@t.com", address: {...}, phone: "...", ... }`
// Repeated in EVERY test. Change the Customer type → update 200 test files.
//
// YOUR FIX: Builder with sensible defaults. Only override what the test cares about.
//
// EXPECTED BEHAVIOR:
//   buildCustomer() → complete valid Customer (all defaults)
//   buildCustomer({ name: "Alice" }) → Customer with name "Alice", other fields = defaults
//   buildCustomer({ email: "bad" }) → still valid Customer, just with that email override
//   // Tests are 3 lines instead of 50. Adding a new field = update ONE builder.
// ---------------------------------------------------------------------------
export function challenge10_01(input: ChallengeInput): unknown {
  void input;
  return todo("10.01", "Create a test data builder for Customer with overridable defaults.");
}

// ---------------------------------------------------------------------------
// Challenge 10.02 — Table-Driven Tests (100 Cases, 10 Lines)
// ---------------------------------------------------------------------------
// SCENARIO: A discount function has complex rules:
//   - VIP + order > $100 → 20% off
//   - VIP + order ≤ $100 → 10% off
//   - Regular + order > $200 → 5% off
//   - Regular + coupon code → 15% off
// You need to test every combination. Writing individual test functions = 50 tests.
//
// WHAT'S WRONG: Copy-pasting test functions with slightly different values.
// Adding a new rule → add 10 more copy-pasted tests.
//
// YOUR FIX: Table-driven tests — define inputs and expected outputs in an array.
// One test function loops through all cases.
//
// EXPECTED BEHAVIOR:
//   const cases = [
//     { tier: "vip", amount: 150, expected: 30 },   // 20% off
//     { tier: "vip", amount: 50, expected: 5 },     // 10% off
//     { tier: "regular", amount: 250, expected: 12.5 }, // 5% off
//   ];
//   cases.forEach(c => expect(calcDiscount(c)).toBe(c.expected));
//   // Adding a case = adding ONE line to the table
// ---------------------------------------------------------------------------
export function challenge10_02(input: ChallengeInput): unknown {
  void input;
  return todo("10.02", "Write table-driven tests for a discount calculation function.");
}

// ---------------------------------------------------------------------------
// Challenge 10.03 — Fake Timers: Test Retry Without Waiting
// ---------------------------------------------------------------------------
// SCENARIO: Your retry function waits 1s, 2s, 4s between attempts (exponential backoff).
// Testing with real timers: test takes 7 seconds. Run 100 tests like this = 12 minutes.
// Developers disable the test suite because it's too slow.
//
// WHAT'S WRONG: `await delay(1000)` in retry code → test literally waits 1 second.
// 100 retry tests × 7 seconds each = tests take forever.
//
// YOUR FIX: Use fake timers (vi.useFakeTimers()). Advance time instantly:
//   vi.advanceTimersByTime(7000) → all delays resolve immediately.
// Test runs in milliseconds, not seconds.
//
// EXPECTED BEHAVIOR:
//   vi.useFakeTimers();
//   const promise = retryWithBackoff(failingFn, { maxRetries: 3 });
//   vi.advanceTimersByTime(7000); // skip all waits
//   await promise; // resolves immediately
//   expect(failingFn).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
// ---------------------------------------------------------------------------
export function challenge10_03(input: ChallengeInput): unknown {
  void input;
  return todo("10.03", "Use fake timers to test retry and backoff behavior.");
}

// ---------------------------------------------------------------------------
// Challenge 10.04 — Fake Repository (Record Saves for Assertions)
// ---------------------------------------------------------------------------
// SCENARIO: Testing OrderService.createOrder(). You need to verify it saved the
// order correctly. But you don't want a real database in unit tests.
// You need a fake that RECORDS what was saved for assertions.
//
// WHAT'S WRONG: Mocking with jest.fn() doesn't let you inspect the saved object.
// `repo.save = jest.fn()` → you can assert it was called, but not easily inspect
// the order that was passed.
//
// YOUR FIX: Build a FakeRepository that stores saved entities in an array.
// Tests inspect repo.savedEntities to verify correctness.
//
// EXPECTED BEHAVIOR:
//   const fakeRepo = new FakeOrderRepo();
//   const service = new OrderService(fakeRepo);
//   await service.createOrder({ items: [...] });
//   expect(fakeRepo.savedEntities).toHaveLength(1);
//   expect(fakeRepo.savedEntities[0].total).toBe(2500);
// ---------------------------------------------------------------------------
export function challenge10_04(input: ChallengeInput): unknown {
  void input;
  return todo("10.04", "Create a fake repository that records saved entities for assertions.");
}

// ---------------------------------------------------------------------------
// Challenge 10.05 — Mock fetch with Request Assertions
// ---------------------------------------------------------------------------
// SCENARIO: Testing an API client that calls POST /api/orders with a body.
// You need to verify: correct URL, correct headers, correct body.
// AND return a controlled response to test the client's parsing logic.
//
// WHAT'S WRONG: Global fetch mocking affects other tests. Can't easily assert
// the order of multiple requests or inspect headers.
//
// YOUR FIX: Build a mock fetch that:
//   - Queues responses (in order)
//   - Records all requests made (URL, method, headers, body)
//   - Allows assertions on request metadata after the test
//
// EXPECTED BEHAVIOR:
//   const mockFetch = createMockFetch();
//   mockFetch.respondWith(200, { orderId: 123 });
//   await client.createOrder(data); // calls mockFetch internally
//   expect(mockFetch.requests[0].url).toBe("/api/orders");
//   expect(mockFetch.requests[0].body).toEqual(data);
// ---------------------------------------------------------------------------
export function challenge10_05(input: ChallengeInput): unknown {
  void input;
  return todo("10.05", "Mock fetch with ordered responses and assert request metadata.");
}

// ---------------------------------------------------------------------------
// Challenge 10.06 — Test Async Queue Without Flaky Sleeps
// ---------------------------------------------------------------------------
// SCENARIO: You built an async job queue (Task 05). Testing it: how do you know
// when the queue has processed all items? Adding `await sleep(500)` is flaky —
// sometimes 500ms isn't enough (CI is slow), sometimes it's wasteful (items processed in 10ms).
//
// WHAT'S WRONG: `await sleep(1000); expect(results.length).toBe(5);`
// On slow CI: fails randomly. On fast machine: wastes time. FLAKY.
//
// YOUR FIX: Give the queue a way to signal "drain" (all items processed).
// Wait for the signal, not an arbitrary timeout.
//
// EXPECTED BEHAVIOR:
//   queue.enqueue(job1, job2, job3);
//   await queue.drain(); // resolves when ALL jobs are complete (not time-based)
//   expect(results).toHaveLength(3); // guaranteed, not flaky
// ---------------------------------------------------------------------------
export function challenge10_06(input: ChallengeInput): unknown {
  void input;
  return todo("10.06", "Test an async queue without flaky sleeps.");
}

// ---------------------------------------------------------------------------
// Challenge 10.07 — Contract Tests (Same Tests, Multiple Implementations)
// ---------------------------------------------------------------------------
// SCENARIO: You have InMemoryOrderRepo and PostgresOrderRepo. Both implement
// OrderRepo interface. You need to verify BOTH behave identically.
// Writing separate tests for each = duplication. Missing a test = hidden bugs.
//
// WHAT'S WRONG: Tests for InMemoryRepo don't run against PostgresRepo.
// InMemory works, Postgres has a bug → caught only in production.
//
// YOUR FIX: Write ONE test suite that runs against ANY OrderRepo implementation.
// Execute it against both InMemory and Postgres.
//
// EXPECTED BEHAVIOR:
//   function orderRepoContractTests(createRepo: () => OrderRepo) {
//     it("saves and retrieves by id", async () => { ... });
//     it("returns null for unknown id", async () => { ... });
//   }
//   describe("InMemory", () => orderRepoContractTests(() => new InMemoryRepo()));
//   describe("Postgres", () => orderRepoContractTests(() => new PostgresRepo(db)));
// ---------------------------------------------------------------------------
export function challenge10_07(input: ChallengeInput): unknown {
  void input;
  return todo("10.07", "Create contract tests shared by multiple repository implementations.");
}

// ---------------------------------------------------------------------------
// Challenge 10.08 — Snapshot-Safe Serialization (No Volatile Fields)
// ---------------------------------------------------------------------------
// SCENARIO: You use snapshot testing for API responses. Every test run generates
// a new `id` (UUID), `createdAt` (timestamp), and `requestId`. Snapshots ALWAYS
// change. Snapshot tests become useless — always need updating.
//
// WHAT'S WRONG: Snapshot includes: `"id": "550e8400-..."` — different every run.
// `npm test -- -u` (update snapshots) runs daily. Nobody reviews snapshot diffs.
//
// YOUR FIX: Build a serializer that replaces volatile fields with stable placeholders:
//   "id": "[UUID]", "createdAt": "[TIMESTAMP]", "requestId": "[UUID]"
// Snapshots are stable. Only MEANINGFUL changes show up in diffs.
//
// EXPECTED BEHAVIOR:
//   stabilize({ id: "abc-123", name: "Alice", createdAt: "2024-01-15T..." })
//   → { id: "[UUID]", name: "Alice", createdAt: "[TIMESTAMP]" }
//   // Snapshots only change when name or structure changes, not on every run
// ---------------------------------------------------------------------------
export function challenge10_08(input: ChallengeInput): unknown {
  void input;
  return todo("10.08", "Build a snapshot-safe serializer that removes volatile fields.");
}

// ---------------------------------------------------------------------------
// Challenge 10.09 — Test Error Behavior, Not Error Messages
// ---------------------------------------------------------------------------
// SCENARIO: You test: `expect(error.message).toBe("User not found")`.
// Someone improves the message: "User with id 5 not found" → TEST BREAKS.
// The behavior is correct (still throws for missing user), but the test fails.
//
// WHAT'S WRONG: Asserting on exact error messages couples tests to wording.
// Any copy change breaks tests. Developers stop improving error messages.
//
// YOUR FIX: Assert on error TYPE or CODE, not message:
//   expect(error).toBeInstanceOf(NotFoundError)
//   expect(error.code).toBe("USER_NOT_FOUND")
// Message can change freely without breaking tests.
//
// EXPECTED BEHAVIOR:
//   // BAD:  expect(error.message).toBe("User not found")
//   // GOOD: expect(error.code).toBe("NOT_FOUND")
//   // GOOD: expect(error).toBeInstanceOf(NotFoundError)
//   // GOOD: expect(error.statusCode).toBe(404)
// ---------------------------------------------------------------------------
export function challenge10_09(input: ChallengeInput): unknown {
  void input;
  return todo("10.09", "Write tests for error cases without asserting brittle error messages.");
}

// ---------------------------------------------------------------------------
// Challenge 10.10 — Result Assertion Helpers (Better Test Output)
// ---------------------------------------------------------------------------
// SCENARIO: Testing functions that return Result<T, E>. When a test fails:
//   `expect(result.ok).toBe(true)` → shows "expected true, got false"
// USELESS. You want to see: "Expected Ok but got Err: NOT_FOUND - user 5"
//
// WHAT'S WRONG: Generic assertions on Result give no diagnostic info on failure.
// Debugging test failures requires adding console.log(result) manually.
//
// YOUR FIX: Custom assertion helpers:
//   expectOk(result) → returns value or throws with full error details
//   expectErr(result) → returns error or throws with "Expected Err, got Ok: ..."
//
// EXPECTED BEHAVIOR:
//   const value = expectOk(result); // if Err: "Expected Ok, got Err(NOT_FOUND: user 5)"
//   const error = expectErr(result); // if Ok: "Expected Err, got Ok(User{...})"
//   // Test failures show EXACTLY what went wrong
// ---------------------------------------------------------------------------
export function challenge10_10(input: ChallengeInput): unknown {
  void input;
  return todo("10.10", "Create a helper for asserting Result ok and err states.");
}

// ---------------------------------------------------------------------------
// Challenge 10.11 — Fixture Factory (Readable, Isolated Test Data)
// ---------------------------------------------------------------------------
// SCENARIO: Tests create related objects: Order → has LineItems → has Products.
// Each test creates its own copies. If Product schema changes, 100 tests break.
// Tests read like data declarations, not behavior descriptions.
//
// WHAT'S WRONG: Tests are 80% setup (creating objects) and 20% actual assertions.
// Reading a test requires understanding 50 lines of irrelevant object construction.
//
// YOUR FIX: Factory that creates complete object graphs with meaningful defaults:
//   createOrder({ items: 3 }) → Order with 3 line items, each with a valid Product
//   Focus test on what's RELEVANT, hide everything else behind defaults.
//
// EXPECTED BEHAVIOR:
//   const order = fixtures.order({ itemCount: 3, status: "shipped" });
//   // Don't care about item names, prices, etc. — factory handles those
//   // Test only asserts on the thing being tested (status behavior)
// ---------------------------------------------------------------------------
export function challenge10_11(input: ChallengeInput): unknown {
  void input;
  return todo("10.11", "Design a fixture factory that keeps tests readable and isolated.");
}

// ---------------------------------------------------------------------------
// Challenge 10.12 — Test with Injected Clock & ID Generator
// ---------------------------------------------------------------------------
// SCENARIO: OrderService generates order IDs (UUID) and timestamps (now()).
// Tests can't assert on random UUIDs or current time. Tests become non-deterministic.
//
// WHAT'S WRONG: `order.id = crypto.randomUUID()` — different every run.
// `order.createdAt = new Date()` — different every run.
// Can't write: `expect(order.id).toBe(???)` because you don't know the value.
//
// YOUR FIX: Inject a Clock (returns fixed time) and IdGenerator (returns predictable IDs).
// Tests control both:
//   fakeClock.now() → always returns "2024-01-15T10:00:00Z"
//   fakeIdGen.next() → returns "id-1", "id-2", "id-3"...
//
// EXPECTED BEHAVIOR:
//   const service = new OrderService(repo, fakeClock, fakeIdGen);
//   const order = await service.create(...);
//   expect(order.id).toBe("id-1");  // deterministic!
//   expect(order.createdAt).toEqual(new Date("2024-01-15T10:00:00Z"));  // deterministic!
// ---------------------------------------------------------------------------
export function challenge10_12(input: ChallengeInput): unknown {
  void input;
  return todo("10.12", "Test a service with injected clock, logger, and id generator.");
}

// ---------------------------------------------------------------------------
// Challenge 10.13 — Spy on Domain Events
// ---------------------------------------------------------------------------
// SCENARIO: OrderService emits "OrderCreated" event when creating an order.
// You need to verify: the event was emitted, with the right data, exactly once.
// But the event bus is injected — you need a spy that records emissions.
//
// WHAT'S WRONG: No way to assert events were published without a real message queue.
// Tests pass but events are silently NOT being emitted (regression).
//
// YOUR FIX: Build a spy event bus that records all emitted events for assertions.
//
// EXPECTED BEHAVIOR:
//   const spy = new SpyEventBus();
//   const service = new OrderService(repo, spy);
//   await service.createOrder(...);
//   expect(spy.emitted("OrderCreated")).toHaveLength(1);
//   expect(spy.emitted("OrderCreated")[0].orderId).toBe("id-1");
// ---------------------------------------------------------------------------
export function challenge10_13(input: ChallengeInput): unknown {
  void input;
  return todo("10.13", "Create a spy-based assertion for domain event publishing.");
}

// ---------------------------------------------------------------------------
// Challenge 10.14 — Property-Based Testing (Find Edge Cases Automatically)
// ---------------------------------------------------------------------------
// SCENARIO: Your sort function works for all your hand-written test cases.
// But does it work for arrays of length 10,000? Negative numbers? Duplicates?
// NaN values? You can't write test cases for every possible input.
//
// WHAT'S WRONG: Example-based tests only cover cases you THOUGHT of.
// The bug is in the case you DIDN'T think of.
//
// YOUR FIX: Property-based testing: define PROPERTIES that must ALWAYS be true,
// let the framework generate random inputs and find violations.
//
// EXPECTED BEHAVIOR:
//   // Property: sort(arr).length === arr.length (never lose elements)
//   // Property: sort(arr) is sorted (each element ≤ next)
//   // Property: sort(sort(arr)) === sort(arr) (idempotent)
//   // Framework generates 1000 random arrays and checks all properties
//   // If a property fails, it finds the SMALLEST failing case
// ---------------------------------------------------------------------------
export function challenge10_14(input: ChallengeInput): unknown {
  void input;
  return todo("10.14", "Write property-style tests over generated numeric ranges.");
}

// ---------------------------------------------------------------------------
// Challenge 10.15 — Test Stream Transforms with In-Memory Streams
// ---------------------------------------------------------------------------
// SCENARIO: You wrote a transform stream that converts CSV to JSON (Task 07).
// Testing with real files is slow and requires test fixtures on disk.
// You want fast in-memory tests.
//
// WHAT'S WRONG: Tests create temp files, write data, pipe through transform,
// read output file, clean up. Slow, file-system dependent, cleanup issues.
//
// YOUR FIX: Use in-memory Readable/Writable streams. Push test data into a
// Readable, pipe through transform, collect from Writable. No file system.
//
// EXPECTED BEHAVIOR:
//   const input = Readable.from(["name,age\n", "Alice,30\n"]);
//   const output = await collectStream(input.pipe(csvToJsonTransform));
//   expect(output).toEqual([{ name: "Alice", age: "30" }]);
//   // No files created, no cleanup needed, runs in 1ms
// ---------------------------------------------------------------------------
export function challenge10_15(input: ChallengeInput): unknown {
  void input;
  return todo("10.15", "Test a stream transform using in-memory streams.");
}

// ---------------------------------------------------------------------------
// Challenge 10.16 — Mock Metrics Recorder
// ---------------------------------------------------------------------------
// SCENARIO: Your service emits metrics (latency, error count, request count).
// In production: DataDog/Prometheus. In tests: you need to verify metrics are
// emitted correctly without a real metrics service.
//
// WHAT'S WRONG: Tests can't assert "this operation emitted a latency metric"
// without connecting to a real metrics backend.
//
// YOUR FIX: Build a mock metrics recorder that collects metrics in memory.
// Tests assert on collected metrics after the operation.
//
// EXPECTED BEHAVIOR:
//   const metrics = new MockMetrics();
//   const service = new OrderService(repo, metrics);
//   await service.createOrder(...);
//   expect(metrics.counters["orders.created"]).toBe(1);
//   expect(metrics.histograms["order.creation.latency"]).toContain(expect.any(Number));
// ---------------------------------------------------------------------------
export function challenge10_16(input: ChallengeInput): unknown {
  void input;
  return todo("10.16", "Create a mock metrics recorder and assert emitted metrics.");
}

// ---------------------------------------------------------------------------
// Challenge 10.17 — Test Cancellation with AbortSignal
// ---------------------------------------------------------------------------
// SCENARIO: Your function accepts AbortSignal for cancellation. You need to test:
//   - Normal completion (signal not aborted)
//   - Pre-aborted signal (abort before starting)
//   - Mid-operation abort (abort during execution)
//
// WHAT'S WRONG: No clear pattern for testing cancellation. Tests either don't
// test it (bug hides) or test it with real timers (slow/flaky).
//
// YOUR FIX: Helpers that create controlled AbortSignals for tests:
//   - abortedSignal() → already aborted
//   - abortAfter(callback) → abort when callback is called
//
// EXPECTED BEHAVIOR:
//   it("rejects when pre-aborted", async () => {
//     const signal = AbortSignal.abort();
//     await expect(fetchData(signal)).rejects.toThrow("aborted");
//   });
//   it("cancels mid-operation", async () => {
//     const controller = new AbortController();
//     const promise = longOperation(controller.signal);
//     controller.abort();
//     await expect(promise).rejects.toThrow("aborted");
//   });
// ---------------------------------------------------------------------------
export function challenge10_17(input: ChallengeInput): unknown {
  void input;
  return todo("10.17", "Build test helpers for AbortSignal cancellation.");
}

// ---------------------------------------------------------------------------
// Challenge 10.18 — Test Cache Expiration Deterministically
// ---------------------------------------------------------------------------
// SCENARIO: Your cache has a 5-minute TTL. Testing: "does it expire after 5 minutes?"
// Real approach: wait 5 minutes in the test. Obviously wrong.
// Sleep approach: `await sleep(300000)` — test takes 5 minutes.
//
// WHAT'S WRONG: Can't test time-dependent behavior without controlling time.
//
// YOUR FIX: Cache accepts an injectable Clock. Test uses fake clock:
//   fakeClock.advance(5 * 60 * 1000) → cache thinks 5 minutes passed → entry expires.
// Test runs in milliseconds.
//
// EXPECTED BEHAVIOR:
//   cache.set("key", "value", { ttl: 300_000 }); // 5 min TTL
//   expect(cache.get("key")).toBe("value"); // still fresh
//   fakeClock.advance(300_001); // advance past TTL
//   expect(cache.get("key")).toBeUndefined(); // expired!
//   // Total test time: <1ms
// ---------------------------------------------------------------------------
export function challenge10_18(input: ChallengeInput): unknown {
  void input;
  return todo("10.18", "Test cache expiration deterministically with fake timers.");
}

// ---------------------------------------------------------------------------
// Challenge 10.19 — Integration Test: Full Use Case
// ---------------------------------------------------------------------------
// SCENARIO: Unit tests verify individual pieces. But does the whole checkout
// flow work when pieces are assembled? ValidationService + InventoryService +
// PaymentService + NotificationService composed together.
//
// WHAT'S WRONG: All unit tests pass but the services are wired wrong.
// Integration bugs hide between the seams of well-tested units.
//
// YOUR FIX: Integration tests with REAL implementations (except external APIs):
//   - Real validation logic
//   - Real inventory logic
//   - Fake payment gateway (returns controlled responses)
//   - Fake notification (records sent notifications)
//
// EXPECTED BEHAVIOR:
//   // Wire real services with fake externals:
//   const checkout = createCheckoutUseCase(realValidation, realInventory, fakePayment, fakeNotifier);
//   const result = await checkout.execute({ items: [...], payment: {...} });
//   expect(result).toBeOk();
//   expect(fakeNotifier.sent).toHaveLength(1); // notification sent
// ---------------------------------------------------------------------------
export function challenge10_19(input: ChallengeInput): unknown {
  void input;
  return todo("10.19", "Create integration-style tests around a composed use case.");
}

// ---------------------------------------------------------------------------
// Challenge 10.20 — Make Untestable Code Testable (Refactoring)
// ---------------------------------------------------------------------------
// SCENARIO: A function reads from database, calls an external API, writes to
// a file, sends an email, and logs to console. Testing it requires ALL of those
// to be running. It's never tested. It has bugs nobody catches.
//
// WHAT'S WRONG: Hard-coded dependencies make the function impossible to unit test:
//   `function processOrder() { const db = require('./db'); const api = require('./api'); ... }`
// Can't replace db or api in tests.
//
// YOUR FIX: Refactor to accept dependencies as parameters. Extract pure logic
// from side effects. Test pure logic thoroughly, test integration separately.
//
// EXPECTED BEHAVIOR:
//   // Before: function processOrder() { /* 200 lines, all dependencies hard-coded */ }
//   // After:
//   function calculateTotal(items) { ... }  // pure, easily tested
//   function processOrder(repo, api, emailer) { ... }  // injectable, testable
//   // Tests: processOrder(fakeRepo, fakeApi, fakeEmailer) → works!
// ---------------------------------------------------------------------------
export function challenge10_20(input: ChallengeInput): unknown {
  void input;
  return todo("10.20", "Refactor code that is difficult to test into dependency-injected units.");
}

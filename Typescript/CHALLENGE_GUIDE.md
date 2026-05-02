# TypeScript Challenge Guide — What Each Challenge Expects

> For every challenge below, you'll get a `ChallengeInput` object with: `challengeId`, `now` (timestamp), `records` (array of items with id, customerId, amount, status, tags), and `options` (limit, strict, tenantId).
> Your function must return an object describing the result. Use the records/options to demonstrate the concept.

---

## Section 01: Type System and Narrowing

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 01.01 | Discriminated union for payment events | Define types like `PaymentCreated`, `PaymentCompleted`, `PaymentFailed`, `PaymentRefunded` — all sharing a `type` field. Write a `switch` on `event.type` to produce a message for each. | `{ challenge: "01.01", messages: ["Payment rec_1 completed for customer cus_1: $120", ...] }` |
| 01.02 | Type guard for UserProfile | Write a function `isUserProfile(val: unknown): val is UserProfile` that checks all required fields exist and have correct types at runtime. | `{ challenge: "01.02", valid: [...profiles that passed], invalid: [...ones that failed] }` |
| 01.03 | Assertion function for non-empty string | Write `function assertNonEmpty(val: unknown): asserts val is string` that throws if value is not a string or is empty. Show it working on record fields. | `{ challenge: "01.03", validated: ["cus_1", "cus_2"] }` |
| 01.04 | Branded types (CustomerId, OrderId, ProductId) | Create types that look like `string` but can't be accidentally swapped. Use a `__brand` field trick. Show that passing a CustomerId where OrderId is expected would be a compile error. | `{ challenge: "01.04", customerIds: [...], orderIds: [...], note: "Types prevent mixing" }` |
| 01.05 | Exhaustive switch with assertNever | Define a `NotificationStatus` union (e.g., "sent" \| "failed" \| "pending" \| "retrying"). Write a switch that handles every case; `default` calls `assertNever()` so adding a new status causes a compile error. | `{ challenge: "01.05", labels: { sent: "Delivered", failed: "Error", ... } }` |
| 01.06 | Normalize nullable API fields | Take fields that might be `null`, `undefined`, or missing and convert them to explicit values (e.g., `null` → `"N/A"`, `undefined` → default). No `any` allowed. | `{ challenge: "01.06", normalized: [{ name: "...", email: "..." }, ...] }` |
| 01.07 | Webhook payload → typed command | Accept raw `unknown` data, validate it has expected fields, narrow it into a typed `Command` object. | `{ challenge: "01.07", commands: [{ action: "create", ...payload }] }` |
| 01.08 | Discriminated ApiResponse union | Model `{ status: "success", data }`, `{ status: "validation_error", fields }`, `{ status: "auth_error" }`, `{ status: "rate_limited", retryAfter }`. Show creating and switching on each. | `{ challenge: "01.08", responses: [...one of each type...] }` |
| 01.09 | Safe date parser (no throwing) | Accept `string | number | Date | unknown`, return `Result<Date, string>` — either `{ ok: true, value: Date }` or `{ ok: false, error: "reason" }`. | `{ challenge: "01.09", results: [{ ok: true, value: "2026-..." }, { ok: false, error: "Invalid date" }] }` |
| 01.10 | Format string \| number \| boolean | Use `typeof` narrowing (not casts) to format each type differently: strings in quotes, numbers with 2 decimals, booleans as "yes"/"no". | `{ challenge: "01.10", formatted: ["\"hello\"", "42.00", "yes"] }` |
| 01.11 | Type predicate for array of records with `id` | Write `function hasIds(arr: unknown[]): arr is Array<{ id: string }>` that returns true only if every item has a string `id`. | `{ challenge: "01.11", valid: true/false, items: [...] }` |
| 01.12 | `satisfies` operator for route table | Define a route config object and use `satisfies Record<string, RouteConfig>` so TS validates the shape but preserves the literal keys for autocomplete. | `{ challenge: "01.12", routes: { home: "/", about: "/about", ... } }` |
| 01.13 | Feature flag literal union | Define `type FeatureFlag = "dark_mode" | "beta_ui" | ...`. Write a validator that checks if an unknown string is a valid flag name. | `{ challenge: "01.13", validFlags: [...], invalidFlags: [...] }` |
| 01.14 | Narrow unknown error | Accept `unknown` from a catch block, narrow into `Error`, `AggregateError`, or a fallback `{ message: string, raw: unknown }`. | `{ challenge: "01.14", classified: { type: "Error" | "AggregateError" | "unknown", message: "..." } }` |
| 01.15 | Order checkout state machine | Model states like `cart → checkout → payment → confirmed → shipped`. Only allow valid transitions; invalid ones are compile-time errors where possible. | `{ challenge: "01.15", transitions: [{ from: "cart", to: "checkout", valid: true }] }` |
| 01.16 | Locale lookup map | Define `type Locale = "en" | "fr" | "de" | "es"`. Create a `Record<Locale, string>` so missing a key is a compile error. | `{ challenge: "01.16", translations: { en: "Hello", fr: "Bonjour", de: "Hallo", es: "Hola" } }` |
| 01.17 | Readonly inputs, new objects out | Accept `readonly` arrays/objects, return new copies. Never mutate the input. | `{ challenge: "01.17", original: [...], modified: [...different...] }` |
| 01.18 | Parser for optional values | Distinguish between: key missing, key is `null`, key is `""`, key has a real value. Return a tagged union for each case. | `{ challenge: "01.18", parsed: [{ state: "missing" }, { state: "null" }, { state: "empty" }, { state: "present", value: "x" }] }` |
| 01.19 | Typed event envelope | Create `{ metadata: { id, timestamp, source }, body: NarrowedEvent }` where body is one of several event types narrowed by a discriminant. | `{ challenge: "01.19", envelopes: [{ metadata: {...}, body: { type: "order.created", ... } }] }` |
| 01.20 | Refactor `any` → `unknown` + narrowing | Show a before (uses `any`) and after (uses `unknown` + type guards) — the after version is what you implement. | `{ challenge: "01.20", result: "safely narrowed value" }` |

---

## Section 02: Generics and Utility Types

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 02.01 | Typed `pick` function | `pick(obj, ["key1", "key2"])` → returns new object with only those keys. TypeScript ensures keys exist on obj. | `{ challenge: "02.01", picked: { id: "rec_1", status: "active" } }` |
| 02.02 | Typed `omit` function | `omit(obj, ["secret", "internal"])` → returns object without those keys, types preserved. | `{ challenge: "02.02", omitted: { id: "rec_1", amount: 120 } }` |
| 02.03 | Generic `groupBy` | `groupBy(records, r => r.status)` → `{ active: [...], pending: [...] }` | `{ challenge: "02.03", grouped: { active: [...records], pending: [...records] } }` |
| 02.04 | `keyBy` with duplicate detection | `keyBy(records, "id")` → `{ rec_1: {...}, rec_2: {...} }`. Throws/errors on duplicate keys. | `{ challenge: "02.04", indexed: { rec_1: {...} }, duplicates: [] }` |
| 02.05 | Typed `pluck` | `pluck(records, "amount")` → `[120, 80]` | `{ challenge: "02.05", values: [120, 80] }` |
| 02.06 | DeepReadonly & DeepPartial | Create utility types that work on nested objects. Show that a deeply nested property can't be mutated (DeepReadonly) or can be omitted (DeepPartial). | `{ challenge: "02.06", demo: "types enforced at compile time", partial: {...} }` |
| 02.07 | RequireAtLeastOne | For a patch DTO like `{ name?: string, email?: string }`, ensure at least one field is provided. Empty `{}` is a type error. | `{ challenge: "02.07", valid: { name: "John" }, note: "empty object rejected at compile time" }` |
| 02.08 | `Paths<T>` template literal type | For `{ user: { name: string, address: { city: string } } }`, generate `"user" | "user.name" | "user.address" | "user.address.city"`. | `{ challenge: "02.08", paths: ["user", "user.name", "user.address", "user.address.city"] }` |
| 02.09 | `getByPath` with fallback | `getByPath(obj, "user.address.city", "Unknown")` → returns the nested value or the fallback. | `{ challenge: "02.09", value: "found value or fallback" }` |
| 02.10 | Typed event emitter | `emitter.on("click", (x: number, y: number) => {...})` — events map enforces correct callback signatures. | `{ challenge: "02.10", events: ["click", "resize"], note: "type-safe handlers" }` |
| 02.11 | Typed command bus | Command names map to `{ payload: P, result: R }`. Dispatching `"createUser"` requires the right payload and returns the right result type. | `{ challenge: "02.11", dispatched: { command: "...", result: "..." } }` |
| 02.12 | Generic repository interface | `Repository<User, UserId>` with `findById`, `save`, `delete`. Create an in-memory implementation. | `{ challenge: "02.12", saved: {...}, found: {...} }` |
| 02.13 | Conditional type: Unwrap | `Unwrap<Promise<string>>` → `string`, `Unwrap<Result<number, Error>>` → `number`, `Unwrap<string[]>` → `string`. | `{ challenge: "02.13", unwrapped: "demonstrates type-level unwrapping" }` |
| 02.14 | Function overloads for config parsing | `parseConfig(jsonString)` returns one type, `parseConfig(url)` another, `parseConfig(object)` another. TS picks the right return type. | `{ challenge: "02.14", parsed: { source: "string|url|object", config: {...} } }` |
| 02.15 | Typed `mergeDefaults` | `mergeDefaults(defaults, overrides)` → fills missing fields from defaults. Readonly defaults can't be mutated. | `{ challenge: "02.15", merged: { ...defaults overwritten by provided values } }` |
| 02.16 | Pagination result type (cursor + offset) | Define `CursorPage<T>` and `OffsetPage<T>` with appropriate fields (nextCursor, totalCount, etc.). | `{ challenge: "02.16", page: { items: [...], nextCursor: "abc", hasMore: true } }` |
| 02.17 | DTO mapper (public from private) | Given a domain model with private fields, create a mapper that only exposes public-safe fields. | `{ challenge: "02.17", dto: { id: "...", name: "..." } }` (no passwords, no internal flags) |
| 02.18 | `infer` to extract handler types | Given `{ createUser: (input: CreateInput) => CreateResult }`, extract `CreateInput` and `CreateResult` types using conditional `infer`. | `{ challenge: "02.18", extracted: "type-level demo" }` |
| 02.19 | Branded generic `Id<TName>` | `Id<"Customer">` is a string that can't be used as `Id<"Order">`. Build `customerId()` and `orderId()` constructors. | `{ challenge: "02.19", ids: { customer: "cus_...", order: "ord_..." } }` |
| 02.20 | Feature flag registry with inferred types | Define flags with their value types; the registry infers what `getFlag("darkMode")` returns (boolean vs string vs number). | `{ challenge: "02.20", flags: { darkMode: true, maxRetries: 3 } }` |

---

## Section 03: Runtime Validation and Boundaries

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 03.01 | Zod schema for user registration | Validate `{ email, password, name, age }` with Zod. Return structured errors listing which fields failed and why. | `{ challenge: "03.01", valid: true/false, errors: [{ field: "email", message: "Invalid email" }] }` |
| 03.02 | Validate env → AppConfig | Read env vars, apply defaults, validate types (PORT must be number, NODE_ENV must be "dev"\|"prod"\|"test"). | `{ challenge: "03.02", config: { port: 3000, env: "prod", dbUrl: "..." } }` |
| 03.03 | Parse unknown JSON → domain event | Take raw string, JSON.parse it, validate shape, return typed domain event or error. Raw data never leaks. | `{ challenge: "03.03", event: { type: "order.created", orderId: "..." } }` |
| 03.04 | `safeJsonParse` → Result | `safeJsonParse(str)` → `{ ok: true, value }` or `{ ok: false, error: "..." }`. Never throws. | `{ challenge: "03.04", result: { ok: true, value: {...} } }` |
| 03.05 | External DTO → internal aggregate | Map API response fields (camelCase, different names) to your internal domain model. | `{ challenge: "03.05", customer: { id: "...", fullName: "...", isActive: true } }` |
| 03.06 | Strip unknown properties | Given an object with extra fields, return only the known/allowed fields. Prevents data leakage. | `{ challenge: "03.06", clean: { id: "rec_1", name: "..." } }` (no extra fields) |
| 03.07 | Validate webhook payload shape | Check that incoming data has `headers`, `body`, `timestamp`, `signature` — all correct types — before trying crypto verification. | `{ challenge: "03.07", valid: true/false, reason: "..." }` |
| 03.08 | Normalize date strings → ISO | Accept "2024-01-15", "Jan 15 2024", timestamps, etc. Return ISO string or error. | `{ challenge: "03.08", dates: ["2024-01-15T00:00:00.000Z", ...] }` |
| 03.09 | Validate paginated query params | `{ limit: "10", cursor: "abc", sort: "name", direction: "asc" }` → validated and typed object. | `{ challenge: "03.09", query: { limit: 10, cursor: "abc", sort: "name", direction: "asc" } }` |
| 03.10 | Reusable validation error formatting | Turn Zod/validation errors into a consistent API error response format. | `{ challenge: "03.10", apiError: { code: "VALIDATION", fields: [...] } }` |
| 03.11 | Validate nested order payload | Check items array, quantities > 0, valid product IDs. Count invalid fields. | `{ challenge: "03.11", valid: false, invalidFieldCount: 3, details: [...] }` |
| 03.12 | Legacy + current payload → one command | Accept either old format `{ customer_name }` or new `{ customerName }` and produce the same typed command. | `{ challenge: "03.12", command: { customerName: "..." } }` |
| 03.13 | Optional filters: empty string → undefined | Schema where `{ search: "" }` becomes `{ search: undefined }` so downstream code doesn't filter on empty. | `{ challenge: "03.13", filters: { search: undefined, status: "active" } }` |
| 03.14 | Validate file upload metadata | Check mime type is allowed, size < max, extension matches mime, owner id is valid. | `{ challenge: "03.14", valid: true/false, issues: ["size exceeds limit"] }` |
| 03.15 | Response serializer with redaction | Before sending to client, replace email with `"***@***.com"` and token with `"[REDACTED]"`. | `{ challenge: "03.15", response: { name: "John", email: "***@***.com", token: "[REDACTED]" } }` |
| 03.16 | Boundary mapper with logging context | When validation fails, preserve what field failed, what value was received, and what was expected — for internal logs only. | `{ challenge: "03.16", log: { field: "age", received: "abc", expected: "number" } }` |
| 03.17 | Validate feature flag config from JSON | Ensure each flag has name, type, defaultValue, and optional rollout percentage. | `{ challenge: "03.17", flags: [{ name: "dark_mode", valid: true }] }` |
| 03.18 | Enum parser for role/status/priority | Accept unknown string, check if it's one of allowed values, return typed result or error. | `{ challenge: "03.18", role: "admin", status: "active", priority: "high" }` |
| 03.19 | Reject prototype pollution keys | When parsing user input, reject keys like `__proto__`, `constructor`, `prototype`. | `{ challenge: "03.19", safe: true, rejected: ["__proto__"] }` |
| 03.20 | Schema-driven test data factory | Given a Zod schema, auto-generate valid test data that satisfies all constraints. | `{ challenge: "03.20", generated: { email: "test@example.com", age: 25, ... } }` |

---

## Section 04: Collections and Data Transformations

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 04.01 | Deduplicate by email, keep newest | Given records with duplicate emails, keep only the one with the latest `updatedAt`. | `{ challenge: "04.01", unique: [{ email: "a@b.com", updatedAt: "latest..." }] }` |
| 04.02 | Normalize into entities + ids | Convert `[{id:"1",...}, {id:"2",...}]` into `{ entities: { "1": {...}, "2": {...} }, ids: ["1","2"] }` for O(1) lookups. | `{ challenge: "04.02", entities: {...}, ids: [...] }` |
| 04.03 | Group payments, sum by customer | Group records by customerId, sum the amounts for those with status "active". | `{ challenge: "04.03", totals: { cus_1: 120, cus_2: 80 } }` |
| 04.04 | Join orders + customers (no mutation) | Match orders to customers by customerId, produce combined objects without changing originals. | `{ challenge: "04.04", joined: [{ orderId: "...", customerName: "..." }] }` |
| 04.05 | Immutable update in array | Replace one item in a readonly array by id, return a new array. Original unchanged. | `{ challenge: "04.05", updated: [...with one item replaced...] }` |
| 04.06 | Diff two snapshots | Compare old and new arrays of records. Return `{ added: [...ids], removed: [...ids], changed: [...ids] }`. | `{ challenge: "04.06", diff: { added: [], removed: [], changed: [] } }` |
| 04.07 | Aggregate inventory movements | Given movements like `{ productId, qty: +10 }` and `{ productId, qty: -3 }`, compute current stock per product. | `{ challenge: "04.07", stock: { prod_1: 7, prod_2: 20 } }` |
| 04.08 | Flat list → tree | Given `[{ id, parentId, name }]`, build `{ id, name, children: [...] }` tree structure. | `{ challenge: "04.08", tree: [{ id: "root", children: [...] }] }` |
| 04.09 | Tree → flat rows with depth | Flatten a tree back into rows like `[{ id, name, depth: 0 }, { id, name, depth: 1 }]` for rendering. | `{ challenge: "04.09", rows: [{ id: "...", depth: 0 }, ...] }` |
| 04.10 | Stable multi-key sort | Sort by amount DESC, then by id ASC. Must be stable (equal items keep original order). | `{ challenge: "04.10", sorted: [...records in correct order...] }` |
| 04.11 | Partition into pass/fail | Split records into two arrays based on a predicate (e.g., amount > 100). | `{ challenge: "04.11", pass: [...], fail: [...] }` |
| 04.12 | Tag frequency counter (Map) | Count how often each tag appears across all records. | `{ challenge: "04.12", frequencies: { priority: 1, paid: 1, trial: 1 } }` |
| 04.13 | Sliding window for active sessions | Given timestamped events, count how many sessions were active in each time window. | `{ challenge: "04.13", windows: [{ start: "...", count: 3 }] }` |
| 04.14 | Merge partial updates (skip undefined) | Given an entity and a partial update `{ name: "new" }`, merge without overwriting fields with undefined. | `{ challenge: "04.14", merged: { id: "rec_1", name: "new", amount: 120 } }` |
| 04.15 | Top K without full sort | Find the K largest items by amount without sorting the entire array (use a min-heap or selection). | `{ challenge: "04.15", topK: [{ id: "rec_1", amount: 120 }] }` |
| 04.16 | Batch by size and max bytes | Split records into batches of max N items or max M bytes of JSON. | `{ challenge: "04.16", batches: [[...batch1...], [...batch2...]] }` |
| 04.17 | Detect duplicate compound keys | Find records where `customerId + productId` combination appears more than once. | `{ challenge: "04.17", duplicates: [{ customerId: "...", productId: "..." }] }` |
| 04.18 | Typed transform pipeline | Chain steps: filter → map → sort. Each step has typed in/out. | `{ challenge: "04.18", result: [...transformed records...] }` |
| 04.19 | Reconciliation report | Compare source records vs target records: find matches, source-only, target-only, mismatches. | `{ challenge: "04.19", report: { matched: 5, sourceOnly: 2, targetOnly: 1 } }` |
| 04.20 | Stable cursor pagination | Given a sorted array, return page N with `limit` items and a cursor for the next page. | `{ challenge: "04.20", page: { items: [...], nextCursor: "..." } }` |

---

## Section 05: Async, Promises, and Concurrency

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 05.01 | Promise pool (concurrency limit) | Run N async tasks but only M at a time. Results must be in original order. | `{ challenge: "05.01", results: [...in order...], maxConcurrent: 3 }` |
| 05.02 | Retry with exponential backoff | Retry failed async calls: 1s, 2s, 4s... Stop after max retries or if error is non-retryable. | `{ challenge: "05.02", attempts: 3, finalResult: "success" }` |
| 05.03 | Promise + timeout + AbortSignal | Wrap any promise so it rejects after X ms or when signal is aborted. | `{ challenge: "05.03", timedOut: true/false }` |
| 05.04 | Abortable delay | `delay(1000, signal)` — resolves after 1s or rejects immediately if signal aborts. | `{ challenge: "05.04", aborted: true/false }` |
| 05.05 | Async debounce | Only the last call's result is returned if called rapidly. Previous calls are discarded. | `{ challenge: "05.05", callCount: 5, resultCount: 1 }` |
| 05.06 | Throttle (leading/trailing) | At most one execution per time window. Leading = fire immediately. Trailing = fire at end. | `{ challenge: "05.06", executions: [...timestamps...] }` |
| 05.07 | Async queue with iterator | `queue.push(item)`, `queue.close()`, `for await (const item of queue) {...}`. | `{ challenge: "05.07", consumed: [...items in order...] }` |
| 05.08 | Token bucket rate limiter | Allow N requests per second. Tokens refill over time. | `{ challenge: "05.08", allowed: 10, denied: 5 }` |
| 05.09 | Paginated fetch with cancellation | Keep fetching pages until no cursor; stop early if AbortSignal fires. | `{ challenge: "05.09", pages: 3, totalRecords: 75 }` |
| 05.10 | Collect fulfilled + failures | Run tasks, return `{ successes: [...], failures: [...] }` — don't stop on first error. | `{ challenge: "05.10", successes: [...], failures: [...] }` |
| 05.11 | Circuit breaker | After 5 failures → open (reject immediately). After 30s → half-open (try one). Success → close. | `{ challenge: "05.11", state: "open" | "closed" | "half-open" }` |
| 05.12 | Bulkhead per tenant | Each tenant gets max M concurrent operations. Others queue. | `{ challenge: "05.12", tenant1Concurrent: 3, tenant2Concurrent: 3 }` |
| 05.13 | Idempotent job runner | If same job key is submitted twice, only run once. Return cached result for duplicates. | `{ challenge: "05.13", executed: 1, deduplicated: 1 }` |
| 05.14 | Non-overlapping interval scheduler | Run task every 5s, but if previous run is still going, skip (don't stack). | `{ challenge: "05.14", runs: 3, skipped: 1 }` |
| 05.15 | Timeout-aware mutex | `await mutex.acquire(timeout)` — if lock isn't available within timeout, reject. | `{ challenge: "05.15", acquired: true/false, timedOut: true/false }` |
| 05.16 | Request coalescer | Multiple callers requesting same key → share one in-flight promise, all get same result. | `{ challenge: "05.16", fetchCalls: 1, consumers: 5 }` |
| 05.17 | AsyncIterable mapper with concurrency | Map over async iterable items with max N concurrent transforms. | `{ challenge: "05.17", mapped: [...results...] }` |
| 05.18 | Parent → child AbortSignal propagation | When parent signal aborts, all child operations also abort. | `{ challenge: "05.18", allAborted: true }` |
| 05.19 | Graceful shutdown (drain vs force) | Drain mode: finish current jobs then stop. Force mode: stop immediately. | `{ challenge: "05.19", mode: "drain", completed: 5, abandoned: 0 }` |
| 05.20 | Retry only idempotent operations | Mark operations as safe/unsafe to retry. Only retry the safe ones. | `{ challenge: "05.20", retried: ["GET /users"], notRetried: ["POST /orders"] }` |

---

## Section 06: Error Handling and Result Types

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 06.01 | Result: ok, err, isOk, isErr | Implement the four helpers. `ok(42)` → `{ ok: true, value: 42 }`. `isOk(result)` narrows type. | `{ challenge: "06.01", results: [{ ok: true, value: 42 }, { ok: false, error: "fail" }] }` |
| 06.02 | map, mapError, flatMap for Result | `map(result, x => x * 2)` transforms the ok value. `flatMap` chains Results. | `{ challenge: "06.02", mapped: { ok: true, value: 84 } }` |
| 06.03 | Wrap sync exceptions → Result | `tryCatch(() => riskyOp())` → Result instead of try/catch. | `{ challenge: "06.03", result: { ok: false, error: { message: "..." } } }` |
| 06.04 | Wrap async exceptions → Result | Same but for `async` functions: `tryAsync(async () => {...})`. | `{ challenge: "06.04", result: { ok: true, value: "data" } }` |
| 06.05 | Classify unknown errors | Given catch block error, categorize into: validation, auth, timeout, dependency, unknown. | `{ challenge: "06.05", classified: { category: "timeout", retryable: true } }` |
| 06.06 | BaseAppError class | Custom error class with `code`, `retryable`, `statusCode`, `cause`. | `{ challenge: "06.06", error: { code: "NOT_FOUND", statusCode: 404, retryable: false } }` |
| 06.07 | Domain errors → public API errors | Map internal `NotFoundError` → `{ status: 404, message: "Resource not found" }`. Never expose internal details. | `{ challenge: "06.07", publicError: { status: 404, message: "Not found" } }` |
| 06.08 | Validation error collector | Collect all field errors (not just first). Result: `{ field: "email", errors: ["required", "invalid format"] }`. | `{ challenge: "06.08", fieldErrors: [{ field: "...", errors: [...] }] }` |
| 06.09 | Retry decision from error metadata | Given error code/type, decide: retry now, retry later, or don't retry. | `{ challenge: "06.09", decision: "retry" | "skip" | "delay" }` |
| 06.10 | Error boundary for background jobs | Wrap job execution so errors never crash the process — just log and return failure result. | `{ challenge: "06.10", jobResult: { ok: false, error: "job failed safely" } }` |
| 06.11 | Aggregate validation failures | Combine multiple field errors into one error object with all details. | `{ challenge: "06.11", aggregated: { fieldCount: 3, errors: [...] } }` |
| 06.12 | Result pipe (chain operations) | `pipe(parseInput, validate, transform)` — each returns Result; stops on first error. | `{ challenge: "06.12", pipeResult: { ok: true, value: "final" } }` |
| 06.13 | Safe fallback (only for expected codes) | If error code is "NOT_FOUND", return default. For other errors, re-throw. | `{ challenge: "06.13", value: "default or real value" }` |
| 06.14 | HTTP errors → dependency failures | `fetch` throws → convert to `{ type: "dependency", service: "payments", status: 503 }`. | `{ challenge: "06.14", failure: { type: "dependency", service: "..." } }` |
| 06.15 | Redacted error serializer | Serialize errors for logging but remove any `token`, `password`, `secret` fields from metadata. | `{ challenge: "06.15", serialized: { message: "...", metadata: { token: "[REDACTED]" } } }` |
| 06.16 | assertOk for tests | `assertOk(result)` unwraps to value or throws with useful context about the error. | `{ challenge: "06.16", unwrapped: "the value" }` |
| 06.17 | Checkout error union | `OutOfStockError | PaymentDeclinedError | AddressInvalidError` — each with relevant fields. | `{ challenge: "06.17", errors: [{ type: "out_of_stock", productId: "..." }] }` |
| 06.18 | Error registry with docs | Map error codes to human-readable docs: `{ "E001": { title: "Not Found", description: "..." } }`. | `{ challenge: "06.18", registry: { E001: { title: "...", description: "..." } } }` |
| 06.19 | Error sampling for noisy logs | Log only 1 in 100 of a frequent error. Always log errors seen < 5 times. | `{ challenge: "06.19", logged: 5, suppressed: 95 }` |
| 06.20 | Migrate throw → Result | Refactor a function that throws into one that returns Result. Show before/after behavior. | `{ challenge: "06.20", before: "throws", after: { ok: false, error: "..." } }` |

---

## Section 07: Node.js Files, Streams, and Buffers

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 07.01 | Read JSON config safely | Read file, parse JSON, validate shape. Handle file-not-found and invalid JSON gracefully. | `{ challenge: "07.01", config: {...} or error }` |
| 07.02 | Atomic JSON write | Write to temp file first, then rename. If crash happens mid-write, original file is safe. | `{ challenge: "07.02", written: true, atomic: true }` |
| 07.03 | Line reader for large files (streams) | Use `readline` or stream transforms to read line-by-line without loading whole file. | `{ challenge: "07.03", lineCount: 1000, memoryEfficient: true }` |
| 07.04 | Parse CSV stream → typed rows | Stream CSV, validate each row, collect errors separately from valid data. | `{ challenge: "07.04", validRows: [...], errors: [...] }` |
| 07.05 | SHA-256 hash without loading all | Stream file through crypto hash — works on 10GB files without memory issues. | `{ challenge: "07.05", hash: "abc123..." }` |
| 07.06 | Safe path resolver (no traversal) | `resolve("../../etc/passwd")` → REJECTED. Only allow paths within base folder. | `{ challenge: "07.06", safe: true/false, resolved: "..." }` |
| 07.07 | Rotating log file names | Generate names like `app.2026-04-30.log`, `app.2026-04-30.1.log` when file is too big. | `{ challenge: "07.07", filename: "app.2026-04-30.log" }` |
| 07.08 | Readable stream → async iterable | Convert `stream.Readable` to `for await (const chunk of stream) {...}`. | `{ challenge: "07.08", chunks: [...] }` |
| 07.09 | Transform stream: redact tokens | A stream that replaces `Bearer xyz123` with `Bearer [REDACTED]` on the fly. | `{ challenge: "07.09", output: "...Bearer [REDACTED]..." }` |
| 07.10 | File upload validator | Before writing, check: size ≤ max, mime type allowed, filename safe. | `{ challenge: "07.10", allowed: true/false, reasons: [...] }` |
| 07.11 | Temp file cleanup on failure | If processing fails, delete any temp files that were created. | `{ challenge: "07.11", cleanedUp: true }` |
| 07.12 | Recursive directory listing | Walk a directory tree, return `[{ path, size, isDir }]` for all files. | `{ challenge: "07.12", files: [{ path: "...", size: 1024 }] }` |
| 07.13 | Binary protocol encoder/decoder | Encode `{ type: 1, length: 5, data: "hello" }` into a Buffer; decode it back. | `{ challenge: "07.13", encoded: Buffer, decoded: { type: 1, ... } }` |
| 07.14 | Backpressure-aware stream copy | Copy stream A to stream B, pausing reads when B is full. | `{ challenge: "07.14", copied: true, backpressureHandled: true }` |
| 07.15 | File lock with stale detection | Create `.lock` file. If lock exists but is > 60s old, consider it stale and take over. | `{ challenge: "07.15", locked: true, staleDetected: false }` |
| 07.16 | Watch folder + debounce rebuilds | Watch for file changes, but only trigger rebuild once per 500ms burst of changes. | `{ challenge: "07.16", rebuilds: 1, changes: 10 }` |
| 07.17 | Checksum manifest | Generate `{ "file1.js": "sha256:abc...", "file2.css": "sha256:def..." }` for all built files. | `{ challenge: "07.17", manifest: { "file.js": "sha256:..." } }` |
| 07.18 | Safe delete (workspace boundary) | `safeDelete("/outside/path")` → REJECTED. Only delete inside workspace root. | `{ challenge: "07.18", deleted: false, reason: "outside workspace" }` |
| 07.19 | Gzip compress/decompress streams | Pipe through zlib gzip/gunzip. | `{ challenge: "07.19", compressed: true, originalSize: 1000, compressedSize: 200 }` |
| 07.20 | Fixture loader (relative to module) | Load test fixtures from `__fixtures__/` folder relative to the test file. | `{ challenge: "07.20", fixture: {...loaded data...} }` |

---

## Section 08: HTTP Clients and API SDKs

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 08.01 | Typed fetch wrapper → Result | Wrap `fetch`, parse JSON, return `Result<T, ApiError>` for non-2xx. | `{ challenge: "08.01", result: { ok: true, value: {...} } }` |
| 08.02 | URL builder (encode params safely) | `buildUrl("/users/:id", { id: "123" }, { search: "john doe" })` → `"/users/123?search=john%20doe"` | `{ challenge: "08.02", url: "/users/123?search=john%20doe" }` |
| 08.03 | POST retry with idempotency key | Add `Idempotency-Key` header so retrying a POST doesn't create duplicates. | `{ challenge: "08.03", retries: 2, idempotencyKey: "uuid-..." }` |
| 08.04 | API client with injected fetch | Class that takes `fetch` as constructor param → easy to mock in tests. | `{ challenge: "08.04", testable: true }` |
| 08.05 | Auto-refresh token on 401 | If response is 401, refresh token, retry the original request once. | `{ challenge: "08.05", refreshed: true, finalStatus: 200 }` |
| 08.06 | Cursor pagination as AsyncIterable | `for await (const page of client.listUsers())` — fetches pages automatically. | `{ challenge: "08.06", totalPages: 3, allItems: [...] }` |
| 08.07 | Handle Retry-After header | When 429 is received, wait for `Retry-After` seconds before retrying. | `{ challenge: "08.07", waited: 5, retried: true }` |
| 08.08 | Request/response logging (redacted) | Log URL, method, status — but mask `Authorization` header value. | `{ challenge: "08.08", log: { url: "...", auth: "[REDACTED]" } }` |
| 08.09 | Validate response with Zod | Parse response body through Zod schema before returning. Invalid → error. | `{ challenge: "08.09", validated: true, data: {...} }` |
| 08.10 | Typed endpoint definitions | `endpoints.getUser` knows input is `{ id: string }` and output is `User`. | `{ challenge: "08.10", endpoints: ["getUser", "listOrders"] }` |
| 08.11 | Multipart upload prep | Build FormData-like metadata: filename, content-type, size, part number. | `{ challenge: "08.11", parts: [{ filename: "...", size: 1024 }] }` |
| 08.12 | Client-side GET cache (TTL + stale) | Cache responses for 60s. After TTL, serve stale while fetching fresh in background. | `{ challenge: "08.12", cached: true, stale: false }` |
| 08.13 | AbortSignal cancellation | Pass `AbortSignal` to fetch calls; cancelled requests reject with `AbortError`. | `{ challenge: "08.13", aborted: true }` |
| 08.14 | Circuit breaker for API calls | Wrap API calls; after N failures, stop calling and fail fast. | `{ challenge: "08.14", state: "open", failedFast: true }` |
| 08.15 | Map API errors → domain errors | `{ status: 404 }` → `NotFoundError`. `{ status: 503 }` → `DependencyError`. | `{ challenge: "08.15", mapped: { type: "NotFound" } }` |
| 08.16 | Webhook sender with signing | Send POST with `X-Signature` header (HMAC of body). Include retry count. | `{ challenge: "08.16", signed: true, signature: "sha256=..." }` |
| 08.17 | Fetch fake for tests | Fake that returns pre-programmed responses in order. Assert request details. | `{ challenge: "08.17", responses: [...], assertions: "passed" }` |
| 08.18 | Batch large requests | Split 1000 items into 10 requests of 100, merge all responses. | `{ challenge: "08.18", batches: 10, totalItems: 1000 }` |
| 08.19 | Timeout metrics | Measure how long each API call takes. Classify: fast (<100ms), normal, slow (>2s). | `{ challenge: "08.19", latency: "normal", durationMs: 450 }` |
| 08.20 | SDK docs from endpoint definitions | Generate documentation metadata from typed endpoint configs. | `{ challenge: "08.20", docs: [{ method: "GET", path: "/users", description: "..." }] }` |

---

## Section 09: Domain Modeling and Design Patterns

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 09.01 | Money value object | `Money.of(100, "USD").add(Money.of(50, "USD"))` → `Money(150, USD)`. Reject mixed currencies. | `{ challenge: "09.01", total: { amount: 150, currency: "USD" } }` |
| 09.02 | Order aggregate with valid transitions | Order can go `draft → confirmed → shipped → delivered`. Cannot skip or go backwards. | `{ challenge: "09.02", order: { status: "confirmed" }, transitionValid: true }` |
| 09.03 | Repository interface + in-memory impl | Define `interface OrderRepo { findById, save, delete }`. Implement with a Map for tests. | `{ challenge: "09.03", saved: true, found: { id: "..." } }` |
| 09.04 | Service layer (repo + clock + logger) | Service coordinates multiple dependencies. All injected, no global state. | `{ challenge: "09.04", result: "order created", logged: true }` |
| 09.05 | Factory for valid Customer entities | `CustomerFactory.create({...})` validates all fields; returns Result, not half-built object. | `{ challenge: "09.05", customer: { id: "...", valid: true } }` |
| 09.06 | Strategy pattern: shipping cost | Different strategies: flat rate, weight-based, free over $100. Swap at runtime. | `{ challenge: "09.06", cost: 12.99, strategy: "weight-based" }` |
| 09.07 | Command pattern with undo | `CheckoutCommand.execute()` does the work; stores undo data to reverse it. | `{ challenge: "09.07", executed: true, undoable: true }` |
| 09.08 | Observer: domain event publishing | When order is created, notify inventory service and email service (listeners). | `{ challenge: "09.08", notified: ["inventory", "email"] }` |
| 09.09 | Dependency injection (constructor) | Service receives all dependencies through constructor. No `new` inside the service. | `{ challenge: "09.09", injected: ["repo", "logger", "clock"] }` |
| 09.10 | Policy object for auth checks | `OrderPolicy.canCancel(user, order)` → true/false based on role and order state. | `{ challenge: "09.10", allowed: true, reason: "owner can cancel pending orders" }` |
| 09.11 | Specification pattern for filtering | `ActiveOrderSpec.and(HighValueSpec)` → composable filter logic. | `{ challenge: "09.11", matching: [...filtered orders...] }` |
| 09.12 | Unit of Work | Group multiple repo saves into one transaction. All succeed or all rollback. | `{ challenge: "09.12", committed: true, operations: 3 }` |
| 09.13 | Persistence ↔ domain mapper | Convert DB row (snake_case, raw types) → domain object (camelCase, value objects). | `{ challenge: "09.13", domain: { customerId: "...", fullName: "..." } }` |
| 09.14 | Enforce invariants in constructors | `new Email("bad")` throws. `new Email("a@b.com")` succeeds. Invalid objects can't exist. | `{ challenge: "09.14", valid: true, email: "a@b.com" }` |
| 09.15 | Support ticket state machine | `open → in_progress → waiting → resolved → closed`. Track transitions. | `{ challenge: "09.15", currentState: "in_progress", history: [...] }` |
| 09.16 | Composition over inheritance | Instead of `class AdminService extends BaseService`, use mixins or composed helpers. | `{ challenge: "09.16", approach: "composition", behaviors: ["logging", "validation"] }` |
| 09.17 | Plugin registry for payments | Register `StripePlugin`, `PayPalPlugin`. Lookup by name at runtime. | `{ challenge: "09.17", providers: ["stripe", "paypal"], active: "stripe" }` |
| 09.18 | Anti-corruption layer for legacy API | Translate legacy API's weird field names into your clean domain model. | `{ challenge: "09.18", translated: { name: "John" } }` (from `{ cust_nm: "John" }`) |
| 09.19 | Domain event serialization | Serialize event to JSON for a queue; deserialize back with correct types. | `{ challenge: "09.19", serialized: "...", deserialized: { type: "order.created" } }` |
| 09.20 | Refactor god function → services | Break a 200-line function into focused services: validation, calculation, persistence. | `{ challenge: "09.20", services: ["validator", "calculator", "persister"] }` |

---

## Section 10: Testing, Mocking, and Testability

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 10.01 | Test data builder | `CustomerBuilder.default().withName("Bob").build()` → valid Customer object. | `{ challenge: "10.01", customer: { name: "Bob", email: "default@test.com" } }` |
| 10.02 | Table-driven tests for discount | `[{ input: 100, discount: 10, expected: 90 }, ...]` — one test covers all cases. | `{ challenge: "10.02", cases: [...], allPassed: true }` |
| 10.03 | Fake timers for retry testing | Use `vi.useFakeTimers()` to advance time without real waiting. | `{ challenge: "10.03", retries: 3, totalTimeSimulated: "30s" }` |
| 10.04 | Fake repo (records saves) | In tests, verify what was saved without a real database. | `{ challenge: "10.04", saved: [{ id: "...", name: "..." }] }` |
| 10.05 | Mock fetch (ordered responses) | First call returns 200, second returns 500. Assert URLs and headers. | `{ challenge: "10.05", calls: [{ url: "...", status: 200 }] }` |
| 10.06 | Test async queue (no sleeps) | Test queue behavior deterministically without `setTimeout` waits. | `{ challenge: "10.06", processed: [...], deterministic: true }` |
| 10.07 | Shared contract tests | One test suite, run against InMemoryRepo AND PostgresRepo — both must pass. | `{ challenge: "10.07", implementations: ["memory", "postgres"], allPass: true }` |
| 10.08 | Snapshot-safe serializer | Remove `createdAt`, `updatedAt`, random IDs before snapshot comparison. | `{ challenge: "10.08", stable: { name: "John", status: "active" } }` |
| 10.09 | Test errors without brittle messages | Assert error type/code, not the exact string message (which may change). | `{ challenge: "10.09", errorCode: "NOT_FOUND", messageIgnored: true }` |
| 10.10 | Assert Result ok/err helpers | `expectOk(result)` unwraps and returns value. `expectErr(result)` unwraps error. Both throw helpful messages on wrong state. | `{ challenge: "10.10", value: "unwrapped" }` |
| 10.11 | Readable fixture factory | Generate test data that's self-documenting: `order({ status: "shipped", items: 3 })`. | `{ challenge: "10.11", fixture: { status: "shipped", items: [...3 items...] } }` |
| 10.12 | Test with injected clock/logger/id | Pass fake clock (fixed time), fake logger (captures logs), fake ID gen (predictable IDs). | `{ challenge: "10.12", time: "2026-01-01", id: "test-id-1", logs: [...] }` |
| 10.13 | Spy on event publishing | Assert that `eventBus.publish` was called with correct event type and payload. | `{ challenge: "10.13", published: [{ type: "order.created", orderId: "..." }] }` |
| 10.14 | Property tests (numeric ranges) | Test that `clamp(x, min, max)` always returns a value between min and max for any input. | `{ challenge: "10.14", property: "result always in range", holds: true }` |
| 10.15 | Test stream transform (in-memory) | Create streams from strings, pipe through transform, collect output. No files needed. | `{ challenge: "10.15", input: "secret=abc", output: "secret=[REDACTED]" }` |
| 10.16 | Mock metrics recorder | Assert that `metrics.increment("orders.created")` was called exactly once. | `{ challenge: "10.16", metrics: [{ name: "orders.created", count: 1 }] }` |
| 10.17 | Test helpers for AbortSignal | Create a signal, abort it, assert operations rejected with AbortError. | `{ challenge: "10.17", aborted: true, errorType: "AbortError" }` |
| 10.18 | Fake timers for cache expiration | Set item, advance time past TTL, assert item is gone. | `{ challenge: "10.18", beforeTTL: "hit", afterTTL: "miss" }` |
| 10.19 | Integration test of composed use case | Test the full flow: input → validate → process → persist → respond. | `{ challenge: "10.19", flow: "complete", result: "success" }` |
| 10.20 | Refactor untestable → testable | Extract hard-coded dependencies into injectable interfaces. | `{ challenge: "10.20", before: "untestable", after: "fully mockable" }` |

---

## Section 11: Config, Logging, and Observability

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 11.01 | Env vars → typed config | Parse `PORT`, `DB_URL`, `LOG_LEVEL` into typed object. Fail fast on missing required vars. | `{ challenge: "11.01", config: { port: 3000, dbUrl: "...", logLevel: "info" } }` |
| 11.02 | Structured logger with child contexts | `logger.child({ requestId: "abc" }).info("done")` → JSON with merged context fields. | `{ challenge: "11.02", log: { level: "info", msg: "done", requestId: "abc" } }` |
| 11.03 | Recursive redaction of secrets | Deep-walk objects, replace any `password`, `token`, `apiKey`, `authorization` field with `"[REDACTED]"`. | `{ challenge: "11.03", redacted: { user: "john", password: "[REDACTED]" } }` |
| 11.04 | Correlation ID propagation | Generate ID at request entry, pass it through all service calls for tracing. | `{ challenge: "11.04", correlationId: "uuid-...", propagated: true }` |
| 11.05 | Metrics recorder (in-memory for tests) | `metrics.increment("requests")`, `metrics.histogram("latency", 42)`. Queryable in tests. | `{ challenge: "11.05", counters: { requests: 5 }, histograms: { latency: [42, 50] } }` |
| 11.06 | Latency histogram for async ops | Wrap any async function, record how long it takes. | `{ challenge: "11.06", operation: "fetchUser", durationMs: 150 }` |
| 11.07 | Tracing span helper | `span("processOrder", () => {...})` records start, end, status, and any error. | `{ challenge: "11.07", span: { name: "processOrder", status: "ok", durationMs: 50 } }` |
| 11.08 | Health check aggregator | Check DB, Redis, external API. Report overall: healthy only if all pass. | `{ challenge: "11.08", healthy: true, checks: { db: "ok", redis: "ok" } }` |
| 11.09 | Graceful shutdown hooks | Register shutdown handlers for HTTP, queue, DB. Execute in order on SIGTERM. | `{ challenge: "11.09", shutdownOrder: ["http", "queue", "db"] }` |
| 11.10 | Startup diagnostics (no secrets) | Log version, env, connected services — but mask connection string passwords. | `{ challenge: "11.10", report: { version: "1.0", env: "prod", db: "connected" } }` |
| 11.11 | Log sampling (keep errors) | For "request.completed" events, log only 1%. Always log errors. | `{ challenge: "11.11", sampled: 1, total: 100, errorsKept: "all" }` |
| 11.12 | Stable JSON line formatter | Output one JSON object per line, keys in consistent order. | `{ challenge: "11.12", line: '{"level":"info","msg":"hello","ts":"..."}' }` |
| 11.13 | Contextual logging (no globals) | Pass logger through function params, not a global `import logger`. | `{ challenge: "11.13", approach: "injection", globalState: false }` |
| 11.14 | Slow operation detector | If operation takes > threshold (e.g., 2s), emit a warning log. | `{ challenge: "11.14", slow: true, durationMs: 3000, threshold: 2000 }` |
| 11.15 | Audit event writer | Immutable events: `{ actor, action, resource, timestamp }`. Cannot be modified after creation. | `{ challenge: "11.15", event: { actor: "user_1", action: "delete", resource: "order_5" } }` |
| 11.16 | Feature flag evaluation logging | Log which flag was checked, result, and user context — but hash user email for privacy. | `{ challenge: "11.16", log: { flag: "beta_ui", result: true, userHash: "a1b2c3" } }` |
| 11.17 | Dependency health cache (TTL) | Don't ping DB every request. Cache health status for 30s. | `{ challenge: "11.17", cached: true, lastCheck: "30s ago" }` |
| 11.18 | Error → metric classifier | `ValidationError` → increment `errors.validation`. `TimeoutError` → increment `errors.timeout`. | `{ challenge: "11.18", metric: "errors.validation", count: 1 }` |
| 11.19 | Request lifecycle context | Object that tracks: start time, user, correlationId, accumulated logs. Passed through handlers. | `{ challenge: "11.19", context: { startedAt: "...", userId: "...", correlationId: "..." } }` |
| 11.20 | Background job observability | Jobs emit: started, completed, failed metrics. Include job name and duration. | `{ challenge: "11.20", metrics: { started: 10, completed: 8, failed: 2 } }` |

---

## Section 12: Performance, Caching, and Memory

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 12.01 | LRU cache | When full, evict least recently used. `get` makes item most-recent. | `{ challenge: "12.01", cache: { size: 3, evicted: "oldest_key" } }` |
| 12.02 | TTL cache (injected clock) | Items expire after N ms. Use fake clock for testability. | `{ challenge: "12.02", hit: "value", afterTTL: undefined }` |
| 12.03 | Memoize pure functions | Cache results based on arguments. Same args → same result without re-computing. | `{ challenge: "12.03", calls: 1, results: 3 }` (called once, returned 3 times) |
| 12.04 | DataLoader-style batcher | Multiple `load(id)` calls in one tick → one batch `loadMany([...ids])` call. | `{ challenge: "12.04", batchCalls: 1, individualRequests: 5 }` |
| 12.05 | Eliminate N+1 | Instead of 100 separate DB calls, batch into one `SELECT ... WHERE id IN (...)`. | `{ challenge: "12.05", queries: 1, items: 100 }` |
| 12.06 | Measure duration (injectable timing) | Wrap function, record how long it takes using injected `now()` function. | `{ challenge: "12.06", durationMs: 150 }` |
| 12.07 | WeakMap memoization | Memoize by object reference. When object is GC'd, cache entry is freed too. | `{ challenge: "12.07", memoryLeak: false }` |
| 12.08 | Bounded queue (backpressure) | Queue rejects/waits when it has > N items. Prevents memory overflow. | `{ challenge: "12.08", maxSize: 100, rejected: 5 }` |
| 12.09 | Stale-while-revalidate | Serve cached value immediately (even if stale), refresh in background. | `{ challenge: "12.09", served: "stale", refreshing: true }` |
| 12.10 | Tenant-safe cache keys | `tenant_A:users:123` and `tenant_B:users:123` are different cache entries. | `{ challenge: "12.10", key: "tenant_demo:users:rec_1" }` |
| 12.11 | Yield to event loop | Process items in chunks of 100, then `await nextTick()` so other work can proceed. | `{ challenge: "12.11", processed: 1000, yielded: 10 }` |
| 12.12 | Memory-safe pagination | Process page by page, don't load all 1M rows at once. | `{ challenge: "12.12", pages: 100, maxMemoryItems: 1000 }` |
| 12.13 | TopK for large streams | Maintain a fixed-size heap as data streams in. Memory stays constant. | `{ challenge: "12.13", topK: [...10 largest...], memoryBounded: true }` |
| 12.14 | Track buffer memory usage | Estimate bytes used by buffered records. Flush when > threshold. | `{ challenge: "12.14", estimatedBytes: 50000, flushed: true }` |
| 12.15 | Cache invalidation from events | When `"order.updated"` event arrives, invalidate `cache["order:123"]`. | `{ challenge: "12.15", invalidated: ["order:123"] }` |
| 12.16 | Bulk write coalescer | Collect writes for 100ms or until 50 items, then flush as one batch. | `{ challenge: "12.16", flushes: 2, totalItems: 100 }` |
| 12.17 | Moving average latency | Track last N operation durations, report rolling average. | `{ challenge: "12.17", average: 150, window: 10 }` |
| 12.18 | Dedupe expensive computations | If same computation is requested while one is in-flight, share the result. | `{ challenge: "12.18", computations: 1, consumers: 3 }` |
| 12.19 | Performance budget checker | If method takes > budget (e.g., 500ms), log a warning. | `{ challenge: "12.19", withinBudget: false, budget: 500, actual: 800 }` |
| 12.20 | Benchmark two implementations | Run both, compare p50/p95/p99 latencies. Report which is faster. | `{ challenge: "12.20", winner: "implementation_b", p50: { a: 100, b: 50 } }` |

---

## Section 13: Security and Input Hardening

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 13.01 | Recursive secret redactor | Walk nested objects, replace `password`, `token`, `secret`, `apiKey` values with `"[REDACTED]"`. | `{ challenge: "13.01", clean: { user: "john", auth: { token: "[REDACTED]" } } }` |
| 13.02 | Safe merge (reject prototype keys) | Deep merge objects but reject `__proto__`, `constructor`, `prototype` keys. | `{ challenge: "13.02", merged: {...}, rejected: ["__proto__"] }` |
| 13.03 | Redirect URL allowlist | Only allow redirects to `["myapp.com", "auth.myapp.com"]`. Block all others. | `{ challenge: "13.03", allowed: true/false, url: "..." }` |
| 13.04 | SSRF-safe URL validator | Block `localhost`, `127.0.0.1`, `169.254.*`, private ranges, `file://` scheme. | `{ challenge: "13.04", safe: false, reason: "private IP blocked" }` |
| 13.05 | Password policy checker | Min 8 chars, 1 upper, 1 lower, 1 digit, 1 special. Return which rules failed. | `{ challenge: "13.05", valid: false, failures: ["missing special char"] }` |
| 13.06 | Constant-time token comparison | Compare two tokens without early-exit (prevents timing attacks). | `{ challenge: "13.06", match: true, constantTime: true }` |
| 13.07 | Rate limiter (userId + IP) | Allow 100 requests/minute per user. Track by both user and IP. | `{ challenge: "13.07", allowed: true, remaining: 95 }` |
| 13.08 | Safe filename normalization | Strip path separators, null bytes, unicode tricks. `"../../etc/passwd"` → `"etcpasswd"`. | `{ challenge: "13.08", safe: "report.pdf", original: "../report.pdf" }` |
| 13.09 | Permission checker (RBAC + ownership) | Admin can do anything. User can only edit own resources. Guest: read only. | `{ challenge: "13.09", allowed: true, role: "user", owns: true }` |
| 13.10 | Least-privilege policy matrix | Define what each role can do to each resource type. Deny by default. | `{ challenge: "13.10", matrix: { admin: { orders: ["read","write","delete"] }, user: { orders: ["read"] } } }` |
| 13.11 | Sanitize notification strings | Remove control characters, limit length, escape special chars for plain text. | `{ challenge: "13.11", sanitized: "Hello John" }` |
| 13.12 | No stack traces in public errors | Internal: full stack trace for debugging. Public API: generic message + error code only. | `{ challenge: "13.12", public: { code: "INTERNAL", message: "Something went wrong" } }` |
| 13.13 | Webhook signature verifier | Verify `X-Signature: sha256=...` matches HMAC of body. Provide fake for tests. | `{ challenge: "13.13", verified: true }` |
| 13.14 | Replay protection (timestamp + nonce) | Reject requests older than 5 minutes or with a previously-seen nonce. | `{ challenge: "13.14", accepted: false, reason: "timestamp too old" }` |
| 13.15 | Redact sensitive headers | In logs, replace `Authorization: Bearer xyz` with `Authorization: [REDACTED]`. | `{ challenge: "13.15", headers: { Authorization: "[REDACTED]", "Content-Type": "application/json" } }` |
| 13.16 | CORS origin validation | Exact match only. No wildcards in production. `"https://myapp.com"` → allowed. | `{ challenge: "13.16", allowed: true, origin: "https://myapp.com" }` |
| 13.17 | Secure random ID with prefix | Generate `usr_a8f3b2c1d4e5...` (prefix + crypto random). Validate format on read. | `{ challenge: "13.17", id: "usr_...", valid: true }` |
| 13.18 | Audit log for permission changes | When roles change, log: who did it, what changed, when, from what IP. | `{ challenge: "13.18", audit: { actor: "admin_1", action: "grant_role", target: "user_5" } }` |
| 13.19 | Detect login burst | If > 10 failed logins in 60s from same IP, flag as suspicious. | `{ challenge: "13.19", suspicious: true, attempts: 15, window: "60s" }` |
| 13.20 | Security checklist for API client | Return a list of checks: TLS, auth, input validation, rate limiting, logging. | `{ challenge: "13.20", checklist: ["uses HTTPS", "validates input", "has rate limiting", ...] }` |

---

## Section 14: Modules, Tooling, and Packaging

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 14.01 | Package exports map | Define `"."`, `"./internal"`, `"./testing"` entry points in package.json format. | `{ challenge: "14.01", exports: { ".": "./dist/index.js", "./testing": "./dist/testing.js" } }` |
| 14.02 | Barrel file (public APIs only) | `index.ts` re-exports only stable public symbols. Internal helpers stay hidden. | `{ challenge: "14.02", public: ["createUser", "getOrder"], internal: ["_helper"] }` |
| 14.03 | Detect API surface changes | Compare current exports vs previous. Flag added/removed symbols. | `{ challenge: "14.03", added: ["newMethod"], removed: [], breaking: false }` |
| 14.04 | Feature flag manifest + docs | Typed config that can auto-generate documentation for each flag. | `{ challenge: "14.04", flags: [{ name: "beta", type: "boolean", doc: "Enables beta UI" }] }` |
| 14.05 | Code gen: JSON → TypeScript types | Given `{ "User": { "name": "string", "age": "number" } }`, emit `type User = { name: string; age: number }`. | `{ challenge: "14.05", generated: "type User = { name: string; age: number; }" }` |
| 14.06 | Validate package.json | Check engines, required scripts (build, test, lint), valid exports field. | `{ challenge: "14.06", valid: true, issues: [] }` |
| 14.07 | Build-time env replacement | Replace `__APP_VERSION__` in code with actual value at build time. Only allow listed keys. | `{ challenge: "14.07", replaced: { "__APP_VERSION__": "1.2.3" } }` |
| 14.08 | ESM dynamic import helper | `await loadPlugin("./plugins/stripe.js")` with proper error handling for missing modules. | `{ challenge: "14.08", loaded: true, module: "stripe" }` |
| 14.09 | CLI argument parser | Parse `--dry-run --env prod --verbose` into typed options object. | `{ challenge: "14.09", options: { dryRun: true, env: "prod", verbose: true } }` |
| 14.10 | Release notes from commits | Group commits by type (feat, fix, chore). Generate markdown release notes. | `{ challenge: "14.10", notes: "## Features\n- Add user export\n## Fixes\n- Fix login bug" }` |
| 14.11 | Validate tsconfig strictness | Ensure `strict: true`, `noUncheckedIndexedAccess: true`, etc. are set. | `{ challenge: "14.11", valid: true, missing: [] }` |
| 14.12 | Forbidden package checker | Flag packages like `moment` (use `date-fns`), `lodash` (use native), `request` (deprecated). | `{ challenge: "14.12", forbidden: ["moment"], suggestion: "use date-fns" }` |
| 14.13 | Multi-env config loader | Load `config.base.json` + `config.prod.json` overlay. Types ensure all required fields present. | `{ challenge: "14.13", config: { env: "prod", port: 8080 } }` |
| 14.14 | Migration runner with dry-run | Run SQL/JS migrations in order. Dry-run mode shows what would happen without executing. | `{ challenge: "14.14", dryRun: true, migrations: ["001_create_users", "002_add_email"] }` |
| 14.15 | Generate API docs from endpoints | Given typed route definitions, produce markdown documentation. | `{ challenge: "14.15", markdown: "## GET /users\nReturns all users..." }` |
| 14.16 | Package health report | Aggregate: tests passing, types valid, coverage %, bundle size. | `{ challenge: "14.16", health: { tests: "pass", coverage: 85, bundleKb: 120 } }` |
| 14.17 | Monorepo dependency graph check | Ensure no circular dependencies between workspace packages. | `{ challenge: "14.17", circular: false, graph: { "pkg-a": ["pkg-b"], "pkg-b": [] } }` |
| 14.18 | Plugin version compatibility | Check if plugin version satisfies host's required range (semver). | `{ challenge: "14.18", compatible: true, plugin: "2.1.0", required: "^2.0.0" }` |
| 14.19 | Safe script runner | Refuse to run `rm -rf /`, `DROP DATABASE`, etc. without explicit `--confirm` flag. | `{ challenge: "14.19", blocked: true, reason: "destructive command needs --confirm" }` |
| 14.20 | Production readiness checklist | Return pass/fail for: types, tests, docs, security, monitoring, error handling. | `{ challenge: "14.20", ready: true, checks: { types: "pass", tests: "pass", ... } }` |

---

## Section 15: Fullstack and Frontend Production

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 15.01 | Typed form state reducer | Track `{ values, errors, dirty, touched }` per field. Actions: change, blur, submit, reset. | `{ challenge: "15.01", state: { values: {...}, dirty: ["name"], errors: {} } }` |
| 15.02 | API errors → field-level UI errors | Map `{ fields: [{ path: "email", message: "taken" }] }` to `{ email: "This email is taken" }`. | `{ challenge: "15.02", fieldErrors: { email: "This email is taken" } }` |
| 15.03 | Optimistic update + rollback | Update UI immediately, revert if API call fails. | `{ challenge: "15.03", optimistic: { applied: true }, rollback: { ready: true } }` |
| 15.04 | Route params parser | From URL `/orders/123?status=active`, extract `{ id: "123", status: "active" }` with validation. | `{ challenge: "15.04", params: { id: "123", status: "active" } }` |
| 15.05 | Keyboard navigation state | Track focused index in a menu. Arrow keys move focus. Enter selects. | `{ challenge: "15.05", focusedIndex: 2, selected: null }` |
| 15.06 | Query cache key builder | `["users", "list", { page: 1 }]` and `["users", "detail", "123"]` — deterministic, stable keys. | `{ challenge: "15.06", key: "users:list:{page:1}" }` |
| 15.07 | DTO → view model | Convert API response (dates as strings, nullable fields) into UI-friendly shape. | `{ challenge: "15.07", viewModel: { name: "John", joinedDate: "Apr 30, 2026", status: "Active" } }` |
| 15.08 | Typed localStorage wrapper | `storage.get("theme")` returns `Theme | null`. Schema validates on read. | `{ challenge: "15.08", value: "dark", valid: true }` |
| 15.09 | Browser feature detection | Check if `IntersectionObserver`, `AbortController`, `structuredClone` exist. | `{ challenge: "15.09", features: { intersectionObserver: true, abortController: true } }` |
| 15.10 | Data fetching state machine | States: `idle → loading → success/error`. No impossible states (loading + error). | `{ challenge: "15.10", state: { status: "success", data: {...} } }` |
| 15.11 | Typed analytics event map | `track("button_click", { buttonId: "submit" })` — event name determines payload shape. | `{ challenge: "15.11", tracked: { event: "button_click", props: { buttonId: "submit" } } }` |
| 15.12 | File drop validator | Check: max 5 files, each < 10MB, only images. Return per-file errors. | `{ challenge: "15.12", valid: [file1], invalid: [{ file: file2, reason: "too large" }] }` |
| 15.13 | Undo/redo state | Maintain history stack. Undo pops. Redo pushes back. New edit clears redo stack. | `{ challenge: "15.13", current: "state3", canUndo: true, canRedo: false }` |
| 15.14 | Autosave with debounce | Save form state 2s after last change. Cancel pending save on new change. | `{ challenge: "15.14", saves: 1, debounced: 5 }` |
| 15.15 | Offline action queue | Queue actions while offline. Replay in order when back online. | `{ challenge: "15.15", queued: 3, replayed: 3 }` |
| 15.16 | Typed WebSocket message handler | `ws.on("chat.message", (msg: ChatMessage) => {...})` — type-safe per message type. | `{ challenge: "15.16", handlers: ["chat.message", "user.joined"] }` |
| 15.17 | Permissions → UI action availability | Given `permissions: ["order.read", "order.create"]`, compute `{ canCreate: true, canDelete: false }`. | `{ challenge: "15.17", actions: { canCreate: true, canDelete: false } }` |
| 15.18 | Display formatters | `formatMoney(1234.5)` → `"$1,234.50"`. `formatDate(...)` → `"Apr 30, 2026"`. `formatStatus("active")` → `"Active"`. | `{ challenge: "15.18", formatted: { money: "$1,234.50", date: "Apr 30, 2026" } }` |
| 15.19 | URL state serializer | Sync filters/sort to URL: `?sort=name&dir=asc&status=active`. Parse back on load. | `{ challenge: "15.19", url: "?sort=name&dir=asc", parsed: { sort: "name", dir: "asc" } }` |
| 15.20 | View model layer (no raw nulls) | Transform nullable API fields into explicit UI states: "loading", "empty", "value". | `{ challenge: "15.20", fields: { email: { state: "present", value: "a@b.com" }, phone: { state: "empty" } } }` |

---

## Section 16: Capstone Production Services (Expert Level)

| # | Challenge | What You Need To Do | Expected Output |
|---|-----------|-------------------|-----------------|
| 16.01 | Full API SDK | Combine: typed client, Zod validation, retries, pagination, redacted logging. | `{ challenge: "16.01", sdk: { endpoints: [...], retryEnabled: true, logsRedacted: true } }` |
| 16.02 | Order checkout service | Full domain: Order model, pricing policies, Result errors, unit tests structure. | `{ challenge: "16.02", order: { total: 150, status: "confirmed" }, errors: [] }` |
| 16.03 | Background job runner | Concurrency limit, retry with backoff, dead-letter queue, graceful shutdown. | `{ challenge: "16.03", processed: 100, failed: 2, deadLetter: 2, shutdown: "graceful" }` |
| 16.04 | CSV import pipeline | Stream CSV → validate rows → transform → persist valid ones → report errors. | `{ challenge: "16.04", imported: 95, rejected: 5, errors: [...] }` |
| 16.05 | Feature flag service | Typed flags, rollout rules (% of users), audit log of evaluations. | `{ challenge: "16.05", flag: "beta_ui", enabled: true, rollout: "50%" }` |
| 16.06 | Secure webhook receiver | Validate signature, check timestamp freshness, parse typed event, reject replays. | `{ challenge: "16.06", accepted: true, event: { type: "payment.completed" } }` |
| 16.07 | Config + observability module | Shared across services: env parsing, structured logging, metrics, health checks. | `{ challenge: "16.07", module: { config: "loaded", logger: "ready", metrics: "recording" } }` |
| 16.08 | Repository with contract tests | Interface + in-memory impl + test suite that any impl must pass. | `{ challenge: "16.08", tests: "pass", implementations: ["memory"] }` |
| 16.09 | DataLoader batching layer | Batch dependency calls, dedupe by key, preserve order in results. | `{ challenge: "16.09", batchCalls: 2, totalLoads: 50 }` |
| 16.10 | Cache-backed read model | TTL cache, invalidation via events, tests prove correctness. | `{ challenge: "16.10", cached: true, invalidatedOn: "order.updated" }` |
| 16.11 | Public error response layer | Map any internal error to a safe public format. Never leak internals. | `{ challenge: "16.11", public: { code: "ERR_001", message: "..." }, stackLeaked: false }` |
| 16.12 | CLI maintenance tool | Dry-run mode, structured JSON output, confirmation for destructive ops. | `{ challenge: "16.12", dryRun: true, actions: ["would delete 5 expired sessions"] }` |
| 16.13 | Permissions engine | Roles + scopes + ownership + audit trail. `canAccess(user, resource, action)`. | `{ challenge: "16.13", decision: "allow", reason: "admin role" }` |
| 16.14 | Integration test harness | Fake HTTP, fake time, fake DB — test full use case end-to-end deterministically. | `{ challenge: "16.14", harness: { fakeHttp: true, fakeTime: true }, testsPassed: true }` |
| 16.15 | Production readiness report | Automated check: types ✓, tests ✓, no `any` ✓, coverage > 80% ✓, docs ✓. | `{ challenge: "16.15", ready: true, score: "9/10" }` |
| 16.16 | Streaming file processor | Progress tracking, cancellation via AbortSignal, metrics on throughput. | `{ challenge: "16.16", processed: "10MB", progress: "100%", cancelled: false }` |
| 16.17 | Event-sourced audit trail | Store all state changes as events. Rebuild current state by replaying events. | `{ challenge: "16.17", events: 5, currentState: { status: "shipped" } }` |
| 16.18 | Frontend view model layer | Transform API responses for checkout and ticket screens. No nulls reach UI. | `{ challenge: "16.18", screens: { checkout: {...}, ticket: {...} } }` |
| 16.19 | Performance benchmark | Compare cached vs uncached. Report p50/p95/p99 latencies. | `{ challenge: "16.19", cached: { p50: 5 }, uncached: { p50: 150 }, speedup: "30x" }` |
| 16.20 | Portfolio case study | Document: architecture decisions, type safety approach, test strategy, production tradeoffs. | `{ challenge: "16.20", study: { architecture: "...", testing: "...", tradeoffs: "..." } }` |

---

## How to Run Tests

```bash
# Run all tests for a specific section
cd c:\Learning\Typescript
npx vitest run 01_Type_System_Narrowing/

# Run one specific test file
npx vitest run 01_Type_System_Narrowing/__tests__/task_01_type_system_narrowing.test.ts

# Watch mode (re-runs on file save)
npx vitest 01_Type_System_Narrowing/

# Run all tests across all sections
npx vitest run
```

## Workflow for Each Challenge

1. Read the challenge description in this guide
2. Implement the function in the task file
3. Remove `.skip` from the test in `__tests__/`
4. Update the test's `expected` value to match your implementation
5. Run `npx vitest run <folder>` to verify it passes

## Input You Always Receive

Every challenge function gets the same `ChallengeInput` shape:
```typescript
{
  challengeId: "01.01",           // which challenge
  now: "2026-04-29T00:00:00Z",   // current timestamp
  records: [                      // sample data to work with
    { id: "rec_1", customerId: "cus_1", amount: 120, status: "active", tags: ["priority", "paid"] },
    { id: "rec_2", customerId: "cus_2", amount: 80, status: "pending", tags: ["trial"] }
  ],
  options: { limit: 2, strict: true, tenantId: "tenant_demo" }
}
```

Use these records and options to demonstrate the concept. The exact output shape is up to you — just be consistent and include `challenge: "XX.XX"` so tests can verify which challenge produced what.

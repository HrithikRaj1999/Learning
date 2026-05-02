/**
==============================================================================
  TASK 03: Runtime Validation and Boundaries
==============================================================================

REAL-WORLD CONTEXT:
Your app has BOUNDARIES — places where outside data enters your system:
  - User submits a form → data arrives as unknown JSON
  - Config loaded from .env → everything is string | undefined
  - Third-party API response → could be anything
  - Webhook from Stripe/GitHub → raw HTTP body

At these boundaries, you CANNOT trust the data. It might be malformed,
incomplete, or even malicious. Your job is to VALIDATE everything at the
boundary, convert it into safe typed objects, and NEVER let raw data leak
deeper into your application.

Think of it like a bouncer at a club:
  - Check ID at the door (validate at boundary)
  - Once inside, everyone is verified (typed domain objects)
  - No checking IDs at the bar (no validation deep in business logic)

TOOLS: Zod (schema validation library), custom parsers, Result types

HOW TO WORK:
- Implement each challenge function below
- Run tests: Remove .skip from one test at a time in __tests__/
- Install zod: `npm install zod` if not already available
*/

import { todo, type ChallengeInput } from "../src/shared/challenge";

// ---------------------------------------------------------------------------
// Challenge 03.01 — User Registration: Validate Everything Before Saving
// ---------------------------------------------------------------------------
// SCENARIO: Your registration form accepts: name, email, password, age.
// Users type ANYTHING: empty names, "notanemail", passwords with 2 characters,
// age "twenty-five". The old code crashed in the database layer with cryptic
// constraint violation errors.
//
// WHAT'S WRONG: Validation was scattered: some in the frontend, some in the
// controller, some in the database constraints. Error messages were ugly:
// "violates check constraint user_email_format" instead of "Invalid email format."
//
// YOUR FIX: Create a Zod schema that validates ALL fields upfront. If invalid,
// return clean, human-readable errors mapped to field names.
//
// EXPECTED OUTPUT:
//   Input: { name: "", email: "bad", password: "hi", age: -5 }
//   Output: { 
//     success: false,
//     errors: {
//       name: "Name is required",
//       email: "Invalid email format",
//       password: "Password must be at least 8 characters",
//       age: "Age must be a positive number"
//     }
//   }
// ---------------------------------------------------------------------------
export function challenge03_01(input: ChallengeInput): unknown {
  void input;
  return todo("03.01", "Create a Zod schema for a user registration request and return normalized validation errors.");
}

// ---------------------------------------------------------------------------
// Challenge 03.02 — Environment Variables: Don't Start with Bad Config
// ---------------------------------------------------------------------------
// SCENARIO: Your app needs DATABASE_URL, PORT, JWT_SECRET, and NODE_ENV.
// A developer deployed to production but forgot to set JWT_SECRET. The app
// started, ran for 30 minutes, then crashed when the first user logged in.
//
// WHAT'S WRONG: The app lazily reads `process.env.JWT_SECRET` when needed.
// If it's missing, the error appears LATE (during a request), not at startup.
// Also, PORT comes as string "3000" but your code expects number 3000.
//
// YOUR FIX: At app startup, validate ALL env vars into a typed AppConfig:
//   - Check all required vars exist
//   - Convert strings to correct types (PORT → number)
//   - Apply defaults (PORT defaults to 3000, NODE_ENV defaults to "development")
//   - If ANYTHING is missing/invalid → crash IMMEDIATELY with clear message
//
// EXPECTED BEHAVIOR:
//   process.env = { DATABASE_URL: "postgres://...", JWT_SECRET: "abc" }
//   → { databaseUrl: "postgres://...", port: 3000, jwtSecret: "abc", nodeEnv: "development" }
//   Missing JWT_SECRET → crash: "Missing required env var: JWT_SECRET"
// ---------------------------------------------------------------------------
export function challenge03_02(input: ChallengeInput): unknown {
  void input;
  return todo("03.02", "Validate process environment into a typed AppConfig object with defaults.");
}

// ---------------------------------------------------------------------------
// Challenge 03.03 — Incoming Event: Parse Unknown JSON into Domain Object
// ---------------------------------------------------------------------------
// SCENARIO: Your message queue consumer receives events as raw JSON strings.
// You need to parse them into typed domain events. But the messages could be
// anything: malformed JSON, old format from before a migration, or garbage
// from a buggy producer.
//
// WHAT'S WRONG: `JSON.parse(message)` gives you `any`. Then `event.orderId`
// works even if orderId doesn't exist — returning undefined silently. The
// order processing code runs with undefined IDs, creating ghost records.
//
// YOUR FIX: Parse → validate → transform. The domain layer should NEVER
// see raw JSON or unvalidated shapes. If parsing fails, return a clear error.
//
// EXPECTED BEHAVIOR:
//   parseEvent('{"type":"order.created","orderId":"123","amount":50}')
//   → { ok: true, event: { type: "order.created", orderId: "123", amount: 50 } }
//   parseEvent('{"random":"garbage"}')
//   → { ok: false, error: "Missing required field: type" }
//   parseEvent('not json at all')
//   → { ok: false, error: "Invalid JSON" }
// ---------------------------------------------------------------------------
export function challenge03_03(input: ChallengeInput): unknown {
  void input;
  return todo("03.03", "Parse unknown JSON into a typed domain event without leaking raw input into the domain layer.");
}

// ---------------------------------------------------------------------------
// Challenge 03.04 — JSON.parse That Doesn't Explode Your App
// ---------------------------------------------------------------------------
// SCENARIO: You call JSON.parse() in 50 places across your codebase. In each
// one, if the input is malformed, it throws and crashes the current request.
// Every call site needs its own try/catch — ugly and easy to forget.
//
// WHAT'S WRONG: JSON.parse() throws on invalid input. If you forget try/catch
// in even ONE place, your whole server crashes on bad input.
//
// YOUR FIX: Build `safeJsonParse(input)` that NEVER throws. Returns:
//   - Success: { ok: true, value: parsedObject }
//   - Failure: { ok: false, error: "description of what went wrong" }
//
// EXPECTED BEHAVIOR:
//   safeJsonParse('{"name":"Alice"}') → { ok: true, value: { name: "Alice" } }
//   safeJsonParse('not json') → { ok: false, error: "Unexpected token..." }
//   safeJsonParse('') → { ok: false, error: "Empty input" }
//   safeJsonParse(undefined) → { ok: false, error: "Input is not a string" }
// ---------------------------------------------------------------------------
export function challenge03_04(input: ChallengeInput): unknown {
  void input;
  return todo("03.04", "Implement a safeJsonParse helper that returns Result instead of throwing.");
}

// ---------------------------------------------------------------------------
// Challenge 03.05 — External API Data → Your Internal Format
// ---------------------------------------------------------------------------
// SCENARIO: You fetch customer data from Salesforce. Their format is:
//   { FirstName: "Alice", LastName: "Smith", Email__c: "a@b.com", Account_Id: "001..." }
// Your internal format is:
//   { name: "Alice Smith", email: "a@b.com", externalId: "001..." }
//
// WHAT'S WRONG: The old code directly used Salesforce field names throughout
// the app. When Salesforce renamed a field, it broke 40 files. Also, the
// PascalCase field names don't match your camelCase conventions.
//
// YOUR FIX: Create a BOUNDARY MAPPER that converts the external DTO into your
// internal Customer format. If required fields are missing, return an error.
// The external format should NEVER leak past this boundary function.
//
// EXPECTED BEHAVIOR:
//   mapSalesforceCustomer({ FirstName: "Alice", ... }) → Customer object
//   mapSalesforceCustomer({ FirstName: null, ... }) → error: "FirstName required"
//   Your app code ONLY uses Customer type (never Salesforce format)
// ---------------------------------------------------------------------------
export function challenge03_05(input: ChallengeInput): unknown {
  void input;
  return todo("03.05", "Convert an external API customer DTO into an internal Customer aggregate.");
}

// ---------------------------------------------------------------------------
// Challenge 03.06 — Don't Send Extra Fields to the Client
// ---------------------------------------------------------------------------
// SCENARIO: Your database query returns 20 fields including internal metadata:
// _rev, _partition_key, created_by_service, internal_flags. Your API endpoint
// should only return 5 public fields. But `res.json(dbResult)` sends EVERYTHING.
//
// WHAT'S WRONG: A developer added `is_admin: true` to the user record for
// internal use. The API response now leaks admin status to the frontend.
// A clever user can see who's an admin by inspecting network responses.
//
// YOUR FIX: Before sending ANY response, strip it down to ONLY the fields
// defined in your response schema. Unknown/extra properties are removed.
//
// EXPECTED BEHAVIOR:
//   Input: { id: "1", name: "Alice", _rev: "5", internal_flags: 0b1010 }
//   Schema says: only { id, name } are public
//   Output: { id: "1", name: "Alice" } (internal fields gone)
// ---------------------------------------------------------------------------
export function challenge03_06(input: ChallengeInput): unknown {
  void input;
  return todo("03.06", "Strip unknown properties from public API responses before sending data to callers.");
}

// ---------------------------------------------------------------------------
// Challenge 03.07 — Webhook: Check Shape BEFORE Verifying Signature
// ---------------------------------------------------------------------------
// SCENARIO: A Stripe webhook arrives. Before you verify the HMAC signature,
// you need to confirm the payload has the expected SHAPE (has `id`, `type`,
// `data` fields). If you try to verify signature on garbage data, you waste
// CPU and get confusing "invalid signature" errors instead of "malformed payload."
//
// WHAT'S WRONG: The verification function assumes the body is correctly shaped.
// When a random bot sends garbage to your webhook URL, it crashes inside the
// signature verification with an unhelpful error.
//
// YOUR FIX: FIRST validate the shape (is it an object? has required fields?).
// If shape is wrong → reject immediately with "malformed payload".
// If shape is correct → THEN verify the cryptographic signature.
//
// EXPECTED BEHAVIOR:
//   validateWebhookShape({ id: "evt_1", type: "charge.created", data: {...} }) → valid
//   validateWebhookShape("random string") → { error: "payload is not an object" }
//   validateWebhookShape({ id: "evt_1" }) → { error: "missing field: type" }
// ---------------------------------------------------------------------------
export function challenge03_07(input: ChallengeInput): unknown {
  void input;
  return todo("03.07", "Validate a webhook signature payload shape before attempting signature verification.");
}

// ---------------------------------------------------------------------------
// Challenge 03.08 — Dates: "2024-01-15" vs "Jan 15, 2024" vs 1705276800000
// ---------------------------------------------------------------------------
// SCENARIO: Dates arrive in different formats from different sources:
//   - User input: "2024-01-15" or "01/15/2024"
//   - External API: "2024-01-15T10:30:00Z" (ISO string)
//   - Legacy system: 1705276800000 (Unix timestamp)
// Your domain layer needs ONE consistent format.
//
// WHAT'S WRONG: Different parts of the code handle dates differently. Some
// compare ISO strings, others compare timestamps, others use Date objects.
// Timezone bugs appear randomly.
//
// YOUR FIX: At the boundary, normalize ALL date inputs into ISO strings
// (e.g., "2024-01-15T00:00:00.000Z"). If the input can't be parsed, return error.
//
// EXPECTED BEHAVIOR:
//   normalizeDate("2024-01-15") → "2024-01-15T00:00:00.000Z"
//   normalizeDate(1705276800000) → "2024-01-15T00:00:00.000Z"
//   normalizeDate("not-a-date") → { error: "unparseable date" }
// ---------------------------------------------------------------------------
export function challenge03_08(input: ChallengeInput): unknown {
  void input;
  return todo("03.08", "Normalize dates from strings into ISO strings at the boundary.");
}

// ---------------------------------------------------------------------------
// Challenge 03.09 — Pagination Params: Don't Trust the Query String
// ---------------------------------------------------------------------------
// SCENARIO: Your API endpoint receives pagination params from the URL:
//   ?limit=20&cursor=abc123&sort=created_at&direction=desc
// Users can manually type ANYTHING in the URL bar.
//
// WHAT'S WRONG: The old code did `parseInt(req.query.limit)` — if limit is
// "abc", parseInt returns NaN. The database query then does LIMIT NaN which
// returns zero results. Also, limit=1000000 causes memory issues.
//
// YOUR FIX: Validate pagination params with sensible constraints:
//   - limit: integer between 1 and 100 (default: 20)
//   - cursor: non-empty string or absent
//   - sort: must be one of allowed field names
//   - direction: "asc" or "desc" only
//
// EXPECTED BEHAVIOR:
//   validate({ limit: "20", sort: "created_at", direction: "desc" })
//   → { limit: 20, sort: "created_at", direction: "desc", cursor: undefined }
//   validate({ limit: "abc" }) → error: "limit must be a number"
//   validate({ limit: "999999" }) → error: "limit must be between 1 and 100"
// ---------------------------------------------------------------------------
export function challenge03_09(input: ChallengeInput): unknown {
  void input;
  return todo("03.09", "Validate a paginated query string object with limit, cursor, sort, and direction.");
}

// ---------------------------------------------------------------------------
// Challenge 03.10 — Consistent Error Responses Across All Endpoints
// ---------------------------------------------------------------------------
// SCENARIO: Every endpoint formats validation errors differently:
//   - POST /users returns: { error: "email invalid" }
//   - POST /orders returns: { errors: ["item required"] }
//   - PATCH /profile returns: { validationErrors: { name: "too short" } }
// The frontend has to handle 3 different error formats.
//
// WHAT'S WRONG: No standard error response format. Each developer invented
// their own. The frontend team is frustrated with inconsistency.
//
// YOUR FIX: Create ONE reusable error formatter that ALL endpoints use:
//   { status: "error", code: "VALIDATION_FAILED", errors: [{ field, message }] }
// Build a helper that converts Zod errors into this standard format.
//
// EXPECTED BEHAVIOR:
//   formatValidationError(zodError)
//   → { status: "error", code: "VALIDATION_FAILED", errors: [
//       { field: "email", message: "Invalid email format" },
//       { field: "age", message: "Must be a positive number" }
//     ]}
// ---------------------------------------------------------------------------
export function challenge03_10(input: ChallengeInput): unknown {
  void input;
  return todo("03.10", "Create reusable validation error formatting for API responses.");
}

// ---------------------------------------------------------------------------
// Challenge 03.11 — Nested Order Payload: Validate Everything
// ---------------------------------------------------------------------------
// SCENARIO: Creating an order requires nested validation:
//   { customer: { id, email }, items: [{ productId, quantity, price }], shipping: { address } }
// Each level can have errors. You need to report ALL errors at once (not just the first).
//
// WHAT'S WRONG: The old code validated one field at a time and returned on first error.
// User fixes email, resubmits, gets NEXT error. Fixes that, resubmits, gets another.
// 5 round trips to fix 5 errors. Terrible UX.
//
// YOUR FIX: Validate the ENTIRE nested structure and collect ALL errors.
// Return a summary: { valid: false, errorCount: 3, errors: { "items[0].quantity": "..." } }
//
// EXPECTED BEHAVIOR:
//   Input: { customer: { id: "" }, items: [{ productId: "", quantity: -1 }] }
//   Output: { valid: false, errorCount: 3, errors: {
//     "customer.id": "Customer ID required",
//     "items[0].productId": "Product ID required",
//     "items[0].quantity": "Must be at least 1"
//   }}
// ---------------------------------------------------------------------------
export function challenge03_11(input: ChallengeInput): unknown {
  void input;
  return todo("03.11", "Validate a nested order create payload and calculate a summary of invalid fields.");
}

// ---------------------------------------------------------------------------
// Challenge 03.12 — Legacy Support: Two Formats, One Domain Object
// ---------------------------------------------------------------------------
// SCENARIO: Your API was redesigned. The old format was:
//   { userName: "alice", userEmail: "a@b.com" }
// The new format is:
//   { user: { name: "alice", email: "a@b.com" } }
// Mobile apps still send the old format. You need to accept BOTH.
//
// WHAT'S WRONG: The handler has a massive `if (payload.userName) { ... } else { ... }`
// block. Each format is parsed differently, leading to bugs where one path
// has a fix but the other doesn't.
//
// YOUR FIX: Build a schema that detects which format was sent, normalizes
// BOTH into one domain command object, and validates the result.
//
// EXPECTED BEHAVIOR:
//   parse({ userName: "alice", userEmail: "a@b.com" })
//   → { name: "alice", email: "a@b.com" } (normalized from legacy)
//   parse({ user: { name: "alice", email: "a@b.com" } })
//   → { name: "alice", email: "a@b.com" } (normalized from current)
//   Both produce the SAME domain object
// ---------------------------------------------------------------------------
export function challenge03_12(input: ChallengeInput): unknown {
  void input;
  return todo("03.12", "Write a schema that accepts legacy and current payload shapes and maps both to one domain command.");
}

// ---------------------------------------------------------------------------
// Challenge 03.13 — Empty String is Not "No Filter"
// ---------------------------------------------------------------------------
// SCENARIO: A search form has optional filters: status, category, dateFrom.
// When the user doesn't select a filter, the frontend sends empty string "".
// The backend treats "" as a real value and queries WHERE status = ''.
//
// WHAT'S WRONG: Empty strings from form submissions are not the same as "no filter."
// The query returns zero results because no record has status = "".
//
// YOUR FIX: Build a schema where empty strings are automatically converted to
// undefined (meaning "not provided"). Only non-empty strings pass through.
//
// EXPECTED BEHAVIOR:
//   parseFilters({ status: "active", category: "", dateFrom: "" })
//   → { status: "active", category: undefined, dateFrom: undefined }
//   parseFilters({ status: "", category: "" })
//   → { status: undefined, category: undefined } (both treated as "no filter")
// ---------------------------------------------------------------------------
export function challenge03_13(input: ChallengeInput): unknown {
  void input;
  return todo("03.13", "Create a schema for optional filters where empty strings become undefined.");
}

// ---------------------------------------------------------------------------
// Challenge 03.14 — File Upload: Reject Before Saving to Disk
// ---------------------------------------------------------------------------
// SCENARIO: Users upload profile pictures. You need to validate BEFORE saving:
//   - File type: only .jpg, .png, .webp (not .exe, .php)
//   - File size: max 5MB
//   - MIME type matches extension (not just trusting the extension)
//   - Owner ID is a valid user
//
// WHAT'S WRONG: The old code saved the file FIRST, then validated. Malicious
// files got saved to disk before rejection. Also, someone uploaded a 2GB file
// and filled the disk.
//
// YOUR FIX: Validate file metadata BEFORE any disk write. If invalid, reject
// immediately with specific reason.
//
// EXPECTED BEHAVIOR:
//   validate({ name: "photo.jpg", size: 2_000_000, mime: "image/jpeg", ownerId: "u1" })
//   → { valid: true }
//   validate({ name: "hack.exe", size: 100, mime: "application/exe", ownerId: "u1" })
//   → { valid: false, error: "File type .exe not allowed" }
//   validate({ name: "big.jpg", size: 50_000_000, mime: "image/jpeg", ownerId: "u1" })
//   → { valid: false, error: "File exceeds 5MB limit" }
// ---------------------------------------------------------------------------
export function challenge03_14(input: ChallengeInput): unknown {
  void input;
  return todo("03.14", "Validate uploaded file metadata such as mime type, size, extension, and owner id.");
}

// ---------------------------------------------------------------------------
// Challenge 03.15 — Don't Leak Emails and Tokens in API Responses
// ---------------------------------------------------------------------------
// SCENARIO: Your internal user object has email, auth_token, and refresh_token.
// An API endpoint accidentally returned the full object. Users could see each
// other's tokens by inspecting the response. Security incident.
//
// WHAT'S WRONG: No systematic way to prevent sensitive fields from appearing
// in responses. It's up to each developer to remember to strip them.
//
// YOUR FIX: Build a "public response serializer" that AUTOMATICALLY redacts
// fields matching patterns: *email*, *token*, *secret*, *password*.
//
// EXPECTED BEHAVIOR:
//   serialize({ id: "1", name: "Alice", email: "a@b.com", auth_token: "xyz" })
//   → { id: "1", name: "Alice", email: "[REDACTED]", auth_token: "[REDACTED]" }
// ---------------------------------------------------------------------------
export function challenge03_15(input: ChallengeInput): unknown {
  void input;
  return todo("03.15", "Create a public response serializer that redacts email and token fields.");
}

// ---------------------------------------------------------------------------
// Challenge 03.16 — Validation Errors with Context for Debugging
// ---------------------------------------------------------------------------
// SCENARIO: A webhook from Partner X fails validation. You log the error.
// But the log says "validation failed" with no context: which partner?
// which endpoint? what was the raw payload? Without context, debugging is impossible.
//
// WHAT'S WRONG: Validation errors are thrown/returned without any metadata
// about WHERE they happened and WHAT the input was.
//
// YOUR FIX: Build a boundary mapper that preserves context:
//   { source: "partner_x_webhook", endpoint: "/hooks/orders", error: {...}, rawInput: {...} }
// This context gets logged for debugging without exposing sensitive data.
//
// EXPECTED BEHAVIOR:
//   mapBoundaryError("partner_x", "/hooks/orders", zodError, rawPayload)
//   → { source: "partner_x", endpoint: "/hooks/orders", errorCount: 2, fields: [...] }
// ---------------------------------------------------------------------------
export function challenge03_16(input: ChallengeInput): unknown {
  void input;
  return todo("03.16", "Build a boundary mapper that preserves validation context for logging.");
}

// ---------------------------------------------------------------------------
// Challenge 03.17 — Feature Flag Config: Validate Before Using
// ---------------------------------------------------------------------------
// SCENARIO: Feature flags are loaded from a JSON file. The structure should be:
//   { "dark_mode": { enabled: true, rollout: 0.5 }, "new_checkout": { enabled: false } }
// But someone edited the JSON file and left a typo: { enabled: "yes" } (string not boolean).
//
// WHAT'S WRONG: Without validation, `if (flag.enabled)` treats "yes" as truthy.
// The flag is accidentally enabled for everyone when it should be disabled.
//
// YOUR FIX: Validate the entire flag config file at startup. Each flag must have:
//   - enabled: boolean (not "true", not "yes")
//   - rollout: optional number 0-1
//   - If invalid → crash at startup with specific error
//
// EXPECTED BEHAVIOR:
//   validate({ dark_mode: { enabled: true, rollout: 0.5 } }) → valid
//   validate({ dark_mode: { enabled: "yes" } }) → error: "dark_mode.enabled must be boolean"
// ---------------------------------------------------------------------------
export function challenge03_17(input: ChallengeInput): unknown {
  void input;
  return todo("03.17", "Validate a feature flag configuration object loaded from JSON.");
}

// ---------------------------------------------------------------------------
// Challenge 03.18 — Enum Strings: Only Accept Valid Values
// ---------------------------------------------------------------------------
// SCENARIO: Your API accepts role: "admin" | "editor" | "viewer". The frontend
// sends this as a string. If someone sends "superadmin" or "ADMIN" (wrong case),
// your code should reject it — not silently store an invalid role.
//
// WHAT'S WRONG: `if (role !== "admin" && role !== "editor" && role !== "viewer")`
// works but doesn't scale. When you add a new role, you forget to update the check.
// Same pattern repeated for status, priority, category fields.
//
// YOUR FIX: Build a generic enum parser: `parseEnum(value, allowedValues)` that:
//   - Accepts a string and a list of valid values
//   - Returns the value if valid (with correct literal type)
//   - Returns error if invalid (with list of allowed values)
//
// EXPECTED BEHAVIOR:
//   parseRole("admin") → { ok: true, value: "admin" } (typed as "admin")
//   parseRole("ADMIN") → { ok: false, error: "Invalid. Allowed: admin, editor, viewer" }
//   parseRole("superadmin") → { ok: false, error: "Invalid. Allowed: admin, editor, viewer" }
// ---------------------------------------------------------------------------
export function challenge03_18(input: ChallengeInput): unknown {
  void input;
  return todo("03.18", "Create a runtime-safe enum parser for role, status, and priority strings.");
}

// ---------------------------------------------------------------------------
// Challenge 03.19 — Prototype Pollution: Block Malicious Keys
// ---------------------------------------------------------------------------
// SCENARIO: An attacker sends: { "__proto__": { "isAdmin": true } } as a JSON body.
// If your code does `Object.assign(target, userInput)`, it can modify the Object
// prototype — giving isAdmin=true to EVERY object in your application.
//
// WHAT'S WRONG: JSON.parse() allows __proto__, constructor, and prototype keys.
// If you merge this into other objects, you've been hacked (prototype pollution).
//
// YOUR FIX: When parsing object input, REJECT any keys that could cause
// prototype pollution: "__proto__", "constructor", "prototype".
// Check recursively in nested objects too.
//
// EXPECTED BEHAVIOR:
//   safeParse({ name: "Alice", age: 30 }) → { ok: true, value: { name: "Alice", age: 30 } }
//   safeParse({ "__proto__": { isAdmin: true } }) → { ok: false, error: "Forbidden key: __proto__" }
//   safeParse({ data: { "constructor": "hack" } }) → { ok: false, error: "Forbidden key: constructor" }
// ---------------------------------------------------------------------------
export function challenge03_19(input: ChallengeInput): unknown {
  void input;
  return todo("03.19", "Reject prototype-pollution keys while parsing object input.");
}

// ---------------------------------------------------------------------------
// Challenge 03.20 — Test Data Factory: Generate Valid Fake Data
// ---------------------------------------------------------------------------
// SCENARIO: Your tests need valid User, Order, and Product objects. Each test
// manually constructs: { id: "1", name: "Test", email: "t@t.com", ... } with
// all required fields. When you add a new required field, 200 tests break.
//
// WHAT'S WRONG: Each test creates its own test data. When the schema changes
// (e.g., add "phoneNumber" as required), every test that creates a User breaks.
//
// YOUR FIX: Build a schema-driven factory: `createTestUser({ name: "Alice" })`.
// It fills ALL required fields with valid defaults, letting you override only
// what matters for your specific test.
//
// EXPECTED BEHAVIOR:
//   createTestUser() → complete valid User with all defaults
//   createTestUser({ name: "Custom" }) → valid User with name overridden
//   Adding new field to schema → factory auto-generates it, tests don't break
// ---------------------------------------------------------------------------
export function challenge03_20(input: ChallengeInput): unknown {
  void input;
  return todo("03.20", "Build a schema-driven test data factory for validated DTOs.");
}

from __future__ import annotations

import json
from pathlib import Path
from textwrap import dedent


ROOT = Path(__file__).resolve().parents[1]


MODULES = [
    {
        "number": 1,
        "folder": "01_Type_System_Narrowing",
        "slug": "type_system_narrowing",
        "title": "Type System and Narrowing",
        "level": "Advanced",
        "concepts": [
            "strict mode",
            "unknown",
            "never",
            "discriminated unions",
            "type guards",
            "assertion functions",
            "branded types",
            "exhaustive switches",
        ],
        "exercises": [
            "Model payment events as a discriminated union and render a human-readable audit message for each variant.",
            "Write a type guard that accepts unknown input and narrows it to a production-safe UserProfile shape.",
            "Create an assertion function that guarantees a value is a non-empty string before it reaches the domain layer.",
            "Use branded types to prevent mixing CustomerId, OrderId, and ProductId values.",
            "Build an exhaustive switch helper with assertNever for a NotificationStatus union.",
            "Normalize nullable API fields into explicit domain values without using any.",
            "Convert a loose webhook payload into a typed command object using runtime checks and narrowing.",
            "Represent success, validation failure, auth failure, and rate-limit failure as a discriminated ApiResponse union.",
            "Create a safe parser for Date-like inputs that returns a typed result instead of throwing.",
            "Implement a function that accepts string | number | boolean and formats it without unsafe casts.",
            "Write a type predicate for arrays of records where every item has an id string.",
            "Use the satisfies operator to validate a route table while preserving literal route names.",
            "Design a literal union for feature flags and validate flag names from unknown input.",
            "Create a function that narrows an unknown error into Error, AggregateError, or a fallback object.",
            "Model a finite state machine for order checkout and reject impossible transitions at compile time where possible.",
            "Build a lookup map whose keys must match an exact union of supported locales.",
            "Prevent accidental mutation by accepting readonly inputs and returning new objects.",
            "Write a parser that distinguishes missing, null, empty, and valid optional values.",
            "Create a typed event envelope with metadata and a narrowed event body.",
            "Refactor a function signature from any to unknown plus proper narrowing.",
        ],
    },
    {
        "number": 2,
        "folder": "02_Generics_Utility_Types",
        "slug": "generics_utility_types",
        "title": "Generics and Utility Types",
        "level": "Advanced",
        "concepts": [
            "generic constraints",
            "keyof",
            "indexed access",
            "mapped types",
            "conditional types",
            "infer",
            "template literal types",
            "utility types",
        ],
        "exercises": [
            "Implement a typed pick function that only accepts keys present on the input object.",
            "Implement a typed omit function that preserves the remaining property types.",
            "Build a generic groupBy helper that returns a Record keyed by a string-producing selector.",
            "Create a keyBy helper that indexes records by a unique key and detects duplicate keys at runtime.",
            "Implement a typed pluck helper for extracting one property from a readonly array of objects.",
            "Create DeepReadonly and DeepPartial utility types and demonstrate them with nested config data.",
            "Create a RequireAtLeastOne utility type for patch/update DTOs.",
            "Build a Paths<T> template-literal type for safe dot-path property names.",
            "Implement a generic getByPath function with a runtime fallback value.",
            "Create an EventMap-based typed event emitter with on, off, and emit methods.",
            "Build a strongly typed command bus where command names map to payload and result types.",
            "Create a type-safe repository interface generic over entity and id types.",
            "Write a conditional type that unwraps Promise, Result, and array values.",
            "Create a function overload set for parsing config from string, URL, or object input.",
            "Implement a typed mergeDefaults helper that respects readonly default values.",
            "Build a generic pagination result type with cursor and offset variants.",
            "Create a DTO mapper that selects public fields from private domain models.",
            "Use infer to extract handler input and output types from a function map.",
            "Create a branded generic Id<TName> type and helper constructors.",
            "Design a type-safe feature flag registry with inferred flag value types.",
        ],
    },
    {
        "number": 3,
        "folder": "03_Runtime_Validation_Boundaries",
        "slug": "runtime_validation_boundaries",
        "title": "Runtime Validation and Boundaries",
        "level": "Advanced",
        "concepts": [
            "zod",
            "DTOs",
            "schema parsing",
            "environment validation",
            "serialization",
            "input sanitation",
            "boundary mapping",
            "safe JSON",
        ],
        "exercises": [
            "Create a Zod schema for a user registration request and return normalized validation errors.",
            "Validate process environment into a typed AppConfig object with defaults.",
            "Parse unknown JSON into a typed domain event without leaking raw input into the domain layer.",
            "Implement a safeJsonParse helper that returns Result instead of throwing.",
            "Convert an external API customer DTO into an internal Customer aggregate.",
            "Strip unknown properties from public API responses before sending data to callers.",
            "Validate a webhook signature payload shape before attempting signature verification.",
            "Normalize dates from strings into ISO strings at the boundary.",
            "Validate a paginated query string object with limit, cursor, sort, and direction.",
            "Create reusable validation error formatting for API responses.",
            "Validate a nested order create payload and calculate a summary of invalid fields.",
            "Write a schema that accepts legacy and current payload shapes and maps both to one domain command.",
            "Create a schema for optional filters where empty strings become undefined.",
            "Validate uploaded file metadata such as mime type, size, extension, and owner id.",
            "Create a public response serializer that redacts email and token fields.",
            "Build a boundary mapper that preserves validation context for logging.",
            "Validate a feature flag configuration object loaded from JSON.",
            "Create a runtime-safe enum parser for role, status, and priority strings.",
            "Reject prototype-pollution keys while parsing object input.",
            "Build a schema-driven test data factory for validated DTOs.",
        ],
    },
    {
        "number": 4,
        "folder": "04_Collections_Data_Transformations",
        "slug": "collections_data_transformations",
        "title": "Collections and Data Transformations",
        "level": "Advanced",
        "concepts": [
            "Map",
            "Set",
            "readonly arrays",
            "normalization",
            "aggregation",
            "deduplication",
            "joins",
            "immutability",
        ],
        "exercises": [
            "Deduplicate customer records by email while keeping the newest updatedAt record.",
            "Normalize an array of orders into entities and ids for O(1) lookup.",
            "Group payments by customer and calculate total successful amount.",
            "Join orders and customers without mutating either input collection.",
            "Create an immutable update helper for replacing one entity in a readonly array.",
            "Build a diff function that returns added, removed, and changed ids between two snapshots.",
            "Aggregate inventory movements into current stock per product.",
            "Convert a flat category list into a parent-child tree.",
            "Flatten a tree into depth-aware rows suitable for rendering.",
            "Build a stable sort helper that sorts by multiple typed keys.",
            "Create a partition helper that splits records into pass and fail arrays.",
            "Implement a frequency counter for tags using Map.",
            "Create a sliding window over event timestamps and count active sessions.",
            "Merge partial updates into entities while ignoring undefined values.",
            "Implement a topK helper without sorting the whole input when possible.",
            "Build a batch function that chunks records by size and max payload bytes.",
            "Detect duplicate compound keys such as customerId plus productId.",
            "Create a transform pipeline where each step has typed input and output.",
            "Build a reconciliation report comparing source and target records.",
            "Implement stable pagination over a sorted readonly collection.",
        ],
    },
    {
        "number": 5,
        "folder": "05_Async_Concurrency",
        "slug": "async_concurrency",
        "title": "Async, Promises, and Concurrency",
        "level": "Advanced",
        "concepts": [
            "Promise",
            "async/await",
            "AbortController",
            "timeouts",
            "retry",
            "backoff",
            "concurrency limits",
            "queues",
        ],
        "exercises": [
            "Implement a promise pool that limits concurrent async work and preserves result order.",
            "Create a retry helper with exponential backoff and retryable error filtering.",
            "Wrap a promise with a timeout that respects AbortSignal.",
            "Create an abortable delay helper for tests and background workers.",
            "Implement debounce for async functions while keeping the latest call result.",
            "Implement throttle for event handlers with leading and trailing options.",
            "Build an async queue with push, close, and async iterator consumption.",
            "Create a rate limiter using a token bucket strategy.",
            "Fetch paginated records until no cursor remains while respecting cancellation.",
            "Run independent tasks and collect both fulfilled values and typed failures.",
            "Create a circuit breaker that opens after repeated failures and recovers after cooldown.",
            "Implement a bulkhead limiter per tenant id.",
            "Build an idempotent job runner that deduplicates jobs by key.",
            "Create a scheduler that runs tasks at intervals without overlapping runs.",
            "Implement a timeout-aware mutex for protecting shared resources.",
            "Create a request coalescer that shares one in-flight promise per cache key.",
            "Write a mapper for AsyncIterable inputs that supports concurrency.",
            "Add cancellation propagation from parent AbortSignal to child operations.",
            "Implement graceful shutdown for a queue with drain and force-stop modes.",
            "Create a helper that retries only safe idempotent operations.",
        ],
    },
    {
        "number": 6,
        "folder": "06_Error_Handling_Result_Types",
        "slug": "error_handling_result_types",
        "title": "Error Handling and Result Types",
        "level": "Advanced",
        "concepts": [
            "Result",
            "custom errors",
            "error causes",
            "typed failures",
            "classification",
            "safe wrappers",
            "domain errors",
            "recoverability",
        ],
        "exercises": [
            "Implement ok, err, isOk, and isErr helpers for a Result type.",
            "Create map, mapError, and flatMap helpers for Result values.",
            "Wrap synchronous exceptions into Result without losing error cause.",
            "Wrap async exceptions into Promise<Result<T, E>>.",
            "Classify unknown errors into validation, auth, timeout, dependency, and unknown categories.",
            "Create a BaseAppError class with code, retryable, statusCode, and cause.",
            "Convert domain errors into safe public API error responses.",
            "Build a validation error collector that preserves field paths.",
            "Implement a retry decision function based on typed error metadata.",
            "Create an error boundary helper for background jobs that logs and returns a failure result.",
            "Aggregate multiple validation failures into one typed error object.",
            "Implement a neverthrow-style pipe for chaining Result-returning functions.",
            "Create a safe fallback helper that recovers only from expected error codes.",
            "Convert thrown HTTP errors into typed dependency failures.",
            "Create a redacted error serializer that removes secrets from messages and metadata.",
            "Implement an assertOk helper for tests that unwraps Result or throws useful diagnostics.",
            "Build a domain-specific error union for checkout flow failures.",
            "Create a typed error registry with documentation text per error code.",
            "Implement error sampling logic to reduce noisy logs.",
            "Build a migration from throw-heavy code to Result-returning code.",
        ],
    },
    {
        "number": 7,
        "folder": "07_Node_Files_Streams",
        "slug": "node_files_streams",
        "title": "Node.js Files, Streams, and Buffers",
        "level": "Advanced",
        "concepts": [
            "fs/promises",
            "streams",
            "Buffer",
            "path",
            "crypto",
            "atomic writes",
            "backpressure",
            "temp files",
        ],
        "exercises": [
            "Read a JSON config file safely and validate the parsed object.",
            "Write JSON atomically by writing to a temp file and renaming it.",
            "Create a line reader for large files using streams.",
            "Parse a CSV stream into typed rows with validation errors collected separately.",
            "Compute a SHA-256 hash for a file without loading the whole file into memory.",
            "Create a safe path resolver that prevents directory traversal outside a base folder.",
            "Implement a rotating file naming strategy for log files.",
            "Convert a readable stream into an async iterable of chunks.",
            "Create a transform stream that redacts sensitive tokens from text.",
            "Build a file upload metadata validator before writing to disk.",
            "Implement cleanup for temporary files when a process fails.",
            "Read a directory recursively and return typed file descriptors.",
            "Create a small binary protocol encoder and decoder using Buffer.",
            "Implement backpressure-aware copying between streams.",
            "Create a file lock strategy using lock files and stale-lock detection.",
            "Watch a folder and debounce change events into one rebuild signal.",
            "Create a checksum manifest for generated artifacts.",
            "Build a safe delete helper that refuses to delete outside a workspace root.",
            "Implement gzip compression and decompression helpers with streams.",
            "Create a fixture loader for tests that resolves paths relative to the module.",
        ],
    },
    {
        "number": 8,
        "folder": "08_HTTP_API_Clients",
        "slug": "http_api_clients",
        "title": "HTTP Clients and API SDKs",
        "level": "Advanced",
        "concepts": [
            "fetch",
            "typed clients",
            "headers",
            "pagination",
            "retry",
            "auth refresh",
            "idempotency",
            "API errors",
        ],
        "exercises": [
            "Build a typed fetch wrapper that parses JSON and maps non-2xx responses into Result errors.",
            "Create a URL builder that safely encodes path params and query params.",
            "Implement request retry with idempotency-key support for POST operations.",
            "Create an API client class with injected fetch for testability.",
            "Add auth token refresh when a request returns 401 once.",
            "Implement cursor pagination as an AsyncIterable.",
            "Create a rate-limit handler that reads Retry-After headers.",
            "Build request and response logging with redacted headers.",
            "Validate response bodies with Zod before returning them.",
            "Create typed endpoint definitions that infer request and response shapes.",
            "Implement multipart upload metadata preparation.",
            "Build a client-side cache for GET requests with TTL and stale-while-revalidate behavior.",
            "Create cancellation support through AbortSignal.",
            "Implement a circuit breaker around dependency API calls.",
            "Map dependency-specific errors into domain-level errors.",
            "Create a webhook sender with signing headers and retry metadata.",
            "Build a test fake for fetch that supports multiple ordered responses.",
            "Create a batch API helper that splits large requests and merges responses.",
            "Implement request timeout metrics and classify dependency latency.",
            "Create SDK method documentation metadata from endpoint definitions.",
        ],
    },
    {
        "number": 9,
        "folder": "09_Domain_Modeling_Design_Patterns",
        "slug": "domain_modeling_design_patterns",
        "title": "Domain Modeling and Design Patterns",
        "level": "Advanced",
        "concepts": [
            "value objects",
            "entities",
            "repositories",
            "services",
            "factories",
            "strategy",
            "observer",
            "dependency injection",
        ],
        "exercises": [
            "Create a Money value object with currency-safe arithmetic.",
            "Model an Order aggregate that enforces valid status transitions.",
            "Create a repository interface and in-memory implementation for tests.",
            "Build a service layer that coordinates repository, clock, and logger dependencies.",
            "Implement a factory for creating valid Customer entities.",
            "Use the strategy pattern for choosing shipping cost calculation.",
            "Use the command pattern for checkout operations with undo metadata.",
            "Use the observer pattern for publishing domain events.",
            "Implement dependency injection with explicit constructor dependencies.",
            "Create a policy object for authorization checks.",
            "Create a specification pattern for filtering orders.",
            "Build a unit-of-work abstraction for committing multiple repository changes.",
            "Create a mapper between persistence models and domain models.",
            "Enforce invariants inside constructors or static factory methods.",
            "Model a state machine for support ticket lifecycle.",
            "Use composition over inheritance to share behavior across services.",
            "Create a plugin registry for payment providers.",
            "Build an anti-corruption layer for a legacy customer API.",
            "Create domain event serialization and deserialization.",
            "Refactor a god function into cohesive domain services.",
        ],
    },
    {
        "number": 10,
        "folder": "10_Testing_Mocking_Testability",
        "slug": "testing_mocking_testability",
        "title": "Testing, Mocking, and Testability",
        "level": "Advanced",
        "concepts": [
            "Vitest",
            "test doubles",
            "fakes",
            "spies",
            "fake timers",
            "builders",
            "contract tests",
            "table tests",
        ],
        "exercises": [
            "Create a test data builder for Customer with overridable defaults.",
            "Write table-driven tests for a discount calculation function.",
            "Use fake timers to test retry and backoff behavior.",
            "Create a fake repository that records saved entities for assertions.",
            "Mock fetch with ordered responses and assert request metadata.",
            "Test an async queue without flaky sleeps.",
            "Create contract tests shared by multiple repository implementations.",
            "Build a snapshot-safe serializer that removes volatile fields.",
            "Write tests for error cases without asserting brittle error messages.",
            "Create a helper for asserting Result ok and err states.",
            "Design a fixture factory that keeps tests readable and isolated.",
            "Test a service with injected clock, logger, and id generator.",
            "Create a spy-based assertion for domain event publishing.",
            "Write property-style tests over generated numeric ranges.",
            "Test a stream transform using in-memory streams.",
            "Create a mock metrics recorder and assert emitted metrics.",
            "Build test helpers for AbortSignal cancellation.",
            "Test cache expiration deterministically with fake timers.",
            "Create integration-style tests around a composed use case.",
            "Refactor code that is difficult to test into dependency-injected units.",
        ],
    },
    {
        "number": 11,
        "folder": "11_Config_Logging_Observability",
        "slug": "config_logging_observability",
        "title": "Config, Logging, and Observability",
        "level": "Advanced",
        "concepts": [
            "environment config",
            "structured logs",
            "redaction",
            "correlation ids",
            "metrics",
            "tracing",
            "health checks",
            "graceful shutdown",
        ],
        "exercises": [
            "Parse environment variables into typed config with clear startup errors.",
            "Create a structured logger interface with child loggers and context fields.",
            "Implement recursive redaction for password, token, apiKey, and authorization fields.",
            "Create correlation-id propagation across service calls.",
            "Build a metrics recorder interface and in-memory test implementation.",
            "Record latency histograms around async operations.",
            "Create a tracing span helper that records status and error metadata.",
            "Build readiness and liveness health check aggregators.",
            "Implement graceful shutdown hooks for HTTP server, queue, and database clients.",
            "Create a startup diagnostics report without exposing secrets.",
            "Sample noisy logs by event key while keeping error logs.",
            "Create a log formatter that outputs stable JSON lines.",
            "Add contextual logging to a use case without global state.",
            "Create a slow-operation detector with configurable threshold.",
            "Build an audit event writer with immutable metadata.",
            "Implement feature flag evaluation logging with privacy-safe fields.",
            "Create a dependency health cache with TTL.",
            "Build an error-to-metric classifier.",
            "Create a request lifecycle context object.",
            "Design observability hooks for a background job runner.",
        ],
    },
    {
        "number": 12,
        "folder": "12_Performance_Caching_Memory",
        "slug": "performance_caching_memory",
        "title": "Performance, Caching, and Memory",
        "level": "Advanced",
        "concepts": [
            "LRU",
            "TTL",
            "memoization",
            "batching",
            "DataLoader pattern",
            "performance marks",
            "WeakMap",
            "memory safety",
        ],
        "exercises": [
            "Implement an LRU cache with get, set, delete, and size behavior.",
            "Create a TTL cache that expires values using an injected clock.",
            "Memoize pure functions with typed argument keys.",
            "Create a request-scoped DataLoader-style batcher.",
            "Eliminate an N+1 lookup by batching ids and preserving order.",
            "Measure operation duration using performance.now with injectable timing.",
            "Build a weak memoization helper for object keys.",
            "Create a bounded queue that applies backpressure when full.",
            "Implement stale-while-revalidate caching for async reads.",
            "Create a cache key builder that avoids collisions between tenants.",
            "Build a CPU-heavy chunk processor that yields to the event loop.",
            "Implement pagination that avoids loading all rows into memory.",
            "Create a topK algorithm suitable for large streams.",
            "Track approximate memory usage for buffered records.",
            "Build a cache invalidation strategy from domain events.",
            "Create a bulk write coalescer that flushes by count or time.",
            "Implement a moving average latency tracker.",
            "Create a dedupe layer for repeated expensive computations.",
            "Design a performance budget checker for service methods.",
            "Create benchmarks for two implementations and compare results.",
        ],
    },
    {
        "number": 13,
        "folder": "13_Security_Hardening",
        "slug": "security_hardening",
        "title": "Security and Input Hardening",
        "level": "Advanced",
        "concepts": [
            "redaction",
            "allowlists",
            "SSRF defense",
            "rate limiting",
            "safe merge",
            "token handling",
            "validation",
            "least privilege",
        ],
        "exercises": [
            "Create a recursive secret redactor for logs and error metadata.",
            "Implement a safe object merge that rejects __proto__, constructor, and prototype keys.",
            "Validate redirect URLs against an allowlist of hosts.",
            "Build an SSRF-safe URL validator for outbound HTTP calls.",
            "Create a password policy checker with structured failure reasons.",
            "Implement constant-time token comparison for fixed-length secrets.",
            "Create a rate limiter keyed by user id and IP address.",
            "Validate uploaded filenames and normalize them safely.",
            "Build a permission checker using roles, scopes, and resource ownership.",
            "Create a least-privilege policy matrix for service actions.",
            "Sanitize user-visible strings for plain-text notifications.",
            "Prevent leaking stack traces in public API error responses.",
            "Create a signed webhook verifier interface and fake implementation for tests.",
            "Implement replay protection using timestamp tolerance and nonce cache.",
            "Redact Authorization, Cookie, and Set-Cookie headers from logs.",
            "Validate CORS origin decisions with exact matching rules.",
            "Create a secure random id helper with prefix validation.",
            "Build an audit log event for sensitive permission changes.",
            "Detect suspicious login bursts from event records.",
            "Create a security review checklist for a new API client.",
        ],
    },
    {
        "number": 14,
        "folder": "14_Modules_Tooling_Packaging",
        "slug": "modules_tooling_packaging",
        "title": "Modules, Tooling, and Packaging",
        "level": "Advanced",
        "concepts": [
            "ESM",
            "package exports",
            "tsconfig",
            "build output",
            "API surface",
            "semantic versioning",
            "code generation",
            "release checks",
        ],
        "exercises": [
            "Design a package exports map for public, internal, and testing entry points.",
            "Create a barrel file that exports only stable public APIs.",
            "Detect accidental public API changes by comparing exported symbol names.",
            "Build a typed feature flag manifest that can generate docs.",
            "Create a small code generator that emits TypeScript types from JSON metadata.",
            "Write a script that validates package.json engines, scripts, and exports.",
            "Create build-time environment replacement with explicit allowed keys.",
            "Design an ESM-friendly dynamic import helper.",
            "Create a CLI argument parser for a project maintenance script.",
            "Build a release notes generator from conventional commit-like records.",
            "Validate tsconfig strictness settings programmatically.",
            "Create a dependency policy checker for forbidden packages.",
            "Build a typed configuration loader for multiple deployment environments.",
            "Create a migration script runner with dry-run support.",
            "Generate a markdown API summary from endpoint definitions.",
            "Create a package health report with tests, typecheck, coverage, and bundle size fields.",
            "Design a monorepo workspace dependency graph validator.",
            "Create a version compatibility checker for plugin manifests.",
            "Build a safe script runner that refuses destructive commands without explicit confirmation.",
            "Create a production readiness checklist for a TypeScript library release.",
        ],
    },
    {
        "number": 15,
        "folder": "15_Fullstack_Frontend_Production",
        "slug": "fullstack_frontend_production",
        "title": "Fullstack and Frontend Production TypeScript",
        "level": "Advanced",
        "concepts": [
            "forms",
            "state reducers",
            "optimistic updates",
            "route params",
            "accessibility",
            "query cache",
            "DTO mapping",
            "browser APIs",
        ],
        "exercises": [
            "Create a typed form state reducer with dirty, touched, and validation state.",
            "Map API validation errors into field-level UI errors.",
            "Build an optimistic update helper with rollback data.",
            "Create a route params parser that validates ids and optional filters.",
            "Implement accessible keyboard navigation state for a menu.",
            "Create a query cache key builder for list and detail pages.",
            "Normalize API DTOs into UI view models.",
            "Build a typed localStorage wrapper with schema validation.",
            "Create a browser-safe feature detection helper.",
            "Implement a finite-state reducer for a data-fetching component.",
            "Build a typed event handler map for UI analytics events.",
            "Create a file drop validator for size, type, and count.",
            "Implement undo and redo state transitions for an editor.",
            "Create a form autosave scheduler with debounce and cancellation.",
            "Build an offline queue for browser actions.",
            "Create a typed websocket message handler registry.",
            "Map server permissions into UI action availability.",
            "Create display formatters for money, dates, status labels, and empty values.",
            "Build a safe URL state serializer for filters and sorting.",
            "Design a view-model layer that prevents raw API nulls from reaching components.",
        ],
    },
    {
        "number": 16,
        "folder": "16_Capstone_Production_Services",
        "slug": "capstone_production_services",
        "title": "Capstone Production Services",
        "level": "Expert",
        "concepts": [
            "architecture",
            "service layers",
            "SDKs",
            "queues",
            "observability",
            "security",
            "testing",
            "deployment readiness",
        ],
        "exercises": [
            "Build a mini typed API SDK with validation, retries, pagination, and redacted logging.",
            "Create an order checkout service with domain model, policies, result errors, and unit tests.",
            "Build a background job runner with concurrency limit, retry, dead-letter output, and graceful shutdown.",
            "Create a customer import pipeline from CSV stream to validated domain records.",
            "Build a feature flag service with typed flags, rollout rules, and audit logging.",
            "Create a secure webhook receiver with validation, replay protection, and typed events.",
            "Build a config and observability module suitable for multiple services.",
            "Create a repository layer with contract tests and an in-memory implementation.",
            "Build a DataLoader-style batching layer for dependency calls.",
            "Create a cache-backed read model with TTL, invalidation events, and tests.",
            "Build a public error response layer that maps internal failures safely.",
            "Create a CLI maintenance tool with dry-run mode and structured output.",
            "Build a permissions engine for roles, scopes, ownership, and audit events.",
            "Create an integration test harness with fake HTTP dependencies and fake time.",
            "Build a production readiness report for a TypeScript package or service.",
            "Create a streaming file processor with progress metrics and cancellation.",
            "Build an event-sourced audit trail for order status changes.",
            "Create a frontend-safe view model layer for checkout and support-ticket screens.",
            "Build a performance benchmark comparing cached and uncached dependency calls.",
            "Prepare a portfolio case study explaining architecture, types, tests, and production tradeoffs.",
        ],
    },
]


def write_file(relative_path: str, content: str) -> None:
    path = ROOT / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content.strip() + "\n", encoding="utf-8")


def function_name(module_number: int, exercise_number: int) -> str:
    return f"challenge{module_number:02d}_{exercise_number:02d}"


def task_file_name(module: dict[str, object]) -> str:
    return f"task_{module['number']:02d}_{module['slug']}.ts"


def test_file_name(module: dict[str, object]) -> str:
    return f"task_{module['number']:02d}_{module['slug']}.test.ts"


def format_task_file(module: dict[str, object]) -> str:
    module_number = int(module["number"])
    concepts = ", ".join(module["concepts"])
    lines = [
        "/**",
        "=" * 78,
        f"  TASK {module_number:02d}: {module['title']}",
        "=" * 78,
        "",
        f"LEVEL: {module['level']}",
        f"CONCEPTS: {concepts}",
        "",
        "INSTRUCTIONS:",
        "Implement each exported challenge function.",
        "Keep strict TypeScript enabled, avoid any unless the task explicitly asks for an escape hatch,",
        "and prefer small, typed helpers over one large function.",
        "",
        "TESTING:",
        "Each challenge has a skipped sample test in __tests__.",
        "Remove .skip from one challenge at a time after you implement it.",
        "*/",
        "",
        'import { todo, type ChallengeInput } from "../src/shared/challenge";',
        "",
    ]

    for index, exercise in enumerate(module["exercises"], start=1):
        name = function_name(module_number, index)
        lines.extend(
            [
                "// " + "-" * 75,
                f"// Challenge {module_number:02d}.{index:02d}",
                f"// {exercise}",
                f"export function {name}(input: ChallengeInput): unknown {{",
                "  void input;",
                f'  return todo("{module_number:02d}.{index:02d}", "{exercise}");',
                "}",
                "",
            ]
        )

    return "\n".join(lines)


def sample_input(module_number: int, exercise_number: int) -> str:
    payload = {
        "challengeId": f"{module_number:02d}.{exercise_number:02d}",
        "now": "2026-04-29T00:00:00.000Z",
        "records": [
            {
                "id": "rec_1",
                "customerId": "cus_1",
                "amount": 120,
                "status": "active",
                "tags": ["priority", "paid"],
            },
            {
                "id": "rec_2",
                "customerId": "cus_2",
                "amount": 80,
                "status": "pending",
                "tags": ["trial"],
            },
        ],
        "options": {
            "limit": 2,
            "strict": True,
            "tenantId": "tenant_demo",
        },
    }
    return json.dumps(payload, indent=2).replace("true", "true").replace("false", "false")


def format_test_file(module: dict[str, object]) -> str:
    module_number = int(module["number"])
    task_name = task_file_name(module).replace(".ts", "")
    import_path = f"../{task_name}"
    export_names = [
        function_name(module_number, index)
        for index in range(1, len(module["exercises"]) + 1)
    ]
    export_assertions = "\n".join(
        f'    expect(task.{name}).toBeTypeOf("function");' for name in export_names
    )
    lines = [
        'import { describe, expect, it } from "vitest";',
        'import type { ChallengeInput } from "../../src/shared/challenge";',
        f'import * as task from "{import_path}";',
        "",
        f'describe("Task {module_number:02d}: {module["title"]}", () => {{',
        '  it("exports all challenge functions", () => {',
        export_assertions,
        "  });",
        "});",
        "",
        "// Sample behavior tests are skipped by default.",
        "// Remove .skip from one challenge at a time after implementing the matching function.",
        "",
    ]

    for index, exercise in enumerate(module["exercises"], start=1):
        name = function_name(module_number, index)
        sample = sample_input(module_number, index)
        lines.extend(
            [
                f'describe.skip("Challenge {module_number:02d}.{index:02d}: {exercise}", () => {{',
                '  it("sample case", () => {',
                f"    const input: ChallengeInput = {sample} as const;",
                "    const expected = {",
                f'      challenge: "{module_number:02d}.{index:02d}",',
                '      note: "replace this placeholder with the exact expected output for your implementation",',
                "    } as const;",
                "",
                f"    expect(task.{name}(input)).toEqual(expected);",
                "  });",
                "});",
                "",
            ]
        )

    return "\n".join(lines)


def format_module_readme(module: dict[str, object]) -> str:
    concepts = "\n".join(f"- {concept}" for concept in module["concepts"])
    exercises = "\n".join(
        f"| {module['number']:02d}.{index:02d} | {exercise} |"
        for index, exercise in enumerate(module["exercises"], start=1)
    )
    task_path = task_file_name(module)
    test_path = f"__tests__/{test_file_name(module)}"
    return (
        f"# Task {module['number']:02d}: {module['title']}\n\n"
        f"Level: {module['level']}\n\n"
        "## Concepts\n\n"
        f"{concepts}\n\n"
        "## Files\n\n"
        f"- Task file: `{task_path}`\n"
        f"- Sample tests: `{test_path}`\n\n"
        "## Exercises\n\n"
        "| # | Prompt |\n"
        "|---|--------|\n"
        f"{exercises}\n"
    )


def build_root_readme() -> str:
    table = "\n".join(
        f"| {module['number']:02d} | `{module['folder']}` | {module['title']} | {module['level']} | 20 |"
        for module in MODULES
    )
    total = sum(len(module["exercises"]) for module in MODULES)
    return (
        "# Advanced TypeScript Production Mastery\n\n"
        "This track is for becoming advanced with TypeScript in production codebases: strict typing, runtime boundaries, async systems, Node.js, APIs, testing, observability, performance, security, tooling, frontend integration, and capstone services.\n\n"
        "## Setup\n\n"
        "From `C:\\Learning\\Typescript`:\n\n"
        "```powershell\n"
        "npm install\n"
        "npm run typecheck\n"
        "npm test\n"
        "```\n\n"
        "From `C:\\Learning`, you can also use the helper scripts:\n\n"
        "```powershell\n"
        "Typescript/scripts/verify.ps1\n"
        "Typescript/scripts/test_task.ps1 Typescript/01_Type_System_Narrowing/__tests__/task_01_type_system_narrowing.test.ts\n"
        "```\n\n"
        "## How to Practice\n\n"
        "1. Open a module task file.\n"
        "2. Implement one exported challenge function.\n"
        "3. Open the matching `__tests__` file.\n"
        "4. Remove `.skip` from that challenge's sample test.\n"
        "5. Replace the placeholder expected value with the real expected result.\n"
        "6. Run the single module test, for example:\n\n"
        "```powershell\n"
        "npx vitest --run 01_Type_System_Narrowing/__tests__/task_01_type_system_narrowing.test.ts\n"
        "```\n\n"
        "The default test suite verifies that all challenge functions are exported and keeps the project green until you opt into each sample test.\n\n"
        "## Modules\n\n"
        "| # | Folder | Topic | Level | Exercises |\n"
        "|---|--------|-------|-------|-----------|\n"
        f"{table}\n\n"
        f"Total exercises: {total}\n\n"
        "## Production Standard\n\n"
        "A task is complete when the implementation is strict-mode safe, has meaningful sample tests, avoids unnecessary `any`, handles edge cases, and explains the production tradeoffs around errors, data boundaries, performance, or maintainability.\n"
    )


def build_plan() -> str:
    rows = "\n".join(
        f"| {module['number']:02d} | {module['title']} | {module['level']} | {', '.join(module['concepts'][:4])} | 20 | [ ] |"
        for module in MODULES
    )
    return (
        "# Ultra TypeScript Mastery Plan\n\n"
        "Goal: move from good TypeScript to production-grade TypeScript across backend, frontend, tooling, tests, and service architecture.\n\n"
        "| # | Module | Level | Main Skills | Exercises | Status |\n"
        "|---|--------|-------|-------------|-----------|--------|\n"
        f"{rows}\n\n"
        "## Suggested Order\n\n"
        "1. Type system, generics, validation, and data transformations.\n"
        "2. Async, errors, Node.js, HTTP, and domain modeling.\n"
        "3. Testing, observability, performance, security, and tooling.\n"
        "4. Frontend production patterns and capstone services.\n\n"
        "## Weekly Plan\n\n"
        "| Week | Focus |\n"
        "|------|-------|\n"
        "| 1 | Modules 01-04: strict types, generics, validation, data transforms |\n"
        "| 2 | Modules 05-08: async, errors, Node.js, API clients |\n"
        "| 3 | Modules 09-11: domain modeling, tests, observability |\n"
        "| 4 | Modules 12-14: performance, security, tooling |\n"
        "| 5 | Modules 15-16: frontend patterns and capstones |\n"
    )


def build_rubric() -> str:
    return dedent(
        """
        # TypeScript Interview and Production Readiness Rubric

        ## 6/10: Strong Intermediate

        - Uses strict mode without fighting the compiler.
        - Understands generics, narrowing, discriminated unions, and utility types.
        - Can write readable async code and meaningful unit tests.

        ## 8/10: Advanced Working Level

        - Designs safe runtime boundaries with validation and DTO mapping.
        - Models errors with typed results or domain-specific error classes.
        - Builds testable services using dependency injection and fakes.
        - Handles concurrency, retries, cancellation, caching, and observability.

        ## 10/10: Production Ready

        - Designs maintainable TypeScript APIs, SDKs, services, and packages.
        - Explains tradeoffs around type complexity, runtime validation, performance, and security.
        - Builds reliable test suites with unit, contract, integration-style, and edge-case coverage.
        - Creates production-ready modules with logging, metrics, config, graceful shutdown, and release checks.
        """
    )


def build_package_json() -> str:
    package = {
        "name": "advanced-typescript-production-mastery",
        "version": "1.0.0",
        "private": True,
        "type": "module",
        "scripts": {
            "typecheck": "tsc --noEmit",
            "test": "vitest --run",
            "test:watch": "vitest",
            "test:coverage": "vitest --run --coverage",
            "generate": "python tools/generate_typescript_curriculum.py",
        },
        "dependencies": {
            "zod": "latest",
        },
        "devDependencies": {
            "@types/node": "latest",
            "tsx": "latest",
            "typescript": "latest",
            "vitest": "latest",
        },
    }
    return json.dumps(package, indent=2)


def build_tsconfig() -> str:
    config = {
        "compilerOptions": {
            "target": "ES2022",
            "lib": ["ES2022", "DOM"],
            "module": "ESNext",
            "moduleResolution": "Bundler",
            "types": ["node", "vitest/globals"],
            "strict": True,
            "noUncheckedIndexedAccess": True,
            "exactOptionalPropertyTypes": True,
            "noImplicitOverride": True,
            "noFallthroughCasesInSwitch": True,
            "useUnknownInCatchVariables": True,
            "noUnusedLocals": True,
            "noUnusedParameters": True,
            "forceConsistentCasingInFileNames": True,
            "esModuleInterop": True,
            "skipLibCheck": True,
            "isolatedModules": True,
            "verbatimModuleSyntax": True,
        },
        "include": ["**/*.ts"],
        "exclude": ["node_modules", "dist", "coverage"],
    }
    return json.dumps(config, indent=2)


def build_vitest_config() -> str:
    return dedent(
        """
        import { defineConfig } from "vitest/config";

        export default defineConfig({
          test: {
            globals: false,
            environment: "node",
            include: ["**/__tests__/**/*.test.ts"],
            coverage: {
              provider: "v8",
              reporter: ["text", "html"],
            },
          },
        });
        """
    )


def build_shared_challenge() -> str:
    return dedent(
        """
        export type JsonPrimitive = string | number | boolean | null;
        export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
        export type JsonObject = { readonly [key: string]: JsonValue };
        export type JsonArray = readonly JsonValue[];

        export type ChallengeRecord = Readonly<{
          id: string;
          customerId: string;
          amount: number;
          status: string;
          tags: readonly string[];
        }>;

        export type ChallengeInput = Readonly<{
          challengeId: string;
          now: string;
          records: readonly ChallengeRecord[];
          options: Readonly<{
            limit: number;
            strict: boolean;
            tenantId: string;
          }>;
        }>;

        export type Ok<T> = Readonly<{ ok: true; value: T }>;
        export type Err<E> = Readonly<{ ok: false; error: E }>;
        export type Result<T, E> = Ok<T> | Err<E>;

        export function ok<T>(value: T): Ok<T> {
          return { ok: true, value };
        }

        export function err<E>(error: E): Err<E> {
          return { ok: false, error };
        }

        export function assertNever(value: never): never {
          throw new Error(`Unexpected value: ${String(value)}`);
        }

        export function todo(id: string, title: string): never {
          throw new Error(`TODO: Challenge ${id} - ${title}`);
        }
        """
    )


def build_solutions_readme() -> str:
    return (
        "# Solutions\n\n"
        "Keep polished solutions here if you prefer not to write directly in the task files.\n\n"
        "Recommended pattern:\n\n"
        "- implement the challenge in the module task file first;\n"
        "- copy the final version here only after tests pass;\n"
        "- add notes about type tradeoffs, runtime validation, and production edge cases.\n"
    )


def build_gitignore() -> str:
    return dedent(
        """
        node_modules/
        dist/
        coverage/
        .env
        .env.*
        !.env.example
        """
    )


def build_verify_script() -> str:
    return dedent(
        """
        $ErrorActionPreference = "Stop"

        $TypeScriptRoot = Resolve-Path (Join-Path $PSScriptRoot "..")

        Push-Location $TypeScriptRoot
        try {
            npm run typecheck
            npm test
        }
        finally {
            Pop-Location
        }
        """
    )


def build_test_task_script() -> str:
    return dedent(
        """
        param(
            [Parameter(Mandatory = $true)]
            [string]$Path
        )

        $ErrorActionPreference = "Stop"

        $TypeScriptRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
        $TestPath = Resolve-Path $Path

        Push-Location $TypeScriptRoot
        try {
            npm exec vitest -- --run $TestPath
        }
        finally {
            Pop-Location
        }
        """
    )


def main() -> None:
    write_file("package.json", build_package_json())
    write_file("tsconfig.json", build_tsconfig())
    write_file("vitest.config.ts", build_vitest_config())
    write_file(".gitignore", build_gitignore())
    write_file("scripts/verify.ps1", build_verify_script())
    write_file("scripts/test_task.ps1", build_test_task_script())
    write_file("README.md", build_root_readme())
    write_file("ULTRA_TYPESCRIPT_PLAN.md", build_plan())
    write_file("INTERVIEW_READINESS_RUBRIC.md", build_rubric())
    write_file("src/shared/challenge.ts", build_shared_challenge())
    write_file("solutions/README.md", build_solutions_readme())

    seen: set[str] = set()
    for module in MODULES:
        if len(module["exercises"]) != 20:
            raise SystemExit(f"{module['title']} has {len(module['exercises'])} exercises, expected 20.")

        for exercise in module["exercises"]:
            normalized = exercise.lower().strip()
            if normalized in seen:
                raise SystemExit(f"Duplicate exercise found: {exercise}")
            seen.add(normalized)

        folder = str(module["folder"])
        write_file(f"{folder}/README.md", format_module_readme(module))
        write_file(f"{folder}/{task_file_name(module)}", format_task_file(module))
        write_file(f"{folder}/__tests__/{test_file_name(module)}", format_test_file(module))

    total = sum(len(module["exercises"]) for module in MODULES)
    print(f"Generated {len(MODULES)} TypeScript modules with {total} exercises.")


if __name__ == "__main__":
    main()

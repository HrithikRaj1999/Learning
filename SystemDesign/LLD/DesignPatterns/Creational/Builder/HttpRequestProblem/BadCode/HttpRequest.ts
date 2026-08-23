// =============================================================================
// WHAT IS WRONG — missing Builder pattern
// =============================================================================
// PATTERN IDEA: a Builder constructs a complex object step by step with named,
// chainable methods, validates at build(), and produces an immutable result —
// instead of one giant positional constructor.
//
// WHAT'S WRONG HERE: HttpRequest has a "telescoping" constructor with 7 positional
// params. The call site is a row of bare values where `5000, 3, true` carry no
// meaning and timeout/retries are trivially swapped.
//
// REAL SCENARIO: someone swaps the timeout and retries arguments — now it retries
// 5000 times with a 3ms timeout. There's also no validation, so illegal combos
// (GET with a body, retries on a non-idempotent method) sail through. Adding an
// option means another positional param and updating every call site.
//
// WHY BAD: unreadable, error-prone call sites; no validation of field
// combinations; brittle to extend.
//
// HOW TO FIX (no code): a RequestBuilder with method(), header(), body(),
// timeout(), retries() chained calls, and a build() that validates invariants and
// returns an immutable HttpRequest. Each option is self-documenting; illegal
// combos are rejected in one place.
// =============================================================================
// ❌ NO BUILDER — telescoping constructor for an HTTP request. Unreadable call
// site; optional args become a sea of undefined/positional guesses.
export class HttpRequest {
  constructor(
    public url: string,
    public method: string = "GET",
    public headers: Record<string, string> = {},
    public body: string | null = null,
    public timeoutMs: number = 0,
    public retries: number = 0,
    public followRedirects: boolean = true,
  ) {}
}
// What is `3`? what is `true`? easy to swap timeout and retries:
const r = new HttpRequest("/api", "POST", { "x": "1" }, "{}", 5000, 3, true);
// also: no validation -> retries with GET+body that some servers reject

import { HttpRequest } from "./HttpRequest";
import type { HttpMethod } from "./HttpRequest";

const request = HttpRequest.builder().setUrl("/api").setMethod("POST").build();
console.log(request);

// Consumer: reads the built request through its getters (this is why getters exist)
function send(req: HttpRequest): void {
  console.log(`Sending ${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  console.log("Timeout:", req.timeoutMs, "Retries:", req.retries, "FollowRedirects:", req.followRedirects);
}

send(request);

/**
 * ============================================================================
 * TAKEAWAYS — Builder Pattern (OOP)
 * ============================================================================
 * 1. Readable construction: chained setters replace a 7-arg constructor, so you
 *    never have to remember argument order (setUrl().setMethod()...build()).
 * 2. Validation in one place: build() enforces all rules (non-empty url, no body
 *    on GET/HEAD, non-negative timeout/retries) before the object can exist.
 * 3. Immutability: fields are `private readonly` and the constructor is private,
 *    so once built the request cannot change and cannot be created invalidly.
 * 4. Defensive copies: getters like `headers` return a copy so callers can't
 *    mutate internal state.
 * 5. Optional-with-defaults: set only what you need; the rest use sane defaults.
 *
 * ============================================================================
 * SAME IDEA IN FUNCTIONAL PROGRAMMING
 * ============================================================================
 * FP replaces the mutable builder object + chained setters with pure functions
 * that each take a config and return a NEW config (never mutate). Composition
 * (pipe / reduce) plays the role of the setter chain, and a final validate()
 * plays the role of build().
 */

// --- Functional equivalent (no classes, no mutation) ------------------------

type FnHttpRequest = {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body: string | null;
  timeoutMs: number;
  retries: number;
  followRedirects: boolean;
};

// A "transform" is a pure function: old request -> new request
type Transform = (req: FnHttpRequest) => FnHttpRequest;

const base: FnHttpRequest = {
  url: "",
  method: "GET",
  headers: {},
  body: null,
  timeoutMs: 0,
  retries: 0,
  followRedirects: true,
};

// Each helper returns a NEW object (spread) instead of mutating — like the setters
const withUrl = (url: string): Transform => (r) => ({ ...r, url });
const withMethod = (method: HttpMethod): Transform => (r) => ({ ...r, method });
const withHeader = (k: string, v: string): Transform => (r) => ({
  ...r,
  headers: { ...r.headers, [k]: v },
});
const withBody = (body: string | null): Transform => (r) => ({ ...r, body });

// pipe = compose transforms left-to-right (this is the FP version of chaining)
const pipe = (...fns: Transform[]): Transform =>
  (req) => fns.reduce((acc, fn) => fn(acc), req);

// validate = the FP version of build() (returns errors instead of a side effect)
function validate(r: FnHttpRequest): FnHttpRequest {
  if (!r.url.trim()) throw new Error("url is required");
  if (r.body !== null && (r.method === "GET" || r.method === "HEAD")) {
    throw new Error(`A ${r.method} request cannot have a body.`);
  }
  return r;
}

// Usage: build config functionally, then validate — no shared mutable state
const fnRequest = validate(
  pipe(
    withUrl("/api"),
    withMethod("POST"),
    withHeader("Content-Type", "application/json"),
    withBody(JSON.stringify({ ok: true })),
  )(base),
);

console.log("Functional request:", fnRequest);



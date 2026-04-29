# Task 13: Security and Input Hardening

Level: Advanced

## Concepts

- redaction
- allowlists
- SSRF defense
- rate limiting
- safe merge
- token handling
- validation
- least privilege

## Files

- Task file: `task_13_security_hardening.ts`
- Sample tests: `__tests__/task_13_security_hardening.test.ts`

## Exercises

| # | Prompt |
|---|--------|
| 13.01 | Create a recursive secret redactor for logs and error metadata. |
| 13.02 | Implement a safe object merge that rejects __proto__, constructor, and prototype keys. |
| 13.03 | Validate redirect URLs against an allowlist of hosts. |
| 13.04 | Build an SSRF-safe URL validator for outbound HTTP calls. |
| 13.05 | Create a password policy checker with structured failure reasons. |
| 13.06 | Implement constant-time token comparison for fixed-length secrets. |
| 13.07 | Create a rate limiter keyed by user id and IP address. |
| 13.08 | Validate uploaded filenames and normalize them safely. |
| 13.09 | Build a permission checker using roles, scopes, and resource ownership. |
| 13.10 | Create a least-privilege policy matrix for service actions. |
| 13.11 | Sanitize user-visible strings for plain-text notifications. |
| 13.12 | Prevent leaking stack traces in public API error responses. |
| 13.13 | Create a signed webhook verifier interface and fake implementation for tests. |
| 13.14 | Implement replay protection using timestamp tolerance and nonce cache. |
| 13.15 | Redact Authorization, Cookie, and Set-Cookie headers from logs. |
| 13.16 | Validate CORS origin decisions with exact matching rules. |
| 13.17 | Create a secure random id helper with prefix validation. |
| 13.18 | Build an audit log event for sensitive permission changes. |
| 13.19 | Detect suspicious login bursts from event records. |
| 13.20 | Create a security review checklist for a new API client. |

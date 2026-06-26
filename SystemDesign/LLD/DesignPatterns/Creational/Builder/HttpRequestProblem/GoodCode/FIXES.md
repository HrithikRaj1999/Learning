# Builder — HTTP Request Problem — Fix Hints
> Build a request fluently; validate before producing it.
## Wrong now
7-positional constructor, mostly optional. `5000, 3, true` is unreadable and
swap-prone; no validation of illegal combos.
## Hints
- [ ] `HttpRequestBuilder` with chainable `.url()`, `.method()`, `.header(k,v)`,
      `.body()`, `.timeout()`, `.retries()` returning `this`.
- [ ] `.build()` validates (e.g. reject body on GET, retries ≥ 0) → immutable request.
- [ ] Keep `HttpRequest` constructor private/narrow.
- [ ] Lightweight TS alt: a typed options object `{ url, method?, ... }` — mention trade-off.
## Done-when
- [ ] Call site is self-describing; illegal requests fail at `build()`.

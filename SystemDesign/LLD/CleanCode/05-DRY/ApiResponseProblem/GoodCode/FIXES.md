# DRY — API Response Envelope — Fix Hints
> Build the response shape in one helper, not per handler.
## Wrong now
Each handler builds the envelope by hand; the shape already drifted (`ts` vs
`timestamp`, a missing field).
## Hints
- [ ] Helpers `ok(data)` and `fail(error)` produce the canonical envelope
      (success, data, error, timestamp) every time.
- [ ] All handlers return via these helpers.
- [ ] Type the envelope so drift fails to compile.
## Done-when
- [ ] Every response has identical structure; field names can't drift.

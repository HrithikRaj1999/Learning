# Error Handling — File Upload — Fix Hints
> Never swallow; never report success on failure.
## Wrong now
The catch is empty and the function returns "uploaded" regardless — failures are
invisible; the user thinks it worked.
## Hints
- [ ] Don't catch unless you handle. Let the error propagate, or catch → log with
      context → rethrow / return an explicit failure result.
- [ ] Use a `Result`/discriminated union (`{ ok: true } | { ok: false, error }`),
      not a string that lies.
- [ ] Validate size before the try; surface a user-friendly message on failure.
## Done-when
- [ ] A failed upload never returns success; the error is logged + surfaced.

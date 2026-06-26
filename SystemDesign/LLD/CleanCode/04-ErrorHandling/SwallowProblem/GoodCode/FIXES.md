# Clean Code — Error Handling Fix Hints
> Fail fast, fail loud, fail with context. Never swallow.
## Wrong now
`getConfig` swallows the parse error and returns `null` → blows up far away.
`parseAge` throws a string and returns `-1` as a magic error value mixed with
valid results.
## Hints
- [ ] Don't return `null`/`-1` on failure. Either throw a meaningful error or
      return an explicit result type (`Result<T, E>` / discriminated union).
- [ ] Never `catch` and ignore. If you catch, add context and rethrow, or handle
      it for real (log + recover).
- [ ] Throw `Error` objects (or subclasses), never strings — you lose the stack
      otherwise.
- [ ] Don't use exceptions for normal control flow (the `throw "bad"` for a
      non-numeric input).
- [ ] Validate at the boundary; give callers user-friendly messages, log details
      server-side.
## Done-when
- [ ] No empty catch blocks, no `return null` to signal failure.
- [ ] Errors carry context and are either handled or propagated, never swallowed.

# Chain of Responsibility — Request Middleware — Fix Hints
> Middleware is a chain: each stage handles, rejects, or forwards.
## Wrong now
auth/validate/rate-limit/handle are nested ifs in one function; reordering or
inserting a stage means rewriting it.
## Hints
- [ ] `Middleware` with `setNext()` and `handle(req)`; return early to short-circuit.
- [ ] `AuthMiddleware`, `ValidationMiddleware`, `RateLimitMiddleware`, then the
      final handler — each calls `next` on success.
- [ ] Compose the pipeline once; order is explicit via linking.
- [ ] New cross-cutting concern (logging, CORS) = new middleware.
## Done-when
- [ ] Stages are independent + reorderable; the handler isn't a nested if.

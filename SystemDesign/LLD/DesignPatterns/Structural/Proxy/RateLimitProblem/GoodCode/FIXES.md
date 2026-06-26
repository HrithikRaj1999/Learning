# Proxy — Rate Limit Problem — Fix Hints
> A proxy can throttle/meter access to an expensive subject.
## Wrong now
Callers hit `ExpensiveService.run()` with no limit; throttling would otherwise be
duplicated at every call site.
## Hints
- [ ] `Service` interface: `run(job)`. `ExpensiveService` is the real subject.
- [ ] `RateLimitingProxy implements Service`, tracking call counts/timestamps and
      rejecting or delaying when over the limit, then delegating.
- [ ] Clients depend on `Service`; limit policy is centralized.
- [ ] Combine with the caching proxy idea (proxies can chain).
## Done-when
- [ ] Over-limit calls are blocked in one place, not per caller.

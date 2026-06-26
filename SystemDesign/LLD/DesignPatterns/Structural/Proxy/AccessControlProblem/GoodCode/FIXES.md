# Proxy — Access Control Problem — Fix Hints
> A protection proxy centralizes authorization in front of the real object.
## Wrong now
Auth checks live inconsistently inside the real object; `read()` has none → guests
read secrets. Scattered checks = forgotten checks.
## Hints
- [ ] `DocumentAccess` interface: `read`, `delete`.
- [ ] `DocumentStore` is the real subject (no auth concern).
- [ ] `ProtectedDocumentProxy implements DocumentAccess`, doing the role checks in
      ONE place, then delegating to the real store.
- [ ] Clients only get the proxy; the real store isn't directly reachable.
## Done-when (security)
- [ ] Every operation passes through one authorization gate.

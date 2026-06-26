# Chain of Responsibility — Fix Hints
> Intent: pass a request along a chain; each handler decides to handle or forward.
## Wrong now
One if/else ladder hardcodes every tier + their order. New tier edits the function.
## Hints
- [ ] Define an abstract `Handler` with `setNext(h)` and `handle(req)`.
- [ ] Each concrete handler (`Bot`, `Junior`, `Senior`, `Manager`) either handles
      the request or calls `next.handle(req)`.
- [ ] Build the chain by linking handlers; the client calls only the first one.
- [ ] New tier = new handler inserted into the chain. No edits to existing ones.
- [ ] Decide behavior when nobody handles (return null / throw) — be explicit.
## Done-when
- [ ] No central switch over level.
- [ ] Re-ordering tiers = re-linking, not rewriting logic.

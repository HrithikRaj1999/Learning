# Guard Clauses — Null Check — Fix Hints
> Flatten nested null checks with guards or optional chaining.
## Wrong now
A 4-deep pyramid just to read `user.profile.address.city`.
## Hints
- [ ] Early-return guards: `if (!user) return "no user";` …, then return the city.
- [ ] Or collapse with optional chaining + nullish coalescing:
      `user?.profile?.address?.city ?? "unknown"` when distinct messages aren't needed.
- [ ] Choose based on whether each missing level needs its own message.
## Done-when
- [ ] No nesting pyramid; intent is one readable expression or a flat guard list.

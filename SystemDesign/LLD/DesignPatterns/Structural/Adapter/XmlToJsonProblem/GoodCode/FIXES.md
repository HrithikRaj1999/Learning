# Adapter — XML→JSON Problem — Fix Hints
> Wrap the legacy XML service so callers see clean objects.
## Wrong now
`Dashboard` regex-parses XML inline. Every consumer re-implements parsing;
fragile and duplicated.
## Hints
- [ ] Define a modern target: `UserApi { getUser(id): { id; name } }`.
- [ ] `LegacyUserAdapter implements UserApi`, wrapping `LegacyUserService` and
      doing XML→object conversion (with a real parser) in ONE place.
- [ ] Consumers depend on `UserApi`; the legacy shape never leaks out.
## Done-when
- [ ] No XML parsing outside the adapter.

# Builder — User Registration Problem — Fix Hints
> Required core + many optionals = textbook Builder case.
## Wrong now
8-arg constructor with 6 optionals → `undefined, undefined, undefined...` and
positional confusion.
## Hints
- [ ] `UserBuilder` constructed with the REQUIRED fields (email, password), then
      chainable optional setters (`.withPhone()`, `.subscribeNewsletter()`).
- [ ] `.build()` validates email format + password strength → immutable `User`.
- [ ] No more positional optionals; each optional reads by name.
## Done-when
- [ ] Required fields are enforced; optionals are set by name, any subset.

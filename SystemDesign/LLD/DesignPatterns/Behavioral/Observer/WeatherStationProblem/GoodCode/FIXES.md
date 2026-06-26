# Observer — Fix Hints
> Intent: one-to-many — subject notifies all subscribers automatically.
## Wrong now
`WeatherStation` holds concrete displays and calls each by hand. New display
edits the subject; easy to forget one.
## Hints
- [ ] Define an `Observer` interface: `update(temp)`.
- [ ] Subject keeps a list of `Observer`s with `subscribe()` / `unsubscribe()`.
- [ ] `setTemp()` loops the list and calls `update()` — subject knows the
      interface only, not concretes.
- [ ] Displays implement `Observer` and self-register. New display = new class +
      subscribe call. Subject untouched.
- [ ] Decide push (pass data) vs pull (observer queries subject) — state your choice.
## Done-when
- [ ] Adding/removing observers needs no change to the subject.
- [ ] No concrete observer type appears inside the subject.

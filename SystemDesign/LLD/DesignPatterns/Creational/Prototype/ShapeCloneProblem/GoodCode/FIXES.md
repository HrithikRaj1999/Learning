# Prototype — Shape Clone Problem — Fix Hints
> Clone must copy ALL state, deeply, and stay correct as the class evolves.
## Wrong now
`copy()` forgot `rotation` (added later) and shares the `position` object →
mutating the clone moves the original.
## Hints
- [ ] Deep-copy nested state: new `{ x, y }` object, not the same reference.
- [ ] Copy every field; prefer a clone strategy that won't silently drop new
      fields (e.g. `structuredClone(this)` then fix prototype, or copy from a
      single source-of-truth like serialization).
- [ ] Add a test that asserts clone equals original field-by-field, then mutate
      the clone and assert the original is unchanged.
## Done-when
- [ ] Adding a field can't break clone correctness unnoticed.
- [ ] Clone is fully independent.

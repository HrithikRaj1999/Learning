# DRY — Validation Duplication — Fix Hints
> One rule, one place — duplication breeds drift (it already has: 6/8/5).
## Wrong now
Email + password checks copied into login/register/reset; the min-length already
diverged across the three.
## Hints
- [ ] Extract `validateEmail(email)` and `validatePassword(password, minLen)`.
- [ ] Decide the canonical min length (one constant) — the drift is a real bug.
- [ ] Each endpoint calls the shared validators.
- [ ] Beware false DRY: only merge rules that truly share intent.
## Done-when
- [ ] A validation change is one edit; lengths are consistent + intentional.

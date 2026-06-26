# Comments — Lying Comments — Fix Hints
> A wrong comment is worse than no comment.
## Wrong now
"10% discount" but code does 20%; "free shipping" with no such logic; "returns
age" but returns name. Readers trust comments and get misled.
## Hints
- [ ] Delete or correct every comment that contradicts the code.
- [ ] Prefer making the code self-explaining (constant `DISCOUNT_RATE = 0.2`,
      rename `getInfo` → `getUserName`) so the comment isn't needed.
- [ ] Keep comments only for WHY (e.g. "20% per Q3 promo, see TICKET-123").
## Done-when
- [ ] No comment states something the code doesn't do.

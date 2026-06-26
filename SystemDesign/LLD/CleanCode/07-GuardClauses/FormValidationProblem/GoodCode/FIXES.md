# Guard Clauses — Form Validation — Fix Hints
> Each failing rule returns early; submission is the flat happy path.
## Wrong now
Validation rules nest 4 deep; the "submitted" result hides at the bottom.
## Hints
- [ ] One guard per rule, each returning its error first.
- [ ] After all guards pass, `return "submitted"` at the top level.
- [ ] If rules grow, collect errors in an array and return them all (better UX).
## Done-when
- [ ] No nested validation; success path is flat.

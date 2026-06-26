# Functions — Report Problem — Fix Hints
> Separate data pipeline from presentation.
## Wrong now
`generateSalesReport` filters, aggregates, formats, and prints together. Can't
reuse the numbers; returns nothing (only prints).
## Hints
- [ ] `filterRecent(orders)`, `aggregate(orders)` → pure, return data.
- [ ] `formatReport(summary)` → returns a string; printing is the caller's choice.
- [ ] Top function composes pure steps; no console mixed into computation.
## Done-when
- [ ] Aggregation is unit-testable; formatting separate from I/O.

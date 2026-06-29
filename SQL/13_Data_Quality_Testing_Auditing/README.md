# Task 13: Data Quality, Testing, and Auditing

Level: Basic → Expert

## Concepts

- null/duplicate checks, validation
- reconciliation, deduplication
- profiling, anomaly detection
- cross-table consistency, scorecards

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 13.01 | Return rows where customers.email is null or duplicated. |
| 13.02 | Return order_items with quantity <= 0 or unit_price < 0. |
| 13.03 | Find shipments delivered before they were shipped. |
| 13.04 | Find paid orders with no successful payment row. |
| 13.05 | Reconcile order net total vs successful payment amount. |
| 13.06 | Detect duplicate web_events on session/event/time/url. |
| 13.07 | Profile null percentage for selected customer columns. |
| 13.08 | Flag daily revenue more than 3 std devs from trailing average. |
| 13.09 | Find impossible status combinations across orders/payments/shipments. |
| 13.10 | Build a scorecard with test_name, failing_rows, severity, owner. |

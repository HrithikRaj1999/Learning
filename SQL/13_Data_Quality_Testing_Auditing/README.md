# Task 13: Data Quality, Testing, and Auditing

Level: Advanced

## Concepts

- data tests
- deduplication
- reconciliation
- anomaly detection
- audit queries
- migration validation
- null checks
- referential checks

## Exercises

| # | Prompt |
|---|--------|
| 13.01 | Write a test query that returns rows when customers.email is null or duplicated. |
| 13.02 | Write a test query that returns order_items with quantity <= 0 or unit_price < 0. |
| 13.03 | Write a reconciliation query comparing order net total to successful payment amount. |
| 13.04 | Detect customers with multiple active subscriptions for the same plan. |
| 13.05 | Find shipments delivered before they were shipped. |
| 13.06 | Find orders marked delivered without a delivered shipment. |
| 13.07 | Find paid orders with no successful payment row. |
| 13.08 | Find payment rows whose amount is more than 5 percent above order total. |
| 13.09 | Detect duplicate web_events based on session_id, event_type, occurred_at, and page_url. |
| 13.10 | Find support tickets that are closed but have no closed_at timestamp. |
| 13.11 | Find ticket_events that occurred before the ticket opened_at time. |
| 13.12 | Build an anomaly query for daily revenue more than 3 standard deviations from the trailing average. |
| 13.13 | Build a freshness check for web_events requiring data within the last 24 hours of 2026-04-30. |
| 13.14 | Write a row-count validation query before and after loading staging.raw_orders. |
| 13.15 | Write a checksum-style aggregate for payments to compare source and target loads. |
| 13.16 | Detect orphaned foreign keys if constraints were temporarily disabled. |
| 13.17 | Write a query that profiles null percentage for selected customer columns. |
| 13.18 | Write a query that profiles min, max, average, and percentile values for payment amount. |
| 13.19 | Find impossible status combinations across orders, payments, and shipments. |
| 13.20 | Create an audit report of orders updated in the last 7 days using an audit table design. |
| 13.21 | Validate that every product category in products exists in a categories reference table. |
| 13.22 | Find inactive products that still receive new order_items after deactivation. |
| 13.23 | Detect city spelling variants using lower, trim, and grouping. |
| 13.24 | Write a migration validation query for renaming coupon_code to promotion_code. |
| 13.25 | Create a data quality scorecard result with test_name, failing_rows, severity, and owner. |

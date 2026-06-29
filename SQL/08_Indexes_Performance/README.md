# Task 08: Indexes and Query Performance

Level: Basic → Expert

## Concepts

- EXPLAIN / EXPLAIN ANALYZE
- B-tree, composite, partial, expression, covering indexes
- GIN, sargability, keyset pagination
- plan comparison, indexing strategy

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 08.01 | EXPLAIN a customer lookup by email and propose an index. |
| 08.02 | Create a composite index for customer_id + order_date desc. |
| 08.03 | Create a partial index for open support tickets. |
| 08.04 | Create an expression index on lower(email) and use it. |
| 08.05 | Create a covering index for payments by order_id including amount/status. |
| 08.06 | Rewrite a non-sargable date filter so an index can be used. |
| 08.07 | Create a GIN index on web_events.metadata and query by device. |
| 08.08 | Write keyset pagination using order_date and order_id. |
| 08.09 | Compare DISTINCT ON vs ROW_NUMBER plans for latest payment per order. |
| 08.10 | Design an indexing strategy for a month/city/status/channel dashboard. |

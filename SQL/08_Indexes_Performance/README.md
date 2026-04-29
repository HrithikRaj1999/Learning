# Task 08: Indexes and Query Performance

Level: Advanced

## Concepts

- EXPLAIN
- EXPLAIN ANALYZE
- B-tree indexes
- composite indexes
- partial indexes
- expression indexes
- covering indexes
- GIN
- BRIN
- statistics

## Exercises

| # | Prompt |
|---|--------|
| 08.01 | Run EXPLAIN for a customer lookup by email and propose the supporting index. |
| 08.02 | Create a composite index for orders filtered by customer_id and sorted by order_date desc. |
| 08.03 | Create a partial index for open support tickets only. |
| 08.04 | Create an expression index for lower(customers.email) and write a query that can use it. |
| 08.05 | Create a covering index for payments by order_id including amount and status. |
| 08.06 | Compare index column order for queries filtering by channel and order_date. |
| 08.07 | Rewrite a non-sargable date filter on orders so an index can be used. |
| 08.08 | Create a GIN index for web_events.metadata and query by device. |
| 08.09 | Create a GIN index for full-text search over support ticket subject and note text. |
| 08.10 | Create a BRIN index strategy for a large append-only web_events table. |
| 08.11 | Use EXPLAIN ANALYZE to compare EXISTS versus JOIN DISTINCT for customer activity. |
| 08.12 | Find a query where an index might hurt because the table is tiny or selectivity is low. |
| 08.13 | Create statistics on correlated columns channel and status in orders. |
| 08.14 | Refresh a materialized daily revenue view and discuss index placement on it. |
| 08.15 | Detect unused indexes using catalog-query comments and explain when to drop one. |
| 08.16 | Optimize a top-products query by pre-aggregating order_items in a CTE. |
| 08.17 | Avoid SELECT * in a wide join and explain how it changes memory and I/O. |
| 08.18 | Compare OFFSET pagination to keyset pagination for orders. |
| 08.19 | Write a keyset pagination query using order_date and order_id. |
| 08.20 | Use DISTINCT ON versus ROW_NUMBER for latest payment per order and compare plans. |
| 08.21 | Optimize a query that filters JSONB metadata by campaign and device. |
| 08.22 | Identify a join that needs indexes on both foreign key and referenced key. |
| 08.23 | Explain when VACUUM and ANALYZE matter after bulk loading seed data. |
| 08.24 | Create a query that shows estimated versus actual rows and describe what mismatch means. |
| 08.25 | Design an indexing strategy for a dashboard with filters by month, city, status, and channel. |

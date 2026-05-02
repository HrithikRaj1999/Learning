SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 08: INDEXES AND QUERY PERFORMANCE
-- ============================================================================
-- You're the DBA optimizing a slow production system. Dashboards time out,
-- reports take minutes. These challenges teach you to diagnose with EXPLAIN,
-- create the right index types, and understand when indexes help vs hurt.
-- ============================================================================


-- ==================================================
-- 08.01 - EXPLAIN a Customer Email Lookup
-- ==================================================
-- SCENARIO: The login page searches customers by email. It's slow.
-- Run EXPLAIN to see if it's doing a sequential scan, then create an index.
--
-- YOUR TASK: EXPLAIN the email lookup query. Then CREATE INDEX to support it.
--
-- EXPECTED OUTPUT: EXPLAIN output + index creation statement.
-- ==================================================



-- ==================================================
-- 08.02 - Composite Index for Customer Orders
-- ==================================================
-- SCENARIO: The customer dashboard queries orders filtered by customer_id
-- and sorted by order_date DESC. A composite index speeds both.
--
-- YOUR TASK: CREATE INDEX on orders(customer_id, order_date DESC).
--
-- EXPECTED OUTPUT: Composite index supporting filter + sort.
-- ==================================================



-- ==================================================
-- 08.03 - Partial Index for Open Tickets
-- ==================================================
-- SCENARIO: 90% of tickets are closed. The support dashboard only queries
-- open ones. A partial index on just open tickets is smaller and faster.
--
-- YOUR TASK: CREATE INDEX ... WHERE status != 'closed'.
--
-- EXPECTED OUTPUT: Partial index targeting the active subset.
-- ==================================================



-- ==================================================
-- 08.04 - Expression Index for Case-Insensitive Email
-- ==================================================
-- SCENARIO: Email lookups use LOWER(email) but the index is on raw email.
-- Create an expression index on the lowercased value.
--
-- YOUR TASK: CREATE INDEX ON customers (LOWER(email)).
-- Write a query that uses it.
--
-- EXPECTED OUTPUT: Expression index + matching query.
-- ==================================================



-- ==================================================
-- 08.05 - Covering Index for Payments
-- ==================================================
-- SCENARIO: A report queries payments by order_id and only reads amount + status.
-- A covering index includes those columns to avoid table lookups.
--
-- YOUR TASK: CREATE INDEX ... INCLUDE (amount, status).
--
-- EXPECTED OUTPUT: Covering (INCLUDE) index definition.
-- ==================================================



-- ==================================================
-- 08.06 - Column Order Matters
-- ==================================================
-- SCENARIO: Queries filter by channel AND order_date. Does index order
-- matter? Create both orders and explain which is better for each query.
--
-- YOUR TASK: Create index (channel, order_date) vs (order_date, channel).
-- Comment on which helps which query pattern.
--
-- EXPECTED OUTPUT: Two indexes with explanatory comments about column order.
-- ==================================================



-- ==================================================
-- 08.07 - Fix Non-Sargable Date Filter
-- ==================================================
-- SCENARIO: A query uses WHERE EXTRACT(YEAR FROM order_date) = 2026.
-- This can't use an index. Rewrite to be sargable.
--
-- YOUR TASK: Show the bad query, then rewrite using WHERE order_date >= ... AND order_date < ...
--
-- EXPECTED OUTPUT: Non-sargable (bad) → sargable (good) rewrite.
-- ==================================================



-- ==================================================
-- 08.08 - GIN Index for JSONB Metadata
-- ==================================================
-- SCENARIO: web_events.metadata is JSONB. Queries filter by device value.
-- A GIN index supports containment (@>) operator queries.
--
-- YOUR TASK: CREATE INDEX ... USING gin(metadata). Write query using @>.
--
-- EXPECTED OUTPUT: GIN index + matching JSONB query.
-- ==================================================



-- ==================================================
-- 08.09 - Full-Text Search Index
-- ==================================================
-- SCENARIO: Support agents search ticket subjects for keywords. Create a
-- GIN index on tsvector for fast full-text search.
--
-- YOUR TASK: CREATE INDEX using to_tsvector on support_tickets.subject.
-- Write a query using to_tsquery.
--
-- EXPECTED OUTPUT: FTS index + search query.
-- ==================================================



-- ==================================================
-- 08.10 - BRIN Index for Append-Only Table
-- ==================================================
-- SCENARIO: web_events is append-only and naturally ordered by time.
-- BRIN indexes are tiny and perfect for this pattern.
--
-- YOUR TASK: CREATE INDEX ... USING brin(occurred_at). Explain when BRIN beats B-tree.
--
-- EXPECTED OUTPUT: BRIN index + explanatory comments.
-- ==================================================



-- ==================================================
-- 08.11 - EXISTS vs JOIN DISTINCT (EXPLAIN ANALYZE)
-- ==================================================
-- SCENARIO: Two ways to check "customers with orders": EXISTS subquery
-- vs JOIN + DISTINCT. Compare their execution plans.
--
-- YOUR TASK: Write both queries with EXPLAIN ANALYZE. Comment on which wins.
--
-- EXPECTED OUTPUT: Two queries with plan comparison comments.
-- ==================================================



-- ==================================================
-- 08.12 - When Indexes Hurt
-- ==================================================
-- SCENARIO: A tiny 5-row lookup table doesn't benefit from an index.
-- High-selectivity queries on boolean columns might not either.
--
-- YOUR TASK: Show a case where sequential scan is faster than index scan.
-- Explain why (table size, selectivity, maintenance cost).
--
-- EXPECTED OUTPUT: Example + explanation of when indexes are counterproductive.
-- ==================================================



-- ==================================================
-- 08.13 - Extended Statistics on Correlated Columns
-- ==================================================
-- SCENARIO: Queries filter orders by both channel AND status. The planner
-- underestimates rows because it assumes independence. Extended stats help.
--
-- YOUR TASK: CREATE STATISTICS on (channel, status) FROM orders.
--
-- EXPECTED OUTPUT: Statistics object creation + explanation.
-- ==================================================



-- ==================================================
-- 08.14 - Materialized View Refresh + Indexes
-- ==================================================
-- SCENARIO: The daily_revenue materialized view needs refreshing and
-- proper indexes for dashboard queries.
--
-- YOUR TASK: REFRESH MATERIALIZED VIEW. CREATE INDEX on the mat view.
-- Discuss CONCURRENTLY option.
--
-- EXPECTED OUTPUT: Refresh command + index on materialized view.
-- ==================================================



-- ==================================================
-- 08.15 - Detect Unused Indexes
-- ==================================================
-- SCENARIO: Over time, indexes accumulate but some are never used.
-- They slow down writes for no read benefit. Find and evaluate them.
--
-- YOUR TASK: Query pg_stat_user_indexes to find indexes with low scan count.
-- Discuss criteria for dropping.
--
-- EXPECTED OUTPUT: Catalog query + decision criteria in comments.
-- ==================================================



-- ==================================================
-- 08.16 - Optimize with Pre-Aggregation
-- ==================================================
-- SCENARIO: A "top products" query scans all order_items every time.
-- Pre-aggregate in a CTE so the sort operates on fewer rows.
--
-- YOUR TASK: Rewrite with CTE pre-aggregation. Explain the improvement.
--
-- EXPECTED OUTPUT: Optimized query with pre-aggregated CTE.
-- ==================================================



-- ==================================================
-- 08.17 - Avoid SELECT * in Joins
-- ==================================================
-- SCENARIO: A wide 6-table join uses SELECT *. This fetches hundreds of
-- columns, wastes memory, and prevents covering indexes from working.
--
-- YOUR TASK: Show SELECT * (bad) vs explicit column list (good).
-- Comment on memory/IO impact.
--
-- EXPECTED OUTPUT: Before/after with performance explanation.
-- ==================================================



-- ==================================================
-- 08.18 - OFFSET vs Keyset Pagination
-- ==================================================
-- SCENARIO: Page 500 of orders takes 3 seconds with OFFSET. Keyset
-- pagination stays fast regardless of page depth.
--
-- YOUR TASK: Show OFFSET pagination (slow for deep pages) vs keyset
-- pagination (consistent speed). Explain why.
--
-- EXPECTED OUTPUT: Both approaches with performance comparison comments.
-- ==================================================



-- ==================================================
-- 08.19 - Keyset Pagination Implementation
-- ==================================================
-- SCENARIO: Implement proper keyset (cursor-based) pagination for orders
-- using order_date + order_id as the cursor.
--
-- YOUR TASK: WHERE (order_date, order_id) < (last_seen_date, last_seen_id)
-- ORDER BY order_date DESC, order_id DESC LIMIT 20.
--
-- EXPECTED OUTPUT: Working keyset pagination query.
-- ==================================================



-- ==================================================
-- 08.20 - DISTINCT ON vs ROW_NUMBER
-- ==================================================
-- SCENARIO: Getting latest payment per order. PostgreSQL's DISTINCT ON is
-- concise but ROW_NUMBER is more portable. Compare execution plans.
--
-- YOUR TASK: Write both approaches. EXPLAIN and comment on plan differences.
--
-- EXPECTED OUTPUT: Both queries with plan comparison.
-- ==================================================



-- ==================================================
-- 08.21 - Optimize JSONB Filter Query
-- ==================================================
-- SCENARIO: A dashboard filters web_events by campaign AND device in metadata.
-- Without an index on the JSONB path, it's slow.
--
-- YOUR TASK: Create appropriate GIN or expression index. Rewrite query to use it.
--
-- EXPECTED OUTPUT: Index + optimized JSONB query.
-- ==================================================



-- ==================================================
-- 08.22 - Indexes on Both Sides of a Join
-- ==================================================
-- SCENARIO: A join between orders and order_items is slow. Indexes are
-- needed on both the FK (order_items.order_id) and PK (orders.order_id).
--
-- YOUR TASK: Identify which side needs an index. Create it. Explain why
-- both sides of a join matter.
--
-- EXPECTED OUTPUT: Index creation + join performance explanation.
-- ==================================================



-- ==================================================
-- 08.23 - VACUUM and ANALYZE After Bulk Load
-- ==================================================
-- SCENARIO: After loading 1M rows into staging, queries are slow because
-- statistics are stale and dead tuples exist.
--
-- YOUR TASK: Run VACUUM ANALYZE. Explain what each does and when to run them.
--
-- EXPECTED OUTPUT: VACUUM ANALYZE command + detailed explanation comments.
-- ==================================================



-- ==================================================
-- 08.24 - Estimated vs Actual Rows Mismatch
-- ==================================================
-- SCENARIO: EXPLAIN shows estimated=100 rows but ANALYZE shows actual=50000.
-- This mismatch causes bad plan choices. Diagnose and fix.
--
-- YOUR TASK: Show a query with row estimate mismatch. Explain causes
-- (stale stats, correlated columns, function volatility).
--
-- EXPECTED OUTPUT: EXPLAIN ANALYZE showing mismatch + diagnosis.
-- ==================================================



-- ==================================================
-- 08.25 - Dashboard Indexing Strategy
-- ==================================================
-- SCENARIO: A dashboard filters by month, city, status, and channel.
-- Design a complete indexing strategy covering all filter combinations.
--
-- YOUR TASK: Design indexes for the most common filter patterns.
-- Explain composite index ordering decisions.
--
-- EXPECTED OUTPUT: Multiple indexes with strategy explanation.
-- ==================================================



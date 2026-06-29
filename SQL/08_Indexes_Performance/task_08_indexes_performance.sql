SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 08: INDEXES AND QUERY PERFORMANCE
-- ============================================================================
-- You tune queries. The 10 challenges progress from EXPLAIN basics to expert
-- plan comparisons and a full dashboard indexing strategy.
-- ============================================================================


-- ==================================================
-- 08.01 - EXPLAIN a Customer Lookup  [BASIC]
-- ==================================================
-- SCENARIO: Customers are looked up by email.
--
-- YOUR TASK: Run EXPLAIN for a lookup by email and propose the right index.
-- ==================================================



-- ==================================================
-- 08.02 - Composite Index for Orders  [BASIC]
-- ==================================================
-- SCENARIO: Orders are filtered by customer_id, newest first.
--
-- YOUR TASK: Create a composite index on (customer_id, order_date DESC).
-- ==================================================



-- ==================================================
-- 08.03 - Partial Index for Open Tickets  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Only open tickets are queried frequently.
--
-- YOUR TASK: Create a partial index for status='open' support_tickets.
-- ==================================================



-- ==================================================
-- 08.04 - Expression Index on lower(email)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Case-insensitive email lookups are common.
--
-- YOUR TASK: Create an expression index on lower(email) and a matching query.
-- ==================================================



-- ==================================================
-- 08.05 - Covering Index for Payments  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Payment-by-order reads should be index-only.
--
-- YOUR TASK: Create a covering index on payments(order_id) INCLUDE amount,status.
-- ==================================================



-- ==================================================
-- 08.06 - Make a Date Filter Sargable  [ADVANCED]
-- ==================================================
-- SCENARIO: A non-sargable date filter blocks the index.
--
-- YOUR TASK: Rewrite the filter as a half-open range so the index is used.
-- ==================================================



-- ==================================================
-- 08.07 - GIN Index on JSONB Metadata  [ADVANCED]
-- ==================================================
-- SCENARIO: Filter web_events by metadata device.
--
-- YOUR TASK: Create a GIN index on metadata and query by device.
-- ==================================================



-- ==================================================
-- 08.08 - Keyset Pagination  [ADVANCED]
-- ==================================================
-- SCENARIO: Replace slow OFFSET paging on orders.
--
-- YOUR TASK: Write keyset pagination using (order_date, order_id).
-- ==================================================



-- ==================================================
-- 08.09 - DISTINCT ON vs ROW_NUMBER  [EXPERT]
-- ==================================================
-- SCENARIO: Get latest payment per order two ways.
--
-- YOUR TASK: Compare DISTINCT ON vs ROW_NUMBER plans with EXPLAIN ANALYZE.
-- ==================================================



-- ==================================================
-- 08.10 - Dashboard Indexing Strategy  [EXPERT]
-- ==================================================
-- SCENARIO: A dashboard filters by month, city, status, channel.
--
-- YOUR TASK: Design the supporting indexes and justify column order.
-- ==================================================

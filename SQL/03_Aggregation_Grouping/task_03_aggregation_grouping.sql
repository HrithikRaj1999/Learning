SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 03: AGGREGATION AND GROUPING
-- ============================================================================
-- You build summary reports for leadership. The 10 challenges progress from
-- basic GROUP BY to expert ROLLUP/GROUPING SETS and JSON aggregation.
-- ============================================================================


-- ==================================================
-- 03.01 - Revenue per Order  [BASIC]
-- ==================================================
-- SCENARIO: Finance needs the net total of each order.
--
-- YOUR TASK: Per order, sum quantity * unit_price * (1 - discount_pct/100)
-- from order_items. Return order_id and revenue.
-- ==================================================



-- ==================================================
-- 03.02 - Paid Amount per Customer  [BASIC]
-- ==================================================
-- SCENARIO: Finance wants total collected per customer.
--
-- YOUR TASK: Sum payment amount where status='successful', grouped by customer.
-- ==================================================



-- ==================================================
-- 03.03 - Orders by Status and Channel  [BASIC]
-- ==================================================
-- SCENARIO: Ops wants a count matrix of orders.
--
-- YOUR TASK: Count orders grouped by status and channel.
-- ==================================================



-- ==================================================
-- 03.04 - Repeat Customers (HAVING)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Loyalty wants customers with more than two orders.
--
-- YOUR TASK: Return customers with order_count > 2 and latest_order_date.
-- ==================================================



-- ==================================================
-- 03.05 - Average Order Value per Month  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Finance tracks monthly AOV.
--
-- YOUR TASK: Compute average order line total per calendar month.
-- ==================================================



-- ==================================================
-- 03.06 - Ticket Counts by Priority (Filtered Aggregates)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Support wants open/pending/closed counts per priority.
--
-- YOUR TASK: Use COUNT(*) FILTER (WHERE ...) per status, grouped by priority.
-- ==================================================



-- ==================================================
-- 03.07 - Monthly Revenue with Subtotals (ROLLUP)  [ADVANCED]
-- ==================================================
-- SCENARIO: A report needs monthly revenue plus a grand total row.
--
-- YOUR TASK: Use ROLLUP to add subtotal/grand-total rows by month.
-- ==================================================



-- ==================================================
-- 03.08 - Revenue Cube (GROUPING SETS)  [ADVANCED]
-- ==================================================
-- SCENARIO: One result needs revenue by month, by channel, and grand total.
--
-- YOUR TASK: Use GROUPING SETS for those three groupings in one query.
-- ==================================================



-- ==================================================
-- 03.09 - Categories per Customer (string_agg)  [ADVANCED]
-- ==================================================
-- SCENARIO: CRM wants each customer's purchased categories as one cell.
--
-- YOUR TASK: Return each customer with a comma-separated list of categories.
-- ==================================================



-- ==================================================
-- 03.10 - Order Items as JSON Array  [EXPERT]
-- ==================================================
-- SCENARIO: An API needs each order as a JSON array of item objects.
--
-- YOUR TASK: Return each order as a JSON array of {product_name, quantity,
-- net_amount} objects.
-- ==================================================

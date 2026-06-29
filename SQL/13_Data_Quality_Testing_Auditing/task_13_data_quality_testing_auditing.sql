SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 13: DATA QUALITY, TESTING, AND AUDITING
-- ============================================================================
-- You guard data trust. The 10 challenges progress from basic null/dup checks
-- to expert cross-table consistency and a data quality scorecard.
-- ============================================================================


-- ==================================================
-- 13.01 - Null or Duplicate Emails  [BASIC]
-- ==================================================
-- SCENARIO: Emails must be unique and present.
--
-- YOUR TASK: Return rows where customers.email is null or duplicated.
-- ==================================================



-- ==================================================
-- 13.02 - Invalid Order Items  [BASIC]
-- ==================================================
-- SCENARIO: Quantities and prices must be sane.
--
-- YOUR TASK: Return order_items with quantity <= 0 or unit_price < 0.
-- ==================================================



-- ==================================================
-- 13.03 - Shipped After Delivered  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Delivery cannot precede shipment.
--
-- YOUR TASK: Find shipments delivered before they were shipped.
-- ==================================================



-- ==================================================
-- 13.04 - Paid Orders Without Payment  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: A paid order must have a successful payment.
--
-- YOUR TASK: Find paid orders with no successful payment row.
-- ==================================================



-- ==================================================
-- 13.05 - Order vs Payment Reconciliation  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Net totals must match collected payments.
--
-- YOUR TASK: Compare order net total to successful payment amount, flag gaps.
-- ==================================================



-- ==================================================
-- 13.06 - Duplicate Web Events  [ADVANCED]
-- ==================================================
-- SCENARIO: Double-logged events skew funnels.
--
-- YOUR TASK: Detect dupes on session_id, event_type, occurred_at, page_url.
-- ==================================================



-- ==================================================
-- 13.07 - Null Profiling  [ADVANCED]
-- ==================================================
-- SCENARIO: Measure completeness.
--
-- YOUR TASK: Report null percentage for selected customer columns.
-- ==================================================



-- ==================================================
-- 13.08 - Revenue Anomaly Detection  [ADVANCED]
-- ==================================================
-- SCENARIO: Flag abnormal daily revenue.
--
-- YOUR TASK: Find days where revenue is >3 std devs from trailing average.
-- ==================================================



-- ==================================================
-- 13.09 - Impossible Status Combinations  [EXPERT]
-- ==================================================
-- SCENARIO: Orders, payments, shipments must agree.
--
-- YOUR TASK: Find impossible combinations across the three tables.
-- ==================================================



-- ==================================================
-- 13.10 - Data Quality Scorecard  [EXPERT]
-- ==================================================
-- SCENARIO: One result summarizes all checks.
--
-- YOUR TASK: Return test_name, failing_rows, severity, owner for each test.
-- ==================================================

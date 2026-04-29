/*
==============================================================================
  TASK 13: Data Quality, Testing, and Auditing
==============================================================================

LEVEL: Advanced
CONCEPTS: data tests, deduplication, reconciliation, anomaly detection, audit queries, migration validation, null checks, referential checks

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 13.01
-- Write a test query that returns rows when customers.email is null or duplicated.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.02
-- Write a test query that returns order_items with quantity <= 0 or unit_price < 0.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.03
-- Write a reconciliation query comparing order net total to successful payment amount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.04
-- Detect customers with multiple active subscriptions for the same plan.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.05
-- Find shipments delivered before they were shipped.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.06
-- Find orders marked delivered without a delivered shipment.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.07
-- Find paid orders with no successful payment row.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.08
-- Find payment rows whose amount is more than 5 percent above order total.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.09
-- Detect duplicate web_events based on session_id, event_type, occurred_at, and page_url.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.10
-- Find support tickets that are closed but have no closed_at timestamp.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.11
-- Find ticket_events that occurred before the ticket opened_at time.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.12
-- Build an anomaly query for daily revenue more than 3 standard deviations from the trailing average.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.13
-- Build a freshness check for web_events requiring data within the last 24 hours of 2026-04-30.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.14
-- Write a row-count validation query before and after loading staging.raw_orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.15
-- Write a checksum-style aggregate for payments to compare source and target loads.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.16
-- Detect orphaned foreign keys if constraints were temporarily disabled.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.17
-- Write a query that profiles null percentage for selected customer columns.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.18
-- Write a query that profiles min, max, average, and percentile values for payment amount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.19
-- Find impossible status combinations across orders, payments, and shipments.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.20
-- Create an audit report of orders updated in the last 7 days using an audit table design.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.21
-- Validate that every product category in products exists in a categories reference table.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.22
-- Find inactive products that still receive new order_items after deactivation.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.23
-- Detect city spelling variants using lower, trim, and grouping.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.24
-- Write a migration validation query for renaming coupon_code to promotion_code.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 13.25
-- Create a data quality scorecard result with test_name, failing_rows, severity, and owner.
-- Write your solution below.

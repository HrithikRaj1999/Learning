SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 06: DATA MODELING AND DDL
-- ============================================================================
-- You design schema changes. The 10 challenges progress from basic tables &
-- constraints to expert partitioning, exclusion constraints, and star schema.
-- ============================================================================


-- ==================================================
-- 06.01 - Product Reviews Table  [BASIC]
-- ==================================================
-- SCENARIO: Add reviews with a 1-5 rating, one per customer per product.
--
-- YOUR TASK: CREATE product_reviews with rating CHECK 1..5 and a unique
-- (customer_id, product_id).
-- ==================================================



-- ==================================================
-- 06.02 - Shipment Date CHECK  [BASIC]
-- ==================================================
-- SCENARIO: Prevent impossible delivery dates.
--
-- YOUR TASK: Add a CHECK so shipments.delivered_at is never before shipped_at.
-- ==================================================



-- ==================================================
-- 06.03 - Generated Net Line Amount  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Store the net amount so reports don't recompute it.
--
-- YOUR TASK: Add a generated column net_line_amount to order_items.
-- ==================================================



-- ==================================================
-- 06.04 - Sales Rep Foreign Key  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Enforce valid sales reps with explicit delete behavior.
--
-- YOUR TASK: Add FK orders.sales_rep_id -> employees with ON DELETE SET NULL.
-- ==================================================



-- ==================================================
-- 06.05 - Normalize Category to Categories Table  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Replace free-text category with a reference table.
--
-- YOUR TASK: Create categories, migrate values, add products.category_id FK.
-- ==================================================



-- ==================================================
-- 06.06 - Campaign-Product Bridge  [ADVANCED]
-- ==================================================
-- SCENARIO: Track which products each campaign promotes.
--
-- YOUR TASK: Create a bridge table with a composite primary key.
-- ==================================================



-- ==================================================
-- 06.07 - Order Status Audit Table  [ADVANCED]
-- ==================================================
-- SCENARIO: Keep history of status transitions.
--
-- YOUR TASK: Create order_status_audit with old_status, new_status, changed_at.
-- ==================================================



-- ==================================================
-- 06.08 - No Overlapping Subscriptions (Exclusion)  [EXPERT]
-- ==================================================
-- SCENARIO: A customer must not have two overlapping active subs per plan.
--
-- YOUR TASK: Add an EXCLUDE constraint preventing overlapping periods.
-- ==================================================



-- ==================================================
-- 06.09 - Partitioned Web Events Archive  [EXPERT]
-- ==================================================
-- SCENARIO: Archive web_events monthly for scale.
--
-- YOUR TASK: Create a monthly RANGE-partitioned web_events_archive.
-- ==================================================



-- ==================================================
-- 06.10 - Star Schema Outline  [EXPERT]
-- ==================================================
-- SCENARIO: Build a reporting mart.
--
-- YOUR TASK: Define fact_orders with dimensions for customer, product, date.
-- ==================================================

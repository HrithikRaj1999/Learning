SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 06: DATA MODELING AND DDL
-- ============================================================================
-- You're the database architect. These challenges require you to CREATE,
-- ALTER, and design tables with proper constraints. Think about real-world
-- data integrity — what should the database enforce so bad data can't sneak in?
-- ============================================================================


-- ==================================================
-- 06.01 - Returns Table Design
-- ==================================================
-- SCENARIO: Customers can return items. Design a normalized returns table
-- that links to orders, order_items, customers, and products with proper
-- foreign keys.
--
-- YOUR TASK: CREATE TABLE returns with return_id, order_id, order_item_id,
-- customer_id, product_id, reason, returned_at, refund_amount. Add FKs.
--
-- EXPECTED OUTPUT: DDL statement creating the returns table with constraints.
-- ==================================================



-- ==================================================
-- 06.02 - Product Reviews Table
-- ==================================================
-- SCENARIO: The company launches product reviews. Rating must be 1-5,
-- and a customer can only review a product once.
--
-- YOUR TASK: CREATE TABLE product_reviews with CHECK(rating BETWEEN 1 AND 5)
-- and UNIQUE(customer_id, product_id).
--
-- EXPECTED OUTPUT: DDL with rating constraint and uniqueness guarantee.
-- ==================================================



-- ==================================================
-- 06.03 - Generated Column for Net Line Amount
-- ==================================================
-- SCENARIO: Instead of calculating net_line_amount every query, store it
-- as a generated column: quantity * unit_price * (1 - discount_pct).
--
-- YOUR TASK: ALTER TABLE order_items ADD COLUMN net_line_amount GENERATED ALWAYS AS (...).
--
-- EXPECTED OUTPUT: ALTER TABLE statement adding the generated column.
-- ==================================================



-- ==================================================
-- 06.04 - Custom Domain for Positive Money
-- ==================================================
-- SCENARIO: Many columns need "positive money" validation. Create a
-- reusable domain type and use it on a new vendor_contracts table.
--
-- YOUR TASK: CREATE DOMAIN positive_money. Then CREATE TABLE vendor_contracts
-- using that domain for amount columns.
--
-- EXPECTED OUTPUT: Domain definition + table using it.
-- ==================================================



-- ==================================================
-- 06.05 - Enum for Ticket Event Types
-- ==================================================
-- SCENARIO: ticket_events.event_type currently allows any string. Restrict
-- it to a defined set using a PostgreSQL enum.
--
-- YOUR TASK: CREATE TYPE ticket_event_type AS ENUM(...). Migrate the column.
--
-- EXPECTED OUTPUT: Enum creation + ALTER TABLE to use it.
-- ==================================================



-- ==================================================
-- 06.06 - Shipment Date CHECK Constraint
-- ==================================================
-- SCENARIO: A shipment can't be delivered before it's shipped. Add a
-- CHECK constraint to prevent this impossible state.
--
-- YOUR TASK: ALTER TABLE shipments ADD CONSTRAINT check_delivery_after_ship
-- CHECK (delivered_at IS NULL OR delivered_at >= shipped_at).
--
-- EXPECTED OUTPUT: ALTER TABLE with the CHECK constraint.
-- ==================================================



-- ==================================================
-- 06.07 - Foreign Key with Delete Behavior
-- ==================================================
-- SCENARIO: orders.sales_rep_id references employees. If a rep leaves,
-- what happens to their orders? Add the FK with explicit ON DELETE behavior.
--
-- YOUR TASK: ALTER TABLE orders ADD CONSTRAINT fk_sales_rep
-- FOREIGN KEY (sales_rep_id) REFERENCES employees(employee_id) ON DELETE SET NULL.
--
-- EXPECTED OUTPUT: FK constraint with chosen delete behavior + comment explaining why.
-- ==================================================



-- ==================================================
-- 06.08 - Staging Schema and Raw Orders Table
-- ==================================================
-- SCENARIO: ETL pipelines land raw data before cleaning. Create a staging
-- schema with a loose table accepting text fields.
--
-- YOUR TASK: CREATE SCHEMA staging; CREATE TABLE staging.raw_orders
-- with all text columns (no type constraints).
--
-- EXPECTED OUTPUT: Schema creation + loose staging table.
-- ==================================================



-- ==================================================
-- 06.09 - Slowly Changing Dimension for Addresses
-- ==================================================
-- SCENARIO: Customers move. Design an SCD Type 2 table that keeps address
-- history with valid_from, valid_to, and is_current flags.
--
-- YOUR TASK: CREATE TABLE customer_addresses with address fields + SCD columns.
--
-- EXPECTED OUTPUT: SCD2 table design with temporal tracking columns.
-- ==================================================



-- ==================================================
-- 06.10 - Normalize Category into Separate Table
-- ==================================================
-- SCENARIO: Products store category as a text string. Normalize it into
-- a categories table and update products to use a foreign key.
--
-- YOUR TASK: CREATE TABLE categories. ALTER TABLE products to add
-- category_id FK. Write migration INSERT + UPDATE.
--
-- EXPECTED OUTPUT: New table + FK + data migration statements.
-- ==================================================



-- ==================================================
-- 06.11 - Campaign-Product Bridge Table
-- ==================================================
-- SCENARIO: Campaigns promote multiple products, and products appear in
-- multiple campaigns. Design the many-to-many bridge table.
--
-- YOUR TASK: CREATE TABLE campaign_products with composite PK
-- (campaign_id, product_id) and foreign keys to both tables.
--
-- EXPECTED OUTPUT: Bridge table with composite primary key.
-- ==================================================



-- ==================================================
-- 06.12 - Unique Active Subscription Constraint
-- ==================================================
-- SCENARIO: A customer shouldn't have two active subscriptions for the
-- same plan simultaneously. Add a constraint to prevent this.
--
-- YOUR TASK: CREATE UNIQUE INDEX on (customer_id, plan_name)
-- WHERE status = 'active'.
--
-- EXPECTED OUTPUT: Partial unique index preventing duplicate active subs.
-- ==================================================



-- ==================================================
-- 06.13 - Order Status Audit Table
-- ==================================================
-- SCENARIO: Every time an order's status changes, record the old status,
-- new status, and when it changed — for compliance tracking.
--
-- YOUR TASK: CREATE TABLE order_status_audit with order_id, old_status,
-- new_status, changed_at, changed_by.
--
-- EXPECTED OUTPUT: Audit table DDL.
-- ==================================================



-- ==================================================
-- 06.14 - Partitioned Web Events Archive
-- ==================================================
-- SCENARIO: web_events grows fast. Partition the archive table by month
-- so old months can be dropped efficiently.
--
-- YOUR TASK: CREATE TABLE web_events_archive (...) PARTITION BY RANGE (occurred_at).
-- Create partitions for specific months.
--
-- EXPECTED OUTPUT: Partitioned parent table + child partition definitions.
-- ==================================================



-- ==================================================
-- 06.15 - Temporary Table for Analysis
-- ==================================================
-- SCENARIO: An analyst needs a temporary workspace to store high-value
-- customers for a one-time deep dive.
--
-- YOUR TASK: CREATE TEMP TABLE high_value_customers AS SELECT ...
-- (customers with total spend > threshold in one month).
--
-- EXPECTED OUTPUT: CTAS statement creating a temporary analysis table.
-- ==================================================



-- ==================================================
-- 06.16 - Star Schema Outline
-- ==================================================
-- SCENARIO: The BI team needs a star schema: fact_orders in the center,
-- with dim_customer, dim_product, dim_date dimensions around it.
--
-- YOUR TASK: CREATE TABLE for fact_orders and each dimension table
-- with appropriate keys and grain.
--
-- EXPECTED OUTPUT: Star schema DDL (fact + 3 dimensions).
-- ==================================================



-- ==================================================
-- 06.17 - Safe NOT NULL Migration
-- ==================================================
-- SCENARIO: customers.country should be NOT NULL, but some rows have NULL.
-- Add the constraint safely: fill NULLs first, then add constraint.
--
-- YOUR TASK: UPDATE nulls to a default → ALTER TABLE ADD NOT NULL.
--
-- EXPECTED OUTPUT: Migration script with safe ordering.
-- ==================================================



-- ==================================================
-- 06.18 - JSONB Column with Required Keys
-- ==================================================
-- SCENARIO: A new events table stores metadata as JSONB, but certain keys
-- (event_type, source) are required. Enforce with CHECK.
--
-- YOUR TASK: CREATE TABLE with JSONB column + CHECK that validates
-- required keys exist.
--
-- EXPECTED OUTPUT: Table with JSONB validation constraint.
-- ==================================================



-- ==================================================
-- 06.19 - Employee-Department Many-to-Many
-- ==================================================
-- SCENARIO: Employees can belong to multiple departments over time.
-- Design the junction table with assignment dates.
--
-- YOUR TASK: CREATE TABLE employee_departments with employee_id,
-- department_id, assigned_from, assigned_to.
--
-- EXPECTED OUTPUT: M:M junction table with temporal fields.
-- ==================================================



-- ==================================================
-- 06.20 - Exclusion Constraint for Overlapping Subscriptions
-- ==================================================
-- SCENARIO: Prevent a customer from having overlapping subscription periods
-- for the same plan. Use a range exclusion constraint.
--
-- YOUR TASK: CREATE exclusion constraint using daterange and &&.
--
-- EXPECTED OUTPUT: Table alteration with EXCLUDE USING gist.
-- ==================================================



-- ==================================================
-- 06.21 - Table and Column Comments
-- ==================================================
-- SCENARIO: New team members struggle to understand what support_tickets
-- columns mean. Add documentation directly in the database.
--
-- YOUR TASK: COMMENT ON TABLE and COMMENT ON COLUMN for support_tickets
-- and ticket_events.
--
-- EXPECTED OUTPUT: COMMENT statements documenting purpose of each object.
-- ==================================================



-- ==================================================
-- 06.22 - Materialized View for Daily Revenue
-- ==================================================
-- SCENARIO: The dashboard queries daily revenue constantly. Pre-compute
-- it as a materialized view for fast reads.
--
-- YOUR TASK: CREATE MATERIALIZED VIEW daily_revenue_summary AS SELECT...
--
-- EXPECTED OUTPUT: Materialized view definition.
-- ==================================================



-- ==================================================
-- 06.23 - Partition Retention Policy
-- ==================================================
-- SCENARIO: web_events partitions older than 6 months should be dropped.
-- Design the naming convention and document the drop strategy.
--
-- YOUR TASK: Comment-documented retention plan with partition naming
-- and DROP PARTITION examples.
--
-- EXPECTED OUTPUT: Documented retention strategy in SQL comments.
-- ==================================================



-- ==================================================
-- 06.24 - Rename Column Migration
-- ==================================================
-- SCENARIO: The team decided coupon_code should be called promotion_code.
-- Rename it without losing data.
--
-- YOUR TASK: ALTER TABLE orders RENAME COLUMN coupon_code TO promotion_code.
--
-- EXPECTED OUTPUT: Safe migration script with before/after comments.
-- ==================================================



-- ==================================================
-- 06.25 - Rollback Script
-- ==================================================
-- SCENARIO: Something went wrong with a DDL change. Write the reverse
-- script that undoes one of the above changes.
--
-- YOUR TASK: Write the rollback for one DDL change (e.g., undo rename,
-- drop constraint, etc.).
--
-- EXPECTED OUTPUT: Reverse migration script.
-- ==================================================



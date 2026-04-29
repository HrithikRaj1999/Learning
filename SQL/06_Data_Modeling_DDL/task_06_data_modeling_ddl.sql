/*
==============================================================================
  TASK 06: Data Modeling and DDL
==============================================================================

LEVEL: Advanced
CONCEPTS: schemas, CREATE TABLE, ALTER TABLE, constraints, foreign keys, normalization, generated columns, domains, enums, partitioning

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 06.01
-- Design a normalized returns table linked to orders, order_items, customers, and products.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.02
-- Create a product_reviews table with rating constrained from 1 to 5 and one review per customer per product.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.03
-- Add a generated column to order_items that stores net_line_amount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.04
-- Create a domain for positive_money and use it on a new vendor_contracts table.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.05
-- Create an enum for ticket_event_type and migrate ticket_events.event_type to use it.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.06
-- Add a CHECK constraint that prevents shipments.delivered_at before shipments.shipped_at.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.07
-- Add a foreign key from orders.sales_rep_id to employees.employee_id with an explicit delete behavior.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.08
-- Create a staging schema and a raw_orders table that accepts loose text fields.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.09
-- Design a slowly changing dimension table for customer addresses.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.10
-- Split product category into a separate categories table and update products to reference it.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.11
-- Create a bridge table for campaigns and products with a composite primary key.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.12
-- Add a unique constraint that prevents duplicate active subscriptions for the same customer and plan.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.13
-- Create an audit table for order status transitions with old_status, new_status, and changed_at.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.14
-- Create a monthly partitioned table for web_events_archive.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.15
-- Create a temporary table that stores one month's high-value customers for analysis.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.16
-- Create a view-friendly star schema outline with fact_orders and dimensions for customer, product, and date.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.17
-- Use ALTER TABLE to add a NOT NULL constraint safely for customers.country.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.18
-- Create a table with a JSONB column and a CHECK constraint that validates required metadata keys.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.19
-- Design a many-to-many relationship between employees and departments with assignment dates.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.20
-- Create an exclusion constraint to prevent overlapping active subscription periods per customer and plan.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.21
-- Add comments on tables and columns for support_tickets and ticket_events.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.22
-- Create a materialized view definition for daily revenue summary.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.23
-- Design a data retention table policy using partition naming and drop strategy comments.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.24
-- Create a migration script that renames coupon_code to promotion_code without losing data.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 06.25
-- Write a rollback script for one DDL change from this module.
-- Write your solution below.

/*
==============================================================================
  TASK 08: Indexes and Query Performance
==============================================================================

LEVEL: Advanced
CONCEPTS: EXPLAIN, EXPLAIN ANALYZE, B-tree indexes, composite indexes, partial indexes, expression indexes, covering indexes, GIN, BRIN, statistics

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 08.01
-- Run EXPLAIN for a customer lookup by email and propose the supporting index.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.02
-- Create a composite index for orders filtered by customer_id and sorted by order_date desc.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.03
-- Create a partial index for open support tickets only.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.04
-- Create an expression index for lower(customers.email) and write a query that can use it.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.05
-- Create a covering index for payments by order_id including amount and status.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.06
-- Compare index column order for queries filtering by channel and order_date.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.07
-- Rewrite a non-sargable date filter on orders so an index can be used.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.08
-- Create a GIN index for web_events.metadata and query by device.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.09
-- Create a GIN index for full-text search over support ticket subject and note text.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.10
-- Create a BRIN index strategy for a large append-only web_events table.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.11
-- Use EXPLAIN ANALYZE to compare EXISTS versus JOIN DISTINCT for customer activity.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.12
-- Find a query where an index might hurt because the table is tiny or selectivity is low.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.13
-- Create statistics on correlated columns channel and status in orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.14
-- Refresh a materialized daily revenue view and discuss index placement on it.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.15
-- Detect unused indexes using catalog-query comments and explain when to drop one.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.16
-- Optimize a top-products query by pre-aggregating order_items in a CTE.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.17
-- Avoid SELECT * in a wide join and explain how it changes memory and I/O.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.18
-- Compare OFFSET pagination to keyset pagination for orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.19
-- Write a keyset pagination query using order_date and order_id.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.20
-- Use DISTINCT ON versus ROW_NUMBER for latest payment per order and compare plans.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.21
-- Optimize a query that filters JSONB metadata by campaign and device.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.22
-- Identify a join that needs indexes on both foreign key and referenced key.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.23
-- Explain when VACUUM and ANALYZE matter after bulk loading seed data.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.24
-- Create a query that shows estimated versus actual rows and describe what mismatch means.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 08.25
-- Design an indexing strategy for a dashboard with filters by month, city, status, and channel.
-- Write your solution below.

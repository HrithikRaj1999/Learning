/*
==============================================================================
  TASK 07: DML, Transactions, and MERGE
==============================================================================

LEVEL: Advanced
CONCEPTS: INSERT, UPDATE, DELETE, UPSERT, MERGE, RETURNING, transactions, savepoints, isolation, locking

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 07.01
-- Insert a new customer and return the generated customer_id.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.02
-- Insert an order with two order_items inside one transaction.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.03
-- Update failed payments back to 'pending' for retry only for orders that are not cancelled.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.04
-- Delete anonymous web_events older than 90 days from 2026-04-30 using a safe preview query first.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.05
-- Use INSERT ... ON CONFLICT to upsert a customer by email.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.06
-- Use MERGE to synchronize a staging product price table into products.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.07
-- Use UPDATE ... FROM to set orders.status to 'delivered' for shipments with delivered_at present and successful payment.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.08
-- Use RETURNING to capture changed order_ids into a follow-up query.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.09
-- Create a transaction with SAVEPOINT around a risky order status update.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.10
-- Write a transaction that transfers ticket ownership from one employee to another.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.11
-- Demonstrate how SELECT FOR UPDATE would protect inventory during order creation.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.12
-- Write two statements that could deadlock if run in opposite order, then reorder them safely.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.13
-- Use DELETE with USING to remove duplicate staging rows while keeping the newest row.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.14
-- Bulk insert campaign rows from a VALUES clause.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.15
-- Use COPY command comments to describe how you would load a CSV into staging.raw_orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.16
-- Update subscription statuses to expired when ended_on is before 2026-04-30.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.17
-- Cancel unpaid pending orders older than 30 days and write affected rows to an audit table.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.18
-- Use a CTE with INSERT to create support tickets for failed payments above 200.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.19
-- Use a writable CTE to insert a ticket_event immediately after creating a support_ticket.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.20
-- Write a transaction that changes product prices and records old and new prices in price_history.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.21
-- Show how READ COMMITTED and REPEATABLE READ would affect a revenue report during concurrent payments.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.22
-- Use advisory-lock comments to protect one monthly billing run from running twice.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.23
-- Use TRUNCATE on a staging table and explain the difference from DELETE in comments.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.24
-- Update order status based on payment and shipment state with a CASE expression.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 07.25
-- Design an idempotent daily load script that can be rerun without duplicating facts.
-- Write your solution below.

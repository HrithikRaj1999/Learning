/*
==============================================================================
  TASK 12: Procedures, Triggers, and Automation
==============================================================================

LEVEL: Advanced
CONCEPTS: SQL functions, PL/pgSQL, procedures, triggers, exception handling, dynamic SQL, audit automation, scheduled jobs

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 12.01
-- Create a SQL function that calculates order net total by order_id.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.02
-- Create a PL/pgSQL function that returns customer lifetime spend.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.03
-- Create a procedure that closes stale pending tickets older than a configurable number of days.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.04
-- Create a trigger that writes order status changes into order_status_audit.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.05
-- Create a trigger that prevents delivered orders from being moved back to pending.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.06
-- Create a trigger that updates products.updated_at whenever list_price changes.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.07
-- Create a function that raises an exception when payment amount exceeds order total by more than 5 percent.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.08
-- Create a procedure that performs a daily revenue snapshot insert.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.09
-- Use dynamic SQL to rebuild indexes for tables matching a naming pattern.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.10
-- Create a trigger on ticket_events that updates support_tickets.updated_at.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.11
-- Create a trigger that auto-closes a ticket when a ticket_event type is 'resolved'.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.12
-- Create an audit function reusable across multiple tables with TG_TABLE_NAME.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.13
-- Create a function that returns a table of top customers with parameters for date range and limit.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.14
-- Create a procedure that retries failed payments by inserting rows into payment_retry_queue.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.15
-- Use exception handling to log failed procedure runs to job_errors.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.16
-- Create a scheduled-job design comment using pg_cron for refreshing materialized views.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.17
-- Create a notification trigger using NOTIFY when urgent tickets are inserted.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.18
-- Create a validation function used by a CHECK constraint for allowed coupon format.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.19
-- Create a function that accepts JSONB input and inserts a web_event after validation.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.20
-- Create a procedure that archives old web_events into a partitioned archive table.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.21
-- Create a trigger that maintains inventory balance after inventory_movements inserts.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.22
-- Create a function that returns order profitability including shipping cost.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.23
-- Create a trigger that blocks deleting customers who have orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.24
-- Create a procedure that reassigns tickets from inactive employees to a queue user.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 12.25
-- Write tests as SQL statements that prove one trigger works for insert, update, and invalid input.
-- Write your solution below.

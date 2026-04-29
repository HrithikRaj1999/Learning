/*
==============================================================================
  TASK 05: Window Functions
==============================================================================

LEVEL: Advanced
CONCEPTS: ROW_NUMBER, RANK, DENSE_RANK, LEAD/LAG, running totals, moving averages, window frames, NTILE, FIRST_VALUE/LAST_VALUE, gaps and islands

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 05.01
-- Rank customers by lifetime net revenue using RANK and DENSE_RANK.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.02
-- Return the first order per customer using ROW_NUMBER.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.03
-- Return the latest support ticket event per ticket using ROW_NUMBER.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.04
-- Calculate a running total of daily successful payment amount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.05
-- Calculate a 7-day moving average of daily web event count.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.06
-- Use LAG to show the previous order date for each customer and days between orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.07
-- Use LEAD to show the next ticket event time for each ticket.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.08
-- Find orders where order total is greater than the customer's previous order total.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.09
-- Compute percent_rank of products by revenue within each category.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.10
-- Divide customers into revenue quartiles using NTILE.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.11
-- Return the top three products by quantity sold within each category.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.12
-- Use FIRST_VALUE to show each customer's first channel and compare it to later channels.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.13
-- Use LAST_VALUE with an explicit frame to show each customer's latest order status on every order row.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.14
-- Calculate cumulative subscription monthly recurring revenue by start month.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.15
-- Detect gaps of more than 14 days between customer web sessions.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.16
-- Group consecutive daily activity into islands per customer.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.17
-- Calculate each order's percentage of monthly revenue using SUM over a partition.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.18
-- Return products whose price is above the category average using AVG as a window function.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.19
-- Calculate support ticket resolution-time rank by priority.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.20
-- Use COUNT over to show total orders per customer without collapsing rows.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.21
-- Build a cohort table using MIN signup month over customer partitions.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.22
-- Calculate running inventory balance per product ordered by movement_at.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.23
-- Find the first failed payment after a successful payment for each customer.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.24
-- Compare each employee's closed ticket count to their department average using window aggregates.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 05.25
-- Create a sessionized web_event result where a new session group starts after 30 minutes of inactivity.
-- Write your solution below.

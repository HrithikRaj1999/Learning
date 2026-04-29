/*
==============================================================================
  TASK 04: Subqueries and CTEs
==============================================================================

LEVEL: Intermediate-Advanced
CONCEPTS: scalar subqueries, correlated subqueries, EXISTS, NOT EXISTS, CTE pipelines, recursive CTEs, LATERAL, materialized CTE behavior

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 04.01
-- Return orders whose total line amount is above the overall average order total.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.02
-- Find customers whose first order was paid successfully within 2 days.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.03
-- Use a CTE to calculate order totals, then rank customers by total spend.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.04
-- Use NOT EXISTS to find products that were never ordered after 2026-03-01.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.05
-- Use EXISTS to find customers who both ordered and opened a support ticket.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.06
-- Return the latest payment per order using a correlated subquery.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.07
-- Return each customer with their most recent web event using a LATERAL join.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.08
-- Use a recursive CTE to walk the employee manager hierarchy from the CEO downward.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.09
-- Use a recursive CTE to return the chain of managers for one employee.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.10
-- Build a CTE pipeline that calculates gross revenue, discounts, net revenue, and payment status per order.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.11
-- Find customers whose lifetime spend is greater than the average lifetime spend of their city.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.12
-- Use a scalar subquery in SELECT to show each product's share of all product revenue.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.13
-- Find orders where every order item has a discount_pct of zero.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.14
-- Find orders where at least one item was discounted by more than 10 percent.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.15
-- Use CTEs to identify customers with a web visit, cart event, and purchase event in sequence.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.16
-- Return products priced above the average price of their category.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.17
-- Use LATERAL to return the top two products by quantity for each customer.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.18
-- Find tickets whose latest event is not a customer reply.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.19
-- Use a CTE to deduplicate web events by session_id, event_type, and occurred_at.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.20
-- Compare monthly revenue to the previous month using CTEs without window functions.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.21
-- Use a CTE to isolate failed payments, then join to orders and customers for a retry report.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.22
-- Find customers with an active subscription but no order in the last 30 days from 2026-04-30.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.23
-- Use nested CTEs to compute category revenue and return categories above the category average.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.24
-- Use a derived table to find each customer's highest value order.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 04.25
-- Write the same top-customer query once with a subquery and once with a CTE, then compare readability.
-- Write your solution below.

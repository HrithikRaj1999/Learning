/*
==============================================================================
  TASK 03: Aggregation and Grouping
==============================================================================

LEVEL: Intermediate-Advanced
CONCEPTS: GROUP BY, HAVING, COUNT DISTINCT, filtered aggregates, ROLLUP, CUBE, GROUPING SETS, percentiles, string_agg, json aggregation

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 03.01
-- Calculate total revenue per order using order_items quantity, unit_price, and discount_pct.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.02
-- Return total paid amount per customer for successful payments only.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.03
-- Count orders by status and channel in a single grouped result.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.04
-- Find customers with more than two orders and show order_count and latest_order_date.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.05
-- Return average order value per month based on line totals.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.06
-- Calculate product-level quantity sold, gross revenue, and average discount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.07
-- Find categories where total quantity sold is greater than 10.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.08
-- Use filtered aggregates to count open, pending, and closed support tickets per priority.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.09
-- Return each sales rep with delivered_order_count and refunded_order_count.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.10
-- Calculate distinct customer count per marketing campaign using web_events.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.11
-- Build a monthly revenue report with subtotal rows using ROLLUP.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.12
-- Build a status-by-channel cube showing counts for every combination and subtotal.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.13
-- Use GROUPING SETS to return revenue by month, by channel, and grand total in one result.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.14
-- Calculate median payment amount per payment method.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.15
-- Calculate 90th percentile delivery duration by carrier.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.16
-- Return each customer with a comma-separated list of categories they purchased.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.17
-- Return each order as a JSON array of item objects containing product_name, quantity, and net_amount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.18
-- Find duplicate customer email domains and count customers per domain.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.19
-- Compute support ticket average resolution hours by assigned employee.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.20
-- Return products whose revenue contribution is more than 15 percent of total revenue.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.21
-- Calculate inventory net movement per product and keep only products with negative net movement.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.22
-- Find days where successful payment amount exceeded 500.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.23
-- Compute monthly active customers based on any web_event or order activity.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.24
-- Group subscriptions by plan_name and status and calculate monthly recurring revenue.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 03.25
-- Return each city with customers_count, order_count, and total_revenue while avoiding double counting.
-- Write your solution below.

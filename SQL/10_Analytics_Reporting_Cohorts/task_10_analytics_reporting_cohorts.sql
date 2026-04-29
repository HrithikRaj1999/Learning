/*
==============================================================================
  TASK 10: Analytics, Reporting, and Cohorts
==============================================================================

LEVEL: Advanced
CONCEPTS: cohort analysis, retention, funnels, RFM, churn, LTV, SLA metrics, financial reporting, dashboard datasets

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 10.01
-- Build a monthly revenue table with gross, discount, net, paid, refunded, and outstanding amounts.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.02
-- Calculate signup cohort month and first purchase month for each customer.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.03
-- Create a retention matrix showing cohort month versus months since signup based on orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.04
-- Build a funnel from visit to product_view to add_to_cart to purchase using web_events.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.05
-- Calculate conversion rate by marketing campaign and device.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.06
-- Compute customer lifetime value using successful payments minus refunds.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.07
-- Build RFM segments using recency, frequency, and monetary value.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.08
-- Identify churn-risk subscription customers with active subscription but declining order activity.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.09
-- Calculate monthly recurring revenue, new MRR, expansion MRR, contraction MRR, and churned MRR.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.10
-- Calculate average order value by first acquisition campaign.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.11
-- Find repeat purchase rate by customer signup month.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.12
-- Calculate product attach rate for each category pair bought in the same order.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.13
-- Build a customer 360 row with spend, orders, tickets, latest activity, and subscription status.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.14
-- Calculate SLA compliance for high-priority tickets closed within 24 hours.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.15
-- Identify support drivers by grouping ticket subjects into business categories with CASE.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.16
-- Build a daily operations dashboard dataset with orders, revenue, failed payments, and open tickets.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.17
-- Calculate refund rate by product category and sales channel.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.18
-- Find top cities by revenue growth month over month.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.19
-- Calculate cohort payback period using campaign budget and successful payment revenue.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.20
-- Build a rolling 30-day active customer metric.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.21
-- Calculate inventory sell-through rate by product.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.22
-- Find products with high views but low purchases using web_events and order_items.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.23
-- Create a profitability report using order revenue minus shipping_cost.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.24
-- Calculate employee support workload and resolution quality metrics.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 10.25
-- Design a single SQL result suitable for a BI dashboard filterable by month, city, status, and channel.
-- Write your solution below.

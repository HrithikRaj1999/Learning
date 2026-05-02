SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 03: AGGREGATION AND GROUPING
-- ============================================================================
-- You're the analytics lead. Every week, stakeholders want summary numbers:
-- totals, averages, counts, percentiles. These challenges represent the
-- real aggregation problems you'll solve daily in any data role.
-- ============================================================================


-- ==================================================
-- 03.01 - Total Revenue Per Order
-- ==================================================
-- SCENARIO: Finance needs net revenue per order. Each order has multiple
-- items with quantity, unit_price, and discount_pct. Calculate the total
-- revenue considering discounts.
--
-- YOUR TASK: GROUP BY order_id. Sum (quantity * unit_price * (1 - discount_pct))
-- for each order.
--
-- EXPECTED OUTPUT: order_id | total_revenue (one row per order).
-- ==================================================



-- ==================================================
-- 03.02 - Total Paid Amount Per Customer
-- ==================================================
-- SCENARIO: The loyalty team ranks customers by how much they've actually
-- paid. Only count successful payments.
--
-- YOUR TASK: Sum payment amounts per customer where payment status = 'success'.
--
-- EXPECTED OUTPUT: customer_id | total_paid (only successful payments).
-- ==================================================



-- ==================================================
-- 03.03 - Order Count by Status and Channel
-- ==================================================
-- SCENARIO: The ops dashboard shows a grid: how many orders per status
-- per channel. One query, grouped by both dimensions.
--
-- YOUR TASK: COUNT orders grouped by status and channel.
--
-- EXPECTED OUTPUT: status | channel | order_count
-- ==================================================



-- ==================================================
-- 03.04 - Customers with More Than 2 Orders
-- ==================================================
-- SCENARIO: The VIP program qualifies customers who ordered more than
-- twice. Show their order count and when they last ordered.
--
-- YOUR TASK: Group by customer_id, HAVING COUNT(*) > 2.
-- Return customer_id, order_count, latest_order_date.
--
-- EXPECTED OUTPUT: Only customers with 3+ orders.
-- ==================================================



-- ==================================================
-- 03.05 - Average Order Value Per Month
-- ==================================================
-- SCENARIO: The executive dashboard shows monthly AOV (Average Order Value).
-- Calculate it from order line totals grouped by month.
--
-- YOUR TASK: Truncate order_date to month, calculate average order total.
--
-- EXPECTED OUTPUT: month | avg_order_value
-- ==================================================



-- ==================================================
-- 03.06 - Product-Level Sales Metrics
-- ==================================================
-- SCENARIO: The merch team needs per-product stats: total quantity sold,
-- gross revenue, and average discount given.
--
-- YOUR TASK: Group by product. Calculate SUM(quantity), SUM(gross),
-- AVG(discount_pct).
--
-- EXPECTED OUTPUT: product_id | qty_sold | gross_revenue | avg_discount
-- ==================================================



-- ==================================================
-- 03.07 - Hot Categories (Qty > 10)
-- ==================================================
-- SCENARIO: Identify product categories moving volume — those with
-- total quantity sold greater than 10 units.
--
-- YOUR TASK: Group by category, SUM(quantity), HAVING SUM > 10.
--
-- EXPECTED OUTPUT: category | total_qty (only categories above threshold).
-- ==================================================



-- ==================================================
-- 03.08 - Ticket Status Breakdown by Priority
-- ==================================================
-- SCENARIO: The support manager needs a pivot-like view: for each priority
-- level, how many tickets are open, pending, and closed.
--
-- YOUR TASK: Use filtered aggregates (COUNT FILTER or CASE) to count
-- open_count, pending_count, closed_count per priority.
--
-- EXPECTED OUTPUT: priority | open_count | pending_count | closed_count
-- ==================================================



-- ==================================================
-- 03.09 - Sales Rep Performance
-- ==================================================
-- SCENARIO: The sales leaderboard shows each rep's delivered orders vs
-- refunded orders. Help the VP compare performance.
--
-- YOUR TASK: Count delivered orders and refunded orders per sales_rep_id.
--
-- EXPECTED OUTPUT: sales_rep_id | delivered_order_count | refunded_order_count
-- ==================================================



-- ==================================================
-- 03.10 - Distinct Customers Per Campaign
-- ==================================================
-- SCENARIO: Marketing wants to know campaign reach — how many unique
-- customers interacted with each UTM campaign in web_events.
--
-- YOUR TASK: GROUP BY utm_campaign, COUNT(DISTINCT customer_id).
--
-- EXPECTED OUTPUT: utm_campaign | distinct_customer_count
-- ==================================================



-- ==================================================
-- 03.11 - Monthly Revenue with ROLLUP
-- ==================================================
-- SCENARIO: The CFO's report needs monthly revenue subtotals PLUS a
-- grand total row at the bottom — all in one query.
--
-- YOUR TASK: Use GROUP BY ROLLUP(month) to add subtotal/grand-total rows.
--
-- EXPECTED OUTPUT: Month rows + a NULL-month row with the grand total.
-- ==================================================



-- ==================================================
-- 03.12 - Status × Channel Cube
-- ==================================================
-- SCENARIO: An executive wants every possible status/channel combination
-- count, plus subtotals for each status, each channel, and grand total.
--
-- YOUR TASK: Use GROUP BY CUBE(status, channel) for full combination counts.
--
-- EXPECTED OUTPUT: All combinations including subtotals and grand total.
-- ==================================================



-- ==================================================
-- 03.13 - Revenue by Month, by Channel, and Grand Total
-- ==================================================
-- SCENARIO: One result set must show revenue broken down by month,
-- separately by channel, and a grand total — without running 3 queries.
--
-- YOUR TASK: Use GROUPING SETS((month), (channel), ()) to get all
-- three breakdowns in one result.
--
-- EXPECTED OUTPUT: Rows for each month, rows for each channel, one grand total row.
-- ==================================================



-- ==================================================
-- 03.14 - Median Payment by Method
-- ==================================================
-- SCENARIO: Finance wants the median payment amount per payment method
-- (credit_card, bank_transfer, etc.) to set fraud thresholds.
--
-- YOUR TASK: Use PERCENTILE_CONT(0.5) to calculate median per method.
--
-- EXPECTED OUTPUT: payment_method | median_amount
-- ==================================================



-- ==================================================
-- 03.15 - 90th Percentile Delivery Duration
-- ==================================================
-- SCENARIO: The SLA team defines "acceptable delivery" as the 90th
-- percentile. Calculate it by carrier so they can negotiate contracts.
--
-- YOUR TASK: Use PERCENTILE_CONT(0.9) on delivery duration by carrier.
--
-- EXPECTED OUTPUT: carrier | p90_delivery_days
-- ==================================================



-- ==================================================
-- 03.16 - Customer's Purchased Categories (Comma List)
-- ==================================================
-- SCENARIO: The personalization engine needs one text field per customer
-- listing all categories they've ever bought from.
--
-- YOUR TASK: Use STRING_AGG to create a comma-separated category list
-- per customer.
--
-- EXPECTED OUTPUT: customer_id | categories (e.g., 'Books, Electronics, Home')
-- ==================================================



-- ==================================================
-- 03.17 - Order Items as JSON Array
-- ==================================================
-- SCENARIO: The API team needs each order's items as a JSON array for
-- the mobile app's order detail screen.
--
-- YOUR TASK: Use JSON_AGG to build an array of objects with product_name,
-- quantity, and net_amount per order.
--
-- EXPECTED OUTPUT: order_id | items_json (JSON array of item objects)
-- ==================================================



-- ==================================================
-- 03.18 - Duplicate Email Domains
-- ==================================================
-- SCENARIO: IT security noticed many accounts from the same domain.
-- Find which email domains have the most customer accounts.
--
-- YOUR TASK: Extract domain from email, GROUP BY domain, COUNT customers.
--
-- EXPECTED OUTPUT: email_domain | customer_count (sorted by count desc).
-- ==================================================



-- ==================================================
-- 03.19 - Average Resolution Hours by Employee
-- ==================================================
-- SCENARIO: The support manager reviews agent efficiency. Calculate
-- average hours between ticket opened_at and closed_at per assigned employee.
--
-- YOUR TASK: Compute avg resolution hours grouped by assigned employee.
--
-- EXPECTED OUTPUT: employee_id | avg_resolution_hours
-- ==================================================



-- ==================================================
-- 03.20 - Products with >15% Revenue Share
-- ==================================================
-- SCENARIO: The Pareto analysis: which products account for more than
-- 15% of total company revenue? These are the cash cows.
--
-- YOUR TASK: Calculate each product's revenue share vs total revenue.
-- Keep only products above 15%.
--
-- EXPECTED OUTPUT: product_id | revenue | revenue_pct (above 15% only).
-- ==================================================



-- ==================================================
-- 03.21 - Products with Negative Inventory Movement
-- ==================================================
-- SCENARIO: The warehouse team needs to reorder products where more has
-- gone out than come in (negative net movement).
--
-- YOUR TASK: Sum inventory_movements per product (positive = in, negative = out).
-- Keep only products with net < 0.
--
-- EXPECTED OUTPUT: product_id | net_movement (only negative values).
-- ==================================================



-- ==================================================
-- 03.22 - Big Payment Days (> $500)
-- ==================================================
-- SCENARIO: The fraud team monitors days with unusually high successful
-- payment totals. Flag days where total exceeded $500.
--
-- YOUR TASK: Group successful payments by date, HAVING SUM > 500.
--
-- EXPECTED OUTPUT: payment_date | daily_total (only days above $500).
-- ==================================================



-- ==================================================
-- 03.23 - Monthly Active Customers
-- ==================================================
-- SCENARIO: The growth metric: MAU (Monthly Active Customers) — anyone
-- who placed an order or had a web event that month counts as active.
--
-- YOUR TASK: Count distinct customers per month based on any activity
-- (orders OR web_events).
--
-- EXPECTED OUTPUT: month | active_customer_count
-- ==================================================



-- ==================================================
-- 03.24 - Monthly Recurring Revenue by Plan
-- ==================================================
-- SCENARIO: The subscription business needs MRR broken down by plan name
-- and subscription status (active, cancelled, etc.).
--
-- YOUR TASK: Group subscriptions by plan_name and status, sum monthly_amount.
--
-- EXPECTED OUTPUT: plan_name | status | mrr
-- ==================================================



-- ==================================================
-- 03.25 - City-Level Metrics (No Double Counting)
-- ==================================================
-- SCENARIO: The regional report needs per-city stats: customer count,
-- order count, and total revenue. Be careful not to double-count
-- customers who placed multiple orders.
--
-- YOUR TASK: Return city, COUNT(DISTINCT customers), COUNT(orders),
-- SUM(revenue). Use proper joins to avoid multiplication.
--
-- EXPECTED OUTPUT: city | customers_count | order_count | total_revenue
-- ==================================================



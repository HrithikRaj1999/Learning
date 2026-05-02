SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 05: WINDOW FUNCTIONS
-- ============================================================================
-- Window functions let you calculate across rows without collapsing them.
-- Rankings, running totals, moving averages, gap detection — these are the
-- tools that separate junior from senior SQL developers in interviews.
-- ============================================================================


-- ==================================================
-- 05.01 - Customer Revenue Ranking
-- ==================================================
-- SCENARIO: The VIP leaderboard ranks customers by lifetime net revenue.
-- Show both RANK (ties skip) and DENSE_RANK (ties don't skip).
--
-- YOUR TASK: Calculate total net revenue per customer, then apply
-- RANK() and DENSE_RANK() ordered by revenue descending.
--
-- EXPECTED OUTPUT: customer_id | net_revenue | rank | dense_rank
-- ==================================================



-- ==================================================
-- 05.02 - First Order Per Customer
-- ==================================================
-- SCENARIO: The onboarding team needs each customer's very first order.
-- Use ROW_NUMBER to pick row 1 per customer by order_date.
--
-- YOUR TASK: ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date)
-- then filter to row_num = 1.
--
-- EXPECTED OUTPUT: One row per customer — their earliest order.
-- ==================================================



-- ==================================================
-- 05.03 - Latest Ticket Event
-- ==================================================
-- SCENARIO: The support dashboard shows the most recent event per ticket.
-- Use ROW_NUMBER to pick the latest one.
--
-- YOUR TASK: ROW_NUMBER() PARTITION BY ticket_id ORDER BY occurred_at DESC.
-- Keep only row 1.
--
-- EXPECTED OUTPUT: One event row per ticket (the most recent).
-- ==================================================



-- ==================================================
-- 05.04 - Running Total of Daily Payments
-- ==================================================
-- SCENARIO: The treasury dashboard shows cumulative successful payment
-- amounts as they accumulate day by day.
--
-- YOUR TASK: SUM(daily_amount) OVER (ORDER BY payment_date) for a
-- running total of successful payments.
--
-- EXPECTED OUTPUT: payment_date | daily_amount | running_total
-- ==================================================



-- ==================================================
-- 05.05 - 7-Day Moving Average of Web Events
-- ==================================================
-- SCENARIO: Product analytics smooths daily web event counts with a
-- 7-day moving average to spot real trends vs noise.
--
-- YOUR TASK: AVG(daily_count) OVER (ORDER BY event_date ROWS BETWEEN
-- 6 PRECEDING AND CURRENT ROW).
--
-- EXPECTED OUTPUT: event_date | daily_count | moving_avg_7d
-- ==================================================



-- ==================================================
-- 05.06 - Days Between Orders (LAG)
-- ==================================================
-- SCENARIO: The retention team tracks how many days pass between a
-- customer's consecutive orders to detect churn risk.
--
-- YOUR TASK: Use LAG(order_date) OVER (PARTITION BY customer_id ORDER BY
-- order_date) to get previous order date, then calculate difference.
--
-- EXPECTED OUTPUT: customer_id | order_date | prev_order_date | days_between
-- ==================================================



-- ==================================================
-- 05.07 - Next Ticket Event Time (LEAD)
-- ==================================================
-- SCENARIO: The SLA tracker needs to know when the NEXT event will happen
-- for each ticket event — to measure response gaps.
--
-- YOUR TASK: Use LEAD(occurred_at) OVER (PARTITION BY ticket_id ORDER BY
-- occurred_at) to show next event time.
--
-- EXPECTED OUTPUT: ticket_id | event_time | next_event_time
-- ==================================================



-- ==================================================
-- 05.08 - Orders Bigger Than Previous
-- ==================================================
-- SCENARIO: Sales celebrates "growing customers" — orders where the total
-- is larger than the customer's previous order.
--
-- YOUR TASK: Use LAG to get previous order total, filter where current > previous.
--
-- EXPECTED OUTPUT: Orders that were larger than the customer's prior order.
-- ==================================================



-- ==================================================
-- 05.09 - Product Revenue Percentile Within Category
-- ==================================================
-- SCENARIO: Merchandising categorizes products as top/middle/bottom
-- performers within their category using percent_rank.
--
-- YOUR TASK: PERCENT_RANK() OVER (PARTITION BY category ORDER BY revenue).
--
-- EXPECTED OUTPUT: product_id | category | revenue | pct_rank
-- ==================================================



-- ==================================================
-- 05.10 - Customer Revenue Quartiles (NTILE)
-- ==================================================
-- SCENARIO: The CRM divides customers into 4 tiers based on spend.
-- NTILE(4) distributes them evenly into quartiles.
--
-- YOUR TASK: NTILE(4) OVER (ORDER BY lifetime_revenue DESC).
--
-- EXPECTED OUTPUT: customer_id | revenue | quartile (1=top, 4=bottom)
-- ==================================================



-- ==================================================
-- 05.11 - Top 3 Products Per Category
-- ==================================================
-- SCENARIO: The homepage features "Top 3 Best Sellers" per category.
-- Rank products by quantity sold within each category.
--
-- YOUR TASK: ROW_NUMBER() PARTITION BY category, filter to top 3.
--
-- EXPECTED OUTPUT: Top 3 products by quantity for each category.
-- ==================================================



-- ==================================================
-- 05.12 - First Channel Per Customer (FIRST_VALUE)
-- ==================================================
-- SCENARIO: Attribution wants to know each customer's first purchase
-- channel and compare it to their later channels.
--
-- YOUR TASK: FIRST_VALUE(channel) OVER (PARTITION BY customer_id
-- ORDER BY order_date).
--
-- EXPECTED OUTPUT: Each order row with the customer's first-ever channel.
-- ==================================================



-- ==================================================
-- 05.13 - Latest Order Status (LAST_VALUE with Frame)
-- ==================================================
-- SCENARIO: Show each customer's latest order status on every order row.
-- Requires explicit frame: ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.
--
-- YOUR TASK: LAST_VALUE(status) OVER (PARTITION BY customer_id
-- ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING).
--
-- EXPECTED OUTPUT: Every order row with latest_status column.
-- ==================================================



-- ==================================================
-- 05.14 - Cumulative Subscription MRR
-- ==================================================
-- SCENARIO: The investor deck shows how MRR grew over time. Calculate
-- cumulative sum of subscription monthly_amount by start month.
--
-- YOUR TASK: SUM(monthly_amount) OVER (ORDER BY start_month) for
-- running MRR growth.
--
-- EXPECTED OUTPUT: start_month | new_mrr | cumulative_mrr
-- ==================================================



-- ==================================================
-- 05.15 - Session Gaps > 14 Days
-- ==================================================
-- SCENARIO: The engagement team flags customers who go dark — more than
-- 14 days between web sessions indicates disengagement.
--
-- YOUR TASK: Use LAG to find gaps > 14 days between customer web events.
--
-- EXPECTED OUTPUT: customer_id | event_date | prev_event_date | gap_days (>14 only)
-- ==================================================



-- ==================================================
-- 05.16 - Activity Islands (Gaps-and-Islands)
-- ==================================================
-- SCENARIO: Group consecutive days of activity into "islands" per customer.
-- A gap of 2+ days starts a new island.
--
-- YOUR TASK: Use ROW_NUMBER and date arithmetic to identify island groups.
--
-- EXPECTED OUTPUT: customer_id | island_id | start_date | end_date | days_active
-- ==================================================



-- ==================================================
-- 05.17 - Order's Share of Monthly Revenue
-- ==================================================
-- SCENARIO: Each order's percentage contribution to its month's total
-- revenue — useful for identifying outlier orders.
--
-- YOUR TASK: order_total / SUM(order_total) OVER (PARTITION BY month).
--
-- EXPECTED OUTPUT: order_id | month | order_total | pct_of_monthly_revenue
-- ==================================================



-- ==================================================
-- 05.18 - Products Above Category Average Price
-- ==================================================
-- SCENARIO: Flag "premium" products priced above their category average
-- without a separate GROUP BY query.
--
-- YOUR TASK: AVG(list_price) OVER (PARTITION BY category) then filter
-- where list_price > category_avg.
--
-- EXPECTED OUTPUT: Products priced above their category's average.
-- ==================================================



-- ==================================================
-- 05.19 - Ticket Resolution Speed Rank by Priority
-- ==================================================
-- SCENARIO: The support SLA ranks how quickly tickets are resolved
-- within each priority level.
--
-- YOUR TASK: RANK() OVER (PARTITION BY priority ORDER BY resolution_hours ASC).
--
-- EXPECTED OUTPUT: ticket_id | priority | resolution_hours | speed_rank
-- ==================================================



-- ==================================================
-- 05.20 - Total Orders Per Customer (Without Collapsing)
-- ==================================================
-- SCENARIO: The order list view needs to show "Order 3 of 7" — total
-- order count per customer on every row without grouping.
--
-- YOUR TASK: COUNT(*) OVER (PARTITION BY customer_id) on each order row.
--
-- EXPECTED OUTPUT: Each order row with a total_customer_orders column.
-- ==================================================



-- ==================================================
-- 05.21 - Signup Month Cohort Table
-- ==================================================
-- SCENARIO: The cohort analysis starts by assigning each customer to
-- their signup month cohort using MIN(signup_date) over a partition.
--
-- YOUR TASK: Use MIN(signup_date) OVER (PARTITION BY customer_id)
-- truncated to month as cohort_month.
--
-- EXPECTED OUTPUT: Each order row tagged with the customer's cohort_month.
-- ==================================================



-- ==================================================
-- 05.22 - Running Inventory Balance
-- ==================================================
-- SCENARIO: The warehouse dashboard shows real-time stock level per
-- product as movements happen chronologically.
--
-- YOUR TASK: SUM(quantity_change) OVER (PARTITION BY product_id
-- ORDER BY movement_at) for running balance.
--
-- EXPECTED OUTPUT: product_id | movement_at | change | running_balance
-- ==================================================



-- ==================================================
-- 05.23 - First Failed Payment After Success
-- ==================================================
-- SCENARIO: The fraud team flags customers whose payment failed AFTER
-- a previously successful one — possible card expiry or stolen card.
--
-- YOUR TASK: Use LAG/LEAD to find the first 'failed' payment that
-- comes after a 'success' payment for each customer.
--
-- EXPECTED OUTPUT: customer_id | failed_payment_id | occurred_after_success
-- ==================================================



-- ==================================================
-- 05.24 - Employee vs Department Average Tickets
-- ==================================================
-- SCENARIO: HR compares each support agent's closed ticket count to
-- their department average — who's above/below average?
--
-- YOUR TASK: COUNT tickets per employee, then AVG() OVER (PARTITION BY
-- department) to compare individual vs department average.
--
-- EXPECTED OUTPUT: employee | closed_count | dept_avg | above_or_below
-- ==================================================



-- ==================================================
-- 05.25 - Web Event Sessionization (30-Min Inactivity)
-- ==================================================
-- SCENARIO: The analytics team defines a "session" as continuous activity
-- with no gap > 30 minutes. Assign a session_group_id.
--
-- YOUR TASK: Use LAG to detect 30-min gaps, then cumulative SUM of
-- gap flags to create session groups.
--
-- EXPECTED OUTPUT: event_id | customer_id | occurred_at | session_group
-- ==================================================



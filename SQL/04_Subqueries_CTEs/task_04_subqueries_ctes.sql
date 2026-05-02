SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 04: SUBQUERIES AND CTEs
-- ============================================================================
-- These challenges require multi-step logic: computing something first, then
-- using that result to filter or join. CTEs make complex queries readable.
-- Subqueries let you embed logic inline. Both are interview staples.
-- ============================================================================


-- ==================================================
-- 04.01 - Orders Above Average Total
-- ==================================================
-- SCENARIO: The operations team wants to investigate high-value orders.
-- Find orders whose total line amount is above the overall average
-- order total across all orders.
--
-- YOUR TASK: Calculate overall average order total in a subquery,
-- then return orders that exceed it.
--
-- EXPECTED OUTPUT: Orders whose total exceeds the company-wide average.
-- ==================================================



-- ==================================================
-- 04.02 - Fast First Payment Customers
-- ==================================================
-- SCENARIO: The onboarding team tracks "fast converters" — customers
-- whose first order received a successful payment within 2 days.
--
-- YOUR TASK: Find each customer's first order, check if a successful
-- payment was made within 2 days of that order.
--
-- EXPECTED OUTPUT: Customers who paid fast on their first order.
-- ==================================================



-- ==================================================
-- 04.03 - Customer Spend Ranking (CTE)
-- ==================================================
-- SCENARIO: The VIP program ranks customers by total lifetime spend.
-- Use a CTE to first calculate order totals, then rank customers.
--
-- YOUR TASK: CTE 1 = order totals. CTE 2 or final query = rank
-- customers by their sum of order totals.
--
-- EXPECTED OUTPUT: customer_id | total_spend | spend_rank
-- ==================================================



-- ==================================================
-- 04.04 - Products Never Ordered After March 2026
-- ==================================================
-- SCENARIO: The catalog team wants to retire products with no sales
-- activity after March 1, 2026. Use NOT EXISTS to find them.
--
-- YOUR TASK: Use NOT EXISTS with a correlated subquery checking
-- order_items + orders after 2026-03-01.
--
-- EXPECTED OUTPUT: Products with zero orders after the cutoff date.
-- ==================================================



-- ==================================================
-- 04.05 - Customers Who Ordered AND Opened Tickets
-- ==================================================
-- SCENARIO: Product wants to study customers who both purchased and
-- needed support. Find them using EXISTS for both conditions.
--
-- YOUR TASK: Use EXISTS to check both orders and support_tickets
-- for the same customer.
--
-- EXPECTED OUTPUT: Customers with at least one order AND one ticket.
-- ==================================================



-- ==================================================
-- 04.06 - Latest Payment Per Order (Correlated Subquery)
-- ==================================================
-- SCENARIO: Each order can have multiple payment attempts (retry logic).
-- Finance needs only the most recent payment per order.
--
-- YOUR TASK: Use a correlated subquery to find the payment with the
-- latest paid_at per order.
--
-- EXPECTED OUTPUT: One payment row per order (the most recent).
-- ==================================================



-- ==================================================
-- 04.07 - Customer's Most Recent Web Event (LATERAL)
-- ==================================================
-- SCENARIO: The personalization engine shows "last seen" activity.
-- For each customer, get their single most recent web event.
--
-- YOUR TASK: Use a LATERAL join to get the latest web event per customer.
--
-- EXPECTED OUTPUT: customer_id with their single most recent web event.
-- ==================================================



-- ==================================================
-- 04.08 - Employee Hierarchy (Recursive CTE - Top Down)
-- ==================================================
-- SCENARIO: HR needs a full org chart starting from the CEO and walking
-- down through all manager→report relationships.
--
-- YOUR TASK: Write a recursive CTE starting from employees with
-- NULL manager_id, recursing through manager_id.
--
-- EXPECTED OUTPUT: All employees with their hierarchy level.
-- ==================================================



-- ==================================================
-- 04.09 - Manager Chain for One Employee (Recursive CTE - Bottom Up)
-- ==================================================
-- SCENARIO: An employee wants to see their reporting chain up to the CEO.
-- Walk upward from one employee through their managers.
--
-- YOUR TASK: Recursive CTE starting from a specific employee,
-- following manager_id upward until NULL.
--
-- EXPECTED OUTPUT: Chain of managers from employee to CEO.
-- ==================================================



-- ==================================================
-- 04.10 - Order Financial Pipeline (Multi-CTE)
-- ==================================================
-- SCENARIO: The finance report needs gross → discount → net → payment
-- status for each order. Build it step by step with CTEs.
--
-- YOUR TASK: CTE pipeline: gross_revenue → discount_amount →
-- net_revenue → payment_status per order.
--
-- EXPECTED OUTPUT: order_id | gross | discount | net | payment_status
-- ==================================================



-- ==================================================
-- 04.11 - Customers Spending Above City Average
-- ==================================================
-- SCENARIO: Find "big fish in small ponds" — customers who spend more
-- than the average customer in their city.
--
-- YOUR TASK: Calculate city average spend, then find customers whose
-- lifetime spend exceeds their city's average.
--
-- EXPECTED OUTPUT: Customers outspending their city peers.
-- ==================================================



-- ==================================================
-- 04.12 - Product Revenue Share (Scalar Subquery)
-- ==================================================
-- SCENARIO: Each product's contribution to total revenue — expressed
-- as a percentage. Use a scalar subquery for total in SELECT.
--
-- YOUR TASK: In SELECT, divide product revenue by (SELECT SUM(total))
-- to get each product's share.
--
-- EXPECTED OUTPUT: product_id | revenue | pct_of_total
-- ==================================================



-- ==================================================
-- 04.13 - Orders Where ALL Items Have Zero Discount
-- ==================================================
-- SCENARIO: The pricing team wants to find orders where no item received
-- any discount — every single line had discount_pct = 0.
--
-- YOUR TASK: Find orders where NOT EXISTS any item with discount_pct != 0.
--
-- EXPECTED OUTPUT: Orders with zero discounts on all items.
-- ==================================================



-- ==================================================
-- 04.14 - Orders with Heavy Discounts (>10%)
-- ==================================================
-- SCENARIO: The margin team flags orders where at least one item was
-- discounted by more than 10%.
--
-- YOUR TASK: Find orders where EXISTS an item with discount_pct > 0.10.
--
-- EXPECTED OUTPUT: Orders containing at least one heavily-discounted item.
-- ==================================================



-- ==================================================
-- 04.15 - Customer Journey: Visit → Cart → Purchase
-- ==================================================
-- SCENARIO: Marketing needs to identify customers who completed the
-- full funnel: had a visit event, then a cart event, then a purchase
-- event (in chronological order).
--
-- YOUR TASK: Use CTEs to find customers with all three event types
-- in sequence.
--
-- EXPECTED OUTPUT: Customers who completed visit → cart → purchase.
-- ==================================================



-- ==================================================
-- 04.16 - Products Priced Above Category Average
-- ==================================================
-- SCENARIO: The merchandising team wants "premium" products — those
-- priced above the average of their own category.
--
-- YOUR TASK: Calculate category average, then filter products above it.
--
-- EXPECTED OUTPUT: Products more expensive than their category average.
-- ==================================================



-- ==================================================
-- 04.17 - Top 2 Products Per Customer (LATERAL)
-- ==================================================
-- SCENARIO: The recommendation engine needs each customer's top 2
-- most-purchased products (by quantity).
--
-- YOUR TASK: Use LATERAL to return top 2 products by qty for each customer.
--
-- EXPECTED OUTPUT: customer_id | product_id | total_qty (max 2 per customer).
-- ==================================================



-- ==================================================
-- 04.18 - Tickets Awaiting Customer Reply
-- ==================================================
-- SCENARIO: The support SLA tracks tickets where the last event is NOT
-- a customer reply — meaning the ball is in the customer's court.
--
-- YOUR TASK: Find tickets whose latest ticket_event type is not
-- 'customer_reply'.
--
-- EXPECTED OUTPUT: Tickets waiting for customer response.
-- ==================================================



-- ==================================================
-- 04.19 - Deduplicate Web Events
-- ==================================================
-- SCENARIO: The analytics pipeline has duplicate web events (same
-- session_id + event_type + occurred_at). Deduplicate them.
--
-- YOUR TASK: Use a CTE with ROW_NUMBER to identify duplicates,
-- then keep only the first occurrence.
--
-- EXPECTED OUTPUT: Deduplicated web events (one per session/type/time).
-- ==================================================



-- ==================================================
-- 04.20 - Month-Over-Month Revenue Comparison (No Windows)
-- ==================================================
-- SCENARIO: Compare each month's revenue to the previous month using
-- only CTEs and joins — no window functions allowed.
--
-- YOUR TASK: CTE for monthly revenue, then self-join to get previous month.
--
-- EXPECTED OUTPUT: month | revenue | prev_month_revenue | change
-- ==================================================



-- ==================================================
-- 04.21 - Failed Payment Retry Report
-- ==================================================
-- SCENARIO: The payments team needs a retry report: all failed payments
-- with customer and order details so they can contact customers.
--
-- YOUR TASK: CTE isolates failed payments, then join to orders/customers.
--
-- EXPECTED OUTPUT: Failed payments with customer name, email, order details.
-- ==================================================



-- ==================================================
-- 04.22 - Subscribers with No Recent Orders
-- ==================================================
-- SCENARIO: The retention team flags subscribers who are paying monthly
-- but haven't ordered in 30 days — they might cancel soon.
--
-- YOUR TASK: Find customers with active subscription but no order in
-- the last 30 days from 2026-04-30.
--
-- EXPECTED OUTPUT: Active subscribers who haven't ordered recently.
-- ==================================================



-- ==================================================
-- 04.23 - Categories Above Average Category Revenue
-- ==================================================
-- SCENARIO: Which product categories are outperforming? Find categories
-- whose revenue exceeds the average category revenue.
--
-- YOUR TASK: Nested CTEs: category_revenue → avg_category → filter.
--
-- EXPECTED OUTPUT: High-performing categories above the category average.
-- ==================================================



-- ==================================================
-- 04.24 - Customer's Highest Value Order (Derived Table)
-- ==================================================
-- SCENARIO: Customer service wants to highlight each customer's biggest
-- single order when they call in.
--
-- YOUR TASK: Use a derived table to find each customer's max order total.
--
-- EXPECTED OUTPUT: customer_id | max_order_id | max_order_total
-- ==================================================



-- ==================================================
-- 04.25 - Subquery vs CTE (Same Query, Two Ways)
-- ==================================================
-- SCENARIO: Write the "top customer by spend" query two ways:
-- once with a subquery, once with a CTE. Compare readability.
--
-- YOUR TASK: Write BOTH versions. Comment which is more readable.
--
-- EXPECTED OUTPUT: Same result both ways; add a comment about preference.
-- ==================================================



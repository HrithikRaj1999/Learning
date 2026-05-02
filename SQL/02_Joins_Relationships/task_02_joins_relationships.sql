SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 02: JOINS AND RELATIONSHIPS
-- ============================================================================
-- You're a data analyst building reports that pull from multiple tables.
-- Each challenge represents a real business question that requires combining
-- data from different sources. Master these join patterns — they show up
-- in every SQL interview and every production report.
-- ============================================================================


-- ==================================================
-- 02.01 - Order Details with Customer Info
-- ==================================================
-- SCENARIO: The customer service dashboard needs to display each order
-- alongside the customer's name, email, and order details.
--
-- YOUR TASK: Join orders to customers. Return customer full_name, email,
-- order_date, status, and channel for every order.
--
-- EXPECTED OUTPUT: One row per order with customer details attached.
-- ==================================================



-- ==================================================
-- 02.02 - Order Items with Product Details
-- ==================================================
-- SCENARIO: The warehouse team needs a pick list showing what products
-- are in each order, including the product name and category.
--
-- YOUR TASK: Join order_items to products. Return order_id, product_name,
-- category, quantity, unit_price, and line gross (quantity * unit_price).
--
-- EXPECTED OUTPUT: One row per order item with product info and gross amount.
-- ==================================================



-- ==================================================
-- 02.03 - All Customers Including Those Without Orders
-- ==================================================
-- SCENARIO: Marketing wants to email ALL customers — including those who
-- never purchased. They need to know who hasn't bought anything yet.
--
-- YOUR TASK: LEFT JOIN customers to orders. Keep customers who have
-- zero orders (their order columns will be NULL).
--
-- EXPECTED OUTPUT: All customers; some will have NULL order fields.
-- ==================================================



-- ==================================================
-- 02.04 - Customers Who Never Ordered (Anti-Join)
-- ==================================================
-- SCENARIO: The re-engagement team needs ONLY customers who signed up
-- but never placed a single order.
--
-- YOUR TASK: Use LEFT JOIN + WHERE orders.order_id IS NULL pattern
-- to find customers with no orders.
--
-- EXPECTED OUTPUT: Only customers who have zero orders.
-- ==================================================



-- ==================================================
-- 02.05 - Customers with Delivered Orders (Semi-Join)
-- ==================================================
-- SCENARIO: The loyalty program qualifies customers who have received
-- at least one delivered order. Find them efficiently.
--
-- YOUR TASK: Use EXISTS (or a semi-join) to find customers who have
-- at least one order with status = 'delivered'.
--
-- EXPECTED OUTPUT: Customers who received at least one delivery.
-- ==================================================



-- ==================================================
-- 02.06 - Employee Manager Names (Self-Join)
-- ==================================================
-- SCENARIO: HR needs an org chart export showing each employee paired
-- with their manager's name.
--
-- YOUR TASK: Self-join employees to itself using manager_id → employee_id.
-- Return employee name and manager name.
--
-- EXPECTED OUTPUT: Each employee with their manager's name (CEO has NULL manager).
-- ==================================================



-- ==================================================
-- 02.07 - Support Tickets with Context
-- ==================================================
-- SCENARIO: The support dashboard shows each ticket with the customer name,
-- assigned employee name, and the related order status (if any).
--
-- YOUR TASK: Join support_tickets to customers, employees, and optionally
-- orders. Show ticket details with human-readable names.
--
-- EXPECTED OUTPUT: Tickets with customer name, agent name, related order status.
-- ==================================================



-- ==================================================
-- 02.08 - Payment Investigation (Keep Failed/Unmatched)
-- ==================================================
-- SCENARIO: The finance team is investigating payment failures. They need
-- ALL payments visible — including ones that failed or don't match an order.
--
-- YOUR TASK: Join payments to orders and customers, but keep failed or
-- unmatched payments visible (RIGHT JOIN or LEFT JOIN from payments).
--
-- EXPECTED OUTPUT: All payments with order/customer info; NULLs where unmatched.
-- ==================================================



-- ==================================================
-- 02.09 - Price Changes Since Order (Stored vs Current)
-- ==================================================
-- SCENARIO: The pricing team suspects some products were ordered at old
-- prices. Find items where the stored unit_price in order_items differs
-- from the product's current list_price.
--
-- YOUR TASK: Join order_items to products and filter where
-- order_items.unit_price != products.list_price.
--
-- EXPECTED OUTPUT: Order items where historical price differs from current.
-- ==================================================



-- ==================================================
-- 02.10 - Distinct Customers Per Category
-- ==================================================
-- SCENARIO: The product team wants to know category reach — how many
-- unique customers bought from each product category.
--
-- YOUR TASK: Join products → order_items → orders → customers.
-- Return category and COUNT(DISTINCT customer_id).
--
-- EXPECTED OUTPUT: One row per category with distinct customer count.
-- ==================================================



-- ==================================================
-- 02.11 - Customer Pairs from Same City
-- ==================================================
-- SCENARIO: A referral program wants to connect customers in the same city.
-- Find all pairs — but don't list (A,B) and (B,A) as separate pairs.
--
-- YOUR TASK: Self-join customers on city, with c1.customer_id < c2.customer_id
-- to avoid duplicates.
--
-- EXPECTED OUTPUT: Unique customer pairs sharing the same city.
-- ==================================================



-- ==================================================
-- 02.12 - Delivery Duration in Days
-- ==================================================
-- SCENARIO: The logistics team tracks delivery performance. For delivered
-- shipments, calculate how many days between shipped_at and delivered_at.
--
-- YOUR TASK: Join shipments to orders. Calculate delivery_days for
-- shipments that have a delivered_at date.
--
-- EXPECTED OUTPUT: Shipments with order info and delivery duration in days.
-- ==================================================



-- ==================================================
-- 02.13 - Support Tickets Before First Order
-- ==================================================
-- SCENARIO: Product suspects some users hit issues before even placing
-- their first order. Find customers whose earliest support ticket was
-- opened before their first order date.
--
-- YOUR TASK: Compare each customer's earliest ticket opened_at to their
-- earliest order order_date. Return those where ticket came first.
--
-- EXPECTED OUTPUT: Customers who complained before they ever ordered.
-- ==================================================



-- ==================================================
-- 02.14 - Orders Without Successful Payment (NOT EXISTS)
-- ==================================================
-- SCENARIO: The revenue team needs to find orders that have no associated
-- successful payment — potential revenue leaks.
--
-- YOUR TASK: Use NOT EXISTS to find orders where no payment with
-- status = 'success' exists for that order_id.
--
-- EXPECTED OUTPUT: Orders missing a successful payment.
-- ==================================================



-- ==================================================
-- 02.15 - Campaigns with Web Event Matches
-- ==================================================
-- SCENARIO: Marketing attribution: match every campaign to web events
-- that share the same utm_campaign value. Keep campaigns with zero events.
--
-- YOUR TASK: LEFT JOIN campaigns to web_events on utm_campaign.
-- Keep campaigns that had no matching events (NULL event rows).
--
-- EXPECTED OUTPUT: All campaigns with their web event counts (including 0).
-- ==================================================



-- ==================================================
-- 02.16 - Web Events Within 7 Days Before Purchase
-- ==================================================
-- SCENARIO: Attribution modeling: find web events (purchase type) that
-- happened within 7 days before an order was placed by the same customer.
--
-- YOUR TASK: Join web_events to orders on customer_id with a date
-- condition: event occurred 0-7 days before order_date.
--
-- EXPECTED OUTPUT: Web events that preceded a purchase within 7 days.
-- ==================================================



-- ==================================================
-- 02.17 - Products with Inventory but Never Sold
-- ==================================================
-- SCENARIO: Dead stock detection: find products that have inventory
-- movements (they were stocked) but never appeared in any order.
--
-- YOUR TASK: Find products present in inventory_movements but NOT
-- present in order_items.
--
-- EXPECTED OUTPUT: Products with stock but zero sales.
-- ==================================================



-- ==================================================
-- 02.18 - Sales Reps and Their Customers
-- ==================================================
-- SCENARIO: The sales director wants to know which reps have served
-- which customers (through their orders). No duplicate pairs.
--
-- YOUR TASK: Join orders to employees (sales_rep) and customers.
-- Return DISTINCT rep name + customer name pairs.
--
-- EXPECTED OUTPUT: Unique sales_rep ↔ customer pairs.
-- ==================================================



-- ==================================================
-- 02.19 - Detecting Row Multiplication
-- ==================================================
-- SCENARIO: A junior analyst's report shows inflated revenue because
-- joining orders to both order_items AND payments creates row explosion.
-- Detect orders where the joined row count exceeds expected.
--
-- YOUR TASK: Join orders, order_items, and payments. Compare row counts
-- per order to detect multiplication. Flag orders with duplicated rows.
--
-- EXPECTED OUTPUT: Orders where row count indicates accidental multiplication.
-- ==================================================



-- ==================================================
-- 02.20 - Cities on Only One Side (FULL OUTER JOIN)
-- ==================================================
-- SCENARIO: Logistics wants to find cities that appear ONLY as customer
-- home cities or ONLY as shipping destinations — not both.
--
-- YOUR TASK: FULL OUTER JOIN customer cities vs shipping cities.
-- Return cities that are NULL on one side.
--
-- EXPECTED OUTPUT: Cities that exist in only customers OR only shipping.
-- ==================================================



-- ==================================================
-- 02.21 - Tickets with Latest Event (Derived Table)
-- ==================================================
-- SCENARIO: The support dashboard shows each ticket with its most recent
-- event. Get the latest ticket_event per ticket using a derived table.
--
-- YOUR TASK: Join tickets to a subquery that gets MAX event per ticket.
-- Return ticket info with latest event details.
--
-- EXPECTED OUTPUT: Each ticket with its most recent event info.
-- ==================================================



-- ==================================================
-- 02.22 - Subscription Overlap with Orders
-- ==================================================
-- SCENARIO: The product team wants to know which orders were placed
-- during an active subscription period for that customer.
--
-- YOUR TASK: Find orders where the order_date falls within the
-- customer's subscription start → end range.
--
-- EXPECTED OUTPUT: Orders placed during active subscription windows.
-- ==================================================



-- ==================================================
-- 02.23 - Line Prices Below 80% of List (Non-Equi Join)
-- ==================================================
-- SCENARIO: The pricing auditor needs to flag order items that were
-- charged less than 80% of the current list price — possible pricing errors.
--
-- YOUR TASK: Join products to order_items with a condition that flags
-- items where unit_price < 0.8 * list_price.
--
-- EXPECTED OUTPUT: Order items with suspiciously low prices.
-- ==================================================



-- ==================================================
-- 02.24 - Department Hierarchy
-- ==================================================
-- SCENARIO: HR needs an org report showing each employee with their
-- department name.
--
-- YOUR TASK: Join employees to departments. Return employee name and
-- department name.
--
-- EXPECTED OUTPUT: Employees with their department assignments.
-- ==================================================



-- ==================================================
-- 02.25 - Order Fact Row (Wide Join)
-- ==================================================
-- SCENARIO: Build a single "order fact" query — one row per order
-- containing everything: customer info, sales rep name, payment status,
-- shipment status, and total item count.
--
-- YOUR TASK: Join orders to customers, employees, payments, shipments,
-- and order_items (aggregated). Return one comprehensive row per order.
--
-- EXPECTED OUTPUT: Wide result with customer, rep, payment, shipment, item_count per order.
-- ==================================================



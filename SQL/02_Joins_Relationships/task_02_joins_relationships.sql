SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 02: JOINS AND RELATIONSHIPS
-- ============================================================================
-- You're a data analyst combining data across tables. The 10 challenges
-- progress from basic INNER JOINs to an expert wide "order fact" join.
-- ============================================================================


-- ==================================================
-- 02.01 - Order Details with Customer Info  [BASIC]
-- ==================================================
-- SCENARIO: The service dashboard shows each order with the customer.
--
-- YOUR TASK: Join orders to customers. Return full_name, email, order_date,
-- status, channel for every order.
-- ==================================================



-- ==================================================
-- 02.02 - Order Items with Product Details  [BASIC]
-- ==================================================
-- SCENARIO: The warehouse needs a pick list of products per order.
--
-- YOUR TASK: Join order_items to products. Return order_id, product_name,
-- category, quantity, unit_price, and line gross (quantity * unit_price).
-- ==================================================



-- ==================================================
-- 02.03 - All Customers Including No Orders  [BASIC]
-- ==================================================
-- SCENARIO: Marketing wants to email ALL customers, even non-buyers.
--
-- YOUR TASK: LEFT JOIN customers to orders, keeping customers with zero orders.
-- ==================================================



-- ==================================================
-- 02.04 - Customers Who Never Ordered (Anti-Join)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Re-engagement needs customers who never purchased.
--
-- YOUR TASK: LEFT JOIN + WHERE orders.order_id IS NULL to find them.
-- ==================================================



-- ==================================================
-- 02.05 - Customers with Delivered Orders (Semi-Join)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Loyalty qualifies customers with at least one delivery.
--
-- YOUR TASK: Use EXISTS to find customers with any status='delivered' order.
-- ==================================================



-- ==================================================
-- 02.06 - Employee Manager Names (Self-Join)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: HR needs an org chart of employee + manager name.
--
-- YOUR TASK: Self-join employees on manager_id -> employee_id. CEO manager NULL.
-- ==================================================



-- ==================================================
-- 02.07 - Delivery Duration in Days  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Logistics tracks delivery performance.
--
-- YOUR TASK: Join shipments to orders; compute delivery_days between
-- shipped_at and delivered_at for delivered shipments.
-- ==================================================



-- ==================================================
-- 02.08 - Orders Without Successful Payment (NOT EXISTS)  [ADVANCED]
-- ==================================================
-- SCENARIO: Revenue wants orders missing a successful payment.
--
-- YOUR TASK: Use NOT EXISTS to find orders with no successful payment row.
-- ==================================================



-- ==================================================
-- 02.09 - Cities on Only One Side (FULL OUTER JOIN)  [ADVANCED]
-- ==================================================
-- SCENARIO: Logistics wants cities that are only home OR only shipping.
--
-- YOUR TASK: FULL OUTER JOIN customer cities vs shipping cities; return
-- cities NULL on one side.
-- ==================================================



-- ==================================================
-- 02.10 - Order Fact Row (Wide Join)  [EXPERT]
-- ==================================================
-- SCENARIO: Build one row per order with everything.
--
-- YOUR TASK: Join orders to customers, employees, payments, shipments, and
-- aggregated order_items. Return customer, rep, payment status, shipment
-- status, and item_count per order.
-- ==================================================

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

SELECT 
    c.full_name,
    c.email,
    o.order_date,
    o.status,
    o.channel

FROM orders o
INNER JOIN customers c ON c.customer_id=o.customer_id
ORDER BY o.order_date;

-- ==================================================
-- 02.02 - Order Items with Product Details  [BASIC]
-- ==================================================
-- SCENARIO: The warehouse needs a pick list of products per order.
--
-- YOUR TASK: Join order_items to products. Return order_id, product_name,
-- category, quantity, unit_price, and line gross (quantity * unit_price).
-- ==================================================

SELECT
    oi.order_id,
    p.product_name,
    p.category,
    oi.quantity,
    oi.unit_price,
    (oi.quantity * oi.unit_price) AS line_gross
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.product_id;


-- ==================================================
-- 02.03 - All Customers Including No Orders  [BASIC]
-- ==================================================
-- SCENARIO: Marketing wants to email ALL customers, even non-buyers.
--
-- YOUR TASK: LEFT JOIN customers to orders, keeping customers with zero orders.
-- ==================================================

Select 
    cus.email,
    o.order_id
    (SUM(AGGREATE ALL orders ofcus.customer_id)) AS "Total orders"
From orders o
LEFT JOIN customer cus cus.customer_id=o.customer_id
 
  

-- ==================================================
-- 02.04 - Customers Who Never Ordered (Anti-Join)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Re-engagement needs customers who never purchased.
--
-- YOUR TASK: LEFT JOIN + WHERE orders.order_id IS NULL to find them.
-- ==================================================
SELECT cus.customer_id, cus.full_name, cus.email
FROM customers cus
LEFT JOIN orders o ON o.customer_id=cus.customer_id
WHERE o.order_id IS NULL;

-- ==================================================
-- 02.05 - Customers with Delivered Orders (Semi-Join)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Loyalty qualifies customers with at least one delivery.
--
-- YOUR TASK: Use EXISTS to find customers with any status='delivered' order.
-- ==================================================
SELECT cus.customer_id, cus.full_name, cus.email
FROM customers cus
WHERE EXISTS (
    SELECT 1
    FROM orders o
    WHERE o.customer_id = cus.customer_id
      AND o.status = 'delivered'
);
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

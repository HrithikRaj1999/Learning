/*
==============================================================================
  TASK 02: Joins and Relationships
==============================================================================

LEVEL: Intermediate-Advanced
CONCEPTS: INNER JOIN, LEFT JOIN, FULL JOIN, self join, anti join, semi join, non-equi join, join cardinality, bridge tables

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 02.01
-- Return every order with customer full_name, email, order_date, status, and channel.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.02
-- Return each order item with order_id, product_name, category, quantity, unit_price, and line gross amount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.03
-- List all customers and their orders, keeping customers who have never ordered.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.04
-- Find customers who have not placed any order using a LEFT JOIN anti join pattern.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.05
-- Find customers who have placed at least one delivered order using EXISTS or a semi join.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.06
-- Return employees with their manager name using a self join on employees.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.07
-- Return each support ticket with customer name, assigned employee name, and related order status when present.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.08
-- Join payments to orders and customers, but keep failed or unmatched payment investigations visible.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.09
-- Find order_items whose stored unit_price differs from the current products.list_price.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.10
-- Return product categories and the number of distinct customers who bought each category.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.11
-- Find customer pairs from the same city without returning duplicate reversed pairs.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.12
-- Join shipments to orders and calculate delivery duration in days for delivered shipments.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.13
-- Return customers who opened a support ticket before their first order date.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.14
-- Find orders that have no successful payment using a NOT EXISTS anti join.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.15
-- Return every marketing campaign with matching web events by utm_campaign, keeping campaigns with zero events.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.16
-- Join web_events to customers and orders where a purchase event occurs within 7 days before an order.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.17
-- Find products that have inventory movements but have never appeared in order_items.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.18
-- Return sales reps and the customers they have served through orders, removing duplicates.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.19
-- Detect accidental row multiplication by joining orders, order_items, and payments and comparing row counts per order.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.20
-- Use a FULL OUTER JOIN to compare customer cities against shipping cities and show cities present on only one side.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.21
-- Return tickets with their latest ticket_event by joining to a derived table.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.22
-- Find customers whose subscription active period overlaps their order date.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.23
-- Join products to order_items with a non-equi condition that flags line prices below 80 percent of list_price.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.24
-- Return the department hierarchy with each employee and department name.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 02.25
-- Build an order fact query with one row per order containing customer, sales rep, payment, shipment, and item-count fields.
-- Write your solution below.

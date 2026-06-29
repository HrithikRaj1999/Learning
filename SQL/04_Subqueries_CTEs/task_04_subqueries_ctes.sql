SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 04: SUBQUERIES AND CTEs
-- ============================================================================
-- You restructure complex logic with subqueries and CTEs. The 10 challenges
-- progress from scalar subqueries to expert LATERAL and recursive CTEs.
-- ============================================================================


-- ==================================================
-- 04.01 - Orders Above Average Total  [BASIC]
-- ==================================================
-- SCENARIO: Find high-value orders vs the overall average.
--
-- YOUR TASK: Return orders whose line total is above the overall average
-- order total (scalar subquery).
-- ==================================================



-- ==================================================
-- 04.02 - Products Above Category Average  [BASIC]
-- ==================================================
-- SCENARIO: Catalog wants premium products per category.
--
-- YOUR TASK: Return products priced above the average price of their category.
-- ==================================================



-- ==================================================
-- 04.03 - Rank Customers by Spend (CTE)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Build a leaderboard.
--
-- YOUR TASK: Use a CTE for order totals, then rank customers by total spend.
-- ==================================================



-- ==================================================
-- 04.04 - Customers Who Ordered and Opened a Ticket (EXISTS)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Find engaged-but-troubled customers.
--
-- YOUR TASK: Use EXISTS to find customers who both ordered and opened a ticket.
-- ==================================================



-- ==================================================
-- 04.05 - Latest Payment per Order (Correlated)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Show the most recent payment for each order.
--
-- YOUR TASK: Return latest payment per order using a correlated subquery.
-- ==================================================



-- ==================================================
-- 04.06 - Order Revenue Pipeline (CTE chain)  [ADVANCED]
-- ==================================================
-- SCENARIO: Reporting needs gross, discount, net, and payment status per order.
--
-- YOUR TASK: Build a CTE pipeline computing gross revenue, discounts, net
-- revenue, and payment status per order.
-- ==================================================



-- ==================================================
-- 04.07 - Most Recent Web Event per Customer (LATERAL)  [ADVANCED]
-- ==================================================
-- SCENARIO: Show each customer's latest activity.
--
-- YOUR TASK: Use a LATERAL join to return each customer's most recent web event.
-- ==================================================



-- ==================================================
-- 04.08 - Top Two Products per Customer (LATERAL)  [ADVANCED]
-- ==================================================
-- SCENARIO: Personalization needs each customer's favorites.
--
-- YOUR TASK: Use LATERAL to return the top two products by quantity per customer.
-- ==================================================



-- ==================================================
-- 04.09 - Manager Hierarchy (Recursive CTE)  [EXPERT]
-- ==================================================
-- SCENARIO: HR needs the full org tree from the CEO down.
--
-- YOUR TASK: Use a recursive CTE to walk the employee manager hierarchy.
-- ==================================================



-- ==================================================
-- 04.10 - Spend Above City Average  [EXPERT]
-- ==================================================
-- SCENARIO: Find local whales.
--
-- YOUR TASK: Return customers whose lifetime spend exceeds the average
-- lifetime spend of their city.
-- ==================================================

SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 05: WINDOW FUNCTIONS
-- ============================================================================
-- You write analytics that keep row detail while computing across groups.
-- The 10 challenges progress from ranking to expert gaps/islands & sessions.
-- ============================================================================


-- ==================================================
-- 05.01 - First Order per Customer (ROW_NUMBER)  [BASIC]
-- ==================================================
-- SCENARIO: Identify each customer's first purchase.
--
-- YOUR TASK: Use ROW_NUMBER partitioned by customer to keep the first order.
-- ==================================================



-- ==================================================
-- 05.02 - Rank Customers by Revenue  [BASIC]
-- ==================================================
-- SCENARIO: Leaderboard of top spenders.
--
-- YOUR TASK: Rank customers by lifetime net revenue using RANK and DENSE_RANK.
-- ==================================================



-- ==================================================
-- 05.03 - Days Between Orders (LAG)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Measure purchase cadence.
--
-- YOUR TASK: Use LAG to show previous order date and days between orders.
-- ==================================================



-- ==================================================
-- 05.04 - Running Total of Daily Payments  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Finance wants cumulative collected revenue.
--
-- YOUR TASK: Running total of daily successful payment amount.
-- ==================================================



-- ==================================================
-- 05.05 - Revenue Quartiles (NTILE)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Segment customers into 4 spend tiers.
--
-- YOUR TASK: Divide customers into revenue quartiles using NTILE(4).
-- ==================================================



-- ==================================================
-- 05.06 - Top Three Products per Category  [ADVANCED]
-- ==================================================
-- SCENARIO: Merchandising wants category bestsellers.
--
-- YOUR TASK: Return the top three products by quantity sold per category.
-- ==================================================



-- ==================================================
-- 05.07 - 7-Day Moving Average of Events  [ADVANCED]
-- ==================================================
-- SCENARIO: Smooth daily web traffic.
--
-- YOUR TASK: 7-day moving average of daily web event count.
-- ==================================================



-- ==================================================
-- 05.08 - Order Share of Monthly Revenue  [ADVANCED]
-- ==================================================
-- SCENARIO: Show each order's weight in its month.
--
-- YOUR TASK: Each order's percentage of monthly revenue via SUM over partition.
-- ==================================================



-- ==================================================
-- 05.09 - Activity Islands  [EXPERT]
-- ==================================================
-- SCENARIO: Group consecutive active days per customer.
--
-- YOUR TASK: Group consecutive daily activity into islands per customer.
-- ==================================================



-- ==================================================
-- 05.10 - Sessionize Web Events  [EXPERT]
-- ==================================================
-- SCENARIO: A new session starts after 30 minutes of inactivity.
--
-- YOUR TASK: Assign a new session group when the gap exceeds 30 minutes.
-- ==================================================

SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 10: ANALYTICS, REPORTING, AND COHORTS
-- ============================================================================
-- You produce the metrics leadership lives by. The 10 challenges progress
-- from monthly revenue to expert retention matrices and MRR movements.
-- ============================================================================


-- ==================================================
-- 10.01 - Monthly Revenue Breakdown  [BASIC]
-- ==================================================
-- SCENARIO: Finance needs gross, discount, net, paid, refunded, outstanding.
--
-- YOUR TASK: Build a monthly revenue table with those six amounts.
-- ==================================================



-- ==================================================
-- 10.02 - Customer Lifetime Value  [BASIC]
-- ==================================================
-- SCENARIO: Quantify each customer's value.
--
-- YOUR TASK: Compute LTV = successful payments minus refunds per customer.
-- ==================================================



-- ==================================================
-- 10.03 - Signup vs First Purchase Cohort  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Compare signup month to activation month.
--
-- YOUR TASK: Per customer, return signup cohort month and first purchase month.
-- ==================================================



-- ==================================================
-- 10.04 - SLA Compliance  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: High-priority tickets must close within 24h.
--
-- YOUR TASK: Compute SLA compliance for high-priority tickets closed in 24h.
-- ==================================================



-- ==================================================
-- 10.05 - RFM Segments  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Marketing segments by recency, frequency, monetary value.
--
-- YOUR TASK: Build RFM scores and segment customers.
-- ==================================================



-- ==================================================
-- 10.06 - Conversion Funnel  [ADVANCED]
-- ==================================================
-- SCENARIO: Track visit -> view -> cart -> purchase.
--
-- YOUR TASK: Build the funnel with counts at each step from web_events.
-- ==================================================



-- ==================================================
-- 10.07 - Customer 360 Row  [ADVANCED]
-- ==================================================
-- SCENARIO: One row per customer for the CRM.
--
-- YOUR TASK: Combine spend, orders, tickets, latest activity, subscription.
-- ==================================================



-- ==================================================
-- 10.08 - Rolling 30-Day Active Customers  [ADVANCED]
-- ==================================================
-- SCENARIO: Track engagement trend.
--
-- YOUR TASK: Compute a rolling 30-day active customer count.
-- ==================================================



-- ==================================================
-- 10.09 - Retention Matrix  [EXPERT]
-- ==================================================
-- SCENARIO: Cohort retention by months since signup.
--
-- YOUR TASK: Build cohort month vs months-since-signup retention from orders.
-- ==================================================



-- ==================================================
-- 10.10 - MRR Movements  [EXPERT]
-- ==================================================
-- SCENARIO: Track subscription revenue dynamics.
--
-- YOUR TASK: Compute MRR plus new, expansion, contraction, and churned MRR.
-- ==================================================

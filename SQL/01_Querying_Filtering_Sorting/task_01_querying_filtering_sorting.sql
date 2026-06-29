SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 01: QUERYING, FILTERING, AND SORTING
-- ============================================================================
-- You work as a data analyst at an e-commerce company. Each challenge is a
-- real data-pull request. Write ONE query per challenge. The 10 challenges
-- progress from basic -> advanced -> expert.
-- ============================================================================


-- ==================================================
-- 01.01 - Active Customer List for Marketing  [BASIC]
-- ==================================================
-- SCENARIO: Marketing wants a welcome-back campaign list.
--
-- YOUR TASK: Return customer_id, full_name, email, city, signup_date for
-- active customers, sorted by signup_date descending (newest first).
-- ==================================================



-- ==================================================
-- 01.02 - Mid-Range Active Products  [BASIC]
-- ==================================================
-- SCENARIO: The catalog team reviews pricing tiers.
--
-- YOUR TASK: Return products where list_price is between 50 and 250 AND
-- active = true, ordered by list_price descending.
-- ==================================================



-- ==================================================
-- 01.03 - Target Cities with .com Emails  [BASIC]
-- ==================================================
-- SCENARIO: A regional campaign targets Bangalore, Mumbai, and Austin.
--
-- YOUR TASK: Return customers from those cities whose email ends with '.com'.
-- ==================================================



-- ==================================================
-- 01.04 - Organic Orders Without Coupons  [BASIC]
-- ==================================================
-- SCENARIO: Promotions wants organic purchases.
--
-- YOUR TASK: Return orders where coupon_code IS NULL AND channel != 'marketplace'.
-- ==================================================



-- ==================================================
-- 01.05 - Preferred Contact (Phone or Email)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Outreach needs one contact method per customer.
--
-- YOUR TASK: Return customer_id, full_name, and preferred_contact showing
-- phone when available, else email (use COALESCE).
-- ==================================================



-- ==================================================
-- 01.06 - Order Age Labels  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: The ops dashboard labels orders by freshness vs 2026-04-01.
--
-- YOUR TASK: Use CASE to add age_label: last 7 days = 'fresh', last 30 =
-- 'recent', older = 'older'.
-- ==================================================



-- ==================================================
-- 01.07 - Paginated Orders (Page 3, 5 Per Page)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: The admin panel shows 5 orders per page; user is on page 3.
--
-- YOUR TASK: Return rows 11-15 with deterministic ORDER BY using LIMIT/OFFSET.
-- ==================================================



-- ==================================================
-- 01.08 - All Distinct Cities (Customers + Shipping)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Logistics wants every city the company touches.
--
-- YOUR TASK: Return one column city of distinct values appearing in either
-- customers.city OR orders.shipping_city (use UNION).
-- ==================================================



-- ==================================================
-- 01.09 - Mobile Web Events (JSON Metadata)  [ADVANCED]
-- ==================================================
-- SCENARIO: The mobile team needs events from mobile devices.
--
-- YOUR TASK: Return web_events where metadata->>'device' = 'mobile'.
-- ==================================================



-- ==================================================
-- 01.10 - Tickets About Refund, Delay, or Login (Regex)  [ADVANCED]
-- ==================================================
-- SCENARIO: The support lead wants tickets mentioning these keywords.
--
-- YOUR TASK: Return tickets whose subject matches a case-insensitive regex
-- for 'refund', 'delay', or 'login'.
-- ==================================================

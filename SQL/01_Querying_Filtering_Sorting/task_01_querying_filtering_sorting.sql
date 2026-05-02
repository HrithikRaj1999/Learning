SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 01: QUERYING, FILTERING, AND SORTING
-- ============================================================================
-- You work as a data analyst at an e-commerce company. The marketing, support,
-- and ops teams constantly ask you for quick data pulls. Each challenge below
-- is a real request that landed in your inbox. Write ONE query per challenge.
-- ============================================================================


-- ==================================================
-- 01.01 - Active Customer List for Marketing
-- ==================================================
-- SCENARIO: The marketing team wants to send a welcome-back email campaign.
-- They need a list of all customers who are currently active, showing their
-- ID, full name, email, city, and when they signed up — newest signups first.
--
-- YOUR TASK: Return customer_id, full_name, email, city, signup_date
-- for active customers, sorted by signup_date descending (newest first).
--
-- EXPECTED OUTPUT: Rows with columns: customer_id | full_name | email | city | signup_date
-- Only active customers, ordered newest signup first.
-- ==================================================



-- ==================================================
-- 01.02 - Paid Orders from March 2026
-- ==================================================
-- SCENARIO: Finance needs to reconcile March 2026 payments. They want all
-- orders that have status 'paid' and were placed during March 2026.
--
-- YOUR TASK: Return order_id, customer_id, order_date, channel, status
-- for paid orders in March 2026, sorted by order_date then order_id.
--
-- EXPECTED OUTPUT: Rows showing paid March orders, ordered by date then ID.
-- ==================================================



-- ==================================================
-- 01.03 - Mid-Range Active Products
-- ==================================================
-- SCENARIO: The catalog team is reviewing pricing tiers. They want to see
-- all active products priced between $50 and $250, most expensive first.
--
-- YOUR TASK: Return products where list_price is between 50 and 250
-- AND active = true, ordered by list_price descending.
--
-- EXPECTED OUTPUT: Active products in that price range, highest price first.
-- ==================================================



-- ==================================================
-- 01.04 - Customers in Target Cities with .com Emails
-- ==================================================
-- SCENARIO: A regional sales campaign targets Bangalore, Mumbai, and Austin.
-- They only want customers whose email ends with '.com' (company domain filter).
--
-- YOUR TASK: Return customers from Bangalore, Mumbai, or Austin
-- whose email ends with '.com'.
--
-- EXPECTED OUTPUT: Filtered customer rows matching city + email criteria.
-- ==================================================



-- ==================================================
-- 01.05 - Orders Without Coupons (Non-Marketplace)
-- ==================================================
-- SCENARIO: The promotions team wants to understand organic purchases —
-- orders where no coupon was used and the channel isn't 'marketplace'.
--
-- YOUR TASK: Return orders where coupon_code IS NULL
-- AND channel != 'marketplace'.
--
-- EXPECTED OUTPUT: Orders with no coupon that came through owned channels.
-- ==================================================



-- ==================================================
-- 01.06 - Customer Contact List (Phone or Email Fallback)
-- ==================================================
-- SCENARIO: The outreach team needs one contact method per customer.
-- If a customer has a phone number, use that. Otherwise, use their email.
--
-- YOUR TASK: Return customer_id, full_name, and a column called
-- preferred_contact that shows phone when available, else email.
--
-- EXPECTED OUTPUT: Each customer with their best contact method.
-- ==================================================



-- ==================================================
-- 01.07 - Order Age Labels
-- ==================================================
-- SCENARIO: The ops dashboard needs orders labeled by freshness relative
-- to April 1, 2026. Orders from the last 7 days = 'fresh', last 30 days
-- = 'recent', anything older = 'older'.
--
-- YOUR TASK: Use CASE to add an age_label column based on order_date
-- relative to 2026-04-01.
--
-- EXPECTED OUTPUT: Each order with an extra age_label column.
-- ==================================================



-- ==================================================
-- 01.08 - First 10 Anonymous Web Events After March 2026
-- ==================================================
-- SCENARIO: The product analytics team is investigating anonymous traffic.
-- They want the first 10 web events after March 1, 2026 where there's
-- no logged-in customer (customer_id is null).
--
-- YOUR TASK: Return the first 10 web events after 2026-03-01
-- where customer_id IS NULL.
--
-- EXPECTED OUTPUT: Exactly 10 rows of anonymous web events.
-- ==================================================



-- ==================================================
-- 01.09 - Urgent Open Support Tickets
-- ==================================================
-- SCENARIO: The support manager's morning standup needs a count of all
-- high or urgent priority tickets that haven't been closed yet.
--
-- YOUR TASK: Return tickets where priority IN ('high', 'urgent')
-- AND status != 'closed'.
--
-- EXPECTED OUTPUT: Open/pending high-priority tickets.
-- ==================================================



-- ==================================================
-- 01.10 - All Distinct Cities (Customers + Shipping)
-- ==================================================
-- SCENARIO: The logistics team wants a master list of every city the
-- company touches — both where customers live AND where orders ship to.
--
-- YOUR TASK: Return a single column of distinct cities that appear in
-- either customers.city OR orders.shipping_city.
--
-- EXPECTED OUTPUT: One column called city with no duplicates.
-- ==================================================



-- ==================================================
-- 01.11 - Customers with 'a' in Name (Sorted by Position)
-- ==================================================
-- SCENARIO: A quirky internal contest: find all customers whose name
-- contains the letter 'a' (case-insensitive) and sort them by where
-- the first 'a' appears in their name.
--
-- YOUR TASK: Filter customers with 'a' in full_name (case-insensitive),
-- sort by the position of the first 'a'.
--
-- EXPECTED OUTPUT: Customers sorted by position of first 'a' in name.
-- ==================================================



-- ==================================================
-- 01.12 - Derived is_completed Flag on Orders
-- ==================================================
-- SCENARIO: The reporting dashboard needs a boolean-like column that
-- shows whether an order is "completed" (delivered or refunded).
--
-- YOUR TASK: Return orders with a derived is_completed flag that is
-- true only when status is 'delivered' or 'refunded'.
--
-- EXPECTED OUTPUT: Each order row with an is_completed column (true/false).
-- ==================================================



-- ==================================================
-- 01.13 - Products by SKU Prefix with Multi-Word Names
-- ==================================================
-- SCENARIO: The inventory team tracks books (BK-) and electronics (EL-).
-- They want only products with those prefixes that have multi-word names
-- (at least one space in the product name).
--
-- YOUR TASK: Return products where sku starts with 'BK-' or 'EL-'
-- AND product_name contains at least one space.
--
-- EXPECTED OUTPUT: Filtered products matching SKU prefix + multi-word name.
-- ==================================================



-- ==================================================
-- 01.14 - Non-Zero Non-Failed Payments
-- ==================================================
-- SCENARIO: The reconciliation team wants all real payment activity —
-- excluding zero-amount rows and failed attempts. Sort by largest
-- absolute amount first.
--
-- YOUR TASK: Return payments where amount != 0 AND status != 'failed',
-- sorted by ABS(amount) descending.
--
-- EXPECTED OUTPUT: Payment rows sorted by absolute amount (largest first).
-- ==================================================



-- ==================================================
-- 01.15 - Weekend Orders Only
-- ==================================================
-- SCENARIO: The marketing team wants to know how many orders come in
-- on weekends (Saturday/Sunday) to plan flash sales.
--
-- YOUR TASK: Cast order_date to date and return only orders placed on
-- Saturday or Sunday.
--
-- EXPECTED OUTPUT: Orders that were placed on weekend days.
-- ==================================================



-- ==================================================
-- 01.16 - Mobile Web Events (JSON Metadata)
-- ==================================================
-- SCENARIO: The mobile team needs web events where the user was on a
-- mobile device. The device info is stored in a JSON metadata column.
--
-- YOUR TASK: Return web_events where metadata->>'device' = 'mobile'.
--
-- EXPECTED OUTPUT: Web events from mobile devices.
-- ==================================================



-- ==================================================
-- 01.17 - Paginated Orders (Page 3, 5 Per Page)
-- ==================================================
-- SCENARIO: The admin panel shows orders 5 at a time. Someone clicked
-- to page 3 and needs the correct slice of data.
--
-- YOUR TASK: Return page 3 (rows 11-15) with 5 rows per page,
-- using a deterministic ORDER BY (e.g., order_id).
--
-- EXPECTED OUTPUT: Exactly 5 rows representing page 3.
-- ==================================================



-- ==================================================
-- 01.18 - Recent Signups (Last 90 Days)
-- ==================================================
-- SCENARIO: The growth team wants customers who signed up in the last
-- 90 days (from April 30, 2026) for a new-user survey.
--
-- YOUR TASK: Return customers with signup_date within 90 days
-- before 2026-04-30.
--
-- EXPECTED OUTPUT: Recently signed-up customers.
-- ==================================================



-- ==================================================
-- 01.19 - Combined Entity Names (No Duplicates)
-- ==================================================
-- SCENARIO: For a search autocomplete feature, the dev team needs one
-- list of all entity names — both customer names and product names —
-- without any duplicates.
--
-- YOUR TASK: UNION customer full_name and product name into a single
-- column called entity_name (removes duplicates automatically).
--
-- EXPECTED OUTPUT: Single column entity_name with unique values.
-- ==================================================



-- ==================================================
-- 01.20 - Combined Entity Names (Keep Duplicates)
-- ==================================================
-- SCENARIO: Same as above, but analytics wants to know the frequency —
-- so keep duplicates to count later.
--
-- YOUR TASK: UNION ALL customer full_name and product name into
-- entity_name (keeps duplicates).
--
-- EXPECTED OUTPUT: Single column entity_name, duplicates preserved.
-- ==================================================



-- ==================================================
-- 01.21 - Products Rounded to Nearest $10
-- ==================================================
-- SCENARIO: For a pricing display that groups products by $10 tiers,
-- round each product's list_price to the nearest 10.
--
-- YOUR TASK: Return products with list_price rounded to nearest 10,
-- sorted by the rounded value.
--
-- EXPECTED OUTPUT: Products with a rounded_price column, sorted.
-- ==================================================



-- ==================================================
-- 01.22 - Orders Shipped to Different City
-- ==================================================
-- SCENARIO: The fraud team investigates orders where the shipping city
-- doesn't match the customer's profile city — potential gift orders or
-- suspicious activity.
--
-- YOUR TASK: Return orders where shipping_city differs from the
-- customer's city (requires joining to customers).
--
-- EXPECTED OUTPUT: Orders where shipping destination != customer home city.
-- ==================================================



-- ==================================================
-- 01.23 - Tickets About Refund, Delay, or Login
-- ==================================================
-- SCENARIO: The support lead wants all tickets that mention 'refund',
-- 'delay', or 'login' in the subject line — using a regex for flexibility.
--
-- YOUR TASK: Return tickets where subject matches a regular expression
-- containing 'refund', 'delay', or 'login' (case-insensitive).
--
-- EXPECTED OUTPUT: Tickets with those keywords in subject.
-- ==================================================



-- ==================================================
-- 01.24 - Compact Order Label
-- ==================================================
-- SCENARIO: The shipping label printer needs a compact format:
-- ORD-<order_id>-<channel> for each order.
--
-- YOUR TASK: Build a string column called order_label using
-- concatenation: 'ORD-' || order_id || '-' || channel.
--
-- EXPECTED OUTPUT: Each order with an order_label column like 'ORD-42-web'.
-- ==================================================



-- ==================================================
-- 01.25 - Customers with Missing State (Show 'UNKNOWN')
-- ==================================================
-- SCENARIO: The CRM export requires every customer to have a state value.
-- For those with NULL state, display 'UNKNOWN' instead.
--
-- YOUR TASK: Return customers where state IS NULL, with a
-- state_display column showing 'UNKNOWN'.
--
-- EXPECTED OUTPUT: Customers with null state, showing 'UNKNOWN' as state_display.
-- ==================================================



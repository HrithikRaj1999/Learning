SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 09: POSTGRESQL ADVANCED TYPES AND FUNCTIONS
-- ============================================================================
-- PostgreSQL has superpowers other databases lack: JSONB, arrays, ranges,
-- custom types, full-text search, and user-defined functions. Master these
-- and you'll solve problems others need application code for.
-- ============================================================================


-- ==================================================
-- 09.01 - Extract Values from JSONB Metadata
-- ==================================================
-- SCENARIO: web_events.metadata stores device, browser, and referrer as JSON.
-- The analytics dashboard needs these as regular columns.
--
-- YOUR TASK: Use ->> operator to extract device, browser, and referrer
-- from the metadata JSONB column.
--
-- EXPECTED OUTPUT: event_id | device | browser | referrer (as text columns).
-- ==================================================



-- ==================================================
-- 09.02 - Filter by Nested JSON Value
-- ==================================================
-- SCENARIO: Some web events have a nested experiment assignment in metadata:
-- {"experiment": {"name": "checkout_v2", "variant": "B"}}. Find them.
--
-- YOUR TASK: Filter where metadata->'experiment'->>'name' matches a value,
-- or use @> containment operator.
--
-- EXPECTED OUTPUT: Events with specific nested experiment assignment.
-- ==================================================



-- ==================================================
-- 09.03 - Update JSONB to Add a Key
-- ==================================================
-- SCENARIO: The ETL pipeline needs to normalize device values in metadata.
-- Add a "normalized_device" key to the JSON without losing existing data.
--
-- YOUR TASK: UPDATE web_events SET metadata = metadata || '{"normalized_device": "..."}'
-- or use jsonb_set().
--
-- EXPECTED OUTPUT: UPDATE statement that adds a key to existing JSONB.
-- ==================================================



-- ==================================================
-- 09.04 - Aggregate Event Types into Array
-- ==================================================
-- SCENARIO: For each session, collect all event types into a single array
-- to analyze user behavior sequences.
--
-- YOUR TASK: Use ARRAY_AGG(event_type) grouped by session_id.
--
-- EXPECTED OUTPUT: session_id | event_types (text array like {'visit','click','purchase'}).
-- ==================================================



-- ==================================================
-- 09.05 - Array Overlap for Category Matching
-- ==================================================
-- SCENARIO: The recommendation engine has target categories ['Books','Electronics'].
-- Find customers whose purchased categories overlap with this target.
--
-- YOUR TASK: Build customer category arrays, then use && (overlap) operator.
--
-- EXPECTED OUTPUT: Customers whose purchased categories intersect the target.
-- ==================================================



-- ==================================================
-- 09.06 - Unnest Array into Rows
-- ==================================================
-- SCENARIO: A customer has categories stored as an array. Unnest it to
-- join with other tables or count occurrences per category.
--
-- YOUR TASK: Use UNNEST(category_array) to expand array into rows.
--
-- EXPECTED OUTPUT: One row per category element.
-- ==================================================



-- ==================================================
-- 09.07 - Daterange for Subscription Period
-- ==================================================
-- SCENARIO: Check if a specific date (2026-04-15) falls within a
-- subscription's active period using PostgreSQL range types.
--
-- YOUR TASK: Create daterange(started_on, ended_on) and test with @> operator.
--
-- EXPECTED OUTPUT: Subscriptions where 2026-04-15 is within the range.
-- ==================================================



-- ==================================================
-- 09.08 - Overlapping Subscription Periods
-- ==================================================
-- SCENARIO: Find customers with overlapping subscription periods — they
-- might be getting double-charged.
--
-- YOUR TASK: Use && (range overlap) operator between subscription dateranges.
--
-- EXPECTED OUTPUT: Subscription pairs that overlap in time.
-- ==================================================



-- ==================================================
-- 09.09 - Ticket Resolution Time Formatting
-- ==================================================
-- SCENARIO: Calculate the interval between ticket opened_at and closed_at,
-- then format it as hours for the SLA report.
--
-- YOUR TASK: Use EXTRACT(EPOCH FROM interval) / 3600 to get hours.
--
-- EXPECTED OUTPUT: ticket_id | resolution_hours (numeric).
-- ==================================================



-- ==================================================
-- 09.10 - Time Zone Conversion for Reporting
-- ==================================================
-- SCENARIO: Orders are stored in UTC but the India team needs IST times.
-- Convert order_date to 'Asia/Kolkata' for regional reports.
--
-- YOUR TASK: Use AT TIME ZONE 'Asia/Kolkata' to convert timestamps.
--
-- EXPECTED OUTPUT: order_id | utc_date | local_date (IST).
-- ==================================================



-- ==================================================
-- 09.11 - Generate Date Series + Left Join Revenue
-- ==================================================
-- SCENARIO: The dashboard must show every day in April 2026 — even days
-- with zero revenue. Generate the date series and left join actual data.
--
-- YOUR TASK: generate_series('2026-04-01', '2026-04-30', '1 day')
-- LEFT JOIN to daily revenue.
--
-- EXPECTED OUTPUT: 30 rows, one per day, with revenue (0 for no-sale days).
-- ==================================================



-- ==================================================
-- 09.12 - Normalize Phone Numbers (Regex Replace)
-- ==================================================
-- SCENARIO: Customer phone numbers have inconsistent formatting: dashes,
-- spaces, parentheses. Normalize to digits only.
--
-- YOUR TASK: Use regexp_replace(phone, '[^0-9]', '', 'g') to strip non-digits.
--
-- EXPECTED OUTPUT: customer_id | raw_phone | normalized_phone (digits only).
-- ==================================================



-- ==================================================
-- 09.13 - Extract Coupon Parts (Regex Match)
-- ==================================================
-- SCENARIO: Coupon codes follow a pattern: FAMILY-123. Extract the family
-- name and numeric suffix separately for analysis.
--
-- YOUR TASK: Use regexp_match(coupon_code, '^([A-Z]+)-(\d+)$') to capture groups.
--
-- EXPECTED OUTPUT: coupon_code | family | numeric_suffix.
-- ==================================================



-- ==================================================
-- 09.14 - Full-Text Search on Ticket Subjects
-- ==================================================
-- SCENARIO: Support agents search tickets by keyword. Use PostgreSQL's
-- full-text search with tsvector/tsquery for fuzzy matching.
--
-- YOUR TASK: to_tsvector('english', subject) @@ to_tsquery('english', 'refund & delay').
--
-- EXPECTED OUTPUT: Tickets matching the full-text search.
-- ==================================================



-- ==================================================
-- 09.15 - Rank Full-Text Search Results
-- ==================================================
-- SCENARIO: When multiple tickets match a search, rank them by relevance
-- so the most relevant appear first.
--
-- YOUR TASK: Use ts_rank() to score and order results.
--
-- EXPECTED OUTPUT: Tickets ordered by search relevance score.
-- ==================================================



-- ==================================================
-- 09.16 - UUID-Based Webhook Events Table
-- ==================================================
-- SCENARIO: External webhooks send events with UUID identifiers. Design
-- a table that uses UUID as primary key.
--
-- YOUR TASK: CREATE TABLE webhook_events with uuid PRIMARY KEY DEFAULT gen_random_uuid().
--
-- EXPECTED OUTPUT: Table DDL with UUID primary key.
-- ==================================================



-- ==================================================
-- 09.17 - UUID Extension Setup
-- ==================================================
-- SCENARIO: Document how to enable UUID generation in PostgreSQL using
-- the pgcrypto or uuid-ossp extension.
--
-- YOUR TASK: CREATE EXTENSION IF NOT EXISTS pgcrypto; Show gen_random_uuid() usage.
--
-- EXPECTED OUTPUT: Extension setup + usage example.
-- ==================================================



-- ==================================================
-- 09.18 - SQL Function: Net Line Amount
-- ==================================================
-- SCENARIO: The formula quantity * price * (1 - discount) is used everywhere.
-- Create a reusable SQL function for it.
--
-- YOUR TASK: CREATE FUNCTION net_line_amount(qty INT, price NUMERIC, discount NUMERIC)
-- RETURNS NUMERIC AS $$ ... $$
--
-- EXPECTED OUTPUT: Function definition + example usage in a query.
-- ==================================================



-- ==================================================
-- 09.19 - Immutable Function: Email Domain
-- ==================================================
-- SCENARIO: Extracting email domain is done in 10+ queries. Create an
-- immutable function (result never changes for same input) to reuse it.
--
-- YOUR TASK: CREATE FUNCTION email_domain(email TEXT) RETURNS TEXT
-- IMMUTABLE. Can be used in expression indexes.
--
-- EXPECTED OUTPUT: Immutable function + query using it.
-- ==================================================



-- ==================================================
-- 09.20 - Stable Function: Customer Lifetime Spend
-- ==================================================
-- SCENARIO: Multiple reports need "customer lifetime spend." Create a
-- stable function (result changes between statements but not within one).
--
-- YOUR TASK: CREATE FUNCTION customer_lifetime_spend(cid INT)
-- RETURNS NUMERIC STABLE.
--
-- EXPECTED OUTPUT: Stable function querying payment totals.
-- ==================================================



-- ==================================================
-- 09.21 - Fiscal Quarter Labels
-- ==================================================
-- SCENARIO: The finance team uses fiscal quarters (Q1 starts April).
-- Build labels like 'FY26-Q1' from order dates.
--
-- YOUR TASK: Use date_trunc + EXTRACT to derive fiscal quarter and year.
--
-- EXPECTED OUTPUT: order_id | order_date | fiscal_quarter (e.g., 'FY26-Q1').
-- ==================================================



-- ==================================================
-- 09.22 - Configurable Trial Period
-- ==================================================
-- SCENARIO: Different subscription plans have different trial periods.
-- Use make_interval to add a configurable number of days.
--
-- YOUR TASK: started_on + make_interval(days => trial_days) for trial end date.
--
-- EXPECTED OUTPUT: subscription_id | start | trial_end (dynamic interval).
-- ==================================================



-- ==================================================
-- 09.23 - Composite Type for Money Breakdown
-- ==================================================
-- SCENARIO: Functions that return price breakdowns (gross, discount, net)
-- benefit from a composite type instead of multiple OUT parameters.
--
-- YOUR TASK: CREATE TYPE money_breakdown AS (gross NUMERIC, discount NUMERIC, net NUMERIC).
-- Create a function that returns it.
--
-- EXPECTED OUTPUT: Type definition + function using it.
-- ==================================================



-- ==================================================
-- 09.24 - DISTINCT ON for Latest Per Group
-- ==================================================
-- SCENARIO: Get the latest payment per order. PostgreSQL's DISTINCT ON
-- does this in one line — much simpler than ROW_NUMBER.
--
-- YOUR TASK: SELECT DISTINCT ON (order_id) ... ORDER BY order_id, paid_at DESC.
--
-- EXPECTED OUTPUT: One row per order — the latest payment.
-- ==================================================



-- ==================================================
-- 09.25 - FILTER Clause for Pivot-Like Metrics
-- ==================================================
-- SCENARIO: Instead of CASE WHEN inside COUNT(), use PostgreSQL's FILTER
-- clause for cleaner conditional aggregation.
--
-- YOUR TASK: COUNT(*) FILTER (WHERE status = 'delivered') as delivered_count, etc.
--
-- EXPECTED OUTPUT: Compact pivot-style result using FILTER.
-- ==================================================



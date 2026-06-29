SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 09: POSTGRESQL ADVANCED TYPES AND FUNCTIONS
-- ============================================================================
-- You use Postgres-specific power features. The 10 challenges progress from
-- basic JSONB/regex to expert composite types and custom functions.
-- ============================================================================


-- ==================================================
-- 09.01 - Extract JSONB Fields  [BASIC]
-- ==================================================
-- SCENARIO: Reports need device, browser, referrer from metadata.
--
-- YOUR TASK: Extract those three keys from web_events.metadata.
-- ==================================================



-- ==================================================
-- 09.02 - Normalize Phone Numbers (regex)  [BASIC]
-- ==================================================
-- SCENARIO: Phones must be digits only.
--
-- YOUR TASK: Use regexp_replace to strip non-digits from customer phone.
-- ==================================================



-- ==================================================
-- 09.03 - Aggregate Event Types to Array  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Sessions store the sequence of event types.
--
-- YOUR TASK: Aggregate event types per session into a text array.
-- ==================================================



-- ==================================================
-- 09.04 - Unnest Categories  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: A category array must become rows for analysis.
--
-- YOUR TASK: Use unnest to expand a category array into rows.
-- ==================================================



-- ==================================================
-- 09.05 - Subscription Date Ranges  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Test whether 2026-04-15 falls within each subscription.
--
-- YOUR TASK: Build a daterange and use containment to test the date.
-- ==================================================



-- ==================================================
-- 09.06 - Net Line Amount Function  [ADVANCED]
-- ==================================================
-- SCENARIO: Reuse net-amount logic everywhere.
--
-- YOUR TASK: Create a SQL function net(qty, price, discount) and use it.
-- ==================================================



-- ==================================================
-- 09.07 - Full-Text Search on Tickets  [ADVANCED]
-- ==================================================
-- SCENARIO: Support searches subjects by keyword.
--
-- YOUR TASK: Build a tsvector/tsquery search over support_tickets.subject.
-- ==================================================



-- ==================================================
-- 09.08 - DISTINCT ON Latest Row  [ADVANCED]
-- ==================================================
-- SCENARIO: Get the latest payment per order quickly.
--
-- YOUR TASK: Use DISTINCT ON for latest row per group.
-- ==================================================



-- ==================================================
-- 09.09 - Pivot Metrics with FILTER  [ADVANCED]
-- ==================================================
-- SCENARIO: Build compact pivot-like counts.
--
-- YOUR TASK: Use aggregate FILTER to produce per-status columns.
-- ==================================================



-- ==================================================
-- 09.10 - Money Breakdown Composite Type  [EXPERT]
-- ==================================================
-- SCENARIO: Return gross/discount/net as one typed value.
--
-- YOUR TASK: Create a composite type and return it from a query.
-- ==================================================

/*
==============================================================================
  TASK 09: PostgreSQL Advanced Types and Functions
==============================================================================

LEVEL: Advanced
CONCEPTS: JSONB, arrays, ranges, intervals, timestamps, UUID, full-text search, regular expressions, custom functions, extensions

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 09.01
-- Extract device, browser, and referrer values from web_events.metadata JSONB.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.02
-- Filter web_events where metadata contains a nested experiment assignment.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.03
-- Update a JSONB metadata object to add a normalized_device key.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.04
-- Aggregate event types per session into a text array.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.05
-- Find customers whose purchased category array overlaps a target array of categories.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.06
-- Use unnest to turn a category array into rows for analysis.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.07
-- Create a daterange for each subscription and test whether 2026-04-15 is inside it.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.08
-- Find overlapping subscription periods using range operators.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.09
-- Calculate intervals between opened_at and closed_at for tickets and format hours.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.10
-- Convert order_date from UTC assumption to a named time zone for reporting.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.11
-- Generate a date series for every day in April 2026 and left join daily revenue.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.12
-- Use regexp_replace to normalize phone numbers to digits only.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.13
-- Use regexp_match to extract coupon family and numeric suffix from coupon_code.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.14
-- Create a tsvector search query over support_tickets.subject.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.15
-- Rank search results for tickets using ts_rank.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.16
-- Create a UUID-based table for external webhook events.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.17
-- Use gen_random_uuid comments and extension setup for pgcrypto.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.18
-- Create a SQL function that returns net line amount from quantity, price, and discount.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.19
-- Create an immutable function for email domain extraction and use it in a query.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.20
-- Create a stable function that returns customer lifetime spend.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.21
-- Use date_trunc and extract to build fiscal-quarter labels.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.22
-- Use make_interval to add a configurable trial period to subscription start dates.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.23
-- Create a composite type for money breakdown with gross, discount, and net fields.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.24
-- Use DISTINCT ON as a PostgreSQL-specific shortcut for latest row per group.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 09.25
-- Use FILTER with aggregate functions to build compact pivot-like metrics.
-- Write your solution below.

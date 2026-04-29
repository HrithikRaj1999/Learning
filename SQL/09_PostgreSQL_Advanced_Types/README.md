# Task 09: PostgreSQL Advanced Types and Functions

Level: Advanced

## Concepts

- JSONB
- arrays
- ranges
- intervals
- timestamps
- UUID
- full-text search
- regular expressions
- custom functions
- extensions

## Exercises

| # | Prompt |
|---|--------|
| 09.01 | Extract device, browser, and referrer values from web_events.metadata JSONB. |
| 09.02 | Filter web_events where metadata contains a nested experiment assignment. |
| 09.03 | Update a JSONB metadata object to add a normalized_device key. |
| 09.04 | Aggregate event types per session into a text array. |
| 09.05 | Find customers whose purchased category array overlaps a target array of categories. |
| 09.06 | Use unnest to turn a category array into rows for analysis. |
| 09.07 | Create a daterange for each subscription and test whether 2026-04-15 is inside it. |
| 09.08 | Find overlapping subscription periods using range operators. |
| 09.09 | Calculate intervals between opened_at and closed_at for tickets and format hours. |
| 09.10 | Convert order_date from UTC assumption to a named time zone for reporting. |
| 09.11 | Generate a date series for every day in April 2026 and left join daily revenue. |
| 09.12 | Use regexp_replace to normalize phone numbers to digits only. |
| 09.13 | Use regexp_match to extract coupon family and numeric suffix from coupon_code. |
| 09.14 | Create a tsvector search query over support_tickets.subject. |
| 09.15 | Rank search results for tickets using ts_rank. |
| 09.16 | Create a UUID-based table for external webhook events. |
| 09.17 | Use gen_random_uuid comments and extension setup for pgcrypto. |
| 09.18 | Create a SQL function that returns net line amount from quantity, price, and discount. |
| 09.19 | Create an immutable function for email domain extraction and use it in a query. |
| 09.20 | Create a stable function that returns customer lifetime spend. |
| 09.21 | Use date_trunc and extract to build fiscal-quarter labels. |
| 09.22 | Use make_interval to add a configurable trial period to subscription start dates. |
| 09.23 | Create a composite type for money breakdown with gross, discount, and net fields. |
| 09.24 | Use DISTINCT ON as a PostgreSQL-specific shortcut for latest row per group. |
| 09.25 | Use FILTER with aggregate functions to build compact pivot-like metrics. |

# Task 09: PostgreSQL Advanced Types and Functions

Level: Basic → Expert

## Concepts

- JSONB, arrays, ranges
- regular expressions, full-text search
- DISTINCT ON, FILTER
- custom SQL functions, composite types

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 09.01 | Extract device, browser, referrer from web_events.metadata. |
| 09.02 | Normalize phone numbers to digits only with regexp_replace. |
| 09.03 | Aggregate event types per session into a text array. |
| 09.04 | Use unnest to turn a category array into rows. |
| 09.05 | Build a daterange per subscription and test if 2026-04-15 is inside. |
| 09.06 | Create a SQL function for net line amount and use it. |
| 09.07 | Create a tsvector search over support_tickets.subject. |
| 09.08 | Use DISTINCT ON for latest payment per order. |
| 09.09 | Use FILTER aggregates to build compact pivot metrics. |
| 09.10 | Create a composite type for gross/discount/net and return it. |

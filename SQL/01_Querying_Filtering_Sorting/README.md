# Task 01: Querying, Filtering, and Sorting

Level: Basic → Advanced

## Concepts

- SELECT, WHERE, ORDER BY
- BETWEEN, IN, LIKE
- NULL handling, COALESCE
- CASE
- LIMIT/OFFSET pagination
- UNION
- JSON access, regex

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 01.01 | Return each active customer with customer_id, full_name, email, city, signup_date sorted by newest signup first. |
| 01.02 | Find products with list_price between 50 and 250 and active true, ordered by price descending. |
| 01.03 | Return customers from Bangalore, Mumbai, or Austin whose email ends with '.com'. |
| 01.04 | Show orders where coupon_code is null and channel is not 'marketplace'. |
| 01.05 | Build preferred_contact using phone when present, else email. |
| 01.06 | Label every order 'fresh', 'recent', or 'older' relative to 2026-04-01 using CASE. |
| 01.07 | Return page 3 of orders with 5 rows per page using deterministic ordering. |
| 01.08 | Return distinct cities appearing in either customers.city or orders.shipping_city. |
| 01.09 | Return web events whose metadata device is 'mobile'. |
| 01.10 | Return tickets whose subject matches 'refund', 'delay', or 'login' via regex. |

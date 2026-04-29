# Task 01: Querying, Filtering, and Sorting

Level: Intermediate

## Concepts

- SELECT
- WHERE
- ORDER BY
- LIMIT/OFFSET
- CASE
- COALESCE
- NULL handling
- date filters
- pattern matching
- set operators

## Exercises

| # | Prompt |
|---|--------|
| 01.01 | Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first. |
| 01.02 | List paid orders placed in March 2026 with order_id, customer_id, order_date, channel, and status sorted by order_date then order_id. |
| 01.03 | Find products whose list_price is between 50 and 250 and whose active flag is true, ordered by price descending. |
| 01.04 | Return customers from either Bangalore, Mumbai, or Austin whose email ends with '.com'. |
| 01.05 | Show orders where coupon_code is null and channel is not 'marketplace'. |
| 01.06 | Create a customer contact list that uses phone when present, otherwise email, as preferred_contact. |
| 01.07 | Label every order as 'fresh', 'recent', or 'older' based on order_date relative to 2026-04-01 using CASE. |
| 01.08 | Return the first 10 web events after 2026-03-01 for anonymous sessions where customer_id is null. |
| 01.09 | Find support tickets with high or urgent priority that are not closed. |
| 01.10 | Return distinct cities that appear in either customers.city or orders.shipping_city. |
| 01.11 | List customers whose names contain the letter 'a' case-insensitively and sort by the position of the first 'a'. |
| 01.12 | Return orders with a derived is_completed flag that is true only for delivered or refunded statuses. |
| 01.13 | Find products where sku starts with 'BK-' or 'EL-' and the product name contains at least two words. |
| 01.14 | Return payment rows where amount is not equal to 0 and status is not failed, sorted by absolute amount descending. |
| 01.15 | Build a query that casts order_date to date and returns only weekend orders. |
| 01.16 | Show web events whose metadata JSON contains a device value of 'mobile'. |
| 01.17 | Return orders paginated as page 3 with 5 rows per page using deterministic ordering. |
| 01.18 | Find customers with signup_date in the last 90 days from 2026-04-30. |
| 01.19 | Return a single column called entity_name that unions customer names and product names without duplicates. |
| 01.20 | Return a single column called entity_name that unions customer names and product names while keeping duplicates. |
| 01.21 | Show products with list_price rounded to the nearest 10 and sorted by the rounded value. |
| 01.22 | Filter orders where shipping_city differs from the customer's profile city. |
| 01.23 | Return tickets where subject has the word 'refund', 'delay', or 'login' using a regular expression. |
| 01.24 | Create a compact order label in the format ORD-<order_id>-<channel> using string concatenation. |
| 01.25 | Return customers with no state value and display 'UNKNOWN' as state_display. |

/*
==============================================================================
  TASK 01: Querying, Filtering, and Sorting
==============================================================================

LEVEL: Intermediate
CONCEPTS: SELECT, WHERE, ORDER BY, LIMIT/OFFSET, CASE, COALESCE, NULL handling, date filters, pattern matching, set operators

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 01.01
-- Return each active customer with customer_id, full_name, email, city, and signup_date sorted by newest signup first.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.02
-- List paid orders placed in March 2026 with order_id, customer_id, order_date, channel, and status sorted by order_date then order_id.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.03
-- Find products whose list_price is between 50 and 250 and whose active flag is true, ordered by price descending.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.04
-- Return customers from either Bangalore, Mumbai, or Austin whose email ends with '.com'.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.05
-- Show orders where coupon_code is null and channel is not 'marketplace'.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.06
-- Create a customer contact list that uses phone when present, otherwise email, as preferred_contact.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.07
-- Label every order as 'fresh', 'recent', or 'older' based on order_date relative to 2026-04-01 using CASE.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.08
-- Return the first 10 web events after 2026-03-01 for anonymous sessions where customer_id is null.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.09
-- Find support tickets with high or urgent priority that are not closed.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.10
-- Return distinct cities that appear in either customers.city or orders.shipping_city.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.11
-- List customers whose names contain the letter 'a' case-insensitively and sort by the position of the first 'a'.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.12
-- Return orders with a derived is_completed flag that is true only for delivered or refunded statuses.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.13
-- Find products where sku starts with 'BK-' or 'EL-' and the product name contains at least two words.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.14
-- Return payment rows where amount is not equal to 0 and status is not failed, sorted by absolute amount descending.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.15
-- Build a query that casts order_date to date and returns only weekend orders.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.16
-- Show web events whose metadata JSON contains a device value of 'mobile'.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.17
-- Return orders paginated as page 3 with 5 rows per page using deterministic ordering.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.18
-- Find customers with signup_date in the last 90 days from 2026-04-30.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.19
-- Return a single column called entity_name that unions customer names and product names without duplicates.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.20
-- Return a single column called entity_name that unions customer names and product names while keeping duplicates.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.21
-- Show products with list_price rounded to the nearest 10 and sorted by the rounded value.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.22
-- Filter orders where shipping_city differs from the customer's profile city.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.23
-- Return tickets where subject has the word 'refund', 'delay', or 'login' using a regular expression.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.24
-- Create a compact order label in the format ORD-<order_id>-<channel> using string concatenation.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 01.25
-- Return customers with no state value and display 'UNKNOWN' as state_display.
-- Write your solution below.

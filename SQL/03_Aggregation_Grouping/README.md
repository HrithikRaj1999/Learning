# Task 03: Aggregation and Grouping

Level: Basic → Expert

## Concepts

- GROUP BY, HAVING, COUNT DISTINCT
- filtered aggregates (FILTER)
- ROLLUP, GROUPING SETS
- string_agg, json aggregation

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 03.01 | Calculate net revenue per order from quantity, unit_price, discount_pct. |
| 03.02 | Return total paid amount per customer for successful payments only. |
| 03.03 | Count orders by status and channel. |
| 03.04 | Find customers with more than two orders, with count and latest order date. |
| 03.05 | Compute average order value per month. |
| 03.06 | Count open/pending/closed tickets per priority using filtered aggregates. |
| 03.07 | Build monthly revenue with subtotal rows using ROLLUP. |
| 03.08 | Return revenue by month, by channel, and grand total via GROUPING SETS. |
| 03.09 | Return each customer with a comma-separated list of purchased categories. |
| 03.10 | Return each order as a JSON array of {product_name, quantity, net_amount}. |

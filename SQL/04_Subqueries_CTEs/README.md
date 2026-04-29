# Task 04: Subqueries and CTEs

Level: Intermediate-Advanced

## Concepts

- scalar subqueries
- correlated subqueries
- EXISTS
- NOT EXISTS
- CTE pipelines
- recursive CTEs
- LATERAL
- materialized CTE behavior

## Exercises

| # | Prompt |
|---|--------|
| 04.01 | Return orders whose total line amount is above the overall average order total. |
| 04.02 | Find customers whose first order was paid successfully within 2 days. |
| 04.03 | Use a CTE to calculate order totals, then rank customers by total spend. |
| 04.04 | Use NOT EXISTS to find products that were never ordered after 2026-03-01. |
| 04.05 | Use EXISTS to find customers who both ordered and opened a support ticket. |
| 04.06 | Return the latest payment per order using a correlated subquery. |
| 04.07 | Return each customer with their most recent web event using a LATERAL join. |
| 04.08 | Use a recursive CTE to walk the employee manager hierarchy from the CEO downward. |
| 04.09 | Use a recursive CTE to return the chain of managers for one employee. |
| 04.10 | Build a CTE pipeline that calculates gross revenue, discounts, net revenue, and payment status per order. |
| 04.11 | Find customers whose lifetime spend is greater than the average lifetime spend of their city. |
| 04.12 | Use a scalar subquery in SELECT to show each product's share of all product revenue. |
| 04.13 | Find orders where every order item has a discount_pct of zero. |
| 04.14 | Find orders where at least one item was discounted by more than 10 percent. |
| 04.15 | Use CTEs to identify customers with a web visit, cart event, and purchase event in sequence. |
| 04.16 | Return products priced above the average price of their category. |
| 04.17 | Use LATERAL to return the top two products by quantity for each customer. |
| 04.18 | Find tickets whose latest event is not a customer reply. |
| 04.19 | Use a CTE to deduplicate web events by session_id, event_type, and occurred_at. |
| 04.20 | Compare monthly revenue to the previous month using CTEs without window functions. |
| 04.21 | Use a CTE to isolate failed payments, then join to orders and customers for a retry report. |
| 04.22 | Find customers with an active subscription but no order in the last 30 days from 2026-04-30. |
| 04.23 | Use nested CTEs to compute category revenue and return categories above the category average. |
| 04.24 | Use a derived table to find each customer's highest value order. |
| 04.25 | Write the same top-customer query once with a subquery and once with a CTE, then compare readability. |

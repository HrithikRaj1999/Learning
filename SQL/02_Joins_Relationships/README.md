# Task 02: Joins and Relationships

Level: Basic → Expert

## Concepts

- INNER JOIN, LEFT JOIN, FULL OUTER JOIN
- self join, anti join, semi join
- date math across tables
- join cardinality / fan-out

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 02.01 | Return every order with customer full_name, email, order_date, status, channel. |
| 02.02 | Return each order item with product_name, category, quantity, unit_price, line gross. |
| 02.03 | List all customers and their orders, keeping customers who never ordered. |
| 02.04 | Find customers who never ordered using a LEFT JOIN anti join. |
| 02.05 | Find customers with at least one delivered order using EXISTS. |
| 02.06 | Return employees with their manager name via self join. |
| 02.07 | Compute delivery duration in days for delivered shipments. |
| 02.08 | Find orders with no successful payment using NOT EXISTS. |
| 02.09 | Use FULL OUTER JOIN to show cities present only on one side. |
| 02.10 | Build one row per order with customer, sales rep, payment, shipment, item-count. |

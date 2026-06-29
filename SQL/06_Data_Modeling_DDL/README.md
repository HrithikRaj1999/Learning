# Task 06: Data Modeling and DDL

Level: Basic → Expert

## Concepts

- CREATE/ALTER TABLE, constraints, foreign keys
- normalization, generated columns
- bridge tables, audit tables
- exclusion constraints, partitioning, star schema

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 06.01 | Create product_reviews with rating 1-5 and one review per customer/product. |
| 06.02 | Add a CHECK preventing shipments.delivered_at before shipped_at. |
| 06.03 | Add a generated net_line_amount column to order_items. |
| 06.04 | Add orders.sales_rep_id FK to employees with explicit delete behavior. |
| 06.05 | Split product category into a categories table referenced by products. |
| 06.06 | Create a campaign-product bridge table with composite primary key. |
| 06.07 | Create an audit table for order status transitions. |
| 06.08 | Add an exclusion constraint preventing overlapping active subscriptions. |
| 06.09 | Create a monthly partitioned web_events_archive table. |
| 06.10 | Outline a star schema with fact_orders and customer/product/date dims. |

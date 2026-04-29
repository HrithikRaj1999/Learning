# Task 07: DML, Transactions, and MERGE

Level: Advanced

## Concepts

- INSERT
- UPDATE
- DELETE
- UPSERT
- MERGE
- RETURNING
- transactions
- savepoints
- isolation
- locking

## Exercises

| # | Prompt |
|---|--------|
| 07.01 | Insert a new customer and return the generated customer_id. |
| 07.02 | Insert an order with two order_items inside one transaction. |
| 07.03 | Update failed payments back to 'pending' for retry only for orders that are not cancelled. |
| 07.04 | Delete anonymous web_events older than 90 days from 2026-04-30 using a safe preview query first. |
| 07.05 | Use INSERT ... ON CONFLICT to upsert a customer by email. |
| 07.06 | Use MERGE to synchronize a staging product price table into products. |
| 07.07 | Use UPDATE ... FROM to set orders.status to 'delivered' for shipments with delivered_at present and successful payment. |
| 07.08 | Use RETURNING to capture changed order_ids into a follow-up query. |
| 07.09 | Create a transaction with SAVEPOINT around a risky order status update. |
| 07.10 | Write a transaction that transfers ticket ownership from one employee to another. |
| 07.11 | Demonstrate how SELECT FOR UPDATE would protect inventory during order creation. |
| 07.12 | Write two statements that could deadlock if run in opposite order, then reorder them safely. |
| 07.13 | Use DELETE with USING to remove duplicate staging rows while keeping the newest row. |
| 07.14 | Bulk insert campaign rows from a VALUES clause. |
| 07.15 | Use COPY command comments to describe how you would load a CSV into staging.raw_orders. |
| 07.16 | Update subscription statuses to expired when ended_on is before 2026-04-30. |
| 07.17 | Cancel unpaid pending orders older than 30 days and write affected rows to an audit table. |
| 07.18 | Use a CTE with INSERT to create support tickets for failed payments above 200. |
| 07.19 | Use a writable CTE to insert a ticket_event immediately after creating a support_ticket. |
| 07.20 | Write a transaction that changes product prices and records old and new prices in price_history. |
| 07.21 | Show how READ COMMITTED and REPEATABLE READ would affect a revenue report during concurrent payments. |
| 07.22 | Use advisory-lock comments to protect one monthly billing run from running twice. |
| 07.23 | Use TRUNCATE on a staging table and explain the difference from DELETE in comments. |
| 07.24 | Update order status based on payment and shipment state with a CASE expression. |
| 07.25 | Design an idempotent daily load script that can be rerun without duplicating facts. |

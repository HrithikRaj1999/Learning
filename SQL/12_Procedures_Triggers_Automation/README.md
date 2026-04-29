# Task 12: Procedures, Triggers, and Automation

Level: Advanced

## Concepts

- SQL functions
- PL/pgSQL
- procedures
- triggers
- exception handling
- dynamic SQL
- audit automation
- scheduled jobs

## Exercises

| # | Prompt |
|---|--------|
| 12.01 | Create a SQL function that calculates order net total by order_id. |
| 12.02 | Create a PL/pgSQL function that returns customer lifetime spend. |
| 12.03 | Create a procedure that closes stale pending tickets older than a configurable number of days. |
| 12.04 | Create a trigger that writes order status changes into order_status_audit. |
| 12.05 | Create a trigger that prevents delivered orders from being moved back to pending. |
| 12.06 | Create a trigger that updates products.updated_at whenever list_price changes. |
| 12.07 | Create a function that raises an exception when payment amount exceeds order total by more than 5 percent. |
| 12.08 | Create a procedure that performs a daily revenue snapshot insert. |
| 12.09 | Use dynamic SQL to rebuild indexes for tables matching a naming pattern. |
| 12.10 | Create a trigger on ticket_events that updates support_tickets.updated_at. |
| 12.11 | Create a trigger that auto-closes a ticket when a ticket_event type is 'resolved'. |
| 12.12 | Create an audit function reusable across multiple tables with TG_TABLE_NAME. |
| 12.13 | Create a function that returns a table of top customers with parameters for date range and limit. |
| 12.14 | Create a procedure that retries failed payments by inserting rows into payment_retry_queue. |
| 12.15 | Use exception handling to log failed procedure runs to job_errors. |
| 12.16 | Create a scheduled-job design comment using pg_cron for refreshing materialized views. |
| 12.17 | Create a notification trigger using NOTIFY when urgent tickets are inserted. |
| 12.18 | Create a validation function used by a CHECK constraint for allowed coupon format. |
| 12.19 | Create a function that accepts JSONB input and inserts a web_event after validation. |
| 12.20 | Create a procedure that archives old web_events into a partitioned archive table. |
| 12.21 | Create a trigger that maintains inventory balance after inventory_movements inserts. |
| 12.22 | Create a function that returns order profitability including shipping cost. |
| 12.23 | Create a trigger that blocks deleting customers who have orders. |
| 12.24 | Create a procedure that reassigns tickets from inactive employees to a queue user. |
| 12.25 | Write tests as SQL statements that prove one trigger works for insert, update, and invalid input. |

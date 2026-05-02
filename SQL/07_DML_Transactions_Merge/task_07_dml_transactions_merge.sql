SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 07: DML, TRANSACTIONS, AND MERGE
-- ============================================================================
-- Now you're changing data — not just reading it. INSERTs, UPDATEs, DELETEs,
-- transactions, and conflict handling. These are the patterns that keep
-- production databases consistent when things go wrong mid-operation.
-- ============================================================================


-- ==================================================
-- 07.01 - Insert New Customer (Return Generated ID)
-- ==================================================
-- SCENARIO: The signup form just collected a new customer. Insert their
-- record and return the auto-generated customer_id.
--
-- YOUR TASK: INSERT INTO customers (...) VALUES (...) RETURNING customer_id.
--
-- EXPECTED OUTPUT: The generated customer_id of the new row.
-- ==================================================



-- ==================================================
-- 07.02 - Insert Order with Items (Transaction)
-- ==================================================
-- SCENARIO: A customer places an order with 2 items. Both the order and
-- its items must be created together — or neither should exist.
--
-- YOUR TASK: BEGIN; INSERT order; INSERT 2 order_items; COMMIT;
--
-- EXPECTED OUTPUT: Transaction block creating order + items atomically.
-- ==================================================



-- ==================================================
-- 07.03 - Retry Failed Payments (Conditional Update)
-- ==================================================
-- SCENARIO: The payment gateway allows retrying failed payments — but
-- only for orders that haven't been cancelled.
--
-- YOUR TASK: UPDATE payments SET status = 'pending' WHERE status = 'failed'
-- AND order_id IN (orders not cancelled).
--
-- EXPECTED OUTPUT: UPDATE with subquery filtering out cancelled orders.
-- ==================================================



-- ==================================================
-- 07.04 - Delete Old Anonymous Events (Preview First)
-- ==================================================
-- SCENARIO: Privacy policy: delete anonymous web events older than 90 days.
-- Always preview what you'll delete before running the actual DELETE.
--
-- YOUR TASK: First SELECT (preview), then DELETE matching rows.
--
-- EXPECTED OUTPUT: Safe delete pattern with preview query first.
-- ==================================================



-- ==================================================
-- 07.05 - Upsert Customer by Email
-- ==================================================
-- SCENARIO: The sync job receives customer data. If email already exists,
-- update the name and phone. Otherwise insert a new row.
--
-- YOUR TASK: INSERT ... ON CONFLICT (email) DO UPDATE SET full_name = ..., phone = ...
--
-- EXPECTED OUTPUT: Upsert statement handling duplicates gracefully.
-- ==================================================



-- ==================================================
-- 07.06 - MERGE Product Prices from Staging
-- ==================================================
-- SCENARIO: A nightly job syncs product prices from a staging table.
-- If product exists, update price. If new, insert. If removed, deactivate.
--
-- YOUR TASK: Use MERGE (PG15+) to sync staging_products into products.
--
-- EXPECTED OUTPUT: MERGE statement with MATCHED/NOT MATCHED clauses.
-- ==================================================



-- ==================================================
-- 07.07 - Update Orders to Delivered (Multi-Table Logic)
-- ==================================================
-- SCENARIO: An order should be marked 'delivered' only when its shipment
-- has a delivered_at date AND payment was successful.
--
-- YOUR TASK: UPDATE orders SET status = 'delivered' FROM shipments, payments
-- WHERE conditions match.
--
-- EXPECTED OUTPUT: UPDATE ... FROM with multi-table join conditions.
-- ==================================================



-- ==================================================
-- 07.08 - Capture Changed IDs with RETURNING
-- ==================================================
-- SCENARIO: After bulk-updating order statuses, capture the affected
-- order_ids for notification or logging purposes.
--
-- YOUR TASK: UPDATE ... RETURNING order_id (use in a CTE or standalone).
--
-- EXPECTED OUTPUT: Statement using RETURNING to capture affected rows.
-- ==================================================



-- ==================================================
-- 07.09 - SAVEPOINT for Risky Update
-- ==================================================
-- SCENARIO: You're updating order statuses in bulk, but one might fail.
-- Use SAVEPOINT so a single failure doesn't rollback everything.
--
-- YOUR TASK: BEGIN; SAVEPOINT before_update; UPDATE ...; (if error)
-- ROLLBACK TO before_update; COMMIT;
--
-- EXPECTED OUTPUT: Transaction with SAVEPOINT protecting partial work.
-- ==================================================



-- ==================================================
-- 07.10 - Transfer Ticket Ownership
-- ==================================================
-- SCENARIO: An employee is going on leave. Reassign all their open tickets
-- to another employee in one atomic transaction.
--
-- YOUR TASK: BEGIN; UPDATE support_tickets SET assigned_to = new_emp
-- WHERE assigned_to = old_emp AND status != 'closed'; COMMIT;
--
-- EXPECTED OUTPUT: Atomic ownership transfer transaction.
-- ==================================================



-- ==================================================
-- 07.11 - SELECT FOR UPDATE (Inventory Lock)
-- ==================================================
-- SCENARIO: Two orders are placed simultaneously for the last item in stock.
-- Use SELECT FOR UPDATE to lock the inventory row during check+decrement.
--
-- YOUR TASK: Demonstrate SELECT ... FOR UPDATE pattern that prevents
-- overselling inventory.
--
-- EXPECTED OUTPUT: Locking pattern with explanatory comments.
-- ==================================================



-- ==================================================
-- 07.12 - Deadlock Scenario and Fix
-- ==================================================
-- SCENARIO: Two transactions update rows in opposite order → deadlock.
-- Show the problematic order, then the safe order.
--
-- YOUR TASK: Show two statements that could deadlock, then reorder them
-- to always lock in the same order.
--
-- EXPECTED OUTPUT: Bad ordering + fixed ordering with comments.
-- ==================================================



-- ==================================================
-- 07.13 - Delete Duplicate Staging Rows
-- ==================================================
-- SCENARIO: The staging table has duplicate rows from a double-load.
-- Delete duplicates keeping only the newest row per natural key.
--
-- YOUR TASK: DELETE FROM staging USING (ROW_NUMBER to identify dupes).
--
-- EXPECTED OUTPUT: DELETE with USING clause to remove duplicates.
-- ==================================================



-- ==================================================
-- 07.14 - Bulk Insert Campaigns
-- ==================================================
-- SCENARIO: Marketing created 5 new campaigns at once. Insert them all
-- in a single statement using a VALUES list.
--
-- YOUR TASK: INSERT INTO campaigns (...) VALUES (...), (...), (...), ...
--
-- EXPECTED OUTPUT: Multi-row INSERT statement.
-- ==================================================



-- ==================================================
-- 07.15 - COPY Command Documentation
-- ==================================================
-- SCENARIO: A data engineer needs to load a large CSV into staging.raw_orders.
-- Document the COPY command approach with comments.
--
-- YOUR TASK: Write COPY command (commented) showing how to load CSV data.
-- Explain delimiter, header, null handling.
--
-- EXPECTED OUTPUT: Commented COPY command with explanation.
-- ==================================================



-- ==================================================
-- 07.16 - Expire Old Subscriptions
-- ==================================================
-- SCENARIO: Subscriptions with ended_on before today should be marked
-- 'expired' so the billing system stops charging.
--
-- YOUR TASK: UPDATE subscriptions SET status = 'expired'
-- WHERE ended_on < '2026-04-30' AND status != 'expired'.
--
-- EXPECTED OUTPUT: Bulk status update for expired subscriptions.
-- ==================================================



-- ==================================================
-- 07.17 - Cancel Unpaid Orders + Audit Trail
-- ==================================================
-- SCENARIO: Orders pending payment for over 30 days should be auto-cancelled.
-- Record the cancellations in an audit table.
--
-- YOUR TASK: Use a CTE with UPDATE ... RETURNING to cancel orders,
-- then INSERT cancelled IDs into audit table.
--
-- EXPECTED OUTPUT: Writable CTE that cancels + audits in one statement.
-- ==================================================



-- ==================================================
-- 07.18 - Auto-Create Tickets for Failed Payments
-- ==================================================
-- SCENARIO: Any failed payment above $200 should trigger a support ticket.
-- Use a CTE to find qualifying payments and insert tickets.
--
-- YOUR TASK: WITH failed AS (SELECT ...) INSERT INTO support_tickets
-- SELECT from failed CTE.
--
-- EXPECTED OUTPUT: CTE-driven INSERT creating tickets from payment data.
-- ==================================================



-- ==================================================
-- 07.19 - Writable CTE: Ticket + First Event
-- ==================================================
-- SCENARIO: When creating a support ticket, immediately create its first
-- ticket_event (type='created'). Do both in one statement.
--
-- YOUR TASK: WITH new_ticket AS (INSERT ... RETURNING ticket_id)
-- INSERT INTO ticket_events using the returned ID.
--
-- EXPECTED OUTPUT: Chained writable CTEs creating parent + child.
-- ==================================================



-- ==================================================
-- 07.20 - Price Change with History
-- ==================================================
-- SCENARIO: When product prices change, record the old and new price
-- in a price_history table within the same transaction.
--
-- YOUR TASK: BEGIN; record old prices; UPDATE products; COMMIT;
--
-- EXPECTED OUTPUT: Transaction preserving price change history.
-- ==================================================



-- ==================================================
-- 07.21 - Isolation Levels Explained
-- ==================================================
-- SCENARIO: A revenue report runs while payments are being inserted.
-- Explain how READ COMMITTED vs REPEATABLE READ affects the result.
--
-- YOUR TASK: Write commented examples showing behavior differences
-- between isolation levels during concurrent operations.
--
-- EXPECTED OUTPUT: Commented demonstration of isolation level effects.
-- ==================================================



-- ==================================================
-- 07.22 - Advisory Lock for Billing Run
-- ==================================================
-- SCENARIO: The monthly billing job must not run twice simultaneously.
-- Use an advisory lock to prevent double-execution.
--
-- YOUR TASK: Document pg_advisory_lock pattern with comments explaining
-- how it prevents concurrent billing runs.
--
-- EXPECTED OUTPUT: Advisory lock pattern with documentation comments.
-- ==================================================



-- ==================================================
-- 07.23 - TRUNCATE vs DELETE
-- ==================================================
-- SCENARIO: After ETL finishes, clear the staging table. Should you
-- TRUNCATE or DELETE? Explain the tradeoffs.
--
-- YOUR TASK: Write TRUNCATE staging.raw_orders with comments explaining
-- when to use TRUNCATE vs DELETE (speed, transactions, triggers, MVCC).
--
-- EXPECTED OUTPUT: TRUNCATE statement with explanatory comments.
-- ==================================================



-- ==================================================
-- 07.24 - Status Update with CASE Logic
-- ==================================================
-- SCENARIO: Batch-update order statuses based on payment and shipment state:
-- if paid+shipped → delivered; if paid+not shipped → processing; etc.
--
-- YOUR TASK: UPDATE orders SET status = CASE WHEN ... END FROM ...
--
-- EXPECTED OUTPUT: CASE-based bulk update deriving status from related tables.
-- ==================================================



-- ==================================================
-- 07.25 - Idempotent Daily Load Script
-- ==================================================
-- SCENARIO: A daily ETL script runs at midnight. If it crashes and reruns,
-- it must not duplicate data. Design it to be safely re-runnable.
--
-- YOUR TASK: Write an idempotent load using DELETE+INSERT or
-- INSERT ON CONFLICT for a daily fact table.
--
-- EXPECTED OUTPUT: Re-runnable script that produces same result regardless of reruns.
-- ==================================================



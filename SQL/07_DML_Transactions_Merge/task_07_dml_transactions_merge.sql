SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 07: DML, TRANSACTIONS, AND MERGE
-- ============================================================================
-- You safely change data. The 10 challenges progress from basic INSERT to
-- expert writable CTEs and idempotent loads. Wrap risky work in transactions.
-- ============================================================================


-- ==================================================
-- 07.01 - Insert Customer, Return ID  [BASIC]
-- ==================================================
-- SCENARIO: Onboarding creates a customer and needs the new id.
--
-- YOUR TASK: INSERT a customer and RETURNING customer_id.
-- ==================================================



-- ==================================================
-- 07.02 - Bulk Insert Campaigns  [BASIC]
-- ==================================================
-- SCENARIO: Seed several marketing campaigns at once.
--
-- YOUR TASK: Bulk insert campaign rows from a VALUES list.
-- ==================================================



-- ==================================================
-- 07.03 - Upsert Customer by Email  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Import updates existing customers or inserts new ones.
--
-- YOUR TASK: INSERT ... ON CONFLICT (email) DO UPDATE.
-- ==================================================



-- ==================================================
-- 07.04 - Retry Failed Payments  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Reset failed payments to pending for non-cancelled orders.
--
-- YOUR TASK: UPDATE failed payments to 'pending' only when order not cancelled.
-- ==================================================



-- ==================================================
-- 07.05 - Mark Delivered (UPDATE FROM)  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Orders with a delivered shipment and successful payment are done.
--
-- YOUR TASK: UPDATE orders.status='delivered' using UPDATE ... FROM joins.
-- ==================================================



-- ==================================================
-- 07.06 - Risky Update with SAVEPOINT  [ADVANCED]
-- ==================================================
-- SCENARIO: Guard a risky status change inside a transaction.
--
-- YOUR TASK: BEGIN, SAVEPOINT, update, conditionally ROLLBACK TO savepoint.
-- ==================================================



-- ==================================================
-- 07.07 - Sync Prices with MERGE  [ADVANCED]
-- ==================================================
-- SCENARIO: A staging table holds new product prices.
--
-- YOUR TASK: Use MERGE to upsert staging prices into products.
-- ==================================================



-- ==================================================
-- 07.08 - Dedupe Staging (DELETE USING)  [ADVANCED]
-- ==================================================
-- SCENARIO: Staging has duplicate rows; keep the newest.
--
-- YOUR TASK: DELETE ... USING to remove duplicates, keeping newest per key.
-- ==================================================



-- ==================================================
-- 07.09 - Ticket + Event in One Writable CTE  [EXPERT]
-- ==================================================
-- SCENARIO: Create a ticket and its first event atomically.
--
-- YOUR TASK: Writable CTE: insert support_ticket, then insert ticket_event.
-- ==================================================



-- ==================================================
-- 07.10 - Idempotent Daily Load  [EXPERT]
-- ==================================================
-- SCENARIO: A daily job must be safe to rerun without duplicating facts.
--
-- YOUR TASK: Write an idempotent load (upsert/merge) for a daily fact insert.
-- ==================================================

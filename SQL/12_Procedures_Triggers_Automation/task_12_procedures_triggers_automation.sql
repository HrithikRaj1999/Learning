SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 12: PROCEDURES, TRIGGERS, AND AUTOMATION
-- ============================================================================
-- You automate logic inside the database. The 10 challenges progress from
-- simple functions to expert reusable audit triggers with a test pack.
-- ============================================================================


-- ==================================================
-- 12.01 - Order Net Total Function  [BASIC]
-- ==================================================
-- SCENARIO: Reuse net-total logic by order_id.
--
-- YOUR TASK: Create a SQL function returning an order's net total.
-- ==================================================



-- ==================================================
-- 12.02 - Lifetime Spend Function (PL/pgSQL)  [BASIC]
-- ==================================================
-- SCENARIO: Compute a customer's lifetime spend.
--
-- YOUR TASK: Write a PL/pgSQL function returning lifetime spend.
-- ==================================================



-- ==================================================
-- 12.03 - Status Change Audit Trigger  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Record every order status change.
--
-- YOUR TASK: Trigger that writes changes into order_status_audit.
-- ==================================================



-- ==================================================
-- 12.04 - updated_at on Price Change  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Track when prices change.
--
-- YOUR TASK: Trigger that sets products.updated_at when list_price changes.
-- ==================================================



-- ==================================================
-- 12.05 - Block Delivered -> Pending  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Delivered orders cannot revert.
--
-- YOUR TASK: Trigger preventing delivered orders from moving to pending.
-- ==================================================



-- ==================================================
-- 12.06 - Close Stale Tickets Procedure  [ADVANCED]
-- ==================================================
-- SCENARIO: Auto-close tickets older than N days.
--
-- YOUR TASK: Procedure closing stale pending tickets older than a parameter.
-- ==================================================



-- ==================================================
-- 12.07 - Auto-Close on Resolved Event  [ADVANCED]
-- ==================================================
-- SCENARIO: A 'resolved' event should close the ticket.
--
-- YOUR TASK: Trigger on ticket_events that closes the ticket when resolved.
-- ==================================================



-- ==================================================
-- 12.08 - Maintain Inventory Balance  [ADVANCED]
-- ==================================================
-- SCENARIO: Keep a running stock balance.
--
-- YOUR TASK: Trigger updating inventory balance after movement inserts.
-- ==================================================



-- ==================================================
-- 12.09 - Reusable Audit Function (TG_TABLE_NAME)  [EXPERT]
-- ==================================================
-- SCENARIO: One audit function for many tables.
--
-- YOUR TASK: Generic audit function using TG_TABLE_NAME, attached to 2 tables.
-- ==================================================



-- ==================================================
-- 12.10 - Trigger Test Pack  [EXPERT]
-- ==================================================
-- SCENARIO: Prove a trigger works.
--
-- YOUR TASK: SQL tests covering insert, update, and an invalid case.
-- ==================================================

SET search_path TO sql_mastery;

-- ============================================================================
-- TASK 11: VIEWS, SECURITY, AND ROW-LEVEL SECURITY
-- ============================================================================
-- You expose data safely. The 10 challenges progress from basic views to
-- expert RLS, least-privilege design, and a secure partner sharing layer.
-- ============================================================================


-- ==================================================
-- 11.01 - Reporting View, Hide Email  [BASIC]
-- ==================================================
-- SCENARIO: Analysts need order totals but not customer email.
--
-- YOUR TASK: Create a reporting view that exposes order totals, hides email.
-- ==================================================



-- ==================================================
-- 11.02 - Masked Customer View  [BASIC]
-- ==================================================
-- SCENARIO: Support sees only partial PII.
--
-- YOUR TASK: View showing only email domain and last four phone digits.
-- ==================================================



-- ==================================================
-- 11.03 - Daily Revenue Materialized View  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Dashboards need fast daily revenue.
--
-- YOUR TASK: Create a materialized view and its REFRESH command.
-- ==================================================



-- ==================================================
-- 11.04 - Grant SELECT to readonly_analyst  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Analysts read views only.
--
-- YOUR TASK: Create readonly_analyst and GRANT SELECT on reporting views.
-- ==================================================



-- ==================================================
-- 11.05 - Support Agent Role  [INTERMEDIATE]
-- ==================================================
-- SCENARIO: Agents may update only ticket status and assignee.
--
-- YOUR TASK: Create a role with column-limited UPDATE on support_tickets.
-- ==================================================



-- ==================================================
-- 11.06 - Enable RLS + Agent Policy  [ADVANCED]
-- ==================================================
-- SCENARIO: Agents see only their assigned tickets.
--
-- YOUR TASK: Enable RLS on support_tickets and add an assignee-scoped policy.
-- ==================================================



-- ==================================================
-- 11.07 - Sales Rep Order Policy  [ADVANCED]
-- ==================================================
-- SCENARIO: Reps see only their orders.
--
-- YOUR TASK: Write an RLS policy limiting orders to the rep's id.
-- ==================================================



-- ==================================================
-- 11.08 - Security Definer Function  [ADVANCED]
-- ==================================================
-- SCENARIO: Expose lifetime spend without table access.
--
-- YOUR TASK: Create a SECURITY DEFINER function returning customer spend.
-- ==================================================



-- ==================================================
-- 11.09 - Least-Privilege Matrix  [EXPERT]
-- ==================================================
-- SCENARIO: Define access for analyst, support_agent, sales_rep, admin.
--
-- YOUR TASK: Design and grant a least-privilege permission matrix.
-- ==================================================



-- ==================================================
-- 11.10 - Secure Partner Sharing Layer  [EXPERT]
-- ==================================================
-- SCENARIO: External partners need campaign-level metrics only.
--
-- YOUR TASK: Build a sharing layer exposing campaign metrics, no PII.
-- ==================================================

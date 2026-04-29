/*
==============================================================================
  TASK 11: Views, Security, and Row-Level Security
==============================================================================

LEVEL: Advanced
CONCEPTS: views, materialized views, roles, GRANT, REVOKE, row-level security, security definer, data masking, least privilege

HOW TO PRACTICE:
1. Run ../00_Setup/01_create_schema.sql
2. Run ../00_Setup/02_seed_data.sql
3. Write each answer under its prompt.
4. Keep every solution as one independent SQL statement unless a task asks for DDL or a transaction.

Target: 25 non-repeated exercises for this topic.
*/

SET search_path TO sql_mastery;

------------------------------------------------------------------------------
-- Challenge 11.01
-- Create a reporting view that exposes order totals but hides customer email.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.02
-- Create a customer_support view that shows customer contact fields and open ticket details.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.03
-- Create a materialized view for daily revenue and write a refresh command.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.04
-- Grant SELECT on reporting views to a readonly_analyst role.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.05
-- Revoke direct table access from readonly_analyst while keeping view access.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.06
-- Create a masked customer view that shows only email domain and last four phone digits.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.07
-- Create a role for support agents that can update only support_tickets status and assigned_to.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.08
-- Enable row-level security on support_tickets.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.09
-- Write an RLS policy so support agents can see only tickets assigned to their employee mapping.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.10
-- Write an RLS policy so sales reps can see only orders assigned to them.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.11
-- Create an admin role that bypasses normal reporting limitations using explicit grants.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.12
-- Create a security definer function that safely returns customer lifetime spend.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.13
-- Explain in comments why search_path matters for security definer functions.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.14
-- Create a view with WITH CHECK OPTION for editable active subscriptions.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.15
-- Create a policy that prevents updates to closed tickets except for admin role.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.16
-- Audit privileges for a table using information_schema query comments.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.17
-- Create a public-safe campaign performance view with no customer-level identifiers.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.18
-- Create a data export view that excludes PII and sensitive ticket notes.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.19
-- Design a least-privilege permission matrix for analyst, support_agent, sales_rep, and admin.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.20
-- Write a transaction that creates a role, grants usage on schema, grants view access, and tests access.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.21
-- Create a materialized view index for fast dashboard reads.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.22
-- Create a view that normalizes order statuses into business-friendly labels.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.23
-- Use column-level privileges to allow reading customers.city but not customers.email.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.24
-- Write a query to find tables in sql_mastery with no explicit privileges granted.
-- Write your solution below.


------------------------------------------------------------------------------
-- Challenge 11.25
-- Design a secure sharing layer for external partners who need campaign-level metrics only.
-- Write your solution below.

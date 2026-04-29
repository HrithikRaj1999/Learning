# Task 11: Views, Security, and Row-Level Security

Level: Advanced

## Concepts

- views
- materialized views
- roles
- GRANT
- REVOKE
- row-level security
- security definer
- data masking
- least privilege

## Exercises

| # | Prompt |
|---|--------|
| 11.01 | Create a reporting view that exposes order totals but hides customer email. |
| 11.02 | Create a customer_support view that shows customer contact fields and open ticket details. |
| 11.03 | Create a materialized view for daily revenue and write a refresh command. |
| 11.04 | Grant SELECT on reporting views to a readonly_analyst role. |
| 11.05 | Revoke direct table access from readonly_analyst while keeping view access. |
| 11.06 | Create a masked customer view that shows only email domain and last four phone digits. |
| 11.07 | Create a role for support agents that can update only support_tickets status and assigned_to. |
| 11.08 | Enable row-level security on support_tickets. |
| 11.09 | Write an RLS policy so support agents can see only tickets assigned to their employee mapping. |
| 11.10 | Write an RLS policy so sales reps can see only orders assigned to them. |
| 11.11 | Create an admin role that bypasses normal reporting limitations using explicit grants. |
| 11.12 | Create a security definer function that safely returns customer lifetime spend. |
| 11.13 | Explain in comments why search_path matters for security definer functions. |
| 11.14 | Create a view with WITH CHECK OPTION for editable active subscriptions. |
| 11.15 | Create a policy that prevents updates to closed tickets except for admin role. |
| 11.16 | Audit privileges for a table using information_schema query comments. |
| 11.17 | Create a public-safe campaign performance view with no customer-level identifiers. |
| 11.18 | Create a data export view that excludes PII and sensitive ticket notes. |
| 11.19 | Design a least-privilege permission matrix for analyst, support_agent, sales_rep, and admin. |
| 11.20 | Write a transaction that creates a role, grants usage on schema, grants view access, and tests access. |
| 11.21 | Create a materialized view index for fast dashboard reads. |
| 11.22 | Create a view that normalizes order statuses into business-friendly labels. |
| 11.23 | Use column-level privileges to allow reading customers.city but not customers.email. |
| 11.24 | Write a query to find tables in sql_mastery with no explicit privileges granted. |
| 11.25 | Design a secure sharing layer for external partners who need campaign-level metrics only. |

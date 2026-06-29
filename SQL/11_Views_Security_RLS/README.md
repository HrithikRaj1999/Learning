# Task 11: Views, Security, and Row-Level Security

Level: Basic → Expert

## Concepts

- views, materialized views, data masking
- roles, GRANT/REVOKE, column privileges
- row-level security, security definer
- least privilege, secure sharing

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 11.01 | Reporting view exposing order totals but hiding customer email. |
| 11.02 | Masked customer view: email domain and last four phone digits only. |
| 11.03 | Daily revenue materialized view with a refresh command. |
| 11.04 | Grant SELECT on reporting views to a readonly_analyst role. |
| 11.05 | Support role that updates only ticket status and assignee. |
| 11.06 | Enable RLS on support_tickets; agents see only their tickets. |
| 11.07 | RLS policy so sales reps see only their orders. |
| 11.08 | Security definer function returning customer lifetime spend. |
| 11.09 | Least-privilege matrix for analyst, support_agent, sales_rep, admin. |
| 11.10 | Secure partner sharing layer with campaign metrics only. |

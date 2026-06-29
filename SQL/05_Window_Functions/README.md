# Task 05: Window Functions

Level: Basic → Expert

## Concepts

- ROW_NUMBER, RANK, DENSE_RANK, NTILE
- LEAD/LAG, running totals, moving averages
- window frames, partition shares
- gaps and islands, sessionization

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 05.01 | Return the first order per customer using ROW_NUMBER. |
| 05.02 | Rank customers by lifetime net revenue using RANK and DENSE_RANK. |
| 05.03 | Use LAG to show previous order date and days between orders. |
| 05.04 | Running total of daily successful payment amount. |
| 05.05 | Divide customers into revenue quartiles using NTILE. |
| 05.06 | Return the top three products by quantity per category. |
| 05.07 | 7-day moving average of daily web event count. |
| 05.08 | Each order's percentage of monthly revenue via SUM over partition. |
| 05.09 | Group consecutive daily activity into islands per customer. |
| 05.10 | Sessionize web events; new session after 30 minutes of inactivity. |

# Task 07: DML, Transactions, and MERGE

Level: Basic → Expert

## Concepts

- INSERT/UPDATE/DELETE, RETURNING
- UPSERT, MERGE
- transactions, savepoints
- writable CTEs, idempotency

## Exercises (basic → advanced → expert)

| # | Prompt |
|---|--------|
| 07.01 | Insert a customer and return the generated customer_id. |
| 07.02 | Bulk insert campaign rows from a VALUES clause. |
| 07.03 | Upsert a customer by email with ON CONFLICT. |
| 07.04 | Reset failed payments to pending for non-cancelled orders. |
| 07.05 | Mark orders delivered using UPDATE ... FROM joins. |
| 07.06 | Guard a risky status update with SAVEPOINT and rollback. |
| 07.07 | Sync a staging price table into products using MERGE. |
| 07.08 | Remove duplicate staging rows with DELETE ... USING, keep newest. |
| 07.09 | Insert a ticket and its first event in one writable CTE. |
| 07.10 | Write an idempotent daily load that can rerun without duplicates. |

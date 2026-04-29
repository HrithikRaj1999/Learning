# SQL Interview and Production Readiness Rubric

## 6/10: Solid Intermediate

- Writes correct SELECT, JOIN, GROUP BY, HAVING, and CASE queries.
- Understands INNER versus LEFT joins.
- Handles NULL intentionally.
- Can use simple CTEs and subqueries.

## 8/10: Advanced Working Level

- Uses window functions for ranking, running totals, retention, and deduplication.
- Designs normalized tables with constraints and indexes.
- Reads basic EXPLAIN plans and identifies obvious bottlenecks.
- Writes safe DML with transactions and RETURNING.
- Builds analytics queries without accidental double counting.

## 10/10: Production Ready

- Designs schemas, marts, migrations, views, and permission layers.
- Tunes queries with evidence from EXPLAIN ANALYZE.
- Uses PostgreSQL features such as JSONB, ranges, GIN, materialized views, functions, and RLS.
- Creates repeatable data quality checks and audit trails.
- Can explain tradeoffs in indexing, transaction isolation, denormalization, partitioning, and security.

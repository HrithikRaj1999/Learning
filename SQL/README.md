# SQL Intermediate to Advanced Mastery

This track is built for an intermediate SQL learner who wants to become advanced through deliberate practice.

The curriculum is PostgreSQL-first because advanced SQL work depends on realistic features such as window functions, JSONB, CTEs, indexing, transactions, row-level security, functions, and query planning. Most querying exercises still transfer cleanly to other SQL databases.

## Docker-First Setup

From `C:\Learning`:

```powershell
SQL/scripts/start_sql.ps1
```

This starts PostgreSQL in Docker and automatically loads the practice schema and seed data on first run.

Connection details:

- Host: `localhost`
- Port: `5433`
- Database: `sql_mastery_lab`
- User: `learner`
- Password: `learner_pass`
- Practice schema: `sql_mastery`

Useful commands:

```powershell
SQL/scripts/psql.ps1
SQL/scripts/reset_sql.ps1
SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql
SQL/scripts/stop_sql.ps1
```

## How to Use the Tasks

1. Start Docker PostgreSQL with `SQL/scripts/start_sql.ps1`.
2. Read [SCENARIO_GUIDE.md](./SCENARIO_GUIDE.md) for the real-life scenario, what can go wrong, expected output, and how to test each exercise.
3. Open a task file and write answers below each prompt.
4. Run queries interactively with `SQL/scripts/psql.ps1`.
5. Reset the database anytime with `SQL/scripts/reset_sql.ps1`.
6. Keep your own answers under each prompt or in `solutions/`.

## Modules

| # | Folder | Topic | Level | Exercises |
|---|--------|-------|-------|-----------|
| 01 | `01_Querying_Filtering_Sorting` | Querying, Filtering, and Sorting | Basic → Advanced | 10 |
| 02 | `02_Joins_Relationships` | Joins and Relationships | Basic → Expert | 10 |
| 03 | `03_Aggregation_Grouping` | Aggregation and Grouping | Basic → Expert | 10 |
| 04 | `04_Subqueries_CTEs` | Subqueries and CTEs | Basic → Expert | 10 |
| 05 | `05_Window_Functions` | Window Functions | Basic → Expert | 10 |
| 06 | `06_Data_Modeling_DDL` | Data Modeling and DDL | Basic → Expert | 10 |
| 07 | `07_DML_Transactions_Merge` | DML, Transactions, and MERGE | Basic → Expert | 10 |
| 08 | `08_Indexes_Performance` | Indexes and Query Performance | Basic → Expert | 10 |
| 09 | `09_PostgreSQL_Advanced_Types` | PostgreSQL Advanced Types and Functions | Basic → Expert | 10 |
| 10 | `10_Analytics_Reporting_Cohorts` | Analytics, Reporting, and Cohorts | Basic → Expert | 10 |
| 11 | `11_Views_Security_RLS` | Views, Security, and Row-Level Security | Basic → Expert | 10 |
| 12 | `12_Procedures_Triggers_Automation` | Procedures, Triggers, and Automation | Basic → Expert | 10 |
| 13 | `13_Data_Quality_Testing_Auditing` | Data Quality, Testing, and Auditing | Basic → Expert | 10 |
| 14 | `14_Capstone_Projects` | Capstone Projects | Expert | 10 |

Total exercises: 140

## Progress Standard

You are ready to call a module complete when you can:

- solve at least 80 percent of the exercises without looking up syntax;
- explain why your query returns the correct grain and does not duplicate rows;
- rewrite at least three solutions using a different approach;
- read `EXPLAIN` output for performance-heavy tasks;
- describe edge cases around NULLs, duplicate rows, missing relationships, and time ranges.

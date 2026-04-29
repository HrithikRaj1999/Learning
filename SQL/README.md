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
2. Open a task file and write answers below each prompt.
3. Run queries interactively with `SQL/scripts/psql.ps1`.
4. Reset the database anytime with `SQL/scripts/reset_sql.ps1`.
5. Keep your own answers under each prompt or in `solutions/`.

## Modules

| # | Folder | Topic | Level | Exercises |
|---|--------|-------|-------|-----------|
| 01 | `01_Querying_Filtering_Sorting` | Querying, Filtering, and Sorting | Intermediate | 25 |
| 02 | `02_Joins_Relationships` | Joins and Relationships | Intermediate-Advanced | 25 |
| 03 | `03_Aggregation_Grouping` | Aggregation and Grouping | Intermediate-Advanced | 25 |
| 04 | `04_Subqueries_CTEs` | Subqueries and CTEs | Intermediate-Advanced | 25 |
| 05 | `05_Window_Functions` | Window Functions | Advanced | 25 |
| 06 | `06_Data_Modeling_DDL` | Data Modeling and DDL | Advanced | 25 |
| 07 | `07_DML_Transactions_Merge` | DML, Transactions, and MERGE | Advanced | 25 |
| 08 | `08_Indexes_Performance` | Indexes and Query Performance | Advanced | 25 |
| 09 | `09_PostgreSQL_Advanced_Types` | PostgreSQL Advanced Types and Functions | Advanced | 25 |
| 10 | `10_Analytics_Reporting_Cohorts` | Analytics, Reporting, and Cohorts | Advanced | 25 |
| 11 | `11_Views_Security_RLS` | Views, Security, and Row-Level Security | Advanced | 25 |
| 12 | `12_Procedures_Triggers_Automation` | Procedures, Triggers, and Automation | Advanced | 25 |
| 13 | `13_Data_Quality_Testing_Auditing` | Data Quality, Testing, and Auditing | Advanced | 25 |
| 14 | `14_Capstone_Projects` | Capstone Projects | Expert | 25 |

Total exercises: 350

## Progress Standard

You are ready to call a module complete when you can:

- solve at least 80 percent of the exercises without looking up syntax;
- explain why your query returns the correct grain and does not duplicate rows;
- rewrite at least three solutions using a different approach;
- read `EXPLAIN` output for performance-heavy tasks;
- describe edge cases around NULLs, duplicate rows, missing relationships, and time ranges.

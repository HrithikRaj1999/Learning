# SQL Setup

These files create a PostgreSQL practice schema named `sql_mastery`.

The recommended workflow is Docker. From `C:\Learning`:

```powershell
SQL/scripts/start_sql.ps1
```

## Connection

- Host: `localhost`
- Port: `5433`
- Database: `sql_mastery_lab`
- User: `learner`
- Password: `learner_pass`
- Schema: `sql_mastery`

## Common Commands

```powershell
SQL/scripts/start_sql.ps1
SQL/scripts/psql.ps1
SQL/scripts/reset_sql.ps1
SQL/scripts/run_task_file.ps1 SQL/01_Querying_Filtering_Sorting/task_01_querying_filtering_sorting.sql
SQL/scripts/stop_sql.ps1
```

## Manual psql Alternative

If you already have PostgreSQL installed locally, you can still run:

```powershell
psql -d sql_mastery_lab -f SQL/00_Setup/01_create_schema.sql
psql -d sql_mastery_lab -f SQL/00_Setup/02_seed_data.sql
```

The schema script drops and recreates only the `sql_mastery` schema, not the whole database.

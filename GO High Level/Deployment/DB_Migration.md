# DB migration: full load + CDC, and schema expand-contract

## Flow 1. Move on-prem MySQL (500 GB) to RDS Aurora (AWS DMS, Database Migration Service)

### Big flow (all steps together)

The bottom line is the cutover (step 4): the app stops using MySQL and talks to Aurora directly. Scroll sideways.

```text
┌── STEP 1, 2, 4 ────────────────────────────────────┐            ┌── STEP 1, 2, 5 ────────────────────────────────────┐            ┌── STEP 1, 2, 3, 4 ─────────────────────────────────┐            ┌── STEP 1, 2, 3, 4 ─────────────────────────────────┐
│ App servers  (Node.js)                             │            │ On-prem MySQL  (old DB, 500 GB)                    │            │ AWS DMS  (Database Migration Service)              │            │ RDS Aurora  (new DB)                               │
├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤
│ STEP 1, 2: Keep writing to old MySQL               │ ────────>  │ STEP 1: Source of the full load                    │ ────────>  │ STEP 1: Full load                                  │ ────────>  │ STEP 1, 2: Receives the copy + live changes        │
│   - shoppers notice nothing                        │            │   - DMS reads every table                          │            │   - copies table by table, in chunks               │            │   - tables + indexes created first                 │
│   - e.g. order o-301 INSERTed mid-copy             │            │                                                    │            │   - notes the binlog position at the start         │            │                                                    │
│                                                    │            │ STEP 2: Binlog records every new change            │            │                                                    │            │ STEP 3: Compared with MySQL                        │
│ STEP 4: Cutover                                    │            │   - binlog = MySQL's diary of all writes           │            │ STEP 2: CDC (Change Data Capture)                  │            │   - mismatch -> fix, run check again               │
│   - maintenance mode: stop writes ≈ 1 min          │            │   - needs binlog_format = ROW                      │            │   - reads the binlog from that position            │            │                                                    │
│   - wait until DMS lag is 0                        │            │   - e.g. INSERT o-301 lands in the binlog          │            │   - replays each change on Aurora                  │            │ STEP 4: Becomes the main DB                        │
│   - change DB URL to Aurora, restart               │            │                                                    │            │   - e.g. o-301 shows up in Aurora seconds later    │            │   - app now reads + writes here                    │
│   - e.g. order o-302 goes to Aurora                │            │ STEP 5: Kept read-only as a backup                 │            │                                                    │            │   - e.g. o-302 written straight here               │
└──────────────────────────┬─────────────────────────┘            │   - SET GLOBAL read_only = ON                      │            │ STEP 3: Checks both sides match                    │            └──────────────────────────┬─────────────────────────┘
                           │                                      │   - a few days, then switched off                  │            │   - row counts + checksums per table               │                                       ^
                           │                                      └────────────────────────────────────────────────────┘            │   - e.g. orders: same count on both                │                                       │
                           │                                                                                                        │                                                    │                                       │
                           │                                                                                                        │ STEP 4: Reports lag = 0, safe to switch            │                                       │
                           │                                                                                                        └────────────────────────────────────────────────────┘                                       │
                           │                                                                                                                                                                                                     │
                           │                                                                                                                                                                                                     │
                           │                                                                                                                                                                                                     │
                           └───────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>───────────────────────────────────────>─────────────────┘
```

### Quick view

```text
┌── STEP 1 ──────────────────────┐     ┌── STEP 1, 2 ───────────────────┐     ┌── STEP 2, 3 ───────────────────┐     ┌── STEP 4, 5 ───────────────────┐     ┌── STEP 5 ──────────────────────┐
│ On-prem MySQL  (500 GB)        │     │ AWS DMS                        │     │ RDS Aurora  (new DB)           │     │ Cutover                        │     │ Old MySQL  (read-only)         │
├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤
│ app still writes here          │ ──> │ Database Migration Service     │ ──> │ receives copy + live writes    │ ──> │ - stop writes ≈ 1 minute       │ ──> │ kept a few days                │
│ - DMS reads all tables         │     │ - 1) full load: copy all       │     │ - check row counts             │     │ - wait: lag = 0                │     │ - backup if Aurora fails       │
│ - DMS reads the binlog         │     │ - 2) CDC: copy new writes      │     │ - check checksums              │     │ - app DB URL -> Aurora         │     │ - then switch off              │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

**Steps**

1. **Full load:** DMS copies all the tables. The app keeps writing to the old DB.

2. **CDC (Change Data Capture):** DMS reads the MySQL binlog and copies new writes to Aurora as they happen.

3. **Check:** compare row counts and checksums on both DBs.

4. **Cutover:** stop app writes for about 1 minute, wait until replication lag is 0, then point the app's DB URL to Aurora.

5. **Keep a backup:** keep the old DB read-only for a few days, then switch it off.

**Why it is safe:** CDC keeps Aurora up to date while the app is still live, so the only stop is the short wait at cutover.

## Flow 2. Rename a column with no downtime (expand-contract)

### Big flow (all steps together)

The app (from the left) and the migration runner (from the right) both change the same `users` table, one safe step at a time.

```text
┌── STEP 2, 3, 4 ────────────────────────────────────┐            ┌── STEP 2, 3, 4 ────────────────────────────────────┐            ┌── STEP 1, 2, 4 ────────────────────────────────────┐            ┌── STEP 1, 2, 4 ────────────────────────────────────┐
│ Deploy pipeline  (CI/CD)                           │            │ App servers                                        │            │ users table  (MySQL / Aurora)                      │            │ Migration runner  (e.g. Flyway)                    │
├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤            ├────────────────────────────────────────────────────┤
│ STEP 2: Ships app v2                               │ ────────>  │ STEP 2: Dual write                                 │ ────────>  │ STEP 1: Gets an empty new column                   │ <────────  │ STEP 1: Expand                                     │
│   - writes name AND full_name                      │            │   - e.g. new user u-77 gets both columns           │            │   - e.g. u-42 {name: Rahul, full_name: NULL}       │            │   - ADD COLUMN full_name (fast, no lock)           │
│                                                    │            │                                                    │            │                                                    │            │                                                    │
│ STEP 3: Ships app v3                               │            │ STEP 3: Read full_name                             │            │ STEP 2: Both columns filled                        │            │ STEP 2: Backfill old rows                          │
│   - reads full_name only, still writes both        │            │   - e.g. profile page shows full_name              │            │   - e.g. u-42 {name: Rahul, full_name: Rahul}      │            │   - UPDATE ... WHERE full_name IS NULL             │
│                                                    │            │                                                    │            │                                                    │            │   - in small batches, so no long locks             │
│ STEP 4: Ships app v4                               │            │ STEP 4: Forget the old column                      │            │ STEP 4: Old column removed                         │            │                                                    │
│   - stops writing name                             │            │   - no code mentions name any more                 │            │   - e.g. u-42 {full_name: Rahul}                   │            │ STEP 4: Contract                                   │
│   - bad deploy? roll back to the last one          │            └────────────────────────────────────────────────────┘            └────────────────────────────────────────────────────┘            │   - DROP COLUMN name                               │
└────────────────────────────────────────────────────┘                                                                                                                                                │   - the one step you cannot undo                   │
                                                                                                                                                                                                      └────────────────────────────────────────────────────┘
```

### Quick view

```text
┌── STEP 1 ──────────────────────┐     ┌── STEP 2 ──────────────────────┐     ┌── STEP 3 ──────────────────────┐     ┌── STEP 4 ──────────────────────┐
│ Expand                         │     │ Dual write + backfill          │     │ Switch reads                   │     │ Contract                       │
├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤     ├────────────────────────────────┤
│ ADD COLUMN full_name           │ ──> │ app writes name + full_name    │ ──> │ deploy: read full_name only    │ ──> │ DROP COLUMN name               │
│ - old app still works          │     │ - UPDATE old rows              │     │ - name still filled            │     │ - only when no code uses it    │
│ - rollback: drop new col       │     │ - full_name = name             │     │ - rollback: old deploy         │     │ - last step, no way back       │
└────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘     └────────────────────────────────┘
```

```sql
-- 1. Expand
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
-- 2. App writes to both columns, then backfill old rows
UPDATE users SET full_name = name WHERE full_name IS NULL;
-- 3. App reads only full_name (deploy)
-- 4. Contract
ALTER TABLE users DROP COLUMN name;
```

**Why it is safe:** old code and new code both work until step 4, so you can roll back at every step before the final drop.

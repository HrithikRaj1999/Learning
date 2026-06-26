# Builder — SQL Query Problem — Fix Hints
> Build queries safely and readably step by step.
## Wrong now
String concatenation builds the query; the `where` clause interpolates raw input
→ SQL injection. Clause order is implicit and fragile.
## Hints
- [ ] `QueryBuilder`: `.select(cols)`, `.from(table)`, `.where(col, op, value)`,
      `.orderBy()`, `.limit()` — chainable, returns `this`.
- [ ] Collect values as PARAMETERS; `.build()` emits parameterized SQL + a values
      array (never interpolate user input). This kills injection.
- [ ] `.build()` validates required parts (must have from()).
## Done-when (security)
- [ ] Output is parameterized; no user value is concatenated into SQL text.

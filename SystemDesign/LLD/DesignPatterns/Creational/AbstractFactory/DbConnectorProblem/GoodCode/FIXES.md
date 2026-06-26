# Abstract Factory — DB Connector Problem — Fix Hints
> A driver must produce a CONSISTENT family (conn + command + tx).
## Wrong now
`setup` hand-picks connection + command separately and literally mixes MySQL with
Postgres — a runtime-only failure the compiler can't catch.
## Hints
- [ ] Product interfaces: `Connection`, `Command`.
- [ ] `DbFactory` interface: `createConnection()`, `createCommand()`.
- [ ] `MySqlFactory`/`PostgresFactory` return only their own family.
- [ ] Code gets ONE factory and asks for both → mixing is impossible.
## Done-when
- [ ] You cannot construct a cross-vendor pair.

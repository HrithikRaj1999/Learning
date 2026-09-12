// =============================================================================
// WHAT IS WRONG — missing Singleton pattern
// =============================================================================
// PATTERN IDEA: one shared instance for a scarce resource. A DB connection pool
// must be a single shared pool for the whole process.
//
// WHAT'S WRONG HERE: each service does `new ConnectionPool()`, and each pool opens
// its own connections. Three services = three pools = 30 connections instead of 10.
//
// REAL SCENARIO: a genuine production outage — every service spinning up its own
// pool multiplies open connections until the database hits max_connections and
// starts refusing new ones. The whole app goes down because connections weren't
// shared.
//
// WHY BAD: a scarce shared resource is duplicated per caller; connection count
// explodes; the DB connection limit is exhausted.
//
// HOW TO FIX (no code): expose ONE shared pool (getInstance() returning the same
// ConnectionPool, or a single injected pool). All services borrow connections from
// the same pool, capped at its size. (Inject the shared pool so tests can
// substitute a fake.)
// =============================================================================
// ❌ NO SINGLETON — every caller creates its own connection pool. Real prod bug:
// connections multiply and exhaust the DB's max_connections limit.
export class ConnectionPool {
  private static count = 0;
  constructor(public size: number = 10) {
    ConnectionPool.count += size;
    console.log("Opened " + size + " connections. Total open: " + ConnectionPool.count);
  }
  query(sql: string) { return "rows for " + sql; }
}
// Three services each spin up a pool -> 30 connections instead of 10
const userSvc = new ConnectionPool();
const orderSvc = new ConnectionPool();
const reportSvc = new ConnectionPool(); // DB hits connection limit -> outage

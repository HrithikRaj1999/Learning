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

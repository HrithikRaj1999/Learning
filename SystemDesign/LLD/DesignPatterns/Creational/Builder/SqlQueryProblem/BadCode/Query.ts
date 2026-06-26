// ❌ NO BUILDER — query assembled by raw string concatenation. Unreadable,
// order-dependent, and a SQL-injection hazard.
export function buildQuery(table: string, where?: string, order?: string, limit?: number): string {
  let q = "SELECT * FROM " + table;          // no column control
  if (where) q += " WHERE " + where;          // 🐛 raw user string -> SQL injection
  if (order) q += " ORDER BY " + order;
  if (limit) q += " LIMIT " + limit;
  return q;
}
console.log(buildQuery("users", "name = '" + "x' OR '1'='1" + "'")); // injection

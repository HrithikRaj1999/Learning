// =============================================================================
// WHAT IS WRONG — missing Builder pattern (+ SQL injection)
// =============================================================================
// PATTERN IDEA: a query Builder assembles a statement through structured,
// validated steps (select/where/order/limit) and parameterizes values — instead
// of raw string concatenation.
//
// WHAT'S WRONG HERE: buildQuery() concatenates the SQL by hand, splicing a raw
// `where` string straight in. The demo shows the classic `' OR '1'='1` injection.
//
// REAL SCENARIO: SECURITY BUG — any user-controlled filter becomes SQL injection,
// letting an attacker dump or destroy the table. The hand-built string is also
// order-dependent and easy to malform (missing spaces, wrong clause order).
//
// WHY BAD: unsanitized concatenation is a critical injection vulnerability; the
// builder logic is fragile and unreadable; no validation.
//
// HOW TO FIX (no code): a QueryBuilder with select()/where(column, value)/
// orderBy()/limit() that emits a parameterized query (placeholders + bound values),
// never interpolating user input. Values are passed to the driver separately, so
// injection is impossible. The builder also enforces clause ordering.
// =============================================================================
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

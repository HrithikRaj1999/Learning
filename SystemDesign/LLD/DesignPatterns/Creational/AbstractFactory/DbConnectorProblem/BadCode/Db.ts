// ❌ NO ABSTRACT FACTORY — connection + command + transaction created ad hoc.
// Real bug: you can pair a MySQL connection with a Postgres command object.
class MySqlConnection { open() { return "mysql open"; } }
class MySqlCommand { exec(c: unknown) { return "mysql exec"; } }
class PgConnection { open() { return "pg open"; } }
class PgCommand { exec(c: unknown) { return "pg exec"; } }

export function setup(db: string) {
  if (db === "mysql") {
    const conn = new MySqlConnection();
    const cmd = new PgCommand(); // 🐛 mismatched family! compiles, breaks at runtime
    return { conn: conn.open(), cmd: cmd.exec(conn) };
  }
  const conn = new PgConnection();
  const cmd = new MySqlCommand(); // 🐛 mismatched again
  return { conn: conn.open(), cmd: cmd.exec(conn) };
}
console.log(setup("mysql"));
